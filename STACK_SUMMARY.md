# Stack summary (discovered from this repo, Phase 0)

Rebrand target: **NextBillion** (slug `nextbillion`, env prefix `NEXTBILLION_`). Branch `rebrand/nextbillion`.

## What this is

A fork of the open-source Dyad AI app builder, customised and deployed as a **hosted multi-user web app** (`headless-web-port` -> `web-deploy`). The original Electron desktop shell is still in the tree and still builds; the web deployment reuses the same renderer and main-process code through a headless server.

| Concern | What is actually here |
|---|---|
| Renderer | React 19, TanStack Router + Query, Jotai, Tailwind 4, Base UI. Entry `index.html` -> `src/renderer.tsx` |
| Bundler | Vite 5 (`vite.renderer.config.mts`); Electron Forge + VitePlugin for desktop (`forge.config.ts`) |
| Web serving | `npm run headless:browser` runs the **Vite dev server** (port 4173, unminified) next to a headless Node server (port 3000). Caddy + oauth2-proxy front it on a VM (see `deploy/`). There is no minified production web bundle today |
| Backend (web) | `src/server/index.ts` bundled by esbuild to `dist/headless-server.cjs`; Electron APIs shimmed (`src/server/electron-shim.ts`), JSON-RPC over `/rpc` + WebSocket `/ws`, `x-*-rpc-token` header |
| Backend (desktop) | Electron main process `src/main.ts`, preload `src/preload.ts`, typed IPC under `src/ipc/` |
| DB | SQLite via `better-sqlite3` + Drizzle ORM, migrations in `drizzle/` (immutable history) |
| Auth (hosted) | oauth2-proxy (Google, `@nextbillion.ai`) in front of Caddy; forwards `X-Forwarded-Email`. No in-app login |
| LLM | Vercel AI SDK v6 (`ai`, `@ai-sdk/*`); user BYO provider keys, plus optional "Dyad Pro" engine gateway (`engine.dyad.sh`, model ids `dyad/auto/*`) which is an external service we do not run |
| Generated apps | `scaffold/` (Vite + React + shadcn) copied into `<appsDir>/<app>`; tagged with `@dyad-sh/react-vite-component-tagger`; run under a preview proxy (`worker/proxy_server.js`) with injected `worker/dyad-*.js` scripts; hosted previews at `/preview/<port>/` |
| LLM output protocol | custom XML-like tags `<dyad-write>`, `<dyad-status>`, ... (~60 names), parsed by `streamingMessageParser`, rendered by `DyadMarkdownParser` |
| Deploy | `deploy/` (Caddyfile, systemd units, oauth2-proxy, env.template, provision scripts). No Dockerfile / compose / k8s |
| CI | `.github/workflows/*` (upstream project's workflows) |
| Tests | Vitest unit + `*.integration.test.ts` (Node 24 required for the better-sqlite3 binary), Playwright E2E against the packaged Electron build (`e2e-tests/`), fake LLM server in `testing/fake-llm-server` |
| Tooling | `npm run ts` (tsgo), `npm run lint` (oxlint), `npm run fmt` (oxfmt), Node `>=24 <26` |
| Desktop-only (still present) | Electron Forge makers, auto-update (`update-electron-app`), `dyad://` + `dyad-media://` protocols, safeStorage / Keychain, tray: none |

## Footprint at start (tracked files)

1,541 files / ~14.4k case-insensitive hits for `dyad`; 128 tracked file names contain `dyad`; 1,525 distinct tokens. `NextBillion` already appears in 268 files (context packs, skills, deploy docs) - no identifier collisions are expected, checked per rename.

## Pre-existing state worth knowing

- `src/brand.ts` already exists from an earlier attempt using the name **NextBuild** (slug `nextbuild`). The new brief overrides it: everything becomes NextBillion.
- `context/BRANDING_AUDIT.md` (earlier audit, written for NextBuild) is reused as input; the name and a few decisions differ from this brief (see BRANDING_REPORT.md).
- The live VM keeps `DYAD_*` env vars in `deploy/env` (not in git), so legacy env fallbacks are mandatory.

## Baseline before any change (Node 24, commit d9b9f2be)

| Check | Result |
|---|---|
| `npm run ts` | pass |
| `npx oxlint` | pass (0 errors) |
| `npx oxfmt --check` | pass |
| headless server build (`scripts/build-headless-server.mjs`) | pass |
| `npm test` | 4 files / 39 tests fail **before** our change: `src/pro/main/ipc/handlers/local_agent/tools/grep.spec.ts` (34), `local_agent_grep.integration.test.tsx` (2), `default_chat_mode.integration.test.tsx` (2), `ChatErrorBox.test.tsx` (1). 9,875 pass. |
| packaged build (`npm run build`) and Playwright E2E | recorded in BRANDING_REPORT.md (run in a separate clean worktree) |
