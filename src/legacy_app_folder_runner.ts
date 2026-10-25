import { db } from "./db";
import { apps } from "./db/schema";
import { getNextBillionAppPath } from "./paths/paths";
import { migrateLegacyAppFolders } from "./legacy_app_folder_migration";

/** Call once after initializeDatabase(). */
export function runLegacyAppFolderMigration(log: (msg: string) => void): void {
  const paths = db.select({ path: apps.path }).from(apps).all();
  const moved = migrateLegacyAppFolders(
    paths.map((a) => a.path),
    getNextBillionAppPath,
    log,
  );
  if (moved > 0) log(`Moved legacy internal folder for ${moved} app(s)`);
}
