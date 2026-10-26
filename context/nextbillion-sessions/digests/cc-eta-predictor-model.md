# Claude Code session digest — Route-optimization duration (ETA) predictor: metrics, harvesting, bugs, GCP deployment
- Source: claude_code_redacted/e7495ec5-5c26-4b14-8244-870955e8c793*.jsonl · Dates: 2026-08-25 → 2026-08-31
- Purpose: durable engineering lessons for building NextBillion.ai-integrated apps.
- Context: Python package `predictor/` (workspace `~/workspace/openai_explain`, branch `main`) that harvests past NextBillion Route-Optimization (RO) requests from an internal portal into `data/requests.csv`, trains a gradient-boosted sklearn model with a P50 head and a P90 head to predict solve duration from the request profile (vehicles, jobs, shipments, relations, locations, matrix type, mode, engine), and exposes `python3 -m predictor predict --input <payload.json>`. A sibling `explain/` package wants an OpenAI-compatible LLM at `EXPLAIN_BASE_URL` (Ollama locally, Baseten support) and is a different deployment problem (left out of v1; if wanted later point it at Vertex AI or Baseten rather than putting a GPU behind Cloud Run). Portal client `explain/portal.py` talks to `sgpstg.nextbillion.io` with no auth headers; harvest region default `asia-southeast1` near the `api-auto-sgp` deployment.

---------------------------------------------------------------------------
## 1. Reading the predict output line
User: what does this mean in the output of a predict "Model MdAPE 12.5% on held-out later data; P90 covered 87% of it."
Assistant (no `MdAPE` string anywhere in the workspace → generic metrics line):
- **MdAPE 12.5%** — Median Absolute Percentage Error. Half the predictions land within 12.5% of the actual, half are worse. Median ⇒ robust to catastrophic misses, which also means it says nothing about the tail. Mean APE on the same set is almost always noticeably higher.
- **Held-out later data** — the split was by time, not random; model trained on an earlier period and scored on a period it never saw. A random split leaks future info through neighbouring rows and typically flatters the model.
- **P90 covered 87%** — the model emits an upper bound it claims contains the truth 90% of the time; on the holdout it contained 87% ⇒ mildly too narrow (slightly overconfident), not badly miscalibrated. Whether a 3-point gap is real depends on holdout size: standard error of a coverage estimate ≈ √(0.9·0.1/n) → need ~400+ held-out points before 87% is distinguishable from 90% at two standard errors. "If the P90 is a one-sided bound rather than the upper end of an 80% interval, the reading is the same — actuals fell under the bound 87% of the time instead of the advertised 90%."
- Two things the line doesn't tell you: (a) direction of error — MdAPE is symmetric, an under-predicting model scores the same as an unbiased noisy one; check median signed percentage error; (b) where the misses are — bucket APE by segment and look at the spread.

## 2. Harvest appends to the existing CSV
User: "when I harvest new data I want it to append to any existing CSV dataset that is present."
- `harvest(..., append=True)` default; if `--out` exists and is non-empty open in `"a"` mode and skip the header. `--overwrite` restores the old truncate behaviour. CLI reports `+N rows … now holds T` and the thin-dataset check now looks at the file total, not the run.
- Dedupe is the part that matters: the list API returns newest-first so a repeat harvest re-walks rows already on disk. Before appending, scan the existing file for `request_id`s and seed the `seen` set. Without it duplicates double-weight recent traffic and — because the train/test split is chronological — put siblings of test rows into training.
- Header guard: `DictWriter` emits values in `RAW_COLUMNS` order regardless of what the file says → appending under a different header would silently file every value under the wrong column; mismatch now raises.
- Trailing-newline check: an interrupted run can leave the file without a final newline, which would splice the next row onto the last line.
- Summary gained `appended`, `existing_rows`, `total_rows`, `duplicates`, `file_oldest`/`file_newest` (whole dataset) alongside `oldest`/`newest` (this run).
- Knock-on: the stratum (rare-segment top-up) budget is 10% of THIS run's main pull, so an incremental append of 500 rows tops up almost nothing — correct, but the "skipping rare-segment top-up" and "thin stratum" messages would have fired on every routine append → both made append-aware.
- Usage note: "`--limit` bounds how far back the API walk goes, not how many rows get added. Run `harvest --limit 100000` weekly and each run keeps only what's new — the dataset reaches back further than any single pull can. If more than `--limit` rows accumulate between runs you'll silently miss the gap, so size it against your traffic rate." 7 new tests in `tests/test_portal.py` (append, dedupe, single-header, overwrite, header mismatch, truncated final line, span reporting); 170 tests passed; `PREDICTOR.md` documents it.
- Row counting: user "how many rows are in the data/requests.csv file" → 68,556 data rows by CSV parse vs 61,758 from `wc -l` because some fields contain embedded newlines (later 69,183, 69,928 … rows as the file grew from other appends).

## 3. Bug: "haversine distance is 0km"
User pasted:
```
❯ python3 -m predictor predict --input json-1787680134473.json
Parsed from json-1787680134473.json
  jobs 1984, shipments 0, vehicles 19, relations 0
  locations 0
  total pairwise haversine 0 km
  flexible routing: False
Profile
  19 vehicles, 1984 jobs, 0 shipments, 0 locations
  matrix dm/fast (derived from the profile), v2, mode on-duty, engine nbro
  total pairwise haversine distance: 0 km (gate at 6,000 km)
```
"in this output it says haversine distance is 0km. Why?"
- `locations 0` and `0 km` were the same failure. The payload had `locations.location` as a JSON ARRAY (`"locations": {"id": 1, "location": ["42.430101,-83.156899", "42.424594,-83.158837", ...]}`) but `parse_coords()` (`predictor/matrix_rule.py:120`) was written for the portal's `"lat,lon|lat,lon|..."` STRING form. `str(text).split("|")` on a list stringified the whole list into one chunk with no `|`; splitting on `,` gave `"['42.430101"` as first field; `float()` raised and `except ValueError: continue` swallowed it → zero coordinates from 1,985 real ones, no error. `profile._locations()` had a branch for a bare top-level list but the wrapped `{"id":..., "location":[...]}` form went straight to `parse_coords()` without the shape check.
- Fix in two places: `parse_coords()` joins a list/tuple with `|` before parsing (no caller can hit the stringify trap); `profile._locations()` routes wrapped and bare forms through one `_coords_from()` handling `"lat,lon"` strings, `{lat,lng}` objects, and `[lat,lon]` pairs. After: `locations 1985`, `total pairwise haversine 2,871,997 km`. Three regression tests (array-of-strings, array/string equivalence, object and pair forms) in `tests/test_predictor.py` → 173 passed.
- Impact analysis: predicted duration unchanged (P50 461.7 s / P90 526.3 s) because `locations_count` is a model feature but 0 and 1985 fell in the same tree leaf at 19 vehicles/1984 jobs — "luck, not robustness": at 100 locations the same request predicts 124.8 s, at 8000 it predicts 1,251.4 s. `matrix dm/fast` was correct before and after because the 6,000 km distance gate applies only when routing is FLEXIBLE (`predict_mdm` in `matrix_rule.py`), and this payload isn't; size threshold decided it (1985 < 5000 → dm). "Had this request set any flexible-routing option, the broken parse would have shown 0 km against a 6,000 km gate and chosen `dm` where the real 2.87M km spread forces `mdm` — the ~92x error the gate exists to prevent."

## 4. GCP deployment design (user question and decision)
User: "how should I approach deployment of this stack to GCP? I want to be able to query the model through an API endpoint and have someone who is 'admin' to be able to harvest new solutions and train the model."
Assistant recommendation (stack is small — 3.9 MB model, 12 MB CSV, 17 s training — so the problems are about BOUNDARIES):
- One image, two deployables, IAM as the role system. Predict = Cloud Run SERVICE with `--no-allow-unauthenticated`, callers need `roles/run.invoker` on the service. Harvest+train = Cloud Run JOB, same image, `run.jobs.run` (in `roles/run.invoker`) on the job. "Your 'admin' is then a Google group with invoker on the job" — no role table, no session handling; trigger with `gcloud run jobs execute predictor-train` or Cloud Scheduler nightly cron. Same image matters because the model is a `pickle` of a custom `Predictor` holding sklearn estimators: unpickling needs the `predictor` module importable and a compatible sklearn (Python 3.14.7 / sklearn 1.9.0) — version skew between trainer and server is a silent ugly failure.
- State in GCS: `gs://<bucket>/data/requests.csv` and `gs://<bucket>/models/predictor.pkl`, object versioning ON (rollback of both).
- The one real hazard is the append logic: it reads the whole CSV to seed dedupe, then appends → on GCS that is download → append → re-upload; two overlapping harvests silently lose one run's rows. Upload with `if_generation_match=<generation you read>` "so a concurrent writer fails loudly rather than clobbering".
- Roll the model out as a Cloud Run revision: job writes the pkl to GCS, service updated with the object generation as env var `MODEL_GENERATION=...`, loads from GCS at cold start (traffic splitting, instant rollback, audit trail of which model served when). Predict service gets a READ-ONLY SA on the bucket ("Unpickling executes arbitrary code, so the thing exposed to callers should not be able to write what it later loads").
- HTTP layer to add (factor `cmd_predict`, `predictor/cli.py:152`, into a function the CLI and a FastAPI app both call): `POST /predict` (same input.json shape `load_input` parses), `GET /model` (serve `predictor.meta`: `metrics`, `train_period`, `bands`, `segments`, fitted `matrix_rule`), `GET /healthz`. Return the model's MdAPE and P90 coverage in the predict response.
- Three things that bite: (1) portal reachability — if `sgpstg.nextbillion.io` is VPN-only the job needs Direct VPC egress (turns a one-day deploy into a one-week one; check first); (2) `explain/` is a different problem; (3) CSV-in-GCS ceiling ~1M rows, then BigQuery with harvest as a `MERGE` on `request_id`. Outcome later: cloud harvest pulled ~36k new rows ⇒ the portal IS reachable from Cloud Run, no VPC egress needed.
User: "yup build it out" → built `predictor/service.py` (shared prediction core; the `matrix_type` derivation — deduped location count, haversine gate only for flexible routing, explicit override wins — is subtle and duplicating it in a web handler would mean two implementations drifting while both still return plausible numbers; `TestApiAgreesWithCli` asserts agreement), `predictor/storage.py` (`gs://` anywhere a path is accepted, every write conditional on the generation read; loser gets `ConcurrentWrite`), `serving/app.py` (FastAPI: `POST /predict` posts the RO payload directly or just counts, `GET /model`, `/healthz`, `/readyz`, generated `/docs`; every response carries MdAPE, P90 coverage, and substituted assumptions), `Dockerfile` + `entrypoint.sh` (roles `serve`/`harvest`/`train`/`refresh`/`evaluate`), `deploy/deploy.sh` (`bootstrap`, `build`, `deploy`, `seed`, `refresh`, `promote`, `schedule`, `grant-admin`, `grant-caller`, `url`, `call`), `DEPLOY.md`, 28 new tests (201 total). `requirements.txt` pinned (model is a pickle: sklearn that unpickles must match the one that trained). Checked what installs on Python 3.14 before choosing the web framework.
- Real bug found by running the container: local storage "generation" as `mtime_ns` — on the container filesystem two writes in the same instant get byte-identical `st_mtime_ns` (confirmed by a direct test), so the precondition would silently pass, "the one thing it exists to prevent". Switched to a content hash; "That would not have shown up on macOS."
- `--locations 0` now means zero (old CLI used `args.locations or (jobs+shipments+vehicles)` so explicit 0 fell through; `profile_to_row` always used `is None`).
- Full round trip verified in the container: the job trained on 69,922 rows inside the container and the service served that exact artifact (42.7 s / 85.0 s, identical to CLI); suite passes in container, full-dependency venv, and bare `.venv` (17 graceful skips because fastapi/GCS not installed there).
- Resolved naming from `gcloud config get-value project` → bucket `gs://[GCP_PROJECT]-predictor`, image `asia-southeast1-docker.pkg.dev/[GCP_PROJECT]/predictor/predictor`, SAs `predictor-api@` and `predictor-job@`. `bootstrap` creates billable resources (Artifact Registry repo, versioned bucket, two SAs, enables five APIs) — confirmed with the user first; region is baked into bucket location so annoying to change later.
- User asked to copy `data/requests.csv` to the bucket for initial training: bucket already bootstrapped (`ASIA-SOUTHEAST1`, versioning on, empty). Verified header matches `RAW_COLUMNS`, uploaded, `gs://[GCP_PROJECT]-predictor/data/requests.csv` 69,928 rows, 13,370,552 bytes, generation 1787761340840896, MD5 `CwKSKSTvtaaLWV6wf3PrLg==` matched local; `GcsStore.generation()`/`readable()` verified against real GCS (previously only stubbed). Then skipped `seed` (would re-harvest deep): `./deploy/deploy.sh build`, `./deploy/deploy.sh deploy`, `gcloud run jobs execute predictor-job --region asia-southeast1 --wait --args train`, `./deploy/deploy.sh promote`. Warning: first time anything reaches `sgpstg.nextbillion.io` from GCP; if VPN-only the job fails on network errors (harvest prints `stopped early` and keeps what it got).

