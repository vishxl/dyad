# NextBuild Rebrand — Branding Audit (Phase 1)

Branch: `rebrand/nextbuild` (off `web-deploy-fresh`). No source changes were made in this phase.
Detail for each bucket is appended below (Appendix A–D) with file paths and line references.

## 1. Footprint

| Metric | Value |
|---|---|
| Tracked files | 4,105 |
| Files containing "dyad" (case-insensitive, contents) | 1,538 |
| Total hits | ~19.5k (11.1k in `src/`, 730 `plans/`, 707 `e2e-tests/`, 427 `benchmarks/`, 237 `worker/`, 153 `scripts/`, 121 `rules/`, 119 `.claude/`, 92 `.github/`, 71 `deploy/`, 69 `testing/`, 68 `docs/`, 55 `packages/`) |
| Tracked filenames containing "dyad" | 128 (66 in `src/components/chat/`, 11 `packages/@dyad-sh/*`, 9 `worker/dyad-*.js`, 7 `e2e-tests/fixtures/import-app/minimal-with-dyad/`) |
| Distinct tokens (case-folded shapes) | ~1,560 |
| Binary files skipped | 10 (the logo assets; handled in Phase 7) |

Largest token families (shows what the codemod must cover):
`DyadError`/`DyadErrorKind` (~1.7k hits, 298 files), `<dyad-*>` tag protocol (~60 distinct tag names, ~1.5k hits), `Dyad*` React components (DyadCard, DyadBadge, DyadMarkdownParser, ...), `getDyadAppPath`, `enableDyadPro`/`isDyadPro`, `DYAD_*` env vars (~120 names), `.dyad/` app folder, `dyad-apps`, `dyad/auto/*` model ids, `data-dyad-id`, `made-with-dyad`.

Why internals must be renamed too: the hosted deployment serves the **unminified Vite dev build**, so file names (`/src/components/chat/DyadCard.tsx`), identifiers, console logs (`[Dyad]`), `localStorage` keys, request headers (`x-dyad-rpc-token`) and injected preview scripts (`dyad-shim.js`, `__dyad_*` globals) are all visible to a client with DevTools.

## 2. Baseline (before any change)

| Check | Result |
|---|---|
| `npm run ts` | pass |
| `oxlint` (no `--fix`) | pass, 0 errors, 5 pre-existing warnings |
| `oxfmt --check` | pass |
| `npm run build` (electron-forge package, E2E build) | pass, 97s |
| `npm test` (first run) | 103 files / 565 tests failed, **all environmental**: `better-sqlite3` binary was built for Node ABI 137 (Node 24) while the shell runs Node 20 (ABI 115). |
| `npm test` (after `npm rebuild better-sqlite3` for Node 20) | see `/tmp/baseline2` — recorded in REBRAND_REPORT.md |
| e2e (Playwright) | exists (`e2e-tests/`); runs against the packaged build; baseline recorded in REBRAND_REPORT.md |

Environment note: rebuilding `better-sqlite3` for Node 20 changes the local `node_modules` binary. The headless server on this machine uses Node 24; run `nvm use 24 && npm rebuild better-sqlite3` to restore it (also listed in MANUAL_STEPS.md).

## 3. Bucket summary

Per-file lists are in the appendices; this is the classification and chosen treatment.

### A. User-visible (Appendix A)
- ~205 prose lines in `src/components` (53 files), `src/pages` 5, `src/app` 2, `src/main.ts` 14 (menus, deep-link error dialogs); ~18 user-facing errors in `src/ipc`.
- i18n: 6 locales, ~388 "Dyad" values. 18 i18n **keys** contain "Dyad" (`askDyadToBuild`...). Treatment: rename keys and values together (sweep requires zero hits); done by the codemod across `src/i18n/locales/*` and all `t("...")` call sites.
- Window/tab title: only `index.html` `<title>`. Web UI has **no favicon** (must be added). No tray / About panel in code.
- "Dyad Pro" paywall copy: 122 hits / 57 files. Treatment: rename text to "NextBuild Pro", keep the feature code (no behavior change), route marketing/upsell URLs through `brand.ts`; remove promo/social links (X, Reddit, YouTube tutorial).
- Packaging: Electron Forge only (no electron-builder). `productName: "dyad"` drives exe/.app/installer/deb/rpm names and **the userData folder name**. `appBundleId`, `win32metadata`, `executableName` unset (to be set explicitly). Protocol `dyad://`. Auto-update + publisher point at `dyad-sh/dyad` (disable).
- Generated-app visible: "Made with Dyad" badge, README title, `<title>dyad-generated-app`, favicon.

### B. LLM-visible / generated output (Appendix B)
- ~60 `<dyad-*>` tags; parser whitelist in `streamingMessageParser.ts` (56 names), renderer switch in `DyadMarkdownParser.tsx`, plus full-width `＜dyad` escape.
- Prompts: `system_prompt.ts` (60 hits), `local_agent_prompt.ts`, `plan_mode_prompt.ts`, subagent personas, neon/supabase/security/shell prompts, guides.
- Generated projects: scaffold README/title/favicon/tagger dependency, `data-dyad-id|name` DOM attributes, `.dyad/` folder (+ `.gitignore` entry), pnpm-workspace comments (`# dyad-default-allow-builds-*`, validated by `socket_firewall.ts`), git author "Dyad"/`git@dyad.sh`, commit messages.
- Preview injection: 9 `worker/dyad-*.js`, `/dyad-sw.js`, ~25 `dyad-*` postMessage types, `__dyad_*` globals, `[Dyad]` console logs.
- Persisted chats: dev DB has 26/52 messages containing `<dyad-` and 32 in `ai_messages_json`.

### C. Internal identifiers (Appendix C)
Persistent (need migration/alias): userData dir, default apps dir (`~/dyad-apps`, `/opt/dyad/dyad-apps` on VM), `.dyad/` inside each app, `dyad://` and `dyad-media://` schemes, safeStorage/Keychain identity, settings keys (`enableDyadPro`, `dyadProBudget`), localStorage keys, git author, Coolify SSH key names, env vars (~120), RPC header `x-dyad-rpc-token`, oauth2-proxy cookie `_dyad_oauth2`.
In-code only (safe): IPC channel `restart-dyad`, temp dirs, crash-reports dir, `DyadError` & friends, component/function names, test env vars.

