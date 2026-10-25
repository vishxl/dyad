import "../legacy_env_bootstrap";
import fs from "node:fs";
import http from "node:http";
import type { IncomingHttpHeaders } from "node:http";
import path from "node:path";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";

// Load the repo .env before anything reads observability/provider env vars.
dotenv.config();

process.env.NODE_ENV ??= "development";
process.env.NEXTBILLION_HEADLESS_HTTP = "1";
// node-pty is a native module built for Electron's ABI and cannot load under
// the plain Node runtime here; the shim's spawn is inert, which made every
// pty-based command (runCommand, e.g. the managed pnpm install) hang until its
// timeout. NEXTBILLION_DISABLE_PTY=1 routes pty_command_runner through a real
// child_process with the same result contract.
process.env.NEXTBILLION_DISABLE_PTY ??= "1";

import { ensureRuntimeGitEnvironment } from "../main/git_path";

const runtimeBinDir = path.dirname(process.execPath);
const currentPath = process.env.PATH ?? "";
process.env.PATH = [
  runtimeBinDir,
  ...currentPath.split(path.delimiter).filter(Boolean),
].join(path.delimiter);

applyManagedNodeToProcessPath();
ensureRuntimeGitEnvironment({
  appPath: process.cwd(),
  resourcesPath: process.resourcesPath,
});

const dataDir =
  process.env.NEXTBILLION_DATA_DIR?.trim() ||
  process.env.NEXTBILLION_DEV_USER_DATA_DIR?.trim() ||
  path.resolve(process.cwd(), "userData");

process.env.NEXTBILLION_DEV_USER_DATA_DIR = path.resolve(dataDir);
fs.mkdirSync(process.env.NEXTBILLION_DEV_USER_DATA_DIR, { recursive: true });

import { initializeDatabase } from "../db";
import { runLegacyAppFolderMigration } from "../legacy_app_folder_runner";
import { registerIpcHandlers } from "../ipc/ipc_host";
import { encodeIpcDates } from "../ipc/contracts/core";
// Import the shim module directly: type-checking resolves "electron" to the
// real Electron types (which lack getHandler), while the esbuild alias makes
// both specifiers resolve to the same shim instance in the bundle.
import { ipcMain } from "./electron-shim";
import { applyManagedNodeToProcessPath } from "../ipc/utils/managed_node";
import { configureTrustedRenderer } from "../ipc/utils/renderer_security";
import { getAllowedRpcOrigins, isRpcRequestAllowed } from "./rpc_access";
import { shutdownObservability } from "../observability/langfuse";

const allowedRpcOrigins = getAllowedRpcOrigins();
const expectedRpcToken = process.env.NEXTBILLION_RPC_TOKEN?.trim() || undefined;

function checkRpcAccess(
  origin: string | undefined,
  presentedToken: string | undefined,
): boolean {
  return isRpcRequestAllowed({
    origin,
    presentedToken,
    expectedToken: expectedRpcToken,
    allowedOrigins: allowedRpcOrigins,
  });
}

function presentedTokenFrom(
  headers: IncomingHttpHeaders,
  url: URL,
): string | undefined {
  // The pre-rebrand header is still accepted so bundles cached by open browser tabs keep working.
  const headerToken =
    headers["x-nextbillion-rpc-token"] ?? headers["x-dyad-rpc-token"];
  const normalized = Array.isArray(headerToken) ? headerToken[0] : headerToken;
  return normalized ?? url.searchParams.get("token") ?? undefined;
}

const trustedRendererFrame = {
  url: "file:///headless/index.html",
  processId: process.pid,
  routingId: 1,
  parent: null,
};

const browserClients = new Set<WebSocket>();

function broadcastToBrowserClients(channel: string, payload: unknown) {
  if (channel !== "chat:response:chunk") {
    console.log(`[headless-broadcast] ${channel}`);
  }
  const envelope = JSON.stringify({
    channel,
    payload: encodeIpcDates(payload),
  });
  for (const socket of browserClients) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(envelope);
    }
  }
}

// Preserve browser-mode UI compatibility by exposing the same event framing as
// Electron would. The desktop app sends event payloads directly on the channel;
// the browser bridge unwraps the JSON object into { channel, payload }.

const virtualWindow = {
  id: 1,
  isDestroyed: () => false,
  focus: () => undefined,
  show: () => undefined,
  hide: () => undefined,
  close: () => undefined,
  destroy: () => undefined,
  webContents: {
    id: 1,
    send: (channel: string, ...args: unknown[]) => {
      broadcastToBrowserClients(channel, args.length <= 1 ? args[0] : args);
    },
    once: () => undefined,
    removeListener: () => undefined,
    addListener: () => undefined,
    on: () => undefined,
    isDestroyed: () => false,
  },
};

