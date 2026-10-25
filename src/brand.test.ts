import { describe, expect, it } from "vitest";
import { applyLegacyEnv, BRAND, envName } from "./brand";

describe("brand", () => {
  it("builds env names from the prefix", () => {
    expect(envName("ENGINE_URL")).toBe("NEXTBUILD_ENGINE_URL");
  });

  it("copies legacy env vars when the new name is unset", () => {
    const env: Record<string, string | undefined> = {
      DYAD_DATA_DIR: "/old",
      UNRELATED: "x",
    };
    applyLegacyEnv(env);
    expect(env.NEXTBUILD_DATA_DIR).toBe("/old");
    expect(env.DYAD_DATA_DIR).toBe("/old");
    expect(env.UNRELATED).toBe("x");
  });

  it("never overrides an explicitly set new variable", () => {
    const env: Record<string, string | undefined> = {
      DYAD_DATA_DIR: "/old",
      NEXTBUILD_DATA_DIR: "/new",
    };
    applyLegacyEnv(env);
    expect(env.NEXTBUILD_DATA_DIR).toBe("/new");
  });

  it("is idempotent", () => {
    const env: Record<string, string | undefined> = { DYAD_X: "1" };
    applyLegacyEnv(env);
    applyLegacyEnv(env);
    expect(Object.keys(env).sort()).toEqual(["DYAD_X", "NEXTBUILD_X"]);
  });

  it("keeps new and legacy identifiers distinct", () => {
    expect(BRAND.appsDirName).not.toBe(BRAND.legacy.appsDirName);
    expect(BRAND.tagPrefix).not.toBe(BRAND.legacy.tagPrefix);
  });
});
