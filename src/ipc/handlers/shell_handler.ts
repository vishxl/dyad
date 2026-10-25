import { isExternalServiceHost } from "../../external_endpoints";
import { buildOAuthLoginUrl } from "../../connection_flow/oauth_deep_link";
import type { ConnectionFlowInvocationRef } from "../../connection_flow/state";
import { app, shell } from "electron";
import log from "electron-log";
import path from "node:path";
import { createLoggedHandler } from "./safe_handle";
import { IS_TEST_BUILD } from "../utils/test_utils";
import { isFileWithinAnyNextBillionMediaDir } from "../utils/media_path_utils";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";
import { registerNextBillionProtocolLinux } from "../../main/linux_protocol_registration";

const logger = log.scope("shell_handlers");
const handle = createLoggedHandler(logger);

// Hosts whose OAuth flows redirect back into the app via a nextbillion:// deep link
// (Neon, Supabase, and NextBillion Pro all live under the external service domain).
function isNextBillionOAuthUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return isExternalServiceHost(host);
  } catch {
    return false;
  }
}

// Only allow opening files with known safe media extensions via shell.openPath.
// This prevents execution of arbitrary executables even if they reside under a
// .nextbillion/media directory.
const ALLOWED_MEDIA_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".ico",
  ".pdf",
  ".txt",
  ".md",
  ".csv",
  ".json",
  ".xml",
  ".mp3",
  ".mp4",
  ".wav",
  ".ogg",
  ".webm",
]);

export function registerShellHandlers() {
  const openExternalUrl = async (url: string) => {
    if (!url) {
      throw new NextBillionError(
        "No URL provided.",
        NextBillionErrorKind.External,
      );
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      throw new Error("Attempted to open invalid or non-http URL: " + url);
    }
    // In E2E test mode, skip actually opening external URLs to avoid browser windows
    if (IS_TEST_BUILD) {
      logger.debug("E2E test mode: skipped opening external URL:", url);
      return;
    }
    // On Linux, dev and packaged builds share the single nextbillion:// scheme and it's
    // "last registration wins", so launching the packaged app steals the handler
    // and OAuth callbacks (nextbillion://neon-oauth-return, etc.) open packaged instead
    // of this dev instance. Reclaim the handler just before the browser opens so
    // the callback routes back here. Best-effort; the helper self-guards platform.
    if (
      !app.isPackaged &&
      process.platform === "linux" &&
      isNextBillionOAuthUrl(url)
    ) {
      await registerNextBillionProtocolLinux(app.getPath("userData"));
    }
    await shell.openExternal(url);
    logger.debug("Opened external URL:", url);
  };

  handle("open-external-url", async (_event, url: string) => {
    await openExternalUrl(url);
  });

  handle(
    "open-oauth-login",
    async (
      _event,
      {
        provider,
        invocationRef,
      }: {
        provider: "neon" | "supabase";
        invocationRef: ConnectionFlowInvocationRef;
      },
    ) => {
      await openExternalUrl(buildOAuthLoginUrl(provider, invocationRef));
    },
  );

  handle("show-item-in-folder", async (_event, fullPath: string) => {
    // Validate that a path was provided
    if (!fullPath) {
      throw new NextBillionError(
        "No file path provided.",
        NextBillionErrorKind.External,
      );
    }

    shell.showItemInFolder(fullPath);
    logger.debug("Showed item in folder:", fullPath);
  });

  handle("open-file-path", async (_event, fullPath: string) => {
    if (!fullPath) {
      throw new NextBillionError(
        "No file path provided.",
        NextBillionErrorKind.External,
      );
    }

    // Security: only allow opening files within .nextbillion/media subdirectories.
    // The nextbillion-apps tree contains AI-generated code, so opening arbitrary files
    // there via shell.openPath could execute malicious executables.
    // App paths may be under the default nextbillion-apps base directory (normal) or
    // at an external location (imported with skipCopy).
    if (!isFileWithinAnyNextBillionMediaDir(fullPath)) {
      throw new NextBillionError(
        "Can only open files within .nextbillion/media directories.",
        NextBillionErrorKind.External,
      );
    }
    const resolvedPath = path.resolve(fullPath);

    // Defense-in-depth: only allow known media file extensions
    const ext = path.extname(resolvedPath).toLowerCase();
    if (!ALLOWED_MEDIA_EXTENSIONS.has(ext)) {
      throw new Error(
        `File type '${ext}' is not allowed. Only media files can be opened.`,
      );
    }

    const result = await shell.openPath(resolvedPath);
    if (result) {
      // shell.openPath returns an error string if it fails, empty string on success
      throw new NextBillionError(
        `Failed to open file: ${result}`,
        NextBillionErrorKind.External,
      );
    }
    logger.debug("Opened file:", resolvedPath);
  });
}
