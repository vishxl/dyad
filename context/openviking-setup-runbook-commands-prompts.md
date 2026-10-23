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

## `ov compile` scope

Used exactly once in the whole flow: memory consolidation (step 6). Policy, skill, and corpus writes are raw HTTP/CLI operations, never compilation.
