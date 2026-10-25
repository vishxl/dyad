import log from "electron-log";
import { createTypedHandler } from "./base";
import { systemContracts } from "../types/system";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";

const logger = log.scope("release_note_handlers");

export function registerReleaseNoteHandlers() {
  createTypedHandler(
    systemContracts.doesReleaseNoteExist,
    async (_, params) => {
      const { version } = params;

      if (!version || typeof version !== "string") {
        throw new NextBillionError(
          "Invalid version provided",
          NextBillionErrorKind.Validation,
        );
      }

      // Release notes were hosted on the upstream project's site; none are published.
      return { exists: false };
    },
  );

  logger.debug("Registered release note IPC handlers");
}
