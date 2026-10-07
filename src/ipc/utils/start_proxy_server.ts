// startProxy.js – helper to launch proxy.js as a worker

import { existsSync } from "node:fs";
import { Worker } from "worker_threads";
import path from "path";
import log from "electron-log";
import { DyadError, DyadErrorKind } from "@/errors/dyad_error";
import {
  PROXY_FALLBACK_MAX_ATTEMPTS,
  getProxyFallbackPortStart,
} from "../../../shared/ports";

const logger = log.scope("start_proxy_server");

export function resolveProxyWorkerPath(): string {
  const candidates = [
    path.resolve(__dirname, "..", "worker", "proxy_server.js"),
    path.resolve(__dirname, "..", "..", "worker", "proxy_server.js"),
    path.resolve(__dirname, "..", "..", "..", "worker", "proxy_server.js"),
    path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "worker",
      "proxy_server.js",
    ),
    path.resolve(process.cwd(), "worker", "proxy_server.js"),
  ];

  const found = candidates.find((candidate) => existsSync(candidate));
  if (found) {
    return found;
  }

  const fallback =
    candidates[0] ?? path.resolve(process.cwd(), "worker", "proxy_server.js");
  logger.warn("Preview proxy worker not found; checked:", candidates);
  return fallback;
}

export async function startProxy(
  targetOrigin: string,
  opts: {
    port: number;
    hostname: string;
    onStarted?: (proxyUrl: string) => void;
    onError?: (error: DyadError) => void;
    fixedHeaders?: Record<string, string>;
    authBootstrapToken: string;
    signal?: AbortSignal;
  },
) {
  if (!/^https?:\/\//.test(targetOrigin))
    throw new DyadError(
      "startProxy: targetOrigin must be absolute http/https URL",
      DyadErrorKind.Validation,
    );
  const { port, onStarted, onError, fixedHeaders, authBootstrapToken } = opts;
  const fallbackPortStart = getProxyFallbackPortStart();
  const workerPath = resolveProxyWorkerPath();
  logger.info("Starting proxy on port", port, "using worker", workerPath);

  if (!existsSync(workerPath)) {
    const error = new DyadError(
      `Preview proxy worker not found at ${workerPath}. Looked for worker/proxy_server.js in the current app and several repo-relative paths.`,
      DyadErrorKind.External,
    );
    onError?.(error);
    throw error;
  }

  const worker = new Worker(workerPath, {
    workerData: {
      targetOrigin,
      hostname: opts.hostname,
      port,
      fallbackPortStart,
      maxPortAttempts: PROXY_FALLBACK_MAX_ATTEMPTS,
      fixedHeaders,
      authBootstrapToken,
    },
  });

  let started = false;
  let reportedError = false;
  const reportError = (error: DyadError) => {
    if (reportedError || opts.signal?.aborted) return;
    reportedError = true;
    onError?.(error);
  };

  worker.on("message", (m) => {
    logger.info("[proxy]", m);
    if (typeof m === "string" && m.startsWith("proxy-server-start url=")) {
      started = true;
      const url = m.substring("proxy-server-start url=".length);
      onStarted?.(url);
    } else if (typeof m === "string" && m.startsWith("proxy-server-error")) {
      logger.error("[proxy] failed to bind:", m);
      reportError(
        new DyadError(
          `Could not start the preview proxy: every port from ${port} to ${fallbackPortStart + PROXY_FALLBACK_MAX_ATTEMPTS - 1} is in use. Free up a port and restart the app.`,
          DyadErrorKind.Conflict,
        ),
      );
    }
  });
  worker.on("error", (e) => {
    logger.error("[proxy] error:", e);
    reportError(
      new DyadError(
        `Preview proxy failed: ${e.message}`,
        DyadErrorKind.External,
      ),
    );
  });
  worker.on("exit", (c) => {
    logger.info("[proxy] exit", c);
    if (!started && !reportedError)
      reportError(
        new DyadError(
          "Preview proxy exited before it was ready",
          DyadErrorKind.External,
        ),
      );
  });

  return worker; // let the caller keep a handle if desired
}
