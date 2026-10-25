// Single source of truth for the product's name and brand-derived identifiers.
// Pure constants only (no node/electron imports) so main, the headless server
// and the renderer can all import it. Legacy (pre-rebrand) names live in
// BRAND.legacy and are used only by compatibility and migration code.

export const BRAND = {
  name: "NextBuild",
  slug: "nextbuild",
  company: "NextBillion",
  homepageUrl: "https://nextbillion.ai",

  // Env vars: NEXTBUILD_*. Legacy DYAD_* values are copied by applyLegacyEnv().
  envPrefix: "NEXTBUILD_",

  // Custom URL schemes (registered in addition to the legacy ones).
  protocolScheme: "nextbuild",
  mediaProtocolScheme: "nextbuild-media",

  // On-disk names.
  appsDirName: "nextbuild-apps",
  // Per-app internal folder, e.g. <app>/.nextbuild/media
  appInternalDirName: ".nextbuild",

  // Custom tag protocol used between the LLM and the app: <nextbuild-write>.
  tagPrefix: "nextbuild-",

  // HTTP header carrying the headless RPC token.
  rpcTokenHeader: "x-nextbuild-rpc-token",

  // Git identity for commits created on a user's behalf.
  gitAuthorName: "NextBuild",
  gitAuthorEmail: "noreply@nextbillion.ai",

  legacy: {
    slug: "dyad",
    envPrefix: "DYAD_",
    protocolScheme: "dyad",
    mediaProtocolScheme: "dyad-media",
    appsDirName: "dyad-apps",
    appInternalDirName: ".dyad",
    tagPrefix: "dyad-",
    rpcTokenHeader: "x-dyad-rpc-token",
    keychainService: "dyad Safe Storage",
    keychainAccount: "dyad Key",
  },
} as const;

/** `NEXTBUILD_FOO` for `envName("FOO")`. */
export function envName(suffix: string): string {
  return `${BRAND.envPrefix}${suffix}`;
}

/**
 * Copies legacy DYAD_* variables to their NEXTBUILD_* names when the new name
 * is unset, so existing deployments (env files, systemd units, shells) keep
 * working. Call once, as early as possible in every process entry point.
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
