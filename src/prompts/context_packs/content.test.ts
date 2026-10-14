import { describe, expect, it } from "vitest";
import { getContextPackPromptBlock } from "./content";

describe("getContextPackPromptBlock (static routing table)", () => {
  it("returns empty for no packs", () => {
    expect(getContextPackPromptBlock(undefined)).toBe("");
    expect(getContextPackPromptBlock([])).toBe("");
  });

  it("wraps the static block with the vendor tag", () => {
    const block = getContextPackPromptBlock(["nextbillion"]);
    expect(block).toContain('<context-pack vendor="NextBillion.ai">');
    expect(block).toContain("## Which API when");
  });

  it("ignores unknown ids", () => {
    expect(getContextPackPromptBlock(["nonexistent" as never])).toBe("");
  });
});
