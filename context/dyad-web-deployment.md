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
| `worker/proxy_server.js` | Behind `DYAD_PREVIEW_PUBLIC_URL_BASE`: accept inbound `/preview/<port>/...` paths (prefix stripped before `buildTargetURL` — the reverse proxy forwards the full path unrewritten, making the worker the single source of truth for the prefix); accept WS Origin = public origin (HMR); rewrite same-origin redirects to the public prefix; scope injected service worker to the public prefix (`service-worker-allowed` header + rewritten `register()` call) so an app's SW can't hijack the UI origin; reject dot-segment path escapes with 400. Host check unchanged (Caddy sends `Host localhost:<port>`). |
| `vite.renderer.config.mts` | `allowedHosts` from `DYAD_VITE_ALLOWED_HOSTS` (Vite blocks unknown Host headers by default). |
| `deploy/*` (new) | Caddyfile, oauth2-proxy.cfg + unit, dyad-web.service, openviking.service, env.template, setup-secrets.sh, provision-vm.sh, preview-router.mjs (fallback router). |

No changes to `src/server/index.ts`, `rpc_access.ts`, `run-headless-browser.mjs` (pinned token reuse + env passthrough already worked).

## 5. VM setup, step by step

1. **Oracle VM**: sign up (credit card for identity verification only), create VM.Standard.A1.Flex (2-4 OCPU, 12-24GB), Ubuntu 24.04 aarch64. Note the public IP.
2. **Security list / NSG**: ingress 80/tcp + 443/tcp from 0.0.0.0/0. Ubuntu's ufw: `sudo ufw allow 80,443/tcp`.
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
- **Caddy convention:** `/preview/*` is forwarded **unrewritten** (no `rewrite` in the Caddyfile); the worker strips the prefix. The fallback preview-router forwards the full path the same way.
  **Update (2026-10-23): in hosted mode the worker no longer strips** — when `DYAD_PREVIEW_PUBLIC_URL_BASE` is set the dev server runs Vite with matching `--base /preview/<port>/`, so the prefix must reach Vite. Stripping made Vite reject every request outside its base ("server is configured with a public base URL" 404) and left root-absolute JS module imports (`import "/src/App.tsx"`) escaping the prefix → blank preview. Desktop/dev (env unset) still strips. Related: the scaffold template's `<BrowserRouter>` now uses `basename={import.meta.env.BASE_URL}`, so generated-app routes resolve under the prefix; apps created before this change need the same one-line edit in `src/App.tsx`.
- **Auth-gate placement:** `forward_auth` subrequests hit oauth2-proxy at a fixed `/oauth2/auth` URI, so oauth2-proxy-side path skips (`skip_auth_regex`/`skip_auth_routes`) never see the original path. To exempt a path from auth, exclude it in the **Caddy matcher** (`@authable not path /oauth2/* /preview/*`).

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

## 9. Phase 2 (per-user isolation) — what changes

1. Consume `X-Forwarded-Email` (already forwarded by Caddy `forward_auth`) as the user identity on `/rpc` + `/ws`.
2. Per-socket event routing: replace `broadcastToBrowserClients` fan-out with chatId/appId-scoped routing (`src/server/index.ts`).
3. Per-user DB row scoping on apps/chats/settings; per-user provider keys.
4. Optional: wildcard-subdomain previews (`app-N.<real-domain>`) + real DNS.

## 10. Rollback

- Working version stays intact: `headless-web-port` @ `05d5b7a0` in `/Users/vishal/dyad`.
- On the VM: stop `dyad-web.service`, check out `05d5b7a0`, restart. (The three diffs are env-gated, so even `web-deploy` code without the env vars behaves identically to the rollback point.)