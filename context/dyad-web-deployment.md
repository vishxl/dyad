# Dyad Web Deployment — Hosted Multi-User Runbook

**Date:** 2026-10-22
**Repo/worktree:** `/Users/vishal/dyad-web-deploy` (branch `web-deploy`, base `05d5b7a0` = `headless-web-port` rollback point)
**Goal:** Let 5-10 teammates open Dyad in their own browsers (remote team), sign in with `@nextbillion.ai` Google accounts, and create apps with live previews. Shared workspace + shared key pool accepted for phase 1.

---

## 1. What was done (high level)

1. **New worktree/branch `web-deploy`** off `headless-web-port` (`05d5b7a0`) so the working version stays untouched as the rollback point. All deployment code + artifacts live here.
2. **Three small env-gated code diffs** make the existing single-user headless server reachable behind a reverse proxy. With env unset, desktop/dev behavior is unchanged (selector tests + proxy smoke test verify both modes).
3. **`deploy/` artifacts** for an Oracle Cloud always-free ARM VM: Caddyfile, oauth2-proxy config + systemd unit, dyad-web/openviking units, sslip.io env template, secret-setup + provisioning scripts, and a zero-dependency preview-router fallback router.
4. **Free stack**: Oracle free ARM VM (host), sslip.io DNS (free), Let's Encrypt via Caddy (free), oauth2-proxy + free Google OAuth client (auth gate), Langfuse free tier or off.

## 2. Why these choices

- **No per-user isolation yet** (phase 1): one sqlite DB, one `~/dyad-apps`-style workspace, one settings/key store, one WS broadcast bus (`src/server/index.ts` `browserClients`). OAuth restricts *who*, not *what they see*. The auth proxy passes `X-Forwarded-Email` on every request — phase-2 identity plumbing — so phase 2 adds only per-socket event routing + per-user DB scoping.
- **Path-based previews** (`/preview/<port>/`) over subdomains: no DNS/hosts setup for teammates. Tradeoff: previews are same-origin with the UI (iframe already sandboxed; accepted for 5-10 trusted people). Phase-2 upgrade: wildcard subdomains + real DNS.
- **TLS required**: preview proxy forces `Secure; SameSite=None` cookies; plain HTTP drops them (breaks generated-app login flows). Caddy + Let's Encrypt handles it.
- **Vite dev server stays**: fine for 5-10 users; production build is a later item.

## 3. Topology

```
Teammate browser → https://<ip-dashes>.sslip.io (Caddy :443, Let's Encrypt)
                   ├─ forward_auth → oauth2-proxy :4180 (Google, @nextbillion.ai)
                   ├─ /oauth2/*          → 127.0.0.1:4180
                   ├─ /rpc/*  and /ws    → 127.0.0.1:3000 (headless server)
                   ├─ /preview/<port>/*  → 127.0.0.1:<port> (preview proxy workers)
                   └─ /*                 → 127.0.0.1:4173 (Vite UI)
```

All Dyad processes keep their hardcoded 127.0.0.1 binds — zero bind changes. Only 80/443 open in the Oracle security list + VM firewall.

## 4. Code changes (branch `web-deploy`, commit 9dce957c)

