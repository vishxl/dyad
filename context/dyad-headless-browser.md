# Dyad Headless / Browser Mode — Reproducibility Context Document

**Date:** 2026-10-06  
**Repo:** `/Users/vishal/dyad` (Dyad, not bolt.diy)  
**Base commit:** `701d9179` — _Bump to v1.18.0 (#4734)_  
**Working tree:** dirty (uncommitted changes on `main`)  
**Goal:** Run Dyad's main-process logic headless (plain Node, no Electron) and serve the existing React renderer in a normal browser, with IPC exposed over HTTP/WebSocket.

---

## 1. What was done (high-level)

1. Built a headless Node server that bundles `src/server/index.ts` into `dist/headless-server.cjs`.
2. The server emulates Electron's `ipcMain`/`ipcRenderer` and exposes every registered IPC channel as `POST /rpc/<channel>` on `127.0.0.1:3000`.
3. Live main→renderer events are pushed over a WebSocket at `ws://127.0.0.1:3000/ws`.
4. The existing renderer Vite app is launched on `127.0.0.1:4173` with `VITE_BROWSER_IPC=1`; its `vite.renderer.config.mts` proxies `/rpc` and `/ws` to the headless server.
5. `src/ipc/contracts/core.ts` auto-detects browser mode and injects a `createBrowserIpcBridge()` client so the React code thinks it is still talking to Electron.
6. Fixed runtime blockers that only appeared in headless mode:
   - stale `LOCAL_GIT_DIRECTORY` causing Git ENOENT
   - wrong Node binary winning on `PATH`
   - missing preview proxy worker path
   - generated lockfiles being treated as user modifications
   - DB migration folder not found when bundled
   - `safeStorage`/keychain reader failing in CJS bundle

---

## 2. Environment requirements

- **Node:** `>=24 <26` (project `engines`). Verified on `v24.21.0`.
- **nvm:** used to switch to Node 24 because the system default may be Node 20.
- **OS:** macOS (current dev environment). Linux/Windows paths will differ for Git and `PATH`.
- **Package manager:** pnpm (lockfile present; `allowScripts` block added to `package.json` so lifecycle scripts can run under pnpm).
- **Native modules:** `better-sqlite3`, `dugite`, `cpu-features`, `dyad-keychain-reader` must build for Node 24. Run `npm rebuild better-sqlite3` (and similar) after switching Node versions.
- **Ports:** `3000` (headless IPC server) and `4173` (Vite renderer dev server) must be free.

---

## 3. How to build and run

### 3.1 Install / switch Node

```bash
source "$HOME/.nvm/nvm.sh"
nvm use 24
node --version   # expect v24.x
```

### 3.2 Install dependencies (if starting fresh)

```bash
cd /Users/vishal/dyad
pnpm install
# or npm install, but pnpm is the project's lockfile
```

If native modules were built against a different Node version:

```bash
npm rebuild better-sqlite3
# also rebuild any other native modules that fail with NODE_MODULE_VERSION errors
```

### 3.3 Run headless server only

```bash
npm run headless:server
```

This executes:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use 24 >/dev/null && node scripts/run-headless-server.mjs
```

- Builds `dist/headless-server.cjs` if `src/server/index.ts` is newer than the bundle.
- Listens on `http://127.0.0.1:3000`.
- WebSocket on `ws://127.0.0.1:3000/ws`.
- Data directory defaults to `./userData`; override with `DYAD_DATA_DIR`.

### 3.4 Run headless server + browser UI

```bash
export DYAD_DATA_DIR="/tmp/dyad-headless-browser"
npm run headless:browser
```

This executes `scripts/run-headless-browser.mjs`, which:

1. Builds the headless server if needed.
2. Starts it with `DYAD_DATA_DIR`.
3. Starts Vite for the renderer on `127.0.0.1:4173` with `VITE_BROWSER_IPC=1`.

Open: `http://127.0.0.1:4173/`

### 3.5 Test an RPC endpoint with curl

```bash
curl -X POST http://127.0.0.1:3000/rpc/get-apps \
  -H "Content-Type: application/json" \
  -d '{}'
```

Any registered IPC channel can be called this way.

---

## 4. Files changed / added

### New files

| File                                | Purpose                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/server/index.ts`               | Headless HTTP+WS server entrypoint; virtual Electron window/event; registers IPC handlers.                    |
| `src/server/electron-shim.ts`       | Electron API shim (`app`, `BrowserWindow`, `ipcMain`, `safeStorage`, `dialog`, etc.) for headless CJS bundle. |
| `src/server/node-pty-shim.ts`       | No-op `node-pty` shim so the bundle does not need the native module.                                          |
| `src/main/git_path.ts`              | Shared Git directory resolution, system-Git fallback, and stale `LOCAL_GIT_DIRECTORY` sanitization.           |
| `scripts/build-headless-server.mjs` | esbuild script that bundles `src/server/index.ts` → `dist/headless-server.cjs`.                               |
| `scripts/run-headless-server.mjs`   | Rebuilds the bundle if needed and runs it.                                                                    |
| `scripts/run-headless-browser.mjs`  | Rebuilds bundle, starts headless server, starts Vite renderer dev server.                                     |
| `src/main_git_path.test.ts`         | Regression tests for Git path sanitization.                                                                   |

### Modified files

| File                                      | Change                                                                                                                                                                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                            | Added `headless:*` scripts; added `@ai-sdk/anthropic` override; added `allowScripts` block for pnpm lifecycle scripts.                                                                                                 |
| `src/main.ts`                             | Replaced inline `resolveLocalGitDirectory` with `ensureRuntimeGitEnvironment` from `src/main/git_path.ts`.                                                                                                             |
| `src/ipc/contracts/core.ts`               | Added `createBrowserIpcBridge`; `createClient`/`createEventClient`/`createStreamClient` now auto-detect browser mode via `VITE_BROWSER_IPC` or `?browserIPC=1` and inject the bridge as `window.electron.ipcRenderer`. |
| `src/ipc/handlers/node_handlers.ts`       | `reloadNodePath()` now prepends `dirname(process.execPath)` before custom/managed node logic so the active runtime wins.                                                                                               |
| `src/ipc/utils/git_utils.ts`              | `isUserVisibleGitPath` now ignores generated lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`, `bun.lock`) so they do not block template application.                                        |
| `src/ipc/utils/start_proxy_server.ts`     | Added `resolveProxyWorkerPath()` that searches multiple candidate paths for `worker/proxy_server.js`; throws a clear error if missing.                                                                                 |
| `src/db/index.ts`                         | Added `resolveMigrationsFolder()` that searches multiple candidate paths for the `drizzle` migrations folder.                                                                                                          |
| `src/main/safe_storage_legacy.ts`         | Uses `module.require` when available, falling back to `createRequire`, so the CJS headless bundle can load `dyad-keychain-reader`.                                                                                     |
| `vite.renderer.config.mts`                | Added `server.host: "127.0.0.1"` and proxy rules for `/rpc` → `http://127.0.0.1:3000` and `/ws` → `ws://127.0.0.1:3000`.                                                                                               |
| `src/__tests__/proxy_server_port.test.ts` | Added test for `resolveProxyWorkerPath()`.                                                                                                                                                                             |
| `src/ipc/utils/git_utils.test.ts`         | Added lockfile to the "ignores Dyad-managed runtime files" test.                                                                                                                                                       |

