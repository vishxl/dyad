// Browser storage keys renamed by the rebrand. Copies each old value to its new
// key once (never overwriting a value already stored under the new key) so
// per-browser preferences survive. Old keys are left in place.
export const LEGACY_LOCAL_STORAGE_KEYS: ReadonlyArray<
  readonly [string, string]
> = [
  ["dyad-context-packs", "nextbillion-context-packs"],
  ["dyad:terminal-font-size", "nextbillion:terminal-font-size"],
  ["dyadTelemetryConsent", "nextBillionTelemetryConsent"],
  ["dyadTelemetryUserId", "nextBillionTelemetryUserId"],
  ["dyadProStatus", "nextBillionProStatus"],
  ["dyadPostHogErrorDedupe:v1", "nextBillionPostHogErrorDedupe:v1"],
];

export function migrateLegacyLocalStorage(
  storage: Pick<Storage, "getItem" | "setItem">,
): void {
  try {
    for (const [from, to] of LEGACY_LOCAL_STORAGE_KEYS) {
      const value = storage.getItem(from);
      if (value !== null && storage.getItem(to) === null) {
        storage.setItem(to, value);
      }
    }
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); nothing to migrate.
  }
}