## 5. Auth/access problems on the service (exact errors and fixes)
- User: "Error: Forbidden / Your client does not have permission to get URL /docs from this server." Table of results: without token `/docs`, `/openapi.json`, `/readyz`, `/model` → 403; with an ID token → 200. The 403 is from Google's front end before the container; project Owner already gives `run.invoker` so curl with an ID token works; a browser can't attach one. Immediate unblock: `gcloud run services proxy predictor-api --region asia-southeast1 --port 8080` → open `http://localhost:8080/docs`.
- User: "I want /docs page to be accessible without the identity token". Cloud Run IAM is per-service all-or-nothing (no per-path rule). Options: (a) second docs-only PUBLIC service (recommended); (b) make the whole service public (anyone can call `/predict` and read `/model` which reports training row counts and error metrics); (c) load balancer with path rules + IAP. Built (a): same image, `DOCS_ONLY=1` + `--allow-unauthenticated`; the routes stay REGISTERED (FastAPI generates OpenAPI from registered routes, deleting `/predict` would publish a document describing nothing) and a middleware refuses to execute anything outside `/`, `/docs`, `/redoc`, `/openapi.json`; gate 404s everything else with a pointer to the real host; model never loaded; `predictor-docs@` SA gets NO bucket access (bootstrap creates it and deliberately adds no binding, with a comment). Verified from one image: docs-only `/docs` 200, `/openapi` 200, `/predict` 404, `/model` 404, `/readyz` 404, `/` 307 → `/docs`; normal mode `/docs`,`/model`,`/readyz` 200 and `POST /predict` 200. Container ran with `MODEL_URI=gs://nowhere/nope.pkl` (bucket it has no credentials for) and still served the schema — proof it never touches the model; `test_the_model_is_never_loaded` pins `_model is None`. 210 tests.
- User typo: `! /deploy/deploy.sh build` → "(eval):1: no such file or directory: /deploy/deploy.sh" — leading slash = absolute path; use `./deploy/deploy.sh build`.
- Deploy error on first `deploy-docs`:
`ERROR: (gcloud.run.deploy) [EMAIL] does not have permission to access namespaces instance [GCP_PROJECT] (or it may not exist): Permission 'iam.serviceaccounts.actAs' denied on service account [EMAIL] (or it may not exist). This command is authenticated as [EMAIL] which is the active account specified by the [core/account] property.`
  Cause: bootstrap predated adding `predictor-docs` to the loop, so the SA never existed; the immediate `NOT_FOUND` after creation was IAM propagation lag; if it persisted you'd need `roles/iam.serviceAccountUser`. Bootstrap loop updated.
- User: "what command via API to harvest new requests to add to the existing ones" → harvesting deliberately NOT on the API service (the admin/user split). Job config: args `['refresh']` + bucket URIs. `refresh` = harvest (append, skipping `request_id`s in the CSV) then retrain. Commands:
```
gcloud run jobs execute predictor-job --region asia-southeast1 --wait                      # refresh
gcloud run jobs execute predictor-job --region asia-southeast1 --wait --args harvest        # harvest only
gcloud run jobs execute predictor-job --region asia-southeast1 --wait --args harvest,--limit,200000
gcloud run jobs execute predictor-job --region asia-southeast1 --wait --args harvest,--org,eTruckBiz
gcloud run jobs execute predictor-job --region asia-southeast1 --wait --args train ; ./deploy/deploy.sh promote
./deploy/deploy.sh refresh   # wrapper that also points the service at the new model
```
  `--args` is comma-delimited, each token one element. Over HTTP: `curl -X POST -H "Authorization: Bearer $(gcloud auth print-access-token)" -H "Content-Type: application/json" -d '{}' "https://run.googleapis.com/v2/projects/[GCP_PROJECT]/locations/asia-southeast1/jobs/predictor-job:run"` — an OAuth ACCESS token (control plane), not the IDENTITY token the predict API takes.
- User: "for the /predict and /model API endpoints, can we relax the requirement to submit with bearer token?" → `gcloud run services add-iam-policy-binding predictor-api --region asia-southeast1 --member allUsers --role roles/run.invoker` (reversible with `remove-iam-policy-binding`). Audit: no customer data in payloads (no org codes, request ids, coordinates; `/predict` echoes only what the caller sent plus a duration). `/model` discloses training volumes (55,942 train / 13,986 test), error rates (MdAPE 13.3%, P90 coverage 92.6%), date range, per-segment breakdown (MDM = 0.16% of traffic with 313 s median vs 3.2 s for everything else); `/predict` reveals `api-auto-sgp` in `assumptions`. Bigger risk is compute: unmetered public `/predict` can drive `--max-instances 10` → drop to 2–3, Cloud Armor on a load balancer for rate limiting. Callers inside GCP should keep IAM (3 lines: `google.oauth2.id_token.fetch_id_token(req, "https://predictor-api-7j5cx7inrq-as.a.run.app")` and `Authorization: Bearer <tok>`); `./deploy/deploy.sh grant-caller <member>` grants per-caller invoker for users/groups too. Knock-ons: makes `predictor-docs` redundant; org policy `constraints/iam.allowedPolicyMemberDomains` (domain-restricted sharing) commonly forbids `allUsers` — a policy violation there is an org-admin decision.
- User: "update the docs so that the swagger examples can now be run without the bearer token" → two separate blockers: description was stale (said ID token required), and CORS (docs page on `predictor-docs` fetching `predictor-api` is cross-origin; browsers refuse to read it, surfacing as a vague network error not 401). `deploy-docs` now reads `predictor-api`'s actual IAM policy and sets `AUTH_MODE` (public → token language and `Authorization` header disappear from curl example) and sets `CORS_ORIGINS` on the API to the docs URL (allowlist of one origin, never `*`; other origins get no header). 218 tests. Note: `https://predictor-api-7j5cx7inrq-as.a.run.app/docs` already works same-origin so `predictor-docs` is now optional (`gcloud run services delete predictor-docs --region asia-southeast1`); two hosts serving one page drift.
- `deploy` pitfalls found while redeploying: `--set-env-vars` REPLACES the entire env block (would wipe `CORS_ORIGINS`, and after `set-apikeys` silently drop `HARVEST_INCLUDE_APIKEYS`) → switched service and job to `--update-env-vars`. `cmd_deploy` had `--no-allow-unauthenticated` hardcoded so the first run stripped the `allUsers` binding; and "immediately afterward the IAM policy showed no `allUsers` while unauthenticated requests still returned 200, because the revocation hadn't propagated to the edge yet" — a spot-check curl would have looked fine. `cmd_deploy` now reads the live policy and prints `keeping this service PUBLIC`. Verified after: API `/docs 200 /model 200 /readyz 200 /predict 200`, `access-control-allow-origin: <docs host>`, docs host no token language and `/predict` still 404.

## 6. Interpreting the metrics block (user pasted it)
```
"metrics": {"train_rows": 85222, "test_rows": 21306, "mdape": 0.1324, "mape_mean": 0.1661,
 "within_25pct": 0.7866, "p90_coverage": 0.914, "quantile_crossing_rate": 0.0011,
 "median_actual_ms": 3248, "median_predicted_ms": 3120, "baseline_mdape": 0.1258}
```
All computed on the TEST split only (chronologically later 21,306 rows, never fitted).
- `train_rows` 85,222 = earlier 80%; `test_rows` 21,306 held-out later rows.
- `mdape` 0.1324 — median |pred−actual|/actual; robust to outliers, silent on the tail. `mape_mean` 0.1661 — same ratio averaged; 3.4 points above MdAPE *is* the tail ("the gap between these two numbers is the useful signal, not either alone").
- `within_25pct` 0.7866 — share within ±25%; useful for quoting an SLA ("how often am I roughly right").
- `median_actual_ms` 3,248 vs `median_predicted_ms` 3,120 — exposes aggregate bias hidden by symmetric MdAPE: model ~3.9% low at the median, biased toward under-promising.
- `p90_coverage` 0.914 — fraction of test rows where actual ≤ predicted P90, target 0.90; 91.4% = slightly wide (conservative, the safe direction), closer than the previous 92.6%.
- `quantile_crossing_rate` 0.0011 — rows where the raw P90 head predicted BELOW the P50 head; heads are fitted independently so possible even with good aggregate coverage. `Predictor.predict()` clamps `p90 = max(p90, p50)` ("typical 8.7 s, slow 5.6 s is indefensible"); rate is reported rather than hidden because a high rate would mean the P90 head is undertrained; 0.11% fine.
- `baseline_mdape` 0.1258 — the portal's own estimator's MdAPE; HARDCODED constant (`predictor/train.py:194`), not recomputed per run → goes stale silently. The model's 13.24% is slightly WORSE than the 12.58% baseline (~half a point, ~5% relative) but the two answer different questions: the portal estimator is keyed on `request_id` so it can only score a request that already ran; this model predicts from the input profile BEFORE submission — "being within a point of a model that gets to see the request execute is the actual result." Offered: write these descriptions into `/model` as inline field descriptions.
- Row arithmetic: 85,222 + 21,306 = 106,528 (up from 69,928: cloud harvest pulled ~36k new rows).

