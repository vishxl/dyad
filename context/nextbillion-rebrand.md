# NextBillion rebrand: what was done, how to deploy it, how to roll it back

**Date:** 2026-10-26
**Branch:** `rebrand/nextbillion` (local; 6 commits ahead of `fork/web-deploy` @ `d9b9f2be`, which is its base). **Not pushed, not deployed.**
**Reports:** `BRANDING_REPORT.md` (results, risks), `STACK_SUMMARY.md` (stack + baseline), `BRANDING_INVENTORY.md` (pre-change hit counts), `branding-allowlist.txt` (every intentional leftover), `context/BRANDING_AUDIT.md` (earlier audit written for the name "NextBuild"; superseded on naming).

---

## 1. Why the VM still shows the old version

The VM runs whatever is checked out in `/opt/dyad/app` (branch `web-deploy`, cloned from `https://github.com/vishxl/dyad.git`, see `deploy/ONE_SHOT_ORACLE.md`). Nothing in this work has reached it:

1. **The branch is local only.** `git ls-remote fork` shows `web-deploy` still at `d9b9f2be`; there is no `rebrand/nextbillion` on the fork. `rebrand/nextbillion` has no upstream configured.
2. **The VM does not auto-update.** There is no CI/CD or webhook. Per `context/dyad-web-deployment.md` section 12, updates are manual `git fetch` + per-file `git checkout FETCH_HEAD -- <file>` because the VM holds hand-edited config (`deploy/oauth2-proxy.cfg` with Google credentials, `/etc/caddy/Caddyfile`, `deploy/env`, `deploy/openviking.service`).
3. **Code is served from the checkout.** The UI is the Vite dev server reading `src/` live, but the API is `dist/headless-server.cjs`, which is **not in git** and must be rebuilt on the VM, then `dyad-web` restarted. A browser also needs a hard refresh (cached bundles).
4. **New dependencies.** The local native package was renamed (`nextbillion-keychain-reader`) and the scaffold's dependency list changed, so `npm install` is required on the VM before the server can start.

So: push, update the checkout, install, rebuild, restart (section 6).

I did not push or touch the VM: both are shared-state actions that need your go-ahead.

---

## 2. Summary of the change

Full white-label rename Dyad -> **NextBillion** (slug `nextbillion`, env prefix `NEXTBILLION_`), logo replacement, removal of every user-visible dyad link/CTA, and compatibility for everything that was persisted under the old name.

Commits on `rebrand/nextbillion` (oldest first, rebrand work only):

| Commit | Content |
|---|---|
| `d7a8f2fa` | Phase 0: `STACK_SUMMARY.md`, `BRANDING_INVENTORY.md`, baseline results |
| `d1854145` | Links/CTAs removed; `src/external_endpoints.ts`; brand-asset generator and generated assets; `scripts/check-branding.mjs`; `scripts/lib/legacy-env.mjs` |
| `6dca50d7` | The rename (1,330 files, 110 file renames) + all compat code + scaffold tagger vendoring + `package.json` identity + `deploy/` client-visible bits |
| `4a1fa5b6` | Allowlist for compat tests |
| `a1392cf6` | OAuth login URL built server-side, logo fixture, e2e snapshots, report |
| `2c7ee7d5` | Final numbers in the report |

The rename was done by a one-off, dry-run-reviewed script (scratch, not committed). It is **not** separable into "user-visible" and "internal identifier" commits: reverting means reverting `6dca50d7` as a whole (plus its dependents).

---

## 3. Rename rules that were applied

Case map: `DYAD` -> `NEXTBILLION`, `Dyad` -> `NextBillion`, `dyad` -> `nextbillion`, and a lower-case `dyad` followed by an upper-case letter -> `nextBillion` (`dyadRequestId` -> `nextBillionRequestId`). Only exact casings match (so `recoveryIntentAlreadyAdvanced` is not touched by the script; it was renamed by hand to `recoveryIntentHasAdvanced` because it contains `dyAd` case-insensitively).

**Never rewritten** (protect list): hosts `*.dyad.sh`; repo slugs `dyad-sh/*`, `wwwillchen/dyad`, `vishxl/dyad`; `dyad-llm-engine`; engine wire ids `dyad/auto|theme-generator|help-bot|image-gen|transcribe`, `gatewayPrefix: "dyad/"`, `dyad_options`, `X-Dyad-Request-Id`, `x-dyad-request-id`, `X-Dyad-Free-Quota-Key`.

