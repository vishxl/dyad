// Every remote service this app talks to that is owned by the original open-source
// project (not by us). Main-process / server code ONLY: never import this from the
// renderer, so none of these hostnames reach a browser bundle.
//
// All hosts are overridable so a self-hosted gateway can be dropped in later:
//   NEXTBILLION_API_BASE_URL, NEXTBILLION_ENGINE_URL, NEXTBILLION_ACADEMY_BASE_URL,
//   NEXTBILLION_OAUTH_BASE_URL, NEXTBILLION_SUPABASE_OAUTH_BASE_URL,
//   NEXTBILLION_HELPCHAT_URL. The legacy DYAD_* spelling of each is still honoured.

function fromEnv(name: string, fallback: string): string {
  return (
    process.env[`NEXTBILLION_${name}`] ??
    process.env[`DYAD_${name}`] ??
    fallback
  ).replace(/\/+$/, "");
}

export const apiBaseUrl = () => fromEnv("API_BASE_URL", "https://api.dyad.sh");
export const engineBaseUrl = () =>
  fromEnv("ENGINE_URL", "https://engine.dyad.sh/v1");
export const academyBaseUrl = () =>
  fromEnv("ACADEMY_BASE_URL", "https://academy.dyad.sh");
export const oauthBaseUrl = () =>
  fromEnv("OAUTH_BASE_URL", "https://oauth.dyad.sh");
export const supabaseOauthBaseUrl = () =>
  fromEnv("SUPABASE_OAUTH_BASE_URL", "https://supabase-oauth.dyad.sh");
export const helpchatBaseUrl = () =>
  fromEnv("HELPCHAT_URL", "https://helpchat.dyad.sh/v1");

/** Hosts (besides the overridable ones above) that count as first-party for the external-link allowlist. */
export function isExternalServiceHost(host: string): boolean {
  return host === "dyad.sh" || host.endsWith(".dyad.sh");
}

// Template repositories cloned at runtime (owned by the original project, not by us).
// Fork them under our own org and change these URLs; ids match src/shared/templates.ts.
const TEMPLATE_REPOS: Record<string, string> = {
  next: "https://github.com/dyad-sh/nextjs-template",
  "react-vite-nitro": "https://github.com/dyad-sh/react-vite-nitro",
  "portal-mini-store": "https://github.com/dyad-sh/portal-mini-store-template",
};
export const templateRepoUrl = (id: string): string | undefined =>
  TEMPLATE_REPOS[id];
