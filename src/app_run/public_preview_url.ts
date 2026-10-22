/**
 * Rewrites preview URLs for remote (hosted) deployments.
 *
 * In a hosted deployment (see context/dyad-web-deployment.md) teammates' browsers
 * cannot reach the server host's `localhost:<proxyPort>` preview origins. When
 * VITE_PREVIEW_URL_TEMPLATE is set (e.g. "https://1-2-3-4-5-6.sslip.io/preview/{port}"),
 * the preview origin is rewritten to the template with {port} filled from the URL.
 * The reverse proxy strips the /preview/<port> prefix and forwards to 127.0.0.1:<port>
 * (worker/proxy_server.js supports this via DYAD_PREVIEW_PUBLIC_URL_BASE).
 *
 * Unset env → URLs pass through unchanged (local dev / desktop behavior identical).
 */

// ponytail: single regex, not a URL parser — appUrl is always http://host:<port> from proxy_server.js
const PREVIEW_ORIGIN_RE =
  /^http:\/\/(?:[\w-]+\.localhost|localhost|127\.0\.0\.1):(\d+)(?=\/|$)/;

export function toPublicPreviewUrl(appUrl: string): string {
  // Read process.env when available (main process + Vitest, so vi.stubEnv
  // works); fall back to import.meta.env in the browser where `process`
  // doesn't exist. Defensive access keeps non-Vite consumers working
  // (same pattern as src/ipc/contracts/core.ts).
  const template =
    typeof process !== "undefined" && process.env
      ? process.env.VITE_PREVIEW_URL_TEMPLATE
      : (import.meta as { env?: Record<string, string | undefined> }).env
          ?.VITE_PREVIEW_URL_TEMPLATE;
  if (!template) {
    return appUrl;
  }
  const match = appUrl.match(PREVIEW_ORIGIN_RE);
  if (!match) {
    return appUrl;
  }
  return appUrl.replace(
    PREVIEW_ORIGIN_RE,
    template.replace("{port}", match[1]),
  );
}
