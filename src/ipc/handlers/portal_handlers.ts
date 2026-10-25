import { createLoggedHandler } from "./safe_handle";
import log from "electron-log";
import { db } from "../../db";
import { apps } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getNextBillionAppPath } from "../../paths/paths";
import { gitService } from "../services/git_service";
import { storeDbTimestampAtCurrentVersion } from "../utils/neon_timestamp_utils";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";
import { runPortalMigrationCommand } from "../utils/portal_migration";

const logger = log.scope("portal_handlers");
const handle = createLoggedHandler(logger);

async function getApp(appId: number) {
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, appId),
  });
  if (!app) {
    throw new NextBillionError(
      `App with id ${appId} not found`,
      NextBillionErrorKind.NotFound,
    );
  }
  return app;
}

export function registerPortalHandlers() {
  handle(
    "portal:migrate-create",
    async (_, { appId }: { appId: number }): Promise<{ output: string }> => {
      const app = await getApp(appId);
      const appPath = getNextBillionAppPath(app.path);

      const migrationOutput = await runPortalMigrationCommand({
        appId,
        appPath,
      });

      if (app.neonProjectId && app.neonDevelopmentBranchId) {
        try {
          await storeDbTimestampAtCurrentVersion({
            appId: app.id,
          });
        } catch (error) {
          logger.error(
            "Error storing Neon timestamp at current version:",
            error,
          );
          throw new Error(
            "Could not store Neon timestamp at current version; database versioning functionality is not working: " +
              error,
          );
        }
      }

      // Stage all changes and commit
      try {
        const commitHash = await gitService.stageAllAndCommit({
          path: appPath,
          message: "Generate database migration file",
        });

        logger.info(`Successfully committed migration changes: ${commitHash}`);
        return { output: migrationOutput };
      } catch (gitError) {
        logger.error(`Migration created but failed to commit: ${gitError}`);
        throw new NextBillionError(
          `Migration created but failed to commit: ${gitError}`,
          NextBillionErrorKind.External,
        );
      }
    },
  );
}