**Excluded paths:** `drizzle/` (immutable migration history), lockfiles, `LICENSE`, `NOTICE`, `context/`, `plans/`, `.github/`, `.claude/`, `deploy/` (host-level names), `packages/@dyad-sh/`, and the hand-written compat files.

Gotchas found and fixed after the script ran (useful if you ever redo this):
- **`dataset` keys.** `data-dyad-id` is read as `dataset.dyadId`; the camel rule produced `dataset.nextBillionId`, which no longer matches `data-nextbillion-id`. Fixed to `dataset.nextbillion*` in the three preview worker scripts and two tests.
- **Escaped regex text** (`dyad\.sh`, `dyad-sh\/dyad`) is not matched by the protect list; fixed by hand in the issue-triage/release script tests.
- **Split literals** such as `"<dy" + "ad-write"` in a test were only half renamed.
- **Keychain recovery list** was blindly renamed; restored to the real legacy identity `dyad Safe Storage`.
- **Test expectations about legacy data** (`execution_backend` default, legacy keychain names, release-script repo coordinates, gateway model prefix) were restored to the legacy values.

---

## 4. Compatibility layer (all idempotent, all unit-tested)

| Legacy thing | Handling | File |
|---|---|---|
| `DYAD_*` env vars (the VM's `deploy/env`) | copied to `NEXTBILLION_*` if the new one is unset. Must be the first import of an entry point because modules read env at import time | `src/brand.ts`, `src/legacy_env_bootstrap.ts` (server), `src/main_bootstrap.ts` (Electron), `scripts/lib/legacy-env.mjs` (scripts, `vite.renderer.config.mts`, `forge.config.ts`, `deploy/preview-router.mjs`) |
| Stored chats: `<dyad-*>` tags, `＜dyad` escape, `dyad-media://`, `.dyad/` | one-time SQL `REPLACE` over `messages.content`, `messages.ai_messages_json`, `agent_messages.content`, `agent_activities.presentation_xml`; marker row in table `_nextbillion_migrations`; DB copied to `sqlite.db.pre-nextbillion-tags.bak` first | `src/db/legacy_tag_migration.ts`, called from `initializeDatabase` in `src/db/index.ts` |
| Legacy tags arriving later (model output) | `normalizeLegacyTags` in the markdown parser and `processFullResponseActions`; the Claude Code text filter escapes both dialects | `src/lib/legacy_tags.ts`, `src/ipc/services/claude_code/text.ts` |
| `<app>/.dyad/` | renamed to `.nextbillion/`, `.nextbillion/` appended to the app's `.gitignore`; never overwrites an existing `.nextbillion` | `src/legacy_app_folder_migration.ts`, `src/legacy_app_folder_runner.ts` (called after DB init in `src/main.ts` and `src/server/index.ts`) |
| `~/dyad-apps` | kept if `~/nextbillion-apps` does not exist | `src/paths/paths.ts` |
| Electron userData `<appData>/dyad` | kept if the new dir does not exist (before first use) | `src/main.ts` |
| `chats.execution_backend` value `'dyad'` (rows + SQL default) | drizzle `customType` maps `'dyad'` <-> `'nextbillion'`; column default stays the SQL literal; no migration | `src/db/schema.ts` |
| Settings `enableDyadPro`, `dyadProBudget` | renamed before the zod parse (zod strips unknown keys) | `src/lib/legacy_settings.ts`, `src/main/settings.ts` |
| localStorage (context packs, terminal font size, telemetry consent/user id, pro status, dedupe) | copied to the new key at renderer start, old key left | `src/lib/legacy_local_storage.ts`, `src/legacy_storage_bootstrap.ts` (first import in `src/renderer.tsx`) |
| `x-dyad-rpc-token` header | server accepts both | `src/server/index.ts` |
| `dyad://` | still registered (packager + `setAsDefaultProtocolClient`) and rewritten to `nextbillion://` in `handleDeepLinkReturn` | `src/main.ts`, `forge.config.ts` |
| `# dyad-default-allow-builds*`, `# dyad-auto-denied` in existing apps' `pnpm-workspace.yaml` | recognised, rewritten with new markers on next write | `src/ipc/utils/socket_firewall.ts` |
| "Generated by Dyad" Playwright config/shim files | still treated as generated | `src/ipc/utils/playwright_bootstrap.ts` |
| Apps tagged by the old Vite tagger (`data-dyad-id/name`) | attributes mirrored onto the new names in the preview shim (frame-debounced MutationObserver) | `worker/nextbillion-shim.js` |
| macOS Keychain `dyad Safe Storage` | stays first in the legacy recovery list | `src/main/safe_storage_legacy.ts` |

**Rollback caveat:** after the tag migration ran, stored chats contain `<nextbillion-*>`. Old code cannot render them. To roll code back you must also restore `sqlite.db.pre-nextbillion-tags.bak` (losing anything written since). See section 7.

---

## 5. Other design decisions

- **External services** (`api.`, `engine.`, `academy.`, `oauth.`, `supabase-oauth.`, `helpchat.dyad.sh` + three template repos) live only in `src/external_endpoints.ts`, which must never be imported by renderer code. Overrides: `NEXTBILLION_API_BASE_URL`, `NEXTBILLION_ENGINE_URL`, `NEXTBILLION_ACADEMY_BASE_URL`, `NEXTBILLION_OAUTH_BASE_URL`, `NEXTBILLION_SUPABASE_OAUTH_BASE_URL`, `NEXTBILLION_HELPCHAT_URL` (the old `DYAD_` spelling also works).
- **OAuth login URL** is built in the main process (`ipc.system.openOAuthLogin`, channel `open-oauth-login`) so the hosts are not in the browser bundle. The production renderer bundle was scanned: only the compat strings remain.
- **Community templates** from the upstream API are only fetched when `NEXTBILLION_API_BASE_URL` is set explicitly. The three non-default templates still clone from `github.com/dyad-sh/*` and carry their own branding until forked (edit `TEMPLATE_REPOS`).
- **Scaffold** no longer depends on `@dyad-sh/react-vite-component-tagger`: `scaffold/vite-plugin-component-tagger.ts` is vendored, `@babel/parser`, `estree-walker`, `magic-string` are explicit devDependencies, `scaffold/pnpm-lock.yaml` regenerated with `pnpm install --lockfile-only`. Emits `data-nextbillion-id/name`.
- **`package.json`:** `name` `nextbillion`, `productName` `NextBillion` (duplicate stray `productName` removed), description "AI app builder", author "NextBillion", `repository` removed, `staging:engine` script removed, native package renamed. `package-lock.json` regenerated (`npm install --package-lock-only --ignore-scripts`, 8-line diff).
- **Git author** for commits made on the user's behalf: `NextBillion <noreply@localhost>`.
- **Auto-update** was removed (no feed is contacted); `enableAutoUpdate` is now a no-op.
- **Telemetry** (PostHog key/host in `src/renderer.tsx`) was left unchanged on purpose. It is opt-in.
- **`deploy/`** keeps host-level names (Linux user `dyad`, `/opt/dyad`, unit file names). Client-visible parts changed: oauth2 cookie `_nextbillion_oauth2`, `env.template` variable names, descriptions/comments. `oauth2-proxy.service` accepts either hostname variable name (`NEXTBILLION_PUBLIC_HOSTNAME` or `DYAD_PUBLIC_HOSTNAME`).

---

## 6. Deploying to the VM

Prerequisites: SSH access to the VM; you decide whether to push `rebrand/nextbillion` to `fork` as a new branch or fast-forward `fork/web-deploy` (it is an ancestor, so a fast-forward works).

```sh
# on the laptop
git push fork rebrand/nextbillion          # safe: new branch
# (later, once verified) git push fork rebrand/nextbillion:web-deploy
```

On the VM, following section 12 of `dyad-web-deployment.md` (do **not** plain `git pull`; local config would conflict):

```sh
cd /opt/dyad/app
sudo -u dyad git fetch fork rebrand/nextbillion     # or `origin` if that is how the VM names it
# 1. back up what is hand-maintained (these must survive)
sudo -u dyad cp deploy/oauth2-proxy.cfg deploy/openviking.service deploy/env /tmp/ 2>/dev/null
# 2. stop, so the DB is quiet and the migration backup is consistent
sudo systemctl stop dyad-web
sudo -u dyad cp -a /opt/dyad/deploy-userData /opt/dyad/deploy-userData.pre-rebrand   # full safety copy (DB + settings)
# 3. take the new code, except the files that hold local config
sudo -u dyad git checkout FETCH_HEAD -- . ':(exclude)deploy/oauth2-proxy.cfg' ':(exclude)deploy/openviking.service'
# 4. dependencies and server bundle
sudo -iu dyad bash -lc 'cd /opt/dyad/app && npm install --ignore-scripts && npm rebuild better-sqlite3 dugite && npm run headless:server:build'
# 5. local config edits that belong to this release
#    - deploy/oauth2-proxy.cfg: cookie_name = "_nextbillion_oauth2"   (everyone signs in once more)
#    - /opt/dyad/app/deploy/env: optional, rename DYAD_* to NEXTBILLION_*; the old names still work
sudo systemctl restart dyad-web
# 6. drift audit (mandatory per the runbook)
sudo -iu dyad git -C /opt/dyad/app diff FETCH_HEAD --stat     # only intentional local config may differ
```

If the Caddyfile or oauth2 units changed in your copy, `sudo systemctl daemon-reload && sudo systemctl restart oauth2-proxy caddy`.

What happens on first start (watch `journalctl -u dyad-web -f`):
- `Rewrote legacy tags in N rows` and a file `sqlite.db.pre-nextbillion-tags.bak` next to `sqlite.db`;
- `[legacy-migration] Moved legacy internal folder for N app(s)`;
- the apps folder keeps being `~/dyad-apps` (the fallback), which is expected.

Then: hard-refresh the browser; open an old chat (file cards must render, no raw `<nextbillion-` text); create an app and confirm the preview loads; open Settings -> Providers (keys still present). Running apps restart on their next preview open (or `POST /rpc/restart-app`, see section 12 of the runbook).

Verify the version: the tab title is `NextBillion`, `/favicon.ico` returns the new icon, and `curl -s https://<host>/ | grep -ci dyad` prints `0`.

---

## 7. Rollback

Code only (nothing migrated yet): `git checkout d9b9f2be -- .` equivalent per the runbook (checkout the previous commit, rebuild `dist`, restart).

**After the first start of the new version** the database was rewritten. Roll back with:

```sh
sudo systemctl stop dyad-web
sudo -u dyad cp /opt/dyad/deploy-userData.pre-rebrand/sqlite.db* /opt/dyad/deploy-userData/    # or the .pre-nextbillion-tags.bak, losing newer chats
# app folders: .nextbillion -> .dyad for each app (the old code only reads .dyad)
for d in ~dyad/dyad-apps/*/.nextbillion; do sudo -u dyad mv "$d" "$(dirname "$d")/.dyad"; done
git checkout d9b9f2be -- . && npm install --ignore-scripts && npm run headless:server:build
sudo systemctl start dyad-web
```

Settings: the new code writes `enableNextBillionPro`/`nextBillionProBudget` and drops the old keys; the old code then sees Pro as off. Restore `user-settings.json` from the safety copy if that matters.

---

## 8. Tooling added

| Tool | Use |
|---|---|
| `node scripts/generate-brand-assets.mjs` | rebuilds every raster asset from `assets/brand/logo-source.png` (needs `sharp`; `.icns` needs macOS `iconutil`). Outputs: `assets/icon/logo.{png,ico,icns}`, `assets/logo.png`, `public/favicon.ico`, `public/apple-touch-icon.png`, `scaffold/public/favicon.ico`, `e2e-tests/fixtures/images/logo.png`. Deterministic. Source is 192 px, so large sizes are upscaled |
| `node scripts/check-branding.mjs [--build <dir> ...]` | fails on any case-insensitive `dyad` in tracked files or in build output (content and file names) that is not covered by `branding-allowlist.txt`. Rules: `<glob> [:: <regex on token>]  # reason`, prefix `build:` for build-output rules. To scan the web bundle: `npx vite build -c vite.renderer.config.mts --outDir /tmp/renderer-dist` then `--build /tmp/renderer-dist --build dist` |
| `branding-allowlist.txt` | the authoritative list of what is intentionally left and why |

Last result: `check-branding: OK (4112 tracked files, 2 build dir(s))`.

---

## 9. Test status (details in `BRANDING_REPORT.md` section 9)

- Baseline (before): `npm test` 4 files / 39 tests failing (`grep.spec` 34, `local_agent_grep` 2, `default_chat_mode` 2, `ChatErrorBox` 1); `ts`, `oxlint`, `oxfmt`, headless build, packaged build all pass.
- After: the same failures minus `ChatErrorBox`; typecheck, lint, format, headless build, packaged build (`out/NextBillion-darwin-arm64`) pass.
- Playwright subset of 6 spec files: 9 pass / 2 fail before, 10 pass / 1 fail after (the failure is the same pre-existing one). `select_component` `:4 :37 :72 :100` pass, `:171` (Next.js template) fails before and after; `capacitor` fails before and after.
- Not run: the other ~125 Playwright specs, Windows/Linux builds, signing.
- A full parallel `npm test` run is load-sensitive: a handful of integration files time out and pass when re-run alone.
- Browser smoke test against data created by the **old** server (legacy env names, `~/dyad-apps/<app>/.dyad`, old tags, old settings and localStorage): all migrations ran, the old chat rendered cards without raw tags, title/favicon/links correct, no `dyad` in the DOM or in non-path network traffic.

E2E snapshot changes: all `select_component` aria snapshots (badge removed; the specs now select the paragraph first because the Pro visual-editing toolbar covers it when the heading is selected first), visual-editing and capacitor-adjacent snapshots (badge removal), `attach_image*` (embedded base64 of the new logo fixture), four `engine.*` snapshots (they also absorbed an unrelated upstream change, planning questionnaire 3 -> 5 options, that was already stale), and 3 orphaned snapshots deleted.

---

## 10. Known residuals and things to do by hand

1. **VM host names are still `dyad`** (`/opt/dyad`, user `dyad`, `dyad-web.service`, `~/dyad-apps`). They leak through Vite dev-server source maps, stack traces in RPC error bodies and the `list-apps` response. Fix = host rename (stop services, `usermod -l`, `mv /opt/dyad /opt/nextbillion`, `mv ~/dyad-apps ~/nextbillion-apps`, update units/Caddy/env, daemon-reload) and a production web build instead of the dev server.
2. **Engine wire ids and hosts** stay `dyad` until you run your own gateway. `gatewayPrefix: "dyad/"` is returned to the browser by `get-language-model-providers`.
3. **Templates** other than React are cloned from `dyad-sh/*` repos and are still dyad-branded; fork and edit `TEMPLATE_REPOS`.
4. **Old apps** keep `@dyad-sh/react-vite-component-tagger` in their `package.json`, and the "upgrade app" flow installs it into old projects.
5. **PostHog** still reports (opt-in) to the original project's key.
6. **Electron:** new `productName`/bundle id; Keychain recovery list and userData fallback are in place but untested on a real packaged install; Linux `.desktop` registration only knows `nextbillion://`; `e2e-tests/safe_storage_keychain_identity.spec.ts` (macOS, opt-in) was renamed mechanically and not run.
7. **Logo source is 192 px** and has low contrast on the dark title bar; a vector/1024 px original would improve large icons.
8. **No real-model round trip** was run with the renamed prompts and `<nextbillion-*>` tags.
9. After pulling this branch anywhere: `npm install` (renamed native package; the lockfile is regenerated).

---

## 11. File map (new files)

`src/brand.ts`, `src/external_endpoints.ts`, `src/legacy_env_bootstrap.ts`, `src/legacy_storage_bootstrap.ts`, `src/legacy_app_folder_migration.ts`, `src/legacy_app_folder_runner.ts`, `src/db/legacy_tag_migration.ts`, `src/lib/legacy_tags.ts`, `src/lib/legacy_settings.ts`, `src/lib/legacy_local_storage.ts` (each with a `.test` next to it), `scripts/lib/legacy-env.mjs`, `scripts/generate-brand-assets.mjs`, `scripts/check-branding.mjs`, `scaffold/vite-plugin-component-tagger.ts`, `assets/brand/logo-source.png`, `public/`, `branding-allowlist.txt`, `BRANDING_REPORT.md`, `STACK_SUMMARY.md`, `BRANDING_INVENTORY.md`.
