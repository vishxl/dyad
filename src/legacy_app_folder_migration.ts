import fs from "node:fs";
import path from "node:path";

const LEGACY_DIR = ".dyad";
const NEW_DIR = ".nextbillion";

/**
 * Apps created before the rebrand keep NextBillion-managed files (media, plans,
 * todos, chat backups) in `<app>/.dyad`. Chat content references that folder by
 * path, so move it to `.nextbillion` (the stored references are rewritten by
 * migrateLegacyTags) and make sure the app's git ignores the new name.
 * Idempotent; never overwrites an existing `.nextbillion`.
 */
export function migrateLegacyAppFolder(appDir: string): boolean {
  const legacy = path.join(appDir, LEGACY_DIR);
  const next = path.join(appDir, NEW_DIR);
  if (!fs.existsSync(legacy) || fs.existsSync(next)) return false;
  fs.renameSync(legacy, next);

  const gitignore = path.join(appDir, ".gitignore");
  const existing = fs.existsSync(gitignore)
    ? fs.readFileSync(gitignore, "utf8")
    : "";
  if (!/^\/?\.nextbillion\/?\s*$/m.test(existing)) {
    const sep = existing === "" || existing.endsWith("\n") ? "" : "\n";
    fs.writeFileSync(gitignore, `${existing}${sep}${NEW_DIR}/\n`);
  }
  return true;
}

export function migrateLegacyAppFolders(
  appPaths: string[],
  resolveAppDir: (appPath: string) => string,
  log: (msg: string) => void = () => {},
): number {
  let moved = 0;
  for (const appPath of appPaths) {
    try {
      if (migrateLegacyAppFolder(resolveAppDir(appPath))) moved++;
    } catch (error) {
      log(`Could not migrate legacy folder for ${appPath}: ${error}`);
    }
  }
  return moved;
}