---

## 5. Key design decisions

- **Electron shim, not rewrite:** The headless server imports the real `registerIpcHandlers()` and uses a shim module aliased to `electron` at bundle time. This keeps the IPC handler code unchanged.
- **Browser bridge transparent to renderer:** `createClient`/`createEventClient`/`createStreamClient` detect browser mode and install `window.electron.ipcRenderer`. The rest of the renderer code is untouched.
- **Data directory:** `DYAD_DATA_DIR` / `DYAD_DEV_USER_DATA_DIR` resolve to `./userData` by default. The shim and server agree on the same directory.
- **PATH hygiene:** The active Node binary's directory is prepended to `PATH` in both the headless server startup and `reloadNodePath()`. This prevents a stale system Node 20 from winning over Node 24.
- **Git resilience:** `ensureRuntimeGitEnvironment` validates `LOCAL_GIT_DIRECTORY`; if it points to a missing/invalid directory it is cleared and a fallback chain (bundled Dugite → packaged resources → system Git) is used.
- **Lockfiles are Dyad-managed artifacts:** Generated `package-lock.json`/`pnpm-lock.yaml`/etc. are excluded from "uncommitted user modifications" so template application is not rejected after dependency install.

---

## 6. Known issues and workarounds

| Issue                                                                    | Cause                                                                                    | Workaround                                                                            |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `Cannot find module 'better-sqlite3'` / `NODE_MODULE_VERSION` mismatch   | Native module built against Node 20                                                      | `npm rebuild better-sqlite3` under Node 24                                            |
| Port 3000 or 4173 already in use                                         | Old server/Vite processes still running                                                  | `pkill -f "node.*headless-server"`; `pkill -f "vite.*4173"`; or use different ports   |
| Preview proxy worker not found at `/Users/vishal/worker/proxy_server.js` | Worker path resolution assumed a repo-relative layout that did not hold in headless mode | `resolveProxyWorkerPath()` now searches multiple candidates                           |
| Template application rejected due to local modifications                 | Generated `pnpm-lock.yaml`/`package-lock.json` counted as user changes                   | Lockfiles are now excluded from `isUserVisibleGitPath`                                |
| Git `ENOENT` during app creation                                         | Stale `LOCAL_GIT_DIRECTORY` from a previous install                                      | `ensureRuntimeGitEnvironment` sanitizes it                                            |
| Browser UI loads but RPC calls fail                                      | Vite proxy not active or `VITE_BROWSER_IPC` not set                                      | Verify `vite.renderer.config.mts` proxy rules and that the server started before Vite |

---

## 7. Validation commands

Run these to confirm the current state:

