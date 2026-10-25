import { cleanFullResponse } from "@/ipc/utils/cleanFullResponse";
import { describe, it, expect } from "vitest";

describe("cleanFullResponse", () => {
  it("should replace < characters in nextbillion-write attributes", () => {
    const input = `<nextbillion-write path="src/file.tsx" description="Testing <a> tags.">content</nextbillion-write>`;
    const expected = `<nextbillion-write path="src/file.tsx" description="Testing ＜a＞ tags.">content</nextbillion-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should replace < characters in multiple attributes", () => {
    const input = `<nextbillion-write path="src/<component>.tsx" description="Testing <div> tags.">content</nextbillion-write>`;
    const expected = `<nextbillion-write path="src/＜component＞.tsx" description="Testing ＜div＞ tags.">content</nextbillion-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle multiple nested HTML tags in a single attribute", () => {
    const input = `<nextbillion-write path="src/file.tsx" description="Testing <div> and <span> and <a> tags.">content</nextbillion-write>`;
    const expected = `<nextbillion-write path="src/file.tsx" description="Testing ＜div＞ and ＜span＞ and ＜a＞ tags.">content</nextbillion-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle complex example with mixed content", () => {
    const input = `
      BEFORE TAG
  <nextbillion-write path="src/pages/locations/neighborhoods/louisville/Highlands.tsx" description="Updating Highlands neighborhood page to use <a> tags.">
import React from 'react';
</nextbillion-write>
AFTER TAG
    `;

    const expected = `
      BEFORE TAG
  <nextbillion-write path="src/pages/locations/neighborhoods/louisville/Highlands.tsx" description="Updating Highlands neighborhood page to use ＜a＞ tags.">
import React from 'react';
</nextbillion-write>
AFTER TAG
    `;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle other nextbillion tag types", () => {
    const input = `<nextbillion-rename from="src/<old>.tsx" to="src/<new>.tsx"></nextbillion-rename>`;
    const expected = `<nextbillion-rename from="src/＜old＞.tsx" to="src/＜new＞.tsx"></nextbillion-rename>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle nextbillion-delete tags", () => {
    const input = `<nextbillion-delete path="src/<component>.tsx"></nextbillion-delete>`;
    const expected = `<nextbillion-delete path="src/＜component＞.tsx"></nextbillion-delete>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should not affect content outside nextbillion tags", () => {
    const input = `Some text with <regular> HTML tags. <nextbillion-write path="test.tsx" description="With <nested> tags.">content</nextbillion-write> More <html> here.`;
    const expected = `Some text with <regular> HTML tags. <nextbillion-write path="test.tsx" description="With ＜nested＞ tags.">content</nextbillion-write> More <html> here.`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle empty attributes", () => {
    const input = `<nextbillion-write path="src/file.tsx">content</nextbillion-write>`;
    const expected = `<nextbillion-write path="src/file.tsx">content</nextbillion-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle attributes without < characters", () => {
    const input = `<nextbillion-write path="src/file.tsx" description="Normal description">content</nextbillion-write>`;
    const expected = `<nextbillion-write path="src/file.tsx" description="Normal description">content</nextbillion-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });
});