const fakeEvent = {
  sender: {
    id: 0,
    once: () => undefined,
    removeListener: () => undefined,
    send: (channel: string, ...args: unknown[]) => {
      broadcastToBrowserClients(channel, args.length <= 1 ? args[0] : args);
    },
    isDestroyed: () => false,
    mainFrame: trustedRendererFrame,
    webContents: virtualWindow.webContents,
  },
  senderFrame: trustedRendererFrame,
};

configureTrustedRenderer({
  packagedRendererUrl: "file:///headless/index.html",
});
initializeDatabase();
runLegacyAppFolderMigration((msg) => console.log(`[legacy-migration] ${msg}`));
registerIpcHandlers();

async function readJsonBody(request: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return undefined;
  }

  const body = Buffer.concat(chunks).toString("utf8");
  if (!body.trim()) {
    return undefined;
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");

  if (request.method !== "POST" || !url.pathname.startsWith("/rpc/")) {
    response.statusCode = 404;
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({
        ok: false,
        error: { message: "Only POST /rpc/<channel> is supported." },
      }),
    );
    return;
  }

  const channel = decodeURIComponent(url.pathname.slice("/rpc/".length));

  if (
    !checkRpcAccess(
      request.headers.origin,
      presentedTokenFrom(request.headers, url),
    )
  ) {
    response.statusCode = 403;
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({
        __nextBillionIpcEnvelope: "nextbillion-ipc-envelope-v1",
        ok: false,
        error: { message: "Forbidden." },
      }),
    );
    return;
  }

  try {
    const input = await readJsonBody(request);
    const handler = ipcMain.getHandler(channel);
    if (!handler) {
      response.statusCode = 404;
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({
          __nextBillionIpcEnvelope: "nextbillion-ipc-envelope-v1",
          ok: false,
          error: { message: `No handler registered for channel "${channel}".` },
        }),
      );
      return;
    }

    const result = await handler(fakeEvent as any, input as any);

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(encodeIpcDates(result)));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.statusCode = 500;
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({
        __nextBillionIpcEnvelope: "nextbillion-ipc-envelope-v1",
        ok: false,
        error: { message },
      }),
    );
  }
});

const websocketServer = new WebSocketServer({ noServer: true });

// Manual upgrade handling so the same origin/token gate applies to the
// WebSocket channel; ws's built-in { server, path } wiring would accept any
// origin. Vite's /ws proxy forwards the browser's original headers.
server.on("upgrade", (request, socket, head) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const reject = () => {
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
  };
  if (url.pathname !== "/ws") {
    reject();
    return;
  }
  if (
    !checkRpcAccess(
      request.headers.origin,
      presentedTokenFrom(request.headers, url),
    )
  ) {
    reject();
    return;
  }
  websocketServer.handleUpgrade(request, socket, head, (ws) => {
    websocketServer.emit("connection", ws, request);
  });
});

websocketServer.on("connection", (socket) => {
  browserClients.add(socket);
  // A malformed frame (e.g. "MASK must be set" through a proxy chain) emits
  // 'error' on this socket; without a listener Node throws and the whole
  // headless process dies. Drop the client instead.
  socket.on("error", (err) => {
    console.error("[headless-ws] client socket error, dropping client", err);
    browserClients.delete(socket);
  });
  socket.on("close", () => {
    browserClients.delete(socket);
  });
  socket.on("message", () => {
    // The browser client may open a socket and keep it idle. No-op; the server
    // is event-driven and pushes only on outbound channel messages.
  });
});

// Unhandled 'error' on the server itself would also crash the process.
websocketServer.on("error", (err) => {
  console.error("[headless-ws] server error", err);
});

const port = Number(process.env.NEXTBILLION_HEADLESS_PORT ?? 3000);

// Electron calls shutdownObservability() on will-quit; the headless server has
// no will-quit, so flush pending telemetry spans on the usual stop signals.
async function shutdownAndExit(signal: string) {
  console.log(`headless: ${signal} received, flushing telemetry and exiting`);
  try {
    await shutdownObservability();
  } catch (error) {
    console.error("headless: telemetry shutdown failed", error);
  }
  process.exit(0);
}
process.on("SIGINT", () => void shutdownAndExit("SIGINT"));
process.on("SIGTERM", () => void shutdownAndExit("SIGTERM"));

server.listen(port, "127.0.0.1", () => {
  console.log(
    `Headless NextBillion IPC server listening on http://127.0.0.1:${port}`,
  );
  console.log(`WebSocket endpoint available at ws://127.0.0.1:${port}/ws`);
  console.log(`Data directory: ${process.env.NEXTBILLION_DEV_USER_DATA_DIR}`);
  console.log(
    `RPC origin allowlist: ${Array.from(allowedRpcOrigins).join(", ")}`,
  );
  if (expectedRpcToken) {
    // Localhost-only dev harness: the operator needs the token for curl/CLI
    // probes, and stdout is their own terminal.
    console.log(
      `RPC token required: pass -H "x-nextbillion-rpc-token: ${expectedRpcToken}" on /rpc, ?token=${expectedRpcToken} on /ws.`,
    );
  }
});
