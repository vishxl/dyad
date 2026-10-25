import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import { migrateLegacyTags } from "./legacy_tag_migration";

function setup() {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE messages (id INTEGER PRIMARY KEY, content TEXT, ai_messages_json TEXT);
    CREATE TABLE agent_messages (id INTEGER PRIMARY KEY, content TEXT);
    INSERT INTO messages VALUES (1, '<dyad-write path="a">x</dyad-write>', '{"t":"<dyad-status></dyad-status>"}');
    INSERT INTO messages VALUES (2, 'plain text', NULL);
    INSERT INTO messages VALUES (3, 'see dyad-media://media/app/.dyad/media/a.png and .dyad/media/b.png', NULL);
    INSERT INTO agent_messages VALUES (1, '＜dyad-write path="b"');
  `);
  return db;
}

describe("migrateLegacyTags", () => {
  it("rewrites every column and records the migration", () => {
    const db = setup();
    expect(migrateLegacyTags(db)).toBe(4);
    expect(
      db.prepare("SELECT content FROM messages WHERE id = 3").get(),
    ).toEqual({
      content:
        "see nextbillion-media://media/app/.nextbillion/media/a.png and .nextbillion/media/b.png",
    });
    expect(
      db
        .prepare("SELECT content, ai_messages_json FROM messages WHERE id = 1")
        .get(),
    ).toEqual({
      content: '<nextbillion-write path="a">x</nextbillion-write>',
      ai_messages_json: '{"t":"<nextbillion-status></nextbillion-status>"}',
    });
    expect(
      db.prepare("SELECT content FROM messages WHERE id = 2").get(),
    ).toEqual({ content: "plain text" });
    expect(db.prepare("SELECT content FROM agent_messages").get()).toEqual({
      content: '＜nextbillion-write path="b"',
    });
  });

  it("is idempotent", () => {
    const db = setup();
    migrateLegacyTags(db);
    expect(migrateLegacyTags(db)).toBe(0);
  });

  it("tolerates a database with none of the tables", () => {
    expect(migrateLegacyTags(new Database(":memory:"))).toBe(0);
  });
});
