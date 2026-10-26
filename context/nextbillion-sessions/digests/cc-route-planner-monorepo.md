# Claude Code session digest: Route Planner monorepo (ncc / apps/route-planner-v2)

Detail-preserving annotated digest of a Claude Code session (2026-05-28 to 2026-08-27). Each section is organised chronologically by transcript part A-F.

## Architecture & project layout

### Transcript part A (chunks 1-3)

Source: Claude Code session on the `ncc` monorepo (NextBillion.AI Cloud Console), 2026-05-28 → 2026-05-29. Focus app: `apps/route-planner-v2`.

### Repo / tooling facts established during `/init` (CLAUDE.md authoring)
- The user ran `/init` ("Please analyze this codebase and create a CLAUDE.md file, which will be given to future instances of Claude Code to operate in this repository. What to add: 1. Commands that will be commonly used, such as how to build, lint, and run tests... 2. High-level code architecture and structure..."). No CLAUDE.md existed. Resulting CLAUDE.md sections:
  - **Mandatory rules** distilled from `AGENTS.md`: branch from remote `main`, no commits/releases without approval, conventional commits via Husky.
  - **Commands** — Nx-first: `nx serve/build/lint/test`, single-test invocation, affected targets, `dotenvx` for env loading, `yarn clean` / `yarn analyze`.
  - **Architecture** — apps/libs layout; TS path aliases including the `@ncc/common/{client,edge,server,types,utils}` entrypoint split; lib-boundary enforcement (`@nx/enforce-module-boundaries`); the **BFF → Waymor → Tokamak** service chain needed for local dev (full chain per `docs/01 - dev setup.md`: `NCC → BFF → Waymor → [Tokamak, Postgres]`).
  - **Deployment** — staging on every push to `main`, prod via tag + GitHub Release, PR previews on Cloud Run (`yarn preview:deploy <app> <suffix>` / `yarn preview:teardown <app> <suffix>`, see `docs/09 - preview deployments.md`).
  - **Release flow** — `.cursor/skills/ncc-release/SKILL.md`, `tools/release/` script table, dry-run default, hotfix backport invariant, gotchas (`route-planner-viewer` / `iam-frontend` substring overlaps).
  - **Conventions** — `dashboard` is Nx `defaultProject` (so `yarn build` = `"build": "nx build"` builds *dashboard*, not route-planner-v2; use `yarn nx build route-planner-v2`), `mapbox-gl` is stubbed (use `maplibre`), `tools/sync/` is dead code, Biome is present but Prettier+ESLint are the source of truth.
- Versions: Nx **19.6.5**, Yarn 3 (Berry), Node **20.19.4** (Homebrew `node@20`), Next.js **14.2.28** (App Router), macOS darwin-arm64 (native module `19.6.5-nx.darwin-arm64.node`).
- `apps/route-planner-v2/next.config.js`: `basePath: '/route-planner'` (so root `/` renders nothing; always open `http://localhost:<port>/route-planner`); wrapped with `withNx(...)` from `@nx/next/plugins/with-nx` and `withSentryConfig`; `assetPrefix` points at prod CDN unless `ENV` is `test` or `preview` (check is `!== 'test' && !== 'preview'`).
- Env files per app: `apps/route-planner-v2/.env` (ENV=test, BFF at localhost:3000, `HOST=http://localhost:4200`), `.env.local` (user-owned, auto-loaded by `next build/start/dev`), `.env.preview` (canonical staging combo). Next.js precedence (highest → lowest): **shell env vars > `.env.local` > `.env`**. The "Environments: .env.local, .env" banner just lists loaded files, not precedence.
- Env-aware plumbing worth knowing:
  - `libs/common/src/lib/utils/fetcher-rsc.ts:8-16` — hardcoded swap: outside preview mode, `https://bff.nextbillion.ai` → `http://bff:3000` (k8s internal service). Line 14: `env.PREVIEW ? env.BFF_HOST : bffHostMap[env.BFF_HOST] ?? env.BFF_HOST`. Only `ENV=preview` skips the swap.
  - `libs/common/src/edge.ts:264-278` — middleware infers basePath from request hostname (`host.includes('route-planner')`); on `localhost` nothing matches so it falls back to `env.BASE` (empty) → callback would resolve to `http://localhost:3000/callback` (404). Set `BASE=/route-planner` and `NEXT_PUBLIC_BASE=/route-planner` explicitly.
  - `env-utils.ts:3-9` — client-side `BFF_HOST` fallback: `getConfig()` always returns nothing in App Router, so the client uses `process.env.NEXT_PUBLIC_BFF_HOST`, which is **inlined at build time**.
  - `libs/common/.../common-layout-rsc.tsx:96-138` — org-data fetch is in try/catch; on BFF/Waymor 500 it logs `[CommonLayoutRsc] Failed to load org data`, leaves `currentOrgData` undefined and the page continues (harmless for routing). Picks first subscription's first key as `currentApiKey`; org switching uses cookies `current_subscription` / `current_apikey`.
- IAM clients (client IDs are public identifiers, not secrets):
  - `7a503418-532d-4f66-ad08-02cb5342e042` — **prod console client**; registered redirect URI hard-coded to `https://console.nextbillion.ai/callback`; ignores the middleware's dynamic `redirect_uri`.
  - `adac0e93-69ce-4f3d-936d-87867a04f0ce` — **preview client** against `iam-stg.nextbillion.ai`; accepts arbitrary callbacks (per `docs/09 - preview deployments.md`).
  - `d9883f93-dcbc-44d5-ade8-2af69d29599d` — staging client in `apps/route-planner-v2/.env`.
  - Tokens issued by `iam-stg` are valid only against `bff-staging`, not prod BFF. Canonical `.env.preview`: `BFF_HOST=https://bff-staging.nextbillion.ai`, `NEXT_PUBLIC_BFF_HOST=https://bff-staging.nextbillion.ai`, `IAM_HOST=https://iam-stg.nextbillion.ai`, `IAM_CLIENT_ID=adac0e93-...`.
  - `iam.nextbillion.ai` is the `iam-frontend` Next.js app; REST login is **`${IAM_HOST}/api/login`**, `${IAM_HOST}/login` is the HTML page.
- BFF (separate repo at `~/workspace/bff`, NestJS): CORS whitelist in `src/main.ts:26-31`:
  ```js
  const allowedOrigins = [
    'https://console.nextbillion.ai',
    'https://console-staging.nextbillion.ai',
    'http://localhost:4200',
    'http://console-dev.nextbillion.ai:4200',
  ]
  ```
  Remote BFFs whitelist only `*.nextbillion.ai` and `*.a.run.app`; `localhost` is not allowed on prod or staging BFF. BFF loads `.env.local` (`app.module.ts:32`). `/common/api_keys` downloads `gs://waymer/apikeys_stg/orgs_v2` using Application Default Credentials. `auto-mapping.service.ts:16` reads `process.env.OPENAI_API_KEY`. Waymor expected at `http://localhost:8080` (`/v1/organizations.code.map`), started with `CONFIG_PATH=configs/config.dev.json go run main.go`; DB tunnel: `kubectl port-forward svc/waymer-db-stg -n platform 5432:5432`.

### route-planner-v2 internals learned while building features
- **Two parallel UIs: legacy `components/**` and `v3/**`.** The solution page `/solutions/[requestId]` imports `SolutionToolbar` from `'../../../v3/features/solution'` — NOT `components/solution/solution-toolbar.tsx`. Same split for step card, result panel, toolbar. Always check which one the route's `page.tsx` actually imports before editing.
- State: Rematch (Redux). `models/input/input-core.ts` holds `inputCore.{job,shipment,vehicle,depot}` each with `rawData {header, rows, attachedRows}`, `mapConfig`, `dataMapMenuList`, plus `output.{job,...}` (parsed entities) and `preferences` (with `preferences.fileName` = "Configuration Name", default `'Default'`, and `preferences.timezone`). `state.inputPreview.tab` = active preview tab.
- Persistence: BFF has two GCS-backed dirs, `dir: 'preference'` and `dir: 'input'`, both keyed by `fileName`, via `/config/save` and `/config/get`. Actions: `savePreferenceConfiguration`, `saveInputSet`, `loadPreferenceConfiguration`, `loadInputConfiguration`, `loadPreferenceList` (auto-loads last used profile on init). `computeSavedStateSnapshot` + `hasUnsavedChanges` in `(input)/page.tsx` snapshot `jobRows`/`shipmentRows`.
- Parser: `utils/parser/col-parsers.ts`, `data-parser.ts`; option definitions `JOB/VEHICLE/SHIPMENT/DEPOT_OPTIONS_MAP` with `type` (e.g. `LocationLatLng / LocationLngLat / LocationLat / LocationLng / Address`) and `extra.parent`. `MapInputType` enum lives in `mapping-config/interface.ts` (NOT re-exported from `options/interface.ts`).
- **Canonical location format after parsing is the string `"lng,lat"`** (`parseLocationLatLng`, `col-parsers.ts:629-630`, splits input, `.reverse()`s it, joins; `parseLocationLngLat` keeps lng,lat; `parseLocationLat`/`parseLocationLng` append lng-first when `locationStyle !== 'latlng'`). Time windows are stored as unix seconds (`col-parsers.ts:927`: `Math.round(value.getTime() / 1000)` after parsing in prefs timezone).
- Map stack: react-map-gl `<Map>` wrapped by `<DeckGL>` in preview-map; `Map id="viewMap"` (preview) vs `v3Map` (solution). Style URL helper `apps/route-planner-v2/utils/map-style.ts` `getMapStyleUrl()`; selector options `MAP_VIEW_STYLE_OPTIONS` in `libs/route-planner-components/src/lib/components/map-style-selector.tsx` (persists last pick in localStorage key `map-style`, scoped per `storageScope`). `settings.mapStyle` exists but is unused in render paths. Layers hook: `libs/route-planner-components/src/lib/hooks/use-input-map-layers.ts` (now takes optional `iconSizes`). Preview icons: `components/input/preview-map/icons.ts` (`ICONS_MAP` used by solution-map; `PREVIEW_ICONS_MAP` added for preview). Existing lasso for route edit: `apps/route-planner-v2/v3/features/solution/components/lasso-select-tool.tsx`.
- Preview page files: `components/input/input-preview-page/{preview.tsx, preview-table.tsx, input-preview-page.tsx, job-filter-bar.tsx, edit-row-dialog.tsx, address-autocomplete.tsx}`; landing page: `components/input/input-import-page/{input-import-page.tsx,input-import-phrase.tsx}`; chrome breadcrumb lives in `page-head.tsx` (NOT `input-toolbar.tsx`, which the page imports but never renders).
- i18n layout (added this session): `apps/route-planner-v2/i18n/request.ts` (reads `NEXT_LOCALE` cookie, static-imports `messages/{en,pt-BR,es-MX}.json`), `components/locale-switcher.tsx`, `components/dayjs-locale-sync.tsx`, `hooks/useFormatDuration`, shared `RootLayout` in `libs/common/.../root-layout.tsx` accepts optional `locale` (default `'en'`) for `<html lang>`. Next config order: `withNx(withNextIntl(configWithSentry))`.
- Catalog sections added: `inputImport`, `depots`, `routing`, `routeDescription`, `timezone`, `connection`, `mapperGroups`, `mapperFields`, `jobFilter`, `editRow`, `previewLasso`, `solution` (incl. `solution.id`, `notProvided`, `to`, `dur_years…dur_secs`, tooltip keys), `inputPreview.generateRoute`.

---

### Transcript part B (chunks 4-6)

**Repo / app locations (as seen in transcript)**
- Frontend monorepo: `/Users/[USER]/workspace/ncc` (Nx). App: `apps/route-planner-v2` (dev: `yarn next dev -p 4200`, URL `http://localhost:4200/route-planner/`). Shared libs `libs/common`, `@ncc/ui`, `@ncc/common/client`.
- BFF (NestJS) is a **separate repo**: `/Users/[USER]/workspace/bff`. Terraform for BFF lives in `bff/infra/terraform/` (not in the ncc repo). Frontend terraform: `apps/route-planner-v2/infra/terraform/`.
- Next config: `basePath: '/route-planner'`. Static `public/` assets are served under the basePath, so `<img src>` must be `/route-planner/images/...` (existing precedent: `creating-routes-dialog.tsx:145` hardcodes `/route-planner/images/load-solution-instruction.png`).
- Env handling: `ENV` env var drives behavior ("TEST" / PREVIEW / staging / prod). In TEST mode: middleware redirects to `/dev-login` when `ncc_token` cookie is missing; `commonMiddleware` short-circuits; `getUserFromCookie()` returns `MOCK_USER` (`libs/common/.../session-utils.ts:7`, org `nbai`, owner+admin). `.env.local` overrides `.env` in Next (`.env` had `BFF_HOST=http://localhost:3000`, `.env.local` pointed at the Cloud Run BFF).
- `NEXT_PUBLIC_*` vars are baked at build time; runtime env vars in `cloud_run.tf` feed `publicRuntimeConfig`. If `BFF_HOST` changes you must rebuild the image. Build args + runtime envs are redundant by design — keep in sync.

**Request/auth flow (server side)**
- `libs/common/.../common-layout-rsc.tsx` (`CommonLayoutRsc`) does two server fetches at bootstrap: `/common/api_keys` and `/waymer/v1/organizations.get`. It picks `currentApiKey` by matching the `apikey` cookie against `sub.apiKeys` (`common-layout-rsc.tsx:65-69`) — no validity check; if no match it takes `currentSub.apiKeys[0]`.
- `AppContextProvider` (`app-context-v2.tsx:116`) only writes the `apikey` cookie when it is **missing**; never overwrites → stale values persist until manually cleared.
- `fetcher-rsc` (`libs/common/src/lib/utils/fetcher-rsc.ts`) only adds `?apiKey=` when `current_apikey` cookie present (set client-side after first render, so first RSC request lacks it). It throws `No token found in cookie` in non-TEST mode without a cookie. For non-GET methods it serializes body as JSON. Line 72: `return (await response.json()) as T` for 2xx — throws on empty/HTML bodies.
- Browser-side BFF calls: v3 uses `ky` (`v3/api/client.ts`, `v3/api/api.ts`) with hooks; `credentials: 'include'` only sends cookies for the BFF domain, so cross-origin Cloud Run BFF needs an explicit `Authorization: Bearer` header.

**THREE (really four) fetch clients in `@ncc/common` / app** — the root of repeated "I fixed auth but nothing changed" loops:
1. v3 `ky` client (`v3/api/client.ts` + `api.ts`)
2. `useFetch` hook (`libs/common/src/lib/hooks/use-fetch.ts`)
3. standalone `fetch` from `@ncc/common/client` (`libs/common/src/lib/utils/fetcher-client.ts`) — this is what `apps/route-planner-v2/actions/geocode.ts` (geocode/batch) uses; it gated `Authorization` behind `env.PREVIEW`
4. `fetcher-rsc` (server actions / RSC)

**BFF facts learned**
- `bff/src/common/guards/auth.guard.ts` (AuthGuard): line ~41 `if (process.env.NODE_ENV === 'development') { request.user = USER_MOCK; return true }` (skips auth entirely in dev); line ~57 `jwtVerify(idToken, IAM_JWKS, { audience: this.configService.get('iamClientId') })`; `if (!idToken) return false` → 403 in 0–1ms; logs `JWT verification failed` on failure. `extractToken` prefers cookie, falls back to `Authorization` header.
- Every BFF endpoint requires JWT. `?apiKey=` query param only selects the upstream NextBillion key to use for proxied calls; it is NOT authentication. NestJS guard rejection body: `{"statusCode":403,"message":"Forbidden resource"}` (`error: "Forbidden"`).
- Reading org api-key config: `gs://${configPath}/${org}.json` (default `waymer/apikeys_stg/orgs_v2`; `CONFIG_PATH` plain env var, `bff/src/configuration.ts:29`). Service `ApiGatewayService.getApiKeys(user.org)` logs `Downloading nbai api-key configuration file from gs://waymer/apikeys_stg/orgs_v2.` (`api-gateway.service.ts:75-96`).
- In-memory cache: `private configMap: Map<string, BffConfigResponse> = new Map()` (`api-gateway.service.ts:71-72`), refreshed by `@Cron('*/15 * * * *')` (line ~139) or instance restart.
- Config save/load (`bff/src/config/config.service.ts`): bucket was hardcoded `private gcsBucket = 'nb-ncc'` with dir `config_stg` when staging → objects at `gs://<bucket>/config_stg/<apikey>/<email>/<dirName>/<fileName>.json`. Changed to read from env `NCC_CONFIG_BUCKET` (default still `nb-ncc`; edits in `bff/src/configuration.ts` + `config.service.ts`).
- Geocode: `@All('geocode/*')` in `bff/src/geocode/geocode.controller.ts:13-17`, forwards to whatever URL org config maps product `gca` to, appending `key=<apiKey>`.
- `/optimization/v2/result?id=...&caller=route-planner&apiKey=...` is the solution-load call; WARN `[ApiGatewayService] There are more than one mathced sku. product: vrj` is benign.
- CORS allowlist in `bff/src/main.ts:21`: static `console.nextbillion.ai`, `console-staging.nextbillion.ai`, `localhost:4200`, `localhost:3001`, `console-dev.nextbillion.ai:4200`; regexes `console-preview-*.run.app`, `*.velsol.com`; preflight returns `access-control-allow-headers: authorization`.
- Secrets sourced from Secret Manager per `bff/infra/terraform/secrets.tf`: only `IAM_CLIENT_ID`/`IAM_SERVER`/`MAAAS_URL`/`OPENAI_API_KEY`. `CONFIG_PATH` is a plain env var. Secret names e.g. `bff-staging-iam-client-id`, `bff-staging-iam-server`, `bff-staging-maaas-url`.

**Preview map / lasso layout** (`apps/route-planner-v2/components/input/preview-map/`)
- `preview-map.tsx` (DeckGL + react-map-gl/maplibre), `preview-lasso.tsx` (`PreviewLassoPolygon`, `PreviewLassoEditOverlay`, `VertexHandle`), `icons.ts` (`PREVIEW_ICONS_MAP`, `iconSizes: {job: 14, shipment: 14, vehicle: 18}`), `components/input/preview-table` → `preview-table.tsx` (shared by jobs/shipments/vehicles tabs), `input-preview-page/job-filter-bar.tsx`.
- Drawing overlay lives OUTSIDE DeckGL at z-index 1000; edit handles overlay at z-index 1001.

**Deployment layout (route-planner-v2)**
- `apps/route-planner-v2/Dockerfile.staging` — multi-stage (node:22-alpine), built from monorepo root, runtime image ships `.next/standalone` + static + public.
- `apps/route-planner-v2/infra/terraform/`: `main.tf`, `variables.tf` (`project_id, region, service_name, image_tag, bff_host, iam_host, iam_client_id`), `terraform.tfvars.example`, `apis.tf`, `artifact_registry.tf` (repo `route-planner-v2`), `service_account.tf`, `secrets.tf` (one secret for `DEMO_NCC_TOKEN`; more via `secret_env_vars`), `cloud_run.tf` (v2 service, port 8080, `plain_env_vars` map + dynamic secret block), `iam.tf` (`allUsers` invoker), `outputs.tf` (`service_url`, `image_repo`, `deploy_hint`), `README.md`, `.gitignore` (ignore `*.tfvars`/`*.tfstate`, keep `*.tfvars.example`). Mirrors `bff/infra/terraform/`.
- Cloud Run service names: `bff-staging`, `route-planner-v2-staging`, region `us-central1`; Artifact Registry `us-central1-docker.pkg.dev/[GCP_PROJECT]/{bff,route-planner-v2}/...`.
- Standalone server.js path in image: `/app/apps/route-planner-v2/server.js`; Nx rewrites `distDir` so the real static dir is `/app/dist/apps/route-planner-v2/.next/static`.

**i18n layout**
- next-intl; locales en, pt-BR, es-MX, fr-CA (added). Files: `apps/route-planner-v2/i18n/request.ts` (`SUPPORTED_LOCALES`, `MESSAGES` map), `components/locale-switcher.tsx` (`LOCALES`), `components/dayjs-locale-sync.tsx` (imports `dayjs/locale/fr-ca`, maps `fr-CA`→`fr-ca`), `messages/{en,pt-BR,es-MX,fr-CA}.json`. Each catalog's `locales` block has an entry for every language so the menu shows names in the active language.
- Catalog sections seen: `common, locales, inputToolbar, createRoutes, saveData, preferences, inputImport, header, preferenceSelector, configurationName, objective, constraints, depots, routing, routeDescription, timezone, connection, dataMapper, mapperGroups, editRow, solution, previewLasso, inputPreview, jobFilter, mapperFields`, later `loadingSolution, savePrompt, routeMetrics, editToolbar, appBar, shareMenu, loadSolution, analytics, devDialog, timeline, geocodePreview`.

**Map attribution**: `apps/route-planner-v2/components/common/map-attribution.tsx` (absolute bottom-right 8px, white pill w/ shadow, `pointer-events: none`, `height: 32` final). Wired into 5 map roots: `components/input/preview-map/preview-map.tsx`, `components/input/geocode-preview/geocode-preview-map.tsx`, `components/solution/solution-map/solution-map.tsx` (legacy), `components/route-edit/map-container.tsx`, `v3/components/map/base-map.tsx` (shared by newer solution views). Each map's `styles.root` already `position: relative`. Final logo file: `public/images/nb-logo-colored (1).webp`, referenced URL-encoded (`%20`, `%28`, `%29`) with `/route-planner/` prefix.

**Preferences UD (rename/delete)**: UI `components/input/input-panels/input-preference.tsx:17-72`; state `state.inputCore.preferenceList: string[]` in `models/input/input-core.ts`; server actions `actions/server/configure.ts` (`_getConfig`, `_saveConfig`, `getPreferenceConfigList`, new `deletePreferenceConfig(name)` [DELETE, params on query string], `renamePreferenceConfig(oldName,newName)` [POST body]); BFF `bff/src/config/config.controller.ts` (`@Delete('delete')`, `@Post('rename')`) and `config.service.ts` (`delete()` uses GCS `.file().delete()` and swallows 404; `rename()` uses `.move()`, returns 409 if target exists; logs `Renaming config gs://<bucket>/<path>`).

### Transcript part C (chunks 7-9)

Repo: Nx monorepo at `/Users/[USER]/workspace/ncc`; the app is `apps/route-planner-v2` (Next.js App Router, `basePath: '/route-planner'`). Companion repo `bff` (NestJS) is separate; deploys independently. Shared libs: `libs/common` (`@ncc/common`, `@ncc/common/client`), `libs/route-planner-components` (shared map hooks/utils like `useInputMapLayers`, `color-generator.ts`), `libs/playground` (has `useDistanceMatrix` hitting `/distancematrix/json`, axios-based). A reference implementation of clustering lives at `~/workspace/route_planner_monorepo` (user pointer).

### Frontend state layout (Rematch input models + v3 Zustand solution store)
- `apps/route-planner-v2/models/input/input-core.ts` — the Rematch core: `state.inputCore` holds `rawData` (per entity, with `attachedRows` = user/app-added columns beyond the uploaded `dataCols`), `output` (`output.job`, `output.shipment`, `output.vehicle`, `output.depot` regenerated via `dispatch.inputCore.generateOutput()`), `preferences` (`PreferencesInput`), `clusters` (new slice: `ClusterInfo[]` = `{id, geometry (raw wire string), geojson?: GeoJSON.Polygon, max_quantity}`), `validatedZones`.
  - Reducers/effects added in this stretch: `setClusters`, `runClustering`, `updateClusterPolygon({clusterId, ring})`, `setColumnWidths({entity, widths})`; `saveInputSet` / `loadInputConfiguration` persist/restore `clusters`; `savePreferenceConfiguration` → `savePreferenceConfig(preferences, fileName)` serializes the whole `preferences` blob to the BFF (GCS) so anything on `preferences` rides along.
  - Helper helpers: `deleteAttachedColumn` (does rows-splice + mapping-index-shift in one go), `upsertDataMapConfig`, `setMapping(entity, config)`, `setRawData`, `polylineToGeoJsonPolygon()`.
- `models/input/input-phrase.ts` — phase transitions (import → geocode → preview…). Lines ~421-435 choose the default preview tab; lines ~172-187 contain the check that re-triggers geocoding if any `JobMapOption.Address` mapping still exists.
- `models/input/input-geocode.ts` — `triggerGeocode` effect, `applyJobGeocode`, `applyShipmentGeocode`.
- `components/input/data-mapper/` — `data-mapper.tsx` (import table; mounts `<ClusteringPanel />` above the Add row/Add attribute/Edit/Delete toolbar, only when `inputType === 'job'`), `clustering-panel.tsx`, `mapping-config/` (barrel `index.ts` + leaf `interface.ts`; enums `JobMapOption`, `VehicleMapOption`, `ShipmentMapOption`, `DepotMapOption` — `Description` value is the literal `'description'` in all four, `mapping-config/interface.ts:30/51/99/216/292`), `edit-row-dialog.tsx`, `DataMapperTable` → `DataMapperCell` (TableVirtuoso; `itemContent` returns a fragment of cells, so row-level styling is impossible and styling is per cell).
- `components/input/input-preview-page/` — `input-preview-page.tsx` (`normalizeInput` builds the optimizer request; `buildZones` effect builds `zoneGeometries` for the map; `onGenerateRoute`), `preview.tsx` (`JOB_COLUMNS`), `preview-table.tsx` (`PreviewDataTable`, `normalizeColumns` hides columns that are empty in every row), `geoccode-preview-table.tsx` (sic; "Review Geocoded Addresses").
- `components/input/preview-map/preview-map.tsx` — the preview map (react-map-gl `Map` + deck.gl). Imports `Map` default from `react-map-gl` (shadows global `Map`; see Debugging). `preview-lasso.tsx` has `PreviewLassoEditOverlay` (vertex/midpoint handles; used for both lasso selection and cluster-zone editing).
- `v3/api/clustering.api.ts` — new browser→NB clustering client; `v3/api/directions.api.ts` — raw `fetch()` client; `v3/base-map.tsx`, `geocode-preview-map.tsx` already used the deck.gl "interleaved" pattern.
- v3 solution store: `v3/features/solution/stores/solution.store.ts` keeps two parallel input fields: `result.input` (domain `OptimizationInput`, left `null` by `v3/features/solution/transforms/raw-to-domain.ts:87`) and `_rawInput` (raw API `OptimizationMvrpInputDataV2`, populated as soon as input loads, used by `use-map-layers.ts:321` for the zone layer). A new public selector `useRawOptimizationInput()` was added and re-exported from `stores/index.ts`.
- Analytics: `v3/features/solution/components/analytics/analytics-view.tsx` has a `REPORT_COMPONENTS` registry (line ~21-25); each card is a component taking `{routes, unit, isPrimary}`; cards are toggled/ordered in `app/settings/analytics`; defaults live in `utils/settings.ts`. New files: `use-zone-aggregates.ts`, `zone-load-summary-table.tsx` + `.module.scss`, Lorenz/Gini card; `types.ts` `AnalyticsProps` extended with optional `jobs / vehicles / zones`.
- Parsing: `utils/parser/col-parsers.ts` (zones parser at ~232-269 writes directly to `target.zones`; `parseDescription` ~858 appends with `|`; `parseTime` ~907), `utils/parser/data-parser.ts:160` (`parseRow`, iterates `mapOptions`).
- Hooks: `hooks/input/use-current-input.ts:144` `MULTI_SELECT_ALLOWED` (which mapping values may be selected on more than one column).
- i18n: `messages/{en,pt-BR,es-MX,fr-CA}.json` (next-intl). Blocks touched: `clustering` (21 keys), `dataMapper` (`saveEditConfirmTitle`, `saveEditConfirmBody`, `discardEditConfirmTitle`, `discardEditConfirmBody`), `analytics` namespace (new), `header.devMode` (removed).
- Auth/redirect: `apps/route-planner-v2/app/dev-login/route.ts` (`buildRedirectTarget()`), `libs/common/src/lib/utils/fetcher-client.ts` (appends `apiKey` from cookie `CURRENT_APIKEY_KEY` — constant in `libs/common/src/lib/consts/cookies.ts` — and `Authorization: Bearer <ncc_token>`), `fetcher.ts`, v3 ky client, `useFetch`. Server action `actions/route-edit.ts` `fetchDirections` uses a different `Fetcher` abstraction (has a typo `optimizaton` in its `caller` param).

### Coordinate and data conventions (end of this stretch)
- Internal job/vehicle location strings: `"lng,lat"`. NB clustering API request wants `lat,lng` (swap at request build in `runClustering`).
- GeoJSON must be `[lng, lat]`. The NB clustering response polyline/geometry order flipped depending on what order was *sent* (see Debugging).
- Cluster zone ids in the optimizer request: `geofence_id: "cluster-<n>"`, preview-map synthetic `id` in the 1_000_000+ range (`1000000 + n`), display name `"Zone N"` (previously `"Cluster N"`).
- Optimizer `job.zones[]` / `shipment.zones[]` must be numeric indices into the request's `zones` array (not strings).

### Deployment layout
- Frontend Cloud Run service: `route-planner-v2-staging` (region `us-central1`), image repo `us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging:<tag>`. Example URL shape: `https://route-planner-v2-staging-rohbynxveq-uc.a.run.app/route-planner/...`.
- BFF Cloud Run service: `bff-staging` (image repo `us-central1-docker.pkg.dev/[GCP_PROJECT]/bff/bff-staging:<tag>`), URL `https://bff-staging-[GCP_PROJECT_NUMBER].us-central1.run.app`.
- `apps/route-planner-v2/Dockerfile.staging` (node:22-alpine builder, `corepack enable`, `yarn config set nodeLinker node-modules && yarn install --immutable`, `yarn nx build route-planner-v2 --skip-nx-cache`; runtime serves from `/app/dist/apps/route-planner-v2/...`).
- Preferences are JSON files in a GCS bucket under `preference/<name>.json` managed by the BFF (rename = GCS `.move()` = copy + delete).

### Transcript part D (chunks 10-12)

### Key paths touched (route-planner-v2 = `apps/route-planner-v2/`)
- v3 solution page (Zustand stores, deck.gl over MapLibre):
  - `v3/features/solution/hooks/use-map-layers.ts` — composes all deck.gl layers (zones, zone labels, step clusters, step markers, rest markers, step-stack pills, depots). Memo with a long dependency list; `mapZoom`, `mapBounds`, `zoneLabelData`, `onClusterCircleClick`, `onClusterCircleHover` were all added as deps.
  - `v3/features/solution/hooks/use-route-layers.ts` — route polylines (`ROUTE_LINE_MIN_ZOOM`).
  - `v3/features/solution/hooks/use-solution-map.ts` — wires viewState/zoom, auto-enables zone layer, forces animation off, uses `useMapStyle`.
  - `v3/features/solution/components/result-panel.tsx` — route list/search/select-all/tabs (`RoutePanel`, `RouteCard`, `UnassignedItem`, new `UnassignedVehicleItem`, new `RouteSearchInput`).
  - `v3/features/solution/components/solution-map-view.tsx` — `MapTooltip` render branches by `popupType` (`step`, `zone`, `stepCluster`, ...); new `ClusterTooltipContent`.
  - `v3/features/solution/components/job-list.tsx` (manifest), `components/timeline/timeline-processing.ts`, `transforms/raw-to-domain.ts`, `utils/step-map-utils.ts` (new `skipLeadingRest`).
  - `v3/stores/solution.store.ts` (`useUnassignedVehicles()` selector), `v3/stores/ui.store.ts` (`ResultTab` union widened with `'unassigned_vehicles'`), `v3/stores/index.ts`.
  - `v3/components/map/use-map-viewport.ts` — `DEFAULT_VIEW_STATE`.
  - `v3/domain/types/route.ts:39` — comment `/** [lng, lat] */` on `step.location` is WRONG (see Debugging).
  - `v3/api/client.ts` (ky client), `v3/api/optimization.api.ts` (`/optimization/v2`, `/result`, `/get_request_input`, `/create_shared_result`, `/edit_routes`, `/track_records`), `v3/api/api.ts:38` (`env.getBffHost()`).
  - Saved solutions: `app/saved/page.tsx`, `v3/features/saved-solutions/components/{recent-requests,left-panel}.tsx` (v2 legacy siblings at `components/saved/*`).
- Analytics panel: `use-zone-aggregates.ts`, new `use-zone-drive-matrix.ts`, `zone-load-summary-table.tsx`, `analytics-view.tsx` (registry), `utils/settings.ts` (card registry/toggle list), new cards `use-zone-crossings.ts`, `boundary-crossing-card.tsx`, `territory-flow-card.tsx`, `capacity-vs-demand-card.tsx`, `territory-day-heatmap-card.tsx` (each with `.module.scss`).
- Preview/input side: `components/input/preview-map/preview-map.tsx` (deck.gl + supercluster; `import Map from 'react-map-gl'` at line 18 SHADOWS built-in `Map`; supercluster imported as `* as SuperclusterNs` workaround lines 7-10), `preview-lasso.tsx` (`PreviewLassoEditOverlay`), `input-preview-page/{input-preview-page,job-filter-bar,vehicle-filter-bar,preview,address-autocomplete}.tsx`, `models/input/input-preview.ts` (Rematch slice), `models/input/input-core.ts` (Rematch input model: `prependEmptyRow`, `cloneRow`, `deleteData`, `setRawData`, `saveInputSet` ~line 2295, `loadInputConfiguration` ~2253, `setInputSet`), `components/input/configure.ts` (`saveInputConfig` → GCS).
- Data mapper (jobs/shipments/vehicles/depots import table): `components/input/data-mapper/{data-mapper,data-mapper-table,data-mapper-cell}.tsx`; table uses `TableVirtuoso` (react-virtuoso).
- Geocoder: `components/input/geocode-preview/{geocode-preview-modal,geocode-preview-map,geoccode-preview-table,address-edit-cell}.tsx`, hook `hooks/use-discover-search.ts`.
- Import connection methods: `components/input/import-source/{types,import-source-cache,import-source-panel,import-method-selector,import-method-icons,servicenow-import-panel,dynamics-import-panel}.tsx|ts`; Salesforce OAuth routes `.../api/integrations/salesforce/{callback,token,login}/route.ts` + `oauth.ts`.
- Shared lib `libs/route-planner-components/src/lib/components/map-style-selector.tsx` (MapStyleSelector, `MAP_VIEW_STYLE_OPTIONS`, `applyMapStyle`, `sanitizeStyleSpec`); the lib is also consumed by `route-planner-viewer`, which has NO next-intl provider -> never add `useTranslations` to shared-lib components (wrap at v2 call site instead).
- App util `apps/route-planner-v2/utils/map-style.ts` (`getMapStyleUrl`, `mapTransformRequest`, `useMapStyle`).
- Auth/admin: `utils/impersonation.ts`, `context/impersonation-context.tsx`, `components/admin/{impersonate-banner,users-page}.tsx`, `hooks/use-route-planner-permissions.ts`, `context/providers.tsx`; demo gate: `app/demo-login/page.tsx`, `app/api/demo-login/route.ts`, `middleware.ts`.
- i18n: `messages/{en,pt-BR,es-MX,fr-CA,pl-PL}.json` (next-intl, ICU); `i18n/request.ts`, `locale-switcher.tsx`, `dayjs-locale-sync.tsx`.
- Infra: `apps/route-planner-v2/infra/terraform/` (README documents docker build -> push -> `terraform apply -var="image_tag=$TAG"`), `apps/route-planner-v2/Dockerfile.staging`.
- BFF (separate repo, NestJS) at `/Users/[USER]/workspace/bff`: `src/common/services/api-gateway.service.ts` (`ApiGatewayService.send()`), `src/configuration.ts`, `OptimizationController`, `VelocitorController` (`/velocitor/optimization/*`), `RoutePlannerController` (`/route-planner-api/*`, solution-folders namespace).

### Request path (optimization)
`browser -> Next.js Server Action (actions/server/optimization.ts:91, `fetch<OptimizationMvrpOrderResultV2>('/optimization/v2?...', {body, method:'POST'})`) -> BFF /optimization/v2 -> NextBillion`. v3 ky client uses relative paths; host from `env.getBffHost()` (`BFF_HOST` / `NEXT_PUBLIC_BFF_HOST` in `.env.local`, baked into client bundle at build time via Dockerfile build-args — see `infra/terraform/README.md:59-65`). v3 client attaches both `?apiKey=<key>` AND `Authorization: Bearer <ncc_token>` (`v3/api/client.ts:74-85`). BFF-only endpoints (don't exist on public API): `get_request_input`, `create_shared_result`, `edit_routes`, `track_records`. Public API has only `POST /optimization/v2` and `GET /optimization/v2/result`.

### BFF upstream resolution
- Both `OptimizationController` and Velocitor call `ApiGatewayService.send()` with `product: 'vrj'`. `getEndpoint()` validates the org's route-planner SKU ("no matched sku" error); then the upstream host was overridden for `vrj`.
- `RoutePlannerController` uses a separate `routePlannerHost`: `bff/src/configuration.ts:15-17` originally `const defaultRoutePlannerHost = isProduction ? 'api.nextbillion.io' : 'staging.nextbillion.io'`. `ROUTE_PLANNER_HOST` env var still overrides; Cloud Run bff-staging only has `ENV=staging`.
- Final BFF save URL: `https://api.nextbillion.io/optimization/planner/v1/solutions:save?key=<apikey>`.

### Analytics data model notes
- `useZoneAggregates` gives per-zone aggregates incl. `stopLocations: Array<{jobId, location}>`; zone key type `ZoneAggregateKey = number | '__unzoned__'`.
- Day-of-week heatmap uses `dayjs` + dispatch timezone from `vehicles[0].metadata.ncc_dispatch_timezone`; Mon-first ISO weeks.
- Optimization payload shape seen: `vehicles[]{id, description, time_window:[epoch,epoch], max_working_time, breaks:[{id, service, time_windows:[[s,e]]}], capacity:[n], allowed_zones:[n], metadata:{ncc_dispatch_timezone}}`, `jobs[]{id, description, service, pickup, time_windows, zones, metadata, location_index}`, `locations:{location:["lat,lng",...], id:1}`, `objective.custom.value:"vehicles"`, `routing.mode:"car"`, `routing.disable_cache`.

### Transcript part E (chunks 13-15)

### App/routing facts
- `apps/route-planner-v2` is mounted under `basePath: '/route-planner'` (`next.config.js`). Every URL, including Route Handlers, needs the prefix:
  - `/dev-login` at the root hits the catch-all error page; correct URL is `https://<service>.run.app/route-planner/dev-login` (307s to `/route-planner`).
  - New page `/territory-planner` 404'd locally on `http://localhost:4200/territory-planner`; correct: `http://localhost:4200/route-planner/territory-planner`. Other pages work the same way (`/route-planner/saved`, `/route-planner/settings`). If still 404, restart `nx serve route-planner-v2` so Next picks up the new page directory.
  - Static fixtures under `public/` are fetched with the basePath: `/route-planner/data/<file>`.
- Dev-login (`app/dev-login/route.ts`): returns 404 unless `ENV=test`; reads `DEMO_NCC_TOKEN` first (line ~83-84), `NCC_TOKEN` only as fallback; sets cookie `ncc_token` with `maxAge: 604_800` (7 days), `httpOnly: false` (lines 57-64). Cookie is not overwritten until `/dev-login` is hit again. Middleware redirects to `/dev-login` when cookie is absent.
- "Mode 2" auto-login exists (`DEV_AUTO_LOGIN_EMAIL` + `DEV_AUTO_LOGIN_PASSWORD`): `/dev-login` mints its own JWT against `IAM_HOST/api/login`; needs a password-auth account (a Google-SSO-only account, `employeeType: ["google"]`, cannot use it).
- API-key selector lives in `@ncc/common/client`: `libs/common/src/lib/components/apikey-selector/apikey-selector-v2.tsx` (consumed by every NCC app's header via `nb-app-bar-v2.tsx`). There is also the older `apikey-selector.tsx`.
  - Data path for key names: `libs/common/src/lib/components/common-layout/common-layout-rsc.tsx:30` does `await fetch<ApiKeyConfigView>('/common/api_keys')` on every page load; shape `{subscriptions: [{apiKeys: [{kid, name, namespace, ...}]}]}`. `currentSub` (cookie-pinned subscription or first one, lines 62-71) is passed into `AppContext`.
  - `renderSelectedValue` (lines 101-110) → `<KeyDisplay name={hasKeyName(key) ? key.name : undefined} maskedKey={masked} />`; `hasKeyName` (22-24) = truthy, not `-`, not equal to kid.
  - Custom keys: browser localStorage key `custom_api_keys` (added through "Add custom key"). `nbai.json` is NOT read by the route-planner app.
- Mock API import (`components/input/import-source/mock-api-import.ts`): the "API import" panel does not call the user URL; it serves a static CSV per entity type from `apps/route-planner-v2/public/data/{jobs,shipments,vehicles}.csv`. Mapping `ENTITY_DATA_FILES: Record<ImportEntityType,string>` in `components/input/import-source/types.ts:27`; `getMockDataUrl` builds `${'/route-planner'}/data/${fileName}`. The entered `apiUrl`/`token` are only echoed in the progress message.
- Solution page v3 layout (`apps/route-planner-v2/v3/`):
  - `features/solution/hooks/use-solution-data.ts` — loads solution + input; sources: Waymer DB (`solutionFoldersApi.getSolution({request_id, version?})` → `detail.request_input` already decoded), GCS/optimization API fallback (`optimizationApi.getRequestInput(requestId, region)` → base64 JSON via `decodeInputResult()` lines ~39-49: `atob` + `JSON.parse` + hoists `description`/`options`), imported (`_import` sentinel, localStorage), and now fixtures.
  - `features/solution/hooks/use-map-layers.ts` — step/cluster/zone layers; `use-route-layers.ts` — polylines; `use-solution-map.ts:88` — "Show Zones" toggle enabled only if `_rawInput.zones?.some(z => z.geometry)`.
  - `features/solution/components/result-panel.tsx` — routes tab, filters (search, time, zone, rep), unassigned vehicles; `solution-toolbar.tsx`; `job-list.tsx` (manifest).
  - `stores/solution.store.ts`, `stores/route-edit.store.ts` (edit `draft`, `moveStepCrossRoute`, `moveUnassignedToRoute`, `bulkMove*`, apply), `stores/ui.store.ts` (filter state).
  - `domain/operations/recalculate-route.ts`, `domain/operations/step-operations.ts`, `api/directions.api.ts`, `api/clustering.api.ts` (`ClusteringRequest`, `submitClusteringTask`, `pollUntilClusteringDone`), `api/types/optimization.types.ts:217-222` (`OptimizationMvrpOrderZoneV2 = { id: number; name?: string; geometry?: GeoJSON.Polygon; geofence_id?: string }`), `domain/types/optimization.ts` (`SolutionSource`).
- Zones: live on the request INPUT (`useSolutionStore((s) => s._rawInput?.zones)`), not on the result. Consumers: map polygon layer (`use-map-layers.ts:432-449`, via `generateZoneLayer` from `@ncc/route-planner-components`), visibility gate (`use-solution-map.ts:88`), analytics tab (`analytics-view.tsx:104`; cards separately use `job.zones[0]` from `_rawInput.jobs`), edit restrictions (`edit-restrictions/context.ts:45`).
- Enrichment: `enrichRawRoutes(rawRoutes, rawInput)` effect in `use-solution-data.ts` (~line 211) patches `timewindows` (and `description` when job has one) onto steps; manifest reads `step.timewindows`.
- Source of the "Set Preferences" state: `models/input/input-core.ts` (`PreferencesInput`, `initialState.preferences`, `savePreferenceConfiguration`, `importRawData` thunk, `createSavedStateSnapshot`/`SavedStateSnapshot`), preferences panels in `components/input/input-panels/preferences/` (`grouping-panel.tsx` added), `input-preference.tsx`, `input-preview-page.tsx` (builds the optimization request), `app/(input)/index-client.tsx` (`hasUnsavedChanges` dirty comparison).
- Nav: the dropdown opened by the top-right apps icon is in `page-head.tsx` (not `menu.tsx`); entries gated on `canPlanRoutes`. Messages in five locale files: en, pt-BR, es-MX, fr-CA, pl-PL.
- FEMSA fixtures in `apps/route-planner-v2/public/data/`: `coca_cola_four_week_response.json` (24 MB, original FEMSA1), `jobs_femsa.csv`, `input_femsa.json`, `cluster_request_femsa.json`, `cluster_result_femsa.json`, `vehicles_femsa.csv`, `femsa2_response.json`, `input_femsa2.json`, later `femsa1_response.json` + `input_femsa1.json` (current FEMSA1 pair). One-off generator scripts lived in the Claude scratchpad (`csv-to-input.mjs`, `build-cluster-request.mjs`, `consolidate-cluster-locations.mjs`, `route-day-zones.mjs`).
- Territory planner (new, 2026-07-22):
  - `libs/territory-planner/` (alias `@ncc/territory-planner` in `tsconfig.base.json`; `project.json`, `package.json`, `src/index` TS entry + `runPipeline()` orchestrator) — modules copied from the `femsa-pipeline` project (~1000 lines CommonJS: `parse.js`, `cluster.js`, `boundaries.js`, `geo.js`, `lp.js`, `run.js`; heavy deps exceljs, highs WASM, d3-delaunay, polygon-clipping; ~2 min on a 6.5k-POS file).
  - `apps/route-planner-v2/app/api/territory-planner/route.ts` — NDJSON-streaming API route (progress log lines → final result), reads `apikey` cookie for NB Distance Matrix, accepts form field `selected` (JSON list of matrículas).
  - `apps/route-planner-v2/app/territory-planner/` — layout wrapper, `client.tsx` (phases: upload → parsing → preview → build → map), preview DataGrid, map view (MapLibre + deck.gl: ScatterplotLayer for POS, GeoJsonLayer for territory boundaries), date-filter panel, types file shared by client+map.
  - New root deps: `exceljs`, `highs`, `d3-delaunay`, `polygon-clipping`; Next config keeps `highs` and `exceljs` as server externals.
  - i18n namespace `territoryPlanner` (24 keys at first, 41 after preview UI) across 5 locales.
- Deploy topology (docs `docs/09 - preview deployments.md`, `docs/11-single-branch-release-flow.md`, `.cursor/skills/ncc-release/SKILL.md`): PR preview via `.github/workflows/preview-deploy.yml` (project `nextbillion`, region `asia-southeast1`); staging auto-deploys on merge to main via `.github/workflows/main.yml`; production via tagged GitHub release `v1.3.N` (`tools/release/*.sh`, `release.yml`). Route-planner-v2 staging used by the user: project `[GCP_PROJECT]`, region `us-central1`, service `route-planner-v2-staging`, Artifact Registry `us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging`, Terraform under `apps/route-planner-v2/infra/terraform` (`secrets.tf:6`, `cloud_run.tf:52-63`, `README.md`), build args baked in by `Dockerfile.staging:24-31` (only `NEXT_PUBLIC_*`).

### Transcript part F (chunks 16-18)

Period covered: 2026-07-22 -> 2026-08-27. Work is in the ncc monorepo (`apps/route-planner-v2`, Next.js app under `basePath /route-planner`), mostly the "territory-planner" feature (mirrors the standalone femsa-pipeline project) plus a "standalone mode" that removes the BFF dependency.

### Territory-planner code map
- Pipeline lib: `libs/territory-planner/src/{config.js, cluster.js, schedule.js, validate.js, run.js, parse.js, matrix.js, boundaries.js, reschedule.js (new), lp.js, index.ts}`. `lp.js` = HiGHS WASM MILP wrapper; scheduling is a per-territory MILP.
- API routes (Next, Node runtime): `apps/route-planner-v2/app/api/territory-planner/route.ts` (build, streams NDJSON), `.../route/route.ts` (TSP, new), `.../reschedule/route.ts` (new, NDJSON stream mirroring the build route).
- Client: `apps/route-planner-v2/app/territory-planner/{client.tsx, preview-table.tsx, territory-map.tsx, settings.ts (new), types.ts, date-filter-panel.tsx, parse-preview.ts, result-store.ts}`; i18n in `apps/route-planner-v2/messages/{en,es-MX,fr-CA,pl-PL,pt-BR}.json`.
- Phase machine in `client.tsx`: `preview` and `building` both render `PreviewTable` (so the table stays mounted during a build); `done` renders the map; failure routes back to `preview` with an `error` field. `UploadPanel` no longer has a `running` case.
- Lifted `previewState` (search, TIPO filter, row selection, settings) lives in the client so it survives preview -> building -> done -> preview round trip. "Back to selection" (contained, left-arrow icon) returns to preview with filters intact; "Upload another" (outlined) fully resets. Translation key `mapPrevious` added in all 5 locales.
- Map overlays: a shared left-rail flex column (280 px wide, inner scroll) stacks `BoundaryToggle` (Voronoi/Hull segmented), `EditPanel`, `TerritoryFilterPanel`. Date filter sits top-right. Route grid is a floating panel across the bottom. Sidebar (`MapPanel` in client.tsx) holds summary cards, per-territory table, Recalculate panel, Save/Update buttons.

### Pipeline model facts
- 1 territory = 1 rep. Rep count is derived: `R = Math.ceil(totalH / (weeklyCap * utilTarget))` at `cluster.js:202`; loop at `cluster.js:205-213` re-runs after refining travel-time estimates so R can move by 1-2 then stabilizes. `totalH` = sum of `weekH` over selected POS, each POS `freq * (tempoH + travelH)`. Option offered but not built: `targetR` (pin) or `minR/maxR` (clamp - recommended as safer).
- Boundaries: femsa-pipeline original = per-POS Voronoi cells, unioned per territory, clipped to a per-territory alpha-shape coverage region (`boundaries.js`, `MultiPolygon` types). Hull view is computed client-side (Andrew's monotone chain) from `result.pos` (each POS already carries its territory) and cached in `useMemo`; toggling is instant with no pipeline re-run. User first asked for hulls, then said "go back to the vornoi polygons - not the hulls", then asked for a toggle between both.
- Tunable-parameter tiers (all in `libs/territory-planner/src/config.js` plus `matrix.js`):
  - Tier 1 planner-facing: `DAILY_CAP_H` 7.42, `WEEKLY_CAP_H` 37.08, `UTIL_TARGET` 0.93, `SPEED_KMH` 25, `CIRCUITY` 1.4 (fallback when NB distance matrix off/fails), `OUTLIER_KM` 25.
  - Tier 2 cycle shape (FEMSA-specific): `WEEKS [1,2,3,4]`, `DAYS [2..6]` Mon-Fri (7=Sat excluded), `DAY_PAIRS` 5 spaced pairs for freq-2 POS, `CLS_MAP {23456:0, 2356:1, 25:2, 36:3}` keyed off DIAS ATENDIMENTO, `DAY_NAMES/DAY_SHORT`.
  - Tier 3 safety margins: `DAY2_FACTOR` 0.90, `DAY4_FACTOR` 0.94, `MT_FACTOR` 0.96 (structural Mon+Thu), `WEEK_CAP_FACTOR` 0.98.
  - Tier 4 solver knobs (dev-only): `GRID_KM` 0.35, `SPATIAL_W` 0.0002, `MILP_TIME`/`MILP_RETRY_TIME` 60/300 s, `MILP_GAP` 0.01, loop caps (25 in `balancedCluster`, 4000 in `repair`, outer 4 in `buildTerritories`), `matrix.js`: `SAMPLE_PER_TERR=8`, `MIN_PAIR_KM=0.5`, ratio bounds `[1.0, 3.0]`.
- Overrides plumbing (Settings popover): client serializes non-blank fields into a JSON `overrides` form field -> API route `pickOverrides` validates (positive finite, util <= 1) -> `runPipeline(..., {overrides})`. Type `TerritoryPipelineOverrides` exported from `@ncc/territory-planner` with `dailyCapH, weeklyCapH, utilTarget, speedKmh`. Touched: `cluster.js:191`, `schedule.js:8`, `validate.js:5`, `run.js:32`, `index.ts`. The reported `dailyCapH` metric reflects the value actually used. Settings constants split into `settings.ts` to avoid a circular import between `client.tsx` and `preview-table.tsx`. Blank field = default; badge on the gear shows active override count; Reset clears. `geo.travelPerVisitH` takes optional `speedKmh`, and every `recomputeTravel(pos, R, ...)` call in `buildTerritories` passes it through; `run.js` logs `speedKmh=...` for parity.
- Weekday/slot data: `pos.schedDays / schedWeeks / visitH`; per-day TSP filters POS whose `schedWeeks x schedDays` includes that (week, day).
- Metrics semantics (clarified to user): "Weekly workload" = operation-wide sum of `weekH` over all POS (e.g. 63 h / 2 territories = 31.5 h per rep, under the 37.08 cap); "Max rep-day" = highest load in any single (rep, week, day) slot (6.87 h, under 7.42). Card subtitle now shows `63 h` over `31.5 h/rep . 74% service` (div-by-zero guarded with `Math.max(R, 1)`, key `perRepAndService`).

### Data/time-window columns
- Workbook `apps/route-planner/public/FEMSA_-_BASE_POC_FASE_2.xlsx` got two columns `start_tw_1` / `end_tw_1`: `07:30`/`16:30` for 6,556 rows, `15:00`/`22:00` for the 558 `VEND. NOTURNO` rows. Pipeline fields `startTw`/`endTw` ("HH:MM" or null) on POS records; `parse.js` reads via `optionalCol` (older workbooks still parse) and `normalizeHm` handles string / JS Date / Excel fractional-day number.
- Accepted header aliases (added 2026-08-05) in both `parse.js` (server, exceljs) and `parse-preview.ts` (client, SheetJS): `MATRICULA|ID`, `CEP|DESCRIPTION`, `LAT_LONG`, `TIPO DE VENDEDOR|CATEGORY`, `FREQUENCIA DE VISITAS|FREQUENCY`, `TEMPO NO CLIENTE|SERVICE_TIME` (fractional day x 24 = hours), `DIAS ATENDIMENTO DA CIDADE|VALID_DAYS` and `DIA RESTRIÇÃO CLIENTE|INVALID_DAYS` (concatenated day digits, e.g. "23456"). User wrote `DIA RESRICaO CLIENTE`, read as a typo of the existing `DIA RESTRIÇÃO CLIENTE` / ASCII `DIA RESTRICAO CLIENTE`.

### TSP / route feature
- Trigger: exactly 1 territory selected + a date range picked on the calendar. "All dates" (no range) stays idle so opening the page never blasts NB. Day-range of N dates fires N TSPs in parallel behind one `AbortController`; changing selection cancels all in flight. `enumerateRangeDates` + `RangeDate` exported from `date-filter-panel.tsx`.
- Tabbed results: one tab per date; status dot amber=loading, green=solved, red=error, grey=<2 stops; tab label `● Wed, Jul 22 . 48 . 7h 33m` (stops + total time shown only once resolved). Active tab persists while date range unchanged. Map layers (PathLayer polyline `rgba(30,64,175,220)`, numbered marker circles 12 px radius white outline, text labels) render the active tab only. `updateTriggers` added on marker `getFillColor` so deck.gl invalidates its colour buffer on new result.
- Marker colour by visit frequency (route markers only): red=2/wk, orange=1/wk, blue=0.5/wk, green=0.25/wk, grey fallback; legend chip row only shows frequencies present that day.
- Header format (user-specified): `Territory 1 . Fri, Aug 7   30 stops   75.6 km total   7h 09m total   4h 19m service   2h 50m driving`. Total = `duration + service`; `Route.duration` per v2 schema is driving-only (previous label was misleading). Grid columns: `#`, POS, Window (`07:30-16:30` or dash), Arrival (24h), Service, Leg, Cum. dist, Cum. time. Mock **Dispatch** button in header between "driving" and the frequency legend (swap the `setTimeout` in `DispatchButton` for a real fetch later).
- POS tooltip footer shows `8 min/visit` instead of `0.13 h/visit . 0.03 h/wk` (user: "show 0.13h/visit as nbr of minutes per visit. No need to display hrs per week").

### Territory edit stack
- `@nebula.gl/layers` `EditableGeoJsonLayer` + `@nebula.gl/edit-modes` `ModifyMode` (drag vertex / double-click edge to insert / alt-click to remove); `@turf/turf` `booleanPointInPolygon` (both already in deps). Helpers inline in `territory-map.tsx`: `centroidsByTerr`, `nearestOtherTerr`, `applyEdit`.
- State: `clickedTerr`, `edit: {terr, ring} | null`, `stagedPos: TerritoryPos[] | null`; `effectivePos = stagedPos ?? result.pos` feeds hull boundaries, visible POS, territory stats, tooltips. Edit enabled only in Hull mode with a territory clicked. Save: POS inside new polygon -> `edit.terr`; POS previously in `edit.terr` now outside -> nearest OTHER territory centroid.
- `MapPanel` tracks `editedPos` through `onEditedPos` callback; solver-derived cards (Max rep-day, Hours by weekday) show a "Stale" chip (key `staleAfterEdits`) while edits pending.
- Right-click POS pin -> context menu "Delete POS" (red) -> confirmation dialog -> removes from `stagedPos` -> plan goes stale. Cancels any in-flight boundary edit.
- Per-territory stats table in sidebar (Terr . POS . Wk h . Max/day, colour swatch, Max/day red+bold over cap; stale badge while approximated). Hover row -> MUI Popover calendar (Mon-Fri x Week 1-4 hours grid, heat-tinted blue by ratio-to-peak, red over cap). Click row -> `focusRequest = {terr, tick}` signal -> `TerritoryMap` effect computes POS bounding box from `effectivePos` and updates `viewState` via `boundsToViewState`; `tick` lets same row re-focus. Row click must ONLY pan/zoom (user: "don't deselect the other territories").
- Territory multi-select dropdown (swatch, POS count, weekly hours; Select all / Clear; `N / total` header) hides both boundary polygon and POS pins; auto-resets to all-selected when a new build result arrives; composes with date filter (POS shown only if territory selected AND schedule intersects date range).

### Reschedule (Recalculate) architecture - server-side
`POST /route-planner/api/territory-planner/reschedule` -> `reschedule()` in `libs/territory-planner/src/reschedule.js` (Node runtime):
1. re-parse workbook (`parseBase`) - needs server-only `patterns`/`eff`/`restr` fields that don't survive client's serialized POS shape
2. apply client `matricula -> terr` assignments (workbook filtered to matriculas in `assignments`; deleted POS show in the `dropped` counter)
3. `recomputeTravel()` (exported from `cluster.js`)
4. `scheduleAll()` (HiGHS WASM MILP)
5. `validate()` with `allowOverCap`
6. `buildBoundaries(pos, R, proj)` rebuilds Voronoi.
Streams NDJSON `type: 'log'` progress lines. Skips clustering (`buildTerritories`) so boundaries/assignments are not reshuffled. Client-side (no network): boundary edit, POS delete, approximated per-territory stats and calendar slot loads, hull recompute. HiGHS is not in the browser bundle, hence server. Saved plans created before `inputs.file` was persisted show a "reopen the plan" note instead of running.

### Save/store
`result-store.ts` (IndexedDB in browser). New `updateSavedResult(id, {result, inputs?})` overwrites in place keeping id + createdAt, refreshes `updatedAt` + summary counts. Sidebar: saved plan shows green "Saved as X" chip + **Update** (overwrite) + **Save as new...** (dialog prefilled `{existing name} (copy)`); unsaved plan shows single "Save to storage".

### Infra layout
- Dockerfile `apps/route-planner-v2/Dockerfile.staging`; Terraform `apps/route-planner-v2/infra/terraform/{cloud_run.tf, secrets.tf, terraform.tfvars, terraform.tfvars.example, README.md}`; Cloud Run service `route-planner-v2-staging`, AR repo `route-planner-v2` in `us-central1`, runtime SA `route-planner-v2-staging-sa`, secrets for demo JWT, NB API key, Anthropic key.
- Image path form: `us-central1-docker.pkg.dev/<project>/route-planner-v2/route-planner-v2-staging:<TAG>`. Tag convention: `$(git rev-parse --short HEAD)-dirty-<yyyymmdd-hhmm>` when tree is dirty (later `-dev-<ts>`, `-standalone-<ts>[-suffix]`).
- Existing repo tooling for other apps targeted the `nextbillion` GCP project, AR path `asia-southeast1-docker.pkg.dev/nextbillion/internal/ncc-<app>` and services named `console-preview-<app>-<suffix>-<hash>-<region>`; route-planner-v2 reads `infra/terraform/terraform.tfvars` for project.
- Territory-planner API runs in same Cloud Run service; uses `highs` WASM + exceljs.

### Standalone mode (BFF removed) - env contract
```
STANDALONE_MODE=1                          # server: skip BFF
NEXTBILLION_API_KEY=<hex-key>              # server: for /api/territory-planner/* proxies (Secret Manager)
NEXT_PUBLIC_NEXTBILLION_API_KEY=<hex-key>  # client: baked in at build (--build-arg) for map tiles / direct calls
```
Patch points: `libs/common/src/lib/components/common-layout/common-layout-rsc.tsx` (skip `/common/api_keys` and `/waymer/v1/organizations.get`, synthesize AppContext with one subscription + one apiKey `kid`=env var, name "Standalone Key", so Billing Project dropdown shows single "Standalone" entry); `fetcher-rsc.ts` (Server Actions) and `fetcher-client.ts` (browser): `/optimization/*`, `/directions/*`, `/route/*`, `/distancematrix/*`, `/geocode/*`, `/multigeocode/*`, `/isochrone/*` -> direct to `https://api.nextbillion.io` with preset key; all other BFF paths -> shaped empty-success stub (`standaloneStub`); `/ai/*` -> same-origin `/route-planner/api/ai/*`; `v3/api/client.ts` (ky) for `/solutions/{id}`; `dev-login/route.ts` sets both `ncc_token` and `apikey` cookies; territory-planner API routes use `readCookie(request,'apikey') || process.env.NEXTBILLION_API_KEY`. Middleware untouched (already skips IAM when `ENV=test`). `CommonLayoutRsc` is the only server-side BFF-fetching layout in the tree. Other monorepo apps unaffected unless they set `STANDALONE_MODE`.

### Other features added in standalone build
- **Prediction chip** (preview page footer): `hooks/use-optimization-prediction.ts`, 350 ms debounced, skips when Generate Route disabled, sequence-guarded vs stale responses, coords sampled to <= 300 points. Same-origin proxy `/api/predict` (browser -> predictor CORS "Disallowed CORS origin"). Predictor: `https://predictor-api-7j5cx7inrq-as.a.run.app/predict`, docs at `https://predictor-docs-7j5cx7inrq-as.a.run.app/docs`. Label `Solution estimate: {p50} - {p90}` (tooltip `p50 44s . p90 75s` + model's caveat "Excludes queue time under load"). Body uses `{"input": {vehicles, jobs, shipments, locations:{location:[...]}, options}}` (full-input variant, not counts) so the model's MDM gate triggers. `buildOptimizationOptions(preferences)` extracted as single source of truth for `options.routing.mode`, `options.constraint.*`, `options.objective.travel_cost/.custom`, `options.grouping.order_grouping.grouping_diameter`. Badges under chip: blue `MDM` when `response.matrix.type === 'mdm'` (`dm` otherwise), amber pill per entry of `response.parsed.flexible_reasons[]` (human-readable strings e.g. `hazmat_type set`, `truck_size set`).
- **Import JSON** (waffle/AppsIcon menu in `page-head.tsx`, top item): `components/common/import-json-dialog.tsx` (paste or `.json` upload), `inputCore.importFromOptimizationInput(json)` effect in `models/input/input-core.ts`, UI slot `inputUI.setImportJsonDialogOpen`, i18n `importJson`, `importJsonPasteHere`, `importJsonInvalid`, `importJsonSuccess`. Takes an optimization REQUEST body (not a solution dump, not the dev-only `DebugLoadButton` full-redux dump): validates `vehicles` + (`jobs` OR `shipments`), maps to `inputCore.output = {job, vehicle, shipment, depot}` via `setOutput`, assigns row ids 1..N if missing, maps `options.objective` into preferences, preserves unknown fields.
- **AI Auto-Map** (data-mapper): client `data-mapper.tsx:697` calls `fetch('/ai/fields/auto-mapping', {method:'POST', body:{headers, sampleRows, availableDataFields, ...}})`; BFF original is `~/workspace/bff/src/ai/auto-mapping.service.ts` + `auto-mapping.schemas.ts` (system prompt, zod schemas, `buildUserPrompt`). Ported to `apps/route-planner-v2/app/api/ai/fields/auto-mapping/{route.ts, schemas.ts}`; deps `ai@^6`, `@ai-sdk/anthropic@^3.0.81` (`zod` already in monorepo); install: `yarn workspace @nbai/route-planner-v2 add ai @ai-sdk/anthropic zod`. Model `claude-haiku-4-5-20251001`. Returns `{dataMappings, metaMappings, unmapped, warnings, summary}`. `ANTHROPIC_API_KEY` is server-only (never `NEXT_PUBLIC_*`), in `secrets.tf` `secret_env_vars`, Secret Manager secret `route-planner-v2-staging-anthropic-api-key`. User decisions: "anthropic model, use BFF key, no rate limit" (rate limit of e.g. 20 calls/15 min/demo-cookie was offered and declined).

---

### Appendix 0 (full-length user messages: continuation summaries and long pastes)

Source: /tmp/distill-v3/long-0.txt, which holds only 15 long user messages, all dated 2026-05-28 (the first day). It has no context-continuation summaries; those start in long-1..3. Almost all of it is pasted yarn/nx/Next logs, so this appendix is short. Anything not stated below is not in this file.

- Workspace root is `~/workspace/ncc` (Nx 19.6.5 monorepo, Yarn 3 Berry, Node 20.19.4 from Homebrew `node@20`, darwin arm64). The app is `apps/route-planner-v2` (Next.js 14.2.28). A separate NestJS BFF repo is checked out at `~/workspace/bff`.
- Yarn workspace name is `ncc@workspace:.`. The prompt shows `~/workspace/ncc/a/route-planner-v2`, i.e. `apps/route-planner-v2`.
- Frontend deps visible in the peer-dependency report: deck.gl 8.9.36, luma.gl, loaders.gl, @nebula.gl/layers and overlays, react-map-gl, mapbox-gl 1.0.0 (stubbed), maplibre-gl 2.3.0 and 2.4.0, MUI (`@mui/material`, `@mui/material-nextjs`, `@mui/x-date-pickers(-pro)`), mui-datatables, date-fns 4.1.0, react 18.3.1, @sentry/nextjs 9.33.0 (with @opentelemetry packages), storybook, `@monaco-editor/react`, cypress 13.14.1, sharp 0.33.5, @tailwindcss/oxide 4.1.13, @parcel/watcher 2.5.1, @swc/core 1.5.7, core-js 2.6.12/3.36.1, core-js-pure 3.38.1, nice-napi 1.0.2, unix-dgram 2.0.6, @sentry/cli 2.42.2, `@danmarshall/deckgl-typings` 4.9.12.
- Run-time env contract for `next start` / `next dev` (names verbatim from the pasted commands):
  - `ENV`, `NEXT_PUBLIC_ENV` (`test` or `preview`; middleware logs `[MIDDLEWARE] GET / - ENV: TEST|PREVIEW`)
  - `HOST` (own URL), `BASE` and `NEXT_PUBLIC_BASE` (`/route-planner`)
  - `BFF_HOST`, `NEXT_PUBLIC_BFF_HOST`
  - `IAM_HOST` (`https://iam.nextbillion.ai` for prod/test, `https://iam-stg.nextbillion.ai` for preview) and `IAM_CLIENT_ID` (a different client id per IAM environment)
  - `next dev` loads `.env.local` and `.env`.
- Local topology used on 2026-05-28: BFF on `http://localhost:3000`, Next dev/start on `http://localhost:3001` (and one attempt with `HOST=http://localhost:4200`), with `BFF_HOST=http://localhost:3000`.
- The BFF endpoint the frontend hits first is `GET /common/api_keys?apiKey=...` and then `/waymer/v1/organizations.get?apiKey=...`. The BFF loads the org/api-key config from a GCS object, `gs://waymer/apikeys_stg/orgs_v2.<json>` (the file name is cut off in the paste), via `ApiGatewayService` ("Downloading nbai api-key configuration file from gs://waymer/apikeys_stg/orgs_v2.").

### Appendix 1 (full-length user messages: continuation summaries and long pastes)

### State of the app at the 2026-05-28 continuation summary (i18n / preview-map phase)

The user is developing the NextBillion.AI Cloud Console (`ncc`, an Nx monorepo), focused on `apps/route-planner-v2`. The summary lists what had been requested by then: generate CLAUDE.md; get route-planner-v2 running locally; TomTom Dark/Light map default; gray/blue pins plus truck icons; attribution removal; full i18n (PT-BR + ES-MX + English, including date/time formats); persistent named profiles holding jobs/shipments/mappings; multi-column Description concatenation via `|`; preferences-panel translations; a multi-criteria Job filter bar (wildcards + time windows); row highlight + selection-count tab badges; polygon-lasso selection on the preview map; an Edit/Add row dialog driven by the user's column mappings; address autocomplete backed by NextBillion's discover API (always the production endpoint); and extensive translation of the Solution view including the manifest (right-side step detail) panel.

Process constraints stated for the agent (from AGENTS.md): never commit/push without explicit approval; always branch from `origin/main`; never bypass git hooks unless explicitly requested. (Later summary adds: never tag/publish releases, never run release scripts with `--execute` without explicit confirmation.)

Key technical stack facts captured:
- Nx 19.6 monorepo, Yarn 3 Berry, Next.js 14.2.28 App Router, React 18.
- `next-intl` 3.26 with **cookie-only locale routing** (`NEXT_LOCALE`), eager imports of `dayjs/locale/{en,pt-br,es-mx}` (later also `fr-ca`). Cookie routing was chosen over URL-prefix because it is cleaner with the existing `basePath`.
- Rematch (Redux) for input-core state; Zustand for v3 solution stores.
- deck.gl + react-map-gl + maplibre + `@nbai/nbmap-gl` + `@turf/turf`. `@nebula.gl/*` is present but unused; the lasso is built from a click-capture `div` + mapbox `Source`/`Layer`.
- **V1 vs V3 component split**: many features have parallel implementations in `components/solution/` (v1) and `v3/features/solution/components/` (v3). The `/solutions/[requestId]` URL uses **v3**. (See Debugging patterns: this caused repeated wasted edits.)
- dayjs locale sync is client-side: a `useEffect` calling `dayjs.locale()` based on next-intl `useLocale()` (`apps/route-planner-v2/components/dayjs-locale-sync.tsx`, mounted inside `NextIntlClientProvider` in `app/layout.tsx`).
- `WATCHPACK_POLLING=true` is required for the Next dev file watcher on macOS + this monorepo.
- NextBillion discover endpoint: `https://api.nextbillion.io/h/discover?q=&key=` (always prod, regardless of env; user: "make all discover API requests using api.nextbillion.io and not the staging service").
- Local topology: BFF on `:3000`, route-planner-v2 on `:4200` (matches BFF CORS allowlist). Local dev needs `iam-stg` + the preview IAM client id `adac0e93-69ce-4f3d-936d-87867a04f0ce`.

Local dev start command the user used (and gave when asked "yarn next dev -p 4200 (this is the command from my dev terminal at start)"):

```
ENV=preview NEXT_PUBLIC_ENV=preview \
  HOST=http://localhost:4200 BASE=/route-planner NEXT_PUBLIC_BASE=/route-planner \
  BFF_HOST=http://localhost:3000 NEXT_PUBLIC_BFF_HOST=http://localhost:3000 \
  IAM_HOST=https://iam-stg.nextbillion.ai \
  IAM_CLIENT_ID=adac0e93-69ce-4f3d-936d-87867a04f0ce \
  yarn next dev -p 4200
```
(Add `WATCHPACK_POLLING=true` when file changes aren't recompiling.)

### Files and responsibilities (2026-05-28 summary)

- `CLAUDE.md` (repo root, created): mandatory rules from AGENTS.md, Nx commands, architecture (apps/libs layout, TS path aliases `@ncc/*`), deployment topology (staging on push to main, prod via tag + GitHub Release), release flow pointer to `.cursor/skills/ncc-release/SKILL.md`.
- `apps/route-planner-v2/utils/map-style.ts`: `getMapStyleUrl()` originally `/maps/streets/style.json`; briefly TomTom dark; reverted to streets (user: "drop the TomTom dark maps as the default map view").
- `libs/route-planner-components/src/lib/components/map-style-selector.tsx`: `MAP_VIEW_STYLE_OPTIONS` Light/Dark/Satellite/Orbis/TomTom Dark; TomTom Dark uses `?map=2/basic_street-dark`; Light listed first as default.
- `apps/route-planner-v2/components/input/preview-map/icons.ts`: new `PREVIEW_ICONS_MAP` — `BLUE_DOT_SVG` for jobs/shipments, `GRAY_TRUCK_SVG` for vehicles, `DEPOT_ICON_DATA_URL` kept. Original `ICONS_MAP` (colored PNGs) untouched because solution-map still uses it. (2026-05-31: `GRAY_TRUCK` replaced by `GREEN_DOT_SVG` `#16a34a` per "change the vehicle icons on the preview map to be the same style as the jobs/shipments icons but in a green hue".)
- `libs/route-planner-components/src/lib/hooks/use-input-map-layers.ts`: optional `iconSizes` param threaded through `getJobsLayer/getShipmentsLayer/getVehiclesLayer/getDepotsLayer`, replacing `getSize: 32` with `getSize: iconSize` (default 32).
- `apps/route-planner-v2/components/input/preview-map/preview-map.tsx`: uses `PREVIEW_ICONS_MAP`, `iconSizes: {job: 14, shipment: 14, vehicle: 18}`, `attributionControl={false}`, lasso integration via `PreviewLassoButton` / `PreviewLassoDrawing` (a capture sibling of DeckGL) / `PreviewLassoPolygon` / `PreviewLassoDraftOverlay`.
- `apps/route-planner-v2/components/input/preview-map/preview-lasso.tsx` (created): three components share state via a `useLassoDraft` hook; capture div at z-index 1000 **outside** DeckGL; `parseLngLat` returns `[lng, lat]` directly (stored format is canonically `"lng,lat"`); `selectIndicesInPolygon` uses turf point-in-polygon.
- `apps/route-planner-v2/i18n/request.ts` (created): reads `NEXT_LOCALE` cookie, returns `{locale, messages: MESSAGES[locale]}` with static imports of en/pt-BR/es-MX JSON (fr-CA added later: `SUPPORTED_LOCALES` + `MESSAGES` map).
- `apps/route-planner-v2/messages/{en,pt-BR,es-MX,fr-CA}.json`: catalogs with sections common, locales, inputToolbar, header, preferenceSelector, configurationName, objective, constraints, depots, routing (incl. `road_*`, `hazmat_*`), routeDescription, timezone, connection, dataMapper, mapperGroups, mapperFields (many vehicle-specific keys), jobFilter, editRow (incl. `addressLabel_*`, `addressSearch`), previewLasso, solution, plus later `analytics`, `devDialog`, `timeline`, `shareMenu`.
- `apps/route-planner-v2/app/layout.tsx`: async; `getLocale()` + `getMessages()`; wraps in `NextIntlClientProvider`; mounts `<DayjsLocaleSync />` inside the provider.
- `apps/route-planner-v2/components/locale-switcher.tsx`: inline `IconButton` (no fixed positioning), writes `NEXT_LOCALE` cookie, reloads page (LOCALES array gained `'fr-CA'`).
- `apps/route-planner-v2/components/common/page-head.tsx`: translated breadcrumb/menu via `useTranslations('header')`, `<LocaleSwitcher>` next to Dev Mode.
- `apps/route-planner-v2/components/input/input-preview-page/job-filter-bar.tsx` (created): wildcard ID/Description + `DateTimePicker` time-window range; `ampm={false}`; locale-aware via `adapterLocale`.
- `.../preview-table.tsx`: `onEditRow` callback, edit-pencil column, selected-row tint `rgba(30, 85, 222, 0.08)`; later `displayOrder`/`displayedData` `useMemo` sorting selected rows to the top, with `itemContent` remapping display index to original via `displayOrder[displayIndex]`.
- `.../preview.tsx`: tab badges show selection count (with `total` for visibility filter), mounts `EditRowDialog` (edit + add) and `JobFilterBar` (jobs tab only).
- `.../edit-row-dialog.tsx` (created): mode `'edit' | 'add'`; groups location-typed mappings by `extra.parent`; renders `AddressAutocomplete` per group, writing `{lat,lng}` or `{lng,lat}` depending on option type. **Imports `MapInputType` from `'../data-mapper/mapping-config/interface'` — NOT `options/interface` (which doesn't re-export it).**
- `.../address-autocomplete.tsx` (created): debounced (250ms) MUI Autocomplete; hardcoded `DISCOVER_HOST = 'api.nextbillion.io'`; URL `https://${DISCOVER_HOST}/h/discover?q=&limit=5&key=`; key from `currentApiKey.kid` in AppContext.
- `apps/route-planner-v2/models/input/input-core.ts`: `saveInputSet` now persists full jobs/shipments rawData (no stripping). New reducers `setOutputItem`, `setRawCell`, `appendRawRow`, `appendOutputItem`; new effects `updatePreviewRow` (re-parses a single row via `parseJob/Vehicle/Shipment/Depots`) and `addPreviewRow` (allocates new row, parses, appends, auto-selects).
- `apps/route-planner-v2/utils/parser/col-parsers.ts`: `parseDescription` separator `';'` -> `'|'`.
- `apps/route-planner-v2/hooks/input/use-current-input.ts`: `getDisabledList` exempts `'description'` via `MULTI_SELECT_ALLOWED = new Set(['description'])` (multiple columns can map to Description).
- `.../data-mapper/mapping-popover.tsx`: `toFieldKey()`, `useFieldLabel()`, `useGroupLabel()` helpers; `option.label` replaced by `fieldLabel(option)`.
- `libs/route-planner-components/src/lib/job-step-card.tsx`: v1 shared card, translated via `useTranslations('solution')` — **not** the card the solution page actually renders (see below).
- `libs/common/src/lib/components/root-layout/root-layout.tsx`: optional `locale` prop (default `'en'`) -> `<html lang={locale}>`.
- `apps/route-planner-v2/v3/features/solution/components/solution-toolbar.tsx`: **the real toolbar** imported by `app/solutions/[requestId]/page.tsx` via `'../../../v3/features/solution'`. LocaleSwitcher added in TWO places (breadcrumb row + main toolbar).
- `v3/features/solution/components/result-panel.tsx`, `app/solutions/[requestId]/page.tsx`: translated tabs/labels via `useTranslations('solution')`.
- `v3/features/solution/components/step-card.tsx`: the actual manifest/step detail card (Row labels ID, Description, Expected Time, Date, Time Windows, Duration, Service, Load, Setup, Waiting Time). Catalog keys `description`, `expectedTime`, `date`, `timeWindows`, `duration`, `service`, `loadField`, `setup`, `waitingTime` existed; `id` had to be added.
- `libs/common/src/lib/utils/format.ts`: `formatDuration` had hard-coded English unit labels (years/months/days/hrs/mins/secs). Later fix: `FormatDurationLabels` interface + `labels` option; `dayjs.locale(systemLang)` override removed from `formatToTimeStr`; new hook `apps/route-planner-v2/hooks/use-format-duration.ts` wraps `useTranslations('solution')` and injects localized labels.

### Architecture added in the 2026-05-31 summary (auth bypass, Cloud Run, translation breadth)

- `apps/route-planner-v2/app/dev-login/route.ts` — final form: reads `DEMO_NCC_TOKEN`/`NCC_TOKEN` env, sets `ncc_token` cookie **without a domain attribute**, clears stale `apikey` cookie, returns a **relative `Location`** redirect (avoids the `0.0.0.0:8080` redirect bug on Cloud Run).
- `apps/route-planner-v2/middleware.ts` — in TEST mode without an `ncc_token` cookie, redirects to `/dev-login`. (Side effect seen 2026-06-01: even public static images such as `/route-planner/images/load-solution-instruction.png`, `/images/nbai-logo.png`, `/images/nb-logo.webp` returned `HTTP/2 307 location: /route-planner/dev-login?next=%2Fimages%2F...` when fetched without the cookie — curl-testing static assets requires the cookie or a middleware matcher exemption.)
- `apps/route-planner-v2/next.config.js`: `output: 'standalone'` and `outputFileTracingRoot: path.join(__dirname, '../../')`.
- `apps/route-planner-v2/Dockerfile.staging` (created): multi-stage build from monorepo root; copies `.next/standalone` to `/app`; copies `.next/static` to `/app/dist/apps/route-planner-v2/.next/static` (**the Nx-overridden distDir location**); copies `public` to `/app/dist/apps/route-planner-v2/public`; `CMD node apps/route-planner-v2/server.js`.
- `apps/route-planner-v2/infra/terraform/` (created): `main.tf, variables.tf, apis.tf, artifact_registry.tf, service_account.tf` (SA id `${var.service_name}-sa` to fit the 30-char limit), `secrets.tf` (DEMO_NCC_TOKEN), `cloud_run.tf, iam.tf` (allUsers invoker), `outputs.tf, README.md, .gitignore, terraform.tfvars.example`.
- `bff/src/main.ts`: CORS allowlist gained regex `/^https:\/\/route-planner-v2-.*\.run\.app$/`.
- `bff/src/configuration.ts`: `nccConfigBucket: process.env.NCC_CONFIG_BUCKET || 'nb-ncc'`; `bff/src/config/config.service.ts` reads `gcsBucket` from `configService.get('nccConfigBucket')`.
- Config bucket mapping: BFF `gs://waymer/apikeys_stg/orgs_v2` -> `gs://[GCP_PROJECT]-bff-config` (via `CONFIG_PATH` env, value shape `[GCP_PROJECT]-bff-config/apikeys/orgs_v2`); ncc config `gs://nb-ncc/...` -> `gs://[GCP_PROJECT]-ncc-config` (via `NCC_CONFIG_BUCKET`).
- Preview lasso editing: `PreviewLassoEditOverlay` renders **outside DeckGL** at z-index 1001 in a `pointer-events:none` container; `VertexHandle` uses pointer capture + manual drag (left button only, `setPointerCapture`, disables `map.dragPan`); midpoint markers insert vertices; right-click deletes a vertex when >=4 remain; `touchAction: 'none'` for touch drag. `preview-map.tsx` extracted `applyPolygonSelection` and added `handleLassoShapeChange` (cheap) + `handleLassoCommit` (heavy).
- Other files: `components/common/localized-full-screen-loading.tsx` (wrapper injecting `t('common.loading')`); `libs/common/src/lib/components/sub-select/sub-select-v2.tsx` (`useBillingProjectLabel` with try/catch around `useTranslations`, falls back to `'Billing Project'` when no NextIntlProvider); `components/dialogs/solution-redierct.tsx` (DataGrid locale packs, status translation); `v3/features/solution/components/{share-menu,route-metrics-overlay,save-prompt}.tsx`, `timeline/{timeline-view,timeline-overlays}.tsx`, `analytics/{route-metrics,analytics-view,distance-chart,time-chart}.tsx`, `components/dialogs/dev-dialog.tsx`; `ampm={false}` added to `routing-panel.tsx` and `data-mapper-cell.tsx` DateTimePickers.
- Deployed Cloud Run runtime config observed 2026-05-29 (`gcloud run services describe route-planner-v2-staging`): Port 8080, Memory 512Mi, CPU 1000m, Scaling Min 0 / Max 20, Concurrency 80, Timeout 300s, "CPU is only allocated during request processing", startup probe TCP 240s. Env: `BFF_HOST`, `ENV`, `HOST`, `IAM_CLIENT_ID`, `IAM_HOST`, `NEXT_PUBLIC_BFF_HOST`, `NEXT_PUBLIC_ENV=test`, `NEXT_PUBLIC_IAM_CLIENT_ID`, `NEXT_PUBLIC_IAM_HOST`; secret `DEMO_NCC_TOKEN` from Secret Manager secret `route-planner-v2-staging-demo-ncc-tok` (key `latest`). IAM client for the deployed staging app is `d9883f93-dcbc-44d5-ade8-2af69d29599d` (distinct from the local preview client `adac0e93-...`).
- bff-staging env observed 2026-05-31: `ENV=staging`; secrets `IAM_CLIENT_ID` (`bff-staging-iam-client-id`), `IAM_SERVER` (`bff-staging-iam-server`), `MAAAS_URL` (`bff-staging-maaas-url`), `OPENAI_API_KEY` (`bff-staging-openai-api-key`); plain env `NCC_CONFIG_BUCKET=[GCP_PROJECT]-ncc-config` and `CONFIG_PATH`. BFF images live in Artifact Registry `us-central1-docker.pkg.dev/[GCP_PROJECT]/bff/bff-staging` (tags like `468f8c9`, `468f8c9-bucket`); route-planner image repo `us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging:<git short sha>`.

### Standalone server.js generated by Next (shape worth knowing)

Dumped from the deployed image with `docker run --rm "$IMG" cat /app/apps/route-planner-v2/server.js | head -30`. It sets `process.env.NODE_ENV='production'`, `process.chdir(__dirname)`, `PORT||3000`, `HOSTNAME||'0.0.0.0'`, embeds the whole resolved next config in `__NEXT_PRIVATE_STANDALONE_CONFIG`. Key values visible: `"distDir":"./../../dist/apps/route-planner-v2/.next"`, `"assetPrefix":"/route-planner"`, `"basePath":"/route-planner"`, `"output":"standalone"`, `"outputFileTracingRoot":"/workspace/"`, `transpilePackages` includes `@ncc/common`, `@ncc/ui`, `@ncc/icons`, `@ncc/route-planner-components`, `@ncc/optimization`, `@ncc/telematics-hub`, `@ncc/geocode-common`; `images.remotePatterns` allows `https` `static.nextbillion.io` `/ncc/console/**/**`; `_originalRedirects` has `/sn/:requestId` -> `/solutions/:requestId` (permanent). Notably `publicRuntimeConfig` baked `IAM_CLIENT_ID` = `7a503418-532d-4f66-ad08-02cb5342e042`, i.e. build-time `ENV/HOST/BFF_HOST/IAM_*` values from the build container's env (not the Cloud Run runtime env) — which is why `--build-arg NEXT_PUBLIC_*` are required in the docker build.

Image layout confirmed via `docker run --rm "$IMG" sh -c "ls -la /app ..."`: `/app/{apps,dist,node_modules,package.json}`; `/app/apps/route-planner-v2/{.env,.next,public,server.js}`; **`/app/apps/route-planner-v2/.next` contained only `static`-less shell** while the static chunks existed under `/app/dist/apps/route-planner-v2/.next/static/{<buildId>,chunks,css}` — proof of the distDir mismatch.

### Appendix 2 (full-length user messages: continuation summaries and long pastes)

Source: full-length continuation summaries and long pastes dated 2026-06-02 to 2026-06-12 (appendix material). App: `apps/route-planner-v2` (NextBillion.AI Cloud Console, Nx 19 monorepo at `/Users/[USER]/workspace/ncc`, Yarn 3 Berry, Next.js 14 App Router, `output: 'standalone'`, `basePath: '/route-planner'`). BFF is a separate repo at `/Users/[USER]/workspace/bff`.

### State layers
- **Rematch (Redux)** for the legacy input flow: `inputCore` (data, mappings, clustering, preferences), `inputPreview` (selection, tab, filters). `models/input/input-core.ts`, `models/input/input-preview.ts`.
- **Zustand** for v3 solution flow: `v3/stores/solution.store.ts` (`useSolutionStore`), `ui.store.ts` (`useUIStore`, `ResultTab = 'routes' | 'unassigned' | 'unassigned_vehicles'`), `useRouteEditStore`.
- `result.input` (domain input) stays null in the v3 solution store because `raw-to-domain.ts:87` hardcodes it. Anything that needs the original request (zones, vehicles, jobs) must read `_rawInput` via the selector:
  ```ts
  export const useRawOptimizationInput = () => useSolutionStore((s) => s._rawInput)
  ```
  Symptom of using the wrong one: analytics panel shows "No zones to summarize" even though zone boundaries render on the map.
- v3 route step shape: `step.id` is the job id. `step.jobId` is never set by the v3 transform (symptom: "0 stops in all zones"). `step.location` is `[lat, lng]` even though the type comment says `/** [lng, lat] */`; verified by `v3/features/solution/hooks/use-solution-map.ts:83`, which swaps for turf.

### Map layer architecture (preview map)
`apps/route-planner-v2/components/input/preview-map/preview-map.tsx`
- **Single non-interleaved deck.gl overlay** (`<DeckGLOverlay>` with `interleaved: false`, takes `allLayers`). After repeated experiments with interleaved + split overlays and `beforeId` label-layer pickers, polygons ended up buried; the final fix was reverting to one non-interleaved overlay. User feedback: "This is getting messy. At one point these were working together fine - supercluster and zone polygons." Lesson: don't experiment with interleaving until the basemap layer structure is understood.
- Layers: `clusterCircleLayer` (ScatterplotLayer, fill from `zoneNameToColor[zoneId]`, grey `[120,120,120,220]` fallback, radius `min(48, 12 + 6*sqrt(count))`), `clusterCountLayer` (TextLayer), `zonedJobLayer` (per-job coloured dot radius 10px), `zoneLabelLayer` (TextLayer at polygon centroid), spider ring anchor layers for coincident jobs and vehicles, icon layers (job/shipment iconSize 23, vehicle 18).
- Layer composition: `const rings = [spiderAnchorLayer, vehicleSpiderAnchorLayer].filter(Boolean); return [...rings, ...layers, ...overlays]`.
- Supercluster v7.1.5 index built from `output.job` filtered by `selectedJobs`; `selectionIsAll = selectedJobs.length === jobs.length` shortcut; empty selection yields empty Set so no clusters. Cluster `map`/`reduce` tracks dominant zone id (and route colour in the v3 map).
- Spider fan-out: `SPIDER_RADIUS_PX = 26`, `SPIDER_ZOOM_THRESHOLD = 14`, bucket by lng/lat rounded to 5 decimals. Vehicles use the same ring technique, bucketed by effective start/end location with depot resolution; `cloneById` merges start+end rewrites for the same vehicle.
- Zone label hide: `ZONE_LABEL_HIDE_ZOOM = 13` (`if ((viewState.zoom ?? 0) >= ZONE_LABEL_HIDE_ZOOM) return null`). The user once asked for rollback ("rollback that last change not what I wanted") after this gate was removed; keep it.
- Zone names: `Zone {n}` (renamed from `Cluster {n}`); `geofence_id: \`cluster-${c.id}\`` is an internal stable key and intentionally NOT renamed. Colour lookup regex accepts both for old saved preferences: `/^(?:Zone|Cluster) (\d+)$/`. Analytics panel re-brands `Zone N` to `Territory N` and unzoned to `No territory`.
- `MapTooltip` suppressed when `hoverInfo.object.popupType === 'zone'` (persistent in-polygon label replaces hover popup).

### v3 solution map
`v3/features/solution/hooks/use-map-layers.ts`
- Constants: `STEP_MARKER_MIN_ZOOM = 8`, `STEP_STACK_MIN_ZOOM = 14`, `ZONE_LABEL_HIDE_ZOOM = 13`, `ZONE_LABEL_SHOW_MIN_ZOOM = 6`.
- Tracks `mapZoom` via `v3Map?.getMap?.()` subscribing to `'zoom'`. Zone label centroid = mean of outer-ring coords; layer id `v3-zone-labels` added in the `showZones && zoneFeatures` block.
- Cluster path not `!editMode`-gated; unclustered step layers still are (avoid double render with `DraggableStepMarkers`).
- `use-route-layers.ts`: `ROUTE_LINE_MIN_ZOOM = 5` with `mapZoom` prop.
- `resolveLabelColor()` luma-based text colour; `skipLeadingRest()` helper in `step-map-utils.ts`.
- `solution-map-view.tsx`: cluster tooltip suppressed with `if (hoverInfo?.object?.popupType === 'stepCluster') return null`. `v3/components/map/map-tooltip.tsx` (distinct from the older lib `MapTooltip`) must skip rendering when the render-prop returns null/false, otherwise an empty styled box still shows:
  ```tsx
  const content = children(properties)
  if (content == null || content === false) return null
  return <div ref={tooltipRef} ...>{content}</div>
  ```

### Analytics (v3)
`v3/features/solution/components/analytics/`
- `analytics-view.tsx` registry ids: `'route-metrics'`, `'distance-by-vehicle'`, `'time-analysis'`, `'zone-load-summary'`, `'zone-balance'` (later also `boundary-crossing-card`, `territory-flow-card`, `capacity-vs-demand-card`, `territory-day-heatmap-card`, helper `use-zone-crossings.ts`).
- `utils/settings.ts` report registry entries: `{id:'zone-load-summary', label:'Territory Load Summary', enabled:true, order:4}`, `{id:'zone-balance', label:'Territory Balance (Lorenz + Gini)', enabled:true, order:5}`.
- `use-zone-aggregates.ts`: `ZoneAggregate` with `stopLocations: Array<{jobId, location}>`; walks routes using `step.id`.
- `use-zone-drive-matrix.ts`: auto-fires when `mainTab === 'analytics'` and `requestId` set; per-zone call to NextBillion Distance Matrix; cache `cacheRef` keyed `${requestId}::${zoneId}::${sortedStopIds}`; in-flight dedupe via `inFlightRef` Set; `MAX_STOPS_PER_ZONE = 100` with uniform-stride sampling; averages non-diagonal `element.duration.value` to `avgMinutes`.
- `zone-balance-chart.tsx`: Lorenz + Gini, `WorkMetric = 'stops' | 'service'`; Gini `weighted += (2*(i+1) - n - 1) * v; return weighted / (n * sum)` over ascending-sorted values; bands: `<0.2` good, `<0.4` mild, `<0.6` warn, else bad. Recharts `ComposedChart/Area/Line/ReferenceLine`.
- Zone load table drive cell: `<CircularProgress size={12} thickness={5} sx={{color:'#1e55de'}}/>` while loading, formatted minutes when resolved, `!` on error, `—` for <2 stops. `NumericCell.value: ReactNode` to allow JSX.

### Import / data-mapper / preview tables
- `components/input/data-mapper/`: `data-mapper.tsx` (AI mapping apply paths), `data-mapper-table.tsx` (TableVirtuoso; delete/clone row; ID search), `data-mapper-cell.tsx` (zebra + highlight), `clustering-panel.tsx` (defaults), `servicenow-import-panel.tsx`, `dynamics-import-panel.tsx`, `sap-import-panel.tsx`, `import-method-icons.tsx`.
- `components/input/input-preview-page/`: `preview-table.tsx` (rewritten: `table-layout: fixed`, explicit width/minWidth/maxWidth per cell, 6px col-resize handle via pointermove, `DEFAULT_COL_WIDTH_PX=160, MIN=60, MAX=800, CHECKBOX_COL=56, EDIT_COL=44`, `onColumnWidthsCommit` fires once on pointer-up), `preview.tsx`, `job-filter-bar.tsx`, `vehicle-filter-bar.tsx`, `input-preview-page.tsx` (`normalizeInput`, `buildZones`), `address-autocomplete.tsx`.
- `components/input/preview-lasso.tsx`: `PreviewLassoEditOverlay` with `enableShapeDrag?: boolean` and an SVG `<polygon>` hit-shape.
- `components/input/geocode-preview/`: `geocode-preview-modal.tsx`, `geocode-preview-map.tsx`, `geoccode-preview-table.tsx` (sic, spelling in repo), `address-edit-cell.tsx`.
- `PreferencesInput` gained `columnWidths?: { job?, shipment?, vehicle?, depot?: Record<string, number> }` and reducer `setColumnWidths({entity, widths})`; widths are saved with preferences.

### i18n layout
- `apps/route-planner-v2/messages/{en,pt-BR,es-MX,fr-CA,pl-PL}.json`; `i18n/request.ts` holds `SUPPORTED_LOCALES = ['en','pt-BR','es-MX','fr-CA','pl-PL'] as const` and a `MESSAGES` map; `components/locale-switcher.tsx` has its own `LOCALES` const; `components/dayjs-locale-sync.tsx` (`import 'dayjs/locale/pl'`, `'pl-PL': 'pl'`); `job-filter-bar.tsx` has its own DAYJS_LOCALE map (`'fr-CA': 'fr-ca'`, `'pl-PL': 'pl'`); `components/dialogs/solution-redierct.tsx` (sic) maps DataGrid locales (`plPL` from `@mui/x-data-grid-pro/locales`).
- Shared lib `libs/route-planner-components` cannot call `useTranslations` because `route-planner-viewer` has no next-intl provider. The app wraps shared components instead: `components/input/preview-map/localized-input-tooltip.tsx` (inline styles mirror `.nb-popup` SCSS), rendered only when `popupType === 'input'`.

### Auth / demo gate
- `app/demo-login/page.tsx` (MUI form, `Suspense` wrapper), `app/api/demo-login/route.ts` (POST validates `DEMO_USER`/`DEMO_PASS`, cookie `rpv2_demo_auth`, 7-day TTL; DELETE clears), `middleware.ts` (`isDemoAuthExempt()` for `/demo-login`, `/api/demo-login`, OAuth callbacks, `/dev-login`; unauthenticated page requests redirect to `/demo-login?next=<original>`; API requests get 401 JSON). Modelled on the `poc_data/SCA/demo` and `GLWAS/demo` login screens with the same credentials (redacted here).
- Admin impersonation: `utils/impersonation.ts`, `context/impersonation-context.tsx`, `components/admin/impersonate-banner.tsx`, `hooks/use-route-planner-permissions.ts`.

### BFF / API routing overrides
- `/Users/[USER]/workspace/bff/src/common/services/api-gateway.service.ts` forces the `vrj` product to `https://api.nextbillion.io`; `bff/src/configuration.ts` defaults `routePlannerHost` to `api.nextbillion.io` always.
- Runtime SA for `bff-staging` needs `roles/storage.objectUser` on `[GCP_PROJECT]-ncc-config`.
- Map style: `https://api.nextbillion.io/tt/style/1/style/20.3.2-3?map=basic_main` via `sanitizeStyleSpec` (converts layer `metadata: "group:area"` strings to objects); `POI_ICON_WHITELIST = ['supermarket']`.

---

### Appendix 3 (full-length user messages: continuation summaries and long pastes)

Source: the full-length context-continuation summaries dated 2026-06-25, 07-06, 07-11, 07-14, 07-22, 07-23, 07-31, 08-27 plus the long pastes of 06-30 and 08-05. Everything below is the app `apps/route-planner-v2` inside the ncc Nx monorepo (Yarn 3 Berry, Next.js 14 App Router, `basePath: '/route-planner'`, so every URL needs the `/route-planner` prefix, for example `http://localhost:4200/route-planner/solutions/FEMSA1`).

### Standing safety rules carried verbatim in every summary (from CLAUDE.md / AGENTS.md)
- "Always branch from remote `main`: `git fetch origin && git checkout -b <branch> origin/main`. Do not branch from a stale local `main`."
- "Never commit, push, tag, or publish a release without explicit user approval."
- "Don't bypass hooks (`--no-verify`) without explicit user request."
- "This applies to all release/hotfix scripts too — they default to dry-run; only run with `--execute` after confirming with the user."
- Memory note on the user's email: use it only to identify the user (authorship, attribution, filtering their own work); never send it to an unrelated service, header, URL or payload unless explicitly asked.
- Branch drift case (2026-06-25): local `main` was 40 commits behind `origin/main`. The agent offered an AskUserQuestion choice; the user picked "local HEAD" to avoid a conflict cascade.

### Stack facts repeated across the summaries
- State: Rematch (`createModel`) for legacy "input" models (`models/input/input-core.ts`); Zustand for v3 solution UI: `useSolutionStore` (`_rawInput`, `_rawResponse`, `_rawRoutes`, `source: SolutionSource`), `useUIStore` (filters), `useRouteEditStore` (draft/past/input, edit actions), `useRouteSelectionStore` (`Set<string>` of selected vehicle ids).
- Map: deck.gl (`GeoJsonLayer`, `ScatterplotLayer`, `TextLayer`, `PathLayer`, `RestMarkerLayer`) over MapLibre via `react-map-gl` and a `BaseMap` wrapper; `supercluster` for step clustering.
- UI: MUI, MUI X `DateTimePicker` (AdapterDayjs), `DataGridPro`, MUI `Autocomplete` multi-select, Popover, Slider; `next-intl` `useTranslations` with five locales `en`, `es-MX`, `fr-CA`, `pl-PL`, `pt-BR` under `apps/route-planner-v2/messages/*.json`.
- Local dev server port 4200.
- Typecheck lesson: `nx typecheck route-planner-v2` background tasks repeatedly came back "killed" with empty output, and nx lint/show-project hung 25+ min (killed with `kill -9`). Working replacement: `npx tsc --noEmit -p apps/route-planner-v2/tsconfig.json` (cleanly completes; pre-existing unrelated errors exist in `components/solution/opt-result-panel/item-route.spec.tsx` and legacy v1/v2 paths and were ignored). On 2026-06-25 the nx daemon (PID idle since Sunday, shared with Cursor's `nxls` extension) was deliberately not killed; recommendation to the user: `yarn nx reset` and `NX_DAEMON=false yarn nx typecheck route-planner-v2`.

### Cloud Run / Secret Manager / Terraform layout
- Terraform dir `apps/route-planner-v2/infra/terraform/` with files: `apis.tf`, `artifact_registry.tf`, `cloud_run.tf`, `iam.tf`, `main.tf`, `outputs.tf`, `secrets.tf`, `service_account.tf`, `variables.tf`, `terraform.tfvars`, `terraform.tfstate` (State: **local**, README line 5). Dockerfile is `apps/route-planner-v2/Dockerfile.staging`.
- `secrets.tf` naming pattern: `secret_id = "${var.service_name}-${lower(replace(each.value, "_", "-"))}"`. So env var `DEMO_NCC_TOKEN` is stored in a Secret Manager secret named `route-planner-v2-staging-demo-ncc-token` (shown as `[REDACTED_SECRET]` in the transcript), NOT a secret literally called `DEMO_NCC_TOKEN`.
- `service_account.tf` grants `roles/secretmanager.secretAccessor` to the Cloud Run service account only on the terraform-created secret.
- Token path end to end: `apps/route-planner-v2/app/dev-login/route.ts` (lines ~82-86) reads `process.env.DEMO_NCC_TOKEN || process.env.NCC_TOKEN` and sets the `ncc_token` cookie (maxAge 7 days, `httpOnly: false`). Cloud Run env var `DEMO_NCC_TOKEN` is wired from Secret Manager by Terraform; `.env.local` only affects local runs.
- Deployed staging identities: `IAM_HOST=https://iam-stg.nextbillion.ai`, `IAM_CLIENT_ID=d9883f93-dcbc-44d5-ade8-2af69d29599d`. Prod IAM is `https://iam.nextbillion.ai` with client id `7a503418-532d-4f66-ad08-02cb5342e042`. Service region `us-central1`, service name `route-planner-v2-staging`, image repo `us-central1-docker.pkg.dev/<project>/route-planner-v2/route-planner-v2-staging:<TAG>`.
- `cloud_run.tf` additions made 2026-08 for the territory pipeline: `timeout = "900s"` and `resources { limits = { memory = "2Gi", cpu = "2" }, cpu_idle = false, startup_cpu_boost = true }`.

### Solution page (v3) file map
- `v3/features/solution/hooks/use-solution-data.ts`: central load hook; has `FIXTURES` map `FEMSA1` -> `/route-planner/data/femsa1_response.json` + `/route-planner/data/input_femsa1.json`, `FEMSA2` -> `femsa2_response.json` + `input_femsa2.json`; fixture branch checks the local override first (`loadLocalSolution(requestId)`), falls back to bundled JSON.
- `v3/stores/solution.store.ts`: `IMPORTED_REQUEST_ID = '_import'` sentinel; `saveLocalSolution(requestId, rawResponse, rawInput?)` writes localStorage keys `rp:local-solution:{id}` / `rp:local-input:{id}`; `updateLocalSolutionResult`, `loadLocalSolution`, `loadLocalInput`, `clearLocalSolution`; legacy `_import` keeps `rp:imported-solution` / `rp:imported-input`; `autoSave` early-returns `undefined` when `source === 'local'`.
- `v3/domain/types/optimization.ts`: `SolutionSource` changed from `'gcs' | 'db' | 'imported'` to `'gcs' | 'db' | 'local'`.
- `v3/stores/route-edit.store.ts` (apply dispatch around line 939), `v3/features/solution/components/solution-toolbar.tsx`, `result-panel.tsx`, `route-metrics-overlay.tsx`, `job-list.tsx`, `v3/features/solution/hooks/use-map-layers.ts`, `use-route-layers.ts`, `v3/stores/ui.store.ts`, `v3/domain/operations/recalculate-route.ts`, `step-operations.ts`, `v3/api/directions.api.ts`, `v3/api/types/optimization.types.ts` (`start_index: number` required in type, `end_index?: number` optional).
- Fixture data under `apps/route-planner-v2/public/data/`: `input_femsa1.json` (19,374 jobs, 6,362 unique locations, 953 zones), `femsa1_response.json` (renamed from `coca_cola_four_week_response.json`, with enriched descriptions), `input_femsa2.json`, `femsa2_response.json`, `vehicles_femsa.csv` (953 vehicle rows), plus one-off artifacts `cluster_request_femsa.json`, `cluster_result_femsa.json`. Source CSV was `data/jobs_femsa.csv`.

### Input / preferences layer
- `models/input/input-core.ts`: `PreferencesInput` now includes `grouping?: { order_grouping?: { grouping_diameter?: number } }` (meters, 0 disables), default `grouping: {order_grouping: {grouping_diameter: 0}}`, included in `SavedStateSnapshot` (`Pick<PreferencesInput, 'objective' | 'constraints' | 'grouping' | 'routing' ...>`).
- New preferences panel `components/input/input-panels/preferences/grouping-panel.tsx`; rendered in `input-preference.tsx` between `ConstraintsPanel` and `DepotPanel`.
- Optimization payload wiring in `components/input/input-preview-page/input-preview-page.tsx`: only send when > 0:
  ```ts
  const groupingDiameter = preferences.grouping?.order_grouping?.grouping_diameter
  if (groupingDiameter && groupingDiameter > 0) {
    options.grouping = { order_grouping: {grouping_diameter: groupingDiameter} }
  }
  ```
- Dirty-state comparison: `app/(input)/index-client.tsx` must include `grouping` in the `hasUnsavedChanges` snapshot (otherwise the Save indicator ignores the new setting).
- Preference persistence endpoints `/config/save` and `/config/get` (JSON blob in `payload.data`); `getPreferenceConfig` returns `ServerActionResponse<ConfigFileResponse>` where `ConfigFileResponse = ConfigResponse<string>`.
- API key header: `/common/api_keys` populates `currentSub.apiKeys` via `common-layout-rsc.tsx:30`; v2 selector `libs/common/src/lib/components/apikey-selector/apikey-selector-v2.tsx` (used by `nb-app-bar-v2.tsx`) reads `currentSub.apiKeys[].name` directly from the BFF; no localStorage involved (the v1 selector uses localStorage `custom_api_keys`).

### Territory planner architecture (added July 2026)
- New lib `libs/territory-planner/src/` copied from the standalone `femsa-pipeline` project: `config.js`, `geo.js`, `lp.js`, `parse.js`, `cluster.js`, `schedule.js`, `validate.js`, `boundaries.js`, plus new `run.js` (orchestrator `runPipeline(input, onLog, options)`; accepts `apiKey`, `selectedIds`, `overrides`), `matrix.js` (NB Distance Matrix wrapper `measureTerritoryCircuities()`), `reschedule.js`, `index.ts` (types `TerritoryPipelineResult`, `TerritoryPipelineOptions`, `TerritoryPipelineOverrides`, `TerritoryBoundaries`, `TerritoryRescheduleResult`), `project.json`. Alias in `tsconfig.base.json`: `"@ncc/territory-planner": ["libs/territory-planner/src/index.ts"]`. New deps in root `package.json`: `exceljs`, `highs` (WASM MILP), `d3-delaunay`, `polygon-clipping`.
- Pages: `app/territory-planner/page.tsx` (dynamic import, `ssr: false`), `layout.tsx` (MapProvider), `client.tsx` (phase machine), `parse-preview.ts`, `preview-table.tsx`, `territory-map.tsx`, `hull-boundaries.ts`, `date-filter-panel.tsx`, `types.ts`, `settings.ts`, `result-store.ts` (IndexedDB via Dexie).
- API routes (NDJSON streaming `{type: 'log'|'result'|'error'}` lines): `app/api/territory-planner/route.ts` (`runtime = 'nodejs'`, `maxDuration = 300`; multipart `file` + optional `selected` JSON array of matriculas + `overrides`; reads the `apikey` cookie for NB Distance Matrix), `app/api/territory-planner/route/route.ts` (single-rep TSP via NB Optimization v2), `app/api/territory-planner/reschedule/route.ts` (multipart `file`, `assignments` JSON matricula->terr, `R`, `overrides`, `allowOverCap`).
- Phase machine in `client.tsx`:
  ```ts
  type Phase =
    | {kind: 'idle'}
    | {kind: 'parsing'; fileName: string}
    | {kind: 'preview'; fileName: string; file: File; rows: PreviewRow[]; error?: string}
    | {kind: 'building'; fileName: string; file: File; rows: PreviewRow[]}
    | {kind: 'done'; fileName: string; file: File; rows: PreviewRow[]; result: TerritoryResult}
    | {kind: 'error'; fileName: string; message: string}
  ```
  `previewState: {search, tipoFilter, selection, settings}` is lifted so filters survive preview -> building -> done -> preview; `backToPreview` returns from the map ("Previous" button) keeping file/rows/state; pipeline errors route back to preview with an error banner.
- Menu entries: `components/common/page-head.tsx` (Territory Planning item between Saved Solutions and Settings, gated by `canPlanRoutes`) and `components/common/navigation-menu.tsx`; i18n namespace `territoryPlanner` (42 keys) + `header.territoryPlanning`.
- `next.config.js` additions: `experimental.serverActions.bodySizeLimit: '10mb'` and `experimental.serverComponentsExternalPackages: ['exceljs','highs','d3-delaunay','polygon-clipping','@ncc/territory-planner']`.
- Settings tunables (`settings.ts`): `SETTINGS_DEFAULTS = {dailyCapH: 7.42, weeklyCapH: 37.08, utilTarget: 0.93, speedKmh: 25}` held as strings in `TerritorySettings`; `EMPTY_SETTINGS`; `serializeSettings` converts to JSON. Split out of `client.tsx` to avoid a circular import with `preview-table.tsx`.
- Overrides threading: `cluster.js` `buildTerritories` and `recomputeTravel` accept `overrides` (`dailyCapH`, `weeklyCapH`, `utilTarget`, `speedKmh`):
  ```js
  const {apiKey, overrides = {}} = options;
  const dailyCap = overrides.dailyCapH ?? CFG.DAILY_CAP_H;
  const weeklyCap = overrides.weeklyCapH ?? CFG.WEEKLY_CAP_H;
  const utilTarget = overrides.utilTarget ?? CFG.UTIL_TARGET;
  const speedKmh = overrides.speedKmh ?? CFG.SPEED_KMH;
  ```
  `geo.js` `travelPerVisitH(pts, weeklyVisits, circuity, speedKmh)`; `schedule.js` `scheduleAll(pos, R, log, {dailyCapH})` / `scheduleTerritory(pos, terr, log, dailyCap)`; `validate.js` `validate(pos, R, slotLoads, {dailyCapH, allowOverCap})`.
- Rep count: territories map 1:1 to reps ("27 Territories" = 27 rep assignments).
- Boundary modes: server Voronoi + per-territory alpha-shape (`boundaries.js`, uses `await import('d3-delaunay')`), and client-side convex hull (`hull-boundaries.ts`, Andrew's monotone chain, returned as the same MultiPolygon shape) switched with a `BoundaryToggle` (`boundaryMode: 'voronoi' | 'hull'`).
- Edit mode (August): `@nebula.gl/layers` `EditableGeoJsonLayer` + `@nebula.gl/edit-modes` `ModifyMode`; `@turf/turf` `booleanPointInPolygon, point as turfPoint, polygon as turfPolygon`; `useMap()` from `react-map-gl` to reach maplibre; state overlay `effectivePos = stagedPos ?? result.pos`; `applyEdit()` does point-in-polygon reassignment with nearest-other-centroid fallback for displaced POS.

## Setup / build / dependency lessons (exact errors + fixes)

### Transcript part A (chunks 1-3)

### 1. `yarn install` appears hung (Nx postinstall → Nx Cloud)
**Request:** "need to create a standalone build of the @apps/route-planner-v2 application to run locally."
Plan proposed: `yarn install` at workspace root → `yarn dotenvx run --env-file=.env.test -- nx build route-planner-v2` → `cd dist/apps/route-planner-v2 && yarn install && yarn start`. (Assistant's own background `yarn install` was slow; user said "kill it and I will run install from my own shell".)

Symptom: install reaches Yarn's Link step and goes silent for minutes (user pasted `unix-dgram` node-gyp warnings such as `-Wcast-function-type-mismatch`, `3 warnings generated` — these are harmless v8 API drift, NOT the failure).

Triage steps that worked (reusable diagnostics):
```bash
CYPRESS_INSTALL_BINARY=0 yarn install --inline-builds     # skip ~100MB Cypress download, show each postinstall's output
ps -ef | grep -E "node-gyp|sentry-cli|swc|sharp|parcel|oxide|prebuild" | grep -v grep
lsof -p $(pgrep -f "yarn install" | head -1) 2>/dev/null | grep -E "TCP|REG" | head -30
tail -100 <yarn xfs tmp dir>/build.log        # was EMPTY → active postinstall produced zero output
pgrep -lP <yarn pid>
ps -o pid,stat,etime,command -p $(pgrep -P <yarn pid> | tr '\n' ',' | sed 's/,$//')
lsof -a -p <child pid> -d cwd                 # → .../node_modules/nx
lsof -p <child pid> | grep -iE "TCP|sock"     # → ESTABLISHED https to a googleusercontent.com IP (Nx Cloud)
```
Finding: child `node ./bin/post-install` (state `S+`, 5m+) with cwd `node_modules/nx` and a stuck HTTPS socket → **nx@19.6.5's postinstall hangs dialing Nx Cloud** (`nx.json` has `nxCloudAccessToken`).

What did NOT work:
- `NX_DAEMON=false NX_NO_CLOUD=true NX_CLOUD_AUTH_TOKEN= NX_VERIFY_LOGS=false CYPRESS_INSTALL_BINARY=0 yarn install --inline-builds` — nx reads the token straight from `nx.json`, ignores env.
- `NX_CLOUD_ACCESS_TOKEN= NX_NO_CLOUD=true NX_DAEMON=false NX_SKIP_NX_CACHE_INSTALL=true ...` — same hang.
- `kill -9 $(pgrep -f "node ./bin/post-install" | head -1)` — Yarn Berry then parks itself forever (`S+`, no children, no sockets; leaked stdio pipes). Must kill yarn too (`kill -9 $(pgrep -f "yarn install")`).

**Fix that worked (Option B)** — tell Yarn not to run nx's build script. Added to root `package.json` (local-only, don't commit; revert with `git checkout package.json`):
```json
"dependenciesMeta": {
  "nx@19.6.5": { "built": false }
}
```
then `kill -9 $(pgrep -f "yarn install")` and `CYPRESS_INSTALL_BINARY=0 yarn install --inline-builds`. nx bin still works; the postinstall only sets up the daemon.
Alternative considered: temporarily remove `nxCloudAccessToken` from `nx.json` for the install.

Expected slow-but-OK postinstalls on a fresh cache: `@swc/core`, `@parcel/watcher`, `@tailwindcss/oxide`, `sharp` (largest), `@sentry/cli`, `nice-napi`, `unix-dgram` (node-gyp), `core-js`, `maplibre-gl`, `nx`. Peer-dependency noise (`YN0002 ... doesn't provide react (pa39c6), requested by react-confetti`, `@deck.gl/geo-layers ... doesn't provide @loaders.gl/gltf`) is normal.
Note: a later dependency addition (`next-intl`) required another `yarn install`; user re-ran with `NX_DAEMON=false NX_NO_CLOUD=true NX_CLOUD_AUTH_TOKEN= CYPRESS_INSTALL_BINARY=0 yarn install --inline-builds` (fallback `pkill -9 -f "node ./bin/post-install"`). `ls node_modules/next-intl` confirms install landed.

### 2. `nx build route-planner-v2` deadlocks silently (nx native module)
`NX_DAEMON=false NX_NO_CLOUD=true yarn nx build route-planner-v2` printed nothing for minutes. Diagnosis:
- `top -l 1 -o cpu -n 5` showed no node/nx CPU; yarn wrapper alive, no `dist` output.
- First hang: three `plugin-worker` processes idle on unix sockets (`Ss`), main nx waiting → project-graph IPC deadlock.
- Tried (A): `pkill -9 -f "nx build route-planner-v2"; pkill -9 -f "nx/src/project-graph/plugins/isolation/plugin-worker"; rm -rf node_modules/.cache/nx .nx/cache .nx/workspace-data; NX_DAEMON=false NX_ISOLATE_PLUGINS=false NX_NO_CLOUD=true NX_SKIP_NX_CACHE=true NX_VERBOSE_LOGGING=true yarn nx build route-planner-v2` → still silent, no children of yarn pid; `sample <pid>` stack showed the native module `19.6.5-nx.darwin-arm64.node` with idle tokio workers parked on `kevent`. Conclusion: **nx 19.6.5 on darwin-arm64 / Node 20.19 deadlocks in its Rust native layer; cannot be coaxed out with env flags.**
- **Escape hatch (B) that worked:** bypass nx and run Next directly from the app dir:
```bash
pkill -9 -f "nx build route-planner-v2"; pkill -9 -f "plugin-worker" 2>/dev/null
cd apps/route-planner-v2
yarn next build --no-lint      # writes ./.next (NOT dist/)
yarn next start -p <port>
```
`withNx` in `next.config.js` did not re-enter the broken native module (it just mutates webpack config).

### 3. `next build` fails on lint errors → use `--no-lint`
Output: `warning No cached ProjectGraph is available. The rule will be skipped. ... @nx/enforce-module-boundaries` (harmless) followed by Next's built-in lint pass failing on accumulated `@typescript-eslint/ban-ts-comment`, `react/no-unescaped-entities`, `prefer-const`, `react/jsx-key`, `no-unsafe-optional-chaining`. Normal `nx build` skips this; standalone `next build` does not. Fix: `yarn next build --no-lint` (still type-checks). Fallbacks: `NEXT_TELEMETRY_DISABLED=1`, or `typescript: { ignoreBuildErrors: true }` in `next.config.js`.
Related: `npx tsc --noEmit --project tsconfig.json` showed pre-existing errors in spec files (`components/solution/opt-result-panel/item-route.spec.tsx(21,25): error TS2353: Object literal may only specify known properties, and 'service' does not exist in type 'StepWithLoad'`) — unrelated to feature work. NB: dev (SWC) does not typecheck, so TS errors don't cause runtime 404s.

### 4. `next start` → `TypeError: fetch failed ... ENOTFOUND bff`
Symptom (`.next/server/chunks/164.js`, undici): server-side fetch to `http://bff/...`. `[MIDDLEWARE] GET / - ENV: TEST` proved env vars were reaching runtime, so the cause was the hardcoded host swap in `libs/common/src/lib/utils/fetcher-rsc.ts:8-16` (see Architecture). **Fix: run with `ENV=preview`** (also keeps `assetPrefix` local). Full working local-against-staging block:
```bash
ENV=preview NEXT_PUBLIC_ENV=preview \
HOST=http://localhost:3000 \
BASE=/route-planner NEXT_PUBLIC_BASE=/route-planner \
BFF_HOST=https://bff-staging.nextbillion.ai \
NEXT_PUBLIC_BFF_HOST=https://bff-staging.nextbillion.ai \
IAM_HOST=https://iam-stg.nextbillion.ai \
IAM_CLIENT_ID=adac0e93-69ce-4f3d-936d-87867a04f0ce \
yarn next start -p 3000
```
Also: `.env.local` originally had duplicate `NEXT_PUBLIC_BFF_HOST` lines (later line wins), `HOST=http://localhost:4200` (used for IAM redirect callbacks → run on the matching port), and `NODE_ENV=production` (assistant recommended removing it — let Next set it).

### 5. IAM login redirects to `https://console.nextbillion.ai` instead of localhost
User: "when launching http://localhost:3000/route-planner I get sent to IAM login screen. I use my Google credentials and then after authentication it refers me to https://console.nextbillion.ai and not localhost". Cause: prod IAM client `7a503418-...` has a hard-coded redirect; plus empty `BASE`. Fix: use the preview client `adac0e93-...` on `iam-stg.nextbillion.ai`, set `BASE=/route-planner`, and flip BFF to `bff-staging` (tokens from iam-stg aren't valid on prod BFF).

### 6. CORS: `Access-Control-Allow-Origin ... must not be the wildcard '*' when the request's credentials mode is 'include'`
Client calls to `https://bff.nextbillion.ai/ai/fields/auto-mapping?apiKey=...` from `http://localhost:3000` blocked. BFF whitelists only `*.nextbillion.ai`/`*.a.run.app` — **not fixable client-side; switching prod→staging BFF does not help**. Three paths offered: (A) run BFF locally (team's documented setup; chosen), (B) `yarn preview:deploy route-planner-v2 <suffix>` → Cloud Run `*.a.run.app` URL (teardown: `yarn preview:teardown route-planner-v2 <suffix>`), (C) read-only UI shell. After the local BFF was up and CORS error recurred for port 3001, fix was to use NCC on **port 4200** (matches the BFF allowlist and `.env`'s `HOST`); alternative: add `'http://localhost:3001'` to `allowedOrigins` in `bff/src/main.ts:26-31` and restart BFF.

### 7. Client bundle still hits prod BFF after "restart with new env" (`NEXT_PUBLIC_*` are build-time)
User: "still hitting bff.nextbillion.ai ... and not my localhost bff on port 3000". Server-side fetches hit localhost (runtime `BFF_HOST`) while client-side still hit prod because `NEXT_PUBLIC_BFF_HOST` was inlined into client chunks during the earlier build. Verification recipe:
```bash
rm -rf .next
grep BFF_HOST .env.local
ENV=preview NEXT_PUBLIC_ENV=preview HOST=http://localhost:4200 BASE=/route-planner NEXT_PUBLIC_BASE=/route-planner \
 BFF_HOST=http://localhost:3000 NEXT_PUBLIC_BFF_HOST=http://localhost:3000 \
 IAM_HOST=https://iam-stg.nextbillion.ai IAM_CLIENT_ID=adac0e93-69ce-4f3d-936d-87867a04f0ce yarn next build --no-lint
grep -l "localhost:3000" .next/static/chunks/*.js | head -3     # expect files
grep -l "bff.nextbillion.ai" .next/static/chunks/*.js | head -3 # expect none
```
The assistant discovered the `.next/` dir was still the first (08:52) build — the "rebuild" hadn't actually produced new output (3 chunks had `bff.nextbillion.ai`, 0 had `localhost:3000`). Then hard-refresh browser (Cmd-Shift-R) for new chunk hashes.

### 8. Local BFF errors
- `[Nest] ... ERROR [ExceptionsHandler] <email> does not have storage.objects.get access to the Google Cloud Storage object. Permission 'storage.objects.get' denied on resource (or it may not exist).` while `ApiGatewayService` downloads `gs://waymer/apikeys_stg/orgs_v2` → **Application Default Credentials are the wrong account.** `gcloud auth login` and `gcloud auth application-default login` are separate caches. Fix: `gcloud auth application-default login` (pick the work account), verify with `curl -s "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=$(gcloud auth application-default print-access-token)" | grep email`, **restart BFF** (ADC and env vars are read at startup; Nest log prefix `[Nest] 12144` shows the stale PID). Or `export GOOGLE_APPLICATION_CREDENTIALS=/abs/path/sa-key.json` (takes precedence; get from teammate per `docs/01 - dev setup.md`).
- `{"statusCode":500,"message":"OpenAI API key is not configured"}` from `/ai/fields/auto-mapping` → add `OPENAI_API_KEY=...` to `~/workspace/bff/.env.local` (BFF loads it), restart BFF.
- `sending request to http://localhost:8080/v1/organizations.code.map` ERROR → Waymor not running; NCC catches it (`[CommonLayoutRsc] Failed to load org data`), not the cause of routing 404s.

### 9. i18n wiring gotchas
- Added `"next-intl": "^3.26.0"` to root `package.json` → needs another `yarn install`.
- **TS error:** `Record<string, unknown>` typing in `i18n/request.ts` doesn't satisfy next-intl's `AbstractIntlMessages` — fixed by correcting the type; also switched dynamic ``await import(`../messages/${locale}.json`)`` to explicit static imports (webpack static-analysis safety, matches next-intl docs).
- **Everything 404s under `/route-planner` after adding next-intl** (even `/route-planner/saved`; `http://localhost:4200/saved` worked and `/route-planner/` didn't): `createNextIntlPlugin` placed outermost **clobbered `basePath`**. Fix: keep `withNx` outermost → `withNx(withNextIntl(configWithSentry))`. Restart dev server after `next.config.js` change (no HMR).
- `ENV: TEST` showing instead of PREVIEW: user's multi-line inline env lost a trailing `\` after `BASE=/route-planner`, so `ENV=preview` never reached yarn and `.env.local` (still `ENV=test`) won. Remedy: make `.env.local` coherent so bare `yarn next dev -p 4200` works:
```env
ENV=preview
NEXT_PUBLIC_ENV=preview
HOST=http://localhost:4200
BASE=/route-planner
NEXT_PUBLIC_BASE=/route-planner
BFF_HOST=http://localhost:3000
NEXT_PUBLIC_BFF_HOST=http://localhost:3000
IAM_HOST=https://iam-stg.nextbillion.ai
IAM_CLIENT_ID=adac0e93-69ce-4f3d-936d-87867a04f0ce
NX_NO_CLOUD=true
```
- Wrong runtime mode: user ran `next start` with old build while editing → none of the edits appeared (dev server must be `next dev`).
- **File watcher not picking up edits on macOS monorepo** (touching a file produced no `✓ Compiled`): start dev with `WATCHPACK_POLLING=true yarn next dev -p 4200`. (Alternative: `--turbo`; check for symlinks with `ls -la`.) Note: in this case the real culprit for "LocaleSwitcher not in DOM" was editing the wrong file (see Debugging), but polling was kept on for the rest of the session.
- `Warning: Extra attributes from the server: cz-shortcut-listen` is a browser-extension (ColorZilla) hydration warning — harmless.

### 10. Cloud Run BFF returns Google placeholder
After the user moved BFF to Cloud Run (`https://bff-staging-<hash>-uc.a.run.app`), app errored at `fetcher-rsc.ts:72` (JSON parse of HTML). `curl` on `/` and `/common/api_keys` returned Google's **"Congratulations | Cloud Run"** placeholder = service exists with no real container/revision serving traffic (placeholder 200 HTML passes the status check, then `response.json()` blows up). Fix: deploy real BFF; find right URL with `gcloud config set project <staging-project>; gcloud run services list`. After deploying: real Express server returned `403 Forbidden` on `/common/api_keys?apiKey=opensesame` (`opensesame` = anonymous placeholder key → JWT/cookie never set). If Cloud Run requires IAM, `gcloud auth print-identity-token`; most staging BFFs use `--allow-unauthenticated` + app-level JWT.

### 11. Demo auto-login: wrong IAM path, wrong environment
`/dev-login` initially POSTed `${IAM_HOST}/login` (HTML page of `iam-frontend`). Correct REST endpoint **`${IAM_HOST}/api/login`**. Prod IAM then returned `{"code":400,"msg":"account not found","errCode":"errLoginFailure"}`; iam-stg also returned `{"error":"IAM /login did not return idToken","email":"<redacted>","iamHost":"https://iam-stg.nextbillion.ai","iamResponse":{"code":400,"msg":"account not found","errCode":"errLoginFailure"}}` → the demo user isn't provisioned in either IAM. Options given: create it via iam-frontend signup (`apps/iam-frontend/actions/common.ts`) then add to org `nbai`; use own iam-stg account via `.env.local` `DEV_AUTO_LOGIN_EMAIL/PASSWORD`; or use a known staging test account. Working `.env.local` for staging IAM + Cloud Run BFF:
```env
ENV=test
HOST=http://localhost:4200
NEXT_PUBLIC_ENV=test
BFF_HOST=https://bff-staging-<hash>-uc.a.run.app
NEXT_PUBLIC_BFF_HOST=https://bff-staging-<hash>-uc.a.run.app
IAM_HOST=https://iam-stg.nextbillion.ai
IAM_CLIENT_ID=d9883f93-dcbc-44d5-ade8-2af69d29599d
NX_NO_CLOUD=true
```
(drop `NODE_ENV=production`). Clear cookie `ncc_token` on localhost after switching IAM.

### 12. "how to start route-planner-v2" (final working recipe, 2026-05-29)
```bash
cd apps/route-planner-v2
WATCHPACK_POLLING=true yarn next dev -p 4200
```
Port 4200 for BFF CORS; polling for watcher; `ENV=preview` (via `.env.preview`/inline or `dotenvx run --env-file=.env.preview --`) to avoid `ENOTFOUND bff`; BFF on `:3000` with `OPENAI_API_KEY` + DB tunnel; preview IAM client. `nx serve route-planner-v2` is canonical but loses the polling env.

---

### Transcript part B (chunks 4-6)

### IAM-bypass attempts for demo (user: "is there a way to bypass IAM all together for demo")
Three strategies offered: A full mock (hardcoded context, no BFF), B mock identity + real BFF with a real nbai key, C local stub Express. User chose **B**: added `DEMO_MODE=true` short-circuit in `CommonLayoutRsc`, gated `/dev-login` middleware redirect on `DEMO_MODE !== 'true'`, `.env.local` got `DEMO_MODE, DEMO_API_KEY, DEMO_API_KEY_NAME=demo, DEMO_ORG_CODE=nbai, DEMO_ORG_NAME=NextBillion.AI`; `/dev-login` made a no-op under DEMO_MODE.
- `/dev-login` direct hit error: `{"error":"IAM /login did not return idToken","email":"[EMAIL]","iamHost":"https://iam-stg.nextbillion.ai","iamResponse":{"code":400,"msg":"account not found","errCode":"errLoginFailure"}}` → the user wasn't provisioned in iam-stg.
- Generate Route failure: `⨯ Error: Forbidden at _saveConfig (./actions/server/configure.ts:69:19)` (`throw new Error(error.statusText)` when error is a `Response`). Cause: BFF rejects with 403 on `/config/save` regardless of key. User insisted "the key that I'm providing in the .env file is a valid API key" → probe showed **identical NestJS 403 for `/config/save` and `/common/api_keys`** → the key isn't the problem; BFF is the IAM gate.
- Four real options given: (1) real JWT in `.env.local` as `DEMO_NCC_TOKEN` injected as cookie by `/dev-login`; (2) bypass BFF and hit api.nextbillion.io directly; (3) run BFF locally with `NODE_ENV=development` (AuthGuard mock user); (4) get the email provisioned in iam-stg. **User chose option 1.** Implementation: revert DEMO_MODE branch in `CommonLayoutRsc`; `/dev-login` reads `DEMO_NCC_TOKEN` (or `NCC_TOKEN`) from env and drops it in `ncc_token` cookie, bounces to `?next=`, falls back to IAM `/api/login` only if no env token; middleware redirects to `/dev-login` whenever the cookie is missing (TEST mode). Decoded JWT payload: `mail`, `org: nbai`, `iss: iam-stg.nextbillion.ai`, `exp` ~2026-06-16.
- Token rotation procedure: log in once at `iam-stg.nextbillion.ai`, copy `ncc_token` cookie value, paste into `DEMO_NCC_TOKEN` in `.env.local`, restart dev server.
- `/dev-login` cookie gotcha: originally set `Domain=.localhost` which Chrome can reject silently; domain removed (Cloud Run requires exact host binding; verify with `grep "domain" apps/route-planner-v2/app/dev-login/route.ts`). Cookie is `httpOnly: false` so `js-cookie` can read it.
- Env-var change requires **restarting `next dev`** ("Next caches `.env*` reads at startup").

### BFF 403 diagnosis and the audience fix
Key diagnostic: BFF returned the **identical 403 for no auth header, a valid JWT, and a garbage string**; `/health` returned NestJS `Cannot GET /health` (app up, routing). Root cause: AuthGuard `audience` check vs. JWT `aud` (`d9883f93-…`) — staging BFF `iamClientId` secret had a different value. User: "option 1 - I am in control of the BFF deployment". Fix (per `infra/terraform/README.md`):
```bash
echo -n "<jwt aud / client id>" | gcloud secrets versions add bff-staging-iam-client-id --data-file=-
gcloud secrets versions access latest --secret=bff-staging-iam-server
echo -n "https://iam-stg.nextbillion.ai" | gcloud secrets versions add bff-staging-iam-server --data-file=-
gcloud run services update bff-staging --region=us-central1 --update-secrets=IAM_CLIENT_ID=bff-staging-iam-client-id:latest
```
Re-pinning to `:latest` is treated as a config change → new revision (~30s); "adding a new secret version is picked up on the next revision." Verify: `curl -sS -i 'https://bff-staging-…/common/api_keys' -H 'Authorization: Bearer <token>'` → 200. If still 403: `gcloud run services logs read bff-staging --region=us-central1 --limit=20` and look for `JWT verification failed` (audience / signature-JWKS / expiry).

### Progress 403 → 500: GCS access to org config
After redeploy: 500 from `getApiKeys`. Log:
```
[ApiGatewayService] Downloading nbai api-key configuration file from gs://waymer/apikeys_stg/orgs_v2.
Error: [EMAIL] does not have storage.objects.get access to the Google Cloud Storage object.
```
BFF runtime SA in the demo project had no access to the `waymer` bucket (different GCP project). Options: grant `storage.objectViewer` on `gs://waymer` (needs owner in that project) or copy the single needed file. User chose **option 2 (copy)**. File needed is only `gs://waymer/apikeys_stg/orgs_v2/nbai.json`. Steps given:
```bash
gcloud auth login
gsutil cp gs://waymer/apikeys_stg/orgs_v2/nbai.json /tmp/nbai.json
gsutil mb -p [GCP_PROJECT] -l us-central1 gs://[GCP_PROJECT]-bff-config
gsutil cp /tmp/nbai.json gs://[GCP_PROJECT]-bff-config/apikeys/orgs_v2/nbai.json
gsutil iam ch serviceAccount:<bff runtime SA>:objectViewer gs://[GCP_PROJECT]-bff-config
gcloud run services update bff-staging --region=us-central1 --update-env-vars=CONFIG_PATH=[GCP_PROJECT]-bff-config/apikeys/orgs_v2
```
(User's `ls /tmp/nbai.json` initially returned `No such file or directory`, i.e. step 1 hadn't been done.) Result after step 5: 200 with 17+ API keys, subscriptions, SKU catalog incl. `ncc-route-planner-next`. Heads-up: `MAAAS_URL` secret (`bff-staging-maaas-url`) may point at an unreachable service → later 500 on `/optimization`. Cloud Run picks up IAM changes immediately, no redeploy.

### Second bucket: config save
`⨯ Error: [EMAIL] does not have storage.objects.create access to the Google CloudStorage object. Permission 'storage.objects.create' denied on resource (or it may not exist). at _saveConfig (./actions/server/configure.ts:72:19)`. Cause: hardcoded `nb-ncc` bucket. User request: "change to have BFF read/write the nb-ncc bucket in a new bucket that we create in the [GCP_PROJECT] project". Solution: make bucket name configurable (`NCC_CONFIG_BUCKET`, default `nb-ncc` so prod unaffected), then:
```bash
gsutil mb -p [GCP_PROJECT] -l us-central1 gs://[GCP_PROJECT]-ncc-config
gsutil iam ch serviceAccount:<bff SA>:objectAdmin gs://[GCP_PROJECT]-ncc-config
cd bff && yarn build
gcloud auth configure-docker us-central1-docker.pkg.dev
TAG=$(git rev-parse --short HEAD)
IMAGE=us-central1-docker.pkg.dev/[GCP_PROJECT]/bff/bff-staging:$TAG
docker build --platform linux/amd64 -f Dockerfile.staging -t $IMAGE .
docker push $IMAGE
gcloud run services update bff-staging --region=us-central1 --image=$IMAGE --update-env-vars=NCC_CONFIG_BUCKET=[GCP_PROJECT]-ncc-config
```
Optional migration of old profiles: `gsutil rsync gs://nb-ncc/config_stg/ gs://[GCP_PROJECT]-ncc-config/config_stg/`. Later, rename/delete needed a stronger role; the exact command that worked (user-supplied):
```bash
gcloud storage buckets add-iam-policy-binding gs://[GCP_PROJECT]-ncc-config \
  --member="serviceAccount:<bff runtime SA>" \
  --role="roles/storage.objectUser"
```
(`objectUser` includes `storage.objects.delete`; assistant saved this as a project memory.)

### Recurring regression: env vars wiped / source change not deployed
- After a later `terraform apply` for the CORS change, `/common/api_keys` 500'd again: terraform replaced env vars with only what's in `cloud_run.tf`, so manually-set `CONFIG_PATH` was lost → BFF fell back to `waymer/...`. Lesson: **anything set via `gcloud run services update --update-env-vars` is not preserved by terraform apply.** Verify with `gcloud run services describe bff-staging --region=us-central1 --format='value(spec.template.spec.containers[0].env)' | tr ',' '\n'` or JSON: `--format=json | jq '.spec.template.spec.containers[0].env[] | select(.name | test("BUCKET|CONFIG_PATH"))'` (gcloud text output can be misleading — e.g. `ENV` looked empty but JSON showed `"test"`).
- Another cause: `nccConfigBucket` source change was **uncommitted**; the image tagged `$(git rev-parse --short HEAD)` was built from HEAD-based tag but redeploys shipped older code. Logs still said `gs://nb-ncc/...` with error `Failed to initialize input core: Error: [EMAIL] does not have storage.objects.list access to the Google Cloud Storage bucket. Permission 'storage.objects.list' denied...`. Fix: build a distinguishable tag (`$(git rev-parse --short HEAD)-bucket`), push, `terraform apply -var="image_tag=$TAG"`, and set env var. (The deployed tag later seen: `468f8c9-bucket`.)
- Durable fix (user said "make changes to apps/route-planner-v2/infra/terraform/terraform.tfvars" → assistant pointed out that's the frontend tfvars; user clarified "`~/workspace/bff/infra/terraform/terraform.tfvars` is the correct file"): in BFF terraform added `config_path` variable in `variables.tf`, two plain `env` blocks in `cloud_run.tf` (`NCC_CONFIG_BUCKET = var.ncc_config_bucket`, `CONFIG_PATH = var.config_path`), values in `terraform.tfvars` and commented examples in `terraform.tfvars.example`. **First value was wrong**: set `[GCP_PROJECT]-bff-config/apikeys_stg/orgs_v2`, but the actual bucket path is `apikeys/orgs_v2/` (user screenshot) → corrected to `[GCP_PROJECT]-bff-config/apikeys/orgs_v2`. Terraform IAM binding in `iam.tf` only covers `ncc_config_bucket`; access to `bff-config` bucket was granted manually (offered to codify with a second `google_storage_bucket_iam_member`).

### Terraform clobbering the deployed BFF image
Symptom: app init error `Error: Unexpected token '<', "<!doctype "... is not valid JSON` at `fetcher-rsc.ts (72:13) @ async f` and curl showed HTML "Congratulations | Cloud Run" placeholder. Cause: `terraform apply` with `image_tag = ""` (default in `variables.tf`, unset in tfvars) rolled the service back to `us-docker.pkg.dev/cloudrun/container/hello`. Recovery:
```bash
gcloud artifacts docker images list us-central1-docker.pkg.dev/[GCP_PROJECT]/bff/bff-staging --include-tags --sort-by=~UPDATE_TIME --limit=5
gcloud run deploy bff-staging --region us-central1 --project [GCP_PROJECT] --image us-central1-docker.pkg.dev/[GCP_PROJECT]/bff/bff-staging:<tag>
```
Durable: add a terraform `lifecycle { ignore_changes = [...image...] }` on the Cloud Run container so terraform owns infra/env/IAM but not the image ("CI owns deploys, terraform owns infra"). Also: if no tags, BFF was deployed from a different registry (check `.github/workflows/`).
- Failed hardening attempt (reverted): making `fetcher-rsc` treat empty 2xx body as `null` only moved the crash to `common-layout-rsc.tsx:62` (`config.subscriptions` deref on null). Lesson: don't mask upstream failures in the shared fetcher; fix the root cause.
- Aside: a Sentry/OpenTelemetry `require-in-the-middle` "Import trace for requested module" warning appeared in Next output (unrelated noise).

### Stale org config after GCS update
User copied a new `nbai.json` (`gsutil cp ./nbai.json gs://[GCP_PROJECT]-bff-config/apikeys/orgs_v2/nbai.json`, 40.7 KiB) but UI list didn't change. Cause: BFF per-instance cache (`configMap`) refreshed only by 15-min cron or restart. Cache-bust: `gcloud run services update bff-staging --region us-central1 --project [GCP_PROJECT] --update-labels=cache-bust=$(date +%s)` (harmless label change forces a new revision); also hard-refresh browser / restart `nx serve`. Proposed (not done): `/common/api_keys/refresh` endpoint calling `apiGatewayService.refreshConfiguration()`.

### Cloud Run deployment of route-planner-v2 (user: "setup for deployment to GCP cloud run using terraform")
- App changes: `next.config.js` `output: 'standalone'` + `outputFileTracingRoot` (monorepo root, so shared `@ncc/*` libs are traced); `Dockerfile.staging`.
- First-run sequence (README):
```bash
cd apps/route-planner-v2/infra/terraform
cp terraform.tfvars.example terraform.tfvars
terraform init && terraform apply        # bootstrap with placeholder image
echo -n "<demo JWT>" | gcloud secrets versions add <demo-ncc-token-secret> --data-file=-
cd ../../../..
TAG=$(git rev-parse --short HEAD)
docker build --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_BFF_HOST=https://bff-staging-[GCP_PROJECT_NUMBER].us-central1.run.app \
  --build-arg NEXT_PUBLIC_IAM_HOST=https://iam-stg.nextbillion.ai \
  --build-arg NEXT_PUBLIC_IAM_CLIENT_ID=<staging client id> \
  -f apps/route-planner-v2/Dockerfile.staging \
  -t us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging:$TAG .
docker push ...:$TAG
cd apps/route-planner-v2/infra/terraform && terraform apply -var="image_tag=$TAG"
```
- Terraform error: GCP service-account IDs max **30 chars**; `route-planner-v2-staging-runtime` is 32 → shortened suffix. Re-run apply: 6 resources (AR repo, SA, secret + placeholder `REPLACE_ME` version, secretAccessor binding, Cloud Run service on `hello` image).
- Force a Cloud Run revision to pick up a new secret version without rebuilding: `gcloud run services update route-planner-v2-staging --update-secrets=DEMO_NCC_TOKEN=<secret>:latest`. Demo JWT lifetime 7–14 days.
- `HOST` env var empty in `cloud_run.tf` (service URL unknown before first apply); set later with `gcloud run services update ... --update-env-vars=HOST=<url>` if needed.
- Public URL auto-logs in anyone as the demo user (intended, flag when sharing).
- **CORS**: deployed frontend URL (`https://route-planner-v2-staging-…run.app`) not in BFF allowlist → added regex `route-planner-v2-*.run.app` in `bff/src/main.ts` and redeployed BFF. Verify: `curl -sS -i -X OPTIONS '<bff>/common/api_keys' -H 'Origin: https://route-planner-v2-staging-…run.app' -H 'Access-Control-Request-Method: GET' -H 'Access-Control-Request-Headers: authorization' | head -10` → `access-control-allow-origin: <origin>`.

### The "tons of 404s on every chunk" saga (standalone + Nx distDir)
Initial symptom: 500 on document and 404 on all `_next/static` chunks (the 500 was actually BFF `/common/api_keys` failing — see above — but 404s persisted after BFF fixed: user "still issues with loading assets. bff stuff is working"). Investigation steps (with their detours):
- Docker inspect commands the user hit trouble with: multi-line `\` continuations pasted into zsh broke (`invalid argument "find /app ..." for "-c, --cpu-shares" flag`), `$IMAGE`/`$IMG` empty after shell var reassignment (`docker: invalid reference format`), `:latest` tag never pushed (`manifest unknown: Failed to fetch "latest"`). Reliable approach: get the exact deployed ref with `IMG=$(gcloud run services describe route-planner-v2-staging --region=us-central1 --format='value(spec.template.spec.containers[0].image)')` on **one line**; then `docker run --rm "$IMG" sh -c "ls -la /app ..."` (platform warning amd64 vs arm64 host is harmless).
- Found `.next/static/chunks` existed at `/app/apps/route-planner-v2/.next/static/` yet curl returned 404 → looked at embedded nextConfig in server.js: **`"distDir":"./../../dist/apps/route-planner-v2/.next"`**. Nx overrides `distDir`; with `__dirname=/app/apps/route-planner-v2` the standalone server serves static from `/app/dist/apps/route-planner-v2/.next/static`. Fix: change Dockerfile COPY of `.next/static` to `/app/dist/apps/route-planner-v2/.next/static`. Verified via `docker run --rm "$IMAGE" sh -c "ls /app/dist/apps/route-planner-v2/.next/static/chunks/ | head -3"`.
- Also noted: `publicRuntimeConfig.IAM_CLIENT_ID` baked a **wrong client id** (`7a503418-…` not `d9883f93-…`) because the build ran before the `.env.local` swap → rebuild with correct `--build-arg NEXT_PUBLIC_IAM_CLIENT_ID`.
- Image-tag confusion: running image was `1c249041-fix` (redirect fix only); the static fix needed `-fix2`. Chunk hashes differ between builds, so probing an old hash gives 404 even on a healthy deploy — always take a chunk name from the *current* image.

### `/dev-login` redirect to `https://0.0.0.0:8080/`
`curl -sS -i -L <url>/route-planner` showed `curl: (7) Failed to connect to 0.0.0.0 port 8080`. Cause: Next standalone binds `HOSTNAME=0.0.0.0`, and `request.nextUrl.clone()` produced absolute redirects using that host. Fix: emit a **relative `Location` header** (verified: `curl -sS -i ".../route-planner/dev-login?next=/" | head -10` → `Location: /`).

### Misc build/setup notes
- If `.next` dir is 441MB after `rm -rf`, it simply rebuilt; `rm -rf apps/route-planner-v2/.next` then `yarn next dev -p 4200` (wait for "✓ Compiled successfully") is the clean-restart sequence. Next fast-refresh may not pick up changes in files outside `app/` or in `libs/common` — hard restart.
- Browser-cache reset steps: Network "Disable cache", unregister Service Workers, Application → Storage → "Clear site data", then hit `/route-planner/dev-login?next=/route-planner/solutions/<id>` to re-mint `ncc_token`. "Clear all" cookies wipes `ncc_token` too (caused a 0 ms 403 on `/optimization/v2/result`).
- `terraform.tfvars` for frontend contains: project_id, bff_host, region, service_name, iam_host, iam_client_id.
- Memory saved (assistant side): runtime SA needs `roles/storage.objectUser` on the ncc-config bucket; `apikeys/` vs `apikeys_stg/` path gotcha; env vars now in terraform.

### Transcript part C (chunks 7-9)

### Build + push + deploy commands (user asked: "commands for build and update deploy in cloud run" — then corrected "route-planner not ncc", "route-planner not bff")
```bash
cd /Users/[USER]/workspace/ncc
TAG=$(git rev-parse --short HEAD)          # short git sha is the convention
IMAGE=us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging:$TAG
gcloud auth configure-docker us-central1-docker.pkg.dev   # one-time
docker build --platform linux/amd64 \
  -f apps/route-planner-v2/Dockerfile.staging \
  --build-arg NEXT_PUBLIC_ENV=test \
  --build-arg NEXT_PUBLIC_BFF_HOST=https://bff-staging-[GCP_PROJECT_NUMBER].us-central1.run.app \
  --build-arg NEXT_PUBLIC_IAM_HOST=https://iam-stg.nextbillion.ai \
  --build-arg NEXT_PUBLIC_IAM_CLIENT_ID=<iam-client-uuid> \
  -t "$IMAGE" .                              # MUST run from monorepo root
docker push "$IMAGE"
gcloud run deploy route-planner-v2-staging --region us-central1 --project [GCP_PROJECT] --image "$IMAGE"
```
Timings: build ~3-5 min cold, push ~30s, deploy ~15s. BFF deploy shape: `gcloud run deploy bff-staging --region us-central1 --project [GCP_PROJECT] --image us-central1-docker.pkg.dev/[GCP_PROJECT]/bff/bff-staging:<new-tag>`.
- Heads-up recorded: route-planner-v2 `cloud_run.tf` manages `image`, so `terraform apply` reverts it to the placeholder (same image-clobber as the BFF; fix = 3-line `lifecycle { ignore_changes }` patch already applied to BFF terraform; offered to mirror).

### TS error at Docker build: MUI DataGrid locales
- Symptom: docker build failed on a TS error — locale packs imported from `@mui/x-data-grid/locales` don't satisfy `DataGridPro`'s prop type (it expects its own nested `@mui/x-data-grid` types).
- Fix: import locales from the Pro package: `@mui/x-data-grid-pro/locales` (exists).
- Also seen (warning, not fatal): `⚠ Invalid next.config.js options detected: Unrecognized key(s) in object: 'outputFileTracingRoot'` (on this Next version it is not a top-level key) and `(node:18) [DEP0060] DeprecationWarning: The util._extend API is deprecated`; and `Critical dependency: the request of a dependency is an expression` from `@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js` — warnings only ("Compiled with warnings").

### Implicit-any chain at `next build` (typecheck re-runs fully in production build; dev `nx serve` is lazier)
- Errors surfaced in `connection-panel.tsx` (`connections.find((c) => ...)`; `connectionOptions` is `any[]` because `connections` from the selector lost its type) and then `edit-row-dialog.tsx` line ~261 (`(m) =>` callbacks over `dataMappings`/`group.mappings`).
- Likely trigger (assistant's hypothesis, stated as such): new effects/state in `input-core.ts` changed the inferred `Dispatch`/`RootState` shape; Rematch circular-type warnings.
- Attempts: per-callsite annotations, tightening selector, then the structural fix: define a named `DataMapping` type at file scope in `edit-row-dialog.tsx` and pin `dataMappings`, `plainMappings`, `locationGroups[].mappings` to it (use `(typeof group.mappings)[number]` where inference is awkward). Gotcha: `DataMapOptionType` must be imported from `mapping-config/options/interface`, NOT `mapping-config/interface` (build failed once for that).
- User asked: "is there a way to relax the type checks to get this built and deployed more quickly?" → `next.config.js`: `typescript: { ignoreBuildErrors: true }`. Tradeoff: webpack still catches syntax/runtime errors; IDE/`nx lint` still show type errors; real type bugs surface at runtime. Cleanup recipe for later: remove the flag and fix callbacks; candidates via `git grep -E '\.(find|filter|map)\(\([a-z]\) =>' apps/route-planner-v2`. Assistant offered to save a memory noting it is a temporary demo-branch shortcut. Later turns repeatedly say "pre-existing TS warnings … are tolerated by `typescript.ignoreBuildErrors: true`".

### SSG failure: `Cannot access 'P' before initialization`
- Context: after typecheck was bypassed, `yarn nx build route-planner-v2 --skip-nx-cache` (builder step 12/12) failed in the static-generation pass with a circular-import TDZ error (minified name `'P'`).
- Tried first: import enums from leaf `mapping-config/interface` instead of barrel `mapping-config/index.ts`; remove `decodePolyline` import from `@ncc/route-planner-components` barrel and call `@mapbox/polyline` directly (a subpath import for the leaf did not exist: "Subpath imports aren't set up"). Cycle persisted (build ran 707s before failing).
- Next attempt `export const dynamic = 'force-dynamic'` was judged unreliable on client-component pages.
- Fix that worked: make the route's `page.tsx` a ~4-line shim using `next/dynamic` with `{ssr: false}` to lazy-load the real body moved into `index-client.tsx`, so SSG never evaluates the input module graph. Rationale: finding the cycle would require disassembling minified `page.js` to find `'P'`.

### Static assets 404 on Cloud Run: `public/` not served in Next standalone
- Symptom: map attribution logo broken on deployed app (worked locally). First hypothesis (filename `nb-logo-colored (1).webp` with spaces/parens fragile) → renamed to `nb-logo.webp` and updated component to `/route-planner/images/nb-logo.webp`; still 404 after a fresh build.
- Diagnosis steps: `docker run --rm --entrypoint sh "$IMAGE" -c "ls -la /app/dist/apps/route-planner-v2/public/images/"` showed the file IS in the image (platform warning "requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8)" is harmless). Response had `Vary: RSC, Next-Router-State-Tree...` = Next app router handled and 404'd, not the static handler. `curl -I .../route-planner/images/load-solution-instruction.png` returned `HTTP/2 307 location: /route-planner/dev-login?next=%2Fimages%2Fload-solution-instruction.png` (middleware auth redirect for unauthenticated curl — so curl tests of static assets need cookies).
- Root cause: Dockerfile put `public/` at `dist/apps/route-planner-v2/public/`, but Next standalone with `outputFileTracingRoot` at the monorepo root expects it at the source-relative path `apps/route-planner-v2/public/`. Every `public/` asset (also `load-solution-instruction.png`, `nbai-logo.png`) had been 404 since the standalone migration. Fix = Dockerfile copy path change (to the source-relative location). Verify after deploy: `curl -I .../route-planner/images/nb-logo.webp` → `HTTP/2 200`, `content-type: image/webp`.

### Auth redirect after cookies set
- User: "when ncc_token and apikey cookies are set, redirect to the /route-planner page and not the / page". Fix in `app/dev-login/route.ts` via `buildRedirectTarget()`: no `next` → `/route-planner`; `next=/` → `/route-planner` (middleware captured bare slash after Next stripped basePath); `next=/foo` → `/route-planner/foo`; `next=/route-planner/foo` unchanged. Bare server root has no handler and 404'd.

### BFF 403 on route edit
- Error: POST `https://bff-staging-…/directions/json?caller=optimization&apiKey=…` → `{statusCode: 403, message: "Forbidden resource", error: "Forbidden"}`.
- Cause: `v3/api/directions.api.ts` deliberately uses native `fetch()` (to dodge an ALPN-negotiation bug) and had never attached `Authorization: Bearer <ncc_token>`; the earlier auth-header sweep covered `useFetch`, `fetcher-client`, ky v3 client but missed this fourth path. BFF is cross-origin (Cloud Run) so the SameSite `ncc_token` cookie is not sent automatically.
- Fix: read `ncc_token` from cookies and forward as `Authorization: Bearer …` (same pattern as `fetcher.ts` / `fetcher-client.ts`).

### Webpack/CJS interop pitfalls (runtime TypeErrors)
- `TypeError: Supercluster is not a constructor` at `new Supercluster({radius: 60, maxZoom: 14, minPoints: 2, ...})`: webpack wraps the CJS export as `{default: Constructor}`. Fix: unwrap pattern `(ns.default ?? ns)` (works for both webpack-synthesized default and CJS direct).
- `TypeError: react_map_gl__WEBPACK_IMPORTED_MODULE_N__.default is not a constructor` at `new Map<…>()` — see Debugging (hit twice in this stretch).

### Preference rename leaves stale `fileName` inside JSON
- Symptom (user): "I'm selecting FEMSA_BRASIL2 from my preferences. After confirming the change, I'm not seeing the change reflected in the Description" — toast "Configuration loaded successfully" but the input still shows `FEMSA_BRASIL`.
- Root cause: BFF rename only renamed the GCS object (`.move()`); the JSON body still had `"fileName": "FEMSA_BRASIL"` which overrides the input on load. Fix: BFF rename now rewrites `fileName` inside JSON (requires BFF redeploy — local-only until shipped). Already-broken files: either load it, change name field to the new name and save once, or re-rename in the UI after the new BFF is live.

### Misc
- Next Server Action etc. not touched here. Sorting preference dropdown A→Z: `input-preference.tsx:41-52`, case-insensitive locale-aware sort on a copy; underlying `preferenceList` untouched.
- Wide address column in geocode review table: removed the 200px cap on `ViewCell`; added `COLUMN_SX` (No. 64px, Lat/Lng 120px each, Address `width:auto` min 240px).

### Transcript part D (chunks 10-12)

### Next.js Server Action 1MB body limit -> empty-body 500 (BIG lesson)
- Symptom: clicking "Generate Route" returned HTTP 500 with NO response body and NOTHING in BFF logs. User pasted a payload (~480 vehicles x ~1976 jobs, ~2MB). User statement: "it's not a problem with the size of the input (number of jobs and vehicles). I can run the same request against the route optimization service directly and with the same API key and get a valid request ID returned. When the 500 error is returned, there's nothing in the response - just the indication of a 500 error." Filtering zones (smaller payload) made it work.
- First (wrong) guesses: `undefined` inside jobs, location_index out of range, optimizer size/timeouts. Payload inspection showed it clean.
- Diagnosis: path is browser -> Server Action -> BFF -> NB; user's direct test bypassed the Server Action. Next.js Server Actions default to 1MB request body; runtime rejects before action runs.
- Fix in `apps/route-planner-v2/next.config.js`:
  ```js
  experimental: { serverActions: { bodySizeLimit: '10mb' } }   // 5mb enough for 6-day FEMSA plan; 10mb for slack
  ```
  Restart `nx serve route-planner-v2`; same setting applies to standalone Cloud Run server after redeploy. User confirmed "that resolved the issue".
- Diagnostic tell: empty 500 + no BFF log entry + works against the API directly = request never left Next.

### Cloud Run deploy for route-planner-v2 (staging)
Repo canonical flow: docker build -> push -> terraform apply (terraform's google provider issues the gcloud). Shell shape given:
```sh
gcloud auth configure-docker us-central1-docker.pkg.dev
gcloud config set project [GCP_PROJECT]
TAG=$(git rev-parse --short HEAD)
IMAGE=us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging:$TAG
docker build --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_BFF_HOST=https://bff-staging-[GCP_PROJECT_NUMBER].us-central1.run.app \
  --build-arg NEXT_PUBLIC_IAM_HOST=https://iam-stg.nextbillion.ai \
  --build-arg NEXT_PUBLIC_IAM_CLIENT_ID=<client-id> \
  -f apps/route-planner-v2/Dockerfile.staging -t $IMAGE .
docker push $IMAGE
# terraform-managed (recommended, keeps state in sync):
cd apps/route-planner-v2/infra/terraform && terraform apply -var="image_tag=$TAG"
# or bypass terraform (image-only roll, preserves env/secrets/SA/scaling):
gcloud run services update route-planner-v2-staging --image=$IMAGE --region=us-central1 --project=[GCP_PROJECT]
# what's deployed:
gcloud run services describe route-planner-v2-staging --region us-central1 --project [GCP_PROJECT] --format="value(spec.template.spec.containers[0].image)"
# URL: gcloud run services describe ... --format='value(status.url)'  -> app at <url>/route-planner
```
- `--platform linux/amd64` is mandatory on Apple Silicon (Cloud Run rejects arm64).
- Prefer `gcloud run services update --image` over `gcloud run deploy` for image-only rolls (deploy risks nulling terraform-managed fields if a flag is omitted).
- Drift warning: bypassing terraform means next `terraform apply` with stale `image_tag` rolls back. Avoid by `lifecycle { ignore_changes = [template[0].containers[0].image] }` (README says intentionally NOT done) or always bump tfvars.
- Needed roles: `roles/run.developer` (or admin) + `roles/artifactregistry.writer`.
- Currently deployed tag observed: `1c249041-fix` (prefix = main HEAD `1c249041 Merge pull request #1076`).
- Alternative no-git path mentioned: `yarn preview:deploy route-planner-v2 <suffix>` (per-suffix Cloud Run preview service, no git ops).
- Agent policy from CLAUDE.md: Claude may not commit/push/tag without explicit approval; at deploy request it refused to run and (after user interrupt) just listed commands. Branch was `main` with 115 uncommitted modified files.

### BFF deploy (bff-staging) — different from route-planner-v2
```sh
cd /Users/[USER]/workspace/bff
gcloud auth configure-docker us-central1-docker.pkg.dev && gcloud config set project [GCP_PROJECT]
yarn build                      # Dockerfile.staging expects dist
TAG=$(git rev-parse --short HEAD); [ -n "$(git status --porcelain)" ] && TAG="${TAG}-dirty"
IMAGE=us-central1-docker.pkg.dev/[GCP_PROJECT]/bff/bff-staging:$TAG
docker build --platform linux/amd64 -f Dockerfile.staging -t "$IMAGE" .
docker push "$IMAGE"
gcloud run deploy bff-staging --region=us-central1 --project=[GCP_PROJECT] --image="$IMAGE"
```
- Same URL after deploy (`https://bff-staging-[GCP_PROJECT_NUMBER].us-central1.run.app`); no DNS/env changes.
- Do NOT `terraform apply` for BFF image: its terraform has `lifecycle.ignore_changes = [...image]`, so only `gcloud run deploy` rolls images.
- Rollback: `gcloud run services update-traffic bff-staging --to-revisions=<prev-revision>=100 --region=us-central1 --project=[GCP_PROJECT]`.
- Verify: `gcloud run services describe bff-staging ... --format='value(spec.template.spec.containers[0].image)'`, then tail logs; expected log line `<org> - vrj : POST https://api.nextbillion.io/optimization/v2?key=...`.

### Cloud Run log retrieval
```bash
gcloud logging read 'resource.type="cloud_run_revision" AND resource.labels.service_name="bff-staging"' --limit=200 --format="value(timestamp,severity,textPayload,jsonPayload.message)" --freshness=1h
# errors only: add  AND severity>=ERROR
```
- `gcloud beta logging tail` failed for the user with a wall of Python `SyntaxWarning: invalid escape sequence '\ '` (appengine protos) — live tail needs gRPC in gcloud's Python env. Suggested fix: `PYTHON=$(gcloud info --format="value(basic.python_location)"); CLOUDSDK_PYTHON_SITEPACKAGES=1 "$PYTHON" -m pip install --user grpcio grpcio-tools; export CLOUDSDK_PYTHON_SITEPACKAGES=1`. The first guessed path `/opt/homebrew/share/google-cloud-sdk/bin/python3` gave `zsh: no such file or directory` — bundled Python path varies. Better: skip live tail; poll `gcloud logging read ... --freshness=30s` in a `while true; ... sleep 5` loop, or read once after triggering the failure.
- Console URL pattern: `https://console.cloud.google.com/run/detail/<region>/<service>/logs?project=<project-id>`.

### Salesforce OAuth "invalid client credentials" saga (token exchange)
Working reference: `~/workspace/poc_data/SCA/sf-oauth-demo/server.js` used HTTP Basic for token exchange:
```js
const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
fetch(TOKEN_URL, { method:'POST',
  headers:{ Authorization:`Basic ${basic}`, 'Content-Type':'application/x-www-form-urlencoded' },
  body:new URLSearchParams({ grant_type:'authorization_code', code, redirect_uri:REDIRECT_URI }) })
```
Steps in order:
1. v2 code (callback/route.ts + token/route.ts) sent `client_id`/`client_secret` in body; agent switched both to Basic header (scope `api refresh_token` matched demo). Still failed.
2. User enabled PKCE on the Connected App -> new error from `/authorize`: `error=invalid_request&error_description=missing%20required%20code%20challenge`. Cause: PKCE was opt-in via `NEXT_PUBLIC_SF_OAUTH_PKCE === 'true'`; without it no `code_challenge` was sent. Fix: flip default so PKCE always sent (`SF_OAUTH_USE_PKCE` true unless `NEXT_PUBLIC_SF_OAUTH_PKCE=false`). PKCE generator verified: 32 random bytes verifier, SHA-256 -> base64url challenge, `code_challenge_method=S256`; pending state incl. `codeVerifier` kept in in-memory store + encrypted cookie.
3. Still `invalid client credentials`. Agent's claim: per Salesforce docs for Web Server Flow with PKCE, `client_id` + `client_secret` go in the BODY not Basic header; reverted to body credentials + `code_verifier`, and added diagnostics:
   `[sf-oauth] token exchange { tokenUrl, clientIdPrefix, clientIdLength, clientSecretLength, clientSecretFromEnv, redirectUri, hasCodeVerifier, codeVerifierLength }` and `[sf-oauth] token response { status, error, errorDescription }`.
   Checklist given: `clientSecretFromEnv: true` => secret comes from `SALESFORCE_CLIENT_SECRET` env (stale env overriding UI form; `unset` and restart); `clientIdPrefix` must match Connected App Consumer Key; `tokenUrl` must be `https://<my-domain>.my.salesforce.com/services/oauth2/token` (not login.salesforce.com); `redirectUri` must EXACTLY match a callback URL (`http://localhost:4200/oauth/_callback` vs `http://127.0.0.1:4200/...` vs `http://localhost:4200/route-planner/api/integrations/salesforce/callback` are all different); `clientSecretLength` 0 => secret never arrived. Outcome not recorded in this chunk range (user had not reported resolution). Note: the Basic-vs-body advice flip-flopped; the transcript never confirmed which was correct.

### Next/basePath fetch 404
Browser `fetch('/api/demo-login')` hits `http://localhost:4200/api/demo-login` — basePath is NOT auto-prepended for raw fetch. Fix: use `${ROUTE_PLANNER_BASE_PATH}/api/demo-login` (constant imported from app; follows `NEXT_PUBLIC_BASE_PATH`). Symptom text: "Sign-in failed" 404.

### Middleware/demo gate
- `middleware.ts` demo gate placed at very top; cookie `rpv2_demo_auth` (HttpOnly, 7-day TTL); env overrides `DEMO_USER`, `DEMO_PASS`, `DEMO_AUTH_TOKEN` (rotate token to invalidate sessions). Exempt: `/demo-login`, `/api/demo-login`, `/oauth/_callback`, `/auth/callback`, `/callback`, `/share-callback`, `/dev-login`.
- Existing matcher excludes `/api/...` so the gate protects pages only, not server API routes.
- `next` redirect param sanitized via `resolveNext()`: must start with `/route-planner` (or exactly it) else fallback `/route-planner`; anything not starting with `/` (e.g. `https://evil.com`) is rejected (open-redirect guard). Visiting bare `http://localhost:4200/` produced `next=/` which has no page under basePath.

### Killing dev server
`kill` on PID for port 4200 (`next-server v14.2.28`); SIGTERM caught then SIGKILL no-op.

### Typecheck practice noted
- Repo-wide `nx` typecheck/show-project background jobs ran very long with empty output; agent cancelled them and ran a focused tsc on touched files instead (zero errors in touched files). Pre-existing implicit-any warnings in zone-filter persistence (`jobs.map((_, i) => i)`, `vehicles.forEach((_v, index)`) and unrelated spec-file errors existed — verify pre-existing before chasing.
- Validate locale JSON parity after editing: all five `messages/*.json` must parse and match the `en` key set (pre-existing drift observed in Salesforce help copy; `locales.pl-PL` is an intentional extra key added to every locale).

### Transcript part E (chunks 13-15)

### Cloud Run NCC token rotation (three separate recurrences, same root issues)
User: "I added an updated NCC_TOKEN to .env.local Ran a new build and deploy to GCP. I'm still seeing the previous NCC_TOKEN getting set in my cookies".
- Cause 1: Cloud Run does not read `.env.local`. The token comes from Secret Manager, wired in `infra/terraform/secrets.tf:6` + `cloud_run.tf:52-63` as env var `DEMO_NCC_TOKEN`. Rebuilding the image does not change it (image only bakes `NEXT_PUBLIC_*` build args).
- Cause 2: browser keeps old `ncc_token` cookie (7-day maxAge) until `/route-planner/dev-login` is hit again; clear the cookie (DevTools → Application → Cookies) or use incognito.
- Secret versions are pinned per revision: Cloud Run only re-resolves `version = "latest"` when a new revision is created. Force one with:
  ```bash
  gcloud run services update route-planner-v2-staging --region=us-central1 --update-env-vars=DEPLOY_NONCE=$(date +%s)
  # or a label bump:
  gcloud run services update route-planner-v2-staging --project=[GCP_PROJECT] --region=us-central1 --update-labels="secret-rotated-at=$(date +%s)"
  # or re-bind (safe even if already correct; triggers rollout):
  gcloud run services update route-planner-v2-staging --region=us-central1 --project=[GCP_PROJECT] --update-secrets=DEMO_NCC_TOKEN=[REDACTED_SECRET]:latest
  ```
- Add the new version with no trailing newline (IAM rejects JWTs with trailing whitespace):
  ```bash
  printf '%s' '<JWT>' | gcloud secrets versions add [REDACTED_SECRET] --data-file=-
  gcloud secrets versions access latest --secret=[REDACTED] | wc -c      # expect token length (715 in the first case)
  gcloud secrets versions list [REDACTED_SECRET] --project=[GCP_PROJECT] --limit=3
  ```
  Safer variant to avoid shell history: paste JWT into `/tmp/ncc_token.txt`, `--data-file=/tmp/ncc_token.txt`, then `rm /tmp/ncc_token.txt`.
- Verification commands:
  ```bash
  gcloud run services describe route-planner-v2-staging --region=us-central1 \
    --format='value(spec.template.spec.containers[0].env)' | tr ';' '\n' | grep -i ncc
  gcloud run services describe route-planner-v2-staging --region=us-central1 \
    --format='value(spec.template.spec.containers[0].env)' | tr ';' '\n' | grep -E '^ENV='   # dev-login 404s unless ENV=test
  gcloud run revisions list --service=route-planner-v2-staging --region=us-central1 --limit=2 \
    --format='table(metadata.name,metadata.creationTimestamp)'
  ```
- 2026-06-30 exact failure:
  ```
  ERROR: (gcloud.secrets.versions.add) NOT_FOUND: Secret [projects/<num>/secrets/DEMO_NCC_TOKEN] not found. This command is authenticated as <user> which is the active account specified by the [core/account] property.
  ```
  Root cause: Terraform names the secret `${service_name}-demo-ncc-token` (the `[REDACTED_SECRET]` placeholder), NOT `DEMO_NCC_TOKEN`. `DEMO_NCC_TOKEN` is only the env var name. A prior manual `gcloud run services update` had rewired the Cloud Run env var to a literal `DEMO_NCC_TOKEN` secret that was never created (config drift: the runtime SA only has accessor on the terraform secret). Fix = write the version to the terraform-named secret and re-point:
  `--update-secrets=DEMO_NCC_TOKEN=<terraform-secret-name>:latest` (form is `ENV_VAR_NAME=SECRET_NAME:VERSION`).
- Token must be from the right IAM: service has `IAM_HOST=https://iam-stg.nextbillion.ai`, `IAM_CLIENT_ID=d9883f93-dcbc-44d5-ade8-2af69d29599d`. A token with `iss=https://iam.nextbillion.ai` and a different `aud/cid` (prod) will be rejected by the staging BFF (different signing keys and client_ids). Check payload: `iss` must match `IAM_HOST`, `aud`/`cid` must match `IAM_CLIENT_ID`. Tokens last ~14 days (`exp - iat = 1,209,600s`). Claude cannot mint tokens (IAM signs in KMS); get from console login (`ncc_token` cookie) or `POST https://iam-stg.nextbillion.ai/api/login` `{email,password,client_id}` → `.idToken` (password accounts only).
- Local dev: `nx serve` reads token from a local env file loaded by `@dotenvx/dotenvx`. Stale token found in `apps/route-planner-v2/.env.local:15` (June 26 exp). After editing: restart `nx serve route-planner-v2` (no hot reload of `.env.local`), clear `ncc_token` cookie on `localhost:<port>`, reload so `/dev-login` re-mints. `.env.local` is gitignored; `apps/route-planner-v2/.env` is the committed env for staging builds.

### Deploying route-planner-v2 to staging with existing Terraform (user: "just want to deploy the route-planner-v2 app using existing terraform infra setup")
Run from monorepo root:
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
TAG=$(git rev-parse --short HEAD)           # or TAG=femsa-demo-$(date +%Y%m%d) for a dirty tree
IMAGE=us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging:$TAG
docker build --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_BFF_HOST=https://bff-staging-<num>.us-central1.run.app \
  --build-arg NEXT_PUBLIC_IAM_HOST=https://iam-stg.nextbillion.ai \
  --build-arg NEXT_PUBLIC_IAM_CLIENT_ID=d9883f93-dcbc-44d5-ade8-2af69d29599d \
  -f apps/route-planner-v2/Dockerfile.staging -t $IMAGE .
docker push $IMAGE
cd apps/route-planner-v2/infra/terraform && terraform apply -var="image_tag=$TAG"
terraform output service_url     # app is at <service_url>/route-planner
```
- `--platform linux/amd64` is REQUIRED on Apple Silicon; Cloud Run rejects arm64.
- Plan should show exactly one change (`google_cloud_run_v2_service.service` image tag); if it touches secrets/IAM/AR repo stop and investigate.
- Docker builds from the working tree, so uncommitted work ships, but a SHA tag won't reflect it — commit first or use a manual tag.
- Rollback: `gcloud artifacts docker images list us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging --sort-by ~UPDATE_TIME --limit 5` then `terraform apply -var="image_tag=<prior-tag>"`.
- Docs-vs-reality mismatch to check: preview docs say project `nextbillion`/`asia-southeast1`; the user is authenticated to `[GCP_PROJECT]`. Before `yarn preview:deploy <app> <name>` check `.env.preview` and `tools/preview/deploy.mjs`; if it targets `nextbillion`, `gcloud config set project nextbillion` or expect 403.
- Release gotchas (from `CLAUDE.md`/`AGENTS.md`): release scripts default to `--dry-run`, need `--execute`; `gh auth status` must be OK (orphan-tag logic in `release-preflight.sh`); `release.yml` substring matcher: `route-planner` is a substring of `route-planner-v2` (guarded with `&& !contains(name, 'route-planner-v2')`) but `route-planner-viewer` overlap is NOT guarded; do not override hotfix invariant with `--allow-orphan-tags`. Steps: `./tools/release/release-preflight.sh` (exit 1 hard fail, 2 warnings) → `next-version.sh` → `generate-notes.sh` → `create-github-release.sh` (dry run) → `--execute`.

### Git state
- User asked "create a local feature branch for all changes". CLAUDE.md says branch from `origin/main`, but local `main` was 40 commits behind with a dirty tree on old base (1c249041); forcing a stash/pop onto the newer base would conflict. Resolution: `git checkout -b feat/route-planner-v2-misc-enhancements` carrying the dirty tree, nothing pushed; later `git rebase origin/main` after committing. Likely conflict files: `app/(input)/page.tsx`, `next.config.js`, locale files.

### nx daemon hangs (recurring, 3 times in this range)
- `yarn nx typecheck route-planner-v2` and `yarn nx show project ...` ran 25-47 min with zero CPU and zero-byte output files; `... | tail -30` buffers until pipeline drains, so empty output does not mean progress. Daemon PID was idle since the previous Sunday; the Nx Console extension (nxls, Cursor) shares the same daemon.
- Remedy suggested: kill hung commands and daemon, then `yarn nx reset`, rerun with `NX_DAEMON=false yarn nx typecheck route-planner-v2`.
- Workarounds that actually worked: direct `tsc --noEmit` focused on edited files (exit 0; errors reported were pre-existing in `components/solution/opt-result-panel/` legacy v1/v2 path, not v3); then grep the tsc output for the touched file names. Background tasks launched via harness were repeatedly "killed" before flushing; run `npx nx typecheck route-planner-v2` yourself if verification matters.
- Do not claim `exit code 0` from a SIGKILLed wrapper shell as success.
- Free a stuck port: `Next.js dev server on 4200`: SIGTERM ignored, needed SIGKILL.

### Territory-planner build issues
- Next 14.2.28 build error when `require()`-ing an ESM package:
  ```
  ../../libs/territory-planner/src/boundaries.js:2:22
  Module not found: ESM packages (d3-delaunay) need to be imported. Use 'import' to reference the package instead. https://nextjs.org/docs/messages/import-esm-externals
  > const { Delaunay } = require('d3-delaunay');
  ```
  Fix: load `d3-delaunay` (and `polygon-clipping` as a precaution) with `await import()` inside `buildBoundaries`, making it async and `await`ing it from `run.js`. Same fix to apply to `parse.js`/`lp.js` if `exceljs`/`highs` throw similar ESM errors.
- Next config must keep `highs` (WASM) and `exceljs` external for the API route so webpack doesn't try to bundle them.
- `parse.js` modified to accept a Buffer in addition to a file path (API route receives uploads as buffers).
- Added deps with Yarn Berry (Yarn 3) at root `package.json`; none of the four existed; inserted alphabetically.
- React hooks-order violation caught while writing map view: `useMemo` called after an early `return`; move hooks above early returns.
- deck.gl `GeoJsonLayer` accessor typing: widen accessor arg type to fix 2 tsc errors.
- Per-territory NB Distance Matrix reuse: the existing helper `use-zone-drive-matrix.ts` reads api key from the `apikey` cookie; pattern (URL, params, response shape) for `/distancematrix/json` reused in new lib module.

### Misc setup
- `node` script limitation: `papaparse` not resolvable from the scratchpad directory; used an inline quote-aware CSV splitter. Note that `awk` breaks on quoted commas in `LAT_LONG` — use Papa or a quote-aware splitter.
- Vite/Next static JSON in `public/` ships in the bundle: `input_femsa.json` 24 MB (reported variously as 5.5 MB after regeneration) and `coca_cola_four_week_response.json` 24 MB; offered to move heavy fixtures to a dev-only location. After switching FEMSA1 to `femsa1_response.json`/`input_femsa1.json`, old files and the two `cluster_*_femsa.json` intermediates can be deleted from `apps/route-planner-v2/public/data/`.

### Transcript part F (chunks 16-18)

### Territory/TSP API shape errors (NextBillion optimization)
- First TSP used `/optimise-mvrp` (v1) "smaller payload". User screenshot: "something wrong with TSP request". Fix 1: v1 wants `locations.location` as a **pipe-separated string of `lat,lon` pairs** `"lat1,lon1|lat2,lon2|..."`, not array of `[lon, lat]` tuples.
- User: "schema should comply with latest version of NextBillion MVRO" and pointed at `docs/Optimization Flexible-live.yaml`. Switch to `POST /optimization/v2` + `GET /optimization/v2/result`:
  - `locations.location: string[]` of `"lat,lon"` (array, not pipe-joined)
  - `vehicles[0].id` / `jobs[i].id` are strings (`rep-1`, `job-N`)
  - single vehicle, no `start_index`/`end_index` -> optimizer picks both
  - `jobs[i].service = tempoH * 3600` seconds; `time_windows: [[startUnix, endUnix]]` per job
  - `Step.distance`, `Step.duration`, `Step.arrival` are **cumulative** (leg distance = `step.distance - prev.distance`); `arrival` is unix seconds when `time_window` set; `Step.location` is `[lat, lon]` (v1 was `[lon, lat]`); distance/duration are integers
  - Poll: v2 signals "still processing" by `status:"Ok"` with an EMPTY `result:{}` object (not a separate status value) - pattern from `actions/server/optimization.ts:118`. Poll 800 ms interval, 45 s budget. Track `location_index` back to the original stop.
  - polyline5 geometry decoded inline; if route renders as tight zigzags switch precision 5 -> 6.
  - `options.constraint.max_vehicle_overtime: 3600` (user: "introduce an options.max_vehicle_overtime = 3600") - global constraint applying to every vehicle in request.
  - API key pulled from `apikey` cookie (later `|| process.env.NEXTBILLION_API_KEY`).
- Vehicle `time_window` must contain every job's time_window: initially tried 06:00 day start, then widened vehicle window to a full 24 h so night shifts fit; time windows anchored to `dateISO` midnight and converted via `hmToSeconds`; fallback arrival uses `dayStartUnixS`.
- Column naming: user requested `start_tw_1, end_tw_2`; agent flagged likely typo; user: "end_tw_1 is correct. the API supports multiple time windows to be specified. In this case I only need to specify one time window - hence tw_1". Parser then reads `START_TW_1 / END_TW_1` only (fallback removed).

### Display timezone bug (Arrival not within time window)
- Symptom: Arrival column outside POS window. Cause: `toLocaleTimeString(undefined, ...)` renders in browser-local TZ, while the server anchors day-start and HH:MM windows in UTC (Cloud Run container TZ). 07:30 UTC showed as 03:30 in a UTC-4 browser. Fix: `formatClock` in `territory-map.tsx` forces UTC; earlier also `hour12: false` for 24-h arrival.
- "Cum. time" initially measured from day's midnight (`arrival - dayStartUnixS`, read like 08h15m). Redefined: wall-clock elapsed from driver's arrival at stop 1 through end of service at each row: `arrival - routeStart + service` (row 1 = service time only; waiting between windows included).

### CSV support
- Server `parse.js`: sniff by first two bytes: `PK` -> `wb.xlsx.load()`; else `wb.csv.read()` via a `Readable` stream (exceljs csv doesn't accept raw buffers); also handles `.csv` file paths for CLI.
- Client: dropzone + `handleFiles` extension guard + `<input accept>` include `.csv`; hint text updated.
- Error: header `MATRÍCULA` not matched on upload of `apps/route-planner-v2/public/data/ZIPREQ5715.csv` (user screenshot, after saying "column name should be MATRÍCULA in the CSV"). Root cause: file was clean UTF-8, but SheetJS `XLSX.read(buf, {type: 'array'})` defaults to **Windows-1252** codepage for CSV so bytes `c3 8d` of `Í` get misdecoded. Fix in `parse-preview.ts`: for `.csv`, UTF-8-decode the buffer first and call `XLSX.read(str, {type: 'string'})`. Both sides: `normalizeHeader` strips leading BOM (use an explicit `﻿` escape in code for readability) + NFC-normalizes unicode; lookup names in `col()`/`optionalCol()` normalized too. Verified by running `parseBase` against the CSV in Node: 211,196 POS read.
- CSV edit (user: change FREQUENCIA DE VISITAS to 0.25 in the file): CSV has quoted fields with embedded commas so `awk` is unsafe - use Python `csv` module; all 211,196 rows set, header and quoting preserved.

### Cloud Run: "pipeline finished without returning a result"
- Symptom on deployed build: stream ended cleanly, no `result` event. Hypotheses: request timeout (default 300 s) or OOM (default 512 MiB). Checked `cloud_run.tf` - no `resources`, no `timeout` set. Cloud Run logs confirmed **OOM** (container killed mid-pipeline).
- Fix in `cloud_run.tf`: `memory = "2Gi"` (from 512 MiB), `cpu = "2"` (from 1; Cloud Run needs CPU >= 2 for memory > 1 GiB per agent's note), `timeout = "900s"` (from 300 s), `startup_cpu_boost = true`. Ran plan (resource bump only) then apply; same image tag.
- Image tag swap workflow: `terraform plan` shows only `image_tag` change e.g. `route-planner-v2-staging:64a0eca9-07290947` -> `route-planner-v2-staging:2497636-dirty-20260731-1344`; revision live in ~32 s.

### Node OOM at 211k POS ("Last few GCs")
User error stack (abridged): `Scavenge 5797.8 (5916.0) -> 5797.8 (5916.0) MB ... allocation failure`, `Mark-Compact 6565.8 (6684.0) -> 5333.2 (5875.7) MB`. Diagnosis (algorithm shape, not GC tuning): R ~ 6,000 territories at ~1 h/wk per POS and default caps; `buildTerritories` transportation LP has `POS x R` variables (211k x 6k ~ 10^9); `buildBoundaries` 211k Voronoi cells + alpha-shape union; pattern catalog ~20 patterns x 211k POS x frequency variants -> millions of live JS objects. Mitigation shipped: **Sample control** in preview toolbar (right of TIPO filter): numeric target + Sample + Reset; replaces selection with deterministic evenly-spaced subset of `filteredRows` (stride = `filteredRows.length / target`); Build ships intersection with `filteredRows`; Reset restores all filtered rows. Workflow: upload -> Sample to 10,000 -> build -> validate -> save -> adjust caps. Future for full set: geographic pre-split or fast mode.

### Empty territory crash on Recalculate
- After editing a territory so no POS fall within it, Recalculate errored (user screenshot). Root cause: `scheduleTerritory` in `libs/territory-planner/src/schedule.js` ran `kmeans([], 5)` and `sub.map(p => p.x)` reductions on an empty array with no early return. Fix: add early-return guard for empty territory. Other places already safe: `recomputeTravel` has `byT[t].length ?` guard; `buildBoundaries` has `if (!pts.length) continue;` for alpha shape and Voronoi. An in-flight docker build started before the fix was killed and restarted so the fix ships in the same deploy.

### Recalculate hard-fails when slots exceed daily cap
- Failure came from `validate.js` hard-erroring when any slot exceeds `dailyCapH` ("20 slots over cap") even though LP scheduler already retries with soft caps. Fix: `validate(..., {allowOverCap})`; when true `metrics.slotsOverCap` still counts but doesn't raise an error (other checks - day feasibility, restricted days, visit-count shape - still enforced). Threaded through `reschedule.js`, `index.ts` signature, reschedule route; checkbox in Recalculate panel "Allow rep-days over the daily cap (show metrics anyway)", default on; add `allowOverCap` to recalc callback dep list.

### Saved plan loaded the ORIGINAL (unedited) solution
- Root cause: `confirmSave` persisted `phase.result` (parent copy), but edits and Recalculate results lived inside `MapPanel` (`localResult`, `editedPos`). Fix: `MapPanel.onSave` signature `() => void` -> `onSave(effectiveResult)`; `effectiveResultForSave` (useMemo) = `localResult` if Recalculate ran, else `{...initialResult, pos: editedPos}` if edits pending, else `initialResult`. Parent stashes it in `saveDialog.result`; `confirmSave` writes it; also `setPhase` replaces `phase.result` with the saved snapshot so sidebar matches what was persisted. Hulls are recomputed from `pos.terr` on reopen so edited layout renders. Also reset `result: null` wherever `saveDialog` resets.

### Voronoi not updating after edits
- Voronoi comes from the server pipeline, frozen at build; hull is client-derived. Fix: Recalculate now rebuilds Voronoi (`buildBoundaries(pos, R, proj)` as step 5 in `reschedule.js`), returned alongside `pos`/`metrics`; client replaces `initialResult.boundaries` in `localResult`. `BoundaryToggle` shows a `Stale` chip when `stagedPos !== null` and Voronoi is active.

### Map drag conflicts with vertex drag in edit mode
- nebula.gl issue: map controller and edit layer both consume drag. Fix: `useMap()` from react-map-gl (a `MapProvider` exists; map exposed by `<BaseMap mapId="territoryPlannerMap">`), `useEffect` that calls `map.dragPan.disable()` when `edit !== null`, cleanup always re-enables (unmount/Cancel/Save). Zoom and scroll stay on.

### Panel overlap
- Edit panel and Territories panel overlapped (absolute positions with hard-coded coords). Fix: wrap all three in a shared flex-column rail and strip each panel's own positioning.

### Typecheck / build tooling notes (ncc monorepo)
- `typecheck` is NOT an nx target (only `test` and `lint` found by grep) so `nx typecheck` produced silent empty output; use `tsc --noEmit` scoped to changed files (filter output for touched paths; exit code 1 comes from pre-existing errors in unrelated files: validator `isEmail`, `preview-map` `PointLike`, `item-route.spec`).
- Used-before-declared error: `startEdit` callback referenced `hullBoundaries` before its declaration - move `hullBoundaries` above the callbacks, delete the duplicate.
- Local `nx build route-planner-v2` hung 13 min (0.98 s CPU total, no build subprocesses; stalled Nx daemon / graph lock). Killed it and went straight to `docker build`, which does its own fresh nx build with no daemon.
- Docker build (typical): `yarn install` ~45 s with layer-cache hit (228 s cold), `RUN yarn nx build route-planner-v2` 6-9+ min (Next webpack; browserslist warning appears near the end), total ~10-12 min cold, ~2 min only if the whole build layer is cached. Parallel builds do NOT share layer cache. Build must be restarted if code is edited after the `COPY` step (a build started before a code move captured stale code and was discarded).
- Build/deploy sequence used throughout: `gcloud auth configure-docker us-central1-docker.pkg.dev` -> `docker build --platform linux/amd64 --build-arg NEXT_PUBLIC_NEXTBILLION_API_KEY=... -f apps/route-planner-v2/Dockerfile.staging -t <IMAGE:TAG> .` -> `docker push` -> `cd apps/route-planner-v2/infra/terraform && terraform apply -var="image_tag=<TAG>"` (plan shown first). An apple-silicon arm64 image causes a startup failure on Cloud Run; always `--platform linux/amd64`.
- Next dev note: new Rematch model effects/reducers and new modules are read at store-creation, so Fast Refresh isn't enough - restart `next dev` (Ctrl+C -> `nx serve route-planner-v2`). `NEXT_PUBLIC_*` vars are inlined at build/dev-server start.
- `PageHead` renders on `/saved`, `/settings`, `/admin/users`, `/territory-planner`, which have no redux `<Provider>`; calling `useDispatch` there would crash those pages. Gate the Import JSON menu item and dialog on `hasInputStore` (exists on `/` and `/solution`).

### GCP project migration (new `project_id` in tfvars)
Exact sequence and findings:
1. Changing `project_id` while the old `terraform.tfstate` (10 resources) points at the old project makes Terraform plan destroy+recreate (identity change, not move) and fail on non-movable `google_project_service`. Fix: rename state aside `mv terraform.tfstate terraform.tfstate.old-project-<date>` (and `.backup`), `terraform init` (fresh), `terraform apply` (bootstrap, no `image_tag`): enables Run/AR/Secret Manager APIs, creates AR repo, runtime SA, demo-token secret (placeholder `REPLACE_ME`), Cloud Run running the `hello` placeholder image.
2. Errors on first apply: missing `serviceusage.services.enable` (Secret Manager API) and `iam.serviceAccounts.create` (runtime SA). Cause: active gcloud account was the personal one with no role on the new project; another authed account had `roles/owner`. No partial resources created.
3. `gcloud config set account` only changes the CLI; **Terraform uses Application Default Credentials**. Fix: `gcloud auth application-default login --account=<owner-account>` (run in-session with the `!` prefix), then verify ADC identity.
4. Retry created 9 of 10 resources; Cloud Run failed twice with "internal error" (container imported fine, revision flipped to failed). Isolated by manually deploying the placeholder image with gcloud (worked) then deleting the test service and re-running `terraform apply` -> succeeded. Conclusion: IAM propagation race between creating runtime SA + secret binding and the service starting; suggestion to add a `time_sleep` between IAM binding and Cloud Run service or retry.
5. Cloud Run later exposes two URLs for same service (`-7j5cx7inrq-uc.a.run.app` and project-number form `-<project-number>.us-central1.run.app`).
6. Cleanup: archived state files deleted after migration stable; `README.md` updated with a "Migrated 2026-08-05" callout, new bootstrap `gcloud config set project`, new `IMAGE=` AR path. Old-project service teardown by user. `gcloud run services delete` only with explicit OK (destructive).

### Demo JWT / `/dev-login` secret rotation
- Symptom: browser `Error: Forbidden resource at Object.loadPreferenceList` after deploy to new project. Cause: `DEMO_NCC_TOKEN` secret still held bootstrap placeholder `REPLACE_ME`; `/dev-login` hands out `REPLACE_ME` as `ncc_token`, first BFF call 403s.
- Attempts that failed: exchanging demo credentials at IAM `/api/login` (demo account no longer exists on iam-stg); reading old project's secret (no secretmanager access).
- Fix: user placed a fresh iam-stg JWT in `apps/route-planner-v2/.env.local` (`DEMO_NCC_TOKEN=...`); agent inspected payload (valid ~14 days), then `echo -n "<jwt>" | gcloud secrets versions add <demo-token-secret> --data-file=- --project=<project>` and a no-op `gcloud run services update` / rolled revision so the container picks up the new secret `latest` value (no rebuild needed). `/dev-login` clears the `apikey` cookie before setting fresh `ncc_token`.
- JWT payload fields: `sub`, `mail`, `org: "nbai"`, `employeeType`, `subscriptionList`, `auth_time`, `aud`/`cid`, `iat`, `iss: https://iam-stg.nextbillion.ai`, `sid`, `exp`. Tokens last ~14 days; rotate again at expiry.

### BFF dead / deploy blocker
- Client bundle bakes `NEXT_PUBLIC_BFF_HOST` (build arg) as `bff-staging-<old-project-number>.us-central1.run.app`; it returns Google's own HTML "404 Page not found" (not NestJS 404) -> the Cloud Run service no longer exists. SSR sees `Not Found`; production digests hide real message (`Failed to initialize input core`).
- BFF needs: GCS buckets `<project>-ncc-config` and `-bff-config`, BFF SA `roles/storage.objectUser`, seeded `bff-config/apikeys/orgs_v2/nbai.json` (populates Billing Project dropdown), 4 secrets (`IAM_CLIENT_ID`, `IAM_SERVER`, `MAAAS_URL`, `ANTHROPIC_API_KEY`), `~/workspace/bff/infra/terraform/terraform.tfvars`. BFF deploy flow: `yarn build` -> docker build `--platform linux/amd64` tag `<sha>-dirty-<ts>` -> push `us-central1-docker.pkg.dev/<project>/bff/bff-staging:<TAG>` -> `gcloud run deploy bff-staging --region=us-central1 --image=$IMAGE --project=<project>`.
- User-provided log for the BFF container: `Default STARTUP TCP probe failed 1 time consecutively for container "bff-staging-1" on port 8080. The instance was not started. Connection failed with status DEADLINE_EXCEEDED.` Agent's triage table: (1) app binds `127.0.0.1` not `0.0.0.0` -> `app.listen(process.env.PORT, '0.0.0.0')`; (2) hard-coded port instead of `process.env.PORT` (Cloud Run injects 8080); (3) bootstrap throws on missing env/secret (`IAM_SERVER`, `MAAAS_URL`, `NCC_CONFIG_BUCKET`...); (4) runtime SA missing `roles/storage.objectViewer` on config bucket; (5) image built for arm64 -> `--platform linux/amd64`. "DEADLINE_EXCEEDED in the system log is downstream of the real error - never trust it as the diagnosis"; find the crash line in container logs (`gcloud logging read 'resource.type="cloud_run_revision" resource.labels.service_name="bff-staging"' --project=<p> --limit=100 --freshness=10m --format="value(timestamp,severity,textPayload)"`).
- Account `<user>` had zero permissions on the old project (can't list Run, push AR, deploy). User then pivoted: "similar to how we have ~/workspace/territory-planner setup and deployed, remove the BFF dependencies for route-planner-v2 and use preset API key for all actions" -> standalone mode (see Architecture).

### Standalone-mode fixes found one deploy at a time
1. After layout short-circuit, tiles OK but "Generate Route" `POST .../route-planner 500`. Cause: Server Actions (`actions/server/optimization.ts`, `'use server'`) call `fetch<>` in `fetcher-rsc.ts` -> still BFF -> dead -> 500. Same for `savePreferenceConfiguration`, `saveInputSet`. Fix: route NBAI-native paths direct + stub BFF-only paths.
2. `/solutions/{id}` still failing: the page uses a separate HTTP layer `v3/api/*` using **ky** with `prefixUrl = env.getBffHost()`. Patch the ky client factory; drop `credentials: 'include'` when rewriting cross-origin to NBAI or CORS blocks the response.
3. Still "Failed to fetch": the auth hook in `v3/api/client.ts:66-68` carries the comment `Merged because ky's pipeline appears to stop after the first hook that returns a new Request — splitting these into two hooks meant the second never ran.` My separate `standaloneRewriteHook` never fired. Fix: merge the standalone rewrite into `createAuthHook`, drop the standalone hook. Verification in DevTools Network: URL should be `https://api.nextbillion.io/optimization/v2/result?id=...&key=<apikey>`.
4. The rewrite gates on `process.env.NEXT_PUBLIC_NEXTBILLION_API_KEY` - confirm it is in the env file.
5. Predictor CORS: browser call blocked ("Disallowed CORS origin"); fix = same-origin Next API proxy `/api/predict`.

---

### Appendix 0 (full-length user messages: continuation summaries and long pastes)

### 1. `yarn install` appears to hang in the Link step
- User report: "seems blocked. I don't see anything consuming processor when running 'top'". The prompt was at `~/workspace/ncc` on `main`.
- First attempt `yarn install` stalled after the Resolution/Fetch steps (Completed in 0s 342ms / 0s 409ms) at the Link step, with `YN0007 ... must be built because it never has been before or the last one failed` for: maplibre-gl 2.3.0 and 2.4.0, core-js 3.36.1 and 2.6.12, core-js-pure 3.38.1, cypress 13.14.1, @swc/core 1.5.7, nx 19.6.5, @parcel/watcher 2.5.1, @tailwindcss/oxide 4.1.13, unix-dgram 2.0.6, @danmarshall/deckgl-typings 4.9.12, sharp 0.33.5, nice-napi 1.0.2, @sentry/cli 2.42.2.
- Second attempt: `CYPRESS_INSTALL_BINARY=0 yarn install --inline-builds` also got "stuck here now". `--inline-builds` is what exposes the build-script stdout/stderr (core-js banners, the `unix-dgram` gyp output, the `deckgl-typings` "indefinitely-typed installation" copy loop).
- Diagnostic that proved it was idle on a build log rather than the network:
  `lsof -p $(pgrep -f "yarn install" | head -1) 2>/dev/null | grep -E "TCP|REG" | head -30`
  The only writable (`22w`) file was `/private/var/folders/.../T/xfs-<hash>/build.log` with size 0; there were no TCP sockets. `top -l 1 -o cpu -n 5 | head -15` showed 76.86% idle, with only macOS daemons (`akd`, `ThemeWidgetContr`, `spotlightknowled`) near the top. So yarn was waiting on a child build script, not computing.
- Third attempt, with everything that can spawn nx or cypress work disabled:
  `NX_CLOUD_ACCESS_TOKEN= NX_NO_CLOUD=true NX_DAEMON=false NX_SKIP_NX_CACHE_INSTALL=true CYPRESS_INSTALL_BINARY=0 yarn install --inline-builds`
  This one finished: unix-dgram's `node-gyp` rebuild ended with `gyp info ok`, and Yarn printed `Completed in 5s 729ms` / `Done with warnings in 6s 697ms`. The user then asked "is 'yarn build' next?".
- Benign noise to ignore: node-gyp `-Wcast-function-type-mismatch` warnings in `unix_dgram.cc:404` and v8 `v8-persistent-handle.h:526:37` ("3 warnings generated."). Node-gyp found Python 3.14.2 (`/opt/homebrew/opt/python@3.14/bin/python3.14`) with node-gyp 10.2.0 and it worked. The YN0002/YN0060 peer-dependency warnings are noise and there are many; the summary line is `Some peer dependencies are incorrectly met; run yarn explain peer-requirements <hash> for details`.
- The related YN0060 mismatches that are reported but not fatal: `@emotion/react` 11.11.1 vs `@mui/material-nextjs`; `date-fns` 4.1.0 vs `@mui/x-date-pickers(-pro)`; `mapbox-gl` 1.0.0 vs `react-map-gl`; `react`/`react-dom` 18.3.1 vs `@nebula.gl/overlays` and `mui-datatables`.
- (The transcript's eventual permanent fix, `dependenciesMeta built:false`, is in the main digest, not in this file.)

### 2. `yarn nx build route-planner-v2` fails at the lint step
- Pasted output began with repeated `warning No cached ProjectGraph is available. The rule will be skipped. If you encounter this error as part of running standard nx commands then please open an issue on https://github.com/nrwl/nx @nx/enforce-module-boundaries` (printed once per linted file, hundreds of times, across `Linting and checking validity of types ...`). It is noise caused by running with the nx daemon/graph disabled. The real failure is the later line `Failed to compile.`
- Build-blocking lint errors from `next build` (all in `apps/route-planner-v2`):
  - `./app/sentry-example-page/page.tsx` 25:7 `Error: Use "@ts-expect-error" instead of "@ts-ignore", as "@ts-ignore" will do nothing if the following line is error-free.  @typescript-eslint/ban-ts-comment`
  - `./components/dialogs/creating-routes-dialog.tsx` 139:33 and 139:53 `Error: \`"\` can be escaped with \`&quot;\`, \`&ldquo;\`, \`&#34;\`, \`&rdquo;\`.  react/no-unescaped-entities`; 264:21 `Error: \`'\` can be escaped with \`&apos;\`, \`&lsquo;\`, \`&#39;\`, \`&rsquo;\`.  react/no-unescaped-entities`
  - `./components/dialogs/save-data-dialog.tsx` 79:12 same `'` unescaped-entities error
  - Everything else was a Warning only (`@typescript-eslint/no-unused-vars`, `@typescript-eslint/no-explicit-any`, `react-hooks/exhaustive-deps`, `@next/next/no-img-element`) and does not fail the build. Examples: `./app/(input)/page.tsx` unused `InputToolbar`, missing deps `initialize` / `dispatch.inputCore` / `isInitialized`; `./components/dialogs/solution-redierct.tsx` 232:6 missing dependency `region`.
- Lesson: `next build` runs ESLint and treats only `Error`-level rules as fatal. The three rule families that bit were `ban-ts-comment`, `react/no-unescaped-entities`, and (implicitly) anything at Error severity. Fix: replace `@ts-ignore` with `@ts-expect-error`, and escape quotes in JSX text as `&quot;`/`&apos;`.
- Possible hang cue: a later paste shows `ps -ef | grep -E "next-server|webpack|swc|nx build" | grep -v grep` returning only `node .../yarn nx build route-planner-v2` (started 8:45AM) and `top` at ~64-77% idle. A build with no compiler child processes and no CPU use means it is stalled in nx, not compiling (the user then "did option A", defined in the assistant text, which is not in this file).

### 3. `yarn next start` against a missing BFF: `getaddrinfo ENOTFOUND bff`
- `yarn next start -p 3000` (production mode, no env set) printed repeatedly:
  `TypeError: fetch failed ... at async j (.../.next/server/chunks/164.js:1:89586)` with `[cause]: Error: getaddrinfo ENOTFOUND bff` (`errno: -3008`, `hostname: 'bff'`, `digest: '788994571'`).
- Cause: the built bundle defaults `BFF_HOST` to the docker-compose style hostname `bff`. Without `BFF_HOST`/`NEXT_PUBLIC_BFF_HOST` at runtime there is nothing to resolve. Passing `ENV=test ... BFF_HOST=https://bff.nextbillion.ai NEXT_PUBLIC_BFF_HOST=https://bff.nextbillion.ai IAM_HOST=https://iam.nextbillion.ai IAM_CLIENT_ID=<id> yarn next start -p 3000` removed the DNS error (the middleware then logged `[MIDDLEWARE] GET / - ENV: TEST`), though the fetch error still appeared once for the first request.
- Note `HOST=http://localhost:3000` in that command collided with the port the user later gave the local BFF (see below); the BFF then ran on 3000 and Next moved to 3001.

### 4. Local BFF returns 500 on `/common/api_keys`: GCS permission denied for the wrong Google account
- With the BFF running locally ("bff is running locally now") and Next started as
  `ENV=preview NEXT_PUBLIC_ENV=preview HOST=http://localhost:3001 BASE=/route-planner NEXT_PUBLIC_BASE=/route-planner IAM_HOST=https://iam-stg.nextbillion.ai IAM_CLIENT_ID=<staging client id> yarn next start -p 3001`
  the Next server logged the BFF response `status: 500 ... url: 'http://localhost:3000/common/api_keys?apiKey=...'` (headers: Express, `content-length: 52`).
- The BFF-side log (`[Nest] ... ERROR [RequestLoggerMiddleware] GET /common/api_keys?apiKey=... 500 2239ms`) explains it:
  `LOG [ApiGatewayService] Downloading nbai api-key configuration file from gs://waymer/apikeys_stg/orgs_v2.`
  `ERROR [ExceptionsHandler] <email> does not have storage.objects.get access to the Google Cloud Storage object. Permission 'storage.objects.get' denied on resource (or it may not exist).`
  Stack frames: `@google-cloud/storage/build/src/nodejs-common/util.js` (`new ApiError`, `Util.parseHttpRespMessage`, `Util.handleResp`), `file.js:1007`, `retry-request/index.js`, `teeny-request`.
- User's diagnosis, verbatim: "it's picking up my Google account [EMAIL] and not allowing me to login with [EMAIL]". That is, the local BFF used Application Default Credentials (or the active gcloud account) belonging to a personal account instead of the work account that has `storage.objects.get` on the config bucket. It repeated identically at 9:16:58 AM (371ms). The ADC-versus-gcloud-account fix lives in the main digest (GCP project migration/ADC lesson); only the symptom and log lines are in this file.
- Pattern: `GET /common/api_keys` 500 plus `storage.objects.get` denied means a credential problem on the BFF host, not a frontend bug.

### 5. `next dev` shows `require-in-the-middle` "Critical dependency" warning and the app 404s
- `yarn next dev -p 3001` (with `BFF_HOST=http://localhost:3000 NEXT_PUBLIC_BFF_HOST=http://localhost:3000 HOST=http://localhost:4200 BASE=/route-planner`) logged:
  ```
  ⚠ ../../node_modules/require-in-the-middle/index.js
  Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
  Import trace: require-in-the-middle -> @opentelemetry/instrumentation -> @sentry/node (cjs/otel/instrument.js, cjs/index.js) -> @sentry/nextjs/build/cjs/index.server.js -> ../../libs/common/src/lib/components/global-error.tsx -> ../../libs/common/src/client.ts
  ```
  This is a known, harmless Sentry/OpenTelemetry webpack warning.
- The real problem in the same log:
  `[CommonLayoutRsc] Loading current org data for: nbai` then `[CommonLayoutRsc] Failed to load org data Response { status: 500 ... url: 'http://localhost:3000/waymer/v1/organizations.get?apiKey=...' }`, followed by `[AppContextProvider] currentUser { org: 'nbai', actualOrg: undefined, employeeType: ['owner','verified','google'], isAnonymousUser: false }`, `currentOrgData undefined`, `realOrgData undefined`, and `GET /route-planner 404 in 14638ms`. User: "getting 404 error".
- Lesson: the 404 on the page is a downstream symptom. Org data failed to load (BFF 500 from item 4), so the layout rendered no org and the route fell through to not-found. Read the BFF log first.
- Note the port juggling in these pastes: `HOST` was `http://localhost:4200` while Next listened on 3001. `HOST` must match the actual origin, or auth/redirect code that builds absolute URLs from it will misbehave (inference from the command lines; the transcript's own explanation is in the assistant text, not here).

### 6. User's CLAUDE.md request (first message, 2026-05-28)
- Verbatim ask: "Please analyze this codebase and create a CLAUDE.md file, which will be given to future instances of Claude Code ... Commands ... such as how to build, lint, and run tests ... how to run a single test. ... High-level code architecture ... 'big picture'. If there's already a CLAUDE.md, suggest improvements. ... do not include obvious instructions ... Avoid listing every component or file structure ... Don't include generic development practices ... include Cursor/Copilot rules and README parts ... Do not make up information such as 'Common Development Tasks', 'Tips for Development', 'Support and Documentation' ... prefix the file with: `# CLAUDE.md` / `This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.`"

### Appendix 1 (full-length user messages: continuation summaries and long pastes)

### Local dev env (2026-05-28 recap)
- **yarn install hang on nx postinstall**: Nx kept making HTTPS calls to Nx Cloud despite env vars. Fix: add to root `package.json`
  ```json
  "dependenciesMeta": { "nx@19.6.5": { "built": false } }
  ```
  (Env vars tried first: `NX_CLOUD_ACCESS_TOKEN= NX_NO_CLOUD=true NX_DAEMON=false NX_SKIP_NX_CACHE_INSTALL=true CYPRESS_INSTALL_BINARY=0 yarn install --inline-builds` — insufficient.)
- **CORS errors from `localhost:3001`**: BFF whitelist only includes `:4200`. Fix: run NCC on port 4200.
- **`ENOTFOUND bff`**: `fetcher-rsc.ts` has a `bffHostMap` that swaps `https://bff.nextbillion.ai` -> `http://bff:3000` when `env.PREVIEW` is false. Fix: set `ENV=preview`.
- **IAM redirect to console.nextbillion.ai**: wrong (prod) IAM client. Fix: `IAM_HOST=https://iam-stg.nextbillion.ai` + `IAM_CLIENT_ID=adac0e93-69ce-4f3d-936d-87867a04f0ce`.
- **BFF `{"statusCode":500,"message":"OpenAI API key is not configured"}`**: set `OPENAI_API_KEY` in the BFF's `.env.local` (`~/workspace/bff/.env.local`). User asked "where to set this".
- **Google credentials for BFF locally**: `gcloud auth application-default login` with the company account.
- **BFF local failure that looked like a frontend 404**: `GET /route-planner 404 in 16201ms`, console showed `[CommonLayoutRsc] Failed to load org data Response { status: 500 ... url: 'http://localhost:3000/waymer/v1/organizations.get?apiKey=...' }` and `currentOrgData undefined`. BFF log: `LOG [WaymerApiService] sending request to http://localhost:8080/v1/organizations.code.map` -> `ERROR [ExceptionsHandler] fetch failed TypeError: fetch failed at WaymerApiService.send (.../bff/src/maaas/waymer-api.service.ts:92:22) at WaymerApiService.refreshOrgCodeMap (...:67:17) at WaymerApiService.getOrgId (...:79:7) at WaymerController.all (.../waymer.controller.ts:224:19)`. Root cause: the BFF's upstream MAAAS service (`http://localhost:8080`) wasn't running/pointed correctly — the 404 on the page was a downstream symptom of `organizations.get` returning 500. User's wording: "getting these errors in BFF which I believe are causing the 404 errors to occur". (Related: `ERROR [RequestLoggerMiddleware] GET /common/api_keys?... 500` seen when the BFF couldn't download `gs://waymer/...` config locally; and `Downloading nbai api-key configuration file from gs://waym...` log line.)
- **`WATCHPACK_POLLING=true yarn next dev -p 4200`**: required because macOS fsevents didn't pick up edits (`didn't see a Compiled line (file watcher didn't catch the 'touch')`).
- **Non-fatal warnings to ignore**: `Critical dependency: require function is used in a way in which dependencies cannot be statically extracted` / `the request of a dependency is an expression` from `require-in-the-middle` and `@opentelemetry/instrumentation` via `@sentry/nextjs` (import trace ends at `libs/common/src/lib/components/global-error.tsx` / `libs/common/src/client.ts` / `./app/sentry-example-page/page.tsx`); React hydration warning `Extra attributes from the server: cz-shortcut-listen` (browser extension on `<body>`); `GET /.well-known/appspecific/com.chrome.devtools.json 404`; npm "New major version" notice.

### TypeScript errors surfaced by `npx tsc --noEmit --project tsconfig.json` (apps/route-planner-v2)
- `components/solution/opt-result-panel/item-route.spec.tsx(21,25): error TS2353: Object literal may only specify known properties, and 'service' does not exist in type 'StepWithLoad'.` (many lines, same cause — spec fixtures out of sync with type).
- `i18n/request.ts(22,33): error TS2345 ... Type 'Record<string, unknown>' is not assignable to type 'AbstractIntlMessages'. ... Type 'unknown' is not assignable to type 'string | AbstractIntlMessages'`. Fix used: type the message imports with `as const` instead of casting to `Record<string, unknown>`.
- `v3/features/solution/components/solution-toolbar.spec.tsx(84,30): error TS2352: Conversion of type 'UseBoundStore<StoreApi<SolutionState & SolutionActions>>' to type 'Mock<any, any, any>' may be a mistake ... If this was intentional, convert the expression to 'unknown' first.` (lines 84, 85, 89) — Zustand store mocked via direct cast; pre-existing spec typing debt.

### next.config composition order
- **404 on `/route-planner` after adding i18n**: `withNextIntl(withNx(...))` clobbered `basePath`. Fix: reorder to `withNx(withNextIntl(...))`.

### Docker / Cloud Run build for the standalone image (2026-05-29 .. 2026-06-01)
- **Terraform plan error**: `Error: "account_id" ("route-planner-v2-staging-runtime") doesn't match regexp "^[a-z](?:[-a-z0-9]{4,28}[a-z0-9])$"` on `google_service_account.runtime` (`service_account.tf` line 2, `account_id = "${var.service_name}-runtime"`). GCP service-account ids max 30 chars. Fix: `account_id = "${var.service_name}-sa"`. (Same plan showed `Plan: 6 to add, 0 to change, 0 to destroy.` including `google_secret_manager_secret_version.placeholder["DEMO_NCC_TOKEN"]` with `secret_data (sensitive value)` — a placeholder secret version so Cloud Run can reference `latest` before the real token is added.)
- **terraform `deploy_hint` output** (the canonical deploy command shape):
  ```
  # From the monorepo root:
  gcloud auth configure-docker us-central1-docker.pkg.dev
  TAG=$(git rev-parse --short HEAD)
  IMAGE=us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging:$TAG
  docker build --platform linux/amd64 \
    --build-arg NEXT_PUBLIC_BFF_HOST=https://bff-staging-[GCP_PROJECT_NUMBER].us-central1.run.app \
    --build-arg NEXT_PUBLIC_IAM_HOST=https://iam-stg.nextbillion.ai \
    --build-arg NEXT_PUBLIC_IAM_CLIENT_ID=d9883f93-dcbc-44d5-ade8-2af69d29599d \
    -f apps/route-planner-v2/Dockerfile.staging \
    -t $IMAGE .
  docker push $IMAGE
  cd apps/route-planner-v2/infra/terraform
  terraform apply -var="image_tag=$TAG"
  ```
  Later invocations also pass `--build-arg NEXT_PUBLIC_ENV=test`. Output `image_repo = "us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2"`.
- **Static assets 404 on Cloud Run** (`curl -sS -o /dev/null -w "%{http_code}\n" https://<service>/route-planner/_next/static/chunks/1dd3208c-22a9e1b7a799a03c.js` -> `404`, user: "tons of 404 erros when loading the app", "still issues with loading assets. bff stuff is working"). Diagnosis steps that worked: (1) `curl ... /route-planner | grep -oE 'src="[^"]*\.js"'` to see what URLs the HTML references; (2) `docker run --rm "$IMG" sh -c "ls /app/apps/route-planner-v2/.next/static/ ..."` to see where chunks actually are; (3) `docker run --rm "$IMG" cat /app/apps/route-planner-v2/server.js` which revealed `"distDir":"./../../dist/apps/route-planner-v2/.next"`. Root cause: Nx overrides Next's `distDir` to `dist/apps/route-planner-v2/.next`, so the standalone server looks for static assets under `/app/dist/apps/route-planner-v2/.next/static`, not `/app/apps/route-planner-v2/.next/static`. Fix: Dockerfile COPY the static dir (and `public`) to the `dist/...` location.
- **Redirect to `https://0.0.0.0:8080/` from `/dev-login` on Cloud Run** (`curl -sS -i -L .../route-planner` showed `HTTP/2 307 location: https://0.0.0.0:8080/` then `curl: (7) Failed to connect to 0.0.0.0 port 8080`). Cause: `NextResponse.redirect(new URL(...))` inside standalone server uses `HOSTNAME=0.0.0.0` as host. Fix: return `new NextResponse(null, {status: 307, headers: {Location: '/route-planner/...'}})` with a relative `Location`. Verified afterwards: `curl -sS -i ".../route-planner/dev-login?next=/"` -> `HTTP/2 307 location: /` with two `set-cookie` headers.
- **Shell gotcha while diagnosing**: a multi-line `IMG=$(gcloud run services describe ... \n --format=...)` pasted into zsh broke (`zsh: command not found: --format=value(spec.template.spec.containers[0].image)`) and then `docker: invalid reference format: repository name (...) must be lowercase`. Fix: keep the gcloud command on one line: `IMG=$(gcloud run services describe route-planner-v2-staging --region=us-central1 --format='value(spec.template.spec.containers[0].image)')`. Similarly `... | head\n -20` split -> `zsh: command not found: -20`.
- **Docker build host warning**: `WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8)` — expected on Apple Silicon when building with `--platform linux/amd64`; it is slow (builds took 250-700s: `yarn install --immutable` ~300s, `yarn nx build` ~250-380s; build context ~300MB transfer).
- **Missing `.yarn/plugins` in Docker build**: corepack/yarn failed. Fix: `COPY .yarn/plugins ./.yarn/plugins` (Dockerfile order: package.json yarn.lock .yarnrc.yml -> `.yarn/releases` -> `.yarn/plugins` -> `tsconfig.base.json nx.json` -> `apps libs tools` -> `RUN yarn config set nodeLinker node-modules && yarn install --immutable` -> `RUN yarn nx build route-planner-v2 --skip-nx-cache`). Base image `node:22-alpine`, `corepack enable`.
- **`Invalid next.config.js options detected: Unrecognized key(s) in object: 'outputFileTracingRoot'`** (Next 14.2.28 warning): `outputFileTracingRoot` must live under `experimental` in 14.x (the generated server.js shows it under `experimental.outputFileTracingRoot` as well as top-level). Warning only; build continued.
- **Build failure #1 (2026-05-31), `yarn nx build route-planner-v2:build:production` in Docker**: `./components/dialogs/solution-redierct.tsx:131:7 Type error: Type 'Partial<import("/workspace/node_modules/@mui/x-data-grid/models/api/gridLocaleTextApi").GridLocaleText>' is not assignable to type 'Partial<import("/workspace/node_modules/@mui/x-data-grid-pro/node_modules/@mui/x-data-grid/...").GridLocaleText>' ... The type 'readonly GridSortDirection[]' is 'readonly' and cannot be assigned to the mutable type 'GridSortDirection[]'.` Cause: two copies of `@mui/x-data-grid` (hoisted root copy vs nested copy under `@mui/x-data-grid-pro/node_modules`) whose types differ; locale packs imported from `@mui/x-data-grid/locales` come from the root copy while `DataGridPro` uses the nested one. (Local dev tolerates it because `ignoreBuildErrors` / type errors don't block dev; Docker prod build runs the type check: log shows `Checking validity of types ...` then `Failed to compile.`.) Fix pattern: import locales from `@mui/x-data-grid-pro/locales` or cast `localeText` to the DataGridPro prop type.
- **Build failure #2 (2026-06-01)**: `./components/input/input-panels/preferences/connection-panel.tsx:23:42 Type error: Parameter 'c' implicitly has an 'any' type.` at `const connection = connections.find((c) => c.id === Number(value))`. Lesson: local `next dev` does not enforce full type-check; the Docker `nx build` does, so errors only appear at image build time (each ~5-6 minute iteration). Run `npx tsc --noEmit` (or `yarn nx typecheck`) before building images.
- **Build failure #3**: `Type error: Module '"../data-mapper/mapping-config/interface"' has no exported member 'DataMapOptionType'.` (another wrong-import-path error of the same family as the `MapInputType` mistake).
- **Build failure #4/#5 (2026-06-01) — prerender**: after type-check passed and `✓ Generating static pages (11/11)`: `ReferenceError: Cannot access 'P' before initialization at Object.M (/workspace/dist/apps/route-planner-v2/.next/server/app/(input)/page.js:70:569972)` ... `Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error` ... `> Export encountered errors on following paths: /(input)/page: /`. Minified-name TDZ error = circular import between modules evaluated in the `(input)` page bundle (barrel/cycle), triggered only in production (minified, module-order differs from dev). Appeared twice with identical stack (digest `2107460610`). Log line `[ky:api.ts] module loaded BUILD-2026-05-29-A token cookie? false` during static generation confirms client modules are executed at build.
- **Docker daemon flakiness**: `ERROR: failed to build: request returned 500 Internal Server Error for API route and version http://%2FUsers%2F...%2F.docker%2Frun%2Fdocker.sock/_ping, check if the server supports the requested API version` and `failed to connect to the docker API at unix:///Users/.../.docker/run/docker.sock; check if the path is correct and if the daemon is running: dial unix ...: connect: no such file or directory`. Fix: restart Docker Desktop, retry.
- **DEP0060** `util._extend` deprecation warning from node 18/22 toolchain is noise.

### Terraform clobbering manual env vars
- **`CONFIG_PATH` / `NCC_CONFIG_BUCKET` wiped by `terraform apply`** on bff-staging: they had been set by hand (`gcloud run services update`). Recommendation recorded: add them to the bff terraform `cloud_run.tf` so they persist. After the user did so, verified with
  `gcloud run services describe bff-staging --region us-central1 --project [GCP_PROJECT] --format='value(spec.template.spec.containers[0].env)' | tr ',' '\n' | grep -i -E "bucket|config_path"` -> shows `NCC_CONFIG_BUCKET = [GCP_PROJECT]-ncc-config` and `CONFIG_PATH`.

### Appendix 2 (full-length user messages: continuation summaries and long pastes)

### Next.js Server Actions 1MB body limit (Generate Route 500)
- Symptom (user): "getting a 500 error when clicking 'Generate Route' payload shows 'undefined' in jobs". The pasted payload was ~2MB (FEMSA_TEST_6DAY_PLAN: 480 vehicles = 60 reps x 6 days MON-15..SAT-20, ~1976 jobs, 10 zones `geofence_id: "cluster-N"`, `description: "FEMSA_TEST_6DAY_PLAN"`; jobs carry `location_index` into `locations.location[]`, several jobs share a `location_index`).
- User ruled out the optimiser: "it's not a problem with the size of the input (number of jobs and vehicles). I can run the same request against the route optimization service directly and with the same API key and get a valid request ID returned. When the 500 error is returned, there's nothing in the response - just the indication of a 500 error."
- Root cause: Next.js 14 Server Action default body limit of 1MB. The failing call was `actions/server/configure.ts` `_saveConfig` / generate-route path.
- Fix in `apps/route-planner-v2/next.config.js`:
  ```js
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  ```
  User confirmed: "that resolved the issue". Lesson: a 500 with empty body and a payload > 1MB means check the framework body limit before the optimiser or BFF.
- Process lesson: the assistant had listed speculative root causes (`location_index` dedup, `pickup:[1]`); the correct move was to ask for the server error body and compare with the direct API call. The user's "works direct against the API" observation isolated the layer.

### gcloud logging tail / Python path
- `gcloud beta logging tail` failed with `ERROR: ... Please ensure that the gRPC module is installed`. Workaround: poll with `gcloud logging read` instead of live tail. (Alternative would be installing grpc into gcloud's Python.)
- `zsh: no such file or directory: /opt/homebrew/share/google-cloud-sdk/bin/python3`: find the real interpreter with
  ```
  gcloud info --format="value(basic.python_location)"
  ```
- User question that triggered it: "what command to retrieve cloud run logs for bff service".

### Cloud Run deploy command shapes (route-planner-v2-staging)
- User: "what's the gcloud deploy command for route-planner-v2 deploy" and later "what is the gcloud run command for updating route-planner-v2-staging to latest deployed image - identified by $TAG env variable".
- Canonical (Terraform-mediated) flow documented in `apps/route-planner-v2/infra/terraform/README.md`:
  1. `docker build --platform linux/amd64 ...` (the `--platform` flag is required on Apple Silicon) with build args `NEXT_PUBLIC_BFF_HOST`, `NEXT_PUBLIC_IAM_HOST`, `NEXT_PUBLIC_IAM_CLIENT_ID` (NEXT_PUBLIC values are baked at build time).
  2. Push to `us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging:$TAG`.
  3. `terraform apply -var="image_tag=$TAG"` from `apps/route-planner-v2/infra/terraform`.
- Raw gcloud alternative (mutates the shared service; assistant would only run it with explicit confirmation):
  ```
  gcloud run services update route-planner-v2-staging --image=$IMAGE --region=us-central1 --project=[GCP_PROJECT]
  ```
  where `IMAGE=us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging:$TAG`.
- Drift note: the Terraform README does not set `lifecycle ignore_changes` on the image, so a `gcloud run services update` creates drift that the next `terraform apply` reverts unless it passes the same `image_tag`.
- Required IAM for the deployer: `roles/run.developer` + `roles/artifactregistry.writer`. Retrieve the service URL after deploy with `gcloud run services describe`.

### Salesforce OAuth (PKCE) errors
- `missing required code challenge`: PKCE was opt-in via `NEXT_PUBLIC_SF_OAUTH_PKCE === 'true'`. Fix: `utils/salesforce/constants.ts` `SF_OAUTH_USE_PKCE` default flipped to true (opt-out when `=== 'false'`).
- `invalid_client_credentials`: first tried HTTP Basic auth (copied from a demo); still failed. Per Salesforce PKCE docs, when the Connected App has "Require PKCE", `client_id`/`client_secret` go in the request BODY, not Basic auth. Files: `app/api/integrations/salesforce/callback/route.ts` and `.../token/route.ts`. Added diagnostic `console.log` of clientId prefix, secret length, env-var presence, redirectUri, `hasCodeVerifier` (log lengths/prefixes, never the secret).

### Locale / library lookups
- MUI X DataGrid Pro Polish locale: verified at runtime rather than guessing:
  ```
  node -e "const m = require('@mui/x-data-grid-pro/locales'); console.log(Object.keys(m).filter(k => k.startsWith('pl')))"
  ```
  returned `['plPL']`.
- Polish ICU plural needs all categories: `{count, plural, =0 {...} =1 {...} few {...} many {...} other {...}}`.
- Deep SCSS-module import into the shared lib (`@ncc/route-planner-components/src/lib/components/map-tooltip.module.scss`) did not resolve (no subpath alias; CSS-module hashes are per import). Fix: inline styles mirroring the SCSS.

### Runtime errors from module shadowing / interop
- `TypeError: Supercluster is not a constructor`: Webpack wraps the CJS default export inconsistently. Import as namespace and unwrap: `(ns.default ?? ns)`.
- `TypeError: react_map_gl__WEBPACK_IMPORTED_MODULE_3__.default is not a constructor` / `react_map_gl Map is not a constructor` ("1 of 1 error..."): `import Map from 'react-map-gl'` shadows the global `Map`; `new Map<unknown, any>()` instantiated the react-map-gl component. Fix: plain objects, `const jobById: Record<string, any> = {}; jobById[String(job.id)] = job`. (This bit the project several times; grep `new Map(` in any file that imports react-map-gl `Map`.)

### Basemap styles
- TomTom `basic_main` (v20.3.2-3) has no POI layers at all. For POIs use `basic_street-light` / `basic_street-dark` (v22). Constant added in `libs/route-planner-components/src/lib/components/map-style-selector.tsx`:
  ```ts
  export const MAP_TT_BASIC_STREET_LIGHT_URL = `https://${MAP_TILE_HOST}/tt/style/1/style/22.2.1-9?map=2/basic_street-light`
  export const MAP_VIEW_STYLE_OPTIONS_WITH_POIS: StyleItem[] = [...]
  ```
  `transformStyleSpec` / `transformMapStyleJson` take `{includePois?: boolean}`; `utils/map-style.ts` `getMapStyleUrl` and `useMapStyle` take the same option and cache by URL + flag.
- First attempt only filtered POI layers on `basic_main`; user screenshot ("not seeing POI markers on geocoding tool map") proved the style itself lacked them.

---

### Appendix 3 (full-length user messages: continuation summaries and long pastes)

### Cloud Run secret rotation: the wrong-secret-name trap (2026-06-30 / 07-06)
User ran:
```
echo -n '<JWT>' | gcloud secrets versions add DEMO_NCC_TOKEN --project=<proj> --data-file=-
gcloud run services update route-planner-v2-staging --region=us-central1 --update-secrets=DEMO_NCC_TOKEN=DEMO_NCC_TOKEN:latest
```
Exact errors:
```
ERROR: (gcloud.secrets.versions.add) NOT_FOUND: Secret [projects/<number>/secrets/DEMO_NCC_TOKEN] not found. This command is authenticated as <email> which is the active account specified by the [core/account] property.
Deployment failed
ERROR: (gcloud.run.services.update) spec.template.spec.containers[0].env[9].value_from.secret_key_ref.name: Permission denied on secret: <secret> for Revision service account <sa>. The service account used must be granted the 'Secret Manager Secret Accessor' role (roles/secretmanager.secretAccessor) at the secret, project or higher level.
```
Root cause: the Terraform-created secret is `route-planner-v2-staging-demo-ncc-token` (pattern above), never `DEMO_NCC_TOKEN`. Someone had earlier run `gcloud run services update` pointing the env var at the nonexistent literal `DEMO_NCC_TOKEN`, so the revision referenced a secret that was never created and the SA had no accessor role on it. Fix (exact shape):
```bash
echo -n '<JWT>' | gcloud secrets versions add route-planner-v2-staging-demo-ncc-token \
  --project=<proj> --data-file=-

gcloud run services update route-planner-v2-staging \
  --region=us-central1 --project=<proj> \
  --update-secrets=DEMO_NCC_TOKEN=route-planner-v2-staging-demo-ncc-token:latest
```
Check what the Terraform name is by reading `secrets.tf`, not by guessing the env-var name.

### Full token rotation runbook (as practiced across sessions)
1. Mint a token from the correct IAM console. Verify before deploying by decoding the JWT payload: `iss` must equal the deployed `IAM_HOST` (`https://iam-stg.nextbillion.ai` for staging), `aud`/`cid` must equal the deployed `IAM_CLIENT_ID` (`d9883f93-dcbc-44d5-ade8-2af69d29599d` staging), and `exp` in the future. Real incident (2026-07-06): the first replacement token had `iss=https://iam.nextbillion.ai` and `aud=7a503418-...e042` (PROD) so it would be rejected by the staging service; the agent told the user to mint from the staging console. The accepted token had `iss: https://iam-stg.nextbillion.ai`, `aud/cid: d9883f93-...599d`, `iat 1782824704` (2026-06-30), `exp 1784034304` (~14 days), `employeeType: ["owner","verified","google"]`.
2. Add a new secret version: `echo -n '<JWT>' | gcloud secrets versions add <terraform-secret-name> --project=<proj> --data-file=-` (for a file source: `tr -d '\n' < demo-jwt.txt | gcloud secrets versions add ... --data-file=- --project=<proj>` and it reported `Created version [2]`). Use `echo -n`/`tr -d '\n'` so no trailing newline lands in the token.
3. Because the Terraform secret reference uses `version = "latest"`, Cloud Run caches the value per revision. Force a new revision: `gcloud run services update route-planner-v2-staging --region=us-central1 --project=<proj> --update-labels=demo-token-refresh=$(date +%s)` (result: new revision `route-planner-v2-staging-00003-69g` serving 100 percent).
4. Clear the stale `ncc_token` cookie in the browser (cookie lives 7 days with `httpOnly:false`); 2026-06-25 symptom: "I added an updated NCC_TOKEN to .env.local. Ran a new build and deploy to GCP. I'm still seeing the previous NCC_TOKEN getting set in my cookies" — `.env.local` is irrelevant for Cloud Run; the value comes from Secret Manager.
5. Local run stale-token symptom (2026-07-11): "when I'm running locally against localhost, I still get the June 26 expired token" — fix was replacing the token on `apps/route-planner-v2/.env.local:15` (also restart the dev server).
6. `/dev-login` "Uh-oh! Something went wrong" (2026-06-25): the URL was missing the `/route-planner` basePath. Correct: `https://<service>/route-planner/dev-login`.

### Deploy commands (README, `apps/route-planner-v2/infra/terraform/README.md`)
```
gcloud auth configure-docker us-central1-docker.pkg.dev
TAG=$(git rev-parse --short HEAD)
IMAGE=us-central1-docker.pkg.dev/<project>/route-planner-v2/route-planner-v2-staging:$TAG
docker build --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_BFF_HOST=https://bff-staging-<project-number>.us-central1.run.app \
  --build-arg NEXT_PUBLIC_IAM_HOST=https://iam-stg.nextbillion.ai \
  --build-arg NEXT_PUBLIC_IAM_CLIENT_ID=d9883f93-dcbc-44d5-ade8-2af69d29599d \
  -f apps/route-planner-v2/Dockerfile.staging \
  -t $IMAGE .
docker push $IMAGE
cd apps/route-planner-v2/infra/terraform
terraform apply -var="image_tag=$TAG"
```
Then read the `service_url` output and visit `<service_url>/route-planner`. `--platform linux/amd64` is mandatory on Apple Silicon. Terraform state is local and `terraform.tfstate` already exists, so bootstrap is done and only the deploy steps are needed (user request: "just want to deploy the route-planner-v2 app using existing terraform infra setup").

### Moving to a new GCP project (2026-08)
- User edited `terraform.tfvars` (`project_id`) and asked "Test the build and deploy against this new project_id".
- Terraform state still had old-project references. Safe approach used: rename `terraform.tfstate` to `terraform.tfstate.old-project-20260805-1052`, run a fresh `terraform init`, leaving the old project untouched.
- `gcloud config set account` does NOT change Application Default Credentials. The deployer account had owner on the new project but ADC still pointed to a different person; fix the user ran (via `!` prefix): `gcloud auth application-default login --account=<email>`. Output confirms "Credentials saved to file: [~/.config/gcloud/application_default_credentials.json]" and 'Quota project "<proj>" was added to ADC'.
- First Cloud Run create failed with a bare "internal error": IAM propagation race between SA/secret creation and service startup. Retrying resolved it (the second retry also failed once; the third succeeded after a manual test-bootstrap deploy proved the base infra was fine).
- After bootstrap, the new project's `DEMO_NCC_TOKEN` secret held the placeholder `REPLACE_ME`, giving frontend error `Error: Forbidden resource at Object.loadPreferenceList...` (HTTP 403 from BFF). The old project's secret could not be read from the new account. Fix: user put a fresh iam-stg JWT in `.env.local` (valid 2026-08-05 to 2026-08-19); agent pushed it as secret version 2 and rolled a revision with the label trick above. Cloud Run returned a different hostname form (`route-planner-v2-staging-<number>.us-central1.run.app` vs the earlier `...-uc.a.run.app`); both point to the same service.

### Cloud Run resource sizing for the HiGHS WASM pipeline
- Symptom on the deployed app: "pipeline finished without returning a result" (user guessed timeout). Cause: OOM at the default 512MiB. Fix in `cloud_run.tf`: `timeout = "900s"`, memory `2Gi`, cpu `2`, `cpu_idle = false`, `startup_cpu_boost = true`. The route handler itself also needs `runtime = 'nodejs'` and `maxDuration = 300`.
- `fetch failed` from `libs/common/src/lib/utils/fetcher-rsc.ts (66:20)` during a long build: raised from `CommonLayoutRsc` calling the BFF, not from the territory code. BFF reachability was verified with curl; hypothesis recorded: event loop blocked by synchronous HiGHS WASM solving during the pipeline.
- Local V8 OOM at 211k POS (CSV `public/data/ZIPREQ5715.csv`, 211,196 data rows): `FATAL ERROR: invalid table size Allocation failed - JavaScript heap out of memory`, GC lines `Scavenge 5797.8 (5916.0) -> 5797.8 (5916.0) MB ... allocation failure`, `Mark-Compact 6565.8 (6684.0) -> 5333.2 (5875.7) MB`, stack top is `NumberDictionary` rehash (`Runtime_KeyedStoreIC_Slow`) i.e. sparse array/object keyed by integer ids grown huge, run under `node@20.19.4`. User asked: "are there additional reductions in problem size that can be done". Outcome: explained the scale ceiling and added a client-side deterministic stride sample in `preview-table.tsx` (`SampleControl`):
  ```tsx
  const stride = n / target
  const picked: string[] = []
  for (let i = 0; i < target; i++) picked.push(filteredRows[Math.floor(i * stride)].matricula)
  onSelectionChange(picked)
  ```
  The sampled selection is what gets sent to the pipeline (filter scopes what is sent, not just displayed).

### ESM / CJS interop and Next config
- Build error `Module not found: ESM packages (d3-delaunay) need to be imported. Use 'import' to reference the package instead.` Fix: `await import('d3-delaunay')` inside the async `buildBoundaries` function (CJS module can't `require` ESM); polygon-clipping converted the same way for safety. Also list server-only packages in `serverComponentsExternalPackages`.
- `/territory-planner` 404 locally: missing `/route-planner` basePath; use `http://localhost:4200/route-planner/territory-planner`.
- Server Action body limit raised via `experimental.serverActions.bodySizeLimit: '10mb'` (same 1MB-default lesson as elsewhere in the project).

### Dependency / tooling gotchas seen in the summaries
- `papaparse` not resolvable from a scratchpad script outside the repo: switched to an inline RFC-4180 CSV splitter that handles quoted commas.
- `awk -F,` breaks on `LAT_LONG` values like `"lat, lng"` and on quoted address fields with embedded commas; use Papa at runtime or Python's `csv` module for one-off mutations (used Python `csv` to set `FREQUENCIA DE VISITAS=0.25` on all 211,196 rows of `ZIPREQ5715.csv`).
- Locale JSON validation after edits: `node -e "JSON.parse(require('fs').readFileSync('<file>','utf8'))"` over all 5 locale files returned OK.
- The `.git` re-init procedure (user: "I want to create an initialize a new repo with the ncc project here https://github.com/mbsoft/ncc"): agent paused before touching remotes (origin was `git@github.com:nextbillion-ai/ncc.git`, branch `feat/route-planner-v2-misc-enhancements`, uncommitted work). After a 3-question AskUserQuestion (repo exists empty, fresh init single commit, replace origin): `mv .git .git.backup-2026-07-24-194503`, `git init -b main`, `git add .`, noticed the backup directory was staged, `git rm -r --cached .git.backup-2026-07-24-194503` and appended `.git.backup-*` to `.gitignore`. Found `.env` files not ignored and a dev IAM credential in plaintext in `apps/route-planner-v2/.env`; user said "Include as-is". Result: 2103 files (no `node_modules`, `.next`, `dist`), commit `855cc7c "Initial commit"`, `git remote add origin git@github.com:mbsoft/ncc.git`. The agent asked a second confirmation (user answered "Not yet"), then user said "push it"; `git push -u origin main` created `main` tracking `origin/main`. Rollback recipe: `rm -rf .git && mv .git.backup-2026-07-24-194503 .git`.

## Debugging patterns that worked

### Transcript part A (chunks 1-3)

### A. Process-level triage for "silent hang" (install / build)
Repeatable ladder: (1) `ps -o pid,stat,etime,command` on the wrapper; (2) `pgrep -lP <pid>` to see if it has children (none = parked itself); (3) `lsof -p <pid> | grep -iE "TCP|sock"` — a lone ESTABLISHED HTTPS socket to a cloud IP = network call stuck; (4) `lsof -a -p <child> -d cwd` to learn *which package* is running; (5) `sample <pid> 1 100` (macOS stack snapshot) to see if native runtime threads are idle on `kevent`; (6) check the empty `build.log` in yarn's tmp `xfs-*` dir. Empty log + `S+` state = zero output in lifetime.

### B. "My change doesn't show" — prove which build/file is being served
- Screenshot clues (light map, colored PNG pins, OSM attribution) = all three edits missing → running server was the pre-edit production build; use `next dev` after edits.
- Confirm the code is in the bundle: `grep -l "<string>" .next/static/chunks/*.js`; or in the browser console `fetch(location.href).then(r=>r.text()).then(h=>console.log(h.includes('change language')))`; DOM probe `document.querySelectorAll('[aria-label="change language"]').length`.
- `grep -n "LocaleSwitcher" <file>` proves edit is on disk. `touch` + watch dev terminal for `✓ Compiled` proves the watcher.
- **Root cause of the "globe icon missing on solution page" saga:** wrong file. `page.tsx` imports `SolutionToolbar` from `'../../../v3/features/solution'`, while the assistant had edited `components/solution/solution-toolbar.tsx`. Console probe `bc?.parentElement?.nextElementSibling` → `undefined` (right-side Stack doesn't exist in rendered DOM) was the decisive clue. Lesson stated by assistant: `grep -rln "solution-toolbar"` surfaced both files but first match was trusted. **Always trace the route's `page.tsx` imports, don't trust the first grep hit.** The same legacy-vs-v3 mistake recurred: manifest/step card, result-panel, tabs were all v3 files (`page.tsx` tabs; `result-panel.tsx` Routes/Unassigned; `step-card.tsx`).
- Misc console gotchas observed: user pasted JS into the Console *filter box* (funnel icon) instead of the `>` prompt; user showed Network tab when Console was needed.

### C. Locating where an env value really comes from
Three possible sources for `BFF_HOST` on the client: runtime env, `getConfig()`, build-time `process.env.NEXT_PUBLIC_*`. Read `env-utils.ts:3-9` → App Router always falls back to the inlined build-time value. Verify with `grep -l` on `.next/static/chunks`.

### D. Coordinate-order bug (lasso selects 0 jobs)
User: "when I close this polygon [image] I end up with 0 jobs selected eventhough I've enclosed a large number of them". The assistant first assumed jobs store `"lat,lng"`; reading the parser showed stored canonical format is **`"lng,lat"`** (`parseLocationLatLng` reverses). The helper `parseLngLat` destructured as `[lat, lng] = parts` and returned `[lng, lat]`, silently swapping → points landed in the Atlantic. Fix: trust stored order, return `parts` as `[lng, lat]` for `turf.booleanPointInPolygon`. Lesson: before writing any geo helper, read the parser that writes the stored value.

### E. Click capture under DeckGL
Lasso tool: "selected 'lasso' tool on preview map and clicking on the map doesn't start the polygon build". `<DeckGL>` wraps `<Map>` in preview-map (it does not in v3 `<BaseMap>`); DeckGL's canvas overlays the Map and steals clicks, so a capture div inside `<Map>` sits beneath it. Fix: render the capture div as a **sibling of `<DeckGL>` at `z-index: 1000`**; keep dashed polygon `Source`/`Layer` and vertex `Marker`s **inside `<Map>`** (need react-map-gl context); share draft state between the two via a `useLassoDraft(active)` hook. Wheel events forwarded to the map canvas so zoom still works; map drag disabled while drawing; Esc cancels; close = double-click or click within 12px of first vertex.

### F. `MapInputType` undefined at runtime
Import error (screenshot) when `LOCATION_TYPES = new Set([MapInputType...])` was built: `MapInputType` is not re-exported by `options/interface.ts` (it only imports it); import from `mapping-config/interface`. Check how sibling modules import an enum when one comes back `undefined`.

### G. `dayjs.locale(navigator.language)` clobbering locale sync
Manifest dates reverted to English month names. Cause: `formatToTimeStr` in `libs/common/.../format.ts` called `dayjs.locale(navigator.language)`, overriding `DayjsLocaleSync`. Fix: remove that override; global dayjs locale then governs `formatToDateStr` (`'MMM D, YYYY'` → `10 de jun. de 2026`). `formatDuration` hardcoded `hrs/mins/secs` → added a `labels` option plus `useFormatDuration` hook (keys `solution.dur_years…dur_secs`); output e.g. `08 h 47 min 35 s`, `02 h 49 min 44 s`, `—` as empty fallback. Map info-window local `formatDuration` deleted in favour of the hook.

### H. Time-window filter not matching
User: "time window filters aren't working". Assistant verified the pickers read `state.inputCore.preferences.timezone` (`JobFilterBar:13-15`) and `.unix()` matches stored unix-second scale. Added `ampm={false}` (24h), `LocalizationProvider adapterLocale={dayjsLocale}` with eager imports `dayjs/locale/{en,pt-br,es-mx}`, and a diagnostic `console.debug('[JobFilterBar] apply', {total, matching, timeFilterRejections, noTimeWindows, startUnix, endUnix, sampleJobTws})`. Hypotheses listed: wrong-timezone unix, filter only controls *selection* not *visibility* (by design), different `time_windows` shape. (Outcome not recorded in this part of the transcript.)

### I. Cloud Run placeholder detection
When JSON parse fails on a 200, `curl` the endpoints directly; Google's "Congratulations | Cloud Run" page = no real container. See Setup §10.

### J. Browser-side evidence beats guessing
Where assistant could not drive a browser, it supplied exact DevTools one-liners (DOM count, `getBoundingClientRect`, `getComputedStyle`, `fetch(location.href)` HTML check) and asked for a single number — and said so explicitly ("I don't have direct browser-control tools available").

---

### Transcript part B (chunks 4-6)

1. **Make the failure comparison decisive**: sending no token / valid token / garbage token and getting the *same* 403 proved the guard-before-auth was failing for a different reason (audience), not the token. Similarly, identical 403 on two unrelated endpoints proved the API key wasn't the problem.
2. **Latency as a clue**: 403s in **0–1 ms** = AuthGuard `if (!idToken) return false` (no token reached BFF); 200s at 231/882 ms = JWKS verification ran. Compare the same URL across a log batch (`16:17:37 200 231ms`, `16:17:45 403 0ms`).
3. **Read the guard source**: `auth.guard.ts` revealed aud check and the dev-mode mock user; the BFF is the real IAM gate.
4. **Read cloud logs for the true cause**: `gcloud run services logs read bff-staging --region us-central1 --project [GCP_PROJECT] --limit 30 | grep -i -E "api[-_]?key|gs://|downloading|error"` — the `Downloading ... from gs://...` line immediately tells which bucket/path the service uses and the next line gives the IAM error.
5. **Distinguish browser-direct vs server-side calls**: dialog URL `bff-staging-…run.app/...` in the browser means a browser→BFF call, so `localhost:4200` cookies won't be sent; need `Authorization` header. Server actions never expose the BFF URL.
6. **Instrument to find which code path runs** (when edits "have no effect"): added sentinel `console.log('[ky:client.ts] module loaded BUILD-2026-05-29-A')` and per-hook logs (`[ky:apiKeyHook]`, `[ky:authHook] token? true url: ...`), plus `[OptimizationApi.getResult] called`. Outcome table: both module logs + no hook log ⇒ request not passing through that pipeline / pipeline ordering bug. Result: `[ky:apiKeyHook]` fired 3× and `[ky:authHook]` never ⇒ **ky ends the beforeRequest chain when a hook returns a `Request`**. Fix: merge apiKey + auth into **one hook** that mutates both. (Debug logs were left in `client.ts`, `api.ts`, `optimization.api.ts` — to be removed after demo.)
7. **When a fix "doesn't work", find all parallel code paths before repeating restarts**: second geocode failure came from `fetch` imported from `@ncc/common/client` (`fetcher-client.ts`, gated `Authorization` behind `env.PREVIEW`), not `useFetch` that was patched first. A diagnostic log `[useFetch:authHook] ... tokenPresent=` showing nothing exposed that. The user's pasted import line (line 1 of the failing module) was the clue. Final fix: `fetcher-client.ts:21-30` attaches `Authorization: Bearer <ncc_token>` for every relative request whenever the cookie is present. Same gating existed in `v3/api/api.ts:37` (`getAuthToken: () => (env.preview() ? Cookies.get(TOKEN_COOKIE) : undefined)`), fixed to always attach when present. Works historically because TEST mode used a same-origin local BFF with cookies.
8. **Check the 401/403 against CORS** before blaming code: preflight with `Access-Control-Request-Headers: authorization` returned `access-control-allow-headers: authorization`; curl with `Authorization: Bearer <jwt>` returned 200 with the full solution (8 routes, 0 unassigned) proving BFF fine and bundle stale.
9. **Stale `apikey=opensesame` cookie**: if `apiKey=opensesame` appears in a failed URL it's always the stale `apikey` cookie (value happened to be in nbai's key list, so it "matched"). Fix: delete `apikey` cookie → reload so `currentSub.apiKeys[0]` is chosen and written.
10. **Wrong-project identity confusion**: Cloud Run service identity errors named the SA (`[EMAIL] does not have storage.objects.X access ...`) — each new bucket access error (get → create → list → delete) is the same pattern with a different bucket/perm; use `roles/storage.objectUser` once instead of piecemeal roles.
11. **Verify claims with raw JSON**: `gcloud ... --format=json | jq ...` instead of the `value(...)` text format.
12. **Shell hygiene when the user pastes commands**: single-line commands, avoid backslash continuation across pasted lines, `$VAR` not persisting across redefinition; use `gcloud ... describe ... --format` to recover refs.
13. **MapLibre/react-map-gl vertex dragging** (see below) — events never logged ⇒ pointerdown never reaches the element ⇒ something stacked above (DeckGL canvas). Add `pointerdown` log to prove; move handles to an overlay outside DeckGL with higher z-index.
14. **Max update depth**: `Error: Maximum update depth exceeded ... at setLassoPolygon (preview-map.tsx 124:7)` — loop was drag → `applyPolygonSelection` dispatching Redux → viewport re-fit → map `move` → tick bump → re-render. Split cheap per-frame update (`onChange` → only `setLassoPolygon`) from expensive re-selection on release (`onCommit`).
15. **Not-yet-translated surface after code change**: libs/common edits need a dev restart; if still English, inspect `NEXT_LOCALE` cookie via `document.cookie.split(';').find(c => c.trim().startsWith('NEXT_LOCALE='))`.

### Preview-screen UX feature exchanges (request → what was done → exact fix)
- **"after doing a selection or filter on the preview screens order the items such that the selected items appear at the top"** → `preview-table.tsx` computes `displayOrder` (selected first, original order within each group); `rowIndex` in `itemContent` remapped through `displayOrder` so checkbox toggle (`[...selectedIndexes, rowIndex]`), `isSelected`, `onEditRow(rowIndex)` still use original indexes; parents/filter bar/lasso unchanged. Applies to jobs/shipments/vehicles tabs.
- **"when doing lasso selection, allow the user to edit the polygon after it has been set"** → `PreviewLassoPolygon` gets optional `onChange`; vertex handles (solid blue ring), midpoint handles (dashed faded ring; click inserts a vertex), delete when ≥4 vertices remain; `preview-map.tsx` extracts `applyPolygonSelection` (used by initial close and edit) + `handleLassoEdit`.
  - "dragging of vertices isn't working" → added `onDrag`; switched delete from shift+mousedown to right-click `onContextMenu` (shift+mousedown on inner div swallowed drag start).
  - "not working - drags the map and not the vertice" → react-map-gl `Marker draggable` loses mousedown to maplibre pan; implemented manual drag with pointer events: `stopPropagation`, `setPointerCapture`, disable map `dragPan` for gesture lifetime, `viewMap.unproject` on each move.
  - "nothing emitted in the console log" → DeckGL canvas intercepts pointerdown (same reason the drawing overlay lives outside DeckGL at z-index 1000). Moved handles into `PreviewLassoEditOverlay` at **z-index 1001**, container `pointerEvents: 'none'`, handles `pointerEvents: 'auto'`, positions via `viewMap.project(lng, lat)` re-rendered on map `move`/`zoom`; console log `[lasso:vertex] pointerdown {vertexIndex, button: 0}`.
  - Then the max-update-depth loop (see #14); `VertexHandle` fires `onMoveEnd` on release; overlay exposes `onChange` (per-frame) and `onCommit` (once per drag/insert/delete).
- **Vehicle icon**: green dot — `GREEN_DOT_SVG` same as `BLUE_DOT_SVG` (24px radius circle, 6px white stroke) with `fill="#16a34a"` (green-600); `PREVIEW_ICONS_MAP` maps `vehicle_start/vehicle_end/vehicle_neutral` to it; `GRAY_TRUCK_SVG` removed; sizes unchanged.
- **"API key list should only show the first key - ending in c1af"** → `libs/common/src/lib/components/apikey-selector/apikey-selector.tsx:237` slices preset list to the first key. Shared lib: affects every app using `ApikeySelector` (dashboard, fleet, billing…); offered to gate via prop/env.
- **"automatically include 'wildcards' around filter searches on preview screen *Posto*"** → `job-filter-bar.tsx:26-35`: typing `Posto` matches as `*Posto*`; if the user types any `*` themselves (`Posto*`, `PADA-0*`) leave unchanged. ID and Description filters share the function.
- **Map attribution**: user supplied logos by image; first `public/images/nbai-logo.png` (404 — basePath missing, fixed with `/route-planner/images/...`), then replaced with a near-square 230×211 logo (height 40), then `nb-logo-colored (1).webp`; "scale by 50% smaller" → 20; "check that - make it height 32" → 32.

### Transcript part C (chunks 7-9)

### 1. Clustering feature debugging chain (the big thread of this stretch)
**Request (user, 2026-06-01):** "need to implement an optional first step for clustering (using nextbillion.ai clustering API). The results of the clustering step will add zone ID's to each order in the uploaded job list. Clustering type is either 'H-clustering' or 'O-clustering'. Reference implementation is at ~/workspace/route_planner_monorepo". Clarification: "clustering is on the jobs upload page and the UX will sit above any imported table. in scope on this branch; all in one go - API and UX".

Design as built: browser calls NB clustering directly with the existing `apikey` cookie as `?key=<apikey>` (no BFF endpoint; the reference only used a Next API route to hide a server-only key). Two-step async: `POST /clustering` → `{id}`, then poll `GET /clustering/result?id=…` until `status: Ok | Failed`; 30 polls × 2s timeout. Optional env `NEXT_PUBLIC_NB_CLUSTERING_URL` (default `api.nextbillion.io`). On success: attach `Cluster ID` column to job `rawData.attachedRows`, map to `JobMapOption.Zones`; for O-clustering also attach `Allowed Zones 1` on vehicles; then `generateOutput()`. Defaults initially `h` / `air` / `air_distance` / Dimension 1 / 50000 / 100; success toast "Successfully assigned N jobs to M clusters!". Later user changed defaults: "default Clustering Pre-Optimization settings should be O-Clustering, Routing Mode = car, Number of Clusters = 10" and then "'Travel Cost' default option should be set to 'Duration'". (Number-of-clusters input renders only when `clusteringType === 'o'`.)

**Bug A — zones validated against geofences blocked Jobs→Vehicles transition.** User: "when moving from the jobs - vehicle during the data upload, the code is currently validating all of the 'Zones' entered on a jobs against existing geofence ID's. This is not necessary. A Zone entered will carry through in the job.zones[] regardless…". Verified parser `col-parsers.ts:232-269` writes zones to `target.zones` regardless of `validatedZonesMap`, so validation is only a gate. Fix `input-core.ts:867-882`: exclude jobs from zone-vs-geofence pass (error otherwise: `Invalid zone: "X" not found`). Later: "on vehicle table, don't validate the entered zone numbers against the geofence database. Allow zone entries regardless of whether they exist in geofence table" → `input-core.ts:967-978` `zoneMappings` array is empty for every input type (whole validation pass becomes a no-op). Caveat flagged: with `validatedZonesMap` empty, `normalizeInput` can no longer translate real geofence names → numeric indices (cluster ids still resolve via a separate cluster-name→index map).

**Bug B — optimizer error `expected int64, got string`.** User: "jobs.zone[] should be strings [screenshot]". Root cause: optimizer expects `job.zones[]` / `shipment.zones[]` as numeric indices into the request's `zones` array; `convertZones` had only been applied to vehicles' `allowed_zones`/`restricted_zones`; additionally cluster zones were never added to the optimizer `zones` array (only to the preview map). Fix in `normalizeInput` (`input-preview-page.tsx`): new optional `clusters` param; unified `zoneNameToIndex` map; cluster zones pushed onto `zonesArray` with `geofence_id: "cluster-<n>"` and decoded GeoJSON polygon; `convertZones` resolves via validatedZones first then direct name lookup (cluster ids), and is now applied to `job.zones`/`shipment.zones` (unresolved names are dropped from the object rather than left as strings); call site `onGenerateRoute` passes `inputCore.clusters`. Internally the cell still stores zone ids as strings.

**Bug C — NB clustering error "out of service area".** Error: `"msg": "The location requested '{-46.570114, -23.62921}' at location_index 0 is out of the service area. Please verify the locations or reach out to NextBillion at [EMAIL]."` User: "coordinates in clustering API request seems swapped - should be lat,lng". Fix: in `runClustering`, swap internal `lng,lat` → `lat,lng` right before pushing to `locations`; dedupe map keyed on the swapped string; `getLocIndex` shared by jobs and depots/vehicles so indices stay consistent.

**Bug D — zone polygons not rendering (three different root causes over time; instructive sequence).**
1. First polygon decode assumed encoded polyline `[lat,lng]` and swapped. Added diagnostics (`[runClustering] storing clusters:`, `[buildZones] inputCore.clusters snapshot:`, `[buildZones] clusterZones built:`, `sample coords` with `JSON.stringify` because the console collapses arrays). Hard refresh wiped Redux state (clusters not persisted at the time → `count: 0`); repro without refresh.
2. Logged coords `{"firstPoint":[-23.89731,-46.43302], …}` = lat,lng for São Paulo → polygons landed off Argentina. Initially believed NB returned stringified GeoJSON in `[lat,lng]`; then found the sample `geometry: 'j}kzGdmzpCtbGm…'` was a polyline, and concluded NB's polyline order was `[lng,lat]` — so the swap itself was the bug; removing the swap fixed it. (`polylineToGeoJsonPolygon` hardened to accept: GeoJSON string starting with `{`, polyline precision 5, polyline precision 6 fallback; returns `undefined` unless ≥3-point ring; closes the ring.)
3. Later, after Bug C's request swap to `lat,lng`, new clusters rendered wrong again while an older saved preference (`FEMSA_TEST_500`) rendered fine and a new one (`FEMSA_TEST_750`) did not. User's insight: "the prior issue with zone polygons not rendering seems to be related to the way the data is being stored in 'preferences'…". Root cause: NB echoes polylines in the same order it was sent; after sending `lat,lng` the response polyline is `[lat,lng]`, so the polyline path now needs the swap to GeoJSON `[lng,lat]` (comment at ~line 49-52 recorded the old empirical truth). Fix: swap on the polyline path. Consequence: preferences saved during the broken window bake in bad geojson (re-cluster and re-save). Deliberately no auto-detect heuristic. `updateClusterPolygon` is unaffected (edits an already-correct polygon). User: "perfect".
- Lesson: a coordinate-order assumption is coupled to the request-order; re-verify decode assumptions whenever the request convention changes.

**Bug E — zones layer toggle/overlay rendering.** `showZones` default now true whenever `zones` prop non-empty plus a sync effect that only flips ON, never OFF. A guard in `buildZones` skips everything if no job/shipment/vehicle (`allowed_zones`/`restricted_zones`) carries zones (so no polygons when no zones). Guard diagnostics: `{clustersInState: 10, clustersWithGeojson: 10, hasAnyZoneReference: true, jobZoneCount: 500, shipmentZoneCount: 0, vehicleAllowedCount: 10}` and `[preview-map] layers about to render: {showZones, zonesPropCount, baseLayerIds, allLayerIds, firstLabelLayerId}` showed data fine and the ZoneLayer present — a render-order problem (see Decisions: interleaving).

**Bug F — vertex job not a member of its polygon.** User screenshot: the blue job that helps define the zone polygon was not a member. Fix: after the API returns its job→cluster map, post-process with turf: build a polygon per cluster; for each job test boundary-inclusive containment (`ignoreBoundary: false`) against all clusters; if API's assignment isn't one of the containing polygons, reassign to the first containing polygon; jobs outside every polygon keep their API assignment. Reconciled `jobClusterMap` feeds the "Cluster ID" column write.

**Bug G — re-cluster stacked duplicate columns.** User: "after clustering result is received, when you are adding a 'Zones' column to the table, delete any prior 'Zones' column" and "when the clustering result is returned, change the way you add to the vehicles table. Remove any prior columns related to Allowed Zone and add a single column 'Allowed Zones' that contains every cluster ID that was returned with comma separators". Implementation: collect old attached columns where `value === JobMapOption.Zones` and `index >= dataCols` (never user-mapped base columns), sort indices descending, delete one by one with `deleteAttachedColumn` threading updated `jobRaw`+`jobMapConfig`; dispatch `setMapping('job', jobMapConfig)` before `upsertDataMapConfig`. For vehicles sweep `{AllowedZones, AllowedZone1…AllowedZone10}` with `index >= vehDataCols`; write one `Allowed Zones` column = dedup'd ids sorted ascending comma-joined (e.g. `0,1,2,3,4,5,6,7,8,9`) mapped as `VehicleMapOption.AllowedZones` (plural variant; parser `parseZones` splits on commas).

**Bug H — stale tooltip after polygon edit.** User: "As I adjust the size of zone polygon boundaries, I'm not seeing the zone number change… If a job is no longer enclosed by the adjusted polygon, its zone number should change to 'null' value." Log `[updateClusterPolygon]` showed data correct (`inCount: 33`, `outCount: 13`, `unchanged: 454`); tooltip stale because `hoverInfo` is a state snapshot of the old feature object. Fix: `useEffect(() => setHoverInfo(undefined), [output.job])`; `booleanPointInPolygon(..., {ignoreBoundary: false})` made explicit. Lesson: ask for the *specific* log (`updateClusterPolygon`, not `buildZones`) and distinguish stale-UI from stale-data.

**Bug I — noisy console/warnings.** Removed `parseTime` console.log at `col-parsers.ts:907` (`input: 2026-06-10T16:00 timezone America/Sao_Paulo result 1781118000000 Wed, 10 Jun 2026 19:00:00 GMT`). Optimizer warning filtered out in `input-preview-page.tsx:795-811`: `has been specified with zone while zone geometry provided` (case-insensitive match; if the whole `warning[]` is only these, no toast).

### 2. Pin clustering (supercluster) + spiderfy debugging
- `new Map()` TypeError (twice) — see item 4.
- Zoom-in jumpiness: auto-fit effect keyed on post-filter `viewBbox` re-fit when the cluster filter changed the visible job subset. Fix: key the fit on a content signature (`output.job.length | output.shipment.length | …`) in `lastFitKeyRef`. Follow-up regression "map is not panning to the optimal viewport … Viewport remains in Singapore": removing `viewBbox` from deps meant the effect never re-ran when bbox populated. Fix: put `viewBbox` back in deps but gate the actual `setViewStateByBbox` with the ref (fires once per real data load).
- Stray markers around a 500-pin cluster: the per-job zone-color `ScatterplotLayer` (`zonedJobLayer`) read `output.job` not the cluster-filtered list; fix: also filter out `clusteredJobIds` and add to memo deps.
- Selection vs supercluster (user: "upon a new selection set of jobs in the preview screen (via table item selection, filter etc.), rerun the clustering process"): assistant initially misread as NB API re-cluster (offered options 1 debounced auto re-cluster / 2 button / 3 visual filter; user picked 3, then interrupted: "hang on … I'm talking about the marker pin superclusters which shouldn't involve an API call"). Lesson: two features both called "clustering" — confirm which. Reverted a scope-creep zone-polygon filter. Real fix: build supercluster only from selected jobs; three-state selection: `selectionIsAll` → `allowed = null` (index all); strict subset → Set of selected indices; empty array (Clear All) → empty Set → no clusters. Later same filter applied to icons and per-job dots (lasso with 4 selected still showed all markers).
- Label color readability: choose per-cluster count label color by luma (BT.601 `0.299R + 0.587G + 0.114B`); luma > 150 → `[30,30,30]`, else white; `updateTriggers.getColor` tied to `zoneNameToColor`.
- Spiderfy for coincident jobs: at zoom ≥ 14 (`SPIDER_ZOOM_THRESHOLD`, past supercluster `maxZoom`) bucket by `lng,lat` rounded to `COORD_PRECISION = 5` decimals (~1 m); groups of 2+ fanned onto a `SPIDER_RADIUS_PX = 26` circle (first at 12 o'clock, clockwise) using `viewMap.project()`/`unproject()`; each rendered job is a clone with rewritten `location` (original `output.job` untouched); grey stroked backdrop ring `[160,160,160,200]` width 2. Same for vehicles ("when vehicle markers are at the same location (coincident) implement the same ring functionality"): effective start/end coordinate falls back to `start_depot_ids`/`end_depot_ids` via `output.depot`; two independent passes (start, end) stacking onto a `cloneById` map; stable angles by sorting bucket on `vehicle.id`; de-dupe anchors; `mapData.vehicle = spideredVehicles`.
- Knobs: supercluster `radius: 60`, `maxZoom: 14`, `minPoints: 2`; circle radius `min(48, 12 + 6 * sqrt(count))`; count text white bold 12px.

### 3. Map layer-ordering saga (deck.gl interleaved vs overlay) — what failed
- Request: "on the map view make the city (admin hierarchy) labels sit above all other layer". Implemented by restructuring `<DeckGL><Map/></DeckGL>` to `<Map><DeckGLOverlay interleaved/></Map>` (MapboxOverlay) and `findFirstLabelLayer` (first `symbol` layer with `label` in id) → `layer.clone({beforeId})`. Lost: custom DeckGL controller keyboard config (`keyboard: {zoomSpeed: 0.01, ...}`).
- Failure: zone polygons disappeared. Detected label layer was `road_gondola_label` (low in the stack), then `place_park` — both below fills in this TomTom-style stack. Tried `beforeId: undefined` for ZoneLayer, then splitting ZoneLayer into its own non-interleaved overlay — still not rendering. User: "not rendering. This is getting messy. At one point these were working together fine - supercluster and zone polygons."
- Resolution: revert to a single non-interleaved overlay (everything on one canvas above basemap); labels render below deck features; accepted tradeoff, "revisit later as a polish item". Lesson: when an architectural experiment breaks a working feature and two heuristic fixes fail, revert to the last-known-good rather than keep tuning.

### 4. `new Map()` shadowed by `react-map-gl` import (hit again twice)
- Error: `TypeError: react_map_gl__WEBPACK_IMPORTED_MODULE_2__.default is not a constructor` at `const map = new Map<string, [number, number, number, number]>()` (preview-map.tsx 213:17); recurred at 349:21 `new Map<string, any[]>()`. Cause: file imports default `Map` from `react-map-gl`, shadowing global `Map`. Fix both: plain `Record<string, …>` / `Object.values()` (avoids renaming the component and rippling through every `<Map>` JSX).

### 5. Fix patterns for "feature works in dev, fails in deploy"
- Cell-level zebra rows (see Conventions); TableVirtuoso `itemContent` cannot style rows.
- Description ordering: `parseDescription` pipe-joins in iteration order of `mapOptions`; AI mapping, fallback entries and manual re-maps make it nondeterministic. Fix in `data-parser.ts`: when `descNum > 1`, iterate a shallow copy sorted by `item.index` (leave meta-mapping loop alone).

### 6. AI Mapping fallback (two paths!)
- Request: "when doing AI mapping, fields that don't get returned with field maps should be automatically set to 'Description' field types". First patch only covered the debug-dialog Apply path in `handleApplyAiMapping` (~line 455); user came back "still ending up with unmapped columns" (9 columns left "Select Field" with partial toast). The production auto-apply branch (~line 729) builds its own dispatch payload. Fix applied to both: claimed = `Set(newDataMappings.index ∪ newMetaMappings.index)` after mutual-exclusion/dedup/required-meta backfill; push `{index, value: 'description', header}` for every unclaimed header column. Status always `success`, `unmappedColumns` cleared, toast "Auto Mapping complete. 9 columns defaulted to Description — review if needed." (else the original "auto-mapped your columns"). `droppedIndexes` union into `unmappedColumns` removed. The AI's `unmapped: number[]` is not consulted (gap computed from `headers` minus claimed, more robust).
- Lesson: grep for all dispatch sites of the same payload when fixing one.
- API key location answer (user asked "point me to where the API key is set for the 'AI Mapping' action"): tenant key from `apikey` cookie appended by `libs/common/src/lib/utils/fetcher-client.ts:16-19` (`url + (url.includes('?') ? '&' : '?') + 'apiKey=' + apikey`); call site `data-mapper.tsx:683` `fetch('/ai/fields/auto-mapping', …)` (`fetch` imported at `:31` from `@ncc/common/client`); session bearer `fetcher-client.ts:24-30`; LLM provider key is server-side env on the `bff-staging` Cloud Run service (in the separate `bff` repo's terraform).

### 7. Multi-column Address concatenation + geocode loop
- Request: "fields designated with 'Address' type can be concatenated together with a ',' between fields. The 'Address' field can be used multiple times … the geocoding process will use the concatenated version". Fix: add `address`, `pickup.address`, `delivery.address` to `MULTI_SELECT_ALLOWED` (`use-current-input.ts:144`, previously only `description`); `triggerGeocode` collects all indices mapped to the target Address value and per row joins non-blank cells with `, ` (empty cells skipped to avoid `"line_1, , city"`). Standardized address written back to the first Address column only (`applyJobGeocode`/`applyShipmentGeocode` use `.find(...)?.index`).
- Side-effect bug (geocode loop on Confirm): only the first Address mapping was cleared, the extras made `input-phrase.ts:172-187` re-trigger geocoding on the next phase transition. Fix: filter out ALL `JobMapOption.Address` mappings after `applyJobGeocode`; in `applyShipmentGeocode` clear all `PickupAddress`/`DeliveryAddress` conditional on that side having been geocoded.
- Optimizer unaffected (`job.address` is not in the request; `job.location` is).

### 8. Zone Load Summary analytics bugs
- "No zones" though the map showed zones: analytics read `useOptimizationInput()` (`result.input`, always `null` — `raw-to-domain.ts:87`) while the map reads `_rawInput`. Fix: add/use `useRawOptimizationInput()` and swap types back to raw API shapes (`OptimizationMvrpOrderJobV2`, `Vehicle…V2`, `Zone…V2`; one `as {capacity?: number[]}` narrowing).
- Then "zone load summary shows no load in any zone" (URL `…/route-planner/solutions/<id>`): the hook guarded on `step.jobId !== undefined`, but `raw-to-domain.ts:23-42` never writes `jobId`; NB MVRP step `id` is the input job id for job/pickup/delivery steps. Fix: use `step.id` plus `isJobStep()` to exclude start/end steps (transform's `?? 0` fallback would false-match id 0).
- Empty i18n placeholders: existing cards called `useTranslations('analytics')` but the namespace didn't exist (raw keys shown) — added all keys in four locales (routeMetrics, routes, totalStops, `totalDistanceUnit` "Total Distance ({unit})", totalDuration, stopsPerHour, avgStopsPerRoute, `avgDistanceUnit`, avgDuration, distanceByVehicle, vehicleId, `distanceUnit` "{unit}", timeAnalysis, hrsAxis, travelTimeVsServiceTime, totalTime, totalTravelTime, totalServiceTime, travelTime, serviceTime, zoomIn, zoomOut); `{unit}` = `km`/`mi` from `unitOfMeasure`.
- Drive Time column empty (user: "Drive Time values are empty. Can we calculate an average drive time between all points - to measure the density/distribution?"). Cause by design: drive km/min credited only if BOTH step endpoints are in the same zone polygon. Proposal pending (see Decisions).

### Transcript part D (chunks 10-12)

### Coordinate order bug in new Distance Matrix call
- User: "I think your DM request has lng,lat and not lat,lng". Agent verified via `use-solution-map.ts:83` which does `point([step.location[1], step.location[0]])` for turf => `step.location[0]` is LAT, `[1]` is LNG. The domain comment `/** [lng, lat] */` on `v3/domain/types/route.ts:39` is inaccurate. Fix: swap so DM sends `lat,lng`. (Agent offered but didn't do fixing the comment.) Lesson: check existing consumer code (turf `point()` arg order) rather than trusting type comments.
- Distance Matrix endpoint shape: `GET https://api.nextbillion.io/distancematrix/json?origins=lat,lng|...&destinations=lat,lng|...&mode=car&key=APIKEY`. User corrected host: "DM call should go to api.nextbillion.io not the staging service" (first attempt used `sgpstg.nextbillion.io` via `NEXT_PUBLIC_ENV`). BFF does not proxy DM — called directly with the user's key (mirrors playground hook).

### Wrong-file / shadowing traps
- `TypeError: react_map_gl__WEBPACK_IMPORTED_MODULE_3__.default is not a constructor` at `preview-map.tsx (715:21)` for `const jobById = new Map<unknown, any>()`. Cause: `import Map from 'react-map-gl'` (line 18) shadows the global `Map`. Fix: use a plain `Record<string, any>` and `jobById[String(info.object.id)]` (String() normalises numeric/string ids). Same file already works around the same collision for supercluster via `* as SuperclusterNs`.
- Map style kept "original" after the switch because `MapStyleSelector` (lib) runs `map.setStyle(...)` in a mount effect with its default "Light" option still pointing at `/maps/streets/style.json`, clobbering the `mapStyle` prop. Fix lived in the lib's options + applyMapStyle, not the 5 app consumers. Lesson: when a prop-set style is overridden, look for a component that imperatively calls `setStyle` on mount.

### `||` vs `??` on index 0 (geocoder first-row bug)
`geocode-preview-modal.tsx:327` `selectedRowIndex={selectedRowIndex || -1}`; `selectedRowIndex` is `number | null`; `0` is falsy so row 0 passed `-1`, and `geocode-preview-map.tsx:164` flyTo effect saw `geocodeRows[-1]` -> undefined -> skipped. Fix: `?? -1`. User symptom: "clicking on a row will zoom and center ... doesn't work when selecting the first row".

### Hover/tooltip not appearing — layered diagnosis on preview map
1. Unclustered job hover showed nothing: cluster circles were `pickable:false`; made them pickable with `onHover` tagging `popupType:'pinCluster'` ("N jobs in cluster — zoom in to see details"), added `console.debug('[preview-map] onInputHover', {layerId, id})` to discriminate: only cluster ids logged -> hovering clusters; no log -> another layer is shadowing picking; log but no tooltip -> tooltip render bug (`InputTooltip` from lib).
2. After filters applied, tooltips stopped: shared `createHoverHandlers().onInputHover` keeps a closure-scoped `lastHoveredId` dedup that goes stale across renders. Fix: preview-map wrapper sets `popupType:'input'` and calls `setHoverInfo` directly (no module state). Zone hover kept on lib helper because tooltip suppresses zones anyway.
3. Small brown dots with no tooltip = `zonedJobLayer` (colored zone-dot overlay) was `pickable:false`; deck.gl picks against opaque pixels and the IconLayer PNG has transparent edges under the dot center. Fix: make `zonedJobLayer` `pickable:true`; its `onHover` builds a synthetic Feature from a job lookup (`id, description, location, pickup, delivery, service, setup, skills, timeWindows, Zone`) with `popupType:'input'`.
4. v3 solution map cluster hover showed an EMPTY infowindow (raw supercluster features lack `isCluster/items/clusterCount`). Fix: `onClusterCircleHover` expands `getLeaves` and forwards `{popupType:'stepCluster', items, count}` through `hoverHandlers.onResultHover`; new `stepCluster` branch in `solution-map-view.tsx` renders `ClusterTooltipContent` (Type/Task ID/Arrival/Duration/Service/Description/Vehicle; `CLUSTER_TOOLTIP_MAX_ITEMS = 12` + "+ N more — click cluster for full list"; uses `formatDateTime`, `formatDuration`, `MIN_VALID_TIMESTAMP` from `@ncc/common`).
5. Zone hover infowindow on v3: preview suppresses it (in-polygon label is the identity UI). Fix in `use-map-layers.ts:429-447` `onZoneHoverWrapped`: still sets `hoveredZoneId` (polygon highlight) but forwards a null-object info to clear any stale step tooltip.

### React perf: search box lag (two rounds)
- Round 1: every keystroke -> store `routeSearchQuery` -> `filteredRoutes` rebuild -> auto-select effect `selectAll(...)` -> `selectedRouteIds` change -> `useMapLayers` rebuilds supercluster/polylines/depots. Fix: local input state + 150ms debounce to store; no-op guard in auto-select effect when filtered set equals current selection; external-clear sync; clear timer on unmount.
- Round 2 (user: "the search box entry still performs very poorly ... significant lag before the characters are seen"): `searchInput` state lived on parent `RoutePanel`, re-rendering all 244 `RouteCard`s per keystroke. Fix: extract `RouteSearchInput` (owns local `value` + debounce timer, subscribes only to `routeSearchQuery`/`setRouteSearchQuery`), and wrap `RouteCard` in `React.memo`. Next suspect if still slow: non-virtualized 244 DOM nodes. Lesson: debounce alone doesn't help if the state sits on a heavy parent; isolate input state in a leaf component.

### Preview filter bars losing state on tab switch
Zone multi-select was local `useState` in `JobFilterBar`/`VehicleFilterBar`; tab switch unmounts -> chips empty while Redux-selected jobs still filtered. Fix: persist in `inputPreview` slice (`jobFilterZoneIds: number[]`, `vehicleFilterZoneIds: number[]`, reducers `setJobFilterZoneIds`/`setVehicleFilterZoneIds`); chips derived via `useMemo` from options. Other JobFilterBar fields (ID pattern, description, TWs) still local and clear on tab switch (agent flagged this).

### Edit-mode cluster visibility (solution page)
User: "superclusters aren't appearing" in "Edit Route" mode. Cause: cluster path gated by `!editMode` so `DraggableStepMarkers` rendered every step individually (244 routes). Fix: drop gate on cluster circles/counts; add `!editMode` to un-clustered regular and start/end circles so they don't double-render with `DraggableStepMarkers`; step-stack pills and rest markers remain `!editMode`-gated.

### Polygon vertex handles spilling off canvas
`PreviewLassoEditOverlay` positions handles via `viewMap.project()`; container had no overflow clip so off-screen vertices rendered over the table. Fix: `overflow:'hidden'` on overlay container div (`preview-lasso.tsx:653-670`).

### Time-window filter question (no change needed)
User asked time-window from/end filters search all TW columns. Agent found `job-filter-bar.tsx:64-84` already iterates all `job.time_windows` entries with `tws.some(...)`, each mapped column pair parsed by `parseMultipleTimeWindowStart/End` (col-parsers.ts:347, 520). Semantics: interval-overlap test per single TW pair, both bounds satisfied by same pair. Agent asked for repro rather than changing code (likely culprit: TW column mapped as singular `time_window`).

### disable_cache investigation
`disable_cache` only declared optional on `preferences.routing` (`input-core.ts:257`), never set, no UI, rides via shallow copy at `input-core.ts:446`; so server default (cache enabled). User: "set disable_cache explicitly to 'false'". Done: `input-preview-page.tsx:432` unconditionally `options.routing.disable_cache = false`; type `disable_cache?: boolean` added to `OptimizationMvrpOrderOptionsV2.routing` in `actions/interface.ts:275`.

### Persistence round-trip verification (no change needed)
Added rows persist to GCS automatically: `prependEmptyRow` (input-core.ts:543) -> `setRawData` from `onCellChange` (data-mapper.tsx:906) -> on Generate with "Save this setup for future route planning", `saveInputSet(zones)` (input-preview-page.tsx:766; input-core.ts:2295) serializes whole `InputSet` rawData incl. attachedRows via `saveInputConfig` (configure.ts:99) -> `loadInputConfiguration` (input-core.ts:2253) -> `setInputSet`.

### Style spec validation bug (TomTom style via NB)
Style URL `https://api.nextbillion.io/tt/style/1/style/20.3.2-3?map=basic_main` returns JSON where every layer has `"metadata": "group:<word>"` (STRING) but MapLibre style-spec requires an OBJECT -> validator throws on init. User hint: "there is a small syntax error in the map style JSON that is returned that needs to be worked around". Fix `sanitizeStyleSpec`: convert string metadata `"group:area"` -> `{ group: "area" }` (split `<key>:<rest>`; no colon -> `{ value: "..." }`). `setStyle(url)` makes MapLibre fetch the JSON itself and choke, so fetch -> sanitize -> pass the OBJECT. Module-level cache keyed by URL (style ~340 KB). While loading, `useMapStyle` returns `undefined` and Map renders empty.

### POI limiting
User: "tomtom map is POI heavy. I want to limit to only certain POI categories ... 'supermarkets' for example". POI layer id `"POI"`, `icon-image: "{icon}"`, each feature has `icon` property. Style-time approach: AND `["in", ["get","icon"], ["literal", allowedIcons]]` onto existing filter of layer `id:"POI"`. Exported `POI_ICON_WHITELIST` (default `['supermarket']`; if actual tile values differ try `grocery_store`, `convenience_store` — inspect a tile feature in devtools), `filterPOIByCategory`, `transformStyleSpec` (metadata sanitize -> POI filter), `transformMapStyleJson`. Runtime alternative: `map.setFilter('POI', ...)`. Later user asked (last item of chunk 12): "on the geocoding tool map view, include the POI layers for display" — `useMapStyle` got an opt-in flag; cache key must include the flag so filtered/unfiltered variants don't collide (edit in progress at chunk end).

### Misc small root causes
- Solution-map zone labels vanished at zoom 13 because of `ZONE_LABEL_HIDE_ZOOM` gate; agent removed it, user said "rollback that last change not what I wanted" (restored). Lesson: ask intent before removing a deliberate gate; the user actually wanted a band (see Decisions).
- Step marker clutter: first threshold `STEP_MARKER_MIN_ZOOM=10` too aggressive (user zoom ≈9) -> set 8.

### Transcript part E (chunks 13-15)

### 1. POIs not showing on geocoding map (basemap style, not code)
- Request: show nearby POIs on geocoding preview map. First change (skip POI whitelist via `transformMapStyleJson({includePois:true})` in `libs/route-planner-components/src/lib/components/map-style-selector.tsx`, plumbed through `useMapStyle(apiKey, {includePois})` in `apps/route-planner-v2/utils/map-style.ts`, cache keyed by URL AND flag) produced no POIs. User: "[Image] not seeing POI markers on geocoding tool map".
- Real cause: the TomTom style URL used `basic_main` (version `20.3.2-3`) which omits POIs from the map entirely. The Dark style (`22.2.1-9?map=2/basic_street-dark`) is POI-rich; Light equivalent is `basic_street-light`.
- Fix: added `MAP_TT_BASIC_STREET_LIGHT_URL` and `MAP_VIEW_STYLE_OPTIONS_WITH_POIS` (Light swapped to `basic_street-light` v22; Dark/Satellite unchanged) to `map-style-selector.tsx`; `getMapStyleUrl` accepts `{includePois}`; `geocode-preview-map.tsx` passes `styles={MAP_VIEW_STYLE_OPTIONS_WITH_POIS}` to the inline `MapStyleSelector` so toggling Light↔Dark keeps POIs. Lesson: when a filter change has no visible effect, check the data source actually contains the thing before debugging the filter.

### 2. Discover search biased by map center
- User: "in the discover API call within the geocoding tool when doing an address update, use the &at={latitude_longitude_map_center} to bias the searches."
- Implementation: `hooks/use-discover-search.ts` takes `opts.at = {lat,lng}` → appends `&at=<lat>,<lng>` (6 decimals; effect dep reads it as a string so coord re-renders dedupe). `geocode-preview-map.tsx` exposes `onMapMove?(center)` from `<Map onMoveEnd>` (NOT `onMove`, so autocomplete doesn't refire mid-pan). `geocode-preview-modal.tsx` owns `mapCenter` state (cleared on close) → `geoccode-preview-table.tsx` (`mapCenter` prop) → `address-edit-cell.tsx` (`at` prop) → hook. Other consumer `AddressAutocomplete` unchanged (optional arg, no bias).

### 3. Hover tooltip on clusters
- User: infowindow should not appear on mouseover of a cluster. `solution-map-view.tsx` `popupType === 'stepCluster'` hover branch now returns `null`; removed orphan `ClusterTooltipContent`/`ClusterStepEntry` and their imports (`formatDateTime`, `formatDuration`, `MIN_VALID_TIMESTAMP`). Empty render-prop output still rendered the styled container, so `v3/components/map/map-tooltip.tsx` `MapTooltip` now skips rendering when its render-prop returns null/false. Click still opens `StepClusterPopover`.

### 4. Stale API-key name "FEMSA_DEMO" (wrong-source diagnosis, twice)
- First diagnosis (wrong): custom key in localStorage `custom_api_keys`; fix by `localStorage.removeItem('custom_api_keys'); location.reload()` or delete+re-add. User then asked "where does the text 'FEMSA DEMO' come from" with another screenshot; real source was the BFF `GET /common/api_keys` record `name` (v2 selector `KeyDisplay`), not nbai.json/localStorage/cookies. Lesson: trace the render path from the component to the data source before answering; screenshot showed the v2 selector, not the one first inspected.
- Resolution requested: "change that text box so it doesn't show the text 'FEMSA_DEMO' or whatever comes from BFF and just shows the masked API key" → `renderSelectedValue` shows only masked kid (`****c1af`); dropdown items still show names. Because `apikey-selector-v2.tsx` is shared in `@ncc/common/client`, the change applies repo-wide (flagged to user; offer to fork locally).

### 5. Supercluster hidden at low zoom
- `v3/features/solution/hooks/use-map-layers.ts:78`: `STEP_MARKER_MIN_ZOOM = 8` suppressed every step-marker layer incl. supercluster circles. Fix: new `STEP_CLUSTER_MIN_ZOOM = 4` + `showStepClusters` boolean; cluster-mode outer gate uses `showStepClusters`; the two unclustered individual-step pushes re-gated with `showStepMarkers`.

### 6. Cluster counts too low (21k stops, counts summed ~1k)
- Diagnosis: steps whose coordinate is visited by ≥2 routes were excluded from `stepClusterFeatures` and rendered only by `stepStackMarkerLayer`, gated to zoom ≥ 14. In FEMSA most customers get 2-4 weekly visits at the same lat/lng on different vehicle routes, so almost all 19k went to invisible stack markers.
- Fix: include stacked steps in `stepClusterFeatures` (drop early `return`), tag `isStacked: true`; filter `isStacked` (and `isRest`) out of `unclusteredFeatures` so at zoom ≥ 14 the stack pill remains sole marker (no double render). Side effect: clusters that swallow a stacked step render grey (multi-route) because supercluster `reduce` sees mixed `vehicleId`s. Result: totals sum to ~19,370.

### 7. Route-edit drag-drop crash
- Error: `[DragDrop] Move failed: TypeError: Cannot read properties of undefined (reading '0')` at `moveStepCrossRoute`.
- Root cause: `v3/domain/operations/recalculate-route.ts:658` `directionsResult.routes[0]` when BFF returns a 200 error-shaped body (`{status:"Error", message:"..."}`) with no `routes`; the guard only covered `routes: []`.
- Two-layer fix: (1) `v3/api/directions.api.ts` throws with the server message when the body lacks a `routes` array (root cause: malformed body propagating); (2) `routes?.[0]` as defense in depth. The catch in `route-edit.store.ts` (each move action wraps recalc in try/catch and restores the snapshot) now reverts the visual move and shows the BFF message. Likely trigger: empty origin/destination (start/end step without `location`); consider guarding in `buildDirectionsQuery`.

### 8. Preference column-mapping restore didn't appear to work
- After deleting vehicles and re-importing via API, columns not mapped. Cause: the saved preference on the BFF predated the `mapConfigs` bundling, so there was nothing to restore. Added a green toast `Restored N column mappings from preference "<name>"` for visibility. Diagnosis table: (1) preference saved before feature → re-save after mapping; (2) preference name in Set Preferences must exactly match a saved preference in "Change Preferences"; (3) stored `header` strings must match the new CSV's headers (dropped silently otherwise); (4) toast but "Select Field" shown = real bug in `setMapping` reducer.

### 9. FEMSA1 description "not showing" (own bug, not cache)
- After rewriting descriptions in the response JSON, the manifest still showed plain `1114641-1-1`. User asked if a cache needed deleting. Cause: `parseFemsaJobsCsv` set `description: row.Matricula` on CSV-derived jobs and `enrichRawRoutes` overwrites `step.description` whenever the job has a `description` (it gates each field on `!== undefined`) — clobbering the enriched string. Fix: drop `description` from CSV-derived jobs (and from the row type). Later, when FEMSA1 switched to input JSON with identical enriched descriptions, overwrite is a no-op.

### 10. Zone filter showing other zones / other dates (three iterations)
1. User: filter on Zone-1-2-0 also shows other zones on the map. Cause: zone filter narrows routes but the map drew every zone touched by those routes (each FEMSA1 route touches many day-zones). Fix: intersect route-touched zones with `selectedZoneIds` when explicit filter set; if filter matches no touched zone render none.
2. User: should only see routes for week 1 day 2 (July 20) but sees July 21, July 23. Cause: predicate was "any step touches zone"; user's model is "primarily serves that zone". Spot-check: route 2841 has 15/15 stops in Zone-1-2-0; route 590 only 3/20 stragglers. Fix: match by primary zone (zone with most job steps in each route, `routeIdToPrimaryZone`) plus a day-of-week check for FEMSA-style names `Zone-{W}-{D}-{idx}` (first job step day in `dispatchTimezone`, dayjs utc/timezone plugins; FEMSA2 numeric zone ids skip the day check). Expected: 15 routes all Jul 20.
3. User: "31 routes shown including some from July 23". Cause: `selectedZoneIds` stores zone IDs ("0"), not names ("Zone-1-2-0"); the name parser returned `null` so the day check was a no-op. Fix: look up zone name by id first, then parse.
- Related FEMSA2 bug: "when I load FEMSA2 - I don't see the zones" → FEMSA2 zones are `{id, geometry}` with no `name`; earlier gate regex `^(\d+)-` on `zone.name` filtered all zones out. Fix: drive zone visibility from `job.zones` assignments (`jobId → Set<zoneId>`, walk selected routes' `type==='job'` steps, union, filter `rawInput.zones`), comparing via `String(...)` on both sides (FEMSA1 string zone ids `["3"]`, FEMSA2 numeric `[3]`).
- Later: if a zone filter is set, render polygons regardless of route-selection gates (bypass `selectedRouteIds.size === 0` and `>= rawRoutes.length` gates plus the route-touched intersection) since the user has declared intent.

### 11. Delta panel arrow showed "increase of 4%" for a decrease
- Prior route distance 300.23 km → 288.13 km. `pctChange(288.13, 300.23)` = -4, `isUp=false`, `isGood=true`, but icon selector was `{isGood ? TrendUp : TrendDown}`, so favorable change drew an up arrow. Fix in `MetricItem`: arrow = direction of change (`isUp`), color = favorability (`isGood`). The trend SVGs had baked-in colors so a down arrow rendered red even when favorable → parameterized the fill.

### 12. After editing (dropping 2 stops) time/cost +23%
- Baseline (300.23 km / 306 min / cost 18383) is optimizer `route.duration`/`route.cost` from its cost matrix. Draft (290.24 km / 377 min / cost 22671) is recomputed by `applyDirectionsResult` calling NB Directions (`route-edit.store.ts:604` → `buildDirectionsQuery` → `directions.api.ts`); cost = `Math.round(route.duration)` when `travel_cost = duration`, so cost and time move identically. Reasons: `recalculate-route.ts:42` sends `departure_time: route.steps.at(0)?.arrival` (traffic prediction for peak hour vs a traffic-free optimizer matrix) and different routing engines. User chose: "pin the departure_time to this value when doing recalculations 1783918800" — pinned in the single call site (2026-07-11 05:00 UTC / 02:00 São Paulo) for every Directions recalc.

### 13. Page "hangs" on load in edit mode
- FEMSA1 started in edit mode, page hung. Cause: persisted `route-edit` store state in localStorage rehydrated into edit mode. Fix: `partialize` returns `{}` (nothing persists); `onRehydrateStorage` unconditionally resets to `initialState`, forces `editMode` off and calls `clearStorage()` so legacy persisted state is wiped on the next load. Applied edits survive separately via `updateLocalSolutionResult` in the local-solution store.

### 14. Start/End suppression off-by-one bugs (three follow-ups)
- Request: if vehicle input has no start/end index, don't mark 'S'/'E' on the map and don't show Start/End in the manifest. Implementation: `vehicleHasStartEnd` lookup from `_rawInput.vehicles`; skip synthetic start/end steps in both step-feature builders (cluster + non-cluster) and switch the S/E label from index-based to `step.type`-based (index-based mislabeled the first job as 'S'); manifest `job-list.tsx` filters those steps.
- Bug: "routes always start at step 2": map numbering used `stepIndex + 1` off the raw array; fix = per-vehicle offset when suppressing the start step, applied in all four spots (cluster builder, rest-marker builder, non-cluster builder).
- Bug: manifest mouseover highlighted the wrong stop (off by one). Manifest passed the filtered index for hover/store lookups. Two indices needed: `displayIndex` for numbering, `stepIndex` for hover keys. Subtlety: the map's `stepOrder` uses post-`skipLeadingRest` index while the store expects raw `route.steps[stepIndex]` (pre-existing assumption of no leading rest). Chosen fix to avoid introducing a new mismatch: manifest `stepIndex` = post-`skipLeadingRest` position (matches the map).

### 15. Territory planner "fetch failed" overlay at Build
- `Unhandled Runtime Error Error: fetch failed` at `libs/common/src/lib/utils/fetcher-rsc.ts (66:20)`, from `common-layout-rsc.tsx:30` (BFF `/common/api_keys`) — not territory code. Curl to BFF returned 403 unauthenticated in ~137 ms (connection fine). Hypotheses: HMR/fast-refresh racing with rapid edits; the pipeline's HiGHS WASM + polygon-clipping blocking the Node event loop (so concurrent RSC fetch fails). Suggested: dismiss overlay, hard refresh, retry; check terminal for real cause (ECONNRESET/timeout); if reproducible exactly at Build click, move `runPipeline` to a worker thread (~30 lines). (User interrupted before this was acted on.)

### 16. Wrong-menu edit
- "add 'Territory Planning' to this group [Image]": first edited a nav menu that wasn't the one shown (missing top items), then another `menu.tsx`; the screenshot's compact dropdown on top-right icons is `page-head.tsx`. Lesson: match the screenshot's structure to the component before editing; entry added between "Saved Solutions" and "Settings", gated on `canPlanRoutes`.

### Transcript part F (chunks 16-18)

- **Read the symptom, locate the owner of the number**: user asked "why is 'weekly workload' so high relative to max rep-day and caps" - agent traced that labels, not math, were wrong (operation-wide total vs per-rep) and offered two minimal fixes (rename vs subtitle). User picked "do #2".
- **MUI DataGrid footer lied**: "imported a dataset with 5000 records and then filtered to VEND. NOTURNO - still shows 5000 rows selected." The "5,000 rows selected" footer is MUI DataGrid's built-in selection state, unaware of the filter; header counter (`{selected} of {total} selected`) already used the filter-intersected `activeSelected` and is what Build submits. Fix: hide DataGrid's own footer count (offered `slots.footer` for a custom filtered+selected count).
- **Check the logs for the real failure, not the user-visible one**: "pipeline finished without returning a result" -> pulled Cloud Run logs -> OOM. "Production error digests hide the real message" -> pull Cloud Run logs for the digest. Don't trust `DEADLINE_EXCEEDED` startup-probe line as a diagnosis.
- **Isolate Terraform vs platform**: when Cloud Run failed twice with "internal error", deployed the placeholder image manually with gcloud (cuts Terraform, secrets, env vars out). Worked -> config/IAM propagation race, not image. Delete the test service before retrying.
- **Symptom pattern for expired JWT (deployed app)**: `nbai` org label shows (decoded client-side from JWT payload), POS points on map (from uploaded file), BUT Billing Project dropdown empty (BFF `preferenceList`/`subscriptions` -> 401) and map tiles empty (style URL needs `?key=<apikey>`; no billing project -> no API key -> tile fetch fails). Check the `exp` claim first; then check `subscriptionList` is non-empty (an empty `subscriptionList: []` keeps the dropdown blank even with a fresh token). Verify token payload at jwt.io.
- **Verify the patch is actually in the deployed image before blaming config**: "Let me verify my STANDALONE_MODE patch actually made it into the deployed image" - led to discovering other HTTP layers (Server Actions, ky) not covered.
- **Grep every network path before declaring standalone done**: the app had at least 5 HTTP paths (RSC layout fetch, `fetcher-rsc`, `fetcher-client`, `v3/api` ky client, data-mapper `/ai/*`). Each had to be patched separately.
- **Wrong menu**: Import JSON was first added to the Configure gear menu; user screenshot showed production's item sits in the top-right WAFFLE (AppsIcon) menu. Agent found the left hamburger first, then the right one: `page-head.tsx`. Lesson: match against the user's screenshot, not the first menu with similar items; re-check where the component is mounted (PageHead is on pages without the redux Provider).
- **Wrong coordinate order in Import JSON** (user: "when I paste in JSON the locations aren't getting processed"): three bugs in the normalizer: (1) preview treats `v.start_location` as a flat string, normalizer stored `{location: "..."}` (so `parseLngLat` got an object and silently hid vehicles); (2) app internal canonical format is `"lng,lat"` (comment in `preview-lasso.tsx:35-38`) while NBAI request bodies use `"lat,lng"` - must swap; (3) NBAI shape is `{"locations": {"location": ["lat,lng", ...]}}` not a bare `locations` array; resolve `start_index`/`location_index` into `locations.location[]`, inline `start_location: {location: "..."}`, or flat `start_location: "..."`. Traced via outbound `normalizeInput` to learn the round trip.
- **Local stale dev server**: user "I'm not seeing the Import JSON item in the local build" -> found `next dev` PID started before the change (10:35 AM) - restart needed (Rematch models bound at store creation).
- **Check for existing patterns before writing**: Poll "Ok + empty result" pattern located in `actions/server/optimization.ts:118`; options-builder extracted from `normalizeInput` to `buildOptimizationOptions` rather than duplicating.
- **Probe an unseen API before coding to it**: for `/predict`, fetched Swagger docs; for `parsed.flexible_reasons[]` and `matrix.type`, probed the live API with different payloads (found `flexible_reasons` = array of strings, `matrix.type` = `dm` or `mdm`; tested what triggers `mdm`).
- **Time anchoring mismatch** diagnosed by comparing server tz (UTC on Cloud Run) with browser local tz (see the timezone section).
- **Background build hygiene**: stuck-looking build ("seems stuck") was actually healthy - read the docker step timeline (`#15 DONE` yarn install 45 s cache hit; `#16 ... RUN yarn nx build` at 8m43s; browserslist warning near end means near done).
- **One "exit 64" scare** was a template typo in the agent's command, not docker; verify before blaming the tool.

---

### Appendix 0 (full-length user messages: continuation summaries and long pastes)

- **Is a stuck install CPU-bound, network-bound or waiting on a child?** `top -l 1 -o cpu -n 5 | head -15` (CPU idle %), then `lsof -p $(pgrep -f "yarn install" | head -1) 2>/dev/null | grep -E "TCP|REG" | head -30`. An open-for-write `build.log` of size 0 under `/private/var/folders/.../T/xfs-*/` and no TCP sockets means yarn is waiting on a postinstall/build script.
- **Is a stuck `nx build` actually compiling?** `ps -ef | grep -E "next-server|webpack|swc|nx build" | grep -v grep`. Only the `yarn nx build` wrapper with no compiler child and an idle CPU means nx is stalled.
- **Peel the install down**: disable every optional network or daemon feature (`NX_CLOUD_ACCESS_TOKEN=`, `NX_NO_CLOUD=true`, `NX_DAEMON=false`, `NX_SKIP_NX_CACHE_INSTALL=true`, `CYPRESS_INSTALL_BINARY=0`) and add `--inline-builds` so build output is visible instead of hidden in a build log.
- **404 with a half-populated page is usually an upstream failure.** Match the frontend log (`Failed to load org data Response {status: 500 ...}`) to the BFF log with the same timestamp (`9:13:54 AM` frontend date `13:13:54 GMT`) before touching UI code.
- **`ENOTFOUND bff`** means a server-side fetch is using the container-network hostname; set `BFF_HOST` and `NEXT_PUBLIC_BFF_HOST` at runtime (server-side and browser-side values are separate).
- **Warnings that were not the cause**: the `@nx/enforce-module-boundaries` "No cached ProjectGraph" flood, node-gyp `-Wcast-function-type-mismatch`, core-js donation banners, `require-in-the-middle` Critical dependency, yarn peer-dep YN0002/YN0060. In each paste the actual failure was a different line (`Failed to compile.`, `ENOTFOUND`, `storage.objects.get`).

### Appendix 1 (full-length user messages: continuation summaries and long pastes)

1. **Wrong-file / v1-vs-v3 trap** (cost many round trips for "Locale switcher not showing on solution page"). The assistant edited `components/solution/solution-toolbar.tsx` (v1) but `/solutions/[requestId]` renders `v3/features/solution/components/solution-toolbar.tsx`. Sequence of user messages: "not seeing language selection carrying through to the solutions pages" -> "still nothing in the solution toolbar" -> "there's nothing showing. Can you troubleshoot in the browser?" -> DevTools check showed 0 LocaleSwitchers and `document.documentElement.outerHTML.includes(...)` false -> "I've done all of those steps multiple times" -> "are we sure that the URL pattern route-planner/solutions/{request_id} would catch the toolbar change" (the user's question was the key insight) -> assistant traced `app/solutions/[requestId]/page.tsx` imports (`'../../../v3/features/solution'`). Same pattern recurred for the manifest card: `libs/route-planner-components/src/lib/job-step-card.tsx` was translated, but the visible card was `v3/features/solution/components/step-card.tsx`. **Rule: before editing a UI component, trace from the route file's imports to the component actually rendered; grep for the visible string to find every copy.**
2. **Watcher vs. real problem**: when edits "don't show", first confirm the dev server printed a `Compiled ...` line after a `touch`; if not, restart with `WATCHPACK_POLLING=true yarn next dev -p 4200` (user's explicit instruction).
3. **Lasso clicks not registering**: DeckGL canvas sat above the capture div inside `<Map>`. Fix: render `PreviewLassoDrawing` as a **sibling of `<DeckGL>`** at z-index 1000.
4. **Lasso matched 0 jobs although the polygon enclosed many** ("when I close this polygon I end up with 0 jobs selected eventhough I've enclosed a large number of them"): `parseLngLat` assumed `"lat,lng"` but the parser stores `"lng,lat"` — return the split `parts` directly as `[lng, lat]`.
5. **Dragging a polygon vertex panned the map instead** ("not working - drags the map and not the vertice"; then "nothing emitted in the console log"): react-map-gl `Marker draggable` doesn't reliably intercept mousedown over deck/maplibre. Bypass: custom overlay outside DeckGL with Pointer Events + `setPointerCapture` + temporarily disabling `map.dragPan`.
6. **"Maximum update depth exceeded"** after vertex drag worked: `applyPolygonSelection` ran on every `pointermove`, causing viewport re-fit -> tick bump -> re-render loop. Split `onChange` (cheap; polygon shape only) from `onCommit` (heavy; selection apply; on drag end only).
7. **ky hook pipeline termination**: no `[ky:authHook]` log although `[ky:apiKeyHook]` fired 3 times (console: `client.ts:73 [ky:apiKeyHook] apiKey? true url: https://bff-staging-.../route-planner-api/v1/solutions/<id>`, `/optimization/v2/result?id=<id>&caller=route-planner`, `/optimization/v2/get_request_input?id=...`). ky stops running remaining `beforeRequest` hooks once a hook returns a new `Request`. Fix: merge `createApiKeyHook` + `createAuthTokenHook` into one `createAuthHook` in `v3/api/client.ts`; and change `getAuthToken` in `v3/api/api.ts` from `() => (env.preview() ? Cookies.get(TOKEN_COOKIE) : undefined)` to always attach the JWT. Debug technique used: build-stamped log lines (`[ky:client.ts] module loaded BUILD-2026-05-29-A`, `token cookie? true`) to prove which bundle the browser is running.
8. **Cookie silently rejected**: `Domain=.localhost` cookies are dropped by Chrome. Remove the domain attribute so the cookie binds to the exact host.
9. **BFF 403 on every endpoint** (`status: 403 ... content-length: '69'`, url `.../common/api_keys?apiKey=opensesame&`): AuthGuard rejected the JWT because its audience (`aud`) didn't match the BFF's `IAM_CLIENT_ID`. Fix: user updated the `bff-staging-iam-client-id` Secret Manager secret to the client id used by the deployed frontend (`d9883f93-...`) and rolled a new revision (Cloud Run `latest` secret refs are resolved at revision creation, so a new revision is required after changing a secret). Also: **`apiKey=opensesame` only works for unauthenticated routes**; BFF endpoints need a valid JWT, so an apiKey alone does not work for `/common/api_keys` etc. A stale `apikey=opensesame` cookie persisted because `AppContextProvider` only sets the cookie if missing -> manual clear, later automated by clearing it in `/dev-login`.
10. **BFF 500 on `/common/api_keys` in Cloud Run** — read the BFF's own logs with a filter: `gcloud run services logs read bff-staging --region us-central1 --project [GCP_PROJECT] --limit 30 | grep -i -E "api[-_]?key|gs://|downloading|error"`. Found: `LOG [ApiGatewayService] Downloading nbai api-key configuration file from gs://waymer/apikeys_stg/orgs_v2.` then `ERROR [ExceptionsHandler] <service-account> does not have storage.objects.get access to the Google Cloud Storage object. Permission 'storage.objects.get' denied on resource (or it may not exist).` (stack from `@google-cloud/storage ... util.js:79:15`). Fix: create `gs://[GCP_PROJECT]-bff-config`, copy the `apikeys_stg/orgs_v2` objects, set `CONFIG_PATH` env on bff-staging; `gcloud storage ls gs://[GCP_PROJECT]-bff-config/apikeys_stg/orgs_v2/` -> `ERROR: (gcloud.storage.ls) One or more URLs matched no objects.` proved the path layout was wrong (the existing `CONFIG_PATH` value is `[GCP_PROJECT]-bff-config/apikeys/orgs_v2`, i.e. `apikeys/` not `apikeys_stg/`). After correction the same grep showed repeated `GET 200 .../common/api_keys?apiKey=...`.
11. **BFF 500 on config save** ("error when 'Generate Route' with saving the config"): `⨯ actions/server/configure.ts (93:13) @ _saveConfig ⨯ Error: <sa> does not have storage.objects.create access to the Google CloudStorage object. Permission 'storage.objects.create' denied on resource` (thrown at `_saveConfig (./actions/server/configure.ts:72:19)`, `POST / 500`); BFF log equivalent: `ERROR [NccConfigService] Error: <sa> does not have storage.objects.list access to the Google Cloud Storage bucket` while `Getting file list from gs://nb-ncc/config_stg/<org>/<user>/preference`. Fix: make the bucket configurable (`NCC_CONFIG_BUCKET`, default `nb-ncc`) and have the user create `gs://[GCP_PROJECT]-ncc-config` with the runtime service account granted object admin. Verification log lines: `Saving saveData configuration file to gs://nb-ncc/config_stg/.../preference/FEMSA_BRASIL` and `.../input/FEMSA_BRASIL`.
12. **`TypeError: Cannot read properties of null (reading 'subscriptions')`** at `libs/common/src/lib/components/common-layout/common-layout-rsc.tsx:58:20` (line 62: `if (config.subscriptions.length > 0) {`), `GET / 500`, digest `1524531049`. Cause: the BFF `/common/api_keys` (org/api-key config) call failed (500 from the GCS permission issue above) so `config` was null. Lesson: a null deref in a server component is usually a swallowed upstream error — look at the `⨯ Response {status: 500 ... url: .../common/api_keys}` line printed just above it and then the BFF logs.
13. **Confirming which BFF the frontend talks to**: `grep BFF_HOST apps/route-planner-v2/.env` vs `.env.local` — `.env` had `http://localhost:3000` while `.env.local` (which wins) had the Cloud Run `bff-staging-...run.app` with the localhost lines commented out. Always check both files plus the real process env when a request hits an unexpected host.
14. **Curling a Cloud Run service by mistake returns a placeholder page**: `curl -i "https://bff-staging-.../common/api_keys?apiKey=..." -H "Authorization: Bearer $(grep DEMO_NCC_TOKEN apps/route-planner-v2/.env | cut -d= -f2)"` returned `HTTP/2 200 ... <title>Congratulations | Cloud Run</title>` (the default "hello" container) because `grep` failed (`apps/route-planner-v2/.env: No such file or directory`, run from the wrong directory) and the service URL/revision pointed at the placeholder image. A 200 with that HTML means no real image is serving that URL.
15. **Listing what image is deployed vs pushed**: `gcloud artifacts docker images list us-central1-docker.pkg.dev/[GCP_PROJECT]/bff/bff-staging --include-tags --sort-by=~UPDATE_TIME --limit=5` (shows tag/digest/create+update time) to verify that the revision you think you deployed is the latest tag.
16. **Console-log instrumentation for map zone bugs (2026-06-02)**: user pastes of `[buildZones] inputCore.clusters snapshot: {count: 12, ...anyWithGeojson: true}`, `[buildZones] cluster[0] sample coords: {"ringLen":13,"firstPoint":[-46.65819,-23.67331],"midPoint":[-46.64574,-23.61656],"lastPoint":[-46.65819,-23.67331]}` (closed ring: first == last; São Paulo area lng/lat order confirmed), `[runClustering] storing clusters: {count: 10, sampleRawGeometry: 'zleoC`on{Gh}@...' (encoded polyline), sampleGeojsonPresent: true, sampleGeojsonRingLen: 10}`, and `[preview-map] layers about to render: {showZones: true, zonesPropCount: 10, baseLayerIds: Array(2), allLayerIds: Array(4), firstLabelLayerId: 'road_gondola_label'}` with `allLayerIds: ['ZoneLayer','vehicles','job-pin-clusters','job-pin-cluster-counts']`. Outcome the user reported: "but nothing visibly rendered" — data was present and layers were registered, so the bug was in rendering (layer ordering/`beforeId` relative to the style's first label layer, or deck layer ids not matching), not in data. Debug method: log counts at each pipeline stage (state -> built zones -> layers) to bisect data vs rendering. Also user-reported: "point with infowindow is not contained by the newly adjusted zone 3 but it still shows zone 3 in the infowindow" — infowindow zone label comes from stored job zone assignment, not recomputed after polygon edit.
17. **Vague translation requests via screenshots**: user sent many "translate [screenshot]" messages; the assistant fell behind and tracked a backlog list (DateTimePicker 24hr, Rows per page, Status badge, Analytics view, Timeline header, Dev dialog, Settings page). Lesson: when a catalog-key task spans 4 locale files, add code + catalog entries in the same step to avoid a "code done, catalog pending" backlog that shows raw keys at runtime (next-intl renders missing keys as the key path / throws).

### Appendix 2 (full-length user messages: continuation summaries and long pastes)

### Coordinate-order bugs (lat,lng vs lng,lat), full catalogue from this stretch
1. **Clustering request** failed with "location out of service area" because internal storage is `lng,lat` strings and the NB clustering API wants `lat,lng`. User: "coordinates in clustering API request seems swapped - should be lat,lng". Fix in `input-core.ts` `getLocIndex`:
   ```js
   const lngLatToLatLng = (locStr) => {
     const parts = locStr.split(',').map(s => s.trim())
     if (parts.length !== 2) return null
     const [lng, lat] = parts
     if (!lng || !lat) return null
     return `${lat},${lng}`
   }
   ```
2. **Cluster polygons rendering in the wrong place / missing for NEW preferences** while old saved preferences rendered fine. User diagnosed from an image: "the issue is related to swapping of lat,lng values". First belief (earlier turn) was that `@mapbox/polyline` decodes `[lng,lat]`; after the request swap (item 1), NB returns polylines in the order it received coordinates, i.e. `[lat,lng]`, so `polylineToGeoJsonPolygon` must now swap:
   ```ts
   const ring: [number, number][] = coords.map(([lat, lng]) => [lng, lat] as [number, number])
   ```
   Lesson: encoding order echoes input order; changing the request order changes decode order; keep both ends in one commit.
3. **Distance Matrix in analytics**: user: "I think your DM request has lng,lat and not lat,lng". `step.location` is `[lat, lng]` (type comment lies). Serialisation: `sampled.map((s) => \`${s.location[0]},${s.location[1]}\`).join('|')`. Confirmed by reading the sibling code that swaps for turf (`use-solution-map.ts:83`). Generic technique: when a type comment and runtime disagree, find a sibling consumer that already works (e.g. turf call) and copy its convention.
4. Discover autocomplete bias: `&at=lat,lng` to 6 decimals.

### Diagnose with logs, but prove data vs renderer first
- Zone polygons not visible while clusters were colour-coded: pasted logs `[buildZones] inputCore.clusters snapshot: {count: 12, anyWithGeojson: true}`, `{clustersInState: 10, clustersWithGeojson: 10, jobZoneCount: 500, ...}`, and `[preview-map] layers about to render: {showZones: true, zonesPropCount: 10, baseLayerIds: Array(2), allLayerIds: Array(3), firstLabelLayerId: ...}` showed data was healthy, so the bug was in layer ordering/overlay mode, not data. Procedure: log counts at each stage (state, props, layer ids), confirm `'ZoneLayer'` appears in `allLayerIds`, then isolate the renderer.
- Iterations tried and the verdicts: `beforeId: firstLabelLayerId` with `road_gondola_label` and `place_park` (too low in the MapLibre stack, buried polygons); `beforeId: undefined` for ZoneLayer; split overlays. All failed; revert to single non-interleaved overlay worked.

### Hover/tooltip failures: check pickability, dedup state, and transparent pixels
- **Tooltip only on clusters, not individual pins**: `zonedJobLayer` was `pickable: false`; the underlying IconLayer has transparent pixels around the icon, so cursor often hit nothing. Fix: make `zonedJobLayer` `pickable: true` with an `onHover` that finds the job in `output.job` by id and synthesises a Feature with rich properties.
- **Tooltip stops after filters apply**: shared lib `createHoverHandlers().onInputHover` kept module-level `lastHoveredId` dedup across renders; after a filter re-render the cursor re-enters the same icon id and the dedup short-circuits. Fix: inline wrapper setting `popupType: 'input'` and `setHoverInfo(info)` with no dedup.
- Cluster circle: `pickable: true`, `onHover` sets `popupType: 'pinCluster'` and calls `setHoverInfo` directly; tooltip text "N jobs in cluster — zoom in to see details".
- Pattern: for hard-to-reproduce hover issues, add a diagnostic `console.log`, ask the user to paste it, then remove it.

### Selection semantics (tri-state)
- "Clear-all selection still showed full superclusters": the filter treated `length === 0` like `length === jobs.length`. Fix: `selectionIsAll = selectedJobs.length === jobs.length`; empty selection means no features.
- Lasso: "I do a lasso selection here and 4 items are selected. However, I still see all the markers outside of my selection boundary" led to auto-hiding non-selected markers (selection-aware `spideredJobs` and `zonedJobLayer`).
- Vertex membership: "still seeing issues with jobs being included in a polygon membership when the job serves as one of the vertices for the zone polygon" led to point-in-polygon with boundary inclusive (`booleanPointInPolygon(..., {ignoreBoundary: false})`) plus a post-pass in `runClustering` that reassigns jobs whose API cluster does not contain them.

### Map jitter on zoom / snap-back
- `viewBbox` jittered because cluster-filtered `mapData.job` changed. Fix: `lastFitKeyRef` keyed on data shape (lengths); `viewBbox` stays in deps so the initial fit fires once.

### Falsy-zero bug
- First geocoder row click did not zoom/centre the map. Root cause `geocode-preview-modal.tsx:327`: `selectedRowIndex || -1` turned index 0 into -1. Fix `selectedRowIndex ?? -1`. Rule: never use `||` on indices/counts.

### Performance: typing in a search box with 244 routes
- 150ms debounce alone did not fix lag, because the parent `RoutePanel` re-rendered on each keystroke along with 244 `RouteCard`s. Final: extract `RouteSearchInput` with local state + debounced store update, and wrap `RouteCard` in `React.memo`.
- Related feature: auto-select routes matching the search query:
  ```tsx
  useEffect(() => {
    if (!routeSearchQuery.trim()) return
    selectAll(filteredRoutes.map((r) => r.vehicleId))
  }, [routeSearchQuery, filteredRoutes, selectAll])
  ```

### Stale local component state vs Redux
- Zone filter chips vanished after Jobs -> Vehicles -> Jobs tab switch while the filter still applied. Cause: `selectedZones` was local `useState` in `JobFilterBar`/`VehicleFilterBar` (lost on unmount) while the filter RESULT (`selectedJobs`/`selectedVehicles`) lived in Redux. Fix: persist the inputs in Redux (`jobFilterZoneIds: number[]`, `vehicleFilterZoneIds: number[]` in `InputState`, reducers `setJobFilterZoneIds`, `setVehicleFilterZoneIds`, init `[]`) and derive chips:
  ```ts
  const persistedZoneIds = useSelector((state: RootState) => state.inputPreview.jobFilterZoneIds)
  const selectedZones = useMemo(
    () => zoneOptions.filter((opt) => persistedZoneIds.includes(opt.id)),
    [zoneOptions, persistedZoneIds],
  )
  const setSelectedZones = (next: ZoneOption[]) => {
    dispatch.inputPreview.setJobFilterZoneIds(next.map((z) => z.id))
  }
  ```
  `clear()` dispatches `setJobFilterZoneIds([])`. Rule: if the filter result is global state, the filter inputs must be too. At summary time `VehicleFilterBar` was NOT yet converted.

### Two code paths for one feature
- "9 columns need manual mapping" after AI mapping: the Description-fallback was first added to the debug-dialog Apply path (`handleApplyAiMapping`); the user still saw unmapped columns ("still ending up with unmapped columns") because the production auto-apply path was separate. Fix both:
  ```ts
  const claimedIndices = new Set<number>([
    ...newDataMappings.map((m:any) => m.index),
    ...newMetaMappings.map((m:any) => m.index),
  ])
  headers.forEach((header, idx) => {
    if (claimedIndices.has(idx)) return
    newDataMappings.push({index: idx, value: 'description', header})
  })
  ```
  Status always 'success'; toast mentions the fallback count. Lesson: grep for every caller / sibling path of the function you patch.
- Description pipe-join order: in `utils/parser/data-parser.ts`, sort `mapOptions` by `item.index` when `descNum > 1` so the `|`-joined description matches table column order (user: "ordering of the contents of the 'description' field on a job should be in the same order as shown in the import table (with the usual '|' delimiter)").

### Compile error after removing a field
- After dropping `totalDriveMinutes` from `ZoneAggregate`, `ZoneBalanceChart` still referenced it for the `'drive'` metric. Fix: remove `'drive'` from the `WorkMetric` union and from the `MenuItem`. Rule: when removing a field, grep consumers.

### Demo login 404 and redirect
- 404: `fetch('/api/demo-login')` hit `http://localhost:4200/api/demo-login` but the route is at `/route-planner/api/demo-login` because of `basePath`. Browser `fetch()` does NOT auto-prepend Next basePath. Use `${ROUTE_PLANNER_BASE_PATH}/api/demo-login`.
- Redirect to base URL: middleware passed `next=/`; after login `window.location.href='/'` had no page. `resolveNext()`:
  ```ts
  function resolveNext(raw: string | null): string {
    if (!raw) return ROUTE_PLANNER_BASE_PATH
    if (!raw.startsWith('/')) return ROUTE_PLANNER_BASE_PATH
    if (raw === ROUTE_PLANNER_BASE_PATH || raw.startsWith(`${ROUTE_PLANNER_BASE_PATH}/`)) return raw
    return ROUTE_PLANNER_BASE_PATH
  }
  ```
  This also blocks open-redirects (only same-origin paths under basePath).

### 403 on route edit (`/directions/json`)
- User: POST `https://bff-staging-.../directions/json?caller=optimization&apiKey=...` returned `statusCode: 403, message: 'Forbidden resource'`. Fix in `v3/api/directions.api.ts`: add the BFF bearer token:
  ```ts
  const nccToken = Cookies.get('ncc_token')
  const headers: Record<string,string> = {'Content-Type':'application/json'}
  if (nccToken) headers.Authorization = `Bearer ${nccToken}`
  ```
  (`?apiKey=` alone is not authentication for the BFF; same lesson as the earlier IAM JWT AuthGuard.)

### Empty tooltip container
- Returning null from a `MapTooltip` render prop still rendered an empty styled box; fix the wrapper to skip rendering on null/false (see Architecture).

### Analytics "0 stops / no zones / empty Drive Time"
- Sequence: "No zones to summarize" (wrong store selector) -> "zone load summary shows no load in any zone" (`step.jobId` vs `step.id`) -> "Drive Time values are empty" (polygon-segment attribution rarely fired for depot-centric routes). The user then proposed: "Can we calculate an average drive time between all points - to measure the density/distribution?" and "this could be a nextbillion DM call to get the drive time matrix across all points".

---

### Appendix 3 (full-length user messages: continuation summaries and long pastes)

### Drag-drop crash `Cannot read properties of undefined (reading '0')` (2026-07-06)
User paste: `[DragDrop] Move failed: TypeError: Cannot read properties of undefined (reading '0') at moveStepCrossRoute (...)`. Traced the minified stack to `applyDirectionsResult` in `v3/domain/operations/recalculate-route.ts` line 658 `directionsResult.routes[0]`. Root cause: the BFF Directions endpoint can return HTTP 200 with an error-shaped body (`status: "Error"`, `message: "..."`, no `routes` field). Fix at two layers (fix where all callers route through):
```ts
// recalculate-route.ts
const dirRoute = directionsResult.routes?.[0]
if (!dirRoute) return route   // bail to the original route
```
```ts
// v3/api/directions.api.ts
const body = (await response.json()) as Partial<DirectionResponse> & {msg?: string}
if (!Array.isArray(body.routes)) {
  throw new Error(body.message ?? body.msg ?? 'Directions API returned no route — try a different move or location.')
}
return body as DirectionResponse
```
The existing `catch` in `moveStepCrossRoute` restores the snapshot on throw, so a thrown upstream error is safe.

### "Old preference columns not auto-mapped after API re-import" (2026-06-25)
User: "on vehicles tab, I deleted a set of data that had columns mapped for this 'preference'. I then reimported via the API and the columns were no longer mapped." Approach: first verify the path executes (`mock-api-import.ts:152` calls the same `onDataUpload(header, rows)` as CSV upload, so the new `importRawData` thunk should fire); then the most likely cause is data: the stored preference predates `mapConfigs` bundling, so there is nothing to read back (or the name doesn't match / not in `preferenceList`). Added a success toast so the user can see whether the restore path ran: `notify(`Restored ${appliedCount} column mapping${appliedCount === 1 ? '' : 's'} from preference "${fileName}"`, {severity: 'success', duration: 3000})`. Diagnostic lesson: when behavior might be "not deployed data" vs "real bug", add observable feedback that distinguishes the two instead of guessing; instruct the user to re-save the preference first.

### TypeScript errors hit while building `importRawData`
- `Property 'result' does not exist`: wrongly used `res.result?.content`; the real shape is `res.errMessage` / `res.payload?.data` (`ServerActionResponse<ConfigFileResponse>`).
- `appliedStoredMapping` on `unknown`: Rematch effects return `unknown`; cast as `(await dispatch.inputCore.importRawData({...})) as unknown as {appliedStoredMapping: boolean}` (pattern copied from `clustering-panel.tsx:97`).

### FEMSA fixture debugging (2026-07-11)
- Enriched descriptions not displaying: `parseFemsaJobsCsv` set `description: row.Matricula`, which made `enrichRawRoutes` clobber the enriched JSON descriptions. Fix: omit `description` from CSV-derived jobs. User had asked "not seeing the new full description... is there a cached version that needs to be deleted?" — the cache wasn't the cause.
- Cluster counts too low (user: "cluster counts seem very low. There are more than 21k total stops and sum total of cluster counts should reflect that"; ~1,267 vs 19,370): stacked-location steps (>= 2 routes at one coordinate) were excluded from supercluster features. Fix in `use-map-layers.ts`: include them with `isStacked` flag so they count, but filter them out of the un-clustered leaf render path.
- Cluster 72 degenerate geometry: one point shared by 8 jobs, buffered to a ~22 m x 22 m box.
- FEMSA2 zones not showing: zone-name regex `/^(\d+)-/` failed because FEMSA2 zones have no `name`. Fix: drive zone filtering from `rawInput.jobs[].zones`:
  ```ts
  const jobZoneMap = new Map<string, Set<string>>()
  for (const job of rawInput?.jobs ?? []) {
    const jobZones = (job as {zones?: Array<string | number>}).zones
    if (!Array.isArray(jobZones) || jobZones.length === 0) continue
    jobZoneMap.set(String(job.id), new Set(jobZones.map((z) => String(z))))
  }
  ```
- Polylines: `use-route-layers.ts` `if (selectedRouteIds && selectedRouteIds.size >= routes.length) return []` (user: "don't render route polylines when all routes are selected. Only show the polylines if a subset of routes has been selected").
- Snap behaviour feedback on the From/To date-time filter: user "snap should only occur on the first select or when the control is initialized"; fix: `snapDayjsToBoundary(next, 'start')` only when stored `start == null`. Defaults: From hour 00:00, To hour 23:59; locale map en/pt-br/es-mx/fr-ca/pl, `ampm={false}`; font sizes `.MuiInputLabel-root: {fontSize: 12}`, `.MuiInputLabel-shrink: {fontSize: 11}`.
- Search box (user: "should search against both the job.id and job.description fields") ended as step.id/step.description only (removed vehicleId/route.description matching).
- Location consolidation for the clustering request: grid-based 0.0015 deg cells took 6,362 -> 3,216 groups (<4000 requirement), centroid used for merged location. Description enrichment script is idempotent (skips if description already contains `|`).
- Zones built from routes (user: "examine the routes in the solution JSON and break into their individual days... create a zone that encompasses the stops on a given route... names {zone_id}-{week}-{day_of_week}"): Sao Paulo local time (UTC-3), convex hull with buffer fallbacks for degenerate cases, producing 953 zones named `{vehicleId}-{week}-{day}`. User constraint: "only show zone geometry when the user has selected a route and the zone for that route will be shown." (Later superseded for the zone filter.)

### Zone filter iterations (2026-07-14): three tries to match the user's mental model
1. Symptom: filtering "Zone-1-2-0" also showed other zones. `use-map-layers.ts` drew every zone touched by selected routes. Fix: intersect with `selectedZoneIds`:
   ```ts
   const zoneAllowSet = selectedZoneIds.length > 0
     ? new Set(selectedZoneIds.filter((z) => touchedZoneIds.has(z)))
     : touchedZoneIds
   ```
2. Symptom: user wanted only Week 1 Day 2 (July 20) routes but saw July 21 and 23 routes. Primary-zone match alone let other-date routes through. Added day-of-week parsing from zone name: `parseZoneDayOfWeek(zoneName)` with regex `/^Zone-\d+-(\d+)-\d+$/i` and `dayOfWeekFromArrival(arrival, timezone)` = `dayjs.unix(arrival).tz(timezone).day() + 1` (Sunday=1..Saturday=7), using dayjs `utc` + `timezone` plugins; timezone from `vehicle.metadata.ncc_dispatch_timezone` (empty in FEMSA data, falls back to browser TZ).
3. Symptom persisted ("31 routes shown including some from July 23"): day-of-week check was a no-op because the parser received zone IDs ("0") while it expected names ("Zone-1-2-0"). Fix: `zoneIdToName` lookup memo. Result: 15 routes, all July 20, instead of 40.
Lesson: when a filter appears to do nothing, check that the identifier type flowing in (id vs name) is what the parser expects.

### Metrics display bugs (2026-07-14)
- "Why does this show as an increase of 4%?" Distance went down but arrow/trend misleading. `MetricItem` used `isGood ? TrendUp : TrendDown`. Fix: arrow reflects actual direction (`isUp`), color reflects favorability (`isGood`): `{isUp ? <TrendUpIcon size={14} color={isGood ? '#43A047' : '#C62828'} /> : <TrendDownIcon ... />}`; `TrendUpIcon`/`TrendDownIcon` parameterized with a `color` prop.
- "weird that after dropping two stops the 'time' and 'cost' increased significantly" (+23%): NB Directions applies traffic modeling when `departure_time` is the route's first arrival. User instruction: "pin the departure_time to this value when doing recalculations 1783918800". Implemented `const RECALC_DEPARTURE_TIME = 1783918800` in `recalculate-route.ts` with a docstring, and changed `departure_time: route.steps.at(0)?.arrival` to `departure_time: RECALC_DEPARTURE_TIME` in `buildDirectionsQuery`. Context kept: optimizer `travel_cost: 'duration'` makes cost = `route.duration` (travel-only), distinct from total working time (travel + service + wait + setup).
- "Restrictions" section removed from the edit metrics overlay (user: "when doing a route edit, don't show the 'Restrictions' section"): `route-metrics-overlay.tsx` keeps only `routeErrors`; collapsed pill text "| Restrictions(N)" became "| Errors(N)"; dead `RestrictionRow` (~80 lines) deleted.

### FEMSA1 loads straight into edit mode and the page hangs (2026-07-14)
Symptom: "when loading the FEMSA1 solution it is starting in edit mode - this is causing the page to 'hang'" (1218-route draft). Root cause: zustand `persist` middleware in `route-edit.store.ts` rehydrated a stale draft. Fix: disable persistence with `partialize: () => ({})` and make `onRehydrateStorage` unconditionally reset to `initialState`, `editMode(false)`, and `clearStorage()`. Tradeoff chosen: clean load of fixtures over resume-mid-edit-after-refresh; applied edits are still preserved by the local-solution store.

### Editing local fixtures: three breakpoints (2026-07-11)
User asked to "explore the changes needed to allow editing of solutions that were loaded from local files", then "go ahead with option B" (collapse fixtures and imported into one `'local'` bucket). An Explore agent traced three breakpoints:
1. Auto-save gate in `solution-toolbar.tsx:481` (also broke the imported flow).
2. Apply dispatch in `route-edit.store.ts:923-949` fell through to `optimizationApi.editRoutesGcs`.
3. Load hook always refetched, wiping edits.
Fix: new `'local'` source, per-requestId localStorage keys, unified `FIXTURES` map with override-first loading, and apply dispatch:
```ts
} else if (source === 'local') {
  updateLocalSolutionResult(requestId, {status: 'Ok', message: '', result: resultData} as unknown as OptimizationMvrpRetrieveResult)
} else {
  await optimizationApi.editRoutesGcs(requestId, resultData, region)
}
```
Toolbar: `isLocalSource = useSolutionStore(s => s.source === 'local')`; `handleEditRoute`/`handleShare` gate `if (source !== 'db' && source !== 'local')`; `canSave = hasSolution && !isLocalSource`; `canShare = hasSolution && !isLocalSource`.

### Vehicles with no start/end index (2026-07-22): three index conventions
Requests: hide start/end markers ('S'/'E') and manifest steps when the input vehicle lacks `start_index`/`end_index`; first stop should be labeled "1" (user saw markers 2..7); hover offset (user: "I mouseover stop 2 and stop 1 is highlighted"). Fixes:
- `vehicleHasStartEnd` memo from `rawInput.vehicles` (`start_index !== undefined && !== null`); default `{hasStart: true, hasEnd: true}` for vehicles absent from `_rawInput` (imported solutions with no input payload).
- In cluster/non-cluster/rest-marker builders: skip synthetic pseudo-steps (`if (step.type === 'start' && !inputFlags.hasStart) return`), `suppressStart = steps[0]?.type === 'start' && !inputFlags.hasStart`, `labelOffset = suppressStart ? -1 : 0`, label `(stepIndex + 1 + labelOffset).toString()`; labels decided by `step.type` not by array position.
- Manifest `job-list.tsx` returns `{steps, trimmedStepIndexOf}` from a memo that applies `skipLeadingRest`, then filters out suppressed start/end; `SortableStepItem` gets `stepIndex={trimmedStepIndexOf[idx]}` (post-skipLeadingRest index, matches the map's `stepOrder`) and `displayIndex={idx}` (numbering).
- Wrong first attempt: passing raw `route.steps` index (`rawStepIndexOf`); corrected to the post-skipLeadingRest index. Three conventions exist in the codebase (raw `route.steps`, post-`skipLeadingRest`, filtered-for-display); the map hover key uses the second. Latent pre-existing bug noted but left out of scope: the store's `route.steps[stepIndex]` assumes post-skipLeadingRest indexing, wrong for routes with a leading rest.

### Unassigned vehicles tab showing already-assigned vehicles (2026-07-14)
Symptom with screenshot: `Routes (1216)` / `Unassigned (0)` / `Unassigned Vehicles (1784)`, user "still seeing unassigned vehicles tab". FEMSA1 input had grown to 3000 vehicles (1216 in routes + 1784 unassigned). `useUnassignedVehicles` filtered against the frozen `result.routes`, not `draft.routes`. Fix at the consumer, `filteredUnassignedVehicles` in `result-panel.tsx`:
```ts
const draftAssignedIds = new Set<string>((draftRoutes ?? []).map((r) => String(r.vehicle)))
const source = editMode && draftRoutes
  ? unassignedVehicles.filter((v) => !draftAssignedIds.has(String(v.id)))
  : unassignedVehicles
```
Later (07-22) the user said "I'm still seeing Unassigned Vehicles tab in the left panel - need it hidden entirely for now"; the `<Tab value="unassigned_vehicles">` was removed but the render block and memo were left for easy restoration.

### Territory TSP request debugging (2026-07-31)
- NB 400 "No location coordinates" on v1 `/optimise-mvrp`: fixed by pipe-joining `"lat,lon"` values into a single string for v1.
- NB 422 "exit status 2" on v1: switched to v2 `POST /optimization/v2` per the user-supplied OpenAPI YAML and "schema should comply with latest version of NextBillion MVRO": `locations.location` as `string[]` of `"lat,lon"`, string vehicle/job ids, poll `GET /optimization/v2/result`; `status:"Ok"` with empty `result:{}` means still processing (matches `actions/server/optimization.ts`). Options: `options.constraint.max_vehicle_overtime = 3600` (user: "introduce an options.max_vehicle_overtime = 3600 to the TSP request").
- Cum. time inflated: was `arrival - dayStartUnixS` (from midnight). User: "Cum. time seems to be much higher than the clock time". Fix: `arrival - routeStartUnixS + serviceSeconds` with routeStart = first job's arrival. Response step distance/duration/arrival are cumulative and get reshaped to per-stop values.
- Arrival 24h: `formatClock` with `hour12: false`.
- Header label wrong: "2h 50m driving+service" was drive-only per the v2 schema (`Route.duration` = drive time, separate `Route.service`). New header format requested by user: `{h}h {m}m total / service / driving` where `total = totalDurationS + totalServiceS`.
- "why is 'weekly workload' so high (63h) relative to 'max rep-day' and the caps on weekly (37.08) and daily (7.42)?" Answer: the card is the operation-wide sum across reps; fixed by adding a per-rep subtitle `31.5 h/rep · 74% service` (i18n key `perRepAndService`: `t('perRepAndService', {perRep: (weeklyWorkloadH / Math.max(R,1)).toFixed(1), pct: (serviceShare*100).toFixed(0)})`).
- Time windows: xlsx `apps/route-planner/public/FEMSA_-_BASE_POC_FASE_2.xlsx` gained `start_tw_1` / `end_tw_1`. User's original request had a typo (`end_tw_2`); user confirmed "end_tw_1 is correct. the API supports multiple time windows to be specified. In this case I only need to specify one time window - hence tw_1". Rule: TIPO DE VENDEDOR not `VEND. NOTURNO` gets 07:30-16:30; `VEND. NOTURNO` gets 15:00-22:00 (6556 day rows, 558 night rows). `parse.js` `normalizeHm` accepts string "HH:MM", Date, or fractional-day number; reads optional `START_TW_1`/`END_TW_1` via `optionalCol`; parser fallback list reduced to `['END_TW_1']` after the rename.
- Freq colors on route pins: `freqColor` 2 -> red, 1 -> orange, 0.5 -> blue, 0.25 -> green; scope clarified mid-turn by user: "this applies to only the pins on a route polyline", so only the `territory-tsp-markers` layer, with `updateTriggers` on `getFillColor`.
- Multi-day TSP: `Promise.all` + shared `AbortController`; `enumerateRangeDates(state)` returns `[{iso, label, week, day, slotKey}]` with Mon-Fri weekly stride (`w*7 + d` days from anchor); per-day POS filter `p.schedWeeks.includes(week) && p.schedDays.includes(day)`; active tab preserved across selection tweaks unless the date range changes; tab title shows stops count + total time.

### Territory planner edit-mode bugs (2026-08)
- `hullBoundaries` used before declaration: reorder so the `useMemo` precedes the `startEdit` callback.
- Vertex drag conflicts with map drag: `useMap()` -> `map.dragPan.disable()` when `edit` is active, `enable()` on exit.
- Edit and Territories boxes overlap: replaced absolute panels with a shared flex-column rail (top:12, left:12, width:280).
- Saved version loaded as the original (unedited) solution: `onSave` now receives `effectiveResult`; parent snapshots in `saveDialog.result`; `effectiveResultForSave = localResult ?? {...initialResult, pos: editedPos} ?? initialResult`.
- Recalc failure `20 rep-day slots exceed daily capacity` after edits: added `allowOverCap` option (default true in the Recalculate UI, user had asked "is there a way to soften constraints when recalculating"); over-cap count still populates metrics but doesn't fail.
- `Cannot read properties of undefined (reading 'x')` on an empty territory: guard in `schedule.js` `scheduleTerritory`:
  ```js
  if (sub.length === 0) {
    const emptyLoads = {};
    for (const w of CFG.WEEKS) for (const d of CFG.DAYS) emptyLoads[`${w}_${d}`] = 0;
    return { status: 'Empty', loads: emptyLoads };
  }
  ```
- Arrival 03:30 instead of 07:30 (user: "what timezone is being used for displaying the 'Arrival' time details. The arrival time is currently not within the time window for the POS"): `formatClock` used the browser TZ; the server anchors days at UTC. Fix: `toLocaleTimeString('en-GB', {timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false})`.
- CSV `Column not found: MATRÍCULA`: SheetJS decodes UTF-8 CSV bytes as Windows-1252 by default. Fix in `parse-preview.ts`:
  ```ts
  const wb = isCsv
    ? XLSX.read(new TextDecoder('utf-8').decode(buf), {type: 'string'})
    : XLSX.read(buf, {type: 'array'})
  ```
  Server side `parse.js` uses `looksLikeXlsx(buf)` (first 2 bytes `PK`) and `loadCsvBuffer(wb, buf)` with `Readable` + exceljs `wb.csv.read`. `normalizeHeader` = strip BOM + NFC normalize + trim + uppercase, applied to both the header and the lookup names (`col()` and `optionalCol()`).
- DataGridPro footer "5,000 selected" while filtered to VEND. NOTURNO: add `hideFooterSelectedRowCount`; and `handleBuild` must intersect the selection with `filteredRows` (user: "when the filter is applied on the imported territory POS data, only those selected (filtered) POS entries should be used in the territory calculation").
- Preview-table TS errors: `wanted.includes(normalizeHeader(h) as (typeof wanted)[number])` fixed by typing `wanted: readonly string[]`; `valueFormatter: (v) => ...` signature changed in DataGrid, use `renderCell: (p) => typeof p.value === 'number' ? ... `; `columns: GridColDef<PreviewRow>[]` not assignable so cast `columns as GridColDef[]`.

## Decisions & rationale

### Transcript part A (chunks 1-3)

- **Run nx bypass for local build.** Decision: skip nx entirely and use `yarn next build --no-lint` / `next start|dev` from the app dir because nx 19.6.5's native module deadlocks on darwin-arm64/Node 20.19. Trade-off stated: lose `dist/` packaging, `next start` from app dir works fine for "run it locally".
- **`dependenciesMeta nx@19.6.5 built:false`** chosen over env-var tricks because nx reads the Nx Cloud token from `nx.json`; local-only, not to be committed.
- **Run BFF locally (Option A) over preview deploy** — user chose to run BFF locally ("bff is running locally now"), later moved BFF to Cloud Run (`bff-staging`). Rationale given: remote BFFs' CORS whitelist excludes localhost; local BFF is the team's documented dev path.
- **Port 4200 over editing BFF CORS** (recommended A): matches `.env`/docs/teammates; B (add `http://localhost:3001` to `allowedOrigins`) is a one-line BFF edit but needs a BFF-side change remembered on every setup.
- **Use staging IAM + preview client** (`adac0e93-...`) + `bff-staging` as a matched set — tokens are environment-bound.
- **Map defaults (user requirements, verbatim):** "when showing any map view in the route planner, default to using a Tomtom dark style" and "when showing job or shipment locations on the preview map, use a small gray pin for jobs or shipments and a much smaller truck icon for vehicle locations". TomTom dark URL supplied by user: `https://api.nextbillion.io/tt/style/1/style/22.2.1-9?map=2/basic_street-dark`. Implemented: `MAP_VIEW_STYLE_OPTIONS[0]` = `TomTom Dark`; `getMapStyleUrl()` returns the dark URL; `attributionControl={false}` on `<Map>` in preview-map, geocode-preview-map, solution-map, route-edit/map-container, v3/components/map/base-map; `PREVIEW_ICONS_MAP` added (leave `ICONS_MAP` untouched since solution-map uses it); `iconSizes: { job: 14, shipment: 14, vehicle: 18 }` on preview map only via new optional hook param. `settings.ts` deliberately not touched (`settings.mapStyle` unused).
- **Pin redesign:** user supplied an image: "use this type of pin to represent jobs or shipments on the preview map" → solid blue circle `#3b82f6` with 6px white outline (`width=64, viewBox=64`, `r=24`), hover/highlight darker blue `#1d4ed8`; vehicles keep gray truck.
- **Later reversal:** "drop the TomTom dark maps as the default map view" → Light is default again; TomTom Dark remains selector option #5. Caveat: `MapStyleSelector` persists last pick in localStorage `map-style` — pick "Light" once or clear that key to see new default.
- **i18n scope decision:** wire framework end-to-end (next-intl plugin, request config, `NextIntlClientProvider`, switcher persisting `NEXT_LOCALE` cookie) + translate "a meaningful starter set"; full sweep "realistically a multi-day mechanical task (hundreds of files)" → follow-up with catalogs flagged for native review. Locales: `en`, `pt-BR`, `es-MX`. Translation approach for dropdown option labels: keep shared `AVOID_OPTIONS`/`EXCLUDE_OPTIONS`/`HAZMAT_OPTIONS` English and translate inside `createPreferencesSelect` via key prefixes (`road_${value}` → `road_toll`, `road_left_turn`; `hazmat_*` fall back to English via try/catch on `t()`); search uses localized labels. Mapper field labels: `useFieldLabel()` sanitizes `option.value` (strips `#`, `.`, spaces; dots → `__`, e.g. `costs.fixed` → `costs__fixed`), falls back to `option.label`; `useGroupLabel()` keys by `MenuGroup` English string. Upstream typo preserved in keys: `breaks_descriptiom_N`. Numbered children (Skill 1–6 etc.) added later via ~100 bulk `mapperFields` entries/locale. Step-type badges (START/JOB/BREAK/LAYOVER/END) deliberately left English (1–2 char labels, shared `<StepBadge>`).
- **Locale switcher placement history (user-driven):** floating fixed globe at top-right overlapped avatar/kebab → user: "provide more separation between the menu item and the language selector" → `right: 96`; user then pointed an arrow back near the kebab → `top: 8, right: 16`; finally "keep working on lasso and then when complete do the globe position" → moved inline into `page-head.tsx`'s right-aligned `<Stack spacing={2}>` after the Dev Mode toggle, before AppsIcon menu. Considered cleaner alternative (an `extraRight` slot on shared `NbAppBar` in `libs/common`) but deferred because it changes every app's signature — "worth confirming with the team". Later added to v3 solution toolbar (breadcrumb row right side) and, in the legacy toolbar, both breadcrumb row and after "Save to folder".
- **Preference profiles (Task 5) decision:** profiles already exist (`preferences.fileName`); mappings already persisted. Gap: `saveInputSet` (`models/input/input-core.ts:1288-1329`) intentionally stripped `rawData.rows` for job/shipment (`rawData: { header: [], rows: [], attachedRows: [] }`) but saved vehicle/depot whole (`inputData['vehicle'] = rootState.inputCore.vehicle`), probably for GCS payload size. Chosen fix: remove the strip so jobs/shipments persist `rawData` (header+rows+attachedRows) + `mapConfig` + `dataMapMenuList`. Load path unchanged (`loadInputConfiguration` → `setInputSet('job', inputData.job)`). Follow-up risk flagged: audit BFF `/config/save` size handling for thousands of rows.
- **Description multi-select (user):** "when mapping data fields (shipments, jobs, or vehicles) allow the user to select multiple columns as 'Description' - each selected field will be part of a concatenated value for description that uses '|' characters as field delimiters". Parser already concatenated (`data-parser.ts:154-158`, `descNum`, `iMultiDesc = descNum > 1`) with `';'` in `parseDescription` (`col-parsers.ts:858-861`). Changes: `';'` → `'|'` (line 859); in `hooks/input/use-current-input.ts:141-149` add `MULTI_SELECT_ALLOWED = new Set(['description'])` that `getDisabledList` strips from the lockout list. Caveat noted: order follows `dataMappings` insertion order (col5 before col2 → `col5|col2`); strict column ordering would be a small data-parser tweak. Applies to jobs, shipments, vehicles, depots.
- **Job filter bar (user spec, verbatim):** "we'll be adding some selection filters for the Jobs list preview that will control which Jobs are selected — ID - value with wildcards e.g. PADA-0*; Description - string matches with wildcards; Time Windows - start and end date time selectors to filter based on time windows entered". Implementation: `job-filter-bar.tsx` mounted in `preview.tsx` above `PreviewDataTable` when `tabValue === 'job'`; `*` = any sequence, case-insensitive; Apply replaces `selectedJobs` with matching indexes, Clear resets to all-selected; time filter is overlap-based. Filter controls *selection* not *visibility*.
- **Selection UI (user):** "when a preview item (job, shipment, vehicle) has been checked/selected, alter the background color of the selected row so that it stands out; when the selection count changes update the 'Jobs', 'Shipments', 'Vehicles' badges to reflect the number of items selected". Implemented: selected-row cells `backgroundColor: rgba(30, 85, 222, 0.08)` in `preview-table.tsx`; tab chip shows selected `count`, tab visibility switched from `count > 0` to `total > 0` so a tab with 0 selected stays visible (otherwise filtering to zero would hide the tab and trap the user). Offer: show `selected / total`.
- **Lasso (user):** "on the preview screen (jobs, shipments, or vehicles tables) provide for the use of a 'lasso' tool for doing map based selections ... When the user has closed a polygon using the lasso tool, those items that are contained by the polygon automatically are selected in the table view." (user noted the route-edit already has a lasso). Match rules: jobs/depots by `location`; shipments pickup OR delivery; vehicles `start_location` OR `end_location`; dispatches `setSelectedJobs/Shipments/Vehicles/Depots` by `state.inputPreview.tab`; hover tooltip suppressed in lasso mode; toggle button top-left under the layer-style chip; polygon dashed blue; clicking toggle again clears.
- **Edit/Add row (user):** "give the user the ability to edit any job, shipment, or vehicle row in the preview screen to override the values that were imported from upload" and "give the user the ability to add a new item to jobs, shipments, or vehicles table from the preview". Design: `EditRowDialog` with `mode: 'edit' | 'add'`; one text field per mapped column (label via `mapperFields`, original CSV `header` as helper text); pencil column between checkbox and data; effects `updatePreviewRow` / `addPreviewRow` in `input-core.ts` with reducers `setRawCell`, `setOutputItem`, `appendRawRow`, `appendOutputItem`; re-parse a single row with `parseJob/parseShipment/parseVehicle/parseDepots` using existing `extraConfig` (timezone) + `connection`; writes back to `rawData.rows[rowIndex][col]` (or `attachedRows` when column is in attached range); new rows sized to existing column width (or largest mapped index for an empty dataset); auto-added to `selected*` sets. Because edits live in `rawData`, they persist through Save (relies on Task 5). Caveats: plain text inputs (invalid numbers → NaN), no "edited" badge, single-row only, Add hidden on Preferences tab.
- **Address autocomplete (user):** "when adding a new job, shipment, or vehicle whenever there is a location entry required, don't show latitude and longitude as entry fields. Replace with an autocomplete address search field that searches against the nextbillion.ai discover API endpoint." BFF tags `proxy-here-discover` but doesn't expose it, so call `GET https://api.nextbillion.io/h/discover?q=<text>&limit=5&key=<apiKey>` directly with `currentApiKey.kid` from `AppContext` (same key the map tiles use); debounce 250 ms, abort in-flight on input change. Group location mappings by `extra.parent` (`location`, `pickup.location`, `delivery.location`, `start_location`, `end_location`) → one `<AddressAutocomplete>` per group; on pick write by type: `LocationLatLng` → `"lat,lng"`, `LocationLngLat` → `"lng,lat"`, `LocationLat`/`LocationLng` → bare value, `Address` → `address.label || title`. Follow-up user decision: "make al discover API requests using api.nextbillion.io and not the staging service" → always `https://api.nextbillion.io/h/discover` regardless of `ENV` (previously switched `api.nextbillion.io` / `sgpstg.nextbillion.io` like `map-style.ts`).
- **i18n of solution view (user):** "work on i18n - localization of this screen - translations and date time format displays" → dayjs locale sync component (`en`→`en`, `pt-BR`→`pt-br`, `es-MX`→`es-mx`) mounted inside `NextIntlClientProvider`; translated tabs, left panel, route card, step card, tooltips; later also v3 toolbar/titles. Remaining English list recorded: Show/Hide Json toggle, timeline tooltips (some later done), analytics titles/axes, Share dropdown + dialogs, step-type badges.
- **Demo auto-login (user):** "allow customer login to route planner using user [EMAIL] and password [REDACTED_SECRET]. This will cause the login and alignment with the 'nbai' organization and all associated keys". Assistant paused to scope ("real security implications and several plausible interpretations"), then implemented dev-only: new `apps/route-planner-v2/app/dev-login/route.ts` (GET; when `ENV=test` POSTs creds to IAM, sets `idToken` as `ncc_token` cookie `Domain=.localhost`, 7d, redirects to `?next=`; **returns 404 in any non-test env** so it can't leak to prod/preview; surfaces IAM JSON error as 401 with `iamResponse`); `middleware.ts` in `ENV=test` redirects to `/dev-login?next=<original>` when no `ncc_token` cookie and path isn't `/dev-login`, `/callback`, `/share-callback`; `.env` gets `DEV_AUTO_LOGIN_EMAIL` / `DEV_AUTO_LOGIN_PASSWORD` (server-read only; override in `.env.local`). Not committed per AGENTS.md/CLAUDE.md.
- **Translation sample (PT-BR) used for quality baseline:** Route Planner → Planejador de Rotas; Steps for Route planning → Etapas do planejamento de rotas; Set Preferences → Definir preferências; Add Orders → Adicionar pedidos; Add Depots → Adicionar depósitos; Add Vehicles → Adicionar veículos; Quick access → Acesso rápido; Load Solution By ID → Carregar solução por ID; Next → Próximo; Job/Shipment → Tarefa/Remessa; Change Preferences → Alterar preferências; Set Your Objective → Defina seu objetivo; Specify Constraints → Especifique as restrições; Max Vehicle Overtime → Horas extras máx. do veículo; Routes/Unassigned → Rotas/Não atribuídos; Map view/Timeline/Analytics → Mapa/Linha do tempo/Análise; Request ID → ID da solicitação; Save to folder → Salvar na pasta; Edit Route → Editar rota; Generate Route → Gerar rota (es-MX: Generar ruta); Use Depots → Usar depósitos (es-MX Usar almacenes); Truck/Car → Caminhão/Carro (es-MX Camión/Auto). PT-BR/ES-MX values are best-effort and flagged for native review.

---

### Transcript part B (chunks 4-6)

- **Demo auth strategy**: user selected "strategy B" first (mock identity + real BFF key), then — once it was shown every BFF endpoint requires a JWT — "option 1" (real iam-stg JWT in `.env.local`, injected by `/dev-login`). Rationale: smallest blast radius for a demo. Option 3 (run BFF locally, `NODE_ENV=development`) was noted as best for iterating (no IAM at all).
- **Fix BFF config, not the app**: user "I am in control of the BFF deployment" → set the real `iamClientId` to the JWT's `aud` rather than hacking auth in the frontend.
- **Copy org config rather than cross-project IAM**: user: "let's go with option 2" (copy `nbai.json` into own bucket, point `CONFIG_PATH` at it).
- **New bucket for config save**: "change to have BFF read/write the nb-ncc bucket in a new bucket that we create in the [GCP_PROJECT] project" → env-var-configurable bucket with default `nb-ncc` so other deployments are untouched.
- **Always attach Authorization** (not only in PREVIEW): safe in all envs because BFF `extractToken` prefers cookie, falls back to header; "belt-and-suspenders"; applies globally via `libs/common`.
- **Merged ky hook** rather than ordering fixes, because ky stops at the first hook returning a Request.
- **Manual clear of stale cookie** over a permanent code fix ("keep it simple").
- **Edit handles outside DeckGL** with explicit z-index rather than Marker-based handles.
- **Relative redirects** in `/dev-login` for standalone/Cloud Run.
- **Wildcard filtering** only when the user hasn't typed `*`.
- **Share-menu / small label components** pattern: tiny one-shot `<Label>` components calling `useTranslations('shareMenu')` so MenuItem children stay component-shaped.
- **Translation scope decisions**: basemap selector labels (Light/Dark/Satellite/Orbis/TomTom Dark) left untranslated "by design" as product names (offered to translate). `libs/common` `sub-select-v2.tsx` uses `useBillingProjectLabel` that try/catches `useTranslations('appBar')` and falls back to English "Billing Project" so apps without NextIntlProvider keep working.
- **Preferences UD scope**: user: "yes work on BFF as well as the UX here"; UX option (a): trailing kebab menu per item → Rename/Delete (Gmail/Drive pattern). Simulated frontend-only was offered but real BFF endpoints chosen.
- **Terraform vs CI ownership**: terraform owns infra/env/IAM, CI/`gcloud run deploy` owns the container image (lifecycle ignore).
- **fr-CA conventions chosen**: "Enregistrer" for Save (vs Sauvegarder), "cueillette" for pickup (vs "ramassage"), "traversier" for ferry, "Répartir" for Dispatch, "Télécharger" for download; light French punctuation spacing; neutral imperatives, no tutoiement.
- **No commits**: per repo rules (AGENTS/CLAUDE.md) the assistant never committed; changes left for review (both ncc and BFF repos).

### Transcript part C (chunks 7-9)

- **Clustering called direct from browser, no BFF**: apikey is already client-visible via cookie; avoids BFF deploy. (Assistant presented this and scope questions; user answered scope: on this branch, all in one go, UX above imported table.)
- **Asked pre- vs post-mapping placement**: assistant noted reference puts panel on preview page, user's screenshot showed above the data-mapper table (pre-mapping, jobs upload page); user confirmed pre-mapping. Panel then moved: "move 'Clustering Pre-Optimization' panel to above the 'Add Attribute', 'Edit', 'Delete' on the page".
- **Default preview tab**: "when first landing on the preview screen, select the Jobs/Shipments tab by default - not the vehicles" → `input-phrase.ts:421-435` prefers Jobs, then Shipments, falls back to Vehicles; uses raw uploaded data (not `rootState` snapshot taken before `generateOutput()`).
- **Skip typecheck for demo velocity**: `typescript.ignoreBuildErrors: true` (user requested relaxing); noted as temporary.
- **SSG cycle → `ssr: false` shim** instead of hunting the cycle (cost/benefit; input page is interactive anyway).
- **Cluster zones persisted with preferences**: user: "when you save a preferences set of inputs also save the zone geojson so those can be retrieved in future runs without needing to rerun the clustering API request". `saveInputSet` appends `inputData.clusters = state.inputCore.clusters` when non-empty (`{id, geometry, geojson, max_quantity}[]`); `loadInputConfiguration` always `setClusters(inputData.clusters || [])` (unconditional reset prevents stale polygons from a previous load).
- **Zone polygon visibility rule**: "if there are no zones set in either jobs/shipments or vehicles, zone polygons should not be rendered on the preview screen" → guard in `buildZones`.
- **Zone colors**: "The fill color of each job contained within a zone should match the fill color of the zone that contains it. Never use a fill color for a polygon that is similar to the current color for vehicle markers" → `libs/route-planner-components/src/lib/utils/color-generator.ts` replaced all five green zone palette entries with non-green hues (orange 25, royal blue 220, cyan 200, deep red 8, magenta 320); per-job `ScatterplotLayer` dots with zone border color (alpha 255), lookup keys both display name and bare id. Later: "job markers should be colored based on their zone membership regardless of whether the zone layer is selected for display" → dots no longer gated on `showZones`.
- **Zone editing**: "on the preview screen if the zones layer is selected for display and the user clicks on a zone layer, switch the zone polygon to edit mode … As the user does this, add/subtract jobs markers from membership in the zone". Built: `editingClusterId` + `draftRing` local state; `effectiveZones` overlays draft during drag; `onDeckClick` — click `cluster-N` zone enters/switches edit, click empty map exits, others no-op; `PreviewLassoEditOverlay` bound to `editingRing`; draft updates cheap during drag, one `updateClusterPolygon` Rematch call on release (patch geojson, `booleanPointInPolygon` over every job in `rawData`, rewrite Cluster ID cells, `generateOutput`). Only `cluster-N` zones editable; real geofence zones read-only. Imports `@turf/helpers` (`point`, `polygon`), `@turf/boolean-point-in-polygon`.
- **Zone labels**: replace hover popup with persistent label — "rather than having an infowindow popup on mouseover a zone layer object, use a small label within the zone boundary with the Zone Name property": `MapTooltip` gate checks `hoverInfo.object.popupType !== 'zone'`; `zoneLabelLayer` TextLayer at ring-mean centroid, 11px bold `#282828`, white pill background alpha 220, only when `showZones`; hidden at zoom ≥ 13 (`ZONE_LABEL_HIDE_ZOOM`). Rename: "change 'Cluster {n}' to 'Zone {n}'" at `buildZones` (~:558), `normalizeInput` (~:348), and `zoneNameToColor` regex accepting both `Zone N` and `Cluster N` (old saved preferences).
- **Job info window**: "show zone number in the job info window if the job has an assigned zone" → `Zone` property (capital Z so `InputTooltip` renders the label) only when `job.zones[]` non-empty; shared hook in `libs/route-planner-components` so any consumer of `useInputMapLayers` gets it. Preview table: "in input preview, show the assigned zone for a job if it is present" → `Zone` column in `JOB_COLUMNS` in `preview.tsx`, auto-hidden via `normalizeColumns` when all empty.
- **Pin clustering requirement (user):** "add pin clustering to the preview map view for jobs (or shipments). Cluster indicator will be a filled circle of the color of the zone (if one is specified) and a size based on the number of jobs within the pin cluster. The number of jobs … will be shown". Supercluster per-point `{jobId, jobIndex, zoneId}` with `map`/`reduce` propagating zoneId (shared → that zone; conflict → `null` = mixed → grey fallback `[120,120,120]`).
- **Pin sizes**: job/shipment icon 14 → 18 ("increase diameter of job pins on preview screen by 25%"; 18 is nearest integer), dot 6 → 8; later 18 → 23 and dot 8 → 10 ("increase the size … by 25%"). Vehicle icons stay 18.
- **Lasso move**: "when using the lasso tool, give the ability for the user to move the entire lasso polygon when clicking and holding inside the lasso polygon and relocating on the map. On drop, reselect the jobs". `enableShapeDrag` prop on `PreviewLassoEditOverlay` (default false; zone-edit instance opts out): SVG with transparent screen-space `<polygon>` beneath vertex/midpoint handles; SVG `pointerEvents: 'none'`, polygon opts in; pixel-space translation (project all vertices at gesture start, add `(dx,dy)`, unproject) — avoids skew at high latitude; `onCommit` → existing `handleLassoCommit` → `applyPolygonSelection`.
- **Column resize in preview** (user: "in preview mode allow the user to resize the columns and have these column widths saved as part of the preferences"): `PreferencesInput.columnWidths?: {job?, shipment?, vehicle?, depot?: Record<columnPath, widthPx>}` keyed by `path` (stable across i18n); `table-layout: fixed`; 6px `col-resize` handle per header; window pointer listeners; clamp `[60, 800]` px (default 160); commit to redux once on pointer-up. Deliberately NOT in `createSavedStateSnapshot` so a column drag doesn't mark "Unsaved changes".
- **i18n label**: "modify the text 'Add Vehicles' to 'Add Vehs/Techs/Reps' across all languages": en `Add Vehs/Techs/Reps`; es-MX `Agregar Vehs/Técs/Reps`; fr-CA `Ajouter Véh/Tech/Rep`; pt-BR `Adicionar Veíc/Téc/Rep` (native-script abbreviations).
- **Removed Dev Mode toggle** (header `FormControlLabel/Switch`, `devDialogOpen` state + 3 handlers, `<DevDialog/>` mount, `header.devMode` i18n keys) but left `DevDialog` + `inputUI.setDevDialogOpen` because `input-common-ui.tsx` uses them on a separate path.
- **Removed header edit pencil** in preview toolbar (user: "Remove the edit pencil from this view. Keep the edit pencil on individual rows"): removed `EditIcon` import and `onEditClick`; per-row `EditOutlinedIcon` → `EditRowDialog` kept.
- **Zebra rows** (user: "alternate the background color of rows … Subtle effect"): odd rows `#F7F8FB`, even transparent; error/warning highlight `rgb(255, 235, 238)` still wins; applies to all import tables via `DataMapperTable`→`DataMapperCell`.
- **Alphabetical preference dropdown**: "list in alphabetical order".
- **Release notes**: asked "create a RELEASE_NOTES.md file for route-planner-v2 that details all the changes that have been made since the repo clone" → `apps/route-planner-v2/RELEASE_NOTES.md` (major features, smaller UX, bug fixes, deployment, out-of-repo BFF companion changes); offered a shorter customer-facing `CHANGELOG.md`.
- **Analytics suggestions (user: "I need to put some energy into making the Analytics view more detailed, meaningful, and reflective of KPIs for various scheduling, service oriented, territory/zone planning use cases. Suggest some new charts…")**. Assistant's catalog (all data from route steps/vehicle/capacity/zones/time windows/skills):
  - Scheduling: Fleet Gantt/swimlane (service/travel/wait/break; `route.steps[].arrival/duration/waiting_time/type`), time-window adherence strip (on-time %), earliness/lateness histogram, hour-of-day driver heatmap, slack distribution.
  - Service: wrench-time donut + ranking, stops-per-tech with P25/P50/P75, skills supply/demand matrix, capability-fit score, customer dwell boxplot.
  - Territory: zone load summary table ("territory balance sheet"), Lorenz + Gini, cross-zone flow, per-zone cost stacked bar, thumbnail-map gallery (also cross-filter source).
  - Cross-cutting: fleet KPI strip, capacity-utilization stacked bar, Pareto 80/20, solution-comparison, what-if elasticity panel. Shape advice: anchor each card to one KPI as a big number; make every card cross-filterable. Suggested first four: Fleet Gantt, Wrench-time donut, Zone load summary, Cross-zone Sankey.
- **Drill-in design for zone cards** (user: "let's drill into some of these suggestions"): shared hook `useZoneAggregates(routes, zones)` → `Map<zoneId, ZoneAggregate>` with `{zoneId, zoneName, color, stops, totalDemand, totalServiceMinutes, totalDriveKm, totalDriveMinutes, vehiclesEntering:Set, capacityShare, unzoned?}`, memoized on `[routes, zones, selectedRouteIds]`, in `v3/features/solution/components/analytics/use-zone-aggregates.ts`.
  - Zone Load Summary: KPI strip `N zones · most loaded Z5 (152 stops) · least Z2 (43) · imbalance ratio 3.5×`; sortable columns with inline mini-bars; "Unzoned" pseudo-row always shown at bottom; zero-stop zones still render.
  - Lorenz + Gini: Gini bands 0.0–0.2 Balanced / 0.2–0.4 Mild / 0.4–0.6 Moderate / 0.6+ Severe; metric toggle (stops/demand/service/drive); bonus overlay of previous saved solution; single-zone → N/A; all-zero → diagonal only.
  - Cross-zone flow: assistant argued Sankey is the wrong shape (no layering) → recommend adjacency heatmap matrix with headline `Cross-zone segment %` (well-zoned < 10–15%); chord diagram only for ≤ 6 zones; use polygon point-in-polygon (not `zones[0]`) for transitions.
  - Per-zone cost: stacked drive/service/wait cost; toggle total vs per-stop; degrade to units if rates not configured.
  - Thumbnail gallery: SVG-only (don't render N MapLibre instances: ~100 ms init + MBs each); cross-filter via `setSelectedZone(zoneId)` context; ESC or second click clears.
  - Build order: hook (~80 LOC) → table (~120) → Lorenz (~80) → cost (~100) → gallery (~150) → heatmap (~70).
  - **User's pinned answers** (verbatim): "1 - a for stop counts 1 b for drive segments / 2. global settings / 3. just count first array value" → logical `job.zones[0]` for stops; geographic point-in-polygon for drive segments (credited only when both endpoints in same zone; cross-zone hops belong to no zone); cost coefficients in global settings; multi-zone job counted once in `zones[0]`.
  - User trims: remove Capacity column ("remove the capacity column from the Zone Load analytics panel") and Demand ("in this use case stops and demands are the same - drop Demand") — kept `capacityShare`/`totalFleetCapacity`/`totalDemand` in the hook for later cards. Final header: Zone · Stops · Service · Drive · Vehicles. Imbalance chip colors: green < 1.5×, amber < 3×, red ≥ 3×.
  - Lorenz/Gini card ("start Lorenz + Gini cards"): metric dropdown Stops (default)/Service time/Drive time; recharts `ComposedChart`; Gini `G = Σ(2i−n−1)·v_i / (n·Σv)` over zones ascending (0 if total 0 or n<2); excludes Unzoned bucket; empty-states "Need 2+ zones" and "No work to distribute"; `ReferenceLine segment={[(0,0),(1,1)]}`.
- **Drive-time proposal (pending user answer)**: NB Distance Matrix per zone (N×N, cell cap ~5000 per request → split or sample uniformly; note "≈ from sample of X/Y stops"); cost concern → lazy/hybrid. Recommendation: haversine baseline (default 30 km/h urban speed assumption) auto, DM refine on click; cache per `{requestId, zoneId, stopCount, stopIdsHash}` in zustand + sessionStorage; mark estimated vs network values. Open questions put to user: default load policy, speed assumption override, display (time only vs distance).
- **Preference rename fix** — see Setup section (decision: fix BFF to keep body self-consistent rather than patching the UI).
- **Suppress optimizer warning** text above is "intentional behavior alignment": clustered jobs carry both `zones[]` reference and polygon in request `zones`, optimizer warns ~500 times.

### Transcript part D (chunks 10-12)

User requirements (original wording) and resulting decisions, chronological.

### Analytics / Distance Matrix drive time
- "1 - DM auto when the tab is active / 2 - use the actual DM request for 'car' travel mode / 3 - display average drive time only". Decision: replace segment-based total-drive aggregation (which produced empty values for depot-centric routes) with a DM hook:
  - `use-zone-drive-matrix.ts` (~180 LOC): reads `useUIStore(s => s.mainTab)` + `useSolutionStore(s => s.requestId)`; fires only when `mainTab==='analytics'` and a request is loaded; per zone builds square origins=destinations `lat,lng` strings; averages every non-diagonal `duration.value` -> `avgMinutes`; in-memory cache key `${requestId}::${zoneId}::${sortedStopIds.join(',')}`; in-flight de-dupe; zones over `MAX_STOPS_PER_ZONE = 100` uniformly stride-sampled and flagged (`sampled`, `sampleSize`, `totalStops`); per-zone loading/error state.
  - Cell display: spinner (user asked "spinner indicator in the cell that is still calculating" -> 12px MUI `CircularProgress`, `NumericCell.value` widened to `ReactNode`) / `!` on error / `formatMinutes(avgMinutes)` / `—` for <2 stops. Sort-by-Drive treats loading as 0 (null-last).
  - Dropped the Lorenz "drive" metric (DM averages measure density, not workload; Lorenz card now Stops + Service).
- "in the analytics panel change the term 'Zone' to 'Territory' (and translated across the languages)": i18n keys unchanged (`zoneLoadSummary`, `zoneCol`, ...), only strings. pt-BR Território/Equilíbrio de Territórios, es-MX Territorio, fr-CA territoire (adjective gender fixed, `Mais carregada` -> `Mais carregado`). Display-name rewrite in `use-zone-aggregates.ts`: regex `/^Zone (\d+)$/` -> `Territory N`; free-text names unchanged; unzoned bucket `Unzoned` -> `No territory`. Map polygon labels intentionally still `Zone N` (upstream cluster name from `input-preview-page.tsx` `normalizeInput`/`buildZones`). Also updated analytics report label in `utils/settings.ts`.
- Agent suggested 11 territory-planning analytics (Polsby-Popper compactness, drive-to-service ratio, boundary-crossing index, cross-territory Sankey, capacity vs demand, vehicles per territory, territory x day heatmap, visit frequency, category mix by ID prefix `BAR-/POSTO-/REST-/MERC-`, unzoned stops, stops/km²). User: "build #3, #4, #5, and #7". Implemented:
  - #3 boundary-crossing card (bands: <10% good, <20% mild, <35% warn, else bad; `bandFor()`), #4 Recharts `Sankey` with custom node/link renderers (left origin / right destination nodes preserve direction), #5 capacity vs demand grouped bar (KPI tiles under-supplied <0.8x, over-supplied >1.5x; a vehicle's full capacity counted in every territory it touches — one-line change for apportioning), #7 HTML-table heatmap (sequential blue ramp; empty cells light grey; uses `step.arrival` + dispatch timezone). #3/#4 share `use-zone-crossings.ts`. i18n initially English only then ~25 `analytics.*` keys per locale (validated JSON all four). Settings entries 6-9 `enabled: true`. Cards gated by `selectedRouteIds.size > 0`.

### Map zoom-gating decisions (v3 solution map)
- "the route superclusters here are not needed" at regional zoom -> `STEP_MARKER_MIN_ZOOM` gate AND-ed into every step-marker push (clusters+counts, per-step circles regular+start/end both branches, step-stack pills, rest markers). Depots, polylines, zones, unassigned markers stay. User then: "I still want superclusters shown at this zoom" -> value 10 -> 8.
- "add a control on the zoom level at which route polylines will disappear" -> `ROUTE_LINE_MIN_ZOOM = 5` (exported) + `mapZoom?: number` prop in `use-route-layers.ts`; returns `[]` below it; pass `undefined` to skip; wired from `viewState.zoom` in `use-solution-map.ts`.
- "the stacked clusters is what I'm trying to eliminate ... '2' and '476' ... They aren't useful" -> step-stack pills get own `STEP_STACK_MIN_ZOOM = 14` (clusters stay at >= 8).
- Zone labels: user wanted to "retain that functionality but have a point at which they stop rendering on max zoom" ... agent interpreted as a band: `ZONE_LABEL_HIDE_ZOOM = 13` (upper), `ZONE_LABEL_SHOW_MIN_ZOOM = 6` (lower); labels render for zoom ∈ [6,13). User: "yes mirror" -> same band on preview map (preview previously only had upper bound).
- Zone labeling: "use the same zone label technique that the preview screen has" -> `TextLayer` `v3-zone-labels`, centroid = mean of outer-ring coords, name or `geofence_id`, 11px bold dark-grey, white translucent background, `pickable:false`, gated on `showZones`; zoom tracked via `useMap()` + `map.on('zoom')` (lazy init from `map.getZoom()`).

### Supercluster on v3 solution map
"do the same supercluster implementation on this page as done on the preview page ... supercluster colors are to be based on the route color assigned." Decision: direct `Supercluster` import (same as preview), `mapBounds` tracked on `move`+`zoom`, index over `stepClusterFeatures` with `map`/`reduce` tracking `vehicleId` (color kept if one route else nulled -> grey via `resolveClusterFill`), `stepClusters` + `clusteredStepKeys` (`vehicleId::stepOrder`), `ScatterplotLayer v3-step-pin-clusters` radius `min(48, 12 + 6·√count)`, white stroke, `TextLayer v3-step-pin-cluster-counts`, filtered GeoJsonLayers for un-clustered steps; `onClusterCircleClick` expands `getLeaves` to the existing `{isCluster, items, clusterCount}` shape for `onStepClusterClick`/`StepClusterPopover`.
- "break pins/markers can be included in the superclusters": rest steps added to `stepClusterFeatures` with `isRest:true` (locations via `fillMissingStepLocation`), excluded when `showBreaksLayovers` off; `restMarkerFeatures` carries `vehicleId`/`stepOrder`; `RestMarkerLayer` data filtered by `clusteredStepKeys`; `isRest` skipped in un-clustered circle path.
- Sizing: "Increase the size of the pin/markers used by 25%": `START_END_RADIUS` 14->17.5, `REGULAR_STEP_RADIUS` 9->11.25, `HOVERED_STEP_RADIUS` 15->18.75, new `REGULAR_TEXT_SIZE` 12.5 / hovered 15 / `START_END_TEXT_SIZE` 15; cluster radius -> `min(60, 15 + 7.5·√n)`. Label color via `resolveLabelColor(rgb)` — ITU-R BT.601 luma `luma > 150 ? near-black : white`, same as preview map. Cluster count label `getSize` 15 -> 18.75 (+25%); user said sizes looked the same because they were on the preview map -> also bumped `preview-map.tsx:861` from 12 -> 18.75 (note: that's +56%; agent flagged deck.gl font-atlas caching as next suspect).

### Route-step presentation rules
- "if a break is the first stop in a route manifest, don't show it on the route or in the route manifest panel". `skipLeadingRest<T>(steps)` in `step-map-utils.ts` drops `steps[0]` if type `break|layover`. Screenshot showed BREAK at step 2 right after START (route `REP-006-WED-17`) -> extended to also drop a rest immediately following a `start` step (`[start, break, job]` -> `[start, job]`). Applied at every view site: three iteration sites in `use-map-layers.ts`, `job-list.tsx` steps memo, `result-panel.tsx` `adaptRawRouteToDisplayRoute`, `timeline-processing.ts` `adaptRawRouteToDomainRoute`, `transforms/raw-to-domain.ts` `rawToDomainResult`. `_rawRoutes` in store untouched (view-layer filter; edits/exports keep original).
- "when the user clicks 'select all' and the route set is filtered, selecting all should be interpreted as selecting ALL of the filtered routes - not ALL of the routes." `allRoutesChecked`/`someRoutesChecked` from `filteredRoutes`; `handleSelectAll` unions/removes only filtered IDs (preserves selection outside filter). Root cause `result-panel.tsx:629` used `displayRoutes`.
- "when adding text to the search box for routes ... automatically select the routes that match": effect `selectAll(filteredRoutes.map(r => r.vehicleId))` when query non-empty; empty query is no-op; deps `[routeSearchQuery, filteredRoutes, selectAll]`; Routes tab only (not Unassigned).
- On solution load: "turn zone layer on by default (if available) and disable route animation" — `use-solution-map.ts:64-95` replaced "auto-enable animation for routes < 500 km" with animation forced OFF and zone layer auto-enabled once when `rawInput` zones with geometry exist (handles `rawInput` arriving after `rawRoutes`).
- "initial viewport ... should be over Sao Paulo and not Singapore": `DEFAULT_VIEW_STATE` -> (-23.55, -46.63) zoom 11 (only pre-load frame; `fitToBounds()` takes over).
- New "Unassigned Vehicles" tab: "vehicles that were part of the original input request but didn't result in a route ... should show the details that were in the original input including shift time". `useUnassignedVehicles()` = `_rawInput.vehicles` whose `String(id)` not in `routes[].vehicleId`; `UnassignedVehicleItem` read-only card (id, description, shift window via `formatTimeWindow` + dispatch tz, capacity, skills, max working time, allowed zones); shares search (id/description); Select-All disabled on that tab; keys `tab_unassigned_vehicles` + 6 detail labels + empty state in all 5 locales.
- Deploy-time note on solution map zones: preview-map tooltips for zones suppressed (see Debugging 5).

### Upstream switching decisions (BFF)
- Agent presented Option A (re-point BFF/env to prod BFF, no app changes) vs Option B (bypass BFF; auth shape changes `?key=` only, 4 BFF-only endpoints break). User: "I've attached the BFF service to this workspace. My preference would be to continue to use the BFF that I have deployed in GCP and make modifications within it to perform the switch to api.nextbillion.io - reasonable?" -> yes. User on scope: "yes every optimization upstream switch to api.nextbillion.io. Authoritative flip (no config flag needed)". Implementation: single change in `ApiGatewayService.send()` — when `endpointConfig.product === 'vrj'` force upstream prefix `https://api.nextbillion.io`, while `getEndpoint()` still runs for SKU validation. Key injection, `X-User`, `x-nb-caller`, logging unchanged.
- Follow-up bug: after the flip optimization worked but `.../route-planner-api/v1/solutions:save?apiKey=...` failed — `bff-staging` (`ENV=staging`) forwarded to `staging.nextbillion.io` which rejects the prod key. Fix: `defaultRoutePlannerHost = 'api.nextbillion.io'` unconditionally in `configuration.ts` (env var override remains).
- Map tiles/styles: `MAP_TILE_HOST` in lib hard-coded to `api.nextbillion.io` (was env-conditional prod vs `sgpstg`); `mapTransformRequest` became a no-op.

### Map style
"need to switch to this map style for all map presentations <style URL>" -> `getMapStyleUrl` -> `https://api.nextbillion.io/tt/style/1/style/20.3.2-3?map=basic_main&key=<apikey>`; 5 consumers switched to `useMapStyle`: `v3/.../use-solution-map.ts`, `geocode-preview-map.tsx`, `preview-map.tsx`, `components/solution/solution-map/solution-map.tsx` (legacy v2), `components/route-edit/map-container.tsx`. MapStyleSelector options: "Light" = new basic_main; kept Dark + Satellite; dropped broken/Orbis entries; stale localStorage selection falls through to `styleItems[0]`.

### Data import (data-mapper) feature requests
- "add an action 'CSV' download ... {jobs/shipments}.csv or {vehicles}.csv": toolbar CSV button; `handleDownloadCsv` (data-mapper.tsx ~870-892) merges `headers` + `Attribute N` columns and rows + attached rows, Papa unparse, `saveAs`; filenames `jobs.csv|shipments.csv|vehicles.csv|depots.csv`; disabled when no rows.
- "give the user the ability to edit individual rows/cells": double-click a cell to edit (Excel-style); `adhocCell` state + `adhocOriginalRef`; Enter commits (blurs), Escape cancels (restores snapshot), blur commits; guard no-op when table-wide Edit is on; optional props so other call sites compile; TimeStamp (date-picker) cells stay bulk-edit-only.
- "add a new row ... Clicking the 'add row' icon will insert an empty row at the position 1." -> `prependEmptyRow(type)` reducer (index 0), then enters bulk-edit mode; later user: "set temporary, initial values in each cell based on the contents of the row directly beneath the newly added row" -> clone `rawData.rows[0]`/`attachedRows[0]` via `.slice()`; empty table -> blank. Button after "Add attribute", disabled w/o headers; `dataMapper.addRow` key.
- "allow the user to delete a single row if in 'edit' mode": leading sticky actions column (header + each virtualized row) when `isEditing`, trash icon, confirm via `confirm` helper from `@ncc/common/client`, dispatch `inputCore.deleteData({type, indexes:[rowIndex]})` (keeps `rawData.rows`, `attachedRows`, `output[type]` in sync). Depots share the table so also get it (offered to gate on `inputType !== 'depot'`). Keys `deleteRowTooltip/ConfirmTitle/ConfirmBody`.
- "clone an existing row when in 'edit' mode": `cloneRow({type,rowIndex})` effect splices raw row, attached row and parsed output entry after the source; if an `id` column is mapped suffix `-copy`, then `-copy-2`, `-copy-3` to avoid duplicate-ID rejection; `ROW_ACTIONS_COL_WIDTH` 56 -> 96; no confirm dialog; `cloneRowTooltip` in 5 locales.
- "search for an ID in the table if that column has been mapped. As the user types, the table will highlight and bring matching ID's to the top": ID column found via `mapConfig.dataMappings.find(d => d.value === 'id')`; `viewOrder` (matches first, then rest; original indices) + `matchSet`; `TableVirtuoso` consumes `viewOrder`, row lookup `innerRows[rowIndex]`, all handlers keep the ORIGINAL index (so delete/edit/scroll ids `#cell-{rowIndex}-{cellIndex}` stay valid); keys `${rowIndex}-${cellIndex}`; case-insensitive substring; highlight precedence error-red > search-yellow > zebra; hidden if no id mapped (query self-clears); keys `searchByIdPlaceholder/Clear/MatchCount` (ICU plural; Polish needs `few/many/other`).
- "if there's a 'Zone' column in the data or an 'Allowed Zone' column provide a multi-select filter for zones": MUI `Autocomplete multiple` in `JobFilterBar` (filters `zones[]` intersect) and new `VehicleFilterBar` ("Allowed zones", `allowed_zones[]`), rendered in `preview.tsx` on Vehicles tab; hidden when `state.inputCore.output.zones` empty; `buildZoneOptions`/`ZoneOption` exported.
- Clustering Pre-Optimization defaults: "set default Travel Cost to Air Distance" (`air_distance` in `clustering-panel.tsx`; MenuItem exists at ~line 179), "set max cluster quantity to 200 by default" (`clustering-panel.tsx:48`, was 100).
- "set the Description in the Set Preferences panel to the name of the Preference/Profile being used": `DescriptionPanel` effect syncs `preferences.description = preferences.fileName` on `fileName` change (load or rename); later manual edits stick; `.slice(0,200)` cap.
- Geocoder: "when using the geocoder tool and editing the address text, it should use the NextBillion.ai discover endpoint in an autocomplete mode": hook `use-discover-search.ts` (`GET https://api.nextbillion.io/h/discover?q=<query>&limit=5&key=<currentApiKey.kid>`; min 3 chars `DISCOVER_MIN_QUERY_LENGTH`; 250ms `DISCOVER_DEBOUNCE_MS`; AbortController race-safety; skip after a pick until input diverges; skip when no API key), `address-edit-cell.tsx` inline Autocomplete; pick writes address+lat+lng in one `onRowChange`; label from `address.label` fallback `title`; free-text blur -> lat/lng cleared and row joins "needs retry geocoding"; reused existing i18n keys `editRow.addressSearch` / `editRow.addressNoResults`; staging doesn't reliably expose `/h/discover` so prod host pinned.

### Admin impersonation
User: "add the capability for an Admin user to 'impersonate' a IAM user's profile - from the admin/users page ... assume that user's permissions until they 'exit'". Decision: UX overlay, not a security boundary. `utils/impersonation.ts` (localStorage `{email,name,org,employeeType,adminEmail,startedAt}`), `ImpersonationProvider`/`useImpersonation()` (exposes `impersonation,isImpersonating,realUser,effectiveUser,startImpersonating,stopImpersonating`; listens to `storage` + custom `ncc-impersonation-change` event; auto-clears if real `currentUser` changes), sticky amber banner (`position:sticky; zIndex:1200`), `use-route-planner-permissions.ts` reads `effectiveUser` (single seam for `canManageUsers/canPlanRoutes/isViewerOnly`), users-page `SwitchAccountIcon` button (disabled for self, inactive accounts, or when already impersonating). JWT cookie unchanged so API calls still authenticate as admin. Follow-ups offered: backend `X-Impersonate-User` header validated by BFF, confirmation dialog.

### Import connection methods
User: "add two more import connection methods and research the required parameters ... ServiceNow and Microsoft Dynamics 365".
- ServiceNow: REST Table API `{instanceUrl}/api/now/table/{tableName}`; auth OAuth2 (System OAuth > Application Registry; password grant simplest S2S) or Basic (user with `rest_service` role). Fields: Instance URL, Authentication toggle, Client ID/Secret, Username/Password, Table name (defaults `wm_task` jobs, `wm_order` shipments, `cmdb_ci_vehicle` vehicles), `sysparm_query` (e.g. `active=true^assignment_groupISNOTEMPTY`), `sysparm_fields`.
- Dynamics 365: Dataverse Web API `{environmentUrl}/api/data/v9.2/{entitySet}`; Azure AD client-credentials: token endpoint `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token`, body `grant_type=client_credentials&client_id=...&client_secret=...&scope={environmentUrl}/.default`, Bearer to API; app needs Dataverse access (app user/security role). Fields: Environment URL, Tenant ID, Application (client) ID, Client Secret, Entity set (defaults `msdyn_workorders`, `msdyn_workorderservicetasks`, `bookableresources`), OData query ($filter/$select/$expand).
- Both panels follow the SAP-panel pattern: UI scaffolding + "Coming soon" chip + info Alert; settings persisted to localStorage via `import-source-cache.ts`; actual fetch/token exchange NOT implemented.
- Icons: "add an appropriate, small icon representing the import connection type alongside the dropdown text": inline SVG (no external assets) in `import-method-icons.tsx` (`<ImportMethodIcon method>`, `ICON_BY_METHOD`); File = MUI `UploadFileOutlined`, API = `ApiOutlined`, SAP blue `#0070F2`, Salesforce cyan `#00A1E0`, ServiceNow green `#62D84E`, Dynamics = MS 4-square `#F25022 #7FBA00 #00A4EF #FFB900`; 18x18; `renderValue` needed so the selected value shows the icon too.

### Localization
- "add localization for Polish to the route-planner-v2 UI including date time formats and translations": pl-PL added to locale config, dayjs locale sync, MUI X DataGrid `plPL` pack from `@mui/x-data-grid-pro/locales`, full `pl-PL.json` with ICU placeholders intact, `locales.pl-PL` label ("Polski") added to all locale files; key parity verified across 5 files. Supported locales now en, pt-BR, es-MX, fr-CA, pl-PL.
- "translate the job infowindow shown here on preview screen": shared lib can't use `useTranslations` (route-planner-viewer has no provider) -> new app-level `components/input/preview-map/localized-input-tooltip.tsx` using `useTranslations('inputTooltip')`, inline styles mirroring lib `.nb-popup` (SCSS module alias path didn't resolve), reuses lib `formatTimeWindow`; `popupType==='input'` renders it, other types still use shared `MapTooltip`. Keys: id, description, location, pickup, delivery, service, setup, skills, timeWindows, timeWindow, Zone, capacity, breaks (PL: Opis, Lokalizacja, Odbiór, Dostawa, Obsługa, Przygotowanie, Umiejętności, Okna czasowe, Okno czasowe, Strefa, Pojemność, Przerwy); unknown keys fall back to raw key.
- "translate - 'Load', 'Recent Solutions', 'Saved Solutions'": new `savedSolutions` namespace (`pageTitle` Saved Solutions/Soluções salvas/Soluciones guardadas/Solutions enregistrées; `recentSolutions`; `load` Load/Carregar/Cargar/Charger); wired in `app/saved/page.tsx` (`PageHead subtitle`), `recent-requests.tsx` (add `t` to columns `useMemo` deps so Load label updates on locale change), `left-panel.tsx`. Legacy `components/saved/*` strings left (agent asked).

### Demo login
User wanted a demo login like the SCA/GLWAS demos (same credentials, env-overridable via `DEMO_USER`/`DEMO_PASS`). After login "redirect to /route-planner not the base URL" -> `resolveNext()` sanitizer (see Setup).

### Misc decisions
- Preview map "polygon points shouldn't render off of the map canvas" -> `overflow:hidden` (see Debugging).
- Compact summary of agent's refusal pattern: it does not run commands that mutate shared Cloud Run/git without explicit approval; user answered with "what's the gcloud deploy command..." and ran them themselves.

### Transcript part E (chunks 13-15)

- **Mock API import left mocked** (2026-06-08): answered where to put data (`public/data/<name>.csv`, add mapping in `ENTITY_DATA_FILES`); offered real fetch swap (replace `fetch(dataUrl)` in `mockApiImportCsv` with `options.apiUrl` + `Authorization` header; JSON would need content-type branch). User did not ask for it.
- **Remove "Coming soon" chips** for SAP and Dynamics 365 panels only (`sap-import-panel.tsx`, `dynamics-import-panel.tsx`); ServiceNow keeps it; `comingSoon` translation keys left because still used.
- **Preference-stored column mappings** (2026-06-16). User requirement: "if the user has a stored preference that matches the current name of the preference (as set in the 'Set Preferences' tab), use the stored column mappings for jobs, shipments, and vehicles when data is imported. For example, if the user deletes the current set of job data and imports a new set, preset the column mappings based on what is already stored for the preferences." Decision: persist mappings inside the saved preference blob as optional `mapConfigs` for job/shipment/vehicle (old prefs still load); new `importRawData({type, rawData})` thunk in `input-core.ts` dispatches `setRawData` (which clears mappings on header change), then if `state.preferences.fileName` matches a stored preference with `mapConfigs[type]`, re-resolves each stored mapping's `header` against the new CSV headers (column-order independent; mappings lacking a header or whose header is missing are dropped) and applies via `setMapping`; returns `{appliedStoredMapping}`. Call sites switched: `input-depot.tsx`, `input-order.tsx` (CSV + Fleetify address import), `input-vehicle.tsx` (CSV + Fleetify vehicle import); TSP-integration branches skip integration defaults when stored mapping applied (stored preference wins). Import-only (not auto-apply on preference load) — question left to the user.
- **Grouping preference** (2026-06-25). User: "add a new option to the Preferences tab where the user can set the parameters that get used for options.grouping.order_grouping.grouping_diameter - use a slider with default value of 0 and going up to 2km". Implemented MUI `Slider` 0-2000 m step 50 m, marks 0/500 m/1 km/1.5 km/2 km, "Off" at 0; value in `preferences.grouping.order_grouping.grouping_diameter` (default 0; `?? 0` fallback for old preferences); only sent in the optimization request when > 0; `GroupingPanel` rendered between Constraints and Depots in `input-preference.tsx`; `grouping` added to `SavedStateSnapshot` Pick + clone, and to `hasUnsavedChanges` in `index-client.tsx` (otherwise slider moves don't mark dirty); i18n `grouping.{title,description,groupingDiameter}` in 5 locales.
- **Polylines hidden when all routes selected** (user: "don't render route polylines when all routes are selected. Only show the polylines if a subset of routes has been selected"): `use-route-layers.ts` `lineFeatures` returns `[]` when `selectedRouteIds.size >= routes.length`. Strict subset (even 952 of 953) shows polylines; threshold heuristic deferred.
- **Zones shown only for selected routes** (user: "only show zone geometry when the user has selected a route and the zone for that route will be shown"): `zoneFeatures` returns `null` for empty or all selected; same "narrowed selection = show detail; unnarrowed = declutter" model as polylines. `zoneLabelData` derives from `zoneFeatures`, so labels gate too (labels later removed entirely at user request: "no need to apply labels to zones on the map" — removed label memo/constants/TextLayer and `zoneLabelData` from memo deps).
- **Route time filter** (user: "provide the user with the ability to filter/select routes based on a start and end date time selectors"): state `routeTimeFilterStart/End` (nullable epoch seconds) + `setRouteTimeFilter(start,end)` in `ui.store.ts`. Semantics: From only → route end-step arrival ≥ From; To only → start-step arrival ≤ To; both → overlap of `[start.arrival, end.arrival]` with `[From, To]`; changes auto-select matching routes like the search box; Clear nulls both but keeps manual selection. Defaults: "the hour on the From date-time selector should default to 00:00 and the hour on the To … 23:59"; refined by user: "snap should only occur on the first select or when the control is initialized" → snap to 00:00 / 23:59 only when input was empty; later edits pass through; clear then pick snaps again. Localization: user asked to localize "in how day month year are sequenced"; replaced native `datetime-local` with MUI X `DateTimePicker` + `LocalizationProvider`/`AdapterDayjs` mirroring `components/input/input-preview-page/job-filter-bar.tsx`; dayjs locale map `en→en, pt-BR→pt-br, es-MX→es-mx, fr-CA→fr-ca, pl-PL→pl`; `ampm={false}`; epoch conversion via `dayjs.unix()` / `.unix()`. Keys `solution.timeFilterFrom/To/Clear` (From/De/Desde/Du/Od; To/Até/Hasta/Au/Do). Labels made smaller (12 px resting / 11 px shrunk via `slotProps`, applied to both pickers with `replace_all`).
- **Search as selector/filter**: user: "the search box on that page should serve as a selector/filter in the same way that the date filter works. It should search against both the job.id and job.description fields." Case-insensitive on `String(s.id)` and description; vehicleId matching dropped (offer to re-add as OR).
- **Zone multi-select filter**: `RouteZoneFilter` (MUI `Autocomplete<ZoneFilterOption, true>` with Chips), options from `_rawInput.zones` labelled `zone.name` or `Zone <id>`, sorted by numeric id; filters AND-combined with search and time; hidden when no zone has geometry; `selectedZoneIds: string[]` + `setSelectedZoneIds` in `ui.store.ts`; keys `zoneFilterLabel/Placeholder/Empty`. Later, user: "change the zone filter so that the user can select all zones for a given day. list will include Zone-1, Zone-2,...Zone-n When the user selects Zone-1 it will select all of the zones for day 1" → UI offers day-aggregated options (`Zone-N` = all zone ids matching `Zone-*-N-*`, only days present) that expand to individual zone ids on select, storage layer unchanged (map layer and routes memo keep working).
- **Rep filter** (user: "Add a filter by rep option that is a multi-select dropdown containing the route.description fields without the '-{week}-{day}' suffix"): options = `route.description` with regex `-\d+-\d+$` stripped, deduped, sorted (100 reps for FEMSA1); AND-combined; filter box shown when solution has zones OR descriptions; keys `repFilterLabel/Placeholder/Empty`. Also route cards show `route.description` on a muted second line under vehicleId (tooltip includes both).
- **Restrictions section removed from route-edit overlay** (user request); dead `RestrictionRow` helper and unused `Chip`/`useUIStore` imports dropped; Route Errors block kept.
- **Unassigned Vehicles tab**: first fixed the list to exclude vehicles present in `draft.routes` during edit mode (layered at the consumer `result-panel` because importing the edit store into the hook would create a cycle); user then: "I'm still seeing Unassigned Vehicles tab in the left panel. - need it hidden entirely for now" → removed the `<Tab>` entry (`result-panel.tsx:1596`), left `ResultTab` type and render/memo branches (`resultTab` isn't persisted, boots on `routes`) for trivial restore.
- **Assign unassigned orders to an unassigned vehicle** (user: "when editing a solution, give the user the ability to add unassigned orders to an unassigned vehicle in the list. The route created will use the unassigned vehicle's start and end location."): new store action `assignUnassignedTasksToVehicle(vehicleId, tasks)` in `route-edit.store.ts` (refuses if vehicle already has a draft route; resolves start/end via `input.vehicles` → `input.locations.location[start_index|end_index]`; builds start → tasks (picked order) → end; removes tasks from `draft.unassigned`; Directions + `applyDirectionsResult`; same snapshot/undo/error rollback as `moveUnassignedToRoute`); pure helper `buildRouteFromUnassignedVehicle(vehicle, tasks, input)` and `parseInputLocation` (`"lat,lng"` → `[lng,lat]`) in `step-operations.ts`; UI "Assign tasks" button + Popover with search + checkbox list in `UnassignedVehicleItem`; keys `assignTasks*` (Button/Title/SearchPlaceholder/Empty/Cancel/Confirm/Assigning/Success/Error) in 5 locales.
- **Local-solution editing — Option B chosen** (2026-07-10; user: "explore the changes needed to allow editing of solutions that were loaded from local files i.e. femsa1_response.json", then "go ahead with option B"). Findings: (1) `solution-toolbar.tsx:481` auto-saves before edit unless `source === 'db'`, posting `solutionFoldersApi.saveSolution({request_id:'FEMSA1'})` → 404 and save-folder dialog (imported `_import` flow had the same latent bug); (2) apply in `route-edit.store.ts:892-963` branched `'db'` → `solutionFoldersApi.editRoutes`, `'imported'` → `updateImportedSolutionResult` (localStorage), else GCS → `optimizationApi.editRoutesGcs` → `POST optimization/v2/edit_routes` 404; (3) reload refetched the bundled JSON (`use-solution-data.ts:145`), discarding edits. Option A (new `'fixture'` source) vs Option B (collapse fixtures + imported into one `'local'` bucket); B chosen because two localStorage-backed sources should be one and it fixes the imported bug. Implemented: `SolutionSource` `'imported'`→`'local'` (`v3/domain/types/optimization.ts`); `solution.store.ts` requestId-keyed helpers `saveLocalSolution/updateLocalSolutionResult/loadLocalSolution/loadLocalInput/clearLocalSolution`, legacy single-slot keys `rp:imported-solution` / `rp:imported-input` preserved for `IMPORTED_REQUEST_ID`, fixtures use `rp:local-solution:{id}` / `rp:local-input:{id}`, backward-compat aliases (`saveImportedSolution`, …) so `raw-json-panel.tsx` unchanged; `autoSave` early-returns for `source === 'local'`; `use-solution-data.ts` single `FIXTURES` map + one shared branch that checks `loadLocalSolution(requestId)` / `loadLocalInput(requestId)` first, falls back to bundled JSON; apply branch calls `updateLocalSolutionResult(requestId, …)`; toolbar `isLocalSource = useSolutionStore((s) => s.source === 'local')` skips `handleAutoSave()` for edit/share and hides `canSave`/`canShare`. New fixture IDs only need a `FIXTURES` entry. Open item: no "Reset to original" button yet (clear via DevTools key `rp:local-solution:FEMSA1`); offered a ~15 LOC toolbar button calling `clearLocalSolution(requestId)` + reload.
- **FEMSA fixtures**: request IDs `FEMSA1`/`FEMSA2` short-circuit in `useSolutionData` (dialog does no validation, just `window.open('/route-planner/solutions/<id>')`). FEMSA1 originally = `coca_cola_four_week_response.json` + CSV for time windows; moved to input JSON; finally `femsa1_response.json` + `input_femsa1.json`. FEMSA2 = `femsa2_response.json` + `input_femsa2.json` (`setInputLoading(true)` upfront so the enrichment effect waits).
- **input_femsa.json conversion (ambiguity flagged)**: user spec: "ID is 'Matricula' field, LAT_LONG used to create the location index, TEMPO NO CLIENTE is the service_time. Time windows array is filled based on the TW1, TW2,...TWn values. description field consists of the format that we used…". `OrderJobV2.id` is typed `number` but Matricula is a compound string (`1110011-1-1`); chose `id` = numeric `JOB_ID` (1..19,374, joins 1:1 with response `step.id`) and Matricula as the first token of the enriched description. Output: 19,374 jobs, 6,362 unique locations, `vehicles: []` (CSV is demand only; needs vehicle records before posting to MVRP).
- **Description enrichment format** (user): `{current_id_value}|{TEMPO NO_CLIENTE - in minutes}|WK-{WEEK}|WK-VISIT-{WEEK_VISIT_NBR}|{ACCEPTABLE_DAYS}|TIPO DE VENDERDOR}` → e.g. `1114641-1-1|30|WK-1|WK-VISIT-1|25|VEND. TRADICIONAL`. Script was idempotent (skips descriptions containing `|`); 19,374 CSV rows, 19,370 steps enriched, 0 misses; the 4 delta rows = `"unassigned": 4`.
- **Clustering request for FEMSA** (user: "build a cluster API request … Default values 'O-clustering', routing mode = car, travel cost = air distance, number of clusters 100, quantity for each job is 1 max cluster quantity 200"): body `{description, options:{routing:{mode:'car'}, objective:{travel_cost:'air_distance'}, constraint:{hard_quantity_constraint:true, max_cluster_quantity:200}}, jobs:[{id:"1", location_index:0, quantity:1, description}], locations:["lat,lng",...], clusters:[{id:0, max_quantity:233},...]}`. Seed `max_quantity` mirrored `input-core.ts:2136-2138`: `ceil((totalQuantity / numClusters) * 1.2)` = ceil(19374/100*1.2) = 233 (hint) vs 200 hard cap. Locations are `"lat,lng"` already (São Paulo lat -23.x, lng -46.x) so no swap needed, unlike the mainline path that un-swaps the internal `"lng,lat"`. User then: "I don't need to do it from within the app - just a one time run" → curl recipe (below). Location reduction (user: "reduce the number of unique locations … < 4000"): snap-to-grid ladder (0.0005 → 0.001 → 0.0015 …, finest cell < 4000), 0.0015° (~165 m N-S × 152 m E-W), centroid of members at 6 decimals; 6,362 → 3,216; group size min 1, median 1, mean 1.98, max 16; scoped to `cluster_request_femsa.json` only; `job.location_index` remapped.
- **Zones from routes instead of clustering API** (user, 2026-07-07): "examine the routes in the solution JSON and break into their individual days; for each day's routes … create a zone that encompasses the stops on a given route … clear out the existing zone definitions … add the new zones". Result: 953 zones (one per route; every route lives on exactly one local São Paulo day), named `{vehicleId}-{weekNum}-{dayLabel}` (`1-1-Mon`), 947 real convex hulls, 4 widened from 2-point sets into thin quads, 2 single-point sets buffered to ~22 m boxes; 19,370 jobs stamped `zones:[String(zoneId)]`; the 4 unrouted = unassigned (`1114993-1-1`, `1114993-3-1`, `1116280-1-1`, `1116280-3-1`). Week×day: Mon=100 every week; e.g. `1-Tue=100 1-Wed=89 1-Thu=11 1-Fri=3`.
- **Cluster polygon edge**: clustering result cluster 72 had 8 jobs at the same coordinate → API returned a single point instead of polygon (99/100 polygons built); buffered into ~22 m × 22 m square. Merge script is idempotent (strips prior `zones` fields).
- **vehicles_femsa.csv** (953 rows, headers matching existing `vehicles.csv`): `id` = zone name; start/end lat/lng from route start/end steps (one depot `-23.504659,-46.562973`); `date`, `shift_start_local`/`shift_end_local` in SP local time (`YYYY-MM-DDTHH:MM`); `max_working_time_seconds` = end.arrival − start.arrival; `capacity` 200; `zones` = route-day zone id; name/telephone/home_address/break_* blank. Trade-offs offered: capacity = per-route job count, policy cap 32400 s, fleet-wide allowed zones.
- **Territory-planner scope decisions** (2026-07-22): requirement: "add a new territory-planner page to the route-planner-v2 app that implements the workflow shown in the femsa-pipeline project the user can drag-drop or upload an excel spreadsheet with list of POS and the territory planning workflow runs. After completion the map showing all of the territories is displayed." Pipeline copied into a lib and run server-side in an API route streaming NDJSON progress. Map date filter ("select a date or range of dates to show the POS pins for those dates"): floating panel with "Cycle starts" date input (snaps to local Monday, anchors week 1) + 4×5 grid (W1-W4 × Mon-Fri), click two cells for a range (order-independent), "All dates" clears; a POS is hidden when its `(schedWeeks × schedDays)` slot set doesn't intersect the range; boundaries stay. Hover tooltip on POS pins (matricula, territory, tipo, Freq n/wk · days · weeks, h/visit, h/wk); both layers pickable, POS wins over boundary.
- **NB distance matrix in territory pipeline — options and choice** (user: "can we switch from haversine distance to using nextbillion.ai directions or distance matrix service?"). Most distance use is structural (Voronoi boundaries, capacitated k-means centroids, LP cell-to-centroid objective, MILP spatial affinity) and needs Euclidean geometry; a full swap = k-medoids over a precomputed 6.5k×6.5k matrix. Options: (1) single global `CIRCUITY` calibrated once; (2) per-territory circuity from sampled pairs each iteration (recommended); (3) full NxN matrix + k-medoids. User answered "2". Implemented: `geo.js::travelPerVisitH()` takes per-call circuity override (default `CFG.CIRCUITY = 1.4`, BHH estimator feeding rep-count sizing); once territories settle, one NB `/distancematrix/json` call per territory with a deterministic 8-POS sample (~R calls in parallel), circuity = mean(network km / straight-line km) over ~56 non-diagonal pairs; out-of-band (<1.0 or >3.0), failed, or too-small → fallback per territory to 1.4; no api key → skip DM entirely; apiKey threaded through the API route (cookie `apikey`) → TS entry → `run.js` → `buildTerritories` → `cluster.js`. Progress lines: `measuring per-territory road circuity via NB Distance Matrix...`, `territory  1 circuity=1.52 (123 POS)`, `mean measured circuity: 1.47 (default 1.4)`.
- **Preview table before build** (user: "after an upload of the territory excel sheet, load the rows into a table that the user can 'select/deselect' rows, filter for types, and search for POS IDs. At the top of the table there will be a button that will execute the territory build process based on the selections made (all rows are selected by default after loading)"). Flow: client parses xlsx in browser (mirrors server header logic) → DataGridPro (re-exported from `@ncc/ui`) with search (POS matrícula), multi-select filter on `TIPO DE VENDEDOR`, checkbox column all preselected, warning chips (`0-freq`, `bad coord`), header `{selected} of {total} selected`, "Build territories" (disabled if < 3 valid selected), "Back". Build POSTs original file + `selected` matrícula JSON in FormData to `/api/territory-planner`; `runPipeline` filters `pos` after `parseBase` to those IDs; server rejects < 3 selected with a clear error. `keepNonExistentRowsSelected` preserves checkbox state across filter toggles. User refinement: "when the filter is applied on the imported territory POS data, only those selected (filtered) POS entries should be used" → `activeSelected` = visible under filters AND checked AND valid coords; Build sends exactly that intersection; bad-coord rows removed before submit to avoid the server "no feasible visit pattern" abort.
- **Boundaries as one contiguous polygon** (user: "bring the separated objects into a continuous polygon object"): replaced per-territory alpha-shape + Voronoi clipping with a convex hull per territory (Polygon, not MultiPolygon; type declarations updated). Trade-offs: guaranteed contiguity; hulls overlap (deck.gl fill alpha 50/255); coastal hulls may cross water (swap to concave hull if noisy); POS > 25 km from centroid still trimmed before hulling; degenerate (< 3 POS / collinear) territories render as small circle around centroid.
- **Token lifetime / process**: recurring ~14-day expiry; recommend Mode 2 auto-login if a password account exists.
- **Dev-only CLI tool for clustering result** (curl recipe user ran themselves):
  ```bash
  export NB_API_KEY='<your-key>'; export DATA=apps/route-planner-v2/public/data
  TASK_ID=$(curl -sS -X POST "https://api.nextbillion.io/clustering?key=$NB_API_KEY" \
    -H 'Content-Type: application/json' --data-binary "@$DATA/cluster_request_femsa.json" \
    | tee /tmp/cluster_submit.json | jq -r .id)
  until curl -sS "https://api.nextbillion.io/clustering/result?id=$TASK_ID&key=$NB_API_KEY" \
          -o "$DATA/cluster_result_femsa.json" \
        && jq -e '.status == "Ok" or .status == "Failed"' "$DATA/cluster_result_femsa.json" > /dev/null; do
    echo "$(date +%H:%M:%S) — still processing…"; sleep 5
  done
  jq '.status, (.result.clusters | length), .message // empty' "$DATA/cluster_result_femsa.json"
  ```
  Result shape: `{status:"Ok", result:{clusters:[{id, job_ids:["1","17",...], geometry:"<encoded polyline5>", max_quantity:233}]}}`; decode `geometry` via `polylineToGeoJsonPolygon` from `@ncc/route-planner-components` (used at `input-core.ts:2183`). The first "ready" was premature: the result file did not exist yet — always check the file before running merge scripts.

### Transcript part F (chunks 16-18)

- **Settings panel scope** (user: "add a 'settings' panel next to the 'Build territories' button. Include DAILY_CAP_H, WEEKLY_CAP_H, UTIL_TARGET"; later "add the speed assumption SPEED_KMH constant to the list of tunable parameters"). Agent's recommendation was Tier 1 only in UI; Tier 2-4 stay as `CFG` defaults with optional `overrides?: Partial<TerritoryConfig>` on `runPipeline()` so power users can pass them without polluting UI.
- **Edit semantics**: two-tier stats. Aggregate/cheap (per-territory POS count, weekly hours, weeklyWorkloadH) recomputed instantly client-side; solver-dependent (`maxSlotH`, `meanSlotH`, `slotsOverCap`, `hoursByWeekday`) marked Stale until server Recalculate. User constraint: "When recalculating, I don't want to recalculate the territory boundaries but calculate the metrics based on how the territories are currently laid out and the POS's that belong to the territory" -> reschedule skips clustering (later extended to rebuild Voronoi for display only, since boundaries are derived).
- **Edit trigger rule** (user): "The edit is only enabled if the territory mode is 'hull' and the user has clicked in one of the territories."
- **Hover vs click for the calendar** (user flip-flopped by design): first click-to-dialog, then "have the territory calendar view popup on mouseover ... (disable the click action). When the user mouses out of the row, remove the calendar", then click was repurposed to pan/zoom. Implementation: MUI `Popover` with `disableAutoFocus, disableEnforceFocus, disableRestoreFocus, hideBackdrop`, `pointerEvents:'none'` on root+paper so `mouseleave` fires normally.
- **Route markers** (user: "color code the stop markers based on the frequency setting") scoped to numbered route markers only; general POS pins keep territory colours.
- **Multi-day TSP** (user: "'All dates' by default won't calculate TSP for all dates"); the per-day stop set is only POS scheduled that (week, day); all non-empty days go in parallel.
- **v2 over v1 MVRP** because user demanded schema compliance with "latest version of NextBillion MVRO" (`docs/Optimization Flexible-live.yaml`); v1 was chosen first only for smaller payload.
- **Fresh single-commit repo** (user: "I want to create an initialize a new repo with the ncc project here https://github.com/mbsoft/ncc"): agent paused before touching remotes (`origin` was `git@github.com:nextbillion-ai/ncc.git`, branch `feat/route-planner-v2-misc-enhancements`, uncommitted work, full upstream history). User chose: empty repo exists, fresh-init working tree as one commit, replace origin. Safety steps: rename `.git/` to `.git.backup-2026-07-24-194503/` (reversible; added to `.gitignore`), pause after local commit to inspect staged files. Found `.env` files not in `.gitignore` and a dev IAM credential in plaintext in `apps/route-planner-v2/.env`; user said "Include as-is". Caught that `.git.backup-*` had been staged (would drag history back in as tracked files) and removed it; final: 2103 files, no `node_modules`/`.next`/`dist`, commit `855cc7c "Initial commit"` on `main`, origin = `git@github.com:mbsoft/ncc.git`. Push was held until user said "push it" (one-way step); rollback: `rm -rf .git && mv .git.backup-2026-07-24-194503 .git`. Later `pull` fast-forwarded `855cc7c..2497636`.
- **Deploy gate**: before any gcloud/terraform run the agent aligned on target project (repo tooling targets the `nextbillion` project; personal account lacks perms), noted that a dirty tree would mislabel the image if tagged with plain HEAD sha -> tag `<sha>-dirty-<ts>`; show `terraform plan` before apply. User pointed to `infra/terraform/terraform.tfvars` as the source of truth for project and details.
- **Standalone mode** chosen over redeploying the BFF (Option B: buckets + 4 secrets + org-config migration) or pointing at a different BFF (Option A, dead URL). Decision: feature-flagged (`STANDALONE_MODE`) so other monorepo apps are untouched; mirrors `~/workspace/territory-planner` env-var-driven pattern; same API key as territory-planner ("same key"). Belt-and-suspenders: seed `apikey` cookie at dev-login AND fall back to env var in API routes. API key kept in Secret Manager server-side but `NEXT_PUBLIC_` copy is necessarily baked into the client bundle.
- **Build sequencing**: let build 1 (ky fix) finish and deploy, then combine prediction + Import JSON in a single build 3 (kill build 2 to avoid wasted cycles because cache hot). User chose option (a): implement Import JSON in a third build/deploy cycle rather than wait for smoke test; agent preferred verifying locally first before burning a build.
- **/predict** uses the `input` variant with full body (user: "should use the variant where the full JSON input is provided - not the count of vehicles, jobs, locations" and "you need to also include all options values"); body built once per debounce tick via callback, only when Generate Route would be enabled.
- **Deleting a POS** reuses the existing stale pipeline rather than inventing a new mechanism.
- **Sample control** deterministic (even stride) so same input gives same rows, preferred over random sampling.
- **AI Mapping**: ported BFF service logic into a Next route rather than adding a dependency on BFF; model/key/rate-limit choices as above.
- **Not changed deliberately**: `reschedule` route doesn't touch apikey cookie; middleware; AppContext hook (hydrates from server-rendered context).
- **Optional follow-up noted, not done**: swap inline options in `normalizeInput` for `buildOptimizationOptions(preferences)` so predict and solve paths can't drift.

---

### Appendix 0 (full-length user messages: continuation summaries and long pastes)

- User's decision to run installs from their own shell rather than inside the agent (the main digest records the later "kill it and I will run install from my own shell"); here the first evidence is the three install pastes the user ran themselves and reported back with "stuck here now".
- Disable nx cloud/daemon/cache-install and cypress binary for installs: they were the only things standing between `yarn install` and a finished link step (outcome shown above); no rationale beyond the successful result is given in this file.
- Use `staging` IAM (`https://iam-stg.nextbillion.ai`, preview client id) when running against the local BFF, and the prod-style `https://iam.nextbillion.ai` plus `https://bff.nextbillion.ai` for the `ENV=test` run against deployed services. This split is visible only in the pasted commands.
- Run the BFF locally on port 3000 and Next on 3001 with `BASE=/route-planner`; the app's `basePath` is `/route-planner`, so URLs are `http://localhost:3001/route-planner`.

### Appendix 1 (full-length user messages: continuation summaries and long pastes)

- **Cookie-based locale (`NEXT_LOCALE`) over URL-prefixed routing** — cleaner with the existing `basePath: '/route-planner'`.
- **Persistence design for edited preview rows**: write to BOTH `rawData` AND the parsed output by re-parsing (`updatePreviewRow`/`addPreviewRow`), so edits survive `saveInputSet` and re-mapping. `saveInputSet` now keeps full jobs/shipments rawData (user: "for a given set of preferences that are named, I want to retain the jobs/shipments data that had been previously uploaded as well as make sure that all mappings are saved against the profile").
- **Address autocomplete uses the production discover endpoint always** — explicit user instruction ("make all discover API requests using api.nextbillion.io and not the staging service"). User's original ask: "when adding a new job, shipment, or vehicle whenever there is a location entry required, don't show latitude and longitude as entry fields. Replace with an autocomplete address search field that searches against the nextbillion.ai discover API endpoint".
- **Mirror existing v3 lasso UX** for the preview-map lasso (user: "the route planner edit function has a 'lasso' tool for selecting stops to move or unassign").
- **Demo login bypass**: user asked "is there a way to bypass IAM all together for demo"; options were presented, user chose "strategy B" then "option 1" = **a real JWT supplied via env (`DEMO_NCC_TOKEN`)** that `/dev-login` writes into the `ncc_token` cookie. Rationale: BFF AuthGuard validates a real IAM JWT (audience = `IAM_CLIENT_ID`), so faking auth client-side can't work; a long-lived real token injected from Secret Manager keeps the BFF unchanged. Operational consequence: when the JWT expires the app shows an empty billing dropdown/blank tiles and BFF 401/403 until the secret is rotated (see runbook below).
- **Cloud Run via Terraform in the user's own GCP project, region `us-central1`, standalone Next output, `DEMO_NCC_TOKEN` pattern** (answers to scoping questions). Public invoker (`allUsers`) so the demo is reachable without Google auth; real auth is the in-app JWT.
- **Make the BFF's config bucket configurable (`NCC_CONFIG_BUCKET`) instead of granting access to the company's `gs://nb-ncc`/`gs://waymer`** — a per-project copy keeps the demo isolated.
- **Regex CORS entry for `route-planner-v2-*.run.app`** rather than listing each revision URL; user asked "do I need to modify my deployed bff-staging to support the cloud run URL...".
- **Merged ky auth hooks into one** because ky stops the chain after a hook returns a Request (see Debugging #7).
- **Pointer-events overlay outside DeckGL** for lasso editing instead of fighting react-map-gl `Marker draggable`.
- **24-hour datetime everywhere** ("datetime entry should always default to 24 hr time (no AM/PM)") -> `ampm={false}` on every `DateTimePicker`; date/time display uses the selected language's conventions (user: "date time selectors should use date time conventions for the selected language i18n and always use 24 HR time"); time-window filters should respect the timezone chosen in Preferences (user asked "are the date time selectors using the timezone specified in 'preferences'?").
- **MUI X DataGrid localization via locale packs** (`enUS/ptBR/esES/frFR`) selected from `useLocale`, plus translating the status badge values `successful`/`error`/`processing/Pending`.
- **Sort selected rows to top after a selection/filter** (user: "after doing a selection or filter on the preview screens order the items such that the selected items appear at the top").
- **Failure tolerance in shared libs**: `useBillingProjectLabel` wraps `useTranslations` in try/catch and falls back to the English label, because `libs/common` components can render outside a `NextIntlClientProvider`.
- **Never commit/push/tag without explicit approval; always branch from origin/main; never `--no-verify`** (process constraints from CLAUDE.md/AGENTS.md carried in every summary).

### Appendix 2 (full-length user messages: continuation summaries and long pastes)

User decisions (verbatim where recorded):
- **Analytics scoping answers**: "1 - a for stop counts 1 b for drive segments 2. global settings 3. just count first array value". Later: "1 - DM auto when the tab is active 2 - use the actual DM request for 'car' travel mode 3 - display average drive time only".
- **Drop Capacity and Demand columns** from the zone load panel: "in this use case stops and demands are the same - drop Demand"; "remove the capacity column from the Zone Load analytics panel". (Associated i18n keys removed too.)
- **Direct production DM**: "DM call should go to api.nextbillion.io not the staging service" -> `const NB_BASE_URL = 'https://api.nextbillion.io'` hardcoded in `use-zone-drive-matrix.ts`; URL `${NB_BASE_URL}/distancematrix/json?origins=lat,lng|...&destinations=...&mode=car&key=<apikey>`. Spinner in the cell while calculating.
- **Rename Zone -> Territory** in the analytics panel across all languages (adjective gender adjusted: carregado, cargado, chargé; Territorio, Território, Territoire); remap names `Zone N` -> `Territory N`, `Unzoned` -> `No territory`. Elsewhere (preview, optimiser request) it stays `Zone {n}`.
- **Clustering defaults** evolved: initially `clusteringType: 'o'`, `mode: 'car'`, `numClusters: 10` (vehicle-count auto-sync removed); Travel Cost default `Duration`, later changed to `Air Distance` (`useState<ClusteringTravelCost>('air_distance')`, `clustering-panel.tsx:44`); max cluster quantity default 100 -> 200 (`useState(200)`, line 48).
- **Vehicles O-clustering result**: remove ALL prior `AllowedZone*`/`AllowedZones` attached columns, then one `Allowed Zones` column with comma-joined, deduped, ascending cluster ids; for jobs delete prior `JobMapOption.Zones` attached columns (highest index first to avoid index shift) before adding Cluster ID. Implemented in `runClustering`:
  ```js
  const ALLOWED_ZONE_VALUES = new Set([
    VehicleMapOption.AllowedZones,
    VehicleMapOption.AllowedZone1, ..., VehicleMapOption.AllowedZone10
  ])
  const allClusterIdsCsv = Array.from(new Set(result.clusters.map(c => c.id))).sort((a, b) => a - b).join(',')
  dispatch.inputCore.upsertDataMapConfig('vehicle', {index: vehNewColAbsoluteIndex, header: 'Allowed Zones', value: VehicleMapOption.AllowedZones})
  ```
- **Label colour by background brightness** (user: "add an algorithm for determining the best label color to use for a supercluster based on the background fill being used"): ITU-R BT.601 luma `(299R + 587G + 114B)/1000`, `luma > 150 ? [30,30,30,255] : [255,255,255,255]`, wired via `updateTriggers.getColor`.
- **Job markers coloured by zone regardless of Zones layer toggle** (user request): `zonedJobLayer` renders whenever `zoneNameToColor` has entries; `showZones` gate removed.
- **Persistent in-polygon zone label instead of hover infowindow** on zone polygons, hidden at high zoom (`>= 13`).
- **Localized infowindow without touching shared lib**: keep `InputTooltip` untouched; add `LocalizedInputTooltip` at the app call site (13 keys under `inputTooltip`: id, description, location, pickup, delivery, service, setup, skills, timeWindows, timeWindow, Zone, capacity, breaks, in all 5 locale files).
- **ID search in import tables**: view-side reordering only (`viewOrder` = matches first, then rest, array of original row indices; `TableVirtuoso` `data={viewOrder}`, `itemContent(_viewIndex, rowIndex)` looks up `innerRows[rowIndex]`) so the store is not mutated and delete/edit/scroll keep original indices. Only shown when the ID column is mapped (`mapConfig.dataMappings.find(d => d.value === 'id')`). Match colour `#FFF7C2`; precedence error red > search match > zebra > transparent.
- **Zebra striping at cell level** (`ZEBRA_TINT = '#F7F8FB'`, parity `rowIndex % 2 === 1`) because `TableVirtuoso` provides no row wrapper.
- **Delete row** requires confirm dialog; **clone row** has no confirm; `ROW_ACTIONS_COL_WIDTH` widened 56 -> 96. `cloneRow` reducer inserts at `rowIndex + 1`, suffixes id with `-copy`, `-copy-2`, ... when the id column is mapped, and clones the attached row and output entry.
- **Unassigned Vehicles tab** on the solutions page: vehicles from `_rawInput.vehicles` whose id is not in `result.routes[].vehicleId`; shows shift time, capacity, skills, max working time, zones; Select-All disabled on that tab.
- **Per-row edit pencil kept, global pencil removed** from preview table toolbar; **Dev Mode toggle removed** from `components/common/page-head.tsx`.
- **Rename button** "Add Vehicles" -> "Add Vehs/Techs/Reps" in all languages (Vehs = vehicles, Techs = technicians, Reps = sales representatives).
- **Integrations**: ServiceNow and Microsoft Dynamics 365 added as import connection methods with researched parameters and brand icons; SAP and Dynamics 365 "Coming soon" chips removed on request (ServiceNow keeps `comingSoon`; translation keys retained).
- **Discover autocomplete** in the geocoder and address edit: `GET https://api.nextbillion.io/h/discover?q=...&limit=5&key=...` plus `&at=lat,lng` biased to map centre (user: "use the &at={latitude_longitude_map_center} to bias the searches"). `hooks/use-discover-search.ts`: `DISCOVER_HOST='api.nextbillion.io'`, `DISCOVER_MIN_QUERY_LENGTH=3`, `DISCOVER_DEBOUNCE_MS=250`, `DiscoverItem {title, id?, position:{lat,lng}, address?:{label?}}`, returns `{options, loading, belowThreshold}`, uses AbortController, handles missing API key. `AddressEditCell` `onPick(item)` updates address+lat+lng in one shot; MUI Autocomplete `freeSolo` with `filterOptions={(x) => x}` for server-side filtering.
- **Unclustered step layers stay edit-mode-gated**, cluster path is not.
- **Security/process rules restated by the project CLAUDE.md** (carried verbatim in every summary): always branch from remote main (`git fetch origin && git checkout -b <branch> origin/main`); never commit/push/tag/publish without explicit user approval (release/hotfix scripts default to dry-run, `--execute` only after confirming); never bypass hooks with `--no-verify` unless asked. The assistant refused to run `gcloud run services update`/terraform without confirmation: "I haven't run anything — these are for you. If you want me to execute one of them say the word; I'll need confirmation since it mutates the shared Cloud Run service."

### Territory analytics proposals (user: "let's drill into some of these suggestions")
Assistant proposed, user selected for build (order built: load summary, then Lorenz+Gini; later boundary-crossing, territory-flow, capacity-vs-demand, day heatmap):
- Zone load summary table: one row per zone: # stops, total demand, total service time, # vehicles entering, avg distance-per-stop within zone, % fleet capacity consumed ("territory balance sheet"); data from clustering output + `job.zones[0]` + route steps filtered by membership.
- Zone-balance Lorenz curve + Gini (single exec-trackable number).
- Cross-zone flow Sankey (nodes = zones, links = route segments crossing zone A to B; bad zoning = thick web).
- Per-zone cost stacked bar (distance x cost coef + duration x labour rate).
- Thumbnail-map gallery per zone doubling as an interactive zone picker filtering other cards.

---

### Appendix 3 (full-length user messages: continuation summaries and long pastes)

- **Auto-apply stored column mappings (2026-06-25)**. User requirement (verbatim): "if the user has a stored preference that matches the current name of the preference (as set in the 'Set Preferences' tab), use the stored column mappings for jobs, shipments, and vehicles when data is imported. For example, if the user deletes the current set of job data and imports a new set, preset the column mappings based on what is already stored for the preferences." Decisions: a new Rematch thunk `importRawData` rather than reducer-side magic; remap by header name not index (`rawData.header.indexOf(entry.header)`, drop entries whose header is gone) for cross-CSV robustness; `savePreferenceConfiguration` bundles `mapConfigs: {job, shipment, vehicle}` into the saved preference blob (`{...preference, mapConfigs}`); skip for `type === 'depot'`, empty header, missing `fileName`, or a name not in `preferenceList`; returns `{appliedStoredMapping}` so integration paths (`input-order.tsx`, `input-vehicle.tsx` Fleetify/TSP flows) skip per-TSP defaults when stored mappings applied. Open follow-up offered, not requested: auto-apply on preference load; scoping the API-key textbox change to route-planner-v2 only.
- **Hide API key name in header (2026-06-25)**. User: "change that text box so it doesn't show the text 'FEMSA_DEMO' or whatever comes from BFF and just shows the masked API key". `renderSelectedValue` returns `<KeyDisplay maskedKey={sanitizeApiKey(key?.kid ?? value, MASKED_KEY_LENGTH)} />`; names still appear in the dropdown items so keys can be told apart. The change lives in a shared `libs/common` component, so it is repo-wide (flagged as a follow-up question). Origin of "FEMSA_DEMO" had to be corrected once ("FEMSA_DEMO more accurately"): not v1 localStorage, but BFF `/common/api_keys` via `common-layout-rsc.tsx:30`.
- **Two zoom thresholds for supercluster (2026-06-25)**: `STEP_MARKER_MIN_ZOOM = 8`, `STEP_CLUSTER_MIN_ZOOM = 4`, `showStepClusters = mapZoom >= STEP_CLUSTER_MIN_ZOOM`; outer cluster gate uses `showStepClusters`, individual unclustered steps still gated by `showStepMarkers`. Rationale: lowering one threshold would create noise at extreme world zoom.
- **Grouping slider spec (2026-07-06)**: user: "add a new option to the Preferences tab where the user can set the parameters that get used for options.grouping.order_grouping.grouping_diameter - use a slider with default value of 0 and going up to 2km". Chosen: `MIN_DIAMETER_M = 0`, `MAX_DIAMETER_M = 2000`, `STEP_M = 50`, marks `0, 500m, 1km, 1.5km, 2km`, label via `formatDiameter` (0 -> "Off", <1000 -> "N m", else km with 2 decimals if non-integer); only sent in the payload when > 0.
- **Local fixtures as one `'local'` bucket (option B)** and per-requestId storage keys (see Debugging). Rationale: edits to fixtures must survive refresh without hitting GCS.
- **Disable edit-mode persistence** (see above) — clean fixture load beats resume-after-refresh.
- **Pin recalculation departure time** to `1783918800` per explicit user instruction, to keep before/after metrics comparable.
- **Assign unassigned orders to an unassigned vehicle during editing (2026-07-14)**. User: "when editing a solution, give the user the ability to add unassigned orders to an unassigned vehicle in the list. The route created will use the unassigned vehicle's start and end location." Implemented `assignUnassignedTasksToVehicle(vehicleId, tasks)` in `route-edit.store.ts` (throws if the vehicle is not in `input` or already has a route), `buildRouteFromUnassignedVehicle(vehicle, tasks, input)` in `step-operations.ts` (start/end from `vehicle.start_index`/`end_index`, `arrival: shiftStart` from `vehicle.time_window[0]`, returns `null` when start doesn't resolve) plus helper `parseInputLocation(input, index)` that converts `"lat,lng"` to `[lng, lat]`; then `applyDirectionsResult` fills distances/durations/arrivals. UI: "Assign tasks" button + Popover picker (search + checkbox list + Assign) on `UnassignedVehicleItem` (`editMode` prop).
- **Zone filter by day (2026-07-22)**. User: "change the zone filter so that the user can select all zones for a given day. list will include Zone-1, Zone-2,...Zone-n When the user selects Zone-1 it will select all of the zones for day 1". Kept the `selectedZoneIds` store schema unchanged; only the UI shape changed (`ZoneFilterOption = {day, label, zoneIds[]}`); `onChange` expands selected days to full zone-id sets and passes through ids that don't match the day pattern. Also: remove zone label overlays ("no need to apply labels to zones on the map": deleted `ZONE_LABEL_HIDE_ZOOM`, `ZONE_LABEL_SHOW_MIN_ZOOM`, `zoneLabelData`, the `'v3-zone-labels'` TextLayer), and "if a zone filter is applied make sure you render the zone polygon boundaries": when `selectedZoneIds.length > 0` use that set directly as `zoneAllowSet`; without a filter keep the narrowed-routes heuristic (hide zones when 0 or all routes selected, intersect with route-touched ids).
- **Rep filter**: "Add a filter by rep option that is a multi-select dropdown containing the route.description fields without the '-{week}-{day}' suffix": `stripRepSuffix = description.replace(/-\d+-\d+$/, '')`, `RouteRepFilter` Autocomplete, `selectedRepNames` in `ui.store.ts`, shown only when `hasRepDescriptions = Boolean(s.result?.routes?.some((r) => r.description))`; `route.description` shown on a second muted line (`pl: '19px'`) under `vehicleId` in the route card.
- **Description enrichment format (2026-07-11)**: `{current_id_value}|{TEMPO NO CLIENTE minutes}|WK-{WEEK}|WK-VISIT-{WEEK_VISIT_NBR}|{ACCEPTABLE_DAYS}|{TIPO DE VENDEDOR}`. `jobs_femsa.csv` to `input_femsa.json` mapping: ID is `Matricula`, `LAT_LONG` builds the location index, `TEMPO NO CLIENTE` is `service_time`, time windows array from `TW1..TWn`.
- **Clustering request defaults (one-time run, not in-app)**: O-clustering, routing mode car, travel cost air distance, 100 clusters, quantity 1 per job, max cluster quantity 200; request had to stay under 4000 unique locations, hence grid grouping. The clustering result was later set aside: "let's explore a new method of creating the zones ... rather than using the clustering API response" (zones from route-days instead).
- **Territory distance via NB Distance Matrix (2026-07-23)**. User asked "for distance calculation in the territory planning pipeline, can we switch from haversine distance to using nextbillion.ai directions or distance matrix service" and picked option "2" = per-territory circuity measured with Distance Matrix (`measureTerritoryCircuities()` called after R settles; `travelPerVisitH` accepts a circuity override). API key comes from the `apikey` cookie. Server-side pipeline execution via copy-into-lib was chosen after an AskUserQuestion clarification.
- **Voronoi vs hull**: user first asked to "bring the separated objects into a contiguous polygon object" (hull computed), then "go back to the vornoi polygons - not the hulls", then "provide the user with a button on the map view that allows them to toggle from the voronoi view to hull view and back". Final: both kept; hull computed client-side so toggling is instant; edit mode only enabled in hull mode with a clicked territory (user spec: "The edit is only enabled if the territory mode is 'hull' and the user has clicked in one of the territories ... a recalculation of the summary statistics ... triggered after the user 'saves' the edits").
- **Recalculate semantic (2026-08)**: user: "I don't want to recalculate the territory boundaries but calculate the metrics based on how the territories are currently laid out and the POS's that belong to the territory". Hence a separate server endpoint (`reschedule`) that skips clustering: `parseBase` -> filter by terrMap -> `recomputeTravel` -> `scheduleAll` -> `validate` (with `allowOverCap`) -> `buildBoundaries`, returns `{pos, R, metrics, slotLoads, boundaries, dropped}`. Answer to "is the rescheduling performed server-side or client-side": server-side (HiGHS LP scheduler runs only on the server). After recalculation the user wanted to "save the solution to storage - provide a new name or overwrite the one I'm editing": `updateSavedResult(id, {result, inputs?, name?, fileName?})` preserves id/createdAt, refreshes updatedAt + summary counts; Save-as-new suggests `{name} (copy)`.
- **Per-territory stats table + calendar popover**: user first asked click-to-popup, then "have the territory calendar view popup on mouseover ... (disable the click action)". Implemented as a MUI Popover with `pointerEvents: 'none'` and focus flags disabled (hover-only). Loads per `[terr][week][day]` are reconstructed client-side from `pos.schedDays x schedWeeks x visitH` (`territoryTable` memo returns `{rows, loads}`). Row click pans/zooms via `focusRequest: {terr, tick}` -> `boundsToViewState`, deliberately without changing `selectedTerritories` (user: "don't deselect the other territories. Just pan/zoom").
- **Right-click delete POS**: context menu (`onContextMenu` on the outer div, MUI Menu anchored at click coords) with a confirmation dialog; deletion marks the solution "stale" requiring Recalculate.
- **CSV + English column aliases (user spec 2026-08)**: `MATRICULA|ID`, `CEP|DESCRIPTION`, `LAT_LONG|LAT_LONG`, `TIPO DE VENDEDOR|CATEGORY`, `FREQUENCIA DE VISITAS|FREQUENCY`, `TEMPO NO CLIENTE|SERVICE_TIME`, `DIAS ATENDIMENTO DA CIDADE|VALID_DAYS`, `DIA RESTRICAO CLIENTE|INVALID_DAYS`. Implementation `COLUMNS`: matricula `['MATRÍCULA','MATRICULA','ID']`, cep `['CEP','DESCRIPTION']`, tipo `['TIPO DE VENDEDOR','CATEGORY']`, freq `['FREQUENCIA DE VISITAS','FREQUÊNCIA DE VISITAS','FREQUENCY']`, tempo `['TEMPO NO CLIENTE','SERVICE_TIME']`, dias `['DIAS ATENDIMENTO DA CIDADE','VALID_DAYS']`, restr `['DIA RESTRIÇÃO CLIENTE','DIA RESTRICAO CLIENTE','INVALID_DAYS']`. The `.csv` extension test is `/\.(xlsx?|csv)$/i`.
- **Mock "Dispatch" button** (user: "add a mock button 'dispatch' next to the last route summary detail 'driving'") — `DispatchButton` in the RouteGrid header; mock only.
- **Territory selection UI**: preview rows are all selected by default after load; filter by TIPO, search by POS id; build progress block lives above the DataGrid (preview stays mounted during `building`; controls disabled while running); Settings icon + Popover with 4 numeric fields and a badge counting active overrides.

## Reusable conventions (things future instances should repeat)

### Transcript part A (chunks 1-3)

1. **Local install on this monorepo:** `CYPRESS_INSTALL_BINARY=0 yarn install --inline-builds` with `dependenciesMeta: { "nx@19.6.5": { "built": false } }` in root `package.json` (local-only; revert before commit). If anything still stalls, diagnose with `pgrep -lP`, `lsof -a -p <pid> -d cwd`, and the empty `build.log` trick; `kill -9` the yarn process too, not just the child.
2. **Build/run route-planner-v2 without nx:** from `apps/route-planner-v2`: `yarn next build --no-lint` then `yarn next start -p 4200`; for editing use `WATCHPACK_POLLING=true yarn next dev -p 4200`. Clear `.next` (`rm -rf .next`) before any rebuild whose output you must verify, and prove it with `grep -l` on `.next/static/chunks/*.js`.
3. **Always set `ENV=preview` locally** (otherwise `fetcher-rsc.ts` rewrites BFF to `http://bff:3000` → `ENOTFOUND bff`), plus `BASE`/`NEXT_PUBLIC_BASE=/route-planner`, a **matched** IAM/BFF pair (iam-stg + preview client `adac0e93-...` ↔ bff-staging/local BFF), and `HOST` equal to the actual port (4200).
4. **`NEXT_PUBLIC_*` = build-time.** Any change to those requires a rebuild (not a restart) for production builds; in `next dev` a restart of the dev server picks them up. Prefer making `.env.local` coherent over long inline env blocks; watch for lost `\` line continuations.
5. **After auth changes restart BFF** (ADC/env read at startup). ADC (`gcloud auth application-default login`) ≠ gcloud CLI account (`gcloud auth login`).
6. **Before editing a UI file, trace the route:** open the route's `page.tsx`, follow its imports (watch legacy `components/**` vs `v3/**`), and only then edit. Verify the edit reached the browser (DOM probe / served-HTML `includes`) before iterating.
7. **Geo conventions:** parsed locations are `"lng,lat"` strings; turf wants `[lng, lat]`; NextBillion discover results have `position` (lat,lng) and `address.label`; write-back format depends on the mapped `MapInputType`. Read the parser (`col-parsers.ts`) before writing any coordinate helper.
8. **Overlays on deck.gl maps:** interaction layers that must receive clicks go as siblings *above* `<DeckGL>` (z-index ≥ 1000); anything needing react-map-gl context (`Source`/`Layer`/`Marker`) stays inside `<Map>`.
9. **Next config wrapper order:** `withNx(withNextIntl(withSentryConfig(config)))` — keep `withNx` outermost or `basePath` is lost and all routes 404 under `/route-planner`. Restart dev server after any `next.config.js` change.
10. **i18n workflow:** add keys to all three catalogs (`en`, `pt-BR`, `es-MX`) together; `useTranslations('<section>')`; use fallbacks (`option.label`) so unlisted values still render; for mapper fields use the sanitized key pattern (`skill 1` → `skill_1`); never call `dayjs.locale(...)` in formatters (let `DayjsLocaleSync` own it); use `useFormatDuration` rather than hardcoded `hrs/mins/secs`; static-import message JSON in `i18n/request.ts`. When the user screenshots "red boxes", translate everything in them including dropdown menu items.
11. **Preview-page data changes must flow through `rawData`** (edit/add/lasso/filter all rely on `rawData` + re-parse + `selected*` sets) so Save → profile → reload round-trips (`saveInputSet`/`loadInputConfiguration`). Re-parse single rows with the same parser + `extraConfig` as import to avoid drift.
12. **Dev-only credentials/routes must be env-gated** (`dev-login` returns 404 unless `ENV=test`; creds only via env, never client-visible; do not commit demo creds; don't hardcode in source). Pause and scope auth-touching requests before editing.
13. **Cloud Run sanity:** if a JSON endpoint returns HTML 200, `curl` it — Google's "Congratulations | Cloud Run" page means no deployed revision. Map `403` + `apiKey=opensesame` to "anonymous / no JWT cookie".
14. **Don't over-trust screenshots of stale state:** if a visible change is missing, first check the running mode (`next dev` vs `next start`), then the served bundle, then the file path being edited.
15. **Git hygiene stated by repo rules:** branch from remote `main`, no commits without approval; `package.json` `dependenciesMeta` workaround and demo creds stay uncommitted.
16. **Ask-before-build for large scope:** for substantial features (i18n, lasso, edit/add row) the assistant surveyed existing code first, reused existing patterns (e.g., v3 lasso, existing parser, existing `mapperFields` catalog, existing `currentApiKey` for discover), set up task tracking, shipped in small slices, and listed explicit "NOT done" scope boundaries in each summary.

### Transcript part B (chunks 4-6)

**Auth / BFF**
- When a cross-origin BFF call 403s with no auth header on the wire: check *all four* fetch clients (v3 ky, `useFetch`, `fetcher-client`, `fetcher-rsc`), not just the one you remember; grep the failing module's imports.
- Always attach `Authorization: Bearer <ncc_token>` whenever the cookie exists; never gate by `env.PREVIEW` in client fetchers.
- In ky, put all `beforeRequest` mutations (apiKey query param + Authorization header) into **one** hook that returns the final `Request`.
- `?apiKey=` is not auth. JWT `aud` must equal BFF `iamClientId` (Secret Manager `bff-staging-iam-client-id`); after changing a secret re-pin with `--update-secrets=...:latest` to force a new revision.
- `.env.local` change ⇒ restart `next dev`; `libs/common` change ⇒ restart dev server, maybe `rm -rf apps/route-planner-v2/.next`; hard-refresh browser (Cmd+Shift+R).
- Stale `apikey` cookie or cleared `ncc_token` ⇒ revisit `/route-planner/dev-login` to re-mint.
- Don't swallow upstream errors in shared fetchers; it just relocates the crash.

**GCP / Terraform / Cloud Run**
- Any manually set Cloud Run env var must also be in terraform (`NCC_CONFIG_BUCKET`, `CONFIG_PATH`), and terraform must `ignore_changes` on the image. Always set `image_tag` explicitly on apply, or the service reverts to the `hello` placeholder.
- SA IDs ≤ 30 chars. `gsutil mb -p <proj> -l us-central1 gs://<globally-unique>`. Grant `roles/storage.objectUser` on config buckets so read/create/overwrite/delete all work.
- Use `gcloud ... --format=json | jq` for verification; use `--update-labels=cache-bust=$(date +%s)` to force a new revision/clear in-memory caches.
- Build images with `--platform linux/amd64` (arm64 host); tag with `$(git rev-parse --short HEAD)` plus suffix (`-fix2`, `-bucket`) when working tree is dirty or when retagging; **commit source changes before building** or the SHA tag lies about contents.
- For Nx + Next standalone: static must be copied to the path implied by Nx's overridden `distDir` (`dist/apps/<app>/.next/static`); check embedded config in `server.js`. Use relative redirects behind Cloud Run.
- When adding a frontend origin, update BFF CORS allowlist regex (`route-planner-v2-*.run.app`) and redeploy.
- Env-driven public config (`NEXT_PUBLIC_*`) is baked at build — rebuild after changing; verify the baked `IAM_CLIENT_ID` in server.js `publicRuntimeConfig`.

**UI / maps**
- Interactive overlays on top of the DeckGL map must live outside DeckGL with higher z-index than the drawing overlay (1000 → 1001), `pointerEvents: 'none'` container + `'auto'` on handles, own pointer-capture drag, and disable map `dragPan` during the gesture.
- Separate cheap per-frame state updates from expensive commit-on-release (Redux / viewport fit) to avoid "Maximum update depth exceeded".
- Table re-ordering for selection: keep a `displayOrder` map and translate indexes back to originals so downstream callbacks keep stable indexes.
- Public assets under basePath: prefix `/route-planner/` explicitly; URL-encode spaces/parentheses in filenames (`%20`, `%28`, `%29`).
- Shared lib edits that change behavior for all apps (ApikeySelector slice, `useFetch`/`fetcher-client` auth) should be flagged to the user with the blast radius.

**i18n**
- Add each new key to **all four** catalogs (en, pt-BR, es-MX, fr-CA) in the same edit and validate JSON parses (assistant checked "All four catalogs parse cleanly"); when adding a new locale also add its name to every catalog's `locales` block, plus `request.ts`, `locale-switcher.tsx`, `dayjs-locale-sync.tsx`.
- Use `t.rich(...)` for strings with embedded components (support `mailto` `<SupportEmail>` slot, inline `<Link>`), ICU `{count}` plurals/interpolation (`Last N Requests`, `+ n more`), and `{name}` interpolation for confirm/toast messages.
- Wrap third-party UI strings: MUI X DataGrid "Rows per page" needs `localeText` from the MUI X locale pack (wired into `StyledDataGrid`); `DateTimePicker` needs `ampm={false}` for 24-hour (routing-panel, data-mapper-cell, job-filter-bar); status badges (`RequestStatus` "Successful") need translation of the rendered string; `FullScreenLoading` accepts `message` prop → created `components/common/localized-full-screen-loading.tsx` (injects `t('common.loading')`), swapped 5 call sites (`(input)/page.tsx`, `solutions/[requestId]/page.tsx`, `sn/[requestId]/page.tsx`, `opt-result-panel.tsx`; `data-mapper.tsx` already localized).
- Surfaces translated this stretch (catalog keys): `inputPreview.*` (`pageTitle`, `tab_jobs/depots/shipments/vehicles/preferences`, `saveSetup`, `saveSetupTooltip`), `loadingSolution.*` (`title, requestFailed, generatingRoutes, useRequestIdLater, howToLoadLater, loadInstructions, routesReady, routesReadyDescription, needHelp, emailSupport, startError, requestId, openSolution, copy, copied`), `savePrompt.*` (`save-prompt.tsx`), `routeMetrics.*` (`route-metrics-overlay.tsx`), `editToolbar.*` (`solution-toolbar.tsx::EditToolbar`: Discard Changes/Undo/Redo/Apply Changes, two confirm dialogs, toasts), `appBar.billingProject`, `shareMenu.*` (`share-menu.tsx`: Share, Dispatch To Driver App, Dispatch To Connection, Download Route Files, Share via URL), `loadSolution.*` (`components/dialogs/solution-redierct.tsx`: 14 strings incl. column headers Date of Creation/Description/Request ID/Status/Actions), `analytics`, `devDialog`, `timeline` (timeline header "Timeline | N Routes", "Vehicle" column + tooltip in `timeline-overlays`), `geocodePreview.*` (`geocode-loading.tsx`, `geocode-preview-modal.tsx`, `geoccode-preview-table.tsx`, info-window tooltip `GeocodeAddressTooltip` reusing `geocodePreview.column.{address,latitude,longitude}`), `common.confirm`.
- Workflow the user followed: send screenshot of an untranslated surface → assistant locates source, wires `useTranslations`, adds keys to all four catalogs, summarizes.

**Preferences UD implementation conventions**
- BFF DELETE reads params via `@Query` (avoids body-on-DELETE proxy quirks); server fetcher JSON-serializes bodies for non-GET so put params in the URL for DELETE.
- Rematch effects `deletePreferenceConfiguration({name})` (if active, load first remaining or fall back to `"Default"`) and `renamePreferenceConfiguration({oldName,newName})` (validate non-empty/no duplicate locally first; update list and active `fileName`).
- UI: replaced `<Select>` with `<Button>` + `<Menu>`; each item has trailing `MoreVertIcon` → submenu Rename / Delete (delete in error color); active item `selected`; rename in small Dialog (Enter submits, inline error); delete uses existing `confirm()` from `@ncc/common/client`; all actions disabled while a server call is in flight. `Dialog/DialogTitle/DialogContent/DialogActions` are re-exported by `@ncc/ui`.
- i18n `preferenceSelector` keys added: `moreActions, rename, renameTitle, renameLabel, renameEmpty, renameDuplicate, renameSuccess, renameFailed, deleteConfirm, deleteSuccess, deleteFailed`.
- New BFF endpoints require BFF redeploy before UI works (frontend gets 404 on `/config/delete` and `/config/rename` until then).

**Process conventions seen**
- Task tracking (Task 1–5: BFF endpoints, server actions, Rematch effects, PreferenceSelector UI, i18n) for multi-layer work; skip it for single follow-up debugging.
- Remove diagnostic `console.log`/sentinels (`BUILD-2026-05-29-A`, `[ky:*]`, `[useFetch:authHook]`) once the fix is confirmed; the useFetch log was stripped immediately, ky logs deferred until after the demo.
- Report heads-ups about blast radius, deploy requirements (BFF image rebuild), and token expiry (`DEMO_NCC_TOKEN` ~7–18 days) in the same turn as the change.

### Transcript part C (chunks 7-9)

- **Check every sibling code path before declaring a fix done.** Two examples this stretch: AI-mapping description fallback (debug-dialog path vs production auto-apply path) and the auth-header sweep that missed the raw-`fetch` `directions.api.ts` (fourth fetch client). Grep the payload/dispatch/fetch site names first.
- **When a bug could be stale-data or stale-UI, add targeted diagnostics and ask the user for exactly one log**, then remove the diagnostics. Stringify arrays (`JSON.stringify`) because Chrome console collapses `Array(2)`. Expected-value checklists help: for São Paulo coords expect `[-46.x, -23.x]` (lng,lat); lat,lng reversal → `[-23.x, -46.x]`; 10× off → wrong polyline precision; ring closed means first point equals last.
- **Hard refresh wipes Redux** — clusters etc. are not persisted unless saved into preferences; reproduce without refreshing, or save/reload preference.
- **Never use global `Map` in files that import `Map` from `react-map-gl`**; use `Record<string, T>` + `Object.values/keys` or alias the import.
- **Webpack CJS interop for constructors**: `const Ctor = (ns as any).default ?? ns`.
- **Coordinate-order discipline**: internal `"lng,lat"`; NB clustering request `lat,lng`; GeoJSON `[lng,lat]`; if request order changes, re-verify response decode order, and note persisted data from the broken window needs re-generation.
- **deck.gl/Maplibre**: single non-interleaved overlay is the stable baseline. If trying interleaved (`MapboxOverlay`, `beforeId`), `road_*_label` / `place_park` match "label" heuristics but sit low in the TomTom-style stack — don't use name-contains heuristics; test polygons visible first; revert quickly if broken.
- **Cheap vs heavy updates during drags**: local draft state each pointermove, one Rematch effect on pointer-up. Use pixel-space translation for rigid shape moves.
- **Spiderfy** thresholds: zoom ≥ 14, 5-decimal bucket, 26 px radius; originals untouched (cloned objects with rewritten `location`).
- **Auto-fit viewport** effects must be gated by a data-identity key (ref), not by derived bbox that changes with visual filtering.
- **Tooltip/hover state is a snapshot** — clear it when the source data reference changes.
- **i18n**: add new keys to all four locale files (`en`, `pt-BR`, `es-MX`, `fr-CA`) in the same change; validate each JSON parses; keep `{unit}` style interpolations; use native-script phrasing; remove orphaned keys when removing UI. Confirm-dialog buttons come from the shared `confirm()` helper in `@ncc/common/client`.
- **Persisted preference shape**: anything user-visible that should survive reload goes on `PreferencesInput` and rides `savePreferenceConfig(preferences, fileName)`; unconditional reset on load for slices like `clusters`; don't include cosmetic state (column widths) in the dirty-snapshot.
- **Deploy loop**: rebuild + `docker push` + `gcloud run deploy` from monorepo root with `--platform linux/amd64`; verify static assets with authenticated requests (unauthenticated curl gets a 307 to `/route-planner/dev-login`); for frontend-only changes no BFF deploy is needed, for BFF changes (rename logic) the BFF image must be redeployed separately.
- **Build gotchas checklist**: `typescript.ignoreBuildErrors: true` active (temporary); SSG circular imports → `next/dynamic({ssr:false})` shim; MUI X Pro locales from `@mui/x-data-grid-pro/locales`; avoid filenames with spaces/parens in `public/`.
- **Disambiguate overloaded terms before building** ("clustering" = NB API zoning vs marker supercluster), and when a feature has multiple plausible scopes, give a short option list with a recommendation (assistant's pattern; user typically answers with a number or a one-line pin).
- **Analytics card recipe**: build component taking `AnalyticsProps` → register in `REPORT_COMPONENTS` → default entry in `utils/settings.ts` → i18n in `analytics` namespace (4 locales) → read inputs from `useRawOptimizationInput()` (same source as the map), not `useOptimizationInput()`; map step→job via `step.id` with `isJobStep()`.
- **Cell-level styling for TableVirtuoso** (no row element to style); zebra `#F7F8FB` on odd rows; error highlight wins.
- **Description concat order**: sort by column `index` when more than one `description` mapping; pipe `|` delimiter.

### Transcript part D (chunks 10-12)

1. **Check for global-name shadowing in map files**: in any file with `import Map from 'react-map-gl'`, never use `new Map()`/`Map<>`; use plain objects (or alias the import). Hit again in this chunk with `jobById`.
2. **`??` not `||` for index/number defaults** where 0 is valid (`selectedRowIndex ?? -1`).
3. **Browser `fetch` needs the basePath** (`${ROUTE_PLANNER_BASE_PATH}/api/...`) — only `next/link`/router prepend it. Sanitize any `?next=` redirect: must start with the basePath, reject absolute URLs.
4. **Large Server Action payloads**: keep `experimental.serverActions.bodySizeLimit` raised (10mb); empty-body 500 + no upstream log = Next rejected it before the action ran.
5. **Reorder views by index mapping, not by mutating store**: pass original row index to all handlers (search-to-top in data mapper); keeps delete/edit/scroll ids valid and React keys stable.
6. **View-layer filters, not store mutations** (`skipLeadingRest`): apply at every consumer of `route.steps` (map, manifest, route card, timeline, raw-to-domain), keep `_rawRoutes` pristine for edits/exports.
7. **Heavy lists**: isolate fast-changing input state in a leaf component, debounce the store write (150ms), add a no-op guard for effects that mutate selection, `React.memo` list items. Don't rely on debounce alone when state lives on a large parent.
8. **deck.gl picking**: layers with transparent-edge icons need an opaque/pickable overlay or a pickable overlay layer; closure-scoped dedup in shared hover helpers can go stale — set hover info directly in app code; cluster circles should be pickable and route through the same tooltip infrastructure (`popupType`) rather than a separate popover.
9. **Zoom gating pattern**: named constants at the top of the hook, AND-ed into layer pushes, `mapZoom` in memo deps; polarity differs (`*_MIN_ZOOM` show-above vs `ZONE_LABEL_HIDE_ZOOM` hide-above). Current values: `ROUTE_LINE_MIN_ZOOM=5`, `STEP_MARKER_MIN_ZOOM=8`, `STEP_STACK_MIN_ZOOM=14`, zone labels in [6,13).
10. **Shared lib vs app**: shared lib (`libs/route-planner-components`) cannot import from the app or use next-intl; lift helpers into the lib or wrap at the v2 call site. Don't edit lib components in ways that break `route-planner-viewer`.
11. **i18n workflow**: every new string goes in all five `messages/{en,pt-BR,es-MX,fr-CA,pl-PL}.json`; validate parse + key parity with a quick node script; Polish ICU plurals need `few/many/other`; add `t` to `useMemo` deps of columns that bake in labels; keep key names stable when only copy changes (Zone -> Territory).
12. **Typecheck narrowly**: run focused tsc on touched files rather than waiting for repo-wide nx typecheck; distinguish pre-existing errors (spec files, implicit-any in zone-filter persistence).
13. **Persisted UI filter state** that must survive tab/unmount goes in Redux slice (`inputPreview`), not component `useState`.
14. **Always verify coordinate-order from a consuming call site**, not from types/comments (`step.location` is `[lat, lng]` here despite the comment); NB DM/optimization endpoints want `lat,lng`.
15. **Public NB API host** `https://api.nextbillion.io` for map style, discover (`/h/discover?q=&limit=&key=`), DM (`/distancematrix/json`); BFF keeps SKU gating but forwards optimization/route-planner-api to api.nextbillion.io (no env flag, authoritative).
16. **Deploy hygiene**: docker `--platform linux/amd64`; image tag `$(git rev-parse --short HEAD)` (+`-dirty` for BFF if uncommitted); route-planner-v2 via terraform `-var="image_tag=$TAG"` or `gcloud run services update --image`; BFF via `gcloud run deploy` only (terraform ignores image). Don't commit/push/deploy without explicit user approval (CLAUDE.md rule).
17. **When user asks for an ambiguous visual change, state the interpretation and offer revert** (zone-label band, cluster zoom thresholds): the user rolled back once when the agent removed a deliberate gate without asking.
18. **Salesforce OAuth debugging**: add structured server logs of non-secret facts (id prefix/length, secret length + source, token URL, redirect URI, verifier length) before guessing; beware env var shadowing UI-provided credentials; PKCE must send `code_challenge` + `S256` on authorize AND `code_verifier` on token exchange.

### Transcript part E (chunks 13-15)

1. **basePath-prefix every URL** you hand the user (`/route-planner/...`), including Route Handlers, dev-login, and `public/` fetches.
2. **Token rotation checklist** for Cloud Run: (a) verify JWT `iss` / `aud` against `IAM_HOST` / `IAM_CLIENT_ID`; (b) write to the terraform-named secret, not the env-var name (check `secrets.tf` first); (c) `printf '%s'` / `echo -n` to avoid trailing newline; (d) force a new revision (secret `latest` is resolved per revision); (e) clear the `ncc_token` cookie and hit `/route-planner/dev-login`; (f) for local dev also update `apps/route-planner-v2/.env.local` and restart the dev server.
3. **Before answering "where does this text come from"**, trace the rendering component back to the data source (here: API-key names came from BFF `/common/api_keys`, not files or localStorage). Say when a change in a shared lib (`@ncc/common/client`) affects every app.
4. **Filters on the solution page are ANDed** (search ⟂ time range ⟂ zone ⟂ rep) and each drives the auto-select effect (selection narrowing → polylines and zones then show). When adding another filter: add state to `ui.store.ts`, a sub-component in `result-panel.tsx`, include in `filteredRoutes`, add to the auto-select `useEffect` deps and gate, gate the UI on data availability (no dead UI), add i18n keys to all five locale files and validate JSON parses.
5. **Declutter rule**: heavy layers (polylines, zones) render only for a narrowed selection; an explicit zone filter overrides the narrowing gates.
6. **Don't depend on naming conventions** (e.g. zone names) for logic; use real assignments (`job.zones`) and compare IDs via `String(...)` since fixtures mix numeric and string ids.
7. **Keep two indices** whenever you hide items from a list: `displayIndex` for numbering, source-aligned index for hover/store lookups; verify against the map's indexing (`skipLeadingRest`).
8. **Arrow direction ≠ color**: direction = sign of change, color = favorability.
9. **Guard server responses that return 200 with an error body**: throw in the API wrapper (`directions.api.ts`) with the server message, and add optional chaining downstream as defense in depth; ensure the edit store's try/catch snapshot rollback runs.
10. **Local-only solutions** use `source === 'local'`: never call BFF save/edit/share endpoints; persist edits in requestId-keyed localStorage; new fixtures = add an entry to `FIXTURES` in `use-solution-data.ts`; keep legacy storage keys for backwards compatibility.
11. **Do not persist transient edit state** (`route-edit` store `partialize` returns `{}`); reset on rehydrate to avoid boot-into-edit-mode hangs.
12. **Fixture generation scripts**: idempotent (strip prior fields/skip already-enriched values), report stats (rows, matches, misses), spot-check samples, name the undo path (re-run the generator). Prefer deterministic joins (JOB_ID ↔ step.id) and verify counts match the solution's `unassigned` count.
13. **Coordinate conventions**: NB APIs (clustering `locations`, distance matrix) want `"lat,lng"`; GeoJSON wants `[lng, lat]`; internal mainline `locations` may be `"lng,lat"` (un-swap before clustering); São Paulo sanity check: lat ≈ -23.x, lng ≈ -46.x.
14. **ESM-only deps in Next server code**: use `await import()` (not `require`) and keep WASM/native-ish libs (`highs`, `exceljs`) as server externals in `next.config.js`.
15. **Long CPU/WASM jobs in an API route**: stream NDJSON progress; consider a worker thread because synchronous compute can starve concurrent RSC fetches in dev (rule of thumb already noted: >~seconds of sync compute).
16. **When nx hangs**: don't wait on buffered pipelines; check `ps`, kill daemon + `yarn nx reset`, use `NX_DAEMON=false`, or fall back to focused `tsc --noEmit` and grep output for touched files; ignore pre-existing errors in `components/solution/opt-result-panel/`. Don't kill a shared daemon without the user's say-so (it also serves their editor extension).
17. **Hooks rule**: never call `useMemo`/hooks after an early `return`.
18. **Ask before expensive/ambiguous changes** and offer ranked options: e.g. distance-matrix swap (3 options, recommend 2), local editing (A vs B with recommendation), unassigned tab (hide vs filter). Flag spec ambiguities (Matricula vs numeric `id`) and state the chosen default plus how to flip.
19. **Never release/tag/publish without explicit go-ahead**; release scripts dry-run by default; commit before building images so tags match content, or use a descriptive manual tag.
20. **Docker on Apple Silicon**: always `--platform linux/amd64` for Cloud Run.
21. **Translate every user-facing string into all five locales** (en, pt-BR, es-MX, fr-CA, pl-PL) and validate each JSON parses; note any remaining untranslated surface (territory date-filter overlay and hover tooltips were still English at end of range).
22. **Don't let screenshots mislead**: confirm which component the screenshot shows (v2 vs v1 API key selector; `page-head.tsx` dropdown vs `menu.tsx`) before editing.

### Transcript part F (chunks 16-18)

- **Tag images with provenance**: `$(git rev-parse --short HEAD)-<dirty|dev|standalone>-<timestamp>[-suffix]` when tree is dirty so a running revision can be traced; build with `--platform linux/amd64`; run builds in the background and wait for completion notification; then push, then `terraform plan` (show diff), then `terraform apply -var="image_tag=<TAG>"`.
- **Before destructive/outward actions** (git history replacement, repo push, state-file rename, `gcloud run services delete`, secret rotation): rename/back up instead of delete, inspect what's staged, state the rollback command, and wait for an explicit go ("push it").
- **Secret rotation recipe** (no rebuild): `echo -n "<value>" | gcloud secrets versions add <secret> --data-file=- --project=<project>` then force a new Cloud Run revision (`gcloud run services update` no-op or `terraform apply`); then hard-refresh or visit `/dev-login`.
- **Terraform + ADC**: if Terraform hits IAM errors, check ADC identity (`gcloud auth application-default login --account=<owner>`), not just `gcloud config set account`. Also fresh-state bootstrap when moving projects. If Cloud Run "internal error" on first create, retry once after IAM propagates.
- **Cloud Run sizing for HiGHS WASM + exceljs + ~6.5k POS**: memory `2Gi`, cpu `2`, timeout `900s`, `startup_cpu_boost = true` (512 MiB / 300 s default OOMs, symptom = stream ends without `result` event).
- **Streaming long pipelines**: NDJSON events (`type: 'log'` + final `result`), client shows step progress in a banner above the preview table; disable Back/Build/search/filter/row-select while running; on failure route back to preview with red error banner.
- **Always derive aggregates from the same effective data source** (`effectivePos`, `effectiveResultForSave`) used by Save, so what you see equals what you persist.
- **Mark derived-but-stale metrics** with a Stale chip instead of silently showing wrong numbers; provide a Recalculate action; clear badges once server returns fresh data.
- **Add translation keys to all 5 locales** (`en, es-MX, fr-CA, pl-PL, pt-BR`) in `apps/route-planner-v2/messages/*.json`; validate JSON parses (next-intl falls back to English if a key is missing but keep them consistent). New keys cited here: `mapPrevious`, `settingsDefault`, `staleAfterEdits`, `perRepAndService`, `speedKmh`, `colLat`, `colLon`, 3 keys for Update/Save-as-new, 5 for Recalculate, 10 for Settings.
- **Typecheck scoped**: run `tsc --noEmit` and filter output to touched paths; judge success by zero errors in your files since the repo has pre-existing unrelated errors.
- **Coordinate conventions** (check every time): NBAI request bodies `"lat,lng"`; app internal `"lng,lat"`; v2 optimization `Step.location` `[lat, lon]`; v1 `[lon, lat]`; GeoJSON `[lng, lat]`.
- **Anchor all clock values to one timezone** (UTC server-side) and render in that same zone client-side, including `hour12: false` for 24h displays.
- **When two code paths share a pipeline of hooks (ky), merge into one hook** if an earlier hook returns a new `Request`.
- **When rewriting cross-origin requests** drop `credentials: 'include'` (CORS).
- **CORS-blocked third-party service**: add a same-origin Next API route proxy instead of changing the third party.
- **For CSV in the browser via SheetJS**: decode as UTF-8 string and read with `{type:'string'}`; normalise headers with BOM strip + NFC; for server exceljs, `wb.csv.read(stream)`.
- **Editing CSV with quoted fields**: use Python `csv`, not awk/sed.
- **Heavy datasets**: provide a deterministic sample control and warn that POS x R LP variables scale quadratically; full datasets of 211k POS blow past a ~6 GB Node heap.
- **Env var discipline**: server-only secrets never `NEXT_PUBLIC_*`; client-baked keys passed via `--build-arg`; Secret Manager secrets referenced from `secrets.tf` `secret_env_vars`; document new secret-seeding steps in `apps/route-planner-v2/infra/terraform/README.md`.
- **Repo hygiene**: add `.env*` considerations before publishing (`apps/route-planner-v2/.env` held a dev IAM credential; `.env.local` was tracked); ignore backup folders (`.git.backup-*`); don't commit without approval (project rule: "never-commit-without-approval").
- **Quick cost control for expensive LLM endpoints** (offered): per-session rate limit on proxy route; declined by user for the AI-mapping route but recommend for any public standalone deploy.
- **Ask a scoping question only when a choice is truly the user's** (project, key, model, one-way push); otherwise default and report.

### Appendix 0 (full-length user messages: continuation summaries and long pastes)

- For a fresh Yarn 3 + Nx machine setup, start with:
  `NX_CLOUD_ACCESS_TOKEN= NX_NO_CLOUD=true NX_DAEMON=false NX_SKIP_NX_CACHE_INSTALL=true CYPRESS_INSTALL_BINARY=0 yarn install --inline-builds`
  and expect a finish in about 7 seconds when the cache is warm.
- Always include `BASE=/route-planner NEXT_PUBLIC_BASE=/route-planner` plus the full `IAM_HOST`/`IAM_CLIENT_ID`/`BFF_HOST`/`NEXT_PUBLIC_BFF_HOST` set when starting the Next app, and keep `HOST` equal to the real origin and port.
- Before blaming the frontend on a 404 or empty org, read the BFF console; a `storage.objects.get` denial there means the wrong Google identity (ADC / active gcloud account) on the machine.
- Before `next build`, clear Error-level ESLint violations (`@ts-ignore` to `@ts-expect-error`, escape `"` and `'` in JSX text); warnings do not block.
- When pasting logs to an agent, include the first error line and its stack, not the whole yarn peer-dependency list; the YN0002/YN0060 lines carry no signal.

### Appendix 1 (full-length user messages: continuation summaries and long pastes)

### i18n workflow for route-planner-v2
1. Add the `useTranslations('<section>')` call in the **component the route actually renders** (trace imports from the page).
2. Add keys to **all four** catalogs (`en.json`, `pt-BR.json`, `es-MX.json`, `fr-CA.json`) in the same edit; use ICU placeholders for counts (`{count}`, `{unit}`).
3. For shared libs under `libs/common`, accept labels via options (e.g. `formatDuration(..., {labels})`) and wrap with an app-level hook (`use-format-duration.ts`) rather than importing next-intl in the lib.
4. Sync dayjs with the locale via `DayjsLocaleSync` (add `dayjs/locale/<x>` import and mapping when adding a locale, e.g. `'fr-CA': 'fr-ca'`).
5. Add `ampm={false}` to every MUI X `DateTimePicker`.
6. Use MUI X locale packs for DataGrid chrome ("Rows per page"), and make sure the locale types come from the same copy of `@mui/x-data-grid` as `DataGridPro` (see build failure #1).
7. Adding a locale touches: `messages/<locale>.json`, `i18n/request.ts` (`SUPPORTED_LOCALES`, `MESSAGES`), `components/locale-switcher.tsx` (`LOCALES`), `components/dayjs-locale-sync.tsx`, DataGrid locale pack mapping.

### Local dev checklist
- Start from the exact env block above; port **4200**; `ENV=preview`; `iam-stg` + preview client id; `WATCHPACK_POLLING=true` if the watcher misses changes.
- BFF locally on `:3000` with `OPENAI_API_KEY` in `.env.local` and `gcloud auth application-default login`; confirm its upstream (`MAAAS_URL`, default `http://localhost:8080`) is reachable or `organizations.get` returns 500 and the frontend shows a misleading 404.
- Check `.env.local` overrides `.env` before concluding which BFF you are hitting.
- Before building a Docker image run a type-check; the image build runs full `tsc` and each failed attempt costs ~5 minutes: `npx tsc --noEmit --project tsconfig.json 2>&1 | head -40` from `apps/route-planner-v2`.

### Cloud Run deploy runbook (shape; secrets redacted)
1. `gcloud auth configure-docker us-central1-docker.pkg.dev`
2. `TAG=$(git rev-parse --short HEAD)`; `IMAGE=us-central1-docker.pkg.dev/[GCP_PROJECT]/route-planner-v2/route-planner-v2-staging:$TAG`
3. `docker build --platform linux/amd64 -f apps/route-planner-v2/Dockerfile.staging --build-arg NEXT_PUBLIC_ENV=test --build-arg NEXT_PUBLIC_BFF_HOST=<bff cloud run url> --build-arg NEXT_PUBLIC_IAM_HOST=https://iam-stg.nextbillion.ai --build-arg NEXT_PUBLIC_IAM_CLIENT_ID=<deployed client id> -t "$IMAGE" .` (run from monorepo root; `NEXT_PUBLIC_*` are baked at build time).
4. `docker push "$IMAGE"`
5. `cd apps/route-planner-v2/infra/terraform && terraform apply -var="image_tag=$TAG"`
6. Verify: `gcloud run services describe route-planner-v2-staging --region=us-central1 --format=json | jq '.spec.template.spec.containers[0].env'`; `gcloud run services logs read route-planner-v2-staging --region=us-central1 --limit=30`; `curl -sS -i ".../route-planner/dev-login?next=/" | head -10` expecting `307 location: /` + `set-cookie`; `curl -sS -o /dev/null -w "%{http_code}\n" ".../route-planner/_next/static/chunks/<file>.js"` expecting 200 (needs the cookie because middleware redirects unauthenticated requests, including static `images/*`, to `/dev-login`).
7. BFF changes: build/push the BFF image to `.../bff/bff-staging`, `terraform apply` from `bff/infra/terraform`; any env var set by hand with `gcloud run services update` **will be wiped by the next `terraform apply`** unless it is declared in `cloud_run.tf`.

### Demo-token / secret rotation (as it appears in the 2026-06-30 paste)
```
echo -n '<NEW_JWT>' | gcloud secrets versions add DEMO_NCC_TOKEN --project=[GCP_PROJECT] --data-file=-
gcloud run services update <service> ...   # force a new revision so the :latest secret ref is re-read
```
(The terraform secret is named `route-planner-v2-staging-demo-ncc-tok` in the deployed service; `-n` on echo avoids a trailing newline corrupting the JWT. `latest` secret references bind at revision start, so redeploy/update the service after adding the version.)

### Debug-first habits that paid off
- Print build-stamped module-load logs (`BUILD-<date>-<letter>`) to know which bundle the browser is running.
- For every "nothing happens" report on the map: log the data count at each stage (state, derived structure, layer list) and compare with what's visible.
- When a user pastes a long error, find the *first* error line (`⨯ Response { status: 500 ... url: ... }`) — later `TypeError` lines are usually downstream.
- Look at the actual deployed artifact (`docker run --rm "$IMG" ...`, `gcloud run services describe ... --format=json | jq`) before theorizing about build config.
- Ask the user for the exact start command and env when behavior differs between machines ("yarn next dev -p 4200 (this is the command from my dev terminal at start)").

### Appendix 2 (full-length user messages: continuation summaries and long pastes)

- **Coordinate conventions cheat-sheet** (carry into every NB integration): internal store `"lng,lat"`; NB clustering/DM/discover/optimisation location strings `"lat,lng"`; GeoJSON `[lng,lat]`; v3 `step.location` `[lat,lng]`; polyline decode order = whatever order was encoded. Convert at a single boundary helper (`lngLatToLatLng`) and write the convention in the helper's name.
- **Don't shadow globals with component imports**: never `import Map from 'react-map-gl'` and then call `new Map()` in the same file; use `Record<string, T>` or alias the import (`import MapGL from ...`).
- **Prefer `??` over `||` for indices/counts**; zero is a valid value.
- **Read the real runtime value, not the type comment**: confirm via a sibling consumer.
- **Before patching a function/flow, grep all call paths** (debug dialog vs production auto-apply; JobFilterBar vs VehicleFilterBar; legacy vs v3 toolbar).
- **Persist filter inputs wherever filter results live** (Redux vs local state mismatch causes disappearing chips).
- **Keep shared libs i18n-free**: wrap/compose in the app (`LocalizedInputTooltip`), add translation keys to ALL locale files at once (en, pt-BR, es-MX, fr-CA, pl-PL), and keep ICU plural forms complete for Polish.
- **New locale checklist**: `i18n/request.ts` (SUPPORTED_LOCALES + MESSAGES), `locale-switcher.tsx` LOCALES, `dayjs-locale-sync.tsx` (import `dayjs/locale/<x>` + map), any other local DAYJS_LOCALE map (job-filter-bar), DataGrid locale map in `solution-redierct.tsx`, `locales.<code>` label entry in every messages file, new `messages/<code>.json`.
- **basePath rules**: browser `fetch` must include `ROUTE_PLANNER_BASE_PATH`; sanitise `?next=` to stay under basePath.
- **Cell-level styling for virtualised tables** (`TableVirtuoso` has no row wrapper); view-order arrays instead of mutating data when sorting/highlighting.
- **Debounce + isolate typing inputs**: local state in a small component, debounced store update, `React.memo` on heavy list items.
- **Auth for BFF calls**: every BFF request from the browser needs `Authorization: Bearer <ncc_token>` (cookie `ncc_token`); `apiKey` query param is not enough.
- **Direct NB calls** go to `https://api.nextbillion.io` (BFF `vrj` product is also forced there); staging BFF is only for authenticated app calls.
- **Verify library exports at runtime** with a one-line `node -e` instead of assuming (e.g., `plPL`).
- **Diagnostic logging protocol**: add targeted `console.log` with counts at each stage, ask the user to paste, then remove; for payload issues ask for the response body first and compare with a direct API call.
- **Deploy hygiene**: build with `--platform linux/amd64` on Apple Silicon; pass `NEXT_PUBLIC_*` as build args; tag images with `$TAG`; prefer Terraform path to avoid drift; confirm before mutating shared Cloud Run services; use `gcloud logging read` polling when `logging tail` lacks gRPC.
- **When the user says rollback, restore exactly the previous gating** (zone label hide at zoom 13) rather than inventing a new variant.
- **Single clear ask per turn: finish and stop.** Summaries repeatedly record "last task concluded, wait for user"; do not start tangential work after a summary.

### Appendix 3 (full-length user messages: continuation summaries and long pastes)

- Always include the `/route-planner` basePath when giving the user local or deployed URLs (`/route-planner/dev-login`, `/route-planner/territory-planner`, `/route-planner/solutions/FEMSA1`).
- For a typecheck request, use `npx tsc --noEmit -p apps/route-planner-v2/tsconfig.json`; do not rely on background `nx typecheck`/`nx lint`/`show-project` (hang or "killed"). If nx is needed: `yarn nx reset` and `NX_DAEMON=false yarn nx ...`. Do not kill a shared nx daemon (Cursor `nxls`) without asking.
- Rematch effect results are typed `unknown`: cast `as unknown as {...}` at the call site (precedent `clustering-panel.tsx:97`).
- When changing preferences, update all four places: `PreferencesInput` type + `initialState`, `SavedStateSnapshot` Pick, the dirty-state snapshot in `app/(input)/index-client.tsx`, and the API payload builder in `input-preview-page.tsx`; add i18n keys to all 5 locale files and validate JSON parse.
- New user-visible strings go into all of `en`, `es-MX`, `fr-CA`, `pl-PL`, `pt-BR` messages (translations were requested explicitly, e.g. "translate" + screenshot, and territory menu "translated to all languages"). Localize date-time controls by locale (MUI X AdapterDayjs locale map) rather than hardcoding formats.
- Defend at both the API layer and the pure function when a BFF may return 200 with an error-shaped body: validate the expected field (`Array.isArray(body.routes)`) and throw the server message; optional-chain and fall back in the consumer.
- Secret rotation: always read `secrets.tf` for the Terraform secret name (`${service_name}-${lower(replace(name,"_","-"))}`), verify JWT `iss`/`aud`/`exp` against the deployed `IAM_HOST`/`IAM_CLIENT_ID` before pushing, push with `echo -n`, then force a new Cloud Run revision with `--update-labels=demo-token-refresh=$(date +%s)`, then clear the `ncc_token` cookie. The user must run commands containing real tokens in their own shell; do not store tokens in files that get committed (note the plaintext dev credential found in `apps/route-planner-v2/.env`).
- Before irreversible git operations (re-init, replacing origin, push), ask via AskUserQuestion, keep a reversible backup (`mv .git .git.backup-<timestamp>`), and add the backup to `.gitignore` before `git add .`; inspect the staged list (file count, no `node_modules`/`.next`/`dist`) before committing; push only after explicit "push it".
- For one-off data transformations (CSV mutation, xlsx column additions, fixture enrichment) use a script (Python `csv` module, not awk; idempotent checks like "skip if description already contains `|`") and keep the output under `apps/route-planner-v2/public/data/`.
- Large datasets: virtualized `DataGridPro` handled 6,500 rows; beyond roughly 200k POS the Node heap dies. Offer deterministic stride sampling in the UI and size Cloud Run at 2Gi/2 CPU/900s with `cpu_idle=false` and `startup_cpu_boost=true` for WASM LP workloads.
- Keep UI state shape stable when changing UI semantics (zone filter by day kept `selectedZoneIds` storage), so downstream consumers need no change.
- When two plausible causes exist and cannot be resolved without the user's data, add a visible diagnostic (toast, log with build marker) instead of guessing, and state exactly what the user must do to discriminate (re-save preference, then re-import).
- Lift state above phase transitions when the user expects filters/selection to survive going back (`previewState`), and avoid circular imports by moving shared types/defaults into a neutral module (`settings.ts`).
- Treat index conventions explicitly: document which array (raw `route.steps`, post-`skipLeadingRest`, display-filtered) an index refers to before wiring hover/selection between list and map.
- Time handling: server anchors at UTC; render server-anchored clock times with `timeZone: 'UTC'` and `hour12: false`; when deriving day-of-week use `dayjs.unix(arrival).tz(tz).day() + 1` (Sunday=1).
- Do not mark a task done on typecheck alone for visual behavior; the summaries repeatedly end with "awaiting user confirmation in the browser" after tsc passes.
