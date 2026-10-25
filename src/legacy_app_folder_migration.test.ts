import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { migrateLegacyAppFolder } from "./legacy_app_folder_migration";

let dir: string;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "legacy-app-"));
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

describe("migrateLegacyAppFolder", () => {
  it("moves .dyad to .nextbillion and gitignores it", () => {
    fs.mkdirSync(path.join(dir, ".dyad", "media"), { recursive: true });
    fs.writeFileSync(path.join(dir, ".dyad", "media", "a.png"), "x");
    fs.writeFileSync(path.join(dir, ".gitignore"), "node_modules\n.dyad/");
    expect(migrateLegacyAppFolder(dir)).toBe(true);
    expect(fs.existsSync(path.join(dir, ".dyad"))).toBe(false);
    expect(
      fs.readFileSync(path.join(dir, ".nextbillion", "media", "a.png"), "utf8"),
    ).toBe("x");
    expect(fs.readFileSync(path.join(dir, ".gitignore"), "utf8")).toBe(
      "node_modules\n.dyad/\n.nextbillion/\n",
    );
  });

  it("is idempotent and never overwrites an existing .nextbillion", () => {
    fs.mkdirSync(path.join(dir, ".dyad"));
    fs.mkdirSync(path.join(dir, ".nextbillion"));
    expect(migrateLegacyAppFolder(dir)).toBe(false);
    expect(fs.existsSync(path.join(dir, ".dyad"))).toBe(true);
  });

  it("does nothing for apps without a legacy folder", () => {
    expect(migrateLegacyAppFolder(dir)).toBe(false);
    expect(fs.existsSync(path.join(dir, ".gitignore"))).toBe(false);
  });
});
