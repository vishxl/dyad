// Settings keys renamed by the rebrand. Zod strips unknown keys, so stored
// values must be moved to the new names before the schema parses them.
const RENAMED_KEYS: Record<string, string> = {
  enableDyadPro: "enableNextBillionPro",
  dyadProBudget: "nextBillionProBudget",
};

export function renameLegacySettingKeys<T extends Record<string, unknown>>(
  settings: T,
): T {
  const out: Record<string, unknown> = { ...settings };
  for (const [from, to] of Object.entries(RENAMED_KEYS)) {
    if (from in out) {
      if (out[to] === undefined) out[to] = out[from];
      delete out[from];
    }
  }
  return out as T;
}
