import { describe, expect, it } from "vitest";
import { CONTEXT_PACK_IDS, CONTEXT_PACKS, MAX_CONTEXT_PACKS } from "./registry";

describe("context pack registry", () => {
  it("registers nextbillion with a name", () => {
    expect(CONTEXT_PACK_IDS).toContain("nextbillion");
    expect(CONTEXT_PACKS.nextbillion.name).toBe("NextBillion.ai");
  });

  it("declares viking:// scope URIs for retrieval-backed packs", () => {
    for (const id of CONTEXT_PACK_IDS) {
      for (const scope of CONTEXT_PACKS[id].vikingScopes) {
        expect(scope).toMatch(/^viking:\/\/resources\//);
      }
    }
    // The migrated knowledge corpus must be within reach of the pack:
    // vendor docs, the distilled application-domain KB, and the curated
    // session layers. This failing means a subtree is dead weight again.
    expect(CONTEXT_PACKS.nextbillion.vikingScopes).toContain(
      "viking://resources/nextbillion-docs",
    );
    expect(CONTEXT_PACKS.nextbillion.vikingScopes).toContain(
      "viking://resources/nextbillion-app-kb",
    );
    expect(CONTEXT_PACKS.nextbillion.vikingScopes).toContain(
      "viking://resources/nextbillion-sessions/support-tickets",
    );
  });

  it("caps simultaneous packs", () => {
    expect(MAX_CONTEXT_PACKS).toBeGreaterThanOrEqual(1);
  });
});
