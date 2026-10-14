import { describe, expect, it } from "vitest";
import { CONTEXT_PACK_IDS, CONTEXT_PACKS, MAX_CONTEXT_PACKS } from "./registry";

describe("context pack registry", () => {
  it("registers nextbillion with a name", () => {
    expect(CONTEXT_PACK_IDS).toContain("nextbillion");
    expect(CONTEXT_PACKS.nextbillion.name).toBe("NextBillion.ai");
  });

  it("uses viking:// URIs for retrieval-backed packs", () => {
    for (const id of CONTEXT_PACK_IDS) {
      const uri = CONTEXT_PACKS[id].vikingUri;
      if (uri) {
        expect(uri).toMatch(/^viking:\/\/resources\//);
      }
    }
    expect(CONTEXT_PACKS.nextbillion.vikingUri).toBe(
      "viking://resources/nextbillion-docs",
    );
  });

  it("caps simultaneous packs", () => {
    expect(MAX_CONTEXT_PACKS).toBeGreaterThanOrEqual(1);
  });
});