| File | Change |
|---|---|
| `src/app_run/public_preview_url.ts` (new) | `toPublicPreviewUrl(appUrl)`: when `VITE_PREVIEW_URL_TEMPLATE` set, rewrite `http://localhost:<port>`/`http://app-N.localhost:<port>` origins to the template with `{port}` filled. Reads `process.env` first (so `vi.stubEnv` works in tests), falls back to `import.meta.env` in the browser. |
| `src/app_run/selectors.ts` | `selectRemoteAppUrl` wraps the returned `appUrl` with `toPublicPreviewUrl` — single choke point covering iframe src, address bar, recorder. `originalUrl` untouched (cosmetic "open externally" gap, below). |
| `worker/proxy_server.js` | Behind `DYAD_PREVIEW_PUBLIC_URL_BASE` (hosted mode): **keep** the `/preview/<port>` prefix on the forwarded path (the dev server runs Vite with matching `--base`, so the prefix must reach it), **except for data requests** — `sec-fetch-dest: empty` (fetch/XHR) is stripped, because app server-route middleware (e.g. nitro dev routes) matches unprefixed `/api/*` regardless of Vite's base and its catch-all renders HTML for the prefixed form; non-browser clients (no sec-fetch header) keep the prefix; accept WS Origin = public origin (HMR); rewrite same-origin redirects to the public prefix; rewrite root-absolute asset URLs in HTML to the public prefix; scope injected service worker to the public prefix (`service-worker-allowed` header + rewritten `register()` call) so an app's SW can't hijack the UI origin; reject dot-segment path escapes with 400. Host check unchanged (Caddy sends `Host localhost:<port>`). Desktop/dev (env unset): prefix is stripped as always. |
| `src/ipc/services/app_runtime_service.ts` | `getViteBaseArg`: when `DYAD_PREVIEW_PUBLIC_URL_BASE` is set and the app has a Vite config, launch the dev server with `--base /preview/<port>/`. This is what makes Vite emit prefix-correct module URLs (`import "/preview/<port>/src/App.tsx"`) so imports inside transformed JS can't escape the prefix. |
| `scaffold/src/App.tsx` | `<BrowserRouter basename={import.meta.env.BASE_URL}>` — Vite sets BASE_URL to `--base`, so generated-app routes resolve under the hosted preview prefix. Desktop/dev BASE_URL is `/`, behavior unchanged. Apps scaffolded before this change need the same one-line edit. |
| `worker/dyad-shim.js` | Injected into every preview page. In hosted mode (prefix substituted at injection) it patches `fetch`/`XMLHttpRequest` to re-add the `/preview/<port>` prefix to same-origin URLs (`fetch("/api/...")` and `${location.origin}/api/...` — map libraries like maplibre build absolute URLs — otherwise land on the Dyad UI host, which answers with its SPA-fallback HTML at 200 — silently breaking the feature). No-op on desktop/dev (prefix is null). |
| `src/server/index.ts` | `/ws` WebSocket server: per-connection + server-level `error` handlers. A malformed client frame (observed: `WS_ERR_EXPECTED_MASK` through the proxy chain) otherwise throws unhandled and crashes the whole headless process, 502-ing every route. |
| `vite.renderer.config.mts` | `allowedHosts` from `DYAD_VITE_ALLOWED_HOSTS` (Vite blocks unknown Host headers by default). |
| `deploy/*` (new) | Caddyfile (incl. 308-redirect `/preview/<port>` → `/preview/<port>/`, below), oauth2-proxy.cfg + unit, dyad-web.service, openviking.service, env.template, setup-secrets.sh, provision-vm.sh, preview-router.mjs (fallback router). |

**Preview invariants (all four must hold at once — break any one and the preview is blank):**
1. The browser URL always carries the trailing slash: `/preview/<port>/`. Caddy 308-redirects the slash-less form because React Router's `basename` only matches URLs that start with the basename *including* the trailing slash.
2. Vite runs with `--base /preview/<port>/` (hosted mode), so every URL it emits — HTML asset tags *and* imports inside transformed JS — carries the prefix.
3. In hosted mode the proxy worker forwards the full prefixed path upstream (it must NOT strip, or Vite 404s everything outside its base). Desktop/dev strips as before.
4. The generated app's router uses `basename={import.meta.env.BASE_URL}`, so in-app routes resolve relative to the prefix.
5. Root-absolute data calls resolve back into the preview: the injected shim rewrites both `fetch("/api/...")` and `fetch("https://<host>/api/...")` (same-origin absolute) to the prefixed URL, and the worker strips the prefix again for `sec-fetch-dest: empty` requests so app server routes (nitro-style, matched at root) receive them. Assets (scripts/styles/documents) keep the prefix for Vite's `--base`.
Non-Vite apps get no `--base` and are not expected in hosted deployments (Dyad apps are Vite).

No changes to `src/server/index.ts`, `rpc_access.ts`, `run-headless-browser.mjs` (pinned token reuse + env passthrough already worked).

## 5. VM setup, step by step

1. **Oracle VM**: sign up (credit card for identity verification only), create VM.Standard.A1.Flex (2-4 OCPU, 12-24GB), Ubuntu 24.04 aarch64. Note the public IP.
2. **Security list / NSG**: ingress 80/tcp + 443/tcp from 0.0.0.0/0. **And the VM's own firewall**: OCI Ubuntu images ship an iptables REJECT-all (except 22) *inside* the instance — the security list alone is not enough. Insert accepts before the REJECT rule and persist them:
   ```sh
   sudo iptables -I INPUT 1 -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT 1 -p tcp --dport 443 -j ACCEPT
   sudo apt -y install iptables-persistent && sudo netfilter-persistent save
   ```
3. **Provision**: `scp -r` the worktree (or push `web-deploy` to your fork and clone). Then:
   ```sh
   sudo bash deploy/provision-vm.sh <ip-with-dashes>.sslip.io
   ```
   This installs Node 24 + git + caddy + oauth2-proxy, creates the `dyad` user, checks out to `/opt/dyad/app`, installs deps (native modules build for arm64), generates `deploy/env` + cookie secret via `deploy/setup-secrets.sh`, writes the Caddyfile with the hostname filled, and installs systemd units. **Edit `deploy/oauth2-proxy.cfg`**: Google OAuth client id/secret (redirect URI `https://<host>/oauth2/callback`).