### D. External dependencies we don't control (Appendix D)
| Dependency | Treatment |
|---|---|
| `api.dyad.sh` remote config/catalogs/build allowlist (server-side) | env overrides exist -> point at local snapshots; vendor allowlist |
| `api.dyad.sh/v1/templates` | add override, default empty |
| `engine.dyad.sh`, `dyad/auto/*` model ids, `X-Dyad-Request-Id`, `"dyad-engine"` provider options | **Allowlisted wire protocol** (belongs to a server we don't run). Only active with a Pro key; Pro UI de-emphasised. URL kept in config. |
| `upload-logs.dyad.sh`, `helpchat.dyad.sh` | disable |
| PostHog (hardcoded Dyad key) | disable (no-op init) unless you supply a key |
| `oauth.dyad.sh`, `supabase-oauth.dyad.sh`, `dyad://` deep link | disable / manual (own OAuth apps) |
| GitHub OAuth client id | needs your own OAuth app -> MANUAL_STEPS |
| Template repos `dyad-sh/*` (nextjs, react-vite-nitro, portal-mini-store) | hide until forked under NextBillion org -> MANUAL_STEPS |
| `@dyad-sh/react-vite-component-tagger` (scaffold) | **vendor** source into scaffold as a local plugin (no npm scope needed); regenerate scaffold lockfile |
| `@dyad-sh/nextjs-webpack-component-tagger` | vendor into forked Next template |
| `@dyad-sh/supabase-management-js` (server-side only, no source in repo) | **allowlisted dependency** unless you decide to vendor `dist/` |
| Docs/academy/pro/marketing links (~45 components) | `brand.ts` URLs; promo removed |
| Auto-update, forge publisher, GitHub release feeds | disable / repoint |

## 4. Logo audit

`context/nextbillion-logo.png`: 192x192, 8-bit RGBA, transparent background, ~2% margin, **symbol only** (purple-to-blue two-loop ribbon), no wordmark, square.

Where the Dyad logo is used (Appendix A section 3): `assets/icon/logo.png` (786x786; also window icon `main.ts:899`), `assets/icon/logo.ico` (16-256), `assets/icon/logo.icns` (16-1024), `assets/logo.svg` (`TitleBar.tsx`, `SetupBanner.tsx`), scaffold favicon (512px PNG named `.ico`), `scaffold/public/favicon.ico`, benchmark template favicon, `e2e-tests/fixtures/images/logo.png`. No tray, splash, DMG/installer art, OG or docs images exist.

Handling: 192px is too small as a master for 512/1024 outputs; I will upscale with `sharp` (Lanczos3) and flag softness at >192px in the report; a vector or 1024px original is recommended (MANUAL_STEPS). macOS icon: rounded-square light tile with the mark at ~60%. The in-app logo (`TitleBar`) is replaced by an `<img>` of the PNG (text-free); dark-theme contrast checked in Phase 7. `.ico` is written with a small Node script (no new dependency; `sharp` is already installed transitively, `iconutil` for `.icns`). Web UI gets a new favicon (none existed).

## 5. Decisions defaulted (not blocking — flag if you disagree)

1. Both the hosted web app **and** the packaged desktop build are kept working (you asked for a packaged-app inspection).
2. "Dyad Pro" feature is renamed, not removed. Upsell/promo/social links are removed.
3. PostHog telemetry: disabled (no key supplied). Log-upload and help-bot endpoints: disabled.
4. Template repos: non-scaffold templates hidden until forked.
5. `@dyad-sh/supabase-management-js` stays as an explicit allowlisted hit.
6. Engine wire identifiers (`dyad/auto/*`, `X-Dyad-Request-Id`, `dyad-engine` provider key) stay (they are the protocol with a server we don't control).
7. Drizzle migrations/snapshots are immutable history: never edited. DB value `chats.execution_backend = 'dyad'` kept (allowlisted).
8. Env vars renamed to `NEXTBUILD_*`; a single startup shim in `src/brand.ts` copies legacy `DYAD_*` into `NEXTBUILD_*` when the new one is unset, so the live VM's `deploy/env` keeps working until you migrate it.
9. Live VM host-level names (linux user `dyad`, `/opt/dyad`, systemd unit names, oauth2-proxy cookie) are **not** renamed in place; repo files (`deploy/*`) are renamed to the new names and the in-place VM cutover is a documented manual procedure.

## 6. Risk list

1. **Keychain/safeStorage orphaning** (highest). A new productName makes Electron look up a new "NextBuild Safe Storage" identity; every stored token/API key/MCP secret becomes undecryptable. Mitigation: keep legacy "dyad Safe Storage"/"dyad Key" names in `safe_storage_legacy.ts` recovery list (allowlisted), test recovery.
2. **userData silently empty** if productName changes before migration. Mitigation: migrate/point `app.setPath("userData")` at old dir before app ready.
3. **Apps disappearing**: `apps.path` is stored relative to the apps dir. Move dir, or resolve to the old one if the new does not exist.
4. **Old chats**: `.dyad/media` and `dyad-media://` URLs embedded in history (~94 refs) -> keep protocol alias and `.dyad` read fallback.
5. **Tag write-back sites** (`executeAddDependency.ts`, `security_handlers.ts` LIKE query) operate on raw stored text; read-time normalization cannot fix them -> one-time DB content migration (with backup) in addition to a tolerant parser.
6. **Live VM** config is not in git (`deploy/env`, oauth2-proxy.cfg, Caddyfile). Mitigation: legacy env/header fallbacks in code; manual cutover doc.
7. **External OAuth redirect pages still emit `dyad://`** -> keep handling the old scheme.
8. **Zod strips unknown settings keys** -> settings migration in `migrateStoredSettings`.
9. **Snapshots/fixtures**: 59 e2e snapshots, 6 vitest `.snap`, 38 LLM fixtures change by rename only; diffs shown, never blindly updated.
10. **Prompt rename changes LLM behavior slightly**; verified by an end-to-end generation walkthrough.
11. **Rename of `scaffold/` tagger** changes scaffold lockfile; apps generated earlier keep the old package (works, still visible in those old projects' package.json).
12. **Local env**: better-sqlite3 ABI mismatch (see section 2).
13. **Volume**: ~1.5k files touched. Mitigation: scripted codemod, phased commits, per-phase gates.

## 7. Data migration strategy

Idempotent `src/brand_migration.ts`, marker file `<userData>/.nextbuild-migrated`, never deletes old data, never overwrites existing new data.

1. Electron: run at top of `src/main.ts` before userData is resolved (before ~L196) and before `app.whenReady`. If new userData dir is absent and old (`dyad`) exists -> `app.setPath("userData", old)` first (zero-copy alias); no data moved. Same in headless `src/server/index.ts` (before L36 / `initializeDatabase`) using the resolved data dir.
2. Apps dir: if `~/nextbuild-apps` missing and `~/dyad-apps` exists -> keep resolving to the old dir (symlink `nextbuild-apps -> dyad-apps` where permitted; otherwise resolver prefers the existing old dir). `apps.path` stays valid.
3. Settings: `migrateStoredSettings` maps `enableDyadPro -> enableNextBuildPro`, `dyadProBudget -> nextbuildProBudget`; DB is snapshotted by `BackupManager` first.
4. Chat DB: one-time idempotent rewrite of `messages.content`, `messages.ai_messages_json`, `agent_messages.content` (`<dyad-` -> `<nextbuild-`, `</dyad-`, full-width `＜dyad`), bump `chat_search_meta.projection_version`; backup first. **Parser/renderer/history builders also accept both old and new tags** (`normalizeLegacyTags()` at model-output ingress, DB->renderer, DB->model-history, parser entry) and emit only new tags.
5. Per-app `.dyad/` -> new `.nextbuild/` for new apps; read `.nextbuild` first, fall back to `.dyad`; `.gitignore` check accepts both. Existing media URLs resolve via both.
6. Protocols: register `nextbuild://` and `nextbuild-media://`; keep handling `dyad://` and `dyad-media://`.
7. Renderer localStorage: copy old keys to new at app entry, before atoms hydrate (so context-pack preference is preserved).
8. Env/headers: `NEXTBUILD_*` preferred, legacy `DYAD_*` copied at startup; RPC server accepts both `x-nextbuild-rpc-token` and `x-dyad-rpc-token`.
9. Tests: fresh, old-only, both-exist, re-run, interrupted.

## 8. Codemod design (Phases 2-5)

`.claude/tmp/codemod.mjs` (scratch; deleted before commit): explicit per-bucket rules over an explicit file list, never a repo-wide replace. Case mapping: `Dyad->NextBuild`, `dyad->nextbuild`, `DYAD->NEXTBUILD`; contextual: kebab `dyad-x -> nextbuild-x`, snake `dyad_x -> nextbuild_x`, camel `dyadX -> nextbuildX`, Pascal `DyadX -> NextBuildX`, env `DYAD_X -> NEXTBUILD_X`. Protected allowlist (never rewritten): drizzle `migrations/` + `meta/`, `package-lock.json`, `node_modules`, `.git`, `context/`, engine wire ids, `@dyad-sh/supabase-management-js`, legacy-compat tag parser, brand migration, safe-storage legacy names, `execution_backend` literal, third-party URLs per Appendix D decisions. File/dir renames via `git mv`. Output: dry-run diffstat per rule, reviewed before each commit.

Phase order and commits: 2 brand constants -> 3 internal identifiers + migration -> 4 LLM/generated -> 5 user-visible -> 6 external -> 7 logo -> 8 final sweep. After each: `npm run ts`, oxlint, oxfmt, `npm test`, `npm run build` compared to baseline.

---

# Appendix A — User-visible strings, packaging, logo usage

(from audit fork, `/tmp/audit/A.md`)

Read-only. Repo: /Users/vishal/dyad-web-deploy @ rebrand/nextbuild. Counts are tracked files, non-test unless noted.

## 1. User-visible strings

### Volume (prose "Dyad" as a standalone word, PCRE `(?<![A-Za-z0-9_])Dyad(?![A-Za-z0-9_])`, excluding tests)
| Area | files | lines | notes |
|---|---|---|---|
| src/components | 53 | 205 | biggest: CoolifyServerSetup (27), CoolifyConnector (20), chat/PromoMessage (14), CoolifyCredentials (13), settings/ProviderSettingsPage (12), chat/ChatErrorBox (12), ModelPicker (8), TestsPanel/PreviewIframe (7 each), SetupBanner (5) |
| src/pages | 2 | 5 | home.tsx:188 "Describe your idea. Dyad will turn it into…"; settings.tsx ×4 section descriptions |
| src/app | 1 | 2 | TitleBar.tsx:101 `<img alt="Dyad">` |
| src/hooks, src/lib | 5 / 16 | 14 / 42 | e.g. lib/userInputNotification.ts:35 `app?.name ?? "Dyad"` (OS notification title fallback) |
| src/ipc (user-facing errors/toasts mixed with logs/prompts) | 96 | 341 | ~18 lines are `throw`/Error/message strings; rest are comments/log/engine prompts — triage needed |
| src/pro | 34 | 81 | "Dyad Pro" copy (see below) |
| src/main.ts + src/main/ | 1 / 10 | 14 / 18 | menu "Reload Dyad"/"Force Reload Dyad" (main.ts:1317,1321); deep-link error dialogs ("…connection started by Dyad", "connect again from Dyad", "save Dyad Pro settings"); `throw new DyadError("Dyad is shutting down")` main.ts:878 |
| src/server | 2 | 3 | headless web server |
| src/prompts | 10 | 42 | bucket B (LLM-visible) — not counted here |
| src/i18n | 22 | 382 | see below |

"Dyad Pro" appears 122 times across 57 non-i18n src files (upsell banners, ProModeSelector, AnnotatorOnlyForPro, SubscriptionConnectionStatus, PromoMessage, ChatErrorBox "Access with Dyad Pro", ChatModeSelector toast "Dyad Free is not available in Build mode"). These are product/paywall concepts, not just a name; **decision needed** (rename to e.g. "NextBuild Pro" vs hide/remove for an internal POC — most link to dyad.sh/pro & academy.dyad.sh = bucket D).

### Window title / menus / tray / About / dialogs
- **Window title**: only source is `index.html:6 <title>Dyad</title>` (BrowserWindow sets no `title`; `titleBarStyle: "hidden"`, main.ts:882+). In hosted web mode this is the **browser tab title**. No `document.title` setters anywhere.
- **Favicon (web)**: `index.html` has no `<link rel=icon>` and the repo has no root `public/` dir → tab shows browser default / 404 on /favicon.ico. A favicon must be *added*, not replaced.
- **Menus**: main.ts:1317/1321 "Reload Dyad"/"Force Reload Dyad" (Menu.buildFromTemplate at 1194, 1353). macOS app-menu name comes from packaged `productName`.
- **Tray**: none (`new Tray` not used). **Dock**: no `app.dock` use. **About panel**: no `setAboutPanelOptions`; only a "Dyad Version:" row in home.json (`dyadVersion`) + ErrorBoundary debug dump ("- Dyad Version:"). Native macOS About uses CFBundleName from productName.
- **Notifications**: `new Notification(app?.name ?? "Dyad")` (lib/userInputNotification.ts:35); hooks/useNotificationHandler.ts:117 (title passed in).
- **Dialogs/toasts**: CustomAppsFolderSelector ("Dyad apps folder reset…"), PreviewPanel ("Dyad-managed Node.js"), ProviderSettingsPage ("Error toggling Dyad Pro"), ErrorBoundary, CoolifySignOutDialog, deep-link error dialogs in main.ts.
- **Onboarding / setup**: SetupBanner ("Setup Dyad"), home.json `setup.*`, "Need help with Dyad?", help-bot ("Dyad Help Bot", Pro).

### i18n situation
- 6 locales: en, es, ko, pt-BR, tr, zh-CN; 5 files each (chat, common, errors, home, settings). Per-locale "dyad" hits: en 67, es 61, ko 61, pt-BR 66, tr 67, zh-CN 66 (≈388 total). Values are Latin "Dyad" inside translated sentences — mechanical replace is safe.
- **18 i18n keys have "Dyad" in the key name** (e.g. `askDyadToBuild`, `dyadProSmartContext`, `getDyadPro`, `setupDyad`, `copyToDyadApps`, `dyadVersion`, `likeDyad`, `dyadSubreddit`). Renaming keys requires editing en + 5 locales + all `t("…")` call sites together; `src/i18n/test_gate_locales.test.ts` guards locale parity. Recommendation: **change values only, leave key names** (invisible), or rename keys atomically with codemod + the gate test. Keys are internal identifiers → they'd be an allowlist item if left.
- Only 120 of 448 tsx files in components/pages/app use `useTranslation`; the rest (incl. pages/home.tsx, settings.tsx, all Coolify*, SetupBanner, PromoMessage in part) are **hardcoded English** — the codemod must cover both JSON and TSX.
- e2e: 58 files in e2e-tests contain prose "Dyad"; 59 snapshot files contain "dyad" — snapshot churn expected (rename-only diffs).

### External links shown in UI (Bucket D overlap)
github.com/dyad-sh (16), dyad.sh/pro (9+5+2), dyad.sh/docs (9+8), api.dyad.sh/v1 (7), engine.dyad.sh/v1 (4), academy.dyad.sh/* (4+2+1+1+1), supabase-oauth.dyad.sh (3), oauth.dyad.sh (2), upload-logs.dyad.sh (1), helpchat.dyad.sh (1), dyad.sh/download (1), x.com/dyad_sh + reddit.com/r/dyadbuilders (PromoMessage.tsx:89,96 — visible social promos, should be **removed**, not renamed), `https://www.youtube.com/watch?v=rgdNoHLaRN4` (SetupBanner:253, Dyad tutorial video, visible).

### "Made with Dyad" badge (generated projects — also client-visible)
`scaffold/src/components/made-with-dyad.tsx` (links https://www.dyad.sh/, text "Made with Dyad"), imported in `scaffold/src/pages/Index.tsx:3,14`. Bucket B but the client sees it in every generated app's preview. Options: delete component + import (recommended for internal POC) or rename to "Made with NextBuild" → nextbillion link. 13 files reference `components/made-with-dyad` (tests/e2e/prompts) incl. 38 `madewithdyad` token hits.
Other scaffold hits: README.md:1 "Welcome to your Dyad app"; index.html:6 `<title>dyad-generated-app</title>` (visible as the generated app's tab title); package.json + vite.config.ts use `@dyad-sh/react-vite-component-tagger` (external npm, bucket D); `scaffold/public/favicon.ico` is a Dyad icon (see §3).

### Docs shipped to clients
README.md (10 hits; line 5 hero image is a github user-attachments URL = Dyad screenshot), CONTRIBUTING.md (9), SECURITY.md (5), CLA.md (5), PRODUCT.md (5), NOTICE (2), LICENSE (1: copyright holder — user said license/attribution not a concern), AGENTS.md/CLAUDE.md/rules/ (dev docs), docs/ (68 hits), scripts/README.md, .github/workflows/README.md. context/dyad-web-deployment.md, context/dyad-headless-browser.md are in context/ (excluded by user).

## 2. Packaging / OS metadata

**package.json**: `name:"dyad"`, `productName:"dyad"` (top, line ~3) **and a duplicate stray `"productName":"dyad"` at line 233** (after `engines`), `description:"Free, local, open-source AI app builder"`, `author:{Will Chen, willchen90@gmail.com}`, `repository.url: https://github.com/dyad-sh/dyad.git`, `license:MIT`, version 1.18.0. No `homepage`, `bugs`, `bin`, no `build` block (Forge, not electron-builder). Deps: `@dyad-sh/supabase-management-js` (external, v1.0.1), `dyad-keychain-reader: file:native/keychain-reader` (local; name used in forge.config.ts:103,156,219, vite.main.config.mts:40, native/keychain-reader/package.json name+description, scripts/rebuild-keychain-reader.mjs). `package-lock.json` has 8 hits (regenerate). Scripts with env `DYAD_*` (dev:engine, staging:engine URL `staging---dyad-llm-engine-….run.app`).

**forge.config.ts** (Electron Forge + VitePlugin; no electron-builder):
- derived names: no `name`/`executableName`/`appBundleId`/`appCopyright`/`win32metadata`/`extendInfo` set → **everything comes from package.json `productName`** (`dyad`): `dyad.app`, `dyad.exe` (scripts/copy-data-to-dev.mjs:93,101 hard-codes `dyad.exe`), Squirrel `dyad-<ver>.Setup.exe` (scripts/README.md:53), deb/rpm/AppImage names. Bundle id/appId defaults to `com.electron.dyad`. Info.plist/Windows version resource/.desktop are all auto-generated; set `appBundleId`, `appCopyright`, `win32metadata:{CompanyName,FileDescription,ProductName,InternalName,OriginalFilename}`, `executableName` explicitly.
- :190-195 `protocols:[{name:"Dyad", schemes:["dyad"]}]` (writes CFBundleURLTypes)
- :196 `icon:"./assets/icon/logo"` (packager picks .icns/.ico by platform)
- :237-244 Squirrel `iconUrl` = raw.githubusercontent.com/dyad-sh/dyad/main/assets/icon/logo.ico (**remote URL on upstream repo**; must point at our own hosted ico), `setupIcon:"./assets/icon/logo.ico"` ×2
- :248-259 Rpm/Deb `mimeType:["x-scheme-handler/dyad"]`, `icon:"./assets/icon/logo.png"`; :260 AppImage icon same
- :264-277 publisher-github `owner:"dyad-sh", name:"dyad"` (external; **MANUAL**)
- :103,156,219 `dyad-keychain-reader`; :151 env `DYAD_SKIP_NATIVE_REBUILD`
- No DMG maker (only ZIP for darwin) → no DMG background art. No installer banner art/animated gif (Squirrel `loadingGif` unset).
- makers/MakerAppImage.ts: name derived from appName (`${appName}_${version}_x86_64.AppImage`), no literal dyad.
- windowsSign.ts: 0 dyad hits (env-driven).
- Auto-update: src/main.ts:645 `updateElectronApp({source: ElectronPublicUpdateService, repo:"dyad-sh/dyad"})` (main.ts:650) — update.electronjs.org feed of the upstream GitHub repo (bucket D; disable/redirect).
- main.ts:407-412 `setAsDefaultProtocolClient("dyad")`; :585,1361 `dyad-media://` scheme; :1374,1393,1483 `dyad://` parsing; :316 `dyad-crash-reports` dir; Linux `.desktop`: src/main/linux_protocol_registration.ts: `SCHEME="dyad"`, `dyad-url-handler.desktop`, `Name=Dyad`, `x-scheme-handler/dyad`.
- main.ts:899 BrowserWindow `icon: path.join(app.getAppPath(),"assets/icon/logo.png")` (Linux window icon; path must keep existing / be updated).

**.github**: 20 workflows (names: CI, Release app, CLA Assistant, Claude *, …) — workflow display names don't contain "Dyad", but 92 content hits (repo slug, prompts under .github/prompts: triage-playbook.md 28, claude-triage.txt 12). release.yml has 3. Not client-visible; keep out of scope unless desired.

**scripts/**: 153 hits; client-relevant: scripts/README.md (release asset names), copy-data-to-dev.mjs (`dyad.exe`), start-supervisor, rebuild-keychain-reader.mjs, verify-release-assets.js.

## 3. Logo / icon / image usage

### Inventory (every tracked image)
| Path | Format / size | Used by |
|---|---|---|
| assets/icon/logo.png | PNG 786×786 RGBA, 234 KB, full-bleed "d" glyph on transparent | forge.config.ts :251,257,261 (rpm/deb/AppImage), main.ts:899 (BrowserWindow icon, Linux/Win dev) |
| assets/icon/logo.ico | ICO, 6 entries: 16,32,48,64,128,256 @32bpp | forge `setupIcon` ×2 (Squirrel), packager `icon` on win32 (exe icon) |
| assets/icon/logo.icns | ICNS, 628 KB: ic04/ic05/ic07/ic08/ic09/ic10/ic11/ic12/ic13/ic14 (16…1024) | packager `icon` on darwin |
| assets/logo.svg | SVG 262×262 viewBox, gradient purple "d" **paths only, no `<text>`**; glyph is offset (translate(34,0)) with extra whitespace right | src/app/TitleBar.tsx:10 (`<img src={logo} className="w-5 h-5">`, alt "Dyad"), src/components/SetupBanner.tsx:23 |
| scaffold/public/favicon.ico | actually a **512×512 PNG named .ico**, Dyad scaffold icon | every generated app (browser tab) |
| e2e-tests/fixtures/images/logo.png | PNG 16×16 | test fixture only (generic) — not brand; leave |
| benchmarks/app-builder/template/nextjs/src/app/favicon.ico | ICO 16/32/… | benchmark Next.js template (Next default, not Dyad) — leave |
| benchmarks/app-builder/scatter-*.svg, template/nextjs/public/*.svg, scaffold/public/placeholder.svg | misc | not brand (verify scatter svgs contain no "dyad" text) |
| assets/ai-logos/*, assets/supabase/* | third-party provider logos | NOT Dyad — keep |
| README.md:5 | remote GitHub-hosted image (Dyad hero) | docs — replace/remove |

Not present: tray icons, splash, DMG background, Squirrel loading gif, OG/social images, docs images (docs/ has only .md), PWA manifest, root `public/`. **Web UI has no favicon at all** (index.html lacks `<link rel=icon>`).
Dev-only/other brand text: SVG text — none (no `<text>` in any assets svg); the wordmark-style "dyad" lettering in assets/logo.svg's path data at x≈625-750 is in the original author's coordinate system but rendered view (qlmanage) shows only the "d" glyph mark — verify by rendering at full viewBox when replacing (file is deleted anyway).

### Required outputs for replacement
- `assets/icon/logo.icns`: iconset 16,32,64(32@2x),128,256,512,1024 (+@2x pairs) via `iconutil -c icns`
- `assets/icon/logo.ico`: 16,24?,32,48,64,128,256 (keep existing 6: 16,32,48,64,128,256), PNG-compressed entries
- `assets/icon/logo.png`: 1024 (or 512 min) square RGBA (Linux/Electron window icon, deb/rpm/AppImage)
- `assets/logo.svg` (or replace import with a PNG/SVG in TitleBar/SetupBanner; displayed at 20px and larger in SetupBanner) — NextBillion source is raster-only; either keep a `logo.png` (≥128 px for 2×/retina at 20px→ need ≥64; SetupBanner size TBD) or vectorize (trace) — do not wrap PNG in fake SVG without noting it
- favicon for web UI: `public/favicon.ico` (+32/16 PNG, 180 apple-touch) + `<link>` tags in index.html (new)
- `scaffold/public/favicon.ico` (generated apps; PNG-named-ico 512 today → can stay PNG, but ideally real 48/32/16 ICO or `favicon.png` + `<link>` in scaffold/index.html)
- Squirrel `iconUrl` needs an https URL to a hosted .ico (MANUAL_STEPS)
- OG/social/DMG art: none exist; none required (ZIP maker only). Optional: tray not needed.

## 4. Source logo: context/nextbillion-logo.png
- **192×192, 8-bit RGBA** (sRGB), square. Alpha content bbox x4–187, y4–188 (content 184×185 → ~2% margin only, nearly full-bleed). 57.8 % fully transparent, 18.1 % fully opaque (anti-aliased stroke art).
- Visual (viewed): **symbol only, no wordmark** — a continuous two-loop ribbon/infinity "8" shape, gradient purple (#8566… top-left ≈ rgb(133,102,157)) → blue (#1a6bb0-ish) stroke, transparent background. Reads well on light backgrounds; **low contrast on dark UI** (purple/blue on dark gray) — TitleBar sits on the app chrome; check dark theme.
- Too small as a master: macOS 1024 / Windows 256 / hi-dpi need upscaling ~5.3× → soft edges. Pure-raster upscale of a clean stroke logo with Lanczos is acceptable for 16–256 (ICO max 256: 1.33× upscale, fine); for 512/1024 PNG/ICNS it will look soft. **Ask the user for the original SVG/vector or ≥1024 PNG** (non-blocking: proceed with Lanczos upscaling from the 192 and flag it).
- Recommendations: (a) Windows ICO / Linux PNG: transparent, ~8–10 % padding (content is nearly edge-to-edge, so pad so mark ≈ 84 % of canvas); (b) macOS .icns: Apple Big-Sur+ icons are expected to be a rounded-square tile at ~824/1024 with the glyph inside — a raw transparent glyph renders smaller/inconsistent vs other dock icons; recommend white (or very light) rounded-square (r≈185/1024, 824×824 centered, subtle shadow optional) background with the mark at ~60 %; (c) in-app TitleBar: use the transparent PNG directly at 20×20 (needs light/dark check; may need a white-ish pill in dark mode); (d) favicon: transparent 32/16 + 180 apple-touch with white bg.
- Tooling available locally: **`sharp` 0.34.3 in node_modules (transitive, NOT in package.json** — don't rely on it in a committed script; fine for a one-off generation script under .claude/tmp or scripts/), `sips` (resize/convert PNG, cannot write .ico), **`iconutil`** (iconset → .icns ✔), `qlmanage` (SVG render). **Not available**: ImageMagick (`magick`/`convert`), `png2icns`, `png-to-ico`, python PIL (no module), `@resvg/*`. ICO can be hand-assembled in ~20 lines of Node (ICONDIR + PNG-compressed entries — Windows Vista+ accepts), sharp does the resizes. Everything can be done with sharp + iconutil + a tiny ICO writer; no new dependency required.

## Risks / notes for the plan
1. productName drives exe/app/installer/bundle-id names; `scripts/copy-data-to-dev.mjs` and docs hard-code `dyad.exe`. Changing productName also changes the macOS/Windows **userData folder** (app.getPath('userData') derives from the name) → data-migration (bucket C) must run before anything reads settings; set `app.setName`/path explicitly to keep old dir or migrate.
2. Duplicate `productName` at package.json:233 — remove/sync.
3. Squirrel `iconUrl` & publisher-github & `updateElectronApp(repo:"dyad-sh/dyad")` all point at upstream GitHub → bucket D decisions; with no update feed of our own, disable auto-update for POC.
4. Web mode: tab title + (missing) favicon are the main client-visible chrome; Electron-only items (menus, protocols, installers) matter only if a desktop build is also shipped. Ask the user which surface(s) clients actually get (hosted web per context/dyad-web-deployment.md vs packaged app).
5. "Dyad Pro"/"Dyad Free"/help-bot/academy/subscription UI is a paywall surface tied to dyad.sh services — rename vs remove decision; PromoMessage x/reddit promos and YouTube tutorial link should be removed/replaced, not renamed.
6. Hardcoded (non-i18n) English strings dominate; i18n key names containing Dyad (18) are invisible → allowlist or atomic rename.
7. Generated-app leaks: `Made with Dyad` badge, `dyad-generated-app` title, README "Welcome to your Dyad app", Dyad favicon.

# Appendix B — LLM-visible output and generated projects

Repo: /Users/vishal/dyad-web-deploy, branch rebrand/nextbuild (read-only audit; scratch in /tmp/audit).

## 1. System prompts / LLM-visible prose naming Dyad

| File | Hits | What |
|---|---|---|
| src/prompts/system_prompt.ts | 60 | "You are Dyad, an AI editor" (L68); tag protocol docs (41 tag lines); Dyad-owned files (`playwright-dyad.config.ts`, `e2e-tests/fixtures/dyad/`, `DYAD_TEST_USER_*`, "Dyad's recorder", "Dyad detects .spec.ts") |
| src/prompts/local_agent_prompt.ts | 14 | "You are Dyad" (L37, L455), "You are Dyad Implementer" (L879), "Dyad automatically commits", "Dyad manages preview startup", "Dyad may add Git provenance" |
| src/prompts/plan_mode_prompt.ts | 2 | "You are Dyad Plan Mode" |
| src/prompts/neon_prompt.ts (+_rules) | 7 | "injected by Dyad", ".env.local in Dyad-generated Next.js apps", "through Dyad" |
| src/prompts/supabase_prompt.ts | 4 | "Dyad registers the running preview's origin" |
| src/prompts/security_review_prompt.ts | 4 | `<dyad-security-finding>` format |
| src/prompts/compaction_system_prompt.ts | 1 | |
| src/prompts/shell_review_policy.ts (+cases.json) | 3 | "Dyad machinery" |
| src/prompts/guides/*.md, render_guide.ts, filter_guide_by_framework.ts | 10 | "injected by Dyad", "default Dyad scaffold", "Dyad previews use app-N.localhost" |
| src/prompts/context_packs/openviking.ts | 2 | |
| src/pro/main/prompts/turbo_edits_v2_prompt.ts | 2 | tag format |
| src/pro/main/ipc/handlers/local_agent/subagents/subagent_manager.ts | 103 | persona strings L2030-2033 "You are Dyad Reviewer / Implementer / Explorer"; "Dyad Pro" gating errors; "[Report truncated by Dyad]" |
| src/pro/main/ipc/handlers/local_agent/tools/*.ts (~40 files) | ~400 | almost all are `<dyad-*>` emitters (tool result XML shown in chat and sent back to the LLM) plus comments; no tool *names* contain dyad |
| src/ipc/services/claude_code/model.ts L214 | 1 | "Use only the supplied Dyad MCP tools..." |
| src/utils/codebase.ts L424-450 | 4 | codebase context sent to LLM is wrapped in `<dyad-file path=...>` |
| src/ipc/utils/git_author / git_service | | author name "Dyad", email git@dyad.sh, initial commit msg "Init Dyad app" (git_service.ts:140), "add Dyad component tagger" (app_upgrade_utils.ts:270) |
| src/__tests__/evals/helpers/prompts.ts | 1 | duplicate of the system prompt for evals |

Product-name phrases inside prompts that need a decision (not mechanical): "Dyad Pro", "Dyad Free", "Dyad AI credits", "Dyad Engine".

## 2. Tag protocol

### 2a. All distinct tag names (62)
Emitted/seen in code: dyad-add-dependency, dyad-add-integration, dyad-app-blueprint, dyad-attachment, dyad-chat-summary, dyad-chat-title, dyad-claude-tool, dyad-code-search, dyad-code-search-result, dyad-codebase-context, dyad-command, dyad-compaction, dyad-copy, dyad-database-schema, dyad-db-table-schema, dyad-delete, dyad-edit, dyad-enable-nitro, dyad-execute-sql, dyad-exit-plan, dyad-explore-chat-history, dyad-explore-code, dyad-file, dyad-generate-test (legacy), dyad-git, dyad-git-context, dyad-grep, dyad-image-generation, dyad-list-files, dyad-mcp-tool-call, dyad-mcp-tool-result, dyad-mcp-tool-schema, dyad-mcp-tool-search, dyad-neon-project-info, dyad-neon-table-schema, dyad-output, dyad-problem-report, dyad-questionnaire, dyad-read, dyad-read-chat, dyad-read-guide, dyad-read-logs, dyad-rename, dyad-script, dyad-search-chats, dyad-search-replace, dyad-security-finding, dyad-status, dyad-step-limit, dyad-subagent, dyad-suggest-plugin, dyad-supabase-project-info, dyad-supabase-table-schema, dyad-test-assertions, dyad-text-attachment, dyad-web-crawl, dyad-web-fetch, dyad-web-search, dyad-web-search-result, dyad-write, dyad-write-plan.
Appear only in tests/comments/typos: dyad-wri (typo in a test), dyad-cache-file, dyad-custom-action, dyad-future-tool, dyad-problem-report variants.
Also: escaped form `＜dyad` / `＜/dyad` (full-width, chat_stream_handlers.ts escapeDyadTags L3602) is persisted for reasoning content.
Related non-tag markers: `[[dyad-dump-path=...]]` (testing harness only, 23 files, tests/docs), `# dyad-auto-denied` and `# dyad-default-allow-builds-{schema,data-version,channel}=` comments (socket_firewall.ts, src/data/default-approve-builds.txt) WRITTEN INTO the generated project's pnpm workspace yaml, `__DYAD_OUT_START__/END__` (Coolify SSH output framing, remote server only, 7 files), `[dyad-proxy-server]started=[` stdout protocol between worker/proxy_server.js and main (internal, rename both sides together), `dyad_workflow`.

### 2b. Production parser/renderer/stripper/regex locations (must all move together)
Parsers (live LLM output):
- src/ipc/utils/dyad_tag_parser.ts (rename, copy, delete, add-dependency, chat-summary, execute-sql, command, search-replace; getDyadWriteTags etc.)
- src/ipc/processors/response_processor.ts (consumes the above)
- src/ipc/utils/cleanFullResponse.ts (rewrites `<dyad-...>` in-flight)
- src/ipc/handlers/chat_stream_handlers.ts: L3218 chat-summary, L3564 removeProblemReportTags, L3568 removeDyadTags, L3575-3590 hasUnclosedDyadWrite, L3602 escapeDyadTags, L934/937 escape applied to reasoning
- src/ipc/services/claude_code/text.ts L13 (`/<\/?dyad-[\w-]+/gi`)
- src/lib/streamingMessageParser.ts: DYAD_CUSTOM_TAG_NAMES whitelist (56 names) drives incremental block parsing
Renderer:
- src/components/chat/DyadMarkdownParser.tsx (switch on ~60 tag names, L199-1277), ChatMessage.tsx (attachment regexes L68/L100), DyadSubagent.tsx L259, mcpPairing.ts, DyadCompaction/DyadThink/DyadWebSearchResult/DyadSecurityFinding/AppBlueprintDesignDirection, PlanPanel.tsx, SecurityPanel.tsx, hooks/useCopyToClipboard.ts
- ~30 Dyad*.tsx card components (names are internal, but `DyadCard` etc. are bucket C names)
Re-parse of PERSISTED content (the backward-compat surface):
- src/ipc/utils/renderer_chat_message.ts `toRendererMessages` + compaction_utils `extractCompactionBlocks` (display path: chat_handlers.ts L186-209, the only DB->renderer path)
- src/ipc/utils/versioned_codebase_context.ts L43/L57: re-parses `<dyad-read>`, `<dyad-code-search-result>` from old messages to rebuild file context per commit
- src/ipc/handlers/proposal_handlers.ts: re-parses last assistant message via getDyad*Tags for Approve UI
- src/ipc/processors/executeAddDependency.ts L543-556: regex-REPLACES `<dyad-add-dependency ...>` in message.content and WRITES it back (UPDATE messages)
- src/ipc/handlers/security_handlers.ts L36: SQL `LIKE '%<dyad-security-finding%'` + regex L211
- src/ipc/handlers/compaction/compaction_storage.ts L42/L48 + compaction_handler.ts: regex over `<dyad-mcp-tool-call/result>`; compaction summaries stored as `<dyad-compaction>` in messages (isCompactionSummary)
- src/pro/main/ipc/handlers/local_agent/mcp_consent_context.ts L17 (`DYAD_TAG_RE`), tools/chat_search_text.ts (L47-131: tag allow-list + scrub regexes; feeds the FTS index `chat_search_fts_idx`, versioned by `chat_search_meta.projection_version`), tools/read_chat.ts, search_chats.ts, explore_chat_history*
- src/ipc/handlers/chat_stream_handlers.ts L2122 (messageHistory) and L2524 (limitedHistoryChatMessages -> LLM), L1241 (redo), token_count_handlers.ts, version_handlers.ts
- src/pro/main/.../local_agent_handler.ts `buildChatMessageHistory` L328-440 (`parseAiMessagesJson`) and subagent_manager.ts (4 message-table reads)
- src/ipc/utils/ai_messages_utils.ts, ai_messages_cleanup.ts
Emitters (tags the app itself writes): local_agent tools (~40 files, see §1), chat_stream_handlers (status/problem-report/output), testing_chat_handlers.ts (13), response_processor, tsc.ts, shared/dyadAttachment.ts (`buildDyadAttachmentTag`), utils/codebase.ts, prompts.
Tests/fixtures: 551 tag hits in src tests (64 files); e2e fixtures served by the fake LLM 119 hits/38 files (e2e-tests/fixtures); e2e specs 28/13; testing/fake-llm-server 19/3; evals 12/4; 6 vitest .snap files; 206 files under e2e-tests (59 snapshot files containing "dyad", 185 hits; 5 contain the full "You are Dyad" system prompt, so every full-prompt e2e snapshot changes).

### 2c. Single choke-point design (recommended)
Two-layer, because some sites write back to the DB (normalize-on-read alone cannot cover them):
1. New `shared/brand_tags.ts`: `TAG_PREFIX="nextbuild-"`, `normalizeLegacyTags(text)` = `text.replace(/(<\/?)dyad-(?=[a-z])/g,"$1nextbuild-").replace(/＜(\/?)dyad/g,"＜$1nextbuild")` (also `[[dyad-dump-path=` only for testing). Pure, idempotent, case-sensitive on lowercase tag names.
2. Apply it at exactly these boundaries; all parsers/renderers/regexes then only know the NEW names:
   a. LLM-output ingress: right where text deltas become fullResponse (chat_stream_handlers L934/937/961 + local_agent text/reasoning delta, claude_code/text.ts). Handles the model echoing old tags learned from history/training.
   b. DB egress to renderer: `toRendererMessages` (+ search results `chat_handlers.ts` L484-495, `chat_search_text`).
   c. DB egress to LLM: chat_stream_handlers L2122, `buildChatMessageHistory`/`parseAiMessagesJson`, compaction_handler L245, subagent_manager history reads, read_chat/search_chats.
   d. Parser entry points `getDyad*Tags`, `streamingMessageParser`, `DyadMarkdownParser` call it first (cheap defense for imports/restored backups).
3. One-time idempotent startup migration (needed for the write-back sites executeAddDependency, security_handlers LIKE query, FTS, versioned_codebase_context): in one transaction rewrite `messages.content`, `messages.ai_messages_json` (JSON text; `<`/`/` are not escaped by JSON.stringify so plain REPLACE is safe), `agent_messages.content`, then bump `chat_search_meta.projection_version` to force FTS rebuild. SQL: `UPDATE messages SET content=REPLACE(REPLACE(content,'<dyad-','<nextbuild-'),'</dyad-','</nextbuild-') WHERE content LIKE '%dyad-%'` etc. Record done-flag in a table/setting; back up the DB file first (shared DB on the VM). Also rewrite `dyad-media://`/`.dyad/media` URL text in content if the media protocol/dir is renamed (see §3).
4. Keep a regression test: legacy fixture with every tag name -> normalized == new; renderer renders it; parser round-trips.

Sizes to expect: local dev DB sample: 52 messages, 26 with `<dyad-` in content, 32 with `dyad-` in ai_messages_json (~1.2MB total), 4 with `.dyad/` paths; 0 `dyad-media://` there. DB columns holding the word otherwise: `chats.execution_backend` default/enum value `'dyad'` (migration 0051, schema.ts:144-146) - invisible, keep as legacy-compatible alias or migrate in the same step.

## 3. What is written into generated projects (client-visible)

scaffold/ (default Vite/React template; package name is `vite_react_shadcn_ts`, fine):
- scaffold/README.md L1 "# Welcome to your Dyad app"
- scaffold/index.html L6 `<title>dyad-generated-app</title>` (shows in browser tab of every new app)
- scaffold/package.json L65 + pnpm-lock.yaml (3 refs): dependency `@dyad-sh/react-vite-component-tagger@^0.9.0` (npm package owned by Dyad; also in-repo copy packages/@dyad-sh/react-vite-component-tagger and packages/@dyad-sh/nextjs-webpack-component-tagger)
- scaffold/vite.config.ts L2/L11 `import dyadComponentTagger from "@dyad-sh/..."` + `dyadComponentTagger()`
- scaffold/src/components/made-with-dyad.tsx (filename + `MadeWithDyad`, link https://www.dyad.sh/, text "Made with Dyad") used in scaffold/src/pages/Index.tsx; i.e. every new app displays a visible Dyad badge
- scaffold/AI_RULES.md: no dyad hits (good); scaffold/public/favicon.ico = Dyad icon (asset)
Component tagger (`data-dyad-id`, `data-dyad-name` on every JSX element in the dev DOM): packages/@dyad-sh/*/src/index.ts, consumed by worker/dyad-component-selector-client.js, dyad-visual-editor-client.js (dataset.dyadId/dyadName), src/utils/*. Upgrade path: src/ipc/utils/app_upgrade_utils.ts L170-290 injects `dyadComponentTagger()` into existing apps' vite.config + commits "add Dyad component tagger". Existing apps already have `@dyad-sh/...` in package.json/vite.config. A rename means: publish/vendor a new package (or file: dep) AND keep old name working for existing apps (the tagger attribute `data-dyad-id` must be accepted by the selector client during transition).
Other templates (src/shared/templates.ts): github.com/dyad-sh/nextjs-template, dyad-sh/react-vite-nitro, dyad-sh/portal-mini-store-template cloned at app-creation (createFromTemplate.ts sends `User-Agent: Dyad`); their contents (package names, README, @dyad-sh/nextjs-webpack-component-tagger in next.config) are NOT in this repo -> must be forked/vendored (bucket D). benchmarks/app-builder/template/nextjs also has hits (benchmarks only).
`.dyad/` directory inside every generated app (54+29 refs): `.dyad/media` (images, attachments-manifest.json), `.dyad/todos/<chat>.json`, `.dyad/plans/`, `.dyad/chats/<id>/compaction-*.md` (conversation backups the agent reads), `.dyad/meta.json`, `.dyad/queue/`, `.dyad/rules.md`. Constants: `DYAD_MEDIA_DIR_NAME` (media_path_utils.ts), `DYAD_SCREENSHOT_DIR_NAME`, `ensureDyadGitignored` -> `.gitignore` entry `.dyad/` (gitignoreUtils.ts, git_utils.ts L44 special-cases `.dyad/`), shell_review.ts L20 protected-dir regex. These are visible in the client's file tree, .gitignore, and in the git repo they may push to GitHub.
Existing apps: dir names are persisted on disk AND referenced from chat history (`dyad-media://media/<path>/.dyad/media/<file>` URLs built at chat_stream_handlers L1348/L1459, DyadImageGeneration.tsx L57, app_handlers L2641/2670). Migration choices: (A) lazy per-app `.dyad` -> `.nextbuild` rename on first access + gitignore both entries + serve both protocol names, or (B) read-both/write-new. Either way old URLs in content need protocol alias or content rewrite (in the §2c DB migration).
pnpm-workspace.yaml in each generated app gets comments `# dyad-default-allow-builds-schema=v1`, `-data-version`, `-channel`, `# dyad-auto-denied` (socket_firewall.ts L56-64, L262-264). Existing apps contain old keys; reader (L220-231, L340-346) validates the old key names -> reader must accept both.
playwright_bootstrap.ts: generated `playwright-dyad.config.ts` and `e2e-tests/fixtures/dyad/` (+ gitignore entries, legacy->current rewrite at L1613 already has a pattern to extend) and env vars `DYAD_TEST_USER_EMAIL/PASSWORD`, `DYAD_*` injected into the test run (also taught to the LLM in system_prompt.ts L389-432).
Git: author name "Dyad" and email `git@dyad.sh` (git_author.ts), initial commit "Init Dyad app" (git_service.ts:140, test git_service.test.ts:103), component-tagger commit "add Dyad component tagger". These land in the client's git history (and GitHub if pushed). Old commits cannot be rewritten; note in MANUAL_STEPS. VersionPane displays commit messages.
Other: Coolify/Cloudflare deploy: `build_token_name: "Dyad"` (cloudflare_deploy/api.ts:428), coolify names `dyad-${app.name}` (commands.ts:742), deploy key comments. `.env.local`/Neon: prompts say "injected by Dyad".
Supabase/Neon test isolation: `app_metadata.dyad_test=true` (schema.ts:85), env `DYAD_TEST_USER_*`.

## 4. Preview injection (what the client's browser DevTools sees)
Files (worker/): dyad-shim.js, dyad-sw.js, dyad-sw-register.js, dyad_logs.js, dyad-auth-bootstrap.js, dyad-recorder-client.js, dyad-component-selector-client.js, dyad-visual-editor-client.js, dyad-screenshot-client.js, proxy_server.js (95 hits). All injected by proxy_server.js into every preview HTML.
- Network/URL-visible: `/dyad-sw.js` (Service Worker URL, regex-rewritten at proxy_server.js L293/L591 and shim register), `<script data-dyad-recorder-token=...>`, `<script data-dyad-auth-token=...>`, `data-dyad-id`/`data-dyad-name` attrs on DOM, `dyad_logs.js` injection.
- Console-visible: "dyad-shim.js loaded via proxy v0.8.0", "[dyad-shim] ...", "[Dyad SW] Installing/Activating", "[Dyad] Service Worker registered/..." (dyad-sw*.js), `__dyad_truncated__` JSON key (dyad_logs.js:244).
- DOM globals/ids: `__dyad_auth_pending__`, `__dyad_recorder_overlay__`, `__dyad_overlay__`, `__DYAD_RECORDER_ALLOW_UNTRUSTED__`, `__DYAD_HYBRID_BRIDGE__`, `__DYAD_PUBLIC_PREFIX_PATH__` (template placeholder replaced at injection), `window.__dyadMachines` (src), `__DYAD_TERMINAL__`.
- postMessage protocol between preview iframe and renderer (visible in Network/console via any listener): `dyad-document-loaded`, `dyad-component-selected/deselected/styles/coordinates-updated/overlay(s)`, `dyad-recorder-initialized/action/flushed`, `dyad-screenshot-response`, `dyad-take-screenshot`, `dyad-auth-login`, `dyad-auth-ready`, `dyad-auth-bootstrap-ready`, `dyad-text-content/updated/finalized`, `dyad-select-component-shortcut`, `dyad-preview-reload-shortcut`, `dyad-visual-editing`, `dyad-text-editing`, `dyad-image-src`, `dyad-image-load-error`, `dyad-pro-mode`. Listeners: PreviewIframe.tsx, VisualEditingToolbar/ChangesDialog, useTestRecorder.ts, useShortcut.ts, preview_cdp_broker.ts, preview_iframe/commands, screenshot client; ~20 files + their tests. These must be renamed in lock-step (worker side + renderer side); no persisted state, so no compat needed (old preview tabs reload).
- Hosted mode (VM/browser): browser also sees RPC header `x-dyad-rpc-token`, `x-dyad-free-quota-key`, `x-dyad-thumbnail-cache`, localStorage `dyad-context-packs`, and (WS) any `dyad-*` events; these are bucket C/A for the web build.

## 5. Outbound LLM / engine wire (hidden from clients in hosted mode, but in network logs)
Provider options namespace `"dyad-engine"` with keys `dyadAppId`, `dyadDisableFiles`, `dyadRequestId`, `dyadVersion`, `sourceCommitHash`, `commitHash` (chat_stream_handlers L2527, local_agent_handler L1449, subagent_manager L1797), headers `X-Dyad-Request-Id`, `x-dyad-internal-request-id`, model ids `dyad/auto/*`, `dyad/theme-generator/*`, `dyad/help-bot/default`, env `DYAD_ENGINE_URL` default https://engine.dyad.sh/v1. This is a wire protocol with a server we do not control (engine.dyad.sh) -> bucket D: renaming breaks the engine. Only rename if the engine is replaced/proxied. Safe: keep identifiers, hide from UI.
In hosted web mode the browser never talks to the engine, only the headless server does.

## 6. Old chat content in sqlite
Persisted places carrying old tags: `messages.content` (assistant text, user `<dyad-attachment>` tags, `<dyad-compaction>` summaries), `messages.ai_messages_json` (SDK messages; text parts and tool results contain tags; tool names themselves do NOT contain dyad), `agent_messages.content` (subagent threads, 0 tag hits in local sample), FTS projection `chat_search_fts_idx` (derived, rebuilt via projection_version), `.dyad/chats/<id>/compaction-*.md` backup files inside each app dir (agent is told the path in prompt), `dyad-media://` URLs, `.dyad/media/` paths, `＜dyad` escaped reasoning, `chats.execution_backend='dyad'`.
Consequences if old tags are not handled: old assistant messages render as raw `<dyad-write ...>` markup (not in whitelist after rename), version/"Approve" proposals and add-dependency write-back/security panel fail on old messages, versioned codebase context for old turns is empty, search misses, LLM sees mixed tag dialects in history (and may keep emitting old tags).

## 7. Key risks
1. Write-back sites (executeAddDependency, security LIKE) break silently on old rows unless DB migration or dual-regex is done.
2. Renaming the tag in prompts changes every full-prompt snapshot (e2e-tests/snapshots 59 files; 6 vitest .snap; e2e LLM fixtures 38 files) - review that diffs are pure rename.
3. Model may still emit `<dyad-write>` (history, training data): ingress normalization is mandatory, not optional.
4. `@dyad-sh/*-component-tagger` npm packages + templates cloned from github.com/dyad-sh/* are external; new apps cannot drop them without vendoring (bucket D), and existing apps keep the old dependency.
5. Existing per-app `.dyad` dirs and `dyad-media://` URLs in chat content: need lazy rename + alias or content rewrite; gitignore must list both.
6. pnpm-workspace comment keys validated strictly by socket_firewall.ts; renaming the key without accepting the old one will make existing apps fail validation.
7. Wire/engine identifiers (`dyad-engine`, `dyad/auto/*`, X-Dyad-Request-Id) are protocol with a third party; do not blanket-rename.
8. Preview postMessage names must change on both sides atomically; the worker/*.js files are copied by name (proxy_server.js reads `dyad-*.js` from __dirname, forge/vite configs may list them) - rename files and loaders together.
9. Git history of existing apps keeps author "Dyad" / `git@dyad.sh` / "Init Dyad app"; cannot be fixed without rewriting history.

# Appendix C — Internal identifiers

Read-only audit of /Users/vishal/dyad-web-deploy @ rebrand/nextbuild. P = persisted outside code (needs migration/alias). C = code-only (safe rename).

## 1. On-disk (Electron + headless) — P
| Identifier | Where | Notes / action |
|---|---|---|
| userData folder `dyad` | derived by Electron from package.json `name`/`productName` ("dyad"): ~/.config/dyad, ~/Library/Application Support/dyad, %APPDATA%/dyad. No setName/setPath in prod (src/main.ts:196-205 only sets in NODE_ENV=development) | Renaming productName silently points Electron at an EMPTY new dir. Must migrate BEFORE first `app.getPath("userData")` / `log.eventLogger.startLogging()` (src/main.ts ~l.196) or `app.setPath("userData", <old>)` if new dir absent. |
| Headless data dir | src/server/index.ts:36-41 (DYAD_DATA_DIR -> DYAD_DEV_USER_DATA_DIR -> ./userData); src/server/electron-shim.ts:5-9; src/paths/paths.ts:119-134 (getUserDataPath). VM: DYAD_DATA_DIR=/opt/dyad/deploy-userData (deploy/env.template:19) | Path is env-configured, NOT dyad-derived on hosted. No data move needed on VM if env value kept. |
| Default apps dir `dyad-apps` | src/paths/paths.ts:14-21 (`~/dyad-apps`; in test build `userData/dyad-apps`); src/main.ts:507-512 (git safe.directory), app_handlers.ts:2058 (delete default folder on app deletion), ImportAppDialog.tsx:432-441 (UI label + `copy-to-dyad-apps` id), settingsSearchIndex.ts:137 | `apps.path` (schema.ts:63) is stored RELATIVE to base dir, so changing default base orphans all apps. Migrate: if `~/dyad-apps` exists and `~/nextbuild-apps` doesn't and no `customAppsFolder` set -> rename dir (or keep resolving to old dir). Hosted VM: home of linux user dyad is /opt/dyad so apps are at /opt/dyad/dyad-apps. |
| sqlite.db | src/db/index.ts:41 `path.join(getUserDataPath(),"sqlite.db")` | No dyad in name. No change. |
| user-settings.json | src/main/settings.ts:95 | No dyad in name. Also session.lock, renderer-crash.json, last-session store: no dyad. |
| `dyad-crash-reports` | src/main.ts:316 (userData subdir) | Disposable. Rename; no migration. |
| backups/ | src/backup_manager.ts:57 | No dyad. Already snapshots settings+DB -> use as pre-migration safety net. |
| Logs | electron-log default: macOS ~/Library/Logs/dyad/main.log (comment src/main.ts:196), Linux/Win under userData/logs | Derived from app name; new dir auto. Old logs orphaned (harmless). AGENTS.md debugging text mentions path. |
| `typescript-cache` | paths.ts:24-32 | No dyad. |
| Temp dirs | themes_handlers.ts:73 `os.tmpdir()/dyad-theme-images`; spec-only mkdtemp prefixes `dyad-tsc-`, `dyad-build-test-`; run_build.ts:46-47 `.dyad-build-xxxxxx` snapshot prefix (inside app dir, transient) | C. Safe rename. run_build SNAPSHOT_NAME_PATTERN must be updated with prefix (could orphan leftover snapshot dirs: accept `.dyad-build-` + `.nextbuild-build-` in cleanup). |
| coolify keys | src/ipc/utils/coolify_deploy_key.ts:19 "dyad-deploy", src/coolify_setup/server_key.ts:25 "dyad-server-access" | These are SSH key comments/names registered on user's remote servers/Coolify. Persisted remotely -> keep matching old names or lookups fail. Check before renaming. |

## 2. Inside each generated app — P
- `.dyad/` folder (src/ipc/utils/media_path_utils.ts:9 DYAD_INTERNAL_DIR_NAME; subdirs media, screenshot, todos (local_agent/todo_persistence.ts:21), plans, chat history, rules; resolve_app_context.ts:43-60 globs `**/.dyad/**`, `!.dyad/**`, first-segment check `.dyad`). Also `.gitignore` entry added by ensureDyadGitignored (handlers/gitignoreUtils.ts) and copy_file/generate_image/execute_sandbox_script tool prompts.
- Existing apps have `.dyad/` on disk, gitignored `.dyad/` lines, and chat DB messages that reference `.dyad/media/<file>` paths and `dyad-media://media/<app>/.dyad/<sub>/<file>` URLs (94 `.dyad/media` hits; protocol handler src/main/dyad_media_protocol.ts:99-105).
- Action: new constant NEXTBUILD_INTERNAL_DIR_NAME=".nextbuild". For existing apps, lazy per-app migration is risky (thousands of file refs in chat content). Recommended: resolver tries `.nextbuild` first then falls back to `.dyad` (read both; write only new); one-time per-app rename `.dyad` -> `.nextbuild` ONLY when opening app, plus rewrite is NOT done for old chat text -> media URL/path resolver must map legacy `.dyad/...` in path -> `.nextbuild/...` if the legacy file no longer exists. Ensure both entries in .gitignore. Simplest safe: keep reading `.dyad` forever as legacy (allowlisted), never create it.
- Git author: src/ipc/utils/git_author.ts name "Dyad", email "git@dyad.sh" fallback -> committed into user repo history (permanent in old repos; can't rewrite). Change for new commits only.
- Scaffold: scaffold/src/components/made-with-dyad.tsx, scaffold/package.json devDep `@dyad-sh/react-vite-component-tagger` (bucket B/D, noted).
- playwright_bootstrap.ts:209,254: `playwright-dyad.config.ts`, sentinel "Generated by Dyad" written into generated projects; sentinel is used to detect previously generated file -> accept both.

## 3. Database
- Tables/columns: no table/column name contains dyad (src/db/schema.ts). drizzle SQL only: migration 0051 adds `chats.execution_backend DEFAULT 'dyad'` (+ meta snapshots 0051/0052). Persisted VALUE 'dyad' in every chat row (schema.ts:143-146; shared/execution_backend.ts:6-27,76-82; ModelPicker.tsx:325; MessagesList.tsx:51; ChatMessage.tsx:107). Recommendation: KEEP the literal "dyad" (invisible, allowlist) — changing needs sqlite table rebuild + new migration; do NOT edit existing migration files/snapshots (drizzle checksum + journal).
- Message content in DB (`messages.content`) holds `<dyad-*>` tags, `dyad-media://` URLs, `.dyad/media` paths -> parser must accept both (Phase 4). Other persisted strings: `previewRouteSource: "dyad"` (window_infrastructure/types.ts:65; session/window state persisted? likely in last-session; accept both).
- DB-stored encrypted blobs (encryptToString) tied to safeStorage key — see §6.

## 4. Settings keys (settings.json) — P
- `enableDyadPro` (schemas.ts:507), `dyadProBudget` (:481), `providerSettings` key for provider ids if any (provider id "auto" no dyad). `isDyadProEnabled`/`hasDyadProKey` are code names (C). Persisted keys need read-old/write-new in `migrateStoredSettings` (src/main/settings.ts:788; function imported from schemas) — existing pattern for legacy conversion. Zod parse (settings.ts:790) strips unknown keys, so renaming a key without migration silently loses it. Model ids `dyad/auto/*`, `dyad/theme-generator/*` are engine catalog ids (bucket D) persisted in `selectedModel` — don't touch without engine support.
- Pro key env `DYAD_PRO_KEY`/`DYAD_PRO_API_KEY`: code-only.

## 5. Protocols / deep links — P (OS registration)
- `dyad://` : src/main.ts:407,412 setAsDefaultProtocolClient; 426-429 registerDyadProtocolLinux (src/main/linux_protocol_registration.ts); 1374,1393,1483 handlers (`dyad:` protocol check at 1483; hosts: supabase-oauth-return, dyad-pro-return (1583), add-mcp-server, add-prompt, neon, ...). forge.config.ts:192-193 `schemes: ["dyad"]`, :250,256 mimeType `x-scheme-handler/dyad`.
- OAuth redirect pages (external, bucket D) deep-link to `dyad://` — new scheme only works after the proxy/redirect is changed; keep BOTH schemes registered. `dyad-media://` is a custom privileged scheme (main.ts:582-594,1357-1361; dyad_media_protocol.ts) used in persisted chat content -> register BOTH `nextbuild-media` and `dyad-media` handlers.
- Hosted/headless: no OS protocol; deep links are n/a.

## 6. safeStorage / Keychain — HIGH RISK
- macOS Keychain item service "<productName> Safe Storage", account "<productName> Key" (rules/safe-storage.md). Changing productName creates a new empty identity -> every encrypted blob in settings.json (tokens, API keys) and DB (MCP headers/env via secret_storage.ts, OAuth provider) becomes undecryptable on first run. src/main/safe_storage_legacy.ts:56-57 LEGACY_IDENTITIES = [{"dyad Safe Storage","dyad Key"},{"Chromium Safe Storage","Chromium Key"}] + recoverLegacySafeStorageSecret + rewriteRecoveredSafeStorageSecretsAfterKeychainUnlock (main.ts:34-37) + native `dyad-keychain-reader` (forge.config.ts:103,156,219; packaging_cleanup.ts:232; native/keychain-reader/package.json:2; scripts/rebuild-keychain-reader.mjs; safe_storage_legacy.ts:126,560) — this machinery already recovers secrets from an old identity: keep "dyad Safe Storage"/"dyad Key" literally in the list (allowlisted hit), add "NextBuild Safe Storage" only if needed. Must be re-tested with the old-data-dir fixture (e2e safe_storage_keychain_identity.spec.ts pre-seeds `dyad Key`).
- Windows (DPAPI) / Linux (libsecret `<name>` Safe Storage / v10 hardcoded key): Windows DPAPI is app-independent; Linux gnome-libsecret uses app name. Same legacy-identity concern.
- Headless: electron-shim.ts:258-267 safeStorage is plaintext passthrough; no migration issue. VM settings are plaintext.

## 7. Env vars (code-only but wired into persistent deploy config)
~120 distinct DYAD_* vars (VITE_* have no dyad names). Hosted-critical ones set in the VM's `/opt/dyad/app/deploy/env` (NOT in git; hand-edited): DYAD_PUBLIC_HOSTNAME, DYAD_RPC_TOKEN, DYAD_RPC_ALLOWED_ORIGINS, DYAD_DATA_DIR, DYAD_VITE_ALLOWED_HOSTS, DYAD_PREVIEW_PUBLIC_URL_BASE, DYAD_OPENVIKING_URL (+ DYAD_OPENVIKING_API_KEY, DYAD_HEADLESS_PORT, DYAD_HEADLESS_VITE_PORT, DYAD_ADMIN_EMAIL, DYAD_PREVIEW_ROUTER_PORT). Read in src/server/index.ts:36-40,56; electron-shim.ts; paths.ts:121; vite.renderer.config.mts (5 hits); scripts/run-headless-*.mjs, start-supervisor.mjs; worker/proxy_server.js; src/app_run/*.
Action: single alias helper (src/brand.ts `env(name)` reading NEXTBUILD_X then DYAD_X) OR at process start copy every DYAD_* to NEXTBUILD_* when unset. Rename in code and keep legacy fallback so the live VM env keeps working until MANUAL_STEPS updates deploy/env. Test/E2E-only vars (DYAD_TEST_*, DYAD_E2E_*) are C, rename freely with tests/CI workflows.

## 8. HTTP / network identifiers
- Header `x-dyad-rpc-token`: client src/ipc/contracts/core.ts:367; server src/server/index.ts:74; also docs/scripts/.claude/tmp. Browser JS and server ship together -> rename OK but accept BOTH on server (cached old bundles; scripts). Env `DYAD_RPC_TOKEN`/`VITE_RPC_TOKEN`.
- Outbound headers `X-Dyad-Request-Id`, `X-Dyad-Free-Quota-Key` (llm_engine_provider.ts:264-268,424; image_generation_service.ts:182; engine_fetch.ts:129; themes_handlers.ts:866), `x-dyad-internal-request-id` (provider_options.ts:120), `X-Dyad-Thumbnail-Cache` (dyad_media_protocol.ts:180). Request headers to dyad engine are bucket D (engine reads them) — keep or proxy. Network-visible: appear in outgoing requests; if engine is replaced/proxied they must be renamed in lockstep.
- Cookie `_dyad_oauth2` (deploy/oauth2-proxy.cfg:24): rename = one forced re-login; VM-local config edit (cfg is hand-maintained) -> MANUAL_STEPS.
- OPENROUTER_APP_TITLE "Dyad" (openrouter_attribution.ts:2) — sent to OpenRouter as X-Title; network-visible.
- IPC channel names: only `restart-dyad` (src/ipc/types/system.ts:457). RPC routes derive from contract names (no dyad). C.
- postMessage types between preview iframe shim and renderer: "dyad-take-screenshot", "dyad-pro-mode", "dyad-auth-login", window globals `__dyadIpcEnvelope`, `__dyadDate`, `__dyadConsoleOmissionMarker`, `window.__dyadMachines`; worker/dyad-*.js (9 files: dyad-shim.js, dyad-sw.js, dyad-sw-register.js, dyad-recorder-client.js, dyad-auth-bootstrap.js, dyad-component-selector-client.js, dyad-screenshot-client.js, dyad-visual-editor-client.js, dyad_logs.js) are injected into EVERY generated app preview and visible to clients via devtools/network -> they are bucket-B-ish; rename file names + message types together with proxy_server.js, vite.*.config, forge copy lists. SW scope/cache names persist in browsers (one-time re-register; harmless).

## 9. Browser storage — P (per-browser, silently lost if renamed)
- localStorage via jotai atomWithStorage: `dyad-context-packs` (src/atoms/chatAtoms.ts:148-151; hosted default ON when VITE_PREVIEW_URL_TEMPLATE set — a renamed key would revert users who turned packs OFF back to ON), `dyad:terminal-font-size` (terminalAtoms.ts:6-7).
- localStorage: `dyadTelemetryConsent`, `dyadTelemetryUserId`, `dyadProStatus` (hooks/useSettings.ts:14-16), `dyadPostHogErrorDedupe:v1` (lib/posthogTelemetry.ts:10), sessionStorage `dyad:e2e:virtualized-chat` (MessagesList.tsx:811; test-only). Keys without dyad: `chat-tab-session`, `group-tabs-by-app`, `theme`.
- DOM events (not storage): `dyad:restore-chat-scroll` (chat/scroll/restore.ts:1) C.
- Action: tiny `migrateLocalStorageKeys()` in renderer entry (before atoms hydrate): for each [old,new], if new missing and old present -> copy; leave old. jotai atomWithStorage reads synchronously on init (getOnInit? check) so run before first render. Note: hosted origin same, so copying works.

## 10. Hosted deploy (VM, outside git state) — mostly MANUAL
deploy/: Caddyfile (comments only), dyad-web.service (unit name, User=dyad, Group=dyad, WorkingDirectory /opt/dyad/app, EnvironmentFile /opt/dyad/app/deploy/env), oauth2-proxy.service (User=dyad, /opt/dyad/app/deploy), openviking.service (User=dyad, OPENVIKING_HOME=/opt/dyad/.openviking), provision-vm.sh (APP_DIR=/opt/dyad/app, useradd dyad -d /opt/dyad, systemctl units), setup-secrets.sh, env.template, ONE_SHOT_ORACLE.md, oauth2-proxy.cfg:24. Also GitHub remote `vishxl/dyad` in ONE_SHOT (git clone url, repo rename is manual).
Recommendation: for the LIVE VM do NOT rename linux user / /opt/dyad / existing unit in place (risk: data dir, file ownership, openviking home). New repo artifacts (provision-vm.sh for fresh VMs) can use nextbuild names; add MANUAL_STEPS section "optional VM rename" with exact commands (stop services, usermod -l, mv /opt/dyad /opt/nextbuild, update units/env/Caddy, daemon-reload). Keep `deploy/env` DYAD_* working via env alias. Systemd unit file rename (dyad-web.service -> nextbuild-web.service) requires disable old/enable new — doc'd in MANUAL_STEPS.

## 11. Existing migration / aliasing code (reuse points)
- `migrateStoredSettings` (settings.ts:788) — add key renames here (enableDyadPro -> enableNextBuildPro etc. or keep).
- Drizzle `migrate()` in src/db/index.ts (schema only; do not touch dyad-named history).
- `BackupManager` (backup_manager.ts; settings+DB snapshot at startup, main.ts ~l.436-441) — safety net.
- safe_storage_legacy.ts: keychain identity recovery.
- claimCrashSentinel/readLegacyCrashSentinelTimestamp (settings.ts:167-180): pattern for tolerant legacy-format reads.
- No existing userData/apps-dir/protocol/localStorage rename code.

## 12. Where to run the first-launch migration (idempotent)
Create `src/brand_migration.ts` (pure fs, takes {oldUserData,newUserData,home}, writes marker file `.nextbuild-migrated` with version; no-ops when marker or new dir with sqlite.db exists; uses fs.rename else cpSync; never deletes old).
- Electron main: call synchronously at top of src/main.ts BEFORE line ~196 (before `log.eventLogger.startLogging()`, before anything calls getUserDataPath/readSettings/`app.getPath("userData")`) — i.e. prior to `app.whenReady`. Compute old dir via `path.join(app.getPath("appData"), "dyad")` (productName now NextBuild). Also set `app.setPath("userData", newDir)` explicitly. Also apps-dir move and setAsDefaultProtocolClient for both schemes (main.ts:407-412) + forge schemes ["nextbuild","dyad"].
- Headless: top of src/server/index.ts BEFORE line 36 (env alias + legacy dataDir fallback: if DYAD_DATA_DIR set honor it; no data move since dir is env-defined) and before `initializeDatabase` import runs; apps-dir default migration here via same module (home-relative `dyad-apps` -> `nextbuild-apps`, skipped if customAppsFolder in settings).
- Renderer: localStorage key copy at app entry (src/renderer.tsx / jotai provider bootstrap).
- Tests: unit tests with tmp dirs for (fresh, old-only, both-exist, rerun idempotent, partial/interrupted marker) cases.

## Risks (ranked)
1. Keychain/safeStorage orphaning on macOS/Linux when productName changes (§6).
2. userData silently empty if productName changes before migration runs (§1).
3. `apps.path` relative to base dir -> apps vanish if default apps dir is renamed without move (§1).
4. `.dyad` folder refs in old chat content & per-app dirs (§2).
5. Hand-edited VM config (`deploy/env`, oauth2-proxy.cfg, unit files) not under git: code rename of env vars/header/cookie breaks hosted instance unless legacy fallbacks + MANUAL_STEPS (§7,8,10).
6. OAuth/deeplink round-trips use external redirect pages that emit `dyad://` (§5).
7. Zod strips renamed settings keys silently (§4). Never edit existing drizzle migrations/snapshots (§3).
8. SSH key names registered on remote Coolify servers (§1).

# Appendix D — External dependencies

Scope: tracked files excluding context/, plans/, .claude/, benchmarks/, package-lock.json.
Hosted context: headless Node server on the VM (src/server/index.ts) + Vite UI in the user's browser + generated apps. "Server-side" calls run on the VM (invisible in the browser network tab, visible in server logs/egress). "Client-visible" = browser UI text, browser network tab, generated project files, or LLM output.

## Method
`/tmp/audit/urls.mjs` extracted 127 distinct dyad-bearing URLs; env-override and runtime usage traced by hand. Package publication checked via `npm view` and raw.githubusercontent.

## 1. Domains / endpoints

| Dependency | Where | What it does | Hosted runtime? | Client-visible | Env override | Recommendation |
|---|---|---|---|---|---|---|
| api.dyad.sh/v1/desktop-config | src/ipc/shared/remote_desktop_config.ts | remote feature config | server, startup | no | DYAD_DESKTOP_CONFIG_URL | Point at empty/local JSON (or disable fetch in hosted mode); verify code has a fallback |
| api.dyad.sh/v1/language-model-catalog | remote_language_model_catalog.ts (+ built-in fallback list lines ~158-274) | remote model catalog | server | model labels in picker | DYAD_LANGUAGE_MODEL_CATALOG_URL | Ship local snapshot, point override at it / disable remote |
| api.dyad.sh/v1/mcp-catalog | remote_mcp_catalog.ts | MCP server catalog | server | catalog cards | DYAD_MCP_CATALOG_URL | Local snapshot or disable |
| api.dyad.sh/v1/templates | src/ipc/utils/template_utils.ts:41 | extra templates list | server | template picker | NONE | Add env/BRAND override; default to [] |
| api.dyad.sh/v1/default-approve-builds.txt | src/ipc/utils/socket_firewall.ts | pnpm build-script allowlist | server (installs) | no | DYAD_ALLOW_BUILDS_REMOTE_URL / DYAD_DEFAULT_APPROVE_BUILDS_URL | Vendor file locally (security-relevant: keep content, rehost) |
| api.dyad.sh/health | free_agent_quota_handlers.ts:40 | server time for free-agent quota | server | no | none | Remove with Pro/free-quota surfaces |
| api.dyad.sh/v1/user/info | user_budget_service.ts | Pro budget | only with Pro key | no | DYAD_USER_INFO_URL | Keep in config, unused |
| api.dyad.sh/v1/update/* + GitHub publisher dyad-sh/dyad | src/main.ts:636-650, forge.config.ts:238-270 | Electron auto-update/publish | NO (desktop only) | no (desktop installer) | n/a | Disable updater; repoint/remove publisher + raw.githubusercontent icon URL |
| engine.dyad.sh/v1 (Dyad Engine) | src/ipc/utils/dyad_engine_url.ts + ~12 callers (pro_handlers, images, web-crawl, track-usage, cloud sandbox) | paid LLM gateway, image gen, web crawl, usage tracking | only if a Dyad Pro key is set; hosted uses BYOK | model ids/labels only when Pro | DYAD_ENGINE_URL | Keep default in config only; hide Pro UI; (own engine = out of scope) |
| Model ids dyad/auto/*, dyad/theme-generator/*, dyad/help-bot/default | remote_language_model_catalog.ts, language models | wire protocol with engine | only Pro | picker only if Pro | none | CANNOT rename without own engine; keep id, map display name via brand.ts; hide when no Pro |
| helpchat.dyad.sh/v1 | help_bot_handlers.ts:69 | help chatbot | on user action | HelpDialog | none | Disable help-bot |
| upload-logs.dyad.sh/generate-upload-url | components/HelpDialog.tsx:46 | upload debug logs to Dyad | browser fetch on user action | YES (browser network tab, ships logs to Dyad) | none | Disable/remove (privacy leak); or proxy to own endpoint |
| oauth.dyad.sh (Neon), supabase-oauth.dyad.sh (Supabase) | src/connection_flow/oauth_deep_link.ts, neon_admin/, supabase_admin/ | Dyad-registered OAuth apps; redirect back via dyad:// deep link | on user action; deep link CANNOT work in a browser | YES (URL opened) | DYAD_NEON_API_BASE_URL partial | Disable Neon/Supabase connect in hosted OR register own OAuth apps + own proxy domain (user action) |
| GitHub OAuth client id Ov23liWV2HdC0RBLecWx | github_handlers.ts:74 | device flow for GitHub connect | on user action | YES: GitHub consent screen says "Dyad" | GITHUB_CLIENT_ID | Register own GitHub OAuth App "NextBuild" (user action) |
| academy.dyad.sh, dyad.sh/pro, www.dyad.sh/pro | ~20 components (ModelPicker, ProBanner, SetupBanner, ChatErrorBox, DyadProTrialDialog...), pro_handlers (subscription-status) | Pro billing/upsell | links only | YES (UI buttons/links) | DYAD_PRO_UPGRADE_BASE_URL, DYAD_SUBSCRIPTION_STATUS_URL | Hide all Pro/upsell UI behind brand flag |
| www.dyad.sh/docs/* | ~25 UI links (HelpDialog, GitHubConnector, ChatErrorBox, PortalMigrate, AppUpgrades, SecurityPanel, TelemetryBanner privacy policy...) | docs deep links | links | YES | none | Route via brand.ts docs base; point to NextBillion docs or remove |
| www.dyad.sh/docs/releases/* | release_note_handlers.ts, window_security.ts allowlist | release-notes iframe | on update | YES | none | Disable |
| github.com/dyad-sh/dyad(/issues/new), reddit r/dyadbuilders, x.com/dyad_sh | ErrorBoundary.tsx, issueBody.ts, PromoMessage.tsx, README, SECURITY | support/social links | links | YES | none | Repoint to internal tracker / remove promo |
| PostHog us.i.posthog.com, hardcoded key phc_5Vxx... | src/renderer.tsx:112-116, lib/posthogTelemetry.ts | product analytics + exception capture; events carry "dyad" names (e.g. setup-flow:ai-provider-setup:dyad:click) | browser; events gated by localStorage opt-in, but init still runs | YES (network tab, posts to Dyad's PostHog project) | none | Remove init (no-op client) or swap to own key; no Sentry present |
| OpenRouter attribution headers | src/ipc/utils/openrouter_attribution.ts | HTTP-Referer https://www.dyad.sh, X-OpenRouter-Title "Dyad" | server, every OpenRouter call | visible to OpenRouter (3rd party dashboard) | none | Change to NextBuild + own URL (brand.ts) |
| GitHub API User-Agent "Dyad" | createFromTemplate.ts:100 | GitHub tarball fetch | server | no | none | Brand string |
| forge.config.ts logo URL raw.githubusercontent.com/dyad-sh/dyad/main/assets/icon/logo.ico | forge.config.ts:238,243 | Windows installer icon (Squirrel) | desktop build only | installer | none | Point at own hosted/local icon (Phase 7) |
| staging---dyad-llm-engine-...run.app | package.json `staging:engine` script | dev script | no | no | n/a | Delete script |

## 2. GitHub template repos (generated projects clone these)

src/shared/templates.ts:42,52,62 + .github/workflows/ci.yml, claude-deflake-e2e.yml (clone nextjs-template):
- github.com/dyad-sh/nextjs-template, react-vite-nitro, portal-mini-store-template. Default "react" template = local `scaffold/` (no network).
- Each repo's package.json depends on @dyad-sh/*-component-tagger (verified via raw GitHub): nextjs-template + portal -> @dyad-sh/nextjs-webpack-component-tagger ^0.8.0; react-vite-nitro -> @dyad-sh/react-vite-component-tagger ^0.9.0. Also likely carry made-with-dyad, data-dyad-id, "dyad" strings (unaudited: external repos).
- Client-visible: YES (generated project files, template picker URL, clone source).
- Recommendation: fork three repos into NextBillion GitHub org as e.g. nextbuild-nextjs-template, rebrand inside the forks, repoint templates.ts. USER ACTION (org + repo creation, push access/token). Until done: hide the three non-scaffold templates in hosted mode.

## 3. npm packages

| Package | Published? | Used by | Notes / recommendation |
|---|---|---|---|
| @dyad-sh/react-vite-component-tagger 0.9.0 | YES (Apache-2.0) | scaffold/package.json:65, scaffold/vite.config.ts:2, scaffold/pnpm-lock.yaml (resolved from registry), react-vite-nitro template, app_upgrade_handlers (injects it into older apps), e2e snapshots | Source is in-repo: packages/@dyad-sh/react-vite-component-tagger. Safest: VENDOR into scaffold as a local plugin file (e.g. scaffold/plugins/nextbuild-component-tagger.ts, relative import) -> no npm publish, no scope. Must regenerate scaffold/pnpm-lock.yaml (pnpm install), update app_upgrade_handlers, worker/dyad-component-selector-client.js (data-dyad-id -> data-nextbuild-id, selector must accept both for old apps). Existing apps keep the old package (still resolves from npm) -> still contain trace; acceptable if documented. |
| @dyad-sh/nextjs-webpack-component-tagger 0.8.0 | YES (Apache-2.0) | next templates (webpack loader referenced by package name) | Source in-repo: packages/@dyad-sh/nextjs-webpack-component-tagger. Must be vendored inside the forked template repos (loader referenced by file path in next.config). Or publish under own scope (USER ACTION: npm org + token). |
| @dyad-sh/supabase-management-js 1.0.1 | YES (no license field shown) | main package.json:83; src/ipc/handlers/supabase_handlers.ts, src/ipc/types/supabase.ts, supabase_management_client.ts (errors/types) | Server-side only, not in generated projects, not client-visible. Not in repo source. Options: (a) keep as allowlisted external dep (simplest, no trace for clients), (b) vendor dist/ into packages/ and alias. Recommend (a) unless the packaged asar sweep must be dyad-free -> then (b) or fork under own scope. Decision for user. |
| dyad-keychain-reader | local `file:native/keychain-reader` | package.json, forge.config.ts | NOT external; internal rename (bucket C), desktop-only. |

## 4. Not exercised by hosted fork (desktop only)
Auto-update (main.ts), forge publisher, dyad:// protocol registration, Squirrel icon URL, keychain reader. Hidden from web clients; still need Phase 5/6 rename for the packaged-app sweep.

## 5. Generated project / LLM-visible leakage tied to externals
- scaffold/src/components/made-with-dyad.tsx: "Made with Dyad" linking https://www.dyad.sh/ (client-visible in every generated app). Rename + new URL (needs NextBillion URL from user) or remove component. Also referenced by app upgrade code and e2e fixtures (edit-made-with-dyad.md).
- scaffold/index.html title `dyad-generated-app`, scaffold/README.md "Welcome to your Dyad app".
- No dyad URLs found in src/prompts (system prompts contain no dyad.sh links; "Dyad" name/tags handled in bucket B).
- No CDN/fonts domains with dyad names. Only external non-dyad: cdn.coollabs.io (Coolify installer) — leave.

## 6. Hidden-from-UI / config strategy
All env-overridable URLs should be routed through src/brand.ts (or an env-config module): docsUrl, supportUrl, issuesUrl, proUrl(disabled), engineUrl (default unchanged, never shown), openrouterReferer/title, githubClientId, templateRepos. Add one hosted-mode flag (`VITE_HOSTED`/existing VITE_PREVIEW_URL_TEMPLATE) that hides Pro, help-bot, log upload, release notes, update, promo, Neon/Supabase OAuth until replacements exist.

## 7. User actions required (feed into MANUAL_STEPS.md)
1. Create NextBillion GitHub org repos and fork the 3 template repos (+ own app repo for source/CI; vishxl/dyad rename).
2. Register GitHub OAuth app "NextBuild" -> GITHUB_CLIENT_ID in deploy/env.
3. (Optional) Register own Neon + Supabase OAuth apps and host OAuth proxy domain; otherwise features disabled.
4. (Optional) npm scope + token if publishing taggers instead of vendoring.
5. Provide docs/support/home URLs for "Made with NextBuild" footer and docs links.
6. Decide on PostHog: none (recommended) vs own project key.
7. Decide on @dyad-sh/supabase-management-js: keep allowlisted vs vendor.
8. VM: update deploy/env (DYAD_* env var rename must be applied on the VM simultaneously with deploy; keep old names read as aliases during cutover).
