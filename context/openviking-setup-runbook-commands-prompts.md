# OpenViking fresh-install runbook — NextBillion context layer

Recreates the full context layer on a fresh OpenViking install. All state goes through OpenViking's own CLI/API — nothing is hand-written into its storage. CLI (`openviking`) and raw HTTP both work; each step shows one.

## 1. Install + start

```
uv tool install openviking
ov serve          # dev mode, no auth, http://127.0.0.1:1933
```

`~/.openviking/ov.conf` (chmod 600, outside the repo) — embedding + VLM via OpenRouter:

```json
{
  "service_name": "openviking-server",
  "server": { "auth_mode": "dev" },
  "storage": { "workspace": "./data", "vectordb": {"name": "context", "backend": "local"}, "agfs": {"backend": "local"} },
  "embedding": { "dense": { "provider": "openai", "api_base": "https://openrouter.ai/api/v1", "api_key": "<OPENROUTER_KEY>", "dimension": 1536, "model": "openai/text-embedding-3-small" } },
  "vlm": { "provider": "openai", "api_base": "https://openrouter.ai/api/v1", "api_key": "<OPENROUTER_KEY>", "model": "google/gemini-2.5-flash" }
}
```

Point the CLI at the server:

```
openviking config add custom --name local --url http://127.0.0.1:1933 --activate
openviking language en
openviking health
```

## 2. Source files

| File | Role |
| --- | --- |
| `context/nextbillion-docs/` | official docs corpus (282 md) |
| `context/nextbillion-app-kb-source.md` | emergent chat-export KB (~31k lines, 22 reference apps) |
| `context/nextbillion-distilled-index.md` | distilled API index — endpoint-path truth |
| `context/nextbillion-policy.md` | generator policy, read by URI every message |
| `context/nextbillion-map-skill.md` | map-rendering skill body |

## 3. Ingest docs corpus

```
scripts/openviking-ingest.sh context/nextbillion-docs viking://resources/nextbillion-docs
```

Zips the dir → `POST /api/v1/resources/temp_upload` → `POST /api/v1/resources {temp_file_id, to, wait:true, timeout:1800}`. `contexts: 0` on a re-run means already ingested (no-op).

## 4. Ingest the app KB

```
openviking add-resource context/nextbillion-app-kb-source.md \
  --to viking://resources/nextbillion-app-kb \
  --tags 'domain=nextbillion,type=knowledge-base' --wait --timeout 600
```

## 5. Memory extraction

`openviking chat` sends a prompt to OpenViking's own agent directing it to read `viking://resources/nextbillion-app-kb` and store durable facts as memories (domain model, app archetypes, integration lessons, UI conventions). The agent lists subdirectories with its own ls/tree tool and reads relevant files. If a pass stores nothing, repeat with more explicit "extract and store" wording, or point it at specific KB sections (purpose/scope, executive domain model, reusable archetypes, common failures/durable lessons).

## 6. Consolidate memories — the only `ov compile` step

```
openviking compile --to 'viking://user/default/memories' --skill memory
openviking compile --to 'viking://user/default/memories/entities' --skill memory
```

Produces `viking://user/default/memories/entities/application_builder_knowledge_base/nextbillion.ai.md`. Gotcha: compile finds 0 items if the memory-type dirs don't exist yet — create memories first (steps 5/7), then compile.

## 7. Durable rules via add-memory

Each rule is stored as a memory payload (`openviking add-memory '{"role":"user","content":"..."}'`), in this order:

