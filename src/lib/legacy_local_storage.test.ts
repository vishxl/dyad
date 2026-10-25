import { describe, expect, it } from "vitest";
import { migrateLegacyLocalStorage } from "./legacy_local_storage";

const fake = (initial: Record<string, string>) => {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  };
};

describe("migrateLegacyLocalStorage", () => {
  it("copies old values to new keys without removing the old ones", () => {
    const s = fake({ "dyad-context-packs": "false", dyadProStatus: "true" });
    migrateLegacyLocalStorage(s);
    expect(s.getItem("nextbillion-context-packs")).toBe("false");
    expect(s.getItem("nextBillionProStatus")).toBe("true");
    expect(s.getItem("dyad-context-packs")).toBe("false");
  });

  it("never overwrites an existing new value and is idempotent", () => {
    const s = fake({
      "dyad-context-packs": "false",
      "nextbillion-context-packs": "true",
    });
    migrateLegacyLocalStorage(s);
    migrateLegacyLocalStorage(s);
    expect(s.getItem("nextbillion-context-packs")).toBe("true");
  });

  it("swallows storage errors", () => {
    expect(() =>
      migrateLegacyLocalStorage({
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => {},
      }),
    ).not.toThrow();
  });
});
