import { describe, expect, it } from "vitest";
import { normalizeLegacyTags } from "./legacy_tags";

describe("normalizeLegacyTags", () => {
  it("rewrites open and close tags", () => {
    expect(
      normalizeLegacyTags(
        '<dyad-write path="a.ts">x</dyad-write> <dyad-status title="t"></dyad-status>',
      ),
    ).toBe(
      '<nextbillion-write path="a.ts">x</nextbillion-write> <nextbillion-status title="t"></nextbillion-status>',
    );
  });

  it("rewrites the full-width escape", () => {
    expect(normalizeLegacyTags("＜dyad-write")).toBe("＜nextbillion-write");
  });

  it("is idempotent and leaves new tags and prose alone", () => {
    const text = "<nextbillion-read path='a'></nextbillion-read> hello";
    expect(normalizeLegacyTags(text)).toBe(text);
    const once = normalizeLegacyTags("<dyad-read></dyad-read>");
    expect(normalizeLegacyTags(once)).toBe(once);
  });
});
