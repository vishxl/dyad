import "./lib/legacy-env.mjs";
import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";

const cwd = process.cwd();
const serverEntry = path.join(cwd, "dist", "headless-server.cjs");
const serverSource = path.join(cwd, "src", "server", "index.ts");
const buildScript = path.join(cwd, "scripts", "build-headless-server.mjs");

function shouldRebuildHeadlessServer() {
  if (!fs.existsSync(serverEntry)) return true;
  if (!fs.existsSync(serverSource)) return false;

  const sourceStat = fs.statSync(serverSource);
  const outputStat = fs.statSync(serverEntry);
  return sourceStat.mtimeMs > outputStat.mtimeMs;
}

function ensureHeadlessServerBuilt() {
  if (!shouldRebuildHeadlessServer()) return;

  const build = spawnSync(process.execPath, [buildScript], {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || "development",
    },
  });

  if (build.status !== 0) {
    process.exit(build.status ?? 1);
  }
}

ensureHeadlessServerBuilt();
launch();

function launch() {
  // Per-launch shared secret guarding /rpc and /ws: the server requires it,
  // Vite exposes it to the renderer bridge as VITE_RPC_TOKEN. Override with
  // NEXTBILLION_RPC_TOKEN; unset NEXTBILLION_RPC_TOKEN entirely in the server's env to
  // disable token checks (origin allowlist stays active).
  const rpcToken =
    process.env.NEXTBILLION_RPC_TOKEN || crypto.randomUUID().replace(/-/g, "");

  const serverPort = Number(process.env.NEXTBILLION_HEADLESS_PORT ?? 3000);
  const vitePort = Number(process.env.NEXTBILLION_HEADLESS_VITE_PORT ?? 4173);

  const server = spawn(process.execPath, [serverEntry], {
    cwd,
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || "development",
      NEXTBILLION_DATA_DIR:
        process.env.NEXTBILLION_DATA_DIR || path.join(cwd, "userData"),
      NEXTBILLION_RPC_TOKEN: rpcToken,
      NEXTBILLION_HEADLESS_PORT: String(serverPort),
      NEXTBILLION_RPC_ALLOWED_ORIGINS:
        process.env.NEXTBILLION_RPC_ALLOWED_ORIGINS ||
        [`http://127.0.0.1:${vitePort}`, `http://localhost:${vitePort}`].join(
          ",",
        ),
    },
    stdio: "inherit",
  });

  const browser = spawn(
    process.execPath,
    [
      path.join(cwd, "node_modules", "vite", "bin", "vite.js"),
      "--config",
      "vite.renderer.config.mts",
      "--host",
      "127.0.0.1",
      "--port",
      String(vitePort),
      "--strictPort",
    ],
    {
      cwd,
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || "development",
        VITE_BROWSER_IPC: "1",
        VITE_RPC_TOKEN: rpcToken,
        NEXTBILLION_DATA_DIR:
          process.env.NEXTBILLION_DATA_DIR || path.join(cwd, "userData"),
      },
      stdio: "inherit",
    },
  );

  const shutdown = () => {
    server.kill("SIGTERM");
    browser.kill("SIGTERM");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  browser.on("exit", (code) => {
    server.kill("SIGTERM");
    process.exit(code ?? 0);
  });

  server.on("exit", (code) => {
    browser.kill("SIGTERM");
    process.exit(code ?? 0);
  });
}