4. **Start services**:
   `sudo systemctl enable --now oauth2-proxy dyad-web openviking`
5. **LLM keys + context packs**: configure provider keys once in Dyad settings through the UI (stored in `/opt/dyad/deploy-userData/settings.json` — plaintext headless, readable by any signed-in teammate: acceptable for phase 1, fix in phase 2). OpenViking: copy `~/.openviking/ov.conf` from your Mac to `/opt/dyad/.openviking/`, and re-ingest the NextBillion corpus per the §15 runbook in `context/dyad-headless-browser.md`.

## 6. Teammate onboarding

Share one URL: `https://<ip-with-dashes>.sslip.io`. Each teammate:
1. Opens it → redirected to Google sign-in → only `@nextbillion.ai` accepted.
2. Everything else is identical to desktop Dyad. No hosts edits, no CA installs.

## 7. Verification (all passing unless noted)

**Automated (this branch):**
- `src/app_run/selectors.test.ts` — 5/5 (passthrough when template unset; localhost/app-N.localhost/127.0.0.1 rewrite when set; non-localhost untouched).
- `.claude/tmp/smoke-proxy.js` — 9/9: legacy mode (plain path + previewOrigin redirect) AND hosted mode (prefix strip, prefix-root, redirect→public prefix, traversal→400, SW under prefix, SW-register rewritten to prefixed scope, WS upgrade with public Origin accepted).
- `caddy validate` on both the production template and local test Caddyfile, incl. placeholder-upstream routing (Caddy ≥2.7 confirmed: v2.11.7).

**Live local rehearsal (full topology through Caddy, no TLS/SSO) — verified 2026-10-22:**
- RPC direct +token → 200; without token → 403 (gate enforced); via Caddy with Origin+token → 200.
- UI via Caddy → 200 (Vite dev HTML); `VITE_PREVIEW_URL_TEMPLATE` confirmed baked into the served renderer JS.
- `/ws?token=` via Caddy → 101 Switching Protocols.
- Real `worker/proxy_server.js` spawned in hosted mode behind Caddy: `/preview/<port>/` routed via placeholder upstream (Host rewritten to `localhost:<port>`), upstream content returned, injected SW register rewritten to the public prefix. Verify script: `.claude/tmp/verify-preview-rewrite.js` (3/3).
- **Caddy convention:** `/preview/*` is forwarded **unrewritten** (no `rewrite` in the Caddyfile). In hosted mode the worker forwards the prefix to Vite (invariant 3 above); desktop/dev strips it. The slash-less `/preview/<port>` is 308-redirected by Caddy (invariant 1). The fallback preview-router forwards the full path the same way.
- **Auth-gate placement:** `forward_auth` subrequests hit oauth2-proxy at a fixed `/oauth2/auth` URI, so oauth2-proxy-side path skips (`skip_auth_regex`/`skip_auth_routes`) never see the original path. To exempt a path from auth, exclude it in the **Caddy matcher** (`@authable not path /oauth2/* /preview/*`). Previews stay behind the gate.

**Manual (run on the VM after setup):**
```sh
# Auth gate: expect 302 to Google
curl -sI https://<host>/ | head -1
# Token gate still enforced behind the proxy: expect 403
curl -s https://<host>/rpc/list-apps | head -1
# UI through Caddy (after Google sign-in in a browser)
# Preview: create an app, confirm iframe src is https://<host>/preview/<port>/...
# Two browsers simultaneously; sudo reboot → systemd brings all back
```

## 8. Known phase-1 limitations

- **Shared everything**: one workspace, one settings/key store (plaintext headless), all WS events fan out to every browser, one server-wide 1000-msg/23h free-agent quota (basic agent mode only). OAuth restricts who, not what they see.
- **"Open externally" preview link** shows the localhost URL — broken for teammates (cosmetic).
- **Vite dev server** serves the UI (fine for 5-10; production build is a later item).
- **Restart wipes in-memory blueprint store** (desktop parity; reload rehydrates via `app-blueprint:get-state`).
- **No WS event replay after page reload** for live streams (desktop parity).

## 9. Preview architecture: replace the path prefix with wildcard subdomains

**Status: recommended, not yet done. Take this up before phase 2.**

### The root cause, stated once

Every preview bug fixed so far traces to a single decision: hosting multiple
apps on a **shared origin under path prefixes** (`/preview/<port>/`). Web
software — dev servers, SPA routers, app code — assumes it owns the origin
root; a path prefix violates that assumption in three independent places
(Vite module URLs, the router's `location.pathname`, app-authored
root-absolute URLs), and each workaround addressed one of them. The
workarounds work but form a patch tower: `--base`, router `basename`,
worker keep/strip-by-`sec-fetch-dest`, the fetch/XHR shim, the slash
redirect.

