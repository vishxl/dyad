import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const outFile = path.join(cwd, "dist", "headless-server.cjs");
const shimPath = path.join(cwd, "src", "server", "electron-shim.ts");
fs.mkdirSync(path.dirname(outFile), { recursive: true });

await build({
  absWorkingDir: cwd,
  entryPoints: [path.join(cwd, "src", "server", "index.ts")],
  outfile: outFile,
  bundle: true,
  platform: "node",
  format: "cjs",
  sourcemap: true,
  tsconfig: path.join(cwd, "tsconfig.app.json"),
  loader: {
    ".md": "text",
    ".svg": "text",
    ".txt": "text",
  },
  external: [
    "electron",
    "electron-log",
    "better-sqlite3",
    "dyad-keychain-reader",
    "cpu-features",
    "node-pty",
  ],
  alias: {
    electron: shimPath,
    "node-pty": path.join(cwd, "src", "server", "node-pty-shim.ts"),
  },
  logLevel: "info",
});

console.log(`Built headless Dyad server to ${outFile}`);
