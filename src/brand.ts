// Single source of truth for the product name and the legacy (pre-rebrand)
// identifiers that compatibility code still has to recognise. Pure constants
// only (no node/electron imports) so main, the headless server and the
// renderer can all import it.

export const BRAND = {
  name: "NextBillion",
  slug: "nextbillion",
  envPrefix: "NEXTBILLION_",

  legacy: {
    slug: "dyad",
    envPrefix: "DYAD_",
    protocolScheme: "dyad",
    mediaProtocolScheme: "dyad-media",
    appsDirName: "dyad-apps",
    appInternalDirName: ".dyad",
    tagPrefix: "dyad-",
    rpcTokenHeader: "x-dyad-rpc-token",
    domIdAttribute: "data-dyad-id",
    domNameAttribute: "data-dyad-name",
  },
} as const;

/** Only used where a site reference is structurally required (e.g. OpenRouter app attribution). */
export const NEXTBILLION_WEBSITE_URL = "https://nextbillion.ai";

/** `NEXTBILLION_FOO` for `envName("FOO")`. */
export function envName(suffix: string): string {
  return `${BRAND.envPrefix}${suffix}`;
}

/**
 * Copies legacy DYAD_* variables to their NEXTBILLION_* names when the new
 * name is unset, so existing deployments (env files, systemd units, shells)
 * keep working. Call once, as early as possible in every process entry point.
 */
export function applyLegacyEnv(
  env: Record<string, string | undefined> = process.env,
): void {
  const { envPrefix: oldPrefix } = BRAND.legacy;
  for (const key of Object.keys(env)) {
    if (!key.startsWith(oldPrefix)) continue;
    const next = `${BRAND.envPrefix}${key.slice(oldPrefix.length)}`;
    if (env[next] === undefined) env[next] = env[key];
  }
}