```bash
# Git path + bootstrap tests
npx vitest run src/main_git_path.test.ts src/main_bootstrap.test.ts

# Proxy worker tests
npx vitest run src/__tests__/proxy_server_port.test.ts \
  src/__tests__/proxy_server_hostname.test.ts \
  src/__tests__/proxy_server_csp.test.ts

# Git utils tests (lockfile exclusion)
npx vitest run src/ipc/utils/git_utils.test.ts

# IPC contract tests
npx vitest run src/ipc/contracts/core.test.ts
```

Expected results (as of this document):

- `src/main_git_path.test.ts` + `src/main_bootstrap.test.ts`: 8 passing
- Proxy tests: 23 passing
- `src/ipc/utils/git_utils.test.ts`: 46 passing, 1 skipped
- `src/ipc/contracts/core.test.ts`: 14 passing

---

## 8. Capability analysis: why the generated app was generic

The browser port did **not** remove Dyad capabilities. The generated `next-billion-showcase` app was generic because the active model/configuration has no web research tools:

- **Settings:** `selectedModel: {provider:"auto", name:"auto"}`, `selectedChatMode: "local-agent"`, `enableDyadPro` unset, only an OpenRouter API key stored.
- **Model routing:** `AUTO_MODEL_ALIASES` tries Dyad Pro aliases first, then `dyad/auto/openrouter`. With only an OpenRouter key, it resolves to OpenRouter free models (`nvidia/nemotron-3-super-120b-a12b:free` or `openrouter/free`).
- **Tool gating:** `web_search`, `web_crawl`, and `web_fetch` are Pro-only (`isEnabled: ctx.isDyadPro`) and also disabled in free-model mode (`usesEngineEndpoint: true`).
- **Basic Agent prompt:** explicitly states "Limited tools - no code_search, web_search, web_crawl".
- **Prompt inspection:** no prompt tells the model to avoid online capabilities; the model simply lacks web access in this configuration.
- **Generated app inspection:** `/Users/vishal/dyad-apps/next-billion-showcase` contains only static Hero/Features/CTA components with no data fetching. No "no online capabilities" disclaimer was found in the generated files or Dyad prompts.

To get real nextbillion.ai content, either:

1. Enable Dyad Pro with a valid Pro key, or
2. Provide the relevant content/context directly in the chat prompt.

---

## 9. Reproduction checklist

- [ ] `cd /Users/vishal/dyad`
- [ ] `source "$HOME/.nvm/nvm.sh" && nvm use 24`
- [ ] `node --version` returns v24.x
- [ ] `pnpm install` (or `npm install`) if needed
- [ ] `npm rebuild better-sqlite3` if native modules complain
- [ ] Free ports 3000 and 4173
- [ ] `export DYAD_DATA_DIR="/tmp/dyad-headless-browser"`
- [ ] `npm run headless:browser`
- [ ] Open `http://127.0.0.1:4173/`
- [ ] Verify RPC: `curl -X POST http://127.0.0.1:3000/rpc/get-apps -H "Content-Type: application/json" -d '{}'`

---

## 10. Notes for future maintainers

- The headless bundle is **not** the production Electron build. It is a development/experimental harness.
- `node-pty` is shimmed; terminal features that depend on it will not work in browser mode.
- `electron-log` is external in the bundle and must be present in `node_modules`.
- The renderer still uses the same Vite config and React components as the desktop app; only the transport layer changes.
- If you add a new IPC channel, it is automatically available at `/rpc/<channel>` because the server uses `ipcMain.getHandler(channel)`.
- Keep `src/main/git_path.ts` in sync with any packaging changes to the Dugite bundle location.

---

## 11. Testing session log (2026-10-07)

### What works (verified end to end with Playwright/Chrome driving `127.0.0.1:4173`)

- Home page, apps list, app details page render; apps created on desktop appear.
- **App creation** via `create-app` RPC now works in headless mode: template copy + git init + initial commit all succeed (dugite works under Node 24 with `ensureRuntimeGitEnvironment`; verified by creating "Headless Git Test").
- **Chat flow**: sending a prompt triggers the agent; blueprint flow kicks off; `planning_questionnaire` renders and answers submit; `write_app_blueprint` writes and the blueprint card renders.
- **Preview**: the generated app builds and runs; proxy worker starts (`localhost:42104`); the preview iframe renders the live app and relays its console output into System Messages.
- Live main→renderer events over WebSocket work for the chat stream: `chat:response:chunk`, `user-input:requested`, `app:output(-batch)`, `distributed-machine:snapshot` all arrive in the browser.

### Bugs found & fixed

1. **Dates rendered as raw ISO strings** (e.g. app details page showed `2026-10-06T06:52:33.000Z` instead of a formatted date).
   - Cause: Electron IPC uses structured clone (real `Date` objects); the HTTP/JSON transport silently converts them to strings. All 25 `z.date()` contract fields are **outputs only** (verified), and the client only zod-validates stream/event payloads, so `z.date()` outputs were never re-validated client-side — the failure showed up as `.toString()` producing raw ISO.
   - Fix: tagged-Date encoding. `encodeIpcDates()` (in `src/ipc/contracts/core.ts`) deep-transforms `Date` → `{ __dyadDate: iso }` on the server (`src/server/index.ts`: HTTP invoke results + WS broadcast payloads); `reviveIpcDates()` deep-transforms them back in the browser bridge (`invokeRaw` result + WS event payloads). Tagged, not ISO-heuristic, so legit strings that look like timestamps can never be corrupted. Same-session stream events get revival too, keeping zod `safeParse` on stream payloads happy.

2. ~~**Main→renderer broadcasts were dropped**~~ **NOT a bug — verified working.** `broadcastToRegisteredWindows` delivers to the headless shim correctly (`fakeEvent.sender` matches `isWindowEndpoint()` → registry fan-out → `sender.send` → WS). Instrumented run proved it: `write_app_blueprint` → `[window-broadcast] app-blueprint:update → 1 endpoint` → blueprint atom populated → Approve enabled. The earlier "Blueprint data is unavailable" failures were the fresh-session atom gap (see harness quirks), not lost events. Affected channels all work: `app-blueprint:update/approved`, `plan:update`, `agent-tool:todos-update`, type-check results.

### Data damage from pre-fix bugs (not port bugs)

- Apps created **before** the git-path fix have no `.git` directory (git init silently failed during creation back then). Opening their chat throws `DyadError: Not a git repository` from `version_handlers.ts`. 13 apps in `/Users/vishal/dyad-apps/` are affected (lunar-falcon-swoop, cosmic-ferret-sniff, etc.). Repair per app: `git init -b main && git add -A && git commit -m "Init Dyad app"`. Apps created by desktop Dyad or by the current headless build are fine.

### Test-harness quirks (browser side, not port bugs)

- Telemetry consent modal ("Help improve Dyad with anonymous usage data") intercepts clicks on first load — dismiss via Later/Reject before driving.
- Base UI radios must be clicked via their visible label text, not `getByRole('radio')` (hidden native input) — see `rules/e2e-testing.md`.
- Chat input is Lexical (contenteditable): use `keyboard.type` + `Enter`.
- Blueprint approval requires the plan atom, which is only fed by a **live** `app-blueprint:update` WS event (no rehydration RPC exists — same on desktop). Approving after a page reload fails with "Blueprint data is unavailable" until a fresh blueprint event arrives. Test approvals must happen in the same browser session that received the blueprint event.
- `appBlueprintStore` (main side) is in-memory: restarting the headless server wipes blueprints mid-approval; the agent then re-requests the questionnaire. Avoid restarting the server mid-blueprint-flow.
- Noise observed: PostHog AbortError (analytics, offline-ish), missing `/favicon.ico` (404), `ERR_UNKNOWN_URL_SCHEME` for `x.com` follow links (desktop shell links), React key warning in `ActionProposalActions` (pre-existing), CSP `frame-ancestors 'http://[::1]:*'` warning from the preview proxy.

### Open problems (as of this session)

1. ~~**`installManagedPnpm` hangs**~~ **ROOT-CAUSED & FIXED (16:10)**: not a network/npm issue — the command went through `runCommand` (`socket_firewall.ts`) → `runPtyCommand` (`pty_command_runner.ts`) → **node-pty**, and the headless `node-pty` shim's `spawn()` returns an inert object whose `onData`/`onExit` subscriptions never fire, so every pty-routed command silently produced nothing until its 10-minute timeout. Fix: `runPtyCommand` already ships an escape hatch — `DYAD_DISABLE_PTY=1` routes to `runCommandWithoutPty` (real `child_process`, same result contract). `src/server/index.ts` now sets `process.env.DYAD_DISABLE_PTY ??= "1"`. After restart, managed pnpm installed in ~9s (`11.28.2`, PATH now leads with `userData/managed-tools/pnpm/node_modules/.bin`). Scope check: only `pty_command_runner.ts` consumes node-pty for commands; `pty_session_manager.ts` (dev-server sessions) uses `node:child_process` directly, which is why vite/previews always worked.
2. **PostHog / telemetry in headless**: browser and server both phone home; consider a headless default that disables analytics.
3. **Stale questionnaire UX**: a pending questionnaire panel persists in the UI even after its agent turn is gone (e.g. server restarted mid-turn). Answering it later returns `DyadError NotFound` → "request expired" toast and the panel never resolves. Not port-specific (desktop has the same registry semantics), but more visible in headless testing where server restarts are frequent.

### Verified end-to-end run (2026-10-07 15:34, the money shot)

New chat in "Headless Git Test" → prompt → `planning_questionnaire` (3 questions incl. free-text + radio + hex color) → `user-input:respond` RPC ok → `write_app_blueprint` → `app-blueprint:update` broadcast → blueprint card live → Approve Plan → agent edit → `Modified files (1): src/pages/Index.tsx +2 -2` → git commit (`0b0998e Added visible heading 'Hello Headless'...`) → preview rebuilt & live at `localhost:42104` with screenshot capture working. The complete Dyad agent loop runs unmodified in a browser.