1. **Nitro handler placement** — client-facing API handlers go in `server/api/`; `server/routes/` mounts at root path in standalone nitro, causing `/api/x` 404s even when handlers exist. Never duplicate handlers in both trees. Restart dev server after handler changes.
2. **MapLibre worker** — any Vite app importing maplibre-gl must set `optimizeDeps: { exclude: ["maplibre-gl"] }` in `vite.config.ts`; otherwise Vite rewrites the worker URL and the map fails with `Worker failed to load`.
3. **API key UX** — masked input (type=password), explicit Save button + Enter-to-save, localStorage persistence under one app-constant key with try/catch, key sent per-request as `x-nb-key` header through the app's own server handler, never in URLs/logs/displayed back.
4. **Endpoint paths from the API reference, never guessed** — there is no `/places`; nearby POI search is `GET /discover?q=&at={lat},{lng}`. Reverse geocoding is `GET /revgeocode?at={lat},{lng}` (param is `at`, not `center`). Invented paths cause a misleading upstream 404.
5. **Import depth on handler relocation** — moving files between `server/routes/**` and `server/api/**` changes the relative import depth to server/lib (`../lib/nb` vs `../../lib/nb`). A stale depth fails at runtime with `Failed to load url ../../lib/nb` → 500 on every call.
6. **MapLibre style absolutization** — sprite and glyphs must be absolute URLs; a proxied style with relative paths fails validation with `Invalid sprite URL, must be absolute`. Fix: fetch the style JSON, absolutize sprite and glyphs against `window.location.origin`, pass the style object to the constructor. A bare `.../sprite` 404 is expected — MapLibre appends `.json`/`.png` itself.
7. **Absolutize with string concat, never `new URL(url, origin).href`** — the URL constructor percent-encodes the `{fontstack}`/`{range}` template braces in the glyphs URL, and MapLibre rejects the style with `"glyphs" url must include a "{fontstack}" token`.

## 8. Write the policy doc

```
openviking write 'viking://resources/nextbillion-policy/index.md' \
  --from-file context/nextbillion-policy.md --wait
```

HTTP equivalent: `POST /api/v1/content/write {uri, content, wait:true}` — body keys are `uri` + `content` (a `to`-shaped body 400s). Response must show `semantic_status: complete`.

## 9. Register the map skill

Skill body lives in `context/nextbillion-map-skill.md` (SKILL.md format: frontmatter `name` + `description`, then rules).

```
POST /api/v1/skills {"data": "<skill md>", "wait": true, "timeout": 600}
```

Creates `viking://user/default/skills/nextbillion-map/SKILL.md`. Note: skills live outside resource URIs, so plain `search/find` never returns them — Dyad queries `/api/v1/skills/find` separately and merges those hits first.

## 10. Verify (all must return ok)

```
curl -s "http://127.0.0.1:1933/api/v1/content/read?uri=viking%3A%2F%2Fresources%2Fnextbillion-policy%2Findex.md&raw=true"
curl -s -X POST http://127.0.0.1:1933/api/v1/search/find -H 'Content-Type: application/json' \
  -d '{"query":"nextbillion geocoding","limit":1}'          # resources hit under nextbillion-docs
curl -s -X POST http://127.0.0.1:1933/api/v1/skills/find -H 'Content-Type: application/json' \
  -d '{"query":"show a dark map with markers and routes","limit":3}'   # must surface nextbillion-map
openviking read 'viking://user/default/memories/entities/application_builder_knowledge_base/nextbillion.ai.md'
```

## 11. App-side wiring (repo, not OpenViking)

- `src/prompts/context_packs/registry.ts`: pack entry `{name, policyUri, vikingUri}`.
- `src/prompts/context_packs/openviking.ts`: policy = read-by-URI each message; retrieval = `POST /api/v1/search/find` (target_uri nextbillion-docs) plus `POST /api/v1/skills/find` merged first in the hit list. Fail-open everywhere.
- `src/ipc/handlers/chat_stream_handlers.ts`: appends `packBlocks.policy + packBlocks.retrieval` to systemPrompt (main + plan-mode paths).

## 12. Session-corpus ingest (engineering-sessions layer, added 2026-10-26)

Additive layer built from `/Users/vishal/Downloads/NextBillion/Context_Layer/`
(10 redacted Claude Code transcripts, 10 chat exports, 102 support tickets).
Saved locally in `context/nextbillion-sessions/` — `digests/` (10 curated synthesis
files) + `transcripts/` (17 full-fidelity verbatim transcripts) + `README.md`.
Secret-scanned before save; real tokens replaced with `[REDACTED-*]`.