### What the prefix tower still does NOT cover (known gaps, audited on 2026-10-23)

- Raw `<a href="/...">` and `<form action="/...">`: full-page navigations
  escape the prefix and land on the Dyad UI (RouteLoop's header logo and
  404 "Return to Home" both do this today).
- `fetch(new Request("/..."))`, URL-object fetches, `EventSource("/...")`,
  app-created `new WebSocket("/...")`, `window.open("/...")`.
  (Same-origin *string* URLs — both root-absolute and
  `location.origin`-prefixed — ARE covered by the shim as of v0.8.0.)
- Static CSS `url(/...)` in files Vite does not transform.

Closing these means patching yet more browser APIs (click interception,
EventSource/WebSocket patching) — diminishing returns; don't.

### Recommendation

Move previews to **wildcard subdomains** — `app-<port>.<real-domain>` —
where each app owns its origin root and the entire tower becomes
unnecessary and deletable:

1. Buy a real domain (~$10/yr). sslip.io cannot do wildcard TLS cleanly:
   Let's Encrypt rate-limits per registered domain and sslip.io is shared
   by everyone, so per-subdomain certificate issuance is unreliable.
2. DNS: wildcard `*.app.<domain>` → VM IP; Caddy gets a wildcard cert via
   DNS-01 challenge (needs the domain's DNS provider API token in Caddy).
3. Caddy: replace the `/preview/*` block with `*.app.<domain>` site block
   proxying to `127.0.0.1:<port>` derived from the hostname (on-demand or
   wildcard cert; host stays `localhost:<port>` via `header_up`).
4. Delete the tower: unset/retire `DYAD_PREVIEW_PUBLIC_URL_BASE`,
   `VITE_PREVIEW_URL_TEMPLATE` becomes `https://app-{port}.<domain>/`
   (origin-root, no path), remove the worker prefix logic, the shim's
   URL patch, the `--base` injection, and the slash redirect. Apps then
   run desktop-identical: no basename needed, no fetch rewriting.
5. Auth: `forward_auth` applies to the wildcard site block as today.

What survives regardless: the `/ws` error hardening, the auth-gate
placement rules (§7), the `X-Forwarded-Email` phase-2 plumbing, and the
scaffold `basename={import.meta.env.BASE_URL}` (a no-op at origin root,
harmless to keep).

### Interim guidance (until subdomains land)

- The current path-prefix setup works for its tested scope: page load,
  client-side routing, `fetch`/XHR string URLs, HMR, service worker.
- Don't add further browser-API patches to the shim; each one grows the
  tower for a class of bug subdomains eliminate entirely.
- A generated app that relies on the uncovered classes above (raw root-
  absolute links, SSE, app WebSockets) needs either app-level fixes
  (relative URLs, `import.meta.env.BASE_URL`-prefixed links) or the
  subdomain migration.


## 10. Phase 2 (per-user isolation) — what changes

1. Consume `X-Forwarded-Email` (already forwarded by Caddy `forward_auth`) as the user identity on `/rpc` + `/ws`.
2. Per-socket event routing: replace `broadcastToBrowserClients` fan-out with chatId/appId-scoped routing (`src/server/index.ts`).
3. Per-user DB row scoping on apps/chats/settings; per-user provider keys.
4. Previews on wildcard subdomains per §9 (prerequisite for per-user app isolation).

## 11. Rollback

- Working version stays intact: `headless-web-port` @ `05d5b7a0` in `/Users/vishal/dyad`.
- On the VM: stop `dyad-web.service`, check out `05d5b7a0`, restart. (The diffs are env-gated, so even `web-deploy` code without the env vars behaves identically to the rollback point.)

## 12. Updating the VM's checkout

The VM carries hand-maintained local config (`/etc/caddy/Caddyfile` with the hostname, `deploy/oauth2-proxy.cfg` with Google credentials) — a plain `git pull` on `/opt/dyad/app` silently no-ops or conflicts against those. Update per-file instead:

```sh
sudo -u dyad git -C /opt/dyad/app fetch origin web-deploy
sudo -u dyad git -C /opt/dyad/app checkout FETCH_HEAD -- worker/proxy_server.js   # only the files being updated
```

`dist/headless-server.cjs` is not in git — rebuild it on the VM after checking out `src/` changes (`cd /opt/dyad/app && npm run headless:server:build`), then `sudo systemctl restart dyad-web`.

After a code update, each app's runtime restarts on its next preview open; force one immediately via `POST /rpc/restart-app {"appId":N}` with the `x-dyad-rpc-token` header and an allowlisted Origin.