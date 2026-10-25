import path from "node:path";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";
import type { AgentContext } from "./types";

/**
 * Resolve the app path a read-only tool should target.
 *
 * - Omitted `appName` → current app (`ctx.appPath`).
 * - Provided `appName` → must match a referenced app from the current turn's
 *   `@app:Name` mentions. Any other value is rejected.
 *
 * Write tools do not call this — they operate only on `ctx.appPath` so that
 * referenced apps remain structurally unreachable for modification.
 */
export function resolveTargetAppPath(
  ctx: AgentContext,
  appName: string | undefined,
): string {
  if (!appName) {
    return ctx.appPath;
  }
  const appPath = ctx.referencedApps.get(appName.toLowerCase());
  if (appPath) {
    return appPath;
  }
  const available = [...ctx.referencedApps.keys()];
  const availableStr =
    available.length > 0 ? available.join(", ") : "(none available)";
  throw new NextBillionError(
    `Unknown app_name '${appName}'. Available referenced apps: ${availableStr}`,
    NextBillionErrorKind.NotFound,
  );
}

/**
 * Glob pattern for `.nextbillion/` internals, for use in the node `glob` library's
 * ignore list.
 *
 * A referenced app's `.nextbillion/` folder (rules, chat history, snapshots, etc.) is
 * not part of the `@app:Name` reference contract and must not be exposed to
 * read-only tools when targeting another app.
 */
export const NEXTBILLION_INTERNAL_GLOB = "**/.nextbillion/**";

/**
 * Negated glob for ripgrep's `--glob` flag, excluding `.nextbillion/` at the app root
 * (ripgrep globs are relative to cwd, which is the target app path).
 */
export const NEXTBILLION_INTERNAL_RIPGREP_EXCLUDE = "!.nextbillion/**";

/**
 * Is `relativePath` inside a `.nextbillion/` folder at the app root?
 *
 * Accepts slashes in either direction and a leading `./`; callers should pass a
 * path already resolved relative to the app root (so traversal aliases like
 * `src/../.nextbillion/...` normalize correctly before being checked).
 */
export function isNextBillionInternalPath(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\.\//, "");
  return normalized.split("/")[0] === ".nextbillion";
}

/**
 * Strip `.nextbillion/` entries from a file list when targeting a referenced app.
 * No-op for the current app (`appName` omitted) — the user's own `.nextbillion/`
 * internals are always visible to them.
 */
export function filterNextBillionInternalFiles<T extends { path: string }>(
  files: T[],
  appName: string | undefined,
): T[] {
  if (!appName) {
    return files;
  }
  return files.filter((file) => !isNextBillionInternalPath(file.path));
}

/**
 * Block Git metadata in every app and `.nextbillion/` content in referenced apps.
 * Current-app `.nextbillion/` content remains available. The relative path is
 * computed from the resolved `fullFilePath`, so normalized traversal aliases
 * (e.g. `src/../.nextbillion/...`) are caught.
 */
export function assertNextBillionInternalAccessAllowed({
  targetAppPath,
  fullFilePath,
  appName,
}: {
  targetAppPath: string;
  fullFilePath: string;
  appName: string | undefined;
}): void {
  const relativeFromApp = path.relative(targetAppPath, fullFilePath);
  // Git metadata can contain credential-bearing remotes and extra headers.
  // Apply the same rule to lexical paths and the reader's canonical-path check.
  if (
    relativeFromApp
      .replace(/\\/g, "/")
      .split("/")
      .some((part) => part.toLowerCase() === ".git")
  ) {
    throw new NextBillionError(
      "Cannot read Git metadata through file tools.",
      NextBillionErrorKind.Validation,
    );
  }
  if (!appName) {
    return;
  }
  if (isNextBillionInternalPath(relativeFromApp)) {
    throw new NextBillionError(
      `Cannot read .nextbillion/ paths from referenced apps — these files are not part of the @app reference contract.`,
      NextBillionErrorKind.Validation,
    );
  }
}
