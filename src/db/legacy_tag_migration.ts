import fs from "node:fs";
import type Database from "better-sqlite3";

const MIGRATION_NAME = "legacy-tags-v1";

// Every persisted column that can hold the original <dyad-*> tag dialect.
const TARGETS: ReadonlyArray<readonly [table: string, column: string]> = [
  ["messages", "content"],
  ["messages", "ai_messages_json"],
  ["agent_messages", "content"],
  ["agent_activities", "presentation_xml"],
];

// Tags, the full-width tag escape, media URLs and the per-app internal folder path.
const PAIRS = [
  ["<dyad-", "<nextbillion-"],
  ["</dyad-", "</nextbillion-"],
  ["＜dyad", "＜nextbillion"],
  ["dyad-media://", "nextbillion-media://"],
  [".dyad/", ".nextbillion/"],
] as const;
const rewrite = (col: string) =>
  PAIRS.reduce(
    (expr, [from, to]) => `REPLACE(${expr}, '${from}', '${to}')`,
    col,
  );

/**
 * One-time, idempotent rewrite of stored chat content from <dyad-*> to
 * <nextbillion-*> tags (the renderer and write-back sites match stored text
 * directly). Copies the database file aside first when it will change data.
 * Returns the number of rewritten rows.
 */
export function migrateLegacyTags(
  sqlite: Database.Database,
  log: (msg: string) => void = () => {},
): number {
  sqlite.exec(
    "CREATE TABLE IF NOT EXISTS _nextbillion_migrations (name TEXT PRIMARY KEY, applied_at INTEGER NOT NULL)",
  );
  const done = sqlite
    .prepare("SELECT 1 FROM _nextbillion_migrations WHERE name = ?")
    .get(MIGRATION_NAME);
  if (done) return 0;

  const tableExists = (t: string) =>
    !!sqlite
      .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get(t);
  const targets = TARGETS.filter(([t]) => tableExists(t));
  const where = (c: string) =>
    `${c} LIKE '%dyad-%' OR ${c} LIKE '%＜dyad%' OR ${c} LIKE '%.dyad/%'`;
  const pending = targets.filter(([t, c]) =>
    sqlite.prepare(`SELECT 1 FROM ${t} WHERE ${where(c)} LIMIT 1`).get(),
  );

  if (pending.length > 0 && sqlite.name && sqlite.name !== ":memory:") {
    try {
      sqlite.pragma("wal_checkpoint(TRUNCATE)");
      fs.copyFileSync(sqlite.name, `${sqlite.name}.pre-nextbillion-tags.bak`);
    } catch (error) {
      log(`Could not back up database before tag migration: ${error}`);
      throw error;
    }
  }

  let changed = 0;
  sqlite.transaction(() => {
    for (const [t, c] of pending) {
      changed += sqlite
        .prepare(`UPDATE ${t} SET ${c} = ${rewrite(c)} WHERE ${where(c)}`)
        .run().changes;
    }
    sqlite
      .prepare(
        "INSERT INTO _nextbillion_migrations (name, applied_at) VALUES (?, ?)",
      )
      .run(MIGRATION_NAME, Date.now());
  })();
  if (changed > 0) log(`Rewrote legacy tags in ${changed} rows`);
  return changed;
}
