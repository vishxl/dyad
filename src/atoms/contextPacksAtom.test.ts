import { getDefaultStore } from "jotai";
import { describe, expect, it, vi } from "vitest";

/** The default is computed at module load, so each case re-imports the module
 * with resetModules after stubbing the hosted-mode env var, then reads the
 * atom's initial value from the default store (no localStorage entry set). */
describe("contextPacksAtom default", () => {
  it("defaults to all packs ON in hosted mode", async () => {
    vi.stubEnv(
      "VITE_PREVIEW_URL_TEMPLATE",
      "https://1-2-3-4-5-6.sslip.io/preview/{port}",
    );
    vi.resetModules();
    const { contextPacksAtom } = await import("./chatAtoms");
    expect(getDefaultStore().get(contextPacksAtom)).toEqual([
      "nextbillion",
      "stripi",
    ]);
  });

  it("defaults to all packs OFF on desktop", async () => {
    vi.stubEnv("VITE_PREVIEW_URL_TEMPLATE", "");
    vi.resetModules();
    const { contextPacksAtom } = await import("./chatAtoms");
    expect(getDefaultStore().get(contextPacksAtom)).toEqual([]);
  });
});