```
openviking add-resource context/nextbillion-sessions/index.md \
  --to viking://resources/nextbillion-sessions \
  --tags 'domain=nextbillion,source=engineering-sessions,type=index' --wait --timeout 600

for f in context/nextbillion-sessions/digests/*.md; do
  name=$(basename "$f" .md | sed 's/^cc-//; s/^nb-//; s/-distilled$//')
  openviking add-resource "$f" --to "viking://resources/nextbillion-sessions/$name" \
    --tags 'domain=nextbillion,source=engineering-sessions,type=session-digest' \
    --wait --timeout 1800
done

for f in context/nextbillion-sessions/transcripts/*.md; do
  name=$(basename "$f" .md | sed 's/^cc-//')
  openviking add-resource "$f" --to "viking://resources/nextbillion-sessions/transcripts/$name" \
    --tags 'domain=nextbillion,source=engineering-sessions,type=transcript' &
done; wait
```

Gotchas learned the hard way:
- CLI `--wait` on large files times out client-side ("Request Timeout" box) while the
  server task still completes — verify with `openviking task list` / `ls` / `find`,
  never trust the CLI box. For the 17 transcripts, drop `--wait` and let the
  background queue run; check `task list` until 0 running / 0 errors.
- Existing namespaces (`nextbillion-app-kb`, `nextbillion-docs`, `nextbillion-policy`)
  are untouched — this layer is purely additive.

Verification (2026-10-26 run): 28 resources completed, 0 errors; targeted
`find` queries score 0.72–0.79.

## 13. Learning passes + model upgrade

Larger models for better learning — `~/.openviking/ov.conf`:

```json
"vlm":       { ..., "model": "google/gemini-2.5-pro" },
"embedding": { "dense": { ..., "model": "openai/text-embedding-3-large", "dimension": 3072 } }
```

Restart `ov serve` after editing. **Then reindex the new corpus** so its vectors
match the new query space:

```
openviking reindex 'viking://resources/nextbillion-sessions' --mode vectors_only --wait false
```

Learning passes (4 chat sessions asking the bot to read the corpus and extract
durable lessons, e.g. "read viking://resources/nextbillion-sessions and store the
durable engineering lessons as memories — coordinate rules, Cloud Run traps, truck
parameters, HOS, clustering, ETA metrics"):

```
openviking chat "read viking://resources/nextbillion-sessions/... and extract + store durable lessons as memories"
```

**Critical gotcha:** chat-session memory writes are staged in the session's
`memory_commit` dirs and do NOT reach `viking://user/default/memories` on their own.
Consolidation (`openviking compile --to viking://user/default/memories --skill memory`)
can fail with `MEMORY_CONSOLIDATION_FAILED ... parse_error` after 11 iterations —
per-type compiles (`--to .../entities`, `--to .../events`) may still add 0. When that
happens, the reliable durable channel is **direct `add-memory`**:

```
openviking add-memory '{"role":"user","content":"<lesson> (durable): ..."}'
```

The 2026-10-26 run stored all lessons this way; they land classified under
`memories/events/<yyyy>/<mm>/<dd>/` and `memories/preferences/user/` +
`memories/entities/application_builder_knowledge_base/`. Lesson families stored:
coordinate-order rules, optimization-v2 id conventions, truck_size order/units,
avoid-vs-exclude, honor_restrictions 422, HOS nesting/time minimums, clustering
polyline5 pre-pass, Cloud Run sizing/deploy traps/413-gzip, Terraform env-var
ownership + import, GCS SA permissions, token-rotation runbook, BFF auth pattern,
MapLibre/deck.gl pitfalls, Orbis geocoding quirks, ETA MdAPE/P90 + harvest dedupe,
support-ticket themes, OpenViking ingestion lessons themselves.

## 14. Verify the session layer

```
openviking ls 'viking://resources/nextbillion-sessions'
openviking task list                                          # 0 running, 0 errors
curl -s -X POST http://127.0.0.1:1933/api/v1/search/find -H 'Content-Type: application/json' \
  -d '{"query":"truck_size height width length order","limit":3}'   # docs + digest hits
openviking ls 'viking://user/default/memories/preferences/user'     # lesson files present
```

## `ov compile` scope

Used exactly once in the whole flow: memory consolidation (step 6). Policy, skill, and corpus writes are raw HTTP/CLI operations, never compilation.
