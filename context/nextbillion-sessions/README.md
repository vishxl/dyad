# NextBillion.ai engineering sessions — knowledge corpus

Distilled from the raw session exports in `/Users/vishal/Downloads/NextBillion/Context_Layer/`
(10 Claude Code transcripts + 10 chat exports + 102 support tickets, ~133MB raw).
All extraction and distillation performed by Sonnet agents on 2026-10-26; secret-scanned
(docker image digests and file paths only; real tokens redacted as `[REDACTED-*]`).

## Layout

### `digests/` — curated synthesis layer (1.79MB, 10 files)

Thematic distillations: analyst notes + verbatim errors/fixes + annotated dialogue.
Read these first; they are the retrieval-optimized layer.

| File | Size | What it covers |
| --- | --- | --- |
| `cc-route-planner-monorepo.md` | 467K | Route Planner v2 monorepo: nx/Next/BFF architecture, builds, coordinate-order rules, MapLibre/deck.gl, Cloud Run sizing, token rotation |
| `cc-gcp-cloud-run-deploy.md` | 310K | Territory planner: Terraform + Cloud Run (memory/CPU/timeout limits, env-var wiping, 413 uploads, NDJSON streaming) |
| `cc-mock-datasets-postoffice-uk.md` | 302K | Synthetic dataset workspace: 8 client projects, CSV schemas, geojson constraints, Orbis geocode quirks, optimization-v2 params |
| `cc-nb-routing-playground.md` | 175K | Next.js playground: markers, reverse geocoding, dependency conflicts, env setup |
| `chat-transcripts-distilled.md` | 150K | 10 user-assistant conversations near-verbatim: route optimization, FedEx dropbox, waste-collection routing |
| `cc-nbai-bookmarks-extension.md` | 107K | Chrome extension: vehicles/jobs/shipments CRUD, clustering API, packaging |
| `cc-eta-predictor-model.md` | 107K | ETA model: MdAPE/P90 interpretation, data harvesting, GCP deploy |
| `nb-support-tickets-distilled.md` | 74K | 102 support tickets thematically: truck_size order, units, avoid-vs-exclude, honor_restrictions, map-data rebuilds |
| `cc-truck-routing-hos-app.md` | 67K | HOS API pitfalls: nesting, time_elapsed minimums, stop formats |
| `cc-isochrone-and-geocode-demo.md` | 30K | Isochrone deploy, GEOCODE_DEMO local run, repo workflow |

### `transcripts/` — full record layer (21.3MB, 17 files)

Chronological verbatim transcripts (USER/CLAUDE with timestamps, tool commands kept).
Nothing dropped except system noise and tool outputs. These are the archival record —
search here when a digest lacks the exact detail.

## Ingest plan (OpenViking)

Namespace: `viking://resources/nextbillion-sessions/` (additive; existing
`nextbillion-app-kb`, `nextbillion-docs`, `nextbillion-policy` untouched).

- `digests/*` → `viking://resources/nextbillion-sessions/<name>`
- `transcripts/*` → `viking://resources/nextbillion-sessions/transcripts/<name>`
- Then vikingbot learning passes + `openviking compile --skill memory` consolidation.
- Runbook: `../openviking-setup-runbook-commands-prompts.md` (to be updated after ingest).