import { describe, expect, it } from "vitest";
import { renameLegacySettingKeys } from "./legacy_settings";

describe("renameLegacySettingKeys", () => {
  it("moves legacy keys to their new names", () => {
    expect(
      renameLegacySettingKeys({
        enableDyadPro: true,
        dyadProBudget: { a: 1 },
        other: 1,
      }),
    ).toEqual({
      enableNextBillionPro: true,
      nextBillionProBudget: { a: 1 },
      other: 1,
    });
  });

  it("prefers an existing new value and is idempotent", () => {
    const once = renameLegacySettingKeys({
      enableDyadPro: false,
      enableNextBillionPro: true,
    });
    expect(once).toEqual({ enableNextBillionPro: true });
    expect(renameLegacySettingKeys(once)).toEqual(once);
  });
});
