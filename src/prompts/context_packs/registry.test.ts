import { describe, expect, it } from "vitest";
import { getContextPackPromptBlock } from "./content";
import { CONTEXT_PACKS, CONTEXT_PACK_IDS } from "./registry";

describe("getContextPackPromptBlock", () => {
  it("returns empty string when no packs are enabled", () => {
    expect(getContextPackPromptBlock(undefined)).toBe("");
    expect(getContextPackPromptBlock([])).toBe("");
  });

  it("wraps the pack index in a context-pack tag when enabled", () => {
    const block = getContextPackPromptBlock(["nextbillion"]);
    expect(block).toContain('<context-pack vendor="NextBillion.ai">');
    expect(block).toContain("</context-pack>");
    // index content is present (spot-check its title and a distinctive API name)
    expect(block).toContain("# NextBillion.ai");
    expect(block).toContain("Directions");
  });

  it("ignores unknown pack ids", () => {
    expect(getContextPackPromptBlock(["not-a-pack"])).toBe("");
    expect(getContextPackPromptBlock(["nextbillion", "not-a-pack"])).toContain(
      '<context-pack vendor="NextBillion.ai">',
    );
  });

  it("registry declares a name for every pack id", () => {
    for (const id of CONTEXT_PACK_IDS) {
      expect(CONTEXT_PACKS[id].name.length).toBeGreaterThan(0);
    }
  });
});
