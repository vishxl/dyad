import { db } from "../../db";
import { apps } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  runTypeScriptCheck,
  getTypeCheckPreconditionGuidance,
  getTypeCheckPreconditionKind,
} from "../processors/tsc";
import { getNextBillionAppPath } from "@/paths/paths";
import log from "electron-log";
import { createTypedHandler } from "./base";
import { miscContracts } from "../types/misc";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";

const logger = log.scope("problems_handlers");

export function registerProblemsHandlers() {
  createTypedHandler(miscContracts.checkProblems, async (_, params) => {
    let appPath = "";
    try {
      // Get the app to find its path
      const app = await db.query.apps.findFirst({
        where: eq(apps.id, params.appId),
      });

      if (!app) {
        throw new NextBillionError(
          `App not found: ${params.appId}`,
          NextBillionErrorKind.NotFound,
        );
      }

      appPath = getNextBillionAppPath(app.path);

      const problemReport = await runTypeScriptCheck({ appPath });

      return problemReport;
    } catch (error) {
      const preconditionKind = getTypeCheckPreconditionKind(error);
      if (preconditionKind) {
        if (!appPath) {
          throw error;
        }

        const message = await getTypeCheckPreconditionGuidance({
          kind: preconditionKind,
          appPath,
        });
        logger.info("Type checking precondition failed:", message);
        throw new NextBillionError(message, NextBillionErrorKind.Precondition, {
          cause: error,
        });
      }

      logger.error("Error checking problems:", error);
      throw error;
    }
  });
}
