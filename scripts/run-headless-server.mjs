import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const entry = path.join(cwd, "dist", "headless-server.cjs");
const source = path.join(cwd, "src", "server", "index.ts");
const buildScript = path.join(cwd, "scripts", "build-headless-server.mjs");

function shouldRebuildHeadlessServer() {
  if (!fs.existsSync(entry)) return true;
  if (!fs.existsSync(source)) return false;

  const sourceStat = fs.statSync(source);
  const entryStat = fs.statSync(entry);
  return sourceStat.mtimeMs > entryStat.mtimeMs;
}

if (shouldRebuildHeadlessServer()) {
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

const child = spawn(process.execPath, [entry], {
  cwd,
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || "development",
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