## 7. Are all harvested rows used in training? (user: "for the training job, are all data points that were harvested used in the training process")
No: ~72% of harvested rows reach the trees. For the 106,528-row run:
| Stage | Rows |
| harvested into CSV | 106,528 |
| unparseable `started_at` dropped | −0 (silent) |
| chronological 80/20 split | 85,222 train / 21,306 never fitted (deliberate) |
| sklearn internal early-stopping holdout | −~8,522 (invisible) |
| actually fitted on | ~76,700 (~72%) |
- `_model()` sets `early_stopping=True, validation_fraction=0.1` (`predictor/train.py:109`): sklearn carves another 10% of whatever is passed to `fit()`; both heads have populated `validation_score_`. So `train_rows` = rows passed to `fit()`, not rows learned from. The inner split is RANDOM, not chronological — only decides when to stop (can't inflate MdAPE) but is tuned against rows interleaved with training rows (the near-duplicate adjacency the module docstring warns about). The P50 head ran to `n_iter_=400` (= `max_iter`) so never early-stopped and paid the 10% cost for nothing; P90 stopped at 126.
- Silent one: `chronological_split` drops rows whose `started_at` won't parse with no count (`dated = [(t, r) for t, r in dated if t is not None]`); zero today but if the portal changed timestamp format training would quietly shrink and the only symptom would be a `train_rows` number nobody watches.
- Upstream of all this: `harvest` only pulls `status:succeeded` (a failed request's duration measures how long it took to give up) and counts rows with missing timestamps as `skipped`. Cheap fixes offered: report what `chronological_split` dropped; raise `max_iter` or `early_stopping=False` for the P50 head.

## 8. API-key carve-out for harvest (user wording and design)
User: "when doing a harvest allow the API key [REDACTED_SECRET] to be considered. It is in the nbai org" (nbai is an excluded org with smoke traffic).
- Carve-out re-queries each excluded org and keeps only rows made with the named keys: without carve-out no `nbai` rows; with it only the 4 matching of 10 stub rows land; `main_rows + strata + apikey_rows == rows` accounting balances.
- Key stays out of source and argv: ENV VAR `HARVEST_INCLUDE_APIKEYS` only (argv shows in `ps`, shell history, and Cloud Run job's stored config in the console), backed by Secret Manager in Cloud Run; there is a test that fails if someone adds an `--apikey` flag. `apikey` is not in `RAW_COLUMNS` so it can't reach the CSV (and the CSV lives in a versioned bucket where a leak is permanent); tests assert absence from the file and summary dict and logs render only `0123...cdef`. Assistant had initially put the live key in a test fixture, caught it before finishing, replaced with a fake; advised ROTATING the key since it is in the transcript. Carve-out is uncapped (unlike the 10% stratum top-up); `--limit` bounds it in practice and the run reports counts per org.
- Locally: `HARVEST_INCLUDE_APIKEYS=<key> python3 -m predictor harvest`. In GCP: `./deploy/deploy.sh set-apikeys` (stores in Secret Manager, grants the job SA `secretAccessor`, mounts as `HARVEST_INCLUDE_APIKEYS`); the assistant deliberately did not run it so the key doesn't pass through another tool call.
- Error: `Created secret [predictor-harvest-apikeys]. Paste the API key(s), comma-separated, then press Ctrl-D: ERROR: (gcloud.secrets.versions.add) INVALID_ARGUMENT: Secret Payload cannot be empty.` Cause: Claude Code's `!` gives no TTY so `--data-file=-` saw EOF; secret created without a version; `set -e` aborted. Fix: script works interactive (`read -rsp`, no echo) or piped, strips trailing newline (verified no `0a` in hexdump), fails clearly on empty input. Recommended: real terminal, or `! ./deploy/deploy.sh set-apikeys < ~/key.txt && rm -P ~/key.txt`; avoid `printf %s 'KEY' | ...` (puts key back in argv/history). Verify with `gcloud run jobs describe predictor-job --region asia-southeast1 --format='value(spec.template.spec.template.spec.containers[0].env)'` — should show `HARVEST_INCLUDE_APIKEYS` as a secret reference. Next harvest reports `+N rows from nbai for key(s) d691...b0f6`.

## 9. Harvest job failed: exit code 2 (user pasted)
```
gcloud run jobs execute predictor-job --region asia-southeast1 --wait --args harvest
X Creating execution... Task predictor-job-cd5cm-task0 failed with exit code: 2 and message: The container exited with an error.
Executing job failed
ERROR: (gcloud.run.jobs.execute) The execution failed.
View details by running: gcloud run jobs executions describe predictor-job-cd5cm
```
- Exit code 2 = `ConcurrentWrite` in the CLI. Timeline: `predictor-job-2twws 13:35:51→14:06:53 succeeded`; `predictor-job-cd5cm 13:48:31→14:19:33 FAILED` — user's run started while `2twws` was still running; both read the same generation; the first finished and wrote; the second was refused. "Without that check it would have silently discarded ~30 minutes of 2twws's harvested rows." Dataset intact: 13.3 MB → 27.5 MB. Full `--limit 100000` harvest takes ~30 min at ~46 rows/s so overlap is easy. Check first: `gcloud run jobs executions list --job predictor-job --region asia-southeast1 --limit 3`. The carve-out had already found `+189 rows from nbai for key(s) d691...b0f6` before the write was refused.
- Defects the log exposed in assistant's own code: URI printed mangled as `gs:/nextbillion-...` (single slash) because `cmd_harvest` used `Path(args.out)` for display (`Path("gs://b/x")` collapses `//`), and `dest.exists()` is always False for remote objects so every cloud harvest printed "Harvesting up to…" while actually appending and suppressed the "rows already in the file are skipped" note → now asks the store. The assistant's `--parallelism 1` claim in `DEPLOY.md` was wrong: it bounds tasks within one execution, NOT concurrent executions of the job; docs corrected, error message now tells you to check for overlap. Two regression tests pin the `Path()` collapse (231 total). Redeploy: `./deploy/deploy.sh build && ./deploy/deploy.sh deploy`.

---

# APPENDIX — annotated dialogue (near-verbatim)
Everything above is the curated lesson digest. Everything below is the transcript prose kept with only noise removed (permission prompts, one-line "Let me check..." narration, interrupted requests, tool output dumps). Messages longer than 12000 chars are cut and marked. Redaction placeholders such as [GCP_PROJECT], [EMAIL] and [REDACTED_SECRET] are from the source. Read USER blocks as the requirement, CLAUDE blocks as what was tried and the fix.

## Session e7495ec5

### 2026-08-25T18:47 USER

what does this mean in the output of a predict "Model MdAPE 12.5% on held-out later data; P90 covered 87% of it."

### 2026-08-25T18:47 CLAUDE

No hits for `MdAPE` anywhere in your workspace, so this is a generic metrics line rather than something I can trace to code. Reading it as written:

**MdAPE 12.5%** — Median Absolute Percentage Error. Half the predictions landed within 12.5% of the actual value, half were worse. It's the *median*, so it's robust to a few catastrophic misses — which also means it tells you nothing about the tail. Mean APE on the same set is almost always noticeably higher.

**Held-out later data** — the split was by time, not random. The model was trained on an earlier period and scored on a period it never saw. That's the honest test for anything forecasting-shaped: a random split leaks future information through neighboring rows, and typically flatters the model.

**P90 covered 87% of it** — the model emits an interval (or an upper bound) it claims will contain the truth 90% of the time. On the holdout it actually contained 87%. So the uncertainty estimates are mildly too narrow — the model is slightly overconfident, not badly miscalibrated.

Whether that 3-point gap is real or noise depends on holdout size. Standard error on a coverage estimate is roughly √(0.9·0.1/n): you need ~400+ held-out points before 87% is distinguishable from 90% at two standard errors. Below that, it's consistent with a well-calibrated model.

Two things the line doesn't tell you, worth knowing before you trust it:

- **Direction of error.** MdAPE is symmetric in absolute value, so a model that systematically under-predicts by 12% scores identically to one that's unbiased but noisy. Check median signed percentage error alongside it.
- **Where the misses are.** MdAPE aggregates over the whole holdout. If error is concentrated in high-value or low-volume segments, the headline number hides it. Bucket the APE by whatever segment matters and look at the spread.

If the P90 is a one-sided bound rather than the upper end of an 80% interval, the reading is the same — actuals fell under the bound 87% of the time instead of the advertised 90%.

### 2026-08-25T18:53 USER

when I harvest new data I want it to append to any existing CSV dataset that is present.

### 2026-08-25T18:58 CLAUDE

Done — `harvest` now appends by default.

**What changed**

`predictor/harvest.py`
- `harvest(..., append=True)`. If `--out` already exists and is non-empty, it opens in `"a"` mode and skips the header write.
- Before appending, it scans the existing file for `request_id`s and seeds the `seen` set with them. This is the part that actually matters: the list API returns newest-first, so a repeat harvest re-walks rows already on disk. Without the dedupe you'd write them twice, and since the train/test split is chronological, duplicated recent rows would both double-weight recent traffic and put siblings of test rows into training.
- Header guard: `DictWriter` emits values in `RAW_COLUMNS` order regardless of what the file says, so appending under a different header would file every value under the wrong column. Mismatch now raises rather than silently corrupting.
- Trailing-newline check — an interrupted run can leave the file without one, which would splice the next row onto the last line.
- Summary gained `appended`, `existing_rows`, `total_rows`, `duplicates`, and `file_oldest`/`file_newest` (whole dataset) alongside `oldest`/`newest` (this run only).

`predictor/cli.py` — added `--overwrite` for the old truncate behaviour, reports `+N rows … now holds T`, and the thin-dataset check now looks at the file total rather than the run.

**Two knock-on adjustments you should know about.** The stratum budget is 10% of *this run's* main pull, so an incremental append with 500 new rows tops up almost nothing — correct, since the file already holds earlier top-ups, but it means the "skipping rare-segment top-up" and "thin stratum" messages would have fired on every routine append. Both are now append-aware.

**Usage note:** `--limit` bounds how far back the API walk goes, not how many rows get added. Run `harvest --limit 100000` weekly and each run keeps only what's new — the dataset reaches back further than any single pull can. If more than `--limit` rows accumulate between runs you'll silently miss the gap, so size it against your traffic rate.

170 tests pass, including 7 new ones in `tests/test_portal.py` covering append, dedupe, single-header, overwrite, header mismatch, truncated final line, and span reporting. `PREDICTOR.md` documents the behaviour.

### 2026-08-26T13:01 USER

how many rows are in the data/requests.csv file

### 2026-08-26T13:01 CLAUDE

**68,556** data rows (plus the header).

Note that's higher than the 61,758 lines `wc -l` showed earlier in the session — a raw line count undercounts here because some fields contain embedded newlines. The number above is from an actual CSV parse, so it's the real row count.

### 2026-08-26T13:09 USER

in this output it says haversine distance is 0km. Why? 
❯ python3 -m predictor predict --input json-1787680134473.json
Parsed from json-1787680134473.json
  jobs 1984, shipments 0, vehicles 19, relations 0
  locations 0
  total pairwise haversine 0 km
  flexible routing: False

Profile
  19 vehicles, 1984 jobs, 0 shipments, 0 locations
  matrix dm/fast (derived from the profile), v2, mode on-duty, engine nbro
  total pairwise haversine distance: 0 km (gate at 6,000 km)

### 2026-08-26T13:10 CLAUDE

Found it. Let me confirm the impact before fixing.

### 2026-08-26T13:13 CLAUDE

Because the parser never read your coordinates — `locations 0` and `0 km` are the same failure, not two.

**The cause.** Your payload has `locations.location` as a JSON *array*:

```json
"locations": {"id": 1, "location": ["42.430101,-83.156899", "42.424594,-83.158837", ...]}
```

`parse_coords()` (`predictor/matrix_rule.py:120`) was documented and written for the portal's `"lat,lon|lat,lon|..."` *string* form. It did `str(text).split("|")` — so on a list it stringified the list itself, producing `"['42.430101,-83.156899', '42.424594,..."`. That's one chunk containing no `|`; splitting it on `,` gives `"['42.430101"` as the first field, `float()` raises, and the `except ValueError: continue` swallowed it. Result: zero coordinates from 1,985 real ones, no error.

`profile._locations()` did have a branch for list-shaped locations, but only for a bare top-level `locations` list. The wrapped `{"id": ..., "location": [...]}` form went straight to `parse_coords()` without the shape check.

**The fix**, in two places:
- `parse_coords()` now joins a list/tuple with `|` before parsing, so no caller can hit the stringify trap.
- `profile._locations()` routes both the wrapped and bare forms through one `_coords_from()` helper handling `"lat,lon"` strings, `{lat,lng}` objects, and `[lat,lon]` pairs.

Now:
```
  locations 1985
  total pairwise haversine 2,871,997 km
```

**On the impact — smaller than it looks here.** The predicted duration is unchanged at P50 461.7 s / P90 526.3 s. `locations_count` *is* a model feature, but 0 and 1985 happen to fall in the same tree leaf at 19 vehicles / 1984 jobs. That's luck, not robustness — at 100 locations the same request predicts 124.8 s, at 8000 it predicts 1,251.4 s.

`matrix dm/fast` was also correct both before and after, for a reason worth knowing: the 6,000 km distance gate only applies when routing is flexible (`predict_mdm` in `matrix_rule.py`), and this payload isn't. So the size threshold decided it, and 1985 < 5000 → dm either way. Had this request set any flexible-routing option, the broken parse would have shown 0 km against a 6,000 km gate and chosen `dm` where the real 2.87M km spread forces `mdm` — the ~92x error the gate exists to prevent.

Added three regression tests (array-of-strings, array/string equivalence, object and pair forms) in `tests/test_predictor.py`. 173 tests pass.

### 2026-08-26T13:59 USER

how many rows are in the data/requests.csv file

### 2026-08-26T13:59 CLAUDE

**69,183** data rows (plus the header).

That's up from the 68,556 I counted earlier in this session, so something has appended ~627 rows to the file since then.

### 2026-08-26T15:19 USER

how should I approach deployment of this stack to GCP? I want to be able to query the model through an API endpoint and have someone who is 'admin' to be able to harvest new solutions and train the model.

### 2026-08-26T15:21 CLAUDE

Here's what I'd do. The stack is small — 3.9 MB model, 12 MB CSV, 17 s training run — so the interesting problems are all about *boundaries*, not scale.

## The core move: one image, two deployables, IAM as your role system

Don't build an admin role into the app. Ship one container and deploy it twice:

| | Deployable | Who can call it |
|---|---|---|
| Predict | Cloud Run **service**, `--no-allow-unauthenticated` | `roles/run.invoker` on the service |
| Harvest + train | Cloud Run **job**, same image | `run.jobs.run` on the job (in `roles/run.invoker`) |

Your "admin" is then a Google group with invoker on the job. No role table, no session handling, no privilege-escalation surface in code you wrote — and admins trigger it with `gcloud run jobs execute predictor-train`, or Cloud Scheduler does on a nightly cron.

Same image for both matters for a second reason: the model is a `pickle` of a custom `Predictor` class holding sklearn estimators. Unpickling needs the `predictor` module importable and a compatible sklearn — you're on Python 3.14.7 / sklearn 1.9.0, and a version skew between the thing that trains and the thing that serves is a silent, ugly failure. One image makes that skew impossible by construction.

## State in GCS, with a precondition

```
gs://<bucket>/data/requests.csv      # versioning on
gs://<bucket>/models/predictor.pkl   # versioning on
```

Object versioning gives you rollback of both dataset and model for free.

**The one real hazard** is the append logic we just built. It reads the whole CSV to seed the dedupe set, then appends — on GCS that becomes download → append → re-upload the whole object. Two overlapping harvests silently lose one run's rows. Set the job to `--parallelism=1`, and more importantly upload with `if_generation_match=<generation you read>` so a concurrent writer fails loudly rather than clobbering. That's a few lines and it converts a data-corruption bug into an error message.

## Roll the model out as a Cloud Run revision

After the job trains, have it write the pkl to GCS, then update the service with the new object generation as an env var (`MODEL_GENERATION=1724...`). The service loads the model from GCS at cold start.

This is worth doing rather than having the service poll GCS: model rollout becomes a Cloud Run revision, so you get traffic splitting, instant rollback, and an audit trail of which model served when — using machinery you already have instead of cache-invalidation logic you'd have to write.

Give the predict service a **read-only** SA on the bucket. Unpickling executes arbitrary code, so the thing exposed to callers should not be able to write what it later loads.

## Code to add

You have no HTTP layer yet. The gap is small — factor the core of `cmd_predict` (`predictor/cli.py:152`) into a function the CLI and a FastAPI app both call, then:

- `POST /predict` — accepts the same input.json shape `load_input` already parses, so callers post the payload they were going to send to RO anyway
- `GET /model` — serve `predictor.meta` straight out; it already carries `metrics`, `train_period`, `bands`, `segments`, and the fitted `matrix_rule`
- `GET /healthz`

Return the model's MdAPE and P90 coverage in the predict response alongside the estimate. Callers acting on a number should see what it's worth, and it makes the "which model gave me this" question answerable after the fact.

## Three things that will bite

**The portal may not be reachable.** `explain/portal.py` talks to `sgpstg.nextbillion.io` with no auth headers at all — that reads like an internal endpoint. If it's VPN-only, the harvest job needs Direct VPC egress, and that's the item most likely to turn a one-day deploy into a one-week one. Check this first, before writing any Terraform.

**`explain/` is a different deployment problem.** It wants an OpenAI-compatible LLM at `EXPLAIN_BASE_URL` (currently Ollama on localhost, with Baseten support). Nothing in what you described needs it — I'd leave it out of v1 and point it at Vertex AI or keep it on Baseten if you want it later, rather than putting a GPU behind Cloud Run.

**CSV-in-GCS has a ceiling.** At 69k rows it's fine and I wouldn't move. Past roughly a million, the download-append-upload cycle stops being reasonable — that's when you move the dataset to BigQuery and make harvest a `MERGE` on `request_id`, which makes the dedupe atomic and free instead of something you maintain.

Portal reachability is the answer I'd want before committing to any of this. Want me to build it out — the FastAPI layer, Dockerfile, and the GCS read/write with generation preconditions — assuming the portal is reachable from GCP?

### 2026-08-26T15:22 USER

yup build it out

### 2026-08-26T15:23 CLAUDE

Before choosing the web framework, let me check what actually installs on Python 3.14.

### 2026-08-26T15:24 CLAUDE

Now building the shared prediction core that both the CLI and API will use.

### 2026-08-26T15:24 CLAUDE

Now the storage layer with generation preconditions — the piece that prevents lost harvests.

### 2026-08-26T15:25 CLAUDE

Now the HTTP API.

### 2026-08-26T15:26 CLAUDE

[CMD] cat > serving/__init__.py <<'EOF'
"""HTTP serving layer for the duration predictor."""
EOF
cat > requirements.txt <<'EOF'
# Runtime dependencies for the container. Pinned because the model is a
# pickle: the sklearn that unpickles it must match the sklearn that wrote it,
# and the same image serves and trains so there is exactly one version here.
scikit-learn==1.9.0
numpy==2.5.2
scipy==1.18.0

# API
fastapi==0.141.1
uvicorn[standard]==0.52.4
pydantic==2.13.4

# Dataset and model live in GCS in production; imported lazily so local runs
# and tests do not need it.
google-cloud-storage==3.13.1
EO

### 2026-08-26T15:26 CLAUDE

Now the Dockerfile — one image, two entrypoints.

### 2026-08-26T15:26 CLAUDE

Now wire `gs://` support into the CLI commands and refactor `cmd_predict` onto the shared core.

### 2026-08-26T15:27 CLAUDE

Now refactor `cmd_predict` onto the shared core so CLI and API can't drift.

### 2026-08-26T15:32 CLAUDE

Now the deploy tooling.

### 2026-08-26T15:33 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("deploy/deploy.sh")
s = p.read_text()
old = '''  local url; url="$(cmd_url)"
  curl -sS -X POST "${url}/predict" \\
    -H "Authorization: Bearer $(gcloud auth print-identity-token)" \\
    -H "Content-Type: application/json" \\
    -d "${1:-{\\"vehicles\\":12,\\"jobs\\":400,\\"locations\\":412\\}}"
  echo'''
new = '''  local url body
  url="$(cmd_url)"
  body="${1:-}"
  [[ -n "$body" ]] || body='{"vehicles":12,"jobs":400,"locations":412}'
  curl -sS -X POST "${url}/predict" \\
    -H "Authorization: Bearer $(gcloud auth print-identity-token)"

### 2026-08-26T15:33 CLAUDE

[CMD] which docker >/dev/null 2>&1 && (docker info >/dev/null 2>&1 && echo "docker running" || echo "docker installed but not running") || echo "docker not installed"

### 2026-08-26T15:33 CLAUDE

Docker's available — let me actually build and run the image rather than assume it works.

### 2026-08-26T15:33 CLAUDE

[CMD] docker build -t predictor-test . 2>&1 | tail -20

### 2026-08-26T15:34 CLAUDE

[CMD] docker run --rm -d --name predtest -p 8099:8080 \
  -v "$PWD/models:/models:ro" -e MODEL_URI=/models/predictor.pkl predictor-test >/dev/null
for i in $(seq 1 30); do curl -sf localhost:8099/healthz >/dev/null 2>&1 && break; sleep 1; done
echo "healthz: $(curl -s localhost:8099/healthz)"
echo "readyz:  $(curl -s localhost:8099/readyz)"
echo; echo "predict:"
curl -s -X POST localhost:8099/predict -H 'Content-Type: application/json' \
  -d '{"vehicles":12,"jobs":400,"locations":412}' | python3 -m json.tool | head -20

### 2026-08-26T15:34 CLAUDE

[CMD] docker stop predtest >/dev/null 2>&1
echo "=== full test suite inside the container ==="
docker run --rm -v "$PWD/tests:/app/tests:ro" -v "$PWD/models:/app/models:ro" \
  --entrypoint python predictor-test -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED|FAIL:|ERROR:)|skipped"

### 2026-08-26T15:35 CLAUDE

[CMD] docker run --rm -v "$PWD/tests:/app/tests:ro" -v "$PWD/models:/app/models:ro" \
  --entrypoint python predictor-test -m unittest tests.test_serving 2>&1 | grep -A12 "ERROR: setUpClass" | head -25

### 2026-08-26T15:35 CLAUDE

Two real problems, both worth fixing. Let me start with the storage one — it's a genuine design flaw.

### 2026-08-26T15:35 CLAUDE

[CMD] docker run --rm --entrypoint python predictor-test -c "
import os, tempfile, time
with tempfile.TemporaryDirectory() as d:
    p = os.path.join(d,'x')
    open(p,'w').write('one'); a = os.stat(p).st_mtime_ns
    open(p,'w').write('two'); b = os.stat(p).st_mtime_ns
    print('mtime_ns resolution test: changed =', a != b, '| delta =', b - a)
"

### 2026-08-26T15:35 CLAUDE

Confirmed — the container filesystem gives two writes the same `mtime_ns`, so my precondition would silently pass. Switching to a content hash.

### 2026-08-26T15:36 CLAUDE

[CMD] docker build -q -t predictor-test . >/dev/null 2>&1 && echo "rebuilt"
echo "=== container suite ==="
docker run --rm -v "$PWD/tests:/app/tests:ro" -v "$PWD/models:/app/models:ro" \
  --entrypoint python predictor-test -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED|FAIL:|ERROR:)|skipped"

### 2026-08-26T15:38 CLAUDE

[CMD] SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad
rm -rf "$SP/jobout" && mkdir -p "$SP/jobout"
docker run --rm -v "$PWD/data:/data:ro" -v "$SP/jobout:/out" \
  -e DATA_URI=/data/requests.csv -e MODEL_URI=/out/predictor.pkl \
  predictor-test train 2>&1 | tail -8
echo "--- artifact written by the job entrypoint: ---"; ls -la "$SP/jobout"

### 2026-08-26T15:39 CLAUDE

[CMD] SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad
docker run --rm -d --name predtest2 -p 8099:8080 -v "$SP/jobout:/out:ro" \
  -e MODEL_URI=/out/predictor.pkl predictor-test >/dev/null
for i in $(seq 1 30); do curl -sf localhost:8099/readyz >/dev/null 2>&1 && break; sleep 1; done
echo "serving the model the JOB just trained:"
curl -s -X POST localhost:8099/predict -H 'Content-Type: application/json' \
  -d '{"vehicles":12,"jobs":400,"locations":412}' | python3 -c "import json,sys; d=json.load(sys.stdin); print(' ', d['p50_seconds'

### 2026-08-26T15:39 CLAUDE

Full round trip verified: the job trains, the service serves that exact artifact. Now the deployment doc.

### 2026-08-26T15:40 CLAUDE

[CMD] source .venv/bin/activate
echo "=== final: bare project venv ==="
python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED)|skipped"
echo "=== final: CLI unchanged ==="
python3 -m predictor predict --vehicles 12 --jobs 400 --locations 412 2>&1 | tail -5
echo "=== final: harvest --help shows new flags ==="
python3 -m predictor harvest --help 2>&1 | grep -A3 "overwrite"
echo "=== files added ==="
ls -1 Dockerfile entrypoint.sh requirements.txt requirements-dev.txt .dockerignore DEPLOY.md deploy/deploy.sh serving/app.py predictor/service.py predictor/storage.py tests/t

### 2026-08-26T15:41 CLAUDE

[CMD] docker rmi predictor-test >/dev/null 2>&1; rm -rf /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad/jobout; docker ps -a --filter name=predtest --format '{{.Names}}' | grep . || echo "no stray containers"; git status --short 2>/dev/null | head -20 || echo "(not a git repo)"

### 2026-08-26T15:41 CLAUDE

Built and verified end to end.

## What's there

**`predictor/service.py`** — one prediction path, called by both the CLI and the API. The `matrix_type` derivation is subtle (deduped location count, haversine gate only for flexible routing, explicit override wins) and duplicating it in a web handler would mean two implementations drifting while both still returned a plausible number. `TestApiAgreesWithCli` asserts they agree.

**`predictor/storage.py`** — `gs://` support anywhere a path is accepted, with every write conditional on the generation that was read. A loser gets `ConcurrentWrite` instead of silently discarding its rows.

**`serving/app.py`** — FastAPI. `POST /predict` (post the RO payload directly, or just counts), `GET /model` (the full metadata your training run already records), `/healthz`, `/readyz`, generated `/docs`. Every response carries the model's MdAPE, P90 coverage, and the substituted assumptions.

**`Dockerfile` + `entrypoint.sh`** — one image, roles `serve` / `harvest` / `train` / `refresh` / `evaluate`.

**`deploy/deploy.sh`** — `bootstrap`, `build`, `deploy`, `seed`, `refresh`, `promote`, `schedule`, `grant-admin`, `grant-caller`, `url`, `call`.

**`DEPLOY.md`**, and 28 new tests (201 total).

## Verified rather than assumed

I built the image and ran it. The job entrypoint trained a model on your 69,922 rows inside the container, and the service then served that exact artifact — 42.7 s / 85.0 s, identical to the CLI. The suite passes in three environments: the container, a full-dependency venv, and your bare `.venv` (17 graceful skips, since fastapi and GCS aren't installed there).

**Running it in the container found a real bug.** I'd made the local storage generation an `mtime_ns` comparison. On the container filesystem two writes in the same instant get byte-identical `st_mtime_ns` — I confirmed it directly — so the precondition would have silently passed, which is the one thing it exists to prevent. It now hashes contents. That would not have shown up on macOS.

## Two things to know

**`--locations 0` now means zero.** The old CLI used `args.locations or (jobs+shipments+vehicles)`, so an explicit `0` fell through to the sum; `profile_to_row` itself has always used `is None`. The shared core follows `profile_to_row`. Default usage is unaffected.

**I didn't touch your `.venv`.** The API deps are in `requirements.txt`; I tested against a throwaway venv. `pip install -r requirements-dev.txt` when you want the API tests running locally.

The portal reachability question from before is still the thing to check first — `explain/portal.py` sends no auth headers, which reads as internal. If it needs VPC egress, that's the item that stretches the timeline, and it's the one piece I couldn't verify from here.

### 2026-08-26T15:42 USER

<bash-input>gcloud config get-value project</bash-input>

### 2026-08-26T15:42 USER

<bash-stdout>[GCP_PROJECT]</bash-stdout><bash-stderr></bash-stderr>

### 2026-08-26T15:42 CLAUDE

Good — the script will pick that up automatically, so `PROJECT` doesn't need setting.

That resolves to:

- bucket `gs://[GCP_PROJECT]-predictor`
- image `asia-southeast1-docker.pkg.dev/[GCP_PROJECT]/predictor/predictor`
- SAs `predictor-api@` / `[EMAIL]`

`bootstrap` is the first step that creates real billable resources (Artifact Registry repo, a versioned bucket, two service accounts, and it enables five APIs). Say the word and I'll run it — or run it yourself with `! ./deploy/deploy.sh bootstrap` if you'd rather watch it directly.

Worth confirming before it runs: `REGION` defaults to `asia-southeast1` on the assumption you want to sit near `api-auto-sgp`. That choice is baked into the bucket location, so it's annoying to change later.

### 2026-08-26T16:21 USER

copy the data/requests.csv file to the GCS bucket so that we have an initial set of entries for first training.

### 2026-08-26T16:21 CLAUDE

[CMD] gcloud auth list --filter=status:ACTIVE --format='value(account)' 2>&1 | head -3; echo "--- bucket ---"; gcloud storage buckets describe gs://[GCP_PROJECT]-predictor --format='value(name,location,versioning.enabled)' 2>&1 | head -5

### 2026-08-26T16:21 CLAUDE

[CMD] echo "=== versioning ==="; gcloud storage buckets describe gs://[GCP_PROJECT]-predictor --format='value(versioning_enabled)' 2>&1
echo "=== existing objects ==="; gcloud storage ls -l "gs://[GCP_PROJECT]-predictor/**" 2>&1 | head -20

### 2026-08-26T16:22 CLAUDE

Bucket exists, versioning on, empty — nothing to overwrite. Let me verify the file is append-compatible before uploading.

### 2026-08-26T16:22 CLAUDE

[CMD] gcloud storage cp data/requests.csv gs://[GCP_PROJECT]-predictor/data/requests.csv 2>&1 | tail -3

### 2026-08-26T16:22 CLAUDE

[CMD] gcloud storage objects describe gs://[GCP_PROJECT]-predictor/data/requests.csv \
  --format='value[separator="  |  "](size,generation,md5_hash)' 2>&1
echo "--- local md5 for comparison ---"
python3 -c "
import hashlib,base64
print(base64.b64encode(hashlib.md5(open('data/requests.csv','rb').read()).digest()).decode())
"

### 2026-08-26T16:22 CLAUDE

Uploaded and verified.

```
gs://[GCP_PROJECT]-predictor/data/requests.csv
  69,928 rows · 13,370,552 bytes · generation 1787761340840896
```

MD5 matches the local file byte-for-byte (`CwKSKSTvtaaLWV6wf3PrLg==`).

Three things I checked along the way:

**The bucket was already bootstrapped** — `ASIA-SOUTHEAST1`, versioning enabled, and empty. Nothing to overwrite, and this upload is now generation 1, so any later harvest that goes wrong is one `gcloud storage cp` from undone.

**The header matches `RAW_COLUMNS` exactly.** Worth confirming before upload rather than after: if it hadn't, the first cloud harvest would have refused to append rather than misfiling every value under the wrong column — a clean failure, but one you'd rather find now.

**The storage layer works against real GCS, not just the stub.** `GcsStore.generation()` returned the right generation, `readable()` pulled all 69,928 rows back with an intact header, and the not-yet-trained model correctly read as `None` rather than raising. That was the one part of `predictor/storage.py` only covered by a stub client until now.

Since the dataset is seeded, `seed` would re-harvest deep and duplicate work you've already done. Go straight to a train against what's there:

```bash
./deploy/deploy.sh build
./deploy/deploy.sh deploy
gcloud run jobs execute predictor-job --region asia-southeast1 --wait --args train
./deploy/deploy.sh promote
```

That trains on the 69,928 rows now in the bucket and skips the portal entirely — which also means the first deploy doesn't depend on the VPC-egress question being settled. Want me to run the build and deploy?

### 2026-08-26T16:35 USER

Error: Forbidden
Your client does not have permission to get URL /docs from this server.

### 2026-08-26T16:35 CLAUDE

[CMD] gcloud run services describe predictor-api --region asia-southeast1 \
  --format='value[separator="  "](status.url,status.conditions[0].status)' 2>&1 | head -3
echo "=== invoker bindings ==="
gcloud run services get-iam-policy predictor-api --region asia-southeast1 \
  --format='table(bindings.role,bindings.members)' 2>&1 | head -10

### 2026-08-26T16:35 CLAUDE

Two separate problems here — the service has no IAM bindings at all yet.

### 2026-08-26T16:35 CLAUDE

[CMD] URL=https://predictor-api-7j5cx7inrq-as.a.run.app
echo "=== unauthenticated (what your browser did) ==="
curl -s -o /dev/null -w "  HTTP %{http_code}\n" "$URL/healthz"
echo "=== with an ID token, before any grant ==="
curl -s -o /dev/null -w "  HTTP %{http_code}\n" -H "Authorization: Bearer $(gcloud auth print-identity-token)" "$URL/healthz"

### 2026-08-26T16:39 USER

I want /docs page to be accessible without the identity token

### 2026-08-26T16:39 CLAUDE

[CMD] gcloud run services describe predictor-api --region asia-southeast1 \
  --format='yaml(status.url,status.traffic,status.latestReadyRevisionName,spec.template.spec.containers[0].image)' 2>&1 | head -20
echo "=== revisions ==="
gcloud run revisions list --service predictor-api --region asia-southeast1 \
  --format='table(name,active,status.conditions[0].message)' 2>&1 | head -6

### 2026-08-26T16:39 CLAUDE

[CMD] URL=https://predictor-api-7j5cx7inrq-as.a.run.app
curl -sS -i "$URL/healthz" 2>&1 | head -20

### 2026-08-26T16:40 CLAUDE

[CMD] gcloud run services describe predictor-api --region asia-southeast1 --format=json 2>/dev/null \
  | python3 -c "
import json,sys
d=json.load(sys.stdin)
st=d.get('status',{})
print('status.url      :', st.get('url'))
print('status.urls     :', st.get('urls'))
print('address.url     :', (st.get('address') or {}).get('url'))
ann=(d.get('metadata') or {}).get('annotations',{})
print('ingress         :', ann.get('run.googleapis.com/ingress'))
"

### 2026-08-26T16:40 CLAUDE

[CMD] host predictor-api-7j5cx7inrq-as.a.run.app 2>&1 | head -3
URL=https://predictor-api-7j5cx7inrq-as.a.run.app
echo "--- retry, no token ---"; curl -s -o /dev/null -w "  HTTP %{http_code}\n" "$URL/healthz"
echo "--- retry, with token ---"; curl -s -o /dev/null -w "  HTTP %{http_code}\n" -H "Authorization: Bearer $(gcloud auth print-identity-token)" "$URL/healthz"
echo "--- /docs, no token ---"; curl -s -o /dev/null -w "  HTTP %{http_code}\n" "$URL/docs"

### 2026-08-26T16:40 CLAUDE

[CMD] URL=https://predictor-api-7j5cx7inrq-as.a.run.app
TOK=$(gcloud auth print-identity-token)
for p in / /docs /openapi.json /healthz /readyz /model /nonsense-xyz; do
  a=$(curl -s -o /dev/null -w "%{http_code}" "$URL$p")
  b=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOK" "$URL$p")
  printf "  %-16s no-token=%s  token=%s\n" "$p" "$a" "$b"
done

### 2026-08-26T16:41 CLAUDE

Diagnosed. Your token actually works fine — the problem is that browsers don't send one.

```
                 no-token   token
  /docs            403       200      ← your error
  /openapi.json    403       200
  /readyz          403       200
  /model           403       200
```

The 403 comes from Google's front end before the request reaches the container. Project-level owner already gives you `run.invoker` (the service-level policy is empty, but that doesn't matter), so `curl` with an ID token gets a 200. A browser has no way to attach one.

**Immediate unblock, no infrastructure change:**

```bash
gcloud run services proxy predictor-api --region asia-southeast1 --port 8080
```

Then open `http://localhost:8080/docs`. The proxy signs each request with your credentials, so the browser gets Swagger UI with nothing to configure.

## If you want it genuinely public

Cloud Run IAM is per-service and all-or-nothing — there's no per-path rule. So `/docs` can't be opened while `/predict` stays closed on the same service. Three ways out:

**Deploy a second, docs-only public service** (my recommendation). Same image, an env flag that mounts only `/docs` and `/openapi.json`, no `/predict`, no model load, no bucket access. `--allow-unauthenticated` on that one; the real service keeps its IAM. Scale-to-zero, so effectively free, and it preserves the property that the admin/user split is an IAM boundary rather than app-level auth. What leaks publicly is the API's shape — field names, the `api-auto-sgp` deployment id — and nothing else.

**Make the whole service public.** One flag. But then anyone can call `/predict` on your compute and read `/model`, which reports your training row counts and error metrics.

**Load balancer with path rules + IAP.** Real per-path auth, and a lot of machinery to publish a docs page.

Say the word and I'll build the docs-only service — it's a small change to `serving/app.py` plus a `deploy.sh` target.

## Separately: `/healthz` is unreachable from outside

It returns 404 with *and* without a token, while every other route behaves normally. It's special-cased at Google's edge and never reaches your container. The route is fine — I tested it in the container earlier and it returned `{"status":"ok"}`, and the Cloud Run startup probe pointed at `/healthz` passed, which is why the revision went ready.

So nothing is broken, but if you ever want an externally-pollable liveness check, rename it to `/livez`. Worth doing before anything external starts depending on it.

### 2026-08-26T16:41 USER

build the docs-only service

### 2026-08-26T16:42 CLAUDE

Building it now.

### 2026-08-26T16:42 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("serving/app.py")
s = p.read_text()

old = '''MODEL_URI = os.environ.get("MODEL_URI", "models/predictor.pkl")
MODEL_GENERATION = os.environ.get("MODEL_GENERATION") or None

app = FastAPI(
    title="Route Optimization duration predictor",
    description=(
        "Predicts how long a Route Optimization request will take, from its "
        "input profile, before it is submitted."),
    version="1.0.0",
)'''

new = '''MODEL_URI = os.environ.get("MODEL_URI", "models/predictor.pkl")
MODEL_GENERATION = os.environ.get("MODEL_GENERATION") or None

### 2026-08-26T16:43 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("serving/app.py")
s = p.read_text()
old = '''Config (all optional; sensible local defaults):
  MODEL_URI        gs://bucket/models/predictor.pkl, or a local path
  MODEL_GENERATION set by the deploy to pin an exact model version. Changing
                   it is what makes a new model a new Cloud Run revision, so
                   rollout and rollback are revision operations.
  PORT             Cloud Run sets this.
"""'''
new = '''Config (all optional; sensible local defaults):
  MODEL_URI        gs://bucket/models/predictor.pkl, or a local

### 2026-08-26T16:43 CLAUDE

Now tests for the docs-only mode — including that it genuinely never loads the model.

### 2026-08-26T16:43 CLAUDE

[CMD] docker build -q -t predictor-test . >/dev/null 2>&1 && echo "rebuilt"
docker run --rm -d --name docsonly -p 8098:8080 \
  -e DOCS_ONLY=1 -e API_URL=https://predictor-api-7j5cx7inrq-as.a.run.app \
  -e MODEL_URI=gs://nowhere/nope.pkl predictor-test >/dev/null
for i in $(seq 1 30); do curl -sf localhost:8098/openapi.json >/dev/null 2>&1 && break; sleep 1; done
echo "=== docs-only container (note: MODEL_URI points at a bucket it cannot reach) ==="
for p in /docs /openapi.json /predict /model /readyz; do
  printf "  %-16s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' localhost:8098$p)"
done

### 2026-08-26T16:43 CLAUDE

[CMD] echo "=== normal mode from the SAME image is unaffected ==="
docker run --rm -d --name normalmode -p 8097:8080 -v "$PWD/models:/models:ro" \
  -e MODEL_URI=/models/predictor.pkl predictor-test >/dev/null
for i in $(seq 1 30); do curl -sf localhost:8097/readyz >/dev/null 2>&1 && break; sleep 1; done
for p in /docs /model /readyz; do printf "  %-12s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' localhost:8097$p)"; done
printf "  %-12s %s\n" "POST /predict" "$(curl -s -o /dev/null -w '%{http_code}' -X POST localhost:8097/predict -H 'Content-Type: application/json' -d '{"vehicles":12,"jobs"

### 2026-08-26T16:46 CLAUDE

Now the docs.

### 2026-08-26T16:47 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("DEPLOY.md")
s = p.read_text()

old = '''| Predict | Cloud Run **service** `predictor-api` | object **read** | callers with `roles/run.invoker` on the service |
| Harvest + train | Cloud Run **job** `predictor-job` | object **admin** | admins with `roles/run.invoker` on the job |'''
new = '''| Predict | Cloud Run **service** `predictor-api` | object **read** | callers with `roles/run.invoker` on the service |
| Harvest + train | Cloud Run **job** `predictor-job` | object **admin** | admins with `roles/run.invoker` on the job |
| Reference | Cl

### 2026-08-26T16:47 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("DEPLOY.md")
s = p.read_text()
old = '''One container image, deployed twice.'''
new = '''One container image, deployed three times.'''
assert old in s
s = s.replace(old, new)
old = '''One image for both is not tidiness.'''
new = '''One image for all of them is not tidiness.'''
assert old in s
s = s.replace(old, new)
old = '''./deploy/deploy.sh bootstrap    # APIs, versioned bucket, two service accounts'''
new = '''./deploy/deploy.sh bootstrap    # APIs, versioned bucket, three service accounts'''
assert old in s
s = s.replace(old, new)
p.write

### 2026-08-26T16:47 CLAUDE

Built and verified in the container.

## How it works

Same image, third deployment, `DOCS_ONLY=1` + `--allow-unauthenticated`.

The trick is that **the routes stay registered**. FastAPI generates the OpenAPI schema from registered routes, so deleting `/predict` would have published a document describing nothing. Instead a middleware refuses to *execute* anything outside `/`, `/docs`, `/redoc`, `/openapi.json` — the routes are declared and refused, not removed.

Three independent reasons it's safe to expose:

- The gate 404s every non-docs path, with a pointer to the real host in the body.
- The model is never loaded — nothing reachable calls `_load()`.
- `predictor-docs@` is granted **no bucket access at all**. `bootstrap` creates it and deliberately adds no binding, with a comment saying why, so nobody adds one later out of symmetry.

The published schema's `servers` entry points at `predictor-api`, and the description carries the curl recipe — the page documents something callable rather than itself.

## Verified

Ran both modes from the same built image:

```
docs-only          normal mode
  /docs        200    /docs        200
  /openapi     200    /model       200
  /predict     404    /readyz      200
  /model       404    POST /predict 200
  /readyz      404
  /            307 → /docs
```

The docs container ran with `MODEL_URI=gs://nowhere/nope.pkl` — a bucket it has no credentials for — and served the full schema anyway. That's the proof it never touches the model, not just an assertion. `test_the_model_is_never_loaded` pins it: it asserts `_model is None` after hitting docs, schema, and predict.

210 tests pass in all three environments (container, full-deps, your bare `.venv`).

## Deploy it

```bash
./deploy/deploy.sh build          # picks up the DOCS_ONLY code
./deploy/deploy.sh deploy-docs
```

It reads the API's URL itself and wires it into the schema, so it errors out rather than publishing a page pointing nowhere if the API service isn't deployed yet.

**One thing to decide:** *Try it out* won't work from the public page — the real host needs an ID token, and making the button work would mean adding CORS to the API service. I left it off, and the description says so explicitly rather than letting people click a button that silently fails. Say if you'd rather have working Try-it-out; it's a CORS origin allowlist on `predictor-api`.

The public exposure is the API's shape — field names, defaults, the `api-auto-sgp` deployment id. Worth a glance to confirm you're happy with that being on the open internet.

### 2026-08-26T16:50 USER

<bash-input>/deploy/deploy.sh build</bash-input>

### 2026-08-26T16:50 USER

<bash-stdout></bash-stdout><bash-stderr>(eval):1: no such file or directory: /deploy/deploy.sh
</bash-stderr>

### 2026-08-26T16:50 CLAUDE

Leading slash — that's an absolute path. You want `./`:

```
! ./deploy/deploy.sh build
```

### 2026-08-26T16:52 USER

❯ ./deploy/deploy.sh deploy-docs
Deploying container to Cloud Run service [predictor-docs] in project [[GCP_PROJECT]] region [asia-southeast1]
X Deploying new service...                                                                                                                           
  . Creating Revision...                                                                                                                             
  . Routing traffic...                                                                                                                               
  . Setting IAM Policy...                                                                                                                            
Deployment failed                                                                                                                                    
ERROR: (gcloud.run.deploy) [[EMAIL]] does not have permission to access namespaces instance [[GCP_PROJECT]] (or it may not exist): Permission 'iam.serviceaccounts.actAs' denied on service account [EMAIL] (or it may not exist). This command is authenticated as [EMAIL] which is the active account specified by the [core/account] property.
 ~/workspace/openai_explain │ main

### 2026-08-26T16:52 CLAUDE

[CMD] for sa in predictor-api predictor-job predictor-docs; do
  printf "  %-16s " "$sa"
  gcloud iam service-accounts describe "${sa}@[GCP_PROJECT].iam.gserviceaccount.com" \
    --format='value(email)' 2>/dev/null || echo "MISSING"
done

### 2026-08-26T16:53 CLAUDE

That's the "or it may not exist" half of the error — you bootstrapped before I added `predictor-docs` to the loop, so the account was never created.

### 2026-08-26T16:53 CLAUDE

[CMD] gcloud iam service-accounts create predictor-docs \
  --project [GCP_PROJECT] \
  --display-name "Duration predictor docs" 2>&1 | tail -3
echo "--- confirm it exists and has NO bucket access ---"
gcloud iam service-accounts describe [EMAIL] --format='value(email)'
gcloud storage buckets get-iam-policy gs://[GCP_PROJECT]-predictor \
  --format=json 2>/dev/null | grep -c "predictor-docs" | sed 's/^/  bucket bindings mentioning predictor-docs: /'

### 2026-08-26T16:53 CLAUDE

[CMD] gcloud iam service-accounts describe [EMAIL] --format='value(email,disabled)' 2>&1 | tail -2

### 2026-08-26T16:53 CLAUDE

Created — the `NOT_FOUND` a moment ago was just IAM propagation lag; it resolves now.

```
[EMAIL]
bucket bindings mentioning predictor-docs: 0   ← correct, by design
```

Zero bucket bindings is the point: that account is public-facing and should be able to reach nothing.

Re-run it:

```
! ./deploy/deploy.sh deploy-docs
```

If it fails again with the same `actAs` message now that the account exists, that's a genuinely different problem — you'd need `roles/iam.serviceAccountUser` on it — but since `predictor-api` and `predictor-job` both deployed fine, you almost certainly have that at project level already.

I've added `predictor-docs` to the `bootstrap` loop, so a fresh project won't hit this. Your existing project just predates that change.

### 2026-08-26T17:02 USER

what command via API to harvest new requests to add to the existing ones

### 2026-08-26T17:02 CLAUDE

Harvesting deliberately isn't on the API service — that's the whole admin/user split. It's the Cloud Run *job*. Let me confirm how yours is configured.

### 2026-08-26T17:02 CLAUDE

[CMD] gcloud run jobs describe predictor-job --region asia-southeast1 --format=json 2>/dev/null | python3 -c "
import json,sys
d=json.load(sys.stdin)
c=d['spec']['template']['spec']['template']['spec']['containers'][0]
print('image :', c['image'])
print('args  :', c.get('args'))
print('env   :', {e['name']: e.get('value') for e in c.get('env',[])})
" 2>&1 | head -10

### 2026-08-26T17:03 CLAUDE

There's no API endpoint for it, by design — that's the admin/user split. The predict service's account has read-only bucket access and no harvest code path. Harvesting is the Cloud Run **job**, gated by `run.invoker` on the job.

Your job is configured with `args: ['refresh']` and the right bucket URIs, so the default run does exactly what you asked:

```bash
gcloud run jobs execute predictor-job --region asia-southeast1 --wait
```

`refresh` = harvest (appends, skipping `request_id`s already in the CSV) then retrain on the combined set. Or the wrapper, which also points the service at the new model:

```bash
./deploy/deploy.sh refresh
```

**Variants**, overriding the args at execution time:

```bash
# harvest only, no retrain
gcloud run jobs execute predictor-job --region asia-southeast1 --wait --args harvest

# walk further back (default 100k)
gcloud run jobs execute predictor-job --region asia-southeast1 --wait \
  --args harvest,--limit,200000

# one customer's traffic
gcloud run jobs execute predictor-job --region asia-southeast1 --wait \
  --args harvest,--org,eTruckBiz
```

`--args` is comma-delimited, so each token is a separate element.

**If you literally meant over HTTP** — the Cloud Run Admin API, which is what Cloud Scheduler calls:

```bash
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" -d '{}' \
  "https://run.googleapis.com/v2/projects/[GCP_PROJECT]/locations/asia-southeast1/jobs/predictor-job:run"
```

Note that's an **access** token (OAuth), not the **identity** token the predict API takes — different auth for the control plane.

After a harvest-only run, retrain and roll out with:

```bash
gcloud run jobs execute predictor-job --region asia-southeast1 --wait --args train
./deploy/deploy.sh promote
```

One flag: this will be the first time anything reaches `sgpstg.nextbillion.io` from inside GCP. If that portal is VPN-only the job will fail on network errors rather than anything subtle — the harvest prints `stopped early` and keeps whatever it got. Watch the first run's logs; if it can't connect, the job needs Direct VPC egress. Everything up to now has run against the bucket, which doesn't exercise that path.

### 2026-08-26T17:48 USER

for the /predict and /model API endpoints, can we relax the requirement to submit with bearer token?

### 2026-08-26T17:48 CLAUDE

One command. But let me be precise about what it exposes before you run it.

### 2026-08-26T17:49 CLAUDE

Yes — one command:

```bash
gcloud run services add-iam-policy-binding predictor-api \
  --region asia-southeast1 --member allUsers --role roles/run.invoker
```

Reversible with `remove-iam-policy-binding`. Before you run it, here's what you'd actually be opening.

## What goes public

I audited the payloads rather than guessing. **No customer data** — no org codes, no request ids, no coordinates. `/predict` only echoes back what the caller sent, plus a duration.

What `/model` does disclose is operational: your training volumes (55,942 train / 13,986 test), error rates (MdAPE 13.3%, P90 coverage 92.6%), the date range you have data for, and the per-segment breakdown — including that MDM is 0.16% of traffic with a 313 s median against 3.2 s for everything else. `/predict` also reveals `api-auto-sgp` in its `assumptions` field.

That's a fairly candid picture of how NextBillion's RO service behaves in production. Not a data leak; a competitive-information question, and your call.

**The bigger practical risk is compute.** A public `/predict` is unmetered — anyone can drive it to `--max-instances 10`. Drop that to 2–3 if you go public.

## Whether you should

Depends entirely on who's calling, and the answer flips:

**Callers inside GCP** (Cloud Run, GKE, Cloud Functions) — don't relax it. An ID token comes free from the metadata server:

```python
import google.auth.transport.requests, google.oauth2.id_token
req = google.auth.transport.requests.Request()
tok = google.oauth2.id_token.fetch_id_token(req, "https://predictor-api-7j5cx7inrq-as.a.run.app")
requests.post(url, json=payload, headers={"Authorization": f"Bearer {tok}"})
```

Three lines, no secret to rotate, per-caller audit logs. IAM is genuinely *easier* than an API key here.

**Callers outside GCP** — a browser app, a partner, a laptop script — IAM is real friction, and going public is defensible. Pair it with lower `--max-instances`, and Cloud Armor on a load balancer if you want rate limiting.

**Middle ground:** keep IAM and grant `run.invoker` per caller. `./deploy/deploy.sh grant-caller <member>` already does this, and it works for user accounts and groups, not just service accounts.

## Two knock-ons

Making the service public makes **`predictor-docs` redundant** — `/docs` would be reachable on the main service directly. You'd want to delete it rather than run two things serving the same page.

And your org may block it. `allUsers` bindings are commonly forbidden by `constraints/iam.allowedPolicyMemberDomains` (domain-restricted sharing). If it fails with a policy violation, that's an org admin decision, not something to work around.

Want me to run it, or narrow `max-instances` first?

### 2026-08-26T17:51 USER

update the docs so that the swagger examples can now be run without the bearer token

### 2026-08-26T17:51 CLAUDE

[CMD] echo "=== predictor-api IAM ==="
gcloud run services get-iam-policy predictor-api --region asia-southeast1 \
  --format='table(bindings.role,bindings.members)' 2>&1 | head
echo "=== unauthenticated probe ==="
for p in /docs /model; do
  printf "  %-8s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' https://predictor-api-7j5cx7inrq-as.a.run.app$p)"
done
echo "=== docs host ==="
gcloud run services describe predictor-docs --region asia-southeast1 --format='value(status.url)' 2>&1 | tail -1

### 2026-08-26T17:52 CLAUDE

You've made `predictor-api` public, and `https://predictor-api-.../docs` already returns 200 — so Try-it-out works there same-origin, today, with no changes. The problem is only on the separate docs host: that's a cross-origin fetch, which the browser blocks without CORS. Let me fix both.

### 2026-08-26T17:52 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("serving/app.py")
s = p.read_text()

old = '''# Public URL of the real API, so the published schema points at something
# callable rather than at the docs host.
API_URL = os.environ.get("API_URL", "").rstrip("/")'''
new = '''# Public URL of the real API, so the published schema points at something
# callable rather than at the docs host.
API_URL = os.environ.get("API_URL", "").rstrip("/")
# How the API service is protected: "iam" (callers present a Google ID token)
# or "public" (allUsers has run.invoker). The docs host cannot infer this, so
#

### 2026-08-26T17:52 CLAUDE

Now wire the deploy so it detects the real IAM state rather than being told.

### 2026-08-26T17:52 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("deploy/deploy.sh")
s = p.read_text()

old = '''cmd_deploy_docs() {'''
new = '''api_is_public() {
  # Read the API's ACTUAL policy rather than trusting a flag. The docs must not
  # claim a token is required when it is not, or vice versa.
  gcloud run services get-iam-policy "$SERVICE" --project "$PROJECT" \\
    --region "$REGION" --format=json 2>/dev/null \\
    | grep -q '"allUsers"'
}

cmd_deploy_docs() {'''
assert old in s
s = s.replace(old, new)

old = '''  local api_url
  api_url="$(cmd_url 2>/dev/null || true)"
  [[ -n "$api_url" ]] ||

### 2026-08-26T17:53 CLAUDE

[CMD] docker build -q -t predictor-test . >/dev/null 2>&1 && echo rebuilt
DOCS=https://predictor-docs-7j5cx7inrq-as.a.run.app
API=https://predictor-api-7j5cx7inrq-as.a.run.app

echo "=== docs host, AUTH_MODE=public ==="
docker run --rm -d --name d1 -p 8096:8080 -e DOCS_ONLY=1 -e AUTH_MODE=public \
  -e API_URL=$API -e MODEL_URI=gs://nowhere/nope.pkl predictor-test >/dev/null
for i in $(seq 1 30); do curl -sf localhost:8096/openapi.json >/dev/null 2>&1 && break; sleep 1; done
curl -s localhost:8096/openapi.json | python3 -c "
import json,sys; d=json.load(sys.stdin)['info']['description']
print('  men

### 2026-08-26T17:54 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("DEPLOY.md")
s = p.read_text()

old = '''The published schema's `servers` entry points at `predictor-api`, and the
description carries the `curl` recipe — so the page documents something
callable rather than itself. *Try it out* will not work from the public page:
the real host needs an ID token, and wiring that up would mean CORS on the API.'''
new = '''The published schema's `servers` entry points at `predictor-api`, and the
description carries the `curl` recipe — so the page documents something
callable rather than itself.

### The docs des

### 2026-08-26T17:57 CLAUDE

Done. Two things had to change, because there were two separate blockers.

**The description was stale.** It said an ID token was required — no longer true. Rather than add a flag someone has to remember to flip, `deploy-docs` now reads `predictor-api`'s actual IAM policy and sets `AUTH_MODE` from it. Documenting auth that doesn't exist is worse than documenting none; readers stop believing the page. In `public` mode the token language and the `Authorization` header both disappear from the curl example.

**Try-it-out would still have failed** — not on auth, on CORS. The docs page is served from `predictor-docs` and fetches `predictor-api`: a cross-origin request the browser refuses to *read*, surfacing as a vague network error rather than a 401. `deploy-docs` now sets `CORS_ORIGINS` on the API to the docs URL.

CORS grants no new access here — the same-origin policy is enforced by browsers, not the server, and the API is already open to any `curl`. It's an allowlist of one origin, never `*`; I tested that another origin gets no header.

Verified in containers:

```
docs host (AUTH_MODE=public)      API host (CORS set)
  mentions ID token   False         allowed origin → header present
  mentions Bearer     False         other origin   → none (blocked)
  says no token       True
  POST /predict       404  ← still inert
```

That last line matters: relaxing the API's auth didn't make the public docs host predict. A test pins it.

218 tests pass in all three environments (8 new).

**Deploy:**

```bash
! ./deploy/deploy.sh build && ./deploy/deploy.sh deploy-docs
```

`deploy-docs` detects the public policy, sets both env vars, and wires CORS in one go.

**Worth considering instead:** `https://predictor-api-7j5cx7inrq-as.a.run.app/docs` already returns 200 and works same-origin — Try-it-out functions there today with no CORS and no second service. So `predictor-docs` is now optional, and two hosts serving one page will drift. `deploy-docs` prints that note itself. If you agree, `gcloud run services delete predictor-docs --region asia-southeast1` and skip the CORS hop entirely.

### 2026-08-26T18:19 USER

"metrics": {
    "train_rows": 85222,
    "test_rows": 21306,
    "mdape": 0.1324,
    "mape_mean": 0.1661,
    "within_25pct": 0.7866,
    "p90_coverage": 0.914,
    "quantile_crossing_rate": 0.0011,
    "median_actual_ms": 3248,
    "median_predicted_ms": 3120,
    "baseline_mdape": 0.1258
  }, 
provide me descriptions of these metrics

### 2026-08-26T18:20 CLAUDE

All of these are computed on the **test split only** — the chronologically later 21,306 rows the model never saw during fitting.

## Sample sizes

**`train_rows: 85,222`** — rows the model was fitted on (the earlier 80%).
**`test_rows: 21,306`** — held-out later rows. Every metric below is measured on these.

## Accuracy of the P50 head

**`mdape: 0.1324`** — median of `|predicted − actual| / actual`. Half the predictions land within 13.2% of the truth, half worse. Robust to outliers, which also means it tells you nothing about the tail.

**`mape_mean: 0.1661`** — the same ratio, averaged instead of medianed. That it sits 3.4 points above MdAPE *is* the tail: a minority of bad misses dragging the average up. The gap between these two numbers is the useful signal, not either alone.

**`within_25pct: 0.7866`** — fraction of predictions within ±25% of actual. 78.7%. Where MdAPE describes the midpoint, this describes the bulk — useful when quoting an SLA, since it answers "how often am I roughly right" rather than "what's my typical error".

**`median_actual_ms: 3,248`** / **`median_predicted_ms: 3,120`** — the two medians side by side. Comparing them exposes aggregate bias that MdAPE hides, because MdAPE is symmetric in absolute value. Here the model runs about 3.9% low at the median: mild, and biased toward under-promising.

## The P90 head

**`p90_coverage: 0.914`** — fraction of test rows where the actual came in at or below the predicted P90. Target is 90%. At 91.4% the intervals are slightly *wide* rather than narrow — erring conservative, the safe direction, and closer to target than the 92.6% your previous model scored.

**`quantile_crossing_rate: 0.0011`** — fraction of rows where the raw P90 head predicted *below* the P50 head. The two heads are fitted independently, so this is possible even when aggregate coverage is fine. `Predictor.predict()` clamps `p90 = max(p90, p50)` before returning, since "typical 8.7 s, slow 5.6 s" is indefensible to a user. The rate is reported rather than suppressed on purpose — clamping fixes the symptom, and a high rate would mean the P90 head is undertrained. 0.11% is fine.

## The comparison bar

**`baseline_mdape: 0.1258`** — the portal's own estimator's MdAPE. Note this is a **hardcoded constant** (`predictor/train.py:194`), not recomputed per run. If the portal's model changes, this number silently goes stale.

## The thing worth reading twice

**Your MdAPE of 13.24% is still slightly worse than the 12.58% baseline** — about half a point, ~5% relative.

That's less damning than it looks, because the two models answer different questions. The portal's estimator is keyed on `request_id`, so it can only score a request that has *already run* — useful for spotting anomalies after the fact, no use for capacity planning or quoting an SLA. Yours predicts from the input profile *before* submission. The baseline is a sanity bar, not a fair fight; being within a point of a model that gets to see the request execute is the actual result.

Also: 85,222 + 21,306 = 106,528 rows, up from 69,928. Your cloud harvest pulled ~36k new rows, which answers the open question — the portal **is** reachable from Cloud Run, no VPC egress needed.

Want these written into `/model`'s response as inline field descriptions, so the API documents them rather than requiring this conversation?

### 2026-08-28T10:58 USER

for the training job, are all data points that were harvested used in the training process

### 2026-08-28T10:59 CLAUDE

**No.** Roughly 72% of harvested rows reach the trees. Three separate stages take a cut, and only one of them is visible in the metrics.

## Where the rows go

Using your 106,528-row run:

| Stage | Rows | Note |
|---|---|---|
| Harvested into the CSV | 106,528 | |
| Unparseable `started_at` dropped | −0 | silent; see below |
| Chronological 80/20 split | 85,222 train / **21,306 never fitted** | deliberate |
| sklearn's internal early-stopping holdout | **−~8,522** | invisible |
| **Actually fitted on** | **~76,700** | ~72% of harvest |

## The one that's easy to miss

`_model()` sets `early_stopping=True, validation_fraction=0.1` (`predictor/train.py:109`). sklearn carves a further 10% off whatever you hand `fit()` and uses it to decide when to stop adding trees. I confirmed it on your saved model — both heads have a populated `validation_score_`, so the holdout is real, not just configured.

So **`train_rows: 85,222` is what was passed to `fit()`, not what the trees learned from.** About 8,500 of those rows contributed nothing but a stopping signal.

Two wrinkles worth knowing:

- That inner split is **random, not chronological**. It only decides *when to stop*, never the reported metrics, so it can't inflate your MdAPE. But it does mean early stopping is tuned against rows interleaved with training rows — the exact near-duplicate adjacency the module docstring warns about for the main split.
- Your P50 head ran to `n_iter_=400`, which is `max_iter`. It never triggered early stopping at all, so it paid the 10% cost for nothing. The P90 head did stop, at 126.

## The silent one

`chronological_split` drops rows whose `started_at` won't parse, and reports no count:

```python
dated = [(t, r) for t, r in dated if t is not None]
```

Zero rows in your current data, so nothing is being lost today. But if the portal ever changes its timestamp format, training would quietly shrink instead of failing — and the only symptom would be a `train_rows` number nobody was watching.

## Upstream of all this

`harvest` is already selective before the CSV exists: only `status:succeeded` is pulled (a failed request's duration measures how long it took to give up), and rows with missing timestamps are counted as `skipped`. So "all harvested data points" is itself a filtered view of portal traffic.

Two cheap fixes if you want them: have `chronological_split` report what it dropped, and either raise `max_iter` or set `early_stopping=False` for the P50 head so it stops paying for a validation set it never uses. Want me to do either?

### 2026-08-31T13:28 USER

when doing a harvest allow the API key [REDACTED_SECRET] to be considered. It is in the nbai org

### 2026-08-31T13:29 CLAUDE

Before I build this — the key is a live secret and I want to get two things right.

### 2026-08-31T13:30 CLAUDE

Building the carve-out. The key stays out of source and out of argv — env var only, backed by Secret Manager in Cloud Run.

### 2026-08-31T13:30 CLAUDE

Now tests — including that the key never reaches the CSV or the logs.

### 2026-08-31T13:31 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("deploy/deploy.sh")
s = p.read_text()

old = '''#   ./deploy/deploy.sh grant-admin  user:a@b.com'''
new = '''#   ./deploy/deploy.sh set-apikeys      # carve API keys out of an org exclusion
#   ./deploy/deploy.sh grant-admin  user:a@b.com'''
assert old in s
s = s.replace(old, new)

old = '''cmd_grant_admin() {'''
new = '''APIKEY_SECRET="${APIKEY_SECRET:-predictor-harvest-apikeys}"

cmd_set_apikeys() {
  # Keys whose traffic is harvested even from an excluded org (see
  # predictor/harvest.py). Read from STDIN and stored in Secret Manager --

### 2026-08-31T13:32 CLAUDE

The key is still sitting in the test as a fixture — that would commit a live secret to git. Replacing it with a fake.

### 2026-08-31T13:33 CLAUDE

Done. The carve-out re-queries each excluded org and keeps only rows made with the named keys — `nbai` smoke traffic stays out, that one key's requests come in.

**Verified behaviour** (stub portal with 4 matching + 6 non-matching `nbai` rows):

- without the carve-out: no `nbai` rows at all
- with it: the 4 matching rows land, the 6 others stay excluded
- `main_rows + strata + apikey_rows == rows`, so the accounting balances

**The key never lands anywhere it shouldn't.** `apikey` isn't in `RAW_COLUMNS`, so it can't reach the CSV — and since that CSV lives in a versioned bucket, a leak there would be permanent. Tests assert the key is absent from the file, absent from the summary dict, and rendered only as `0123...cdef` in logs.

**It's an env var, not a flag** — deliberately. A key in argv is in `ps`, in shell history, and in the Cloud Run job's stored config where the console shows it. There's a test that fails if someone later adds an `--apikey` flag for convenience.

## To enable it

Locally:
```
! HARVEST_INCLUDE_APIKEYS=<key> python3 -m predictor harvest
```

In GCP — reads from stdin, stores in Secret Manager, grants the job `secretAccessor`, mounts it:
```
! ./deploy/deploy.sh set-apikeys
```

I deliberately didn't run that myself, so the key doesn't pass through another tool call.

## Two things to flag

**Rotate this key.** It's now in this conversation's transcript in plaintext. I kept it out of the repo — I'd initially used it as the test fixture and caught that before finishing, so it's a fabricated key there now — but the transcript itself is exposure you didn't intend. If it's a live production key, rotate it and store the new one via `set-apikeys`.

**The carve-out is uncapped**, unlike the rare-segment top-up which is bounded at 10% of the main pull. If that key is high-volume, its traffic could become a large share of training data. `--limit` bounds it in practice and the run reports the count per org, so you'll see it — but if you'd rather it were capped, say so and I'll add one.

### 2026-08-31T13:39 USER

deploy changes

### 2026-08-31T13:39 CLAUDE

[CMD] echo "=== job env/secrets ==="
gcloud run jobs describe predictor-job --region asia-southeast1 --format=json 2>/dev/null | python3 -c "
import json,sys
c=json.load(sys.stdin)['spec']['template']['spec']['template']['spec']['containers'][0]
for e in c.get('env',[]):
    src='secret' if 'valueFrom' in e else 'plain'
    print(f'  {e[\"name\"]:26} {src}')
"
echo "=== api service env ==="
gcloud run services describe predictor-api --region asia-southeast1 --format=json 2>/dev/null | python3 -c "
import json,sys
c=json.load(sys.stdin)['spec']['template']['spec']['containers'][0]
for e in c.get('env

### 2026-08-31T13:40 CLAUDE

`--set-env-vars` replaces the whole env block — that would wipe `CORS_ORIGINS` now, and silently drop the harvest key once `set-apikeys` has run. Fixing that before I deploy.

### 2026-08-31T13:42 CLAUDE

[CMD] echo "=== did --no-allow-unauthenticated revoke public access? ==="
gcloud run services get-iam-policy predictor-api --region asia-southeast1 --format=json 2>/dev/null | grep -c allUsers | sed 's/^0$/NO allUsers binding - public access REMOVED/;s/^1$/allUsers still present/'
curl -s -o /dev/null -w "  unauthenticated GET /model -> HTTP %{http_code}\n" https://predictor-api-7j5cx7inrq-as.a.run.app/model

### 2026-08-31T13:42 CLAUDE

`--no-allow-unauthenticated` in `cmd_deploy` just revoked the public access you'd added. Restoring it, then fixing the script so a deploy can't silently flip your auth posture again.

### 2026-08-31T13:42 CLAUDE

[CMD] gcloud run services add-iam-policy-binding predictor-api --region asia-southeast1 \
  --member allUsers --role roles/run.invoker >/dev/null 2>&1 && echo "allUsers restored"
gcloud run services get-iam-policy predictor-api --region asia-southeast1 --format=json 2>/dev/null | grep -c allUsers | sed 's/^1$/  confirmed: allUsers has run.invoker/'

### 2026-08-31T13:43 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("deploy/deploy.sh")
s = p.read_text()

# api_is_public is defined further down; move the helper above cmd_deploy so
# cmd_deploy can call it.
helper = '''api_is_public() {
  # Read the API's ACTUAL policy rather than trusting a flag. The docs must not
  # claim a token is required when it is not, or vice versa.
  gcloud run services get-iam-policy "$SERVICE" --project "$PROJECT" \\
    --region "$REGION" --format=json 2>/dev/null \\
    | grep -q '"allUsers"'
}

'''
assert helper in s
s = s.replace(helper, "", 1)
s = s.replace("cmd_deploy() {"

### 2026-08-31T13:43 CLAUDE

[CMD] ./deploy/deploy.sh deploy 2>&1 | grep -E "keeping|revision|Service URL|job|successfully" | head -8
echo "=== auth posture after a second deploy ==="
gcloud run services get-iam-policy predictor-api --region asia-southeast1 --format=json 2>/dev/null | grep -c allUsers | sed 's/^1$/  allUsers preserved/;s/^0$/  LOST AGAIN/'

### 2026-08-31T13:44 CLAUDE

[CMD] API=https://predictor-api-7j5cx7inrq-as.a.run.app
DOCS=https://predictor-docs-7j5cx7inrq-as.a.run.app
echo "=== API (unauthenticated) ==="
for p in /docs /model /readyz; do printf "  %-9s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' $API$p)"; done
printf "  %-9s %s\n" "/predict" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $API/predict -H 'Content-Type: application/json' -d '{"vehicles":12,"jobs":400,"locations":412}')"
echo "=== CORS from the docs origin ==="
curl -s -D- -o /dev/null -X POST $API/predict -H "Origin: $DOCS" -H 'Content-Type: application/json' -d '{"vehicles":1,"jo

### 2026-08-31T13:45 CLAUDE

Deployed and verified.

```
API (unauthenticated)          /docs 200  /model 200  /readyz 200  /predict 200
CORS from docs origin          access-control-allow-origin: <docs host>
Docs host                      no token language · /predict still 404
Job                            running the new image
```

Everything from the last few turns is live: the API-key carve-out, the CORS wiring, and the auth-aware docs description.

## Two things I had to fix mid-deploy

**`deploy` was revoking your public access.** `cmd_deploy` had `--no-allow-unauthenticated` hardcoded, so the first run stripped the `allUsers` binding you'd added. This is a nasty one to catch: immediately afterward the IAM policy showed no `allUsers` while unauthenticated requests *still returned 200*, because the revocation hadn't propagated to the edge yet. If I'd only spot-checked with curl it would have looked fine, and the service would have gone dark a minute later.

`cmd_deploy` now reads the live policy and preserves whatever posture the service has, printing `keeping this service PUBLIC` when it does. I redeployed to confirm the binding survives. It does.

**`--set-env-vars` replaces the whole env block.** I switched the service and job to `--update-env-vars` before deploying. Left as it was, this deploy would have wiped `CORS_ORIGINS`, and — more seriously — the next deploy after you run `set-apikeys` would have silently dropped `HARVEST_INCLUDE_APIKEYS`. The harvest would have quietly stopped including the carved-out key with no error anywhere.

Both were bugs in code I wrote earlier in this session, and neither would have surfaced until something broke in production.

## Not yet done

`set-apikeys` hasn't been run — the job has no `HARVEST_INCLUDE_APIKEYS`, so the carve-out is deployed but inactive. When you're ready:

```
! ./deploy/deploy.sh set-apikeys
```

Still worth rotating that key first, given it's in this transcript.

### 2026-08-31T13:46 USER

<bash-input> ./deploy/deploy.sh set-apikeys</bash-input>

### 2026-08-31T13:46 USER

<bash-stdout></bash-stdout><bash-stderr>Created secret [predictor-harvest-apikeys].
Paste the API key(s), comma-separated, then press Ctrl-D:
ERROR: (gcloud.secrets.versions.add) INVALID_ARGUMENT: Secret Payload cannot be empty.
</bash-stderr>

### 2026-08-31T13:46 CLAUDE

Claude Code's `!` doesn't give the command a TTY, so `--data-file=-` saw EOF immediately. The secret was created but has no version, and `set -e` stopped the rest. Let me make it work both interactively and piped.

### 2026-08-31T13:46 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("deploy/deploy.sh")
s = p.read_text()

old = '''  echo "Paste the API key(s), comma-separated, then press Ctrl-D:" >&2
  gcloud secrets versions add "$APIKEY_SECRET" --project "$PROJECT" --data-file=-
'''
new = '''  # Read the key without it ever reaching argv. Two paths, because a wrapper
  # that runs commands without a TTY (Claude Code's `!`, CI) hits EOF on
  # --data-file=- immediately and stores an empty payload.
  local keys
  if [[ -t 0 ]]; then
    read -rsp "Paste the API key(s), comma-separated, then Enter: " keys
    echo >&2
  els

### 2026-08-31T13:47 CLAUDE

Fixed. The trailing newline is stripped (no `0a` at the end of that hexdump), and empty input now fails with a clear message instead of storing an empty payload.

The secret exists but has no versions, so nothing is half-configured — the `set -e` abort left it clean.

## How to run it

**In a real terminal** (outside Claude Code) — the key never touches argv or shell history:

```bash
./deploy/deploy.sh set-apikeys
# Paste the API key(s), comma-separated, then Enter:   ← input is hidden
```

`read -rsp` doesn't echo, so it stays out of your scrollback too.

**If you'd rather stay in Claude Code**, pipe from a file and delete it:

```
! ./deploy/deploy.sh set-apikeys < ~/key.txt && rm -P ~/key.txt
```

I'd avoid `printf %s 'KEY' | ./deploy/deploy.sh set-apikeys` — that puts the key back in argv and shell history, which is the thing the env-var design exists to prevent.

Either way, once it succeeds the script grants the job's service account `secretAccessor` and mounts the secret as `HARVEST_INCLUDE_APIKEYS`. Verify with:

```
! gcloud run jobs describe predictor-job --region asia-southeast1 --format='value(spec.template.spec.template.spec.containers[0].env)'
```

You should see `HARVEST_INCLUDE_APIKEYS` as a secret reference, not a plain value. Then the next harvest will report `+N rows from nbai for key(s) d691...b0f6`.

### 2026-08-31T14:23 USER

error on harvest 
gcloud run jobs execute predictor-job --region asia-southeast1 --wait --args harvest
X Creating execution... Task predictor-job-cd5cm-task0 failed with exit code: 2 and message: The container exited with an error.                     
  ✓ Provisioning resources... Provisioned imported containers.                                                                                       
  ✓ Starting execution... Started deployed execution in 11.23s.                                                                                      
  X Running execution... 0 / 1 complete                                                                                                              
Executing job failed                                                                                                                                 
ERROR: (gcloud.run.jobs.execute) The execution failed.
View details about this execution by running:
gcloud run jobs executions describe predictor-job-cd5cm

### 2026-08-31T14:23 CLAUDE

Exit code 2 is specific — that's `ConcurrentWrite` in my CLI, not a generic failure. Let me read the actual logs rather than guess.

### 2026-08-31T14:23 CLAUDE

[CMD] gcloud logging read \
  'resource.type=cloud_run_job AND resource.labels.job_name=predictor-job AND labels."run.googleapis.com/execution_name"="predictor-job-cd5cm"' \
  --project [GCP_PROJECT] --limit 40 --format='value(textPayload)' 2>&1 | tac | head -40

### 2026-08-31T14:24 CLAUDE

Two separate things in that log. Let me check what actually wrote the dataset.

### 2026-08-31T14:24 CLAUDE

[CMD] echo "=== recent executions ==="
gcloud run jobs executions list --job predictor-job --region asia-southeast1 \
  --format='table(name,status.startTime,status.completionTime,status.succeededCount,status.failedCount)' 2>&1 | head -8
echo "=== current dataset generation ==="
gcloud storage objects describe gs://[GCP_PROJECT]-predictor/data/requests.csv \
  --format='value[separator="  "](generation,updated,size)' 2>&1
echo "=== scheduler jobs ==="
gcloud scheduler jobs list --location asia-southeast1 --format='value(name,schedule,state)' 2>&1 | head -3

### 2026-08-31T14:24 CLAUDE

Nothing is broken — the precondition did exactly its job. Look at the overlap:

```
predictor-job-2twws   13:35:51 → 14:06:53   succeeded
predictor-job-cd5cm   13:48:31 → 14:19:33   FAILED  ← yours
```

Your run started at 13:48 while `2twws` was still going. Both read the same generation; `2twws` finished first and wrote; yours then tried to write over it and was refused. **Without that check it would have silently discarded ~30 minutes of `2twws`'s harvested rows.** The dataset is intact — now 27.5 MB, up from 13.3 MB.

But the log exposed a real defect of mine:

### 2026-08-31T14:25 CLAUDE

[CMD] python3 - <<'PY'
from pathlib import Path
p = Path("tests/test_serving.py")
s = p.read_text()
old = '''class TestEditableLeavesLocalPathsAlone(unittest.TestCase):'''
new = '''class TestRemotePathsAreNotTreatedAsFilesystemPaths(unittest.TestCase):
    """Path("gs://b/x") silently collapses to "gs:/b/x", and a remote object
    never exists() locally. Both bugs shipped: every cloud harvest printed a
    mangled URI and claimed to be starting fresh while it was appending."""

    def test_a_uri_survives_being_shown(self):
        uri = "gs://bucket/data/requests.csv"
        self.assertEqual(str(

### 2026-08-31T14:26 CLAUDE

**Nothing is broken and nothing was lost.** Re-run when no other execution is going:

```
! gcloud run jobs executions list --job predictor-job --region asia-southeast1 --limit 3
```

A full `--limit 100000` harvest takes ~30 minutes at the observed 46 rows/s, so it's easy to overlap without noticing.

Also worth knowing: the carve-out worked. That failed run had already found `+189 rows from nbai for key(s) d691...b0f6` before the write was refused.

## Two defects the log exposed

**The URI was mangled in the output** — `gs:/nextbillion-...` with one slash. `cmd_harvest` was doing `Path(args.out)` for display, and `Path("gs://b/x")` collapses the double slash. Worse, it used `dest.exists()` to pick the verb, and a remote object never exists on the local filesystem — so **every cloud harvest printed "Harvesting up to…" while actually appending**, and suppressed the "rows already in the file are skipped" note. The harvest itself was always correct; only the reporting lied. It now asks the store.

**My `--parallelism 1` claim was wrong.** I'd written in `DEPLOY.md` that it means overlapping runs "mostly do not arise". It doesn't — it bounds tasks *within* one execution, not concurrent executions of the job. Two `jobs execute` calls run side by side quite happily, which is precisely what happened. Docs corrected, and the error message now says so and tells you to check for overlap.

Two regression tests pin the `Path()` collapse (231 total, all passing).

These are display and documentation fixes, not deploy-blocking — but if you want them live before the next harvest:

```
! ./deploy/deploy.sh build && ./deploy/deploy.sh deploy
```