### Code fixes made this session

- `src/ipc/contracts/core.ts`: added `encodeIpcDates`/`reviveIpcDates`; bridge `invokeRaw` + WS payload listener revive tagged Dates.
- `src/server/index.ts`: HTTP invoke results and WS broadcasts pass through `encodeIpcDates`; kept a `[headless-broadcast]` console log for non-chunk channels (debug aid, filter out `chat:response:chunk` spam); changed `import { ipcMain } from "electron"` → `from "./electron-shim"` (TS couldn't see `getHandler` on real Electron types) and `type WebSocket` → value import from `ws` (used `WebSocket.OPEN` as a value). Both were `npm run ts` errors.
- `src/ipc/contracts/core.test.ts`: 3 new tests for the Date round-trip (17 total in that file pass).
- Validation state: `main_git_path.test.ts`+`main_bootstrap.test.ts` 8 pass; `git_utils.test.ts` 46 pass/1 skip; proxy tests 23 pass; `npm run ts` clean (after `npm install` in `testing/fake-llm-server/`); lint 0 errors; `npm run fmt` clean.
- `testing/fake-llm-server/` needs its own `npm install` for the root `npm run ts` to be clean (matches the worktree note in AGENTS.md).

### Test artifacts

- Playwright probe scripts live in `.claude/tmp/` (`ui-helpers.mjs`, `probe-*.mjs`); screenshots `ui-*.png` in the same dir. Run with Node (any) — `playwright-core` launched with `{ channel: "chrome" }` because no Playwright browsers are downloaded.
- Server runs via `nohup ~/.nvm/versions/node/v24.21.0/bin/node dist/headless-server.cjs > /tmp/dyad-headless.log 2>&1 &` (plain `node` in a fresh shell is v20 → `ERR_DLOPEN_FAILED` on better-sqlite3; always launch under nvm Node 24).
- Vite renderer: `VITE_BROWSER_IPC=1 nohup node node_modules/vite/bin/vite.js --config vite.renderer.config.mts --host 127.0.0.1 --port 4173 > /tmp/vite-renderer.log 2>&1 &`.

### Session log addendum (2026-10-07 16:0x–16:1x): the stuck "Server layer" build, root-caused

**Symptom**: App 5 "Groundwork-NB" build stuck at "Server layer / Added Nitro server layer"; user saw the same with maplibre-gl/leaflet installs earlier. Console showed the app's `npm install` itself succeeding (351 packages, 9s) and vite/proxy starting.

**Diagnosis chain**:
- App dir has both `package-lock.json` and `pnpm-lock.yaml` → `package_manager_selection.ts` rule 6 prefers **pnpm** (when available). System pnpm 9.14.4 (homebrew) exists → `pnpmAvailable=true` → Dyad's install commands ran `pnpm ...` through `runCommand` → pty → dead shim → hang → 10-min `PtyCommandExecutionError`. The in-app npm install the user saw succeed came from a different (child_process) spawn path.
- `installManagedPnpm` (triggered by the UI's `nodejs-status` poll → `scheduleManagedPnpmInstall` because system pnpm 9.14.4 < required 10.16.0) hung for the same reason; `managedPnpmImplicitInstallFailed` then suppressed retries for the session ("Skipping implicit ... already failed this session" — in-memory, cleared by server restart).
- Server restart clears both in-memory gates (`managedPnpmInstallPromise`, `managedPnpmImplicitInstallFailed`).

**Fix** (see open-problems #1 above) + verification: after restart, `nodejs-status` returned `pnpmVersion: 11.28.2`; `restart-app` on app 5 succeeded (install step ran, vite back up); nudge message sent to chat 5 via UI to resume the build. Note pnpm is now chosen for app 5 installs (managed 11.28.2 in PATH). The stuck turn itself died at the old timeout — the agent needs a fresh user message to retry the install step.

**Nudge turn outcome**: agent resumed, wrote the app's map/Nitro source files, deleted a misplaced module (`delete_file` git warnings are benign for untracked files). At 16:27 the turn stopped on the user's **OpenRouter free-tier rate limit** ("Rate limit exceeded: free-models-per-day"); retry at 16:29 same. External quota issue, not a port bug — resume after credits/model change. App 5 `node_modules` is npm-layout (`hasNpmNodeModules` wins in `package_manager_selection.ts` rule 3), so its installs stay on npm even with pnpm available; the stale `pnpm-lock.yaml` from the hung attempt is harmless under that rule. Nitro `vite.config.ts` restart failure at 16:12:39 ("Cannot find package 'nitro'") was write-then-install ordering — resolved once nitro was installed.

**Second+ third turns (16:45–17:03)**: new OpenRouter key hit a *different* quota — "You requested up to 131072 tokens, but can only afford 16666" (key's total credit limit caps per-request max_tokens; fix at openrouter.ai/keys or lower Dyad's max-output-tokens setting). After key top-up, the build ran to **Dyad's agent step limit** (`Chat 5 hit step limit of 100 steps` in the log; chat shows `<dyad-step-limit>` + Continue button) — normal budget behavior, not a port bug. A fresh "continue" message starts a new 100-step turn. UI observation: a browser tab that lived through a headless-server restart can end up showing no live progress even though WS auto-reconnect exists in the bridge (1s close-retry in `createBrowserIpcBridge`); reloading the page restores full live state ("Paused after 100 tool calls", "Fix All Errors (N)", version diffs). Long builds (~130k-token contexts) are normal for big apps.

**Fourth turn killed by a real (non-port) Dyad bug, FIXED**: at 17:07 the turn crashed with `TypeError: args2.packages.join is not a function`. Root cause: `local_agent_handler.ts:1843/1865` calls `toolDef.buildXml(argsPartial, …)` with **raw unvalidated model args** (`parsePartialJson` of the stream deltas) to render the streaming preview; `add_dependency.buildXml` called `args.packages.join(...)` unguarded, and the model streamed `packages` as a string → throw inside the streaming callback → whole turn dies. Same code on desktop — a latent Dyad bug, not port-specific. `get_mcp_tool_schema.ts` already documents/guards this pattern; `add_dependency` was the only unguarded `.join` on raw args (audit done). Fix in `add_dependency.ts` `buildXml`: accept array or whitespace-separated string, else no preview (`rawPackages: unknown` + `Array.isArray` guard; note `Partial<T>` typing makes `typeof x === "string"` narrow to `never` — go through `unknown`). Spec (`add_dependency.spec.ts`, 6 tests) still passes; `npm run ts` clean. Server rebuilt + restarted 17:16, continue message re-sent.

**Build completed (2026-10-07 ~17:30–18:10)**: subsequent turns fixed all compile errors (app `tsc --noEmit` exit 0) but the preview kept showing the template placeholder because the agent wired the real app into `src/routes/index.tsx` while `src/App.tsx` still imported the template's `./pages/Index` — a targeted nudge ("App.tsx imports ./pages/Index; your real app is the default export of src/routes/index.tsx — wire it up") got the wiring fixed. Laptop crash at ~17:40 killed everything; recovery is just: start server + vite renderer (see Test artifacts), `restart-app`, reload the browser tab — chat state lives in sqlite, app files on disk, nothing lost. Final state at 18:10: **the real Groundwork-NB workspace renders at localhost:42105** (Location A/B/C panels, Business Type / Time of Day / Travel Mode selectors, Analyze Location, map area with legend, Compare Locations / Printable Report tabs). Map tiles say "Loading map..." pending a NextBillion API key in the app's `.env` — app-land concern, not the port.

**Session 2 (evening) — new session on App 6 `groundwork-4` / chat 8**:
- **Package installs verified end-to-end**: App 6's installs ran via managed pnpm 11.28.2 ("Done in 5.7s using pnpm v11.28.2" — vs the pre-fix 10-min hang), and `maplibre-gl` is physically installed in both apps. `maplibre-gl`'s earlier "does not provide an export named 'default'" was a source-import bug, not install.
- **`search_replace` failures explained**: the tool fuzzy-matches the model's search block against the file and correctly refuses garbage; log dumps show the model emitting malformed lines (`import { Label } = '...'` vs the file's `from`). Model-quality issue (weak OpenRouter free models), self-healing via read→retry, but each failure burns a step toward the 100-step limit.
- **Map not loading → fixed**: `Error: Worker failed to load` from maplibre-gl = Vite dep pre-bundling breaks maplibre's web worker. Fix: `optimizeDeps: { exclude: ["maplibre-gl"] }` in the app's `vite.config.ts` (agent applied it itself after a nudge). Verified by headless-browser probe: zero worker errors, tiles render. **Upstream candidate: Dyad's react template vite.config should preemptively exclude maplibre-gl.**
- **NextBillion wiring broken in generated app (found 22:3x)**: header API-key input saves to `localStorage` and sends `apiKey` in the POST body, but server routes (`server/routes/api/analyze-location.post.ts`, `suggest-locations.get.ts`) never read it — `src/lib/nextbillion/client.server.ts:7-11` reads `process.env.NEXTBILLION_API_KEY` **at module top level and throws** when missing, and the app has no `.env`, so every NextBillion route 500s on import. Also no drop-pin: `MapView.tsx` has no `map.on('click')` handler (agent never built it). Nudged chat 8 with the fix list (lazy key, body-key pass-through with env fallback, click→reverse-geocode). The agent's turn then landed the body-key pass-through + reverse-geocode route + click handler; I directly added the final UX pieces the user demanded: masked key input (`type="password"` + Show/Hide toggle + Save Key button with "Saved ✓" feedback, in `src/routes/index.tsx`) and an instant red `maplibre.Marker` pin on map click (before the reverse-geocode attempt, so clicks always give feedback even without a key — verified by headless-browser click test + screenshot). Note: reverse geocode/analysis still needs a real NextBillion key pasted+saved.

**Session 2 addendum (late night, ~23:00–00:30) — "nothing happens on pin drop" fully root-caused**:
- User (justifiably) insisted the pin flow was broken regardless of backend. Probe-based diagnosis proved the chain: map click → handler fires → `/api/reverse-geocode` called → candidate marker **does** render (coordinates register) — but the UI hides all of it. Three frontend bugs, all fixed via agent nudges:
  1. **Auto-analysis never triggers**: `useGroundwork.ts` auto-analyze `useEffect` deps were `[analyzeCandidate, timeOfDay, travelMode]` — never re-ran when a candidate's address/lat/lng changed. Panel stayed "Enter an address to begin analysis" forever; Report showed "No analysis data available".
  2. **`LocationInput` dead display**: copies `candidate.address` into `useState(...)` once, never syncs on external (pin) updates.
  3. **`Add Location` zero feedback**: `addLocation()` silently switches the active slot (why the user's next pin "shifted the dot"); earlier version only did `setIsAddingLocation(true)` and never called `addLocation()` at all (stuck "Adding Location...").
- Earlier-in-evening fixes confirmed landed by probes: masked key input + Save Key button; instant red pin; CARTO Positron fallback basemap; duplicate-key prop bugs (`key=` vs `locationKey=` on `<LocationInput>`/`<AnalysisPanel>` — the React "key is not a prop" console warning was the real bug); h3 installed; route import paths `../../../lib/` → `../../../src/lib/`; `z.coerce.number()` for query params.
- **NextBillion API contract — the agent hallucinated every endpoint** in `client.server.ts` (`/places/reverse`, `/places/autosuggest`, `/places/geocode`, `/places/search` all 404). Verified the REAL contract live with the user's key (curl, all 200): reverse geocode `GET /revgeocode?at=lat,lng` → `{items:[{title,address,label,position:{lat,lng}}]}`; autosuggest `GET /autosuggest?q=&at=&limit=`; forward geocode `GET /geocode?q=&at=`; POI search `GET /discover?q=&at=`; distance matrix `GET /distancematrix/json?origins=lat,lng&destinations=...&mode=car` → `{rows:[{elements:[{duration:{value}},distance:{value}}]}]}`; map style `GET /maps/gateway/style/json?style=light&key=` (the `/maps/tiles/style` path the agent "documented" does not exist). Nudge with the full verified contract sent; rewrite turn in flight. **Upstream lesson: model invents plausible API shapes; nudges must carry doc-verified endpoints, not "fix the API".**
- MapView also double-registers its click handler (two identical requests per click) — nudged `map.off('click')` before `on('click')`.
- Verification discipline correction: probe-verified claims must exercise the USER's flow (pin → address visible → analysis populated), not just "file changed on disk" — several "fixed" reports were premature because downstream UI bugs hid the fixed layer.

**Session 2 addendum 2 (overnight, 01:00–05:30) — the real root cause & redesign**:
- **The dumb-shell root cause: `useGroundwork` was a plain useState hook called directly in 9 components → 9 disconnected copies of all state.** Pin updates in MapView's copy never reached sidebar/report/compare. No pin-flow fix could work before this. Fix: renamed inner fn `useGroundworkState`, added `GroundworkProvider` (createContext) + `useGroundwork()` context accessor; wrapped `index.tsx` root in the provider. Note: provider lives in a `.ts` file, so JSX is rejected by the compiler — use `createElement(GroundworkContext.Provider, {value}, children)`.
- **Stale-closure pin bug**: MapView's once-registered click handler closed over the first render's `activeKey`, so pins always targeted slot A even after Add Location switched to B. Fix: `activeKeyRef` kept current, handler reads `activeKeyRef.current`.
- **NextBillion isochrone real contract**: `GET /isochrone/json?coordinates=lat,lng&contours_minutes=5,10,15,20&mode=car&key=` — NOT `locations=` + `range=`(seconds) (400). Distance-matrix separator between coords is `|` (pipe); `;` 400s with "No location coordinates provided". Directions (Fast): `GET /directions/json?origin=lat,lng&destination=lat,lng&mode=car` → `{routes:[{duration,distance,legs}]}`. `directions()` was imported by nextbillion.functions.ts but never existed in client.server.ts ("(0, ...directions) is not a function" crash) — added it.
- **zod nullish gotcha**: client sends `apiKey: null` (JSON) when localStorage empty; `z.string().optional()` rejects null → every keyless analyze request returned "Invalid request body". Use `.nullish()`.
- **◎ My Location button** added to MapView (geolocate → flyTo → reuse `handleMapClick`); click handler extracted to `handleMapClick` useCallback so both paths share it.
- **Verification flow proven end-to-end (probe + screenshots)**: pin → address box fills → analysis auto-runs → Snapshot/Competition/Catchment populate → Location Report renders full data → Compare Locations renders A-vs-B table. Real-city analyze returns 40 competitors / 20 POIs / 60 matrix elements / 4 isochrones for Chennai.
- **Ops findings**: (a) chat 8 permanently dead at ~278k tokens > 262k model limit — "Upstream idle timeout exceeded" + context-length errors; user opened new chats (chat 9 was accidentally created on a stray app 7 "wandering-otter-dart" from a mis-scoped probe). (b) OpenRouter free quota dead ~01:30–02:30; user added credits → minimax/minimax-m3 works. (c) The agent DID land the API rewrite + input-sync + auto-analyze dedupe in a later turn — but app restarts never came back up by themselves (dev server stayed down after package installs; user saw "2 hours stuck"; recurring pnpm "added N" lines are local relinking, `downloaded 0`).
- **Process note (user's explicit complaint)**: "backward fixing is clearly not working — go through each UI element and fix it, or redesign". Element-by-element audit after the redesign was the thing that finally worked; per-layer "fixed" claims without user-flow verification were perceived as fraud. Always verify the USER'S flow end-to-end with screenshots before claiming success.

---

## 12. Capability gaps in browser mode (audit 2026-10-09)

Comparison of the Electron feature surface (IPC handlers in `src/ipc/handlers/`, main-process APIs in `src/main*.ts`) against the shim (`src/server/electron-shim.ts`). Shim coverage governs what works headless.

### A. Silently no-op (shim fakes success — UI enables features that can never complete)

| Shim API | Behavior | Broken user features |
| --- | --- | --- |
| `dialog.showOpenDialog/showSaveDialog` | always `canceled: true` | App import (`src/ipc/handlers/import_handlers.ts`), custom apps-folder picker (`custom_apps_folder_handlers.ts`), export/backup save dialogs, Node path picker (`node_handlers.ts`) |
| `shell.openExternal/openPath/showItemInFolder` | no-op | OAuth connect flows that open the system browser (Neon/Supabase/GitHub/Dyad Pro sign-in), "open app folder"/"open in editor", opening media/screenshots |
| `dyad://` deep-link OAuth return | protocol never registered | OAuth callbacks can't return to the app even if openExternal worked (`src/main.ts` deep-link queue; `linux_protocol_registration`). Manual token paste still works |
| `clipboard` (main), `Notification`, `nativeTheme` (frozen), `screen` (fake bounds), `app.requestSingleInstanceLock`/login-item/relaunch | stubs | Native clipboard-from-main, OS notifications, OS theme sync, window positioning — minor |

### B. Broken / degraded subsystems

- **Terminal panel**: `terminal_handlers.ts` → `pty_session_manager`; `node-pty` shim is inert and `DYAD_DISABLE_PTY=1` routes pty commands through plain `child_process`. Non-interactive command execution works (managed pnpm installs verified); an interactive terminal session in the UI does not.
- **`utilityProcess.fork` shim is inert** → workers spawned via utilityProcess (session recording / debug-bundle paths in `recording_handlers.ts`, heavy compute per `rules/electron-workers.md`) silently do nothing.
- **Multi-window**: shim exposes one virtual window; OAuth popup windows, secondary preview windows, and `window_handlers.ts` window controls (zoom/minimize) are gone. Preview-in-iframe works (verified).
- **safeStorage is fake encryption** (`encryptString` = raw Buffer): provider API keys are stored **unencrypted on disk** instead of the OS keychain (`dyad-keychain-reader` path bypassed). Works, but a real security downgrade vs desktop.
- **Auto-update**: `autoUpdater` stub — expected for a dev harness, no updates.
- **PostHog telemetry phones home** headless (browser + server); consider a headless default-off.

### C. Transport-layer gaps (HTTP/WS vs structured-clone IPC)

- Dates fixed via tagged-Date encode/revive (§11). Remaining theoretical risk: structured-clone types JSON can't carry (TypedArray/Map) would degrade the same way — none found in active contract use.
- No event replay after page reload: blueprint/plan atoms populate only from live WS events — reloading mid-blueprint leaves "Blueprint data is unavailable" until a fresh event arrives (same registry semantics as desktop, more visible here).
- `appBlueprintStore` is in-memory: restarting the headless server mid-blueprint-flow wipes it.
- Agent turns frequently leave the generated app's dev server down; manual `POST /rpc/restart-app` (object body `{"appId":N}`) + page reload restores it.

### D. Security posture (fine for single-user localhost; do not expose beyond it)

- The HTTP server has **no CORS/Origin check and no auth token**: any page open in any browser on the same machine can `POST http://127.0.0.1:3000/rpc/*` and drive Dyad (create apps, run commands, read/write data, execute package installs). `renderer_security.configureTrustedRenderer` trusts a fake URL. Cheap mitigations if needed: Origin allowlist for `http://127.0.0.1:4173`, or a per-launch random token the renderer appends to `/rpc` calls.
- The Electron sandbox model (context isolation, trusted renderer frames) does not exist here.

### E. Verified working (for balance)

App creation + git, chat/agent loop (blueprint, questionnaire, proposals, step-limit/Continue), previews + proxy worker, managed pnpm/npm installs, tests panel, screenshot capture, live WS event streaming (`chat:response:chunk`, `app-blueprint:update`, `user-input:requested`, etc.) — see §11.
