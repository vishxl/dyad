import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { WebSocketServer, WebSocket } from "ws";

process.env.NODE_ENV ??= "development";
process.env.DYAD_HEADLESS_HTTP = "1";

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
  process.env.DYAD_DATA_DIR?.trim() ||
  process.env.DYAD_DEV_USER_DATA_DIR?.trim() ||
  path.resolve(process.cwd(), "userData");

process.env.DYAD_DEV_USER_DATA_DIR = path.resolve(dataDir);
fs.mkdirSync(process.env.DYAD_DEV_USER_DATA_DIR, { recursive: true });

import { initializeDatabase } from "../db";
import { registerIpcHandlers } from "../ipc/ipc_host";
import { encodeIpcDates } from "../ipc/contracts/core";
// Import the shim module directly: type-checking resolves "electron" to the
// real Electron types (which lack getHandler), while the esbuild alias makes
// both specifiers resolve to the same shim instance in the bundle.
import { ipcMain } from "./electron-shim";
import { applyManagedNodeToProcessPath } from "../ipc/utils/managed_node";
import { configureTrustedRenderer } from "../ipc/utils/renderer_security";

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

  try {
    const input = await readJsonBody(request);
    const handler = ipcMain.getHandler(channel);
    if (!handler) {
      response.statusCode = 404;
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({
          __dyadIpcEnvelope: "dyad-ipc-envelope-v1",
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
        __dyadIpcEnvelope: "dyad-ipc-envelope-v1",
        ok: false,
        error: { message },
      }),
    );
  }
});

const websocketServer = new WebSocketServer({
  server,
  path: "/ws",
});

websocketServer.on("connection", (socket) => {
  browserClients.add(socket);
  socket.on("close", () => {
    browserClients.delete(socket);
  });
  socket.on("message", () => {
    // The browser client may open a socket and keep it idle. No-op; the server
    // is event-driven and pushes only on outbound channel messages.
  });
});

server.listen(3000, "127.0.0.1", () => {
  console.log(`Headless Dyad IPC server listening on http://127.0.0.1:3000`);
  console.log(`WebSocket endpoint available at ws://127.0.0.1:3000/ws`);
  console.log(`Data directory: ${process.env.DYAD_DEV_USER_DATA_DIR}`);
});
