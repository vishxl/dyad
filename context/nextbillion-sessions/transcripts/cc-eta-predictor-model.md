# ETA predictor model + GCP deploy session — full transcript

Source: `e7495ec5-5c26-4b14-8244-870955e8c793.jsonl` · 2026-08-25 → 2026-08-31

Verbatim extraction, nothing dropped except system noise and tool outputs.

### USER (2026-08-25T18:47:13.946Z)

what does this mean in the output of a predict "Model MdAPE 12.5% on held-out later data; P90 covered 87% of it."

### CLAUDE (2026-08-25T18:47:19.583Z)

**[tool: Bash]**
```
# Search for MdAPE references
cd /Users/[USER]/workspace && grep -rIl --exclude-dir=node_modules --exclude-dir=.git -e "MdAPE" -e "mdape" . 2>/dev/null | head -20
```

### CLAUDE (2026-08-25T18:47:38.472Z)

No hits for `MdAPE` anywhere in your workspace, so this is a generic metrics line rather than something I can trace to code. Reading it as written:

**MdAPE 12.5%** — Median Absolute Percentage Error. Half the predictions landed within 12.5% of the actual value, half were worse. It's the *median*, so it's robust to a few catastrophic misses — which also means it tells you nothing about the tail. Mean APE on the same set is almost always noticeably higher.

**Held-out later data** — the split was by time, not random. The model was trained on an earlier period and scored on a period it never saw. That's the honest test for anything forecasting-shaped: a random split leaks future information through neighboring rows, and typically flatters the model.

**P90 covered 87% of it** — the model emits an interval (or an upper bound) it claims will contain the truth 90% of the time. On the holdout it actually contained 87%. So the uncertainty estimates are mildly too narrow — the model is slightly overconfident, not badly miscalibrated.

Whether that 3-point gap is real or noise depends on holdout size. Standard error on a coverage estimate is roughly √(0.9·0.1/n): you need ~400+ held-out points before 87% is distinguishable from 90% at two standard errors. Below that, it's consistent with a well-calibrated model.

Two things the line doesn't tell you, worth knowing before you trust it:

- **Direction of error.** MdAPE is symmetric in absolute value, so a model that systematically under-predicts by 12% scores identically to one that's unbiased but noisy. Check median signed percentage error alongside it.
- **Where the misses are.** MdAPE aggregates over the whole holdout. If error is concentrated in high-value or low-volume segments, the headline number hides it. Bucket the APE by whatever segment matters and look at the spread.

If the P90 is a one-sided bound rather than the upper end of an 80% interval, the reading is the same — actuals fell under the bound 87% of the time instead of the advertised 90%.

### USER (2026-08-25T18:53:34.211Z)

when I harvest new data I want it to append to any existing CSV dataset that is present.

### CLAUDE (2026-08-25T18:53:37.517Z)

**[tool: Bash]**
```
# List project root
ls -la && echo "---GIT---" && git log --oneline -10 2>/dev/null
```

### CLAUDE (2026-08-25T18:53:40.910Z)

**[tool: Bash]**
```
# List predictor and data files
find predictor explain data models -type f -not -path "*/node_modules/*" -not -path "*/__pycache__/*" | head -60 && echo "===DATA===" && ls -la data models out
```

### CLAUDE (2026-08-25T18:53:42.544Z)

**[tool: Bash]**
```
# Read harvest.py
cat predictor/harvest.py
```

### CLAUDE (2026-08-25T18:53:44.962Z)

**[tool: Bash]**
```
# Read harvest CLI wiring
grep -n "harvest" -A40 predictor/cli.py | head -100
```

### CLAUDE (2026-08-25T18:53:47.124Z)

**[tool: Bash]**
```
# Read harvest argparse block
grep -n "add_parser(\"harvest\"\|add_parser('harvest'" -A25 predictor/cli.py
```

### CLAUDE (2026-08-25T18:54:00.458Z)

**[tool: Bash]**
```
# Check train split logic and CSV header
grep -n "sort\|started_at\|holdout\|split" predictor/train.py | head -40; echo "===ROWS==="; wc -l data/requests.csv; head -1 data/requests.csv
```

### CLAUDE (2026-08-25T18:54:40.700Z)

**[tool: Bash]**
```
# Inspect portal query builder and iterator
grep -n "def build_query" -A40 explain/portal.py; echo "===ITER==="; grep -n "def iter_requests" -A40 explain/portal.py
```

### CLAUDE (2026-08-25T18:54:44.016Z)

Now I'll implement it.

### CLAUDE (2026-08-25T18:55:08.820Z)

**[tool: Bash]**
```
# Patch harvest.py for append mode
python3 - <<'PY'
from pathlib import Path
p = Path("predictor/harvest.py")
s = p.read_text()

# 1. Module docstring note
old = '''Only `status:succeeded` rows are harvested. A failed request's duration
measures how long it took to give up, which is a different quantity and would
poison the target.
"""'''
new = '''Only `status:succeeded` rows are harvested. A failed request's duration
measures how long it took to give up, which is a different quantity and would
poison the target.

Harvesting APPENDS to an existing dataset by default, skipping request_ids the
file already holds. The list API returns newest-first, so a repeat harvest
re-walks rows already on disk; without the dedupe those rows would be written
twice and the most recent traffic would carry double weight in training.
"""'''
assert old in s
s = s.replace(old, new)

# 2. Helpers before harvest()
old = '''def harvest(
    dest: Path,
    limit: int = 100_000,'''
new = '''def _scan_existing(path: Path) -> dict:
    """Header, request_ids and time span of a dataset already on disk.

    Only two columns are kept, so this stays cheap on a large CSV -- the point
    is to avoid re-writing rows we already have, not to load the dataset.
    """
    info = {"header": None, "ids": set(), "rows": 0, "oldest": None, "newest": None}
    with open(path, newline="") as fh:
        reader = csv.reader(fh)
        try:
            info["header"] = next(reader)
        except StopIteration:
            return info                      # header-less empty file: start fresh
        try:
            i_id = info["header"].index("request_id")
            i_ts = info["header"].index("started_at")
        except ValueError:
            return info                      # odd header; the check in harvest() rejects it
        for row in reader:
            if not row:
                continue
            info["rows"] += 1
            info["ids"].add(row[i_id])
            ts = parse_ts(row[i_ts]) if i_ts < len(row) else None
            if ts:
                info["oldest"] = min(info["oldest"] or ts, ts)
                info["newest"] = max(info["newest"] or ts, ts)
    return info


def _ends_with_newline(path: Path) -> bool:
    """A run killed mid-write can leave a truncated final line."""
    with open(path, "rb") as fh:
        if fh.seek(0, 2) == 0:
            return True
        fh.seek(-1, 2)
        return fh.read(1) in (b"\\n", b"\\r")


def harvest(
    dest: Path,
    limit: int = 100_000,'''
assert old in s
s = s.replace(old, new)

# 3. signature: add append
old = '''    client: PortalClient | None = None,
    stratify: bool = True,
) -> dict:
    """Stream rows into a CSV. Returns a summary dict.

    `client` is injectable so the filter logic can be tested against a stub
    portal rather than only against production.
    """'''
new = '''    client: PortalClient | None = None,
    stratify: bool = True,
    append: bool = True,
) -> dict:
    """Stream rows into a CSV. Returns a summary dict.

    With `append` (the default) an existing `dest` is added to rather than
    replaced, and request_ids already in the file are skipped. Set it False to
    start the dataset over.

    `client` is injectable so the filter logic can be tested against a stub
    portal rather than only against production.
    """'''
assert old in s
s = s.replace(old, new)

# 4. append setup + state
old = '''    state = {"kept": 0, "skipped": 0, "oldest": None, "newest": None}
    seen: set[str] = set()
    started = time.monotonic()
    strata_counts: dict[str, int] = {}

    with open(dest, "w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=RAW_COLUMNS, extrasaction="ignore")
        writer.writeheader()
'''
new = '''    existing = {"header": None, "ids": set(), "rows": 0, "oldest": None, "newest": None}
    if append and dest.exists() and dest.stat().st_size > 0:
        existing = _scan_existing(dest)
    appending = bool(existing["header"])

    # DictWriter emits values in RAW_COLUMNS order regardless of what the file
    # says, so appending under a different header silently files every value
    # under the wrong column. Refuse instead.
    if appending and existing["header"] != list(RAW_COLUMNS):
        raise ValueError(
            f"{dest} has different columns than this harvest writes, so appending "
            "would misalign every new row.\\n"
            f"  file:    {','.join(existing['header'])}\\n"
            f"  harvest: {','.join(RAW_COLUMNS)}\\n"
            "Harvest to a fresh --out, or pass --overwrite to replace the file."
        )
    if appending and not _ends_with_newline(dest):
        with open(dest, "a", newline="") as fh:
            fh.write("\\r\\n")

    state = {"kept": 0, "skipped": 0, "duplicates": 0, "oldest": None, "newest": None}
    # Seeded from the file so a repeat harvest adds only what is genuinely new.
    seen: set[str] = set(existing["ids"])
    started = time.monotonic()
    strata_counts: dict[str, int] = {}

    with open(dest, "a" if appending else "w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=RAW_COLUMNS, extrasaction="ignore")
        if not appending:
            writer.writeheader()
'''
assert old in s
s = s.replace(old, new)

# 5. duplicate counter
old = '''                    if rid in seen:
                        continue          # strata overlap the main pull'''
new = '''                    if rid in seen:
                        # Strata overlap the main pull, and on an append run
                        # most of the main pull is already on disk.
                        state["duplicates"] += 1
                        continue'''
assert old in s
s = s.replace(old, new)

# 6. summary
old = '''    return {
        "query": query,
        "main_rows": state["kept"] - sum(strata_counts.values()),
        "rows": state["kept"],
        "skipped": state["skipped"],
        "strata": strata_counts,
        "seconds": round(time.monotonic() - started, 1),
        "path": str(dest),
        "oldest": state["oldest"].isoformat() if state["oldest"] else None,
        "newest": state["newest"].isoformat() if state["newest"] else None,
    }'''
new = '''    span = [t for t in (existing["oldest"], existing["newest"],
                        state["oldest"], state["newest"]) if t]
    return {
        "query": query,
        "appended": appending,
        "existing_rows": existing["rows"],
        "main_rows": state["kept"] - sum(strata_counts.values()),
        "rows": state["kept"],
        "total_rows": existing["rows"] + state["kept"],
        "skipped": state["skipped"],
        "duplicates": state["duplicates"],
        "strata": strata_counts,
        "seconds": round(time.monotonic() - started, 1),
        "path": str(dest),
        # `oldest`/`newest` describe the rows added by THIS run; `file_*`
        # describes the dataset as it now stands.
        "oldest": state["oldest"].isoformat() if state["oldest"] else None,
        "newest": state["newest"].isoformat() if state["newest"] else None,
        "file_oldest": min(span).isoformat() if span else None,
        "file_newest": max(span).isoformat() if span else None,
    }'''
assert old in s
s = s.replace(old, new)

p.write_text(s)
print("harvest.py patched")
PY
```

### CLAUDE (2026-08-25T18:55:25.266Z)

**[tool: Bash]**
```
# Patch cli.py for --overwrite and append reporting
python3 - <<'PY'
from pathlib import Path
p = Path("predictor/cli.py")
s = p.read_text()

old = '''    dest = Path(args.out)
    print(f"Harvesting up to {args.limit:,} rows into {dest} ...")
    print("  (list API only -- no input payloads are fetched or stored)")'''
new = '''    dest = Path(args.out)
    append = not args.overwrite
    exists = dest.exists() and dest.stat().st_size > 0
    verb = "Appending up to" if (append and exists) else "Harvesting up to"
    print(f"{verb} {args.limit:,} rows into {dest} ...")
    print("  (list API only -- no input payloads are fetched or stored)")
    if append and exists:
        print("  rows already in the file are skipped, so --limit walks the API "
              "list\\n  and keeps only what is new since the last harvest")
    elif args.overwrite and exists:
        print(f"  --overwrite: replacing the existing {dest}")'''
assert old in s
s = s.replace(old, new)

old = '''    summary = harvest(dest, limit=args.limit, q=args.q, org=args.org,
                      deployment=args.deployment, exclude_orgs=args.exclude_org,
                      stratify=stratify)
    print(f"  filter: {summary['query']}")
    print(f"\\n  {summary['rows']:,} rows in {summary['seconds']}s "
          f"({summary['skipped']:,} skipped for missing timestamps)")
    if summary["oldest"]:
        print(f"  covering {summary['oldest']} .. {summary['newest']}")'''
new = '''    try:
        summary = harvest(dest, limit=args.limit, q=args.q, org=args.org,
                          deployment=args.deployment, exclude_orgs=args.exclude_org,
                          stratify=stratify, append=append)
    except ValueError as e:  # incompatible header on the file being appended to
        print(f"\\n{e}", file=sys.stderr)
        return 1
    print(f"  filter: {summary['query']}")
    print(f"\\n  +{summary['rows']:,} rows in {summary['seconds']}s "
          f"({summary['skipped']:,} skipped for missing timestamps, "
          f"{summary['duplicates']:,} already held)")
    if summary["appended"]:
        print(f"  {dest} now holds {summary['total_rows']:,} rows "
              f"({summary['existing_rows']:,} were already there)")
    if summary["oldest"]:
        print(f"  new rows cover {summary['oldest']} .. {summary['newest']}")
    if summary["appended"] and summary["file_oldest"]:
        print(f"  dataset covers {summary['file_oldest']} .. {summary['file_newest']}")'''
assert old in s
s = s.replace(old, new)

# thin-dataset warning should look at the whole file, not just this run
old = '''    if summary["rows"] < 1000:
        print("\\n  That is thin for training. Raise --limit, or widen --q.",
              file=sys.stderr)
        return 1
    return 0'''
new = '''    if summary["rows"] == 0 and summary["appended"]:
        print("\\n  Nothing new -- every row the query returned is already in the "
              "file.", file=sys.stderr)
    if summary["total_rows"] < 1000:
        print("\\n  That is thin for training. Raise --limit, or widen --q.",
              file=sys.stderr)
        return 1
    return 0'''
assert old in s
s = s.replace(old, new)

old = '''    h.add_argument("--out", default=str(DATA))'''
new = '''    h.add_argument("--out", default=str(DATA))
    h.add_argument("--overwrite", action="store_true",
                   help="replace the dataset instead of appending to it. By "
                        "default an existing --out is appended to, skipping "
                        "request_ids it already holds.")'''
assert old in s
s = s.replace(old, new)

p.write_text(s)
print("cli.py patched")
PY
```

### CLAUDE (2026-08-25T18:55:27.528Z)

**[tool: Bash]**
```
# Find harvest tests
ls tests && grep -rn "harvest(" tests | head -20
```

### CLAUDE (2026-08-25T18:55:29.423Z)

**[tool: Bash]**
```
# Read harvest tests
sed -n 200,380p tests/test_portal.py
```

### CLAUDE (2026-08-25T18:55:31.657Z)

Now let me add tests for the new behavior and run the suite.

### CLAUDE (2026-08-25T18:55:53.791Z)

**[tool: Bash]**
```
# Add append tests
python3 - <<'PY'
from pathlib import Path
p = Path("tests/test_portal.py")
s = p.read_text()

old = '''class TestSingleOrgQueries(unittest.TestCase):'''
new = '''class TestAppendingToAnExistingDataset(unittest.TestCase):
    """A second harvest must grow the dataset, not replace or duplicate it.

    The list API returns newest-first, so a repeat harvest re-walks rows that
    are already on disk. Writing them again would double-weight the most
    recent traffic in a model whose split is chronological.
    """

    @classmethod
    def setUpClass(cls):
        cls.srv = HTTPServer(("127.0.0.1", 0), StubPortal)
        threading.Thread(target=cls.srv.serve_forever, daemon=True).start()
        cls.client = PortalClient(
            portal_base=f"http://127.0.0.1:{cls.srv.server_port}/api", pause_s=0)
        for r in ROWS:
            r.setdefault("started_at", "2026-08-19T12:00:00Z")
            r.setdefault("completed_at", "2026-08-19T12:00:02Z")

    @classmethod
    def tearDownClass(cls):
        cls.srv.shutdown()

    def _harvest(self, dest, **kw):
        from predictor.harvest import harvest
        kw.setdefault("stratify", False)
        return harvest(dest, limit=50, q="", deployment="d",
                       client=self.client, **kw)

    def _rows(self, dest):
        import csv as _csv
        with open(dest, newline="") as fh:
            return list(_csv.DictReader(fh))

    def test_second_harvest_keeps_the_first_run_rows(self):
        import tempfile

        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            first = self._harvest(dest)
            ids_before = {r["request_id"] for r in self._rows(dest)}
            self.assertTrue(ids_before)

            second = self._harvest(dest)
            after = self._rows(dest)
            self.assertTrue(second["appended"])
            self.assertTrue(ids_before <= {r["request_id"] for r in after},
                            "appending dropped rows the first harvest wrote")
            self.assertEqual(second["existing_rows"], first["rows"])
            self.assertEqual(second["total_rows"], len(after))

    def test_rows_already_held_are_not_written_twice(self):
        import tempfile

        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            self._harvest(dest)
            summary = self._harvest(dest)
            ids = [r["request_id"] for r in self._rows(dest)]
            self.assertEqual(len(ids), len(set(ids)), "duplicate request_ids on disk")
            self.assertEqual(summary["rows"], 0, "same stub data, so nothing is new")
            self.assertGreater(summary["duplicates"], 0)

    def test_only_one_header_row_ends_up_in_the_file(self):
        import tempfile
        from predictor.harvest import RAW_COLUMNS

        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            self._harvest(dest)
            self._harvest(dest)
            with open(dest, newline="") as fh:
                lines = [ln for ln in fh.read().splitlines() if ln.strip()]
            self.assertEqual(sum(1 for ln in lines if ln.startswith("request_id,")), 1)
            self.assertEqual(lines[0], ",".join(RAW_COLUMNS))

    def test_overwrite_replaces_the_file(self):
        import tempfile

        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            self._harvest(dest)
            summary = self._harvest(dest, append=False)
            self.assertFalse(summary["appended"])
            self.assertEqual(summary["existing_rows"], 0)
            self.assertEqual(summary["rows"], len(self._rows(dest)))

    def test_a_mismatched_header_is_refused_rather_than_misaligned(self):
        """DictWriter writes in RAW_COLUMNS order whatever the file says."""
        import tempfile

        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            dest.write_text("request_id,started_at,duration_ms\\nr1,x,1\\n")
            with self.assertRaises(ValueError) as ctx:
                self._harvest(dest)
            self.assertIn("misalign", str(ctx.exception))

    def test_a_truncated_final_line_does_not_swallow_the_next_row(self):
        """An interrupted run can leave the file without a trailing newline."""
        import tempfile

        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            self._harvest(dest)
            with open(dest, "rb+") as fh:          # strip the trailing newline
                fh.seek(0, 2)
                end = fh.tell()
                fh.seek(end - 2)
                if fh.read(2) == b"\\r\\n":
                    fh.truncate(end - 2)
            ROWS.append({"deployment_id": "d", "request_id": "appended-1",
                         "org_code": "mnx.com", "jobs_count": 3,
                         "started_at": "2026-08-20T12:00:00Z",
                         "completed_at": "2026-08-20T12:00:05Z"})
            try:
                self._harvest(dest)
                ids = [r["request_id"] for r in self._rows(dest)]
            finally:
                ROWS.pop()
            self.assertIn("appended-1", ids)
            self.assertEqual(len(ids), len(set(ids)))
            self.assertNotIn(None, ids, "a row was mangled by the missing newline")

    def test_span_reported_covers_the_whole_file_not_just_the_new_rows(self):
        import tempfile

        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            self._harvest(dest)
            ROWS.append({"deployment_id": "d", "request_id": "later-1",
                         "org_code": "mnx.com", "jobs_count": 3,
                         "started_at": "2026-09-01T12:00:00Z",
                         "completed_at": "2026-09-01T12:00:05Z"})
            try:
                summary = self._harvest(dest)
            finally:
                ROWS.pop()
            self.assertEqual(summary["oldest"], "2026-09-01T12:00:00+00:00")
            self.assertLess(summary["file_oldest"], summary["oldest"],
                            "file span should reach back before this run")
            self.assertEqual(summary["file_newest"], summary["newest"])


class TestSingleOrgQueries(unittest.TestCase):'''
assert old in s
s = s.replace(old, new, 1)
p.write_text(s)
print("tests added")
PY
```

### CLAUDE (2026-08-25T18:55:55.906Z)

**[tool: Bash]**
```
# Run portal tests
source .venv/bin/activate 2>/dev/null; python3 -m unittest tests.test_portal -v 2>&1 | tail -40
```

### CLAUDE (2026-08-25T18:56:00.119Z)

**[tool: Bash]**
```
# Run full suite and check help
source .venv/bin/activate 2>/dev/null; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | tail -15; echo "=== HELP ==="; python3 -m predictor harvest --help
```

### CLAUDE (2026-08-25T18:56:52.715Z)

**[tool: Bash]**
```
# Find harvest docs
grep -n "harvest" PREDICTOR.md | head -30
```

### CLAUDE (2026-08-25T18:56:54.726Z)

**[tool: Bash]**
```
# Read doc sections
sed -n 1,40p PREDICTOR.md; echo "=== 340 ==="; sed -n 338,360p PREDICTOR.md
```

### CLAUDE (2026-08-25T18:57:03.618Z)

**[tool: Bash]**
```
# Update PREDICTOR.md, check README
python3 - <<'PY'
from pathlib import Path
p = Path("PREDICTOR.md")
s = p.read_text()

old = '''Override with `--deployment ''` (all deployments), `--exclude-org CODE`
(repeatable), or `--q` for any other portal filter term.'''
new = '''### Harvests accumulate

A harvest **appends** to `data/requests.csv` if it is already there, skipping
any `request_id` the file holds. The list API returns newest-first, so
re-running the same command walks back over rows already on disk and keeps
only what has landed since — run it periodically and the dataset grows a
longer history than any single pull can reach. `--limit` bounds how far back
the walk goes, not how many rows are added.

That matters for more than convenience: the train/test split is chronological,
so duplicated rows would put siblings of a test row in the training set, and
the recent traffic they duplicate would carry double weight.

`--overwrite` starts the dataset over instead. If the file's columns differ
from what the current code writes, the harvest refuses rather than filing
values under the wrong column — harvest to a fresh `--out`, or overwrite.

Override with `--deployment ''` (all deployments), `--exclude-org CODE`
(repeatable), or `--q` for any other portal filter term.'''
assert old in s
s = s.replace(old, new)

old = '''| `harvest` | pull rows to CSV — list API only, no payloads, no API keys |'''
new = '''| `harvest` | pull rows to CSV — appends and dedupes; list API only, no payloads, no API keys |'''
assert old in s
s = s.replace(old, new)

p.write_text(s)
print("PREDICTOR.md updated")
PY
grep -n "harvest" README.md | head
```

### CLAUDE (2026-08-25T18:57:07.991Z)

**[tool: Bash]**
```
# Sync test count in docs
source .venv/bin/activate 2>/dev/null; N=$(python3 -m unittest tests.test_portal 2>&1 | grep -o "Ran [0-9]* tests" | grep -o "[0-9]*"); sed -i '' "s|# 27 tests, incl. filter negation|# $N tests, incl. filter negation and append|" PREDICTOR.md; grep -n "test_portal.py" PREDICTOR.md
```

### CLAUDE (2026-08-25T18:57:20.571Z)

**[tool: Bash]**
```
# Smoke-test CLI output formatting
source .venv/bin/activate 2>/dev/null; python3 - <<'PY'
import sys, types, argparse
from pathlib import Path
import predictor.harvest as H
from predictor.cli import cmd_harvest

dest = Path("/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad/smoke.csv")
dest.parent.mkdir(parents=True, exist_ok=True)
if dest.exists(): dest.unlink()

fake = {"query":"q","appended":True,"existing_rows":61758,"main_rows":900,
        "rows":1000,"total_rows":62758,"skipped":3,"duplicates":99000,
        "strata":{"matrix_type:mdm":100},"seconds":12.0,"path":str(dest),
        "oldest":"2026-08-20T00:00:00+00:00","newest":"2026-08-25T00:00:00+00:00",
        "file_oldest":"2026-08-01T00:00:00+00:00","file_newest":"2026-08-25T00:00:00+00:00"}
H.harvest = lambda *a, **k: fake
args = argparse.Namespace(out=str(dest), limit=100000, q="status:succeeded", org=None,
                          deployment="api-auto-sgp", exclude_org=["nbai"],
                          no_stratify=False, force_stratify=False, overwrite=False)
dest.write_text("x")   # make it look present
print("rc =", cmd_harvest(args))
PY
```

### CLAUDE (2026-08-25T18:57:35.357Z)

**[tool: Bash]**
```
# Make warnings append-aware and re-run suite
rm -f /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad/smoke.csv
python3 - <<'PY'
from pathlib import Path

# harvest.py: the "too few main rows" note is alarming on an incremental append,
# where a small main pull is the expected outcome.
p = Path("predictor/harvest.py")
s = p.read_text()
old = '''                if budget < 1:
                    print(f"  skipping rare-segment top-up: {main_rows:,} main rows "
                          f"is too few to add to without skewing the mix",
                          file=sys.stderr)'''
new = '''                if budget < 1:
                    why = ("few new rows this run, and the file already holds "
                           "earlier top-ups" if appending else
                           "too few to add to without skewing the mix")
                    print(f"  skipping rare-segment top-up: {main_rows:,} main "
                          f"rows -- {why}", file=sys.stderr)'''
assert old in s
s = s.replace(old, new)
p.write_text(s)

# cli.py: a thin stratum is only news on a fresh harvest. On an append the run's
# count says nothing about how many the dataset holds in total.
p = Path("predictor/cli.py")
s = p.read_text()
old = '''            elif v < 500:
                print(f"      thin -- predictions for {k} will be unreliable",
                      file=sys.stderr)'''
new = '''            elif v < 500 and not summary["appended"]:
                print(f"      thin -- predictions for {k} will be unreliable",
                      file=sys.stderr)'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("warnings made append-aware")
PY
source .venv/bin/activate 2>/dev/null; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED)"
```

### CLAUDE (2026-08-25T18:58:40.949Z)

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

### USER (2026-08-26T13:01:44.614Z)

how many rows are in the data/requests.csv file

### CLAUDE (2026-08-26T13:01:49.351Z)

**[tool: Bash]**
```
# Count CSV data rows
python3 -c "
import csv
with open('data/requests.csv', newline='') as fh:
    r = csv.reader(fh)
    next(r)
    print(f'{sum(1 for row in r if row):,} data rows')
"
```

### CLAUDE (2026-08-26T13:01:52.595Z)

**68,556** data rows (plus the header).

Note that's higher than the 61,758 lines `wc -l` showed earlier in the session — a raw line count undercounts here because some fields contain embedded newlines. The number above is from an actual CSV parse, so it's the real row count.

### USER (2026-08-26T13:09:32.183Z)

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

### CLAUDE (2026-08-26T13:09:37.217Z)

**[tool: Bash]**
```
# Inspect input JSON structure
python3 -c "
import json
d=json.load(open('json-1787680134473.json'))
def shape(o,p='',depth=0):
    if depth>2: return
    if isinstance(o,dict):
        for k,v in list(o.items())[:40]:
            t=type(v).__name__
            n=f'[{len(v)}]' if isinstance(v,(list,dict)) else ''
            print(f'{p}{k}: {t}{n}')
            if isinstance(v,(dict,list)) and depth<2: shape(v,p+'  ',depth+1)
    elif isinstance(o,list) and o:
        shape(o[0],p+'  ',depth+1)
shape(d)
"
```

### CLAUDE (2026-08-26T13:09:41.550Z)

**[tool: Bash]**
```
# Inspect locations payload
python3 -c "
import json
d=json.load(open('json-1787680134473.json'))
loc=d['locations']
print('id:',loc['id'])
print('type of location:',type(loc['location']))
print('first 3:',loc['location'][:3])
print('len:',len(loc['location']))
"
```

### CLAUDE (2026-08-26T13:09:43.435Z)

**[tool: Bash]**
```
# Find location parsing in profile.py
grep -n "location" predictor/profile.py
```

### CLAUDE (2026-08-26T13:09:48.786Z)

**[tool: Bash]**
```
# Read parse_coords
grep -n "def parse_coords" -A40 predictor/profile.py
```

### CLAUDE (2026-08-26T13:09:51.037Z)

**[tool: Bash]**
```
# Locate parse_coords definition
grep -rn "parse_coords" predictor/ explain/ | head; echo "===DEF==="; grep -rn "def parse_coords" -A45 predictor/features.py
```

### CLAUDE (2026-08-26T13:09:52.826Z)

**[tool: Bash]**
```
# Read parse_coords implementation
sed -n 100,175p predictor/matrix_rule.py
```

### CLAUDE (2026-08-26T13:10:09.975Z)

**[tool: Bash]**
```
# Confirm parse_coords failure on list input
source .venv/bin/activate 2>/dev/null; python3 -c "
from predictor.matrix_rule import parse_coords
import json
d=json.load(open('json-1787680134473.json'))
loc=d['locations']['location']
print('parse_coords(list) ->', len(parse_coords(loc)), 'coords')
print('str(list)[:60] =', repr(str(loc)[:60]))
print('parse_coords(joined) ->', len(parse_coords('|'.join(loc))), 'coords')
"; echo "=== _locations ==="; sed -n 145,190p predictor/profile.py
```

### CLAUDE (2026-08-26T13:10:30.235Z)

Found it. Let me confirm the impact before fixing.

### CLAUDE (2026-08-26T13:10:30.930Z)

**[tool: Bash]**
```
# Check whether locations is a model feature
grep -n "NUMERIC_RAW\s*=" -A8 predictor/features.py
```

### CLAUDE (2026-08-26T13:10:45.007Z)

**[tool: Bash]**
```
# Fix list-shaped locations parsing
python3 - <<'PY'
from pathlib import Path

p = Path("predictor/matrix_rule.py")
s = p.read_text()
old = '''def parse_coords(text: str) -> list[tuple[float, float]]:
    """Parse the portal's "lat,lon|lat,lon|..." location string."""
    out: list[tuple[float, float]] = []
    for chunk in str(text).split("|"):'''
new = '''def parse_coords(text) -> list[tuple[float, float]]:
    """Parse the portal's "lat,lon|lat,lon|..." location string.

    A JSON array of "lat,lon" strings is accepted too. Without that branch
    str() would stringify the list itself, and the first field of the repr is
    `['42.43` -- not a float -- so an array of 1,985 real coordinates parsed
    to nothing at all instead of failing loudly.
    """
    if isinstance(text, (list, tuple)):
        text = "|".join(str(t) for t in text)
    out: list[tuple[float, float]] = []
    for chunk in str(text).split("|"):'''
assert old in s
s = s.replace(old, new)
p.write_text(s)

p = Path("predictor/profile.py")
s = p.read_text()
old = '''def _locations(doc: dict) -> list[tuple[float, float]]:
    loc = doc.get("locations")
    if isinstance(loc, dict) and loc.get("location"):
        return parse_coords(loc["location"])
    if isinstance(loc, str):
        return parse_coords(loc)
    if isinstance(loc, list):
        out: list[tuple[float, float]] = []
        for item in loc:
            if isinstance(item, str):
                out.extend(parse_coords(item))
            elif isinstance(item, dict):
                lat = item.get("lat", item.get("latitude"))
                lon = item.get("lng", item.get("lon", item.get("longitude")))
                if lat is not None and lon is not None:
                    try:
                        out.append((float(lat), float(lon)))
                    except (TypeError, ValueError):
                        continue
        return out
    return []'''
new = '''def _coords_from(value) -> list[tuple[float, float]]:
    """Coordinates from any shape the API accepts for a location field.

    `location` is documented as a "lat,lon|lat,lon|..." string, but real
    payloads also arrive as a JSON array -- of "lat,lon" strings, of
    {lat, lng} objects, or of [lat, lon] pairs.
    """
    if isinstance(value, str):
        return parse_coords(value)
    if isinstance(value, list):
        out: list[tuple[float, float]] = []
        for item in value:
            if isinstance(item, str):
                out.extend(parse_coords(item))
            elif isinstance(item, dict):
                lat = item.get("lat", item.get("latitude"))
                lon = item.get("lng", item.get("lon", item.get("longitude")))
                if lat is not None and lon is not None:
                    try:
                        out.append((float(lat), float(lon)))
                    except (TypeError, ValueError):
                        continue
            elif isinstance(item, (list, tuple)) and len(item) >= 2:
                try:
                    out.append((float(item[0]), float(item[1])))
                except (TypeError, ValueError):
                    continue
        return out
    return []


def _locations(doc: dict) -> list[tuple[float, float]]:
    # The wrapped form is {"id": N, "location": <either shape>}; both the
    # wrapped and bare forms route through the same parser, so an array under
    # `location` is read rather than silently dropped.
    loc = doc.get("locations")
    if isinstance(loc, dict):
        return _coords_from(loc.get("location"))
    return _coords_from(loc)'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("patched")
PY
```

### CLAUDE (2026-08-26T13:10:49.291Z)

**[tool: Bash]**
```
# Re-run predict on the input
source .venv/bin/activate 2>/dev/null; python3 -m predictor predict --input json-1787680134473.json 2>&1 | head -30
```

### CLAUDE (2026-08-26T13:10:56.243Z)

**[tool: Bash]**
```
# Read matrix decision logic
source .venv/bin/activate 2>/dev/null; sed -n '/^@dataclass/,/^def /p' predictor/matrix_rule.py | sed -n '1,60p' | grep -n "def decide" -A30
```

### CLAUDE (2026-08-26T13:10:59.106Z)

**[tool: Bash]**
```
# Read decide() and run full suite
source .venv/bin/activate 2>/dev/null; grep -n "def decide" -A32 predictor/matrix_rule.py; echo "=== TESTS ==="; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED|FAIL:|ERROR:)"
```

### CLAUDE (2026-08-26T13:11:54.961Z)

**[tool: Bash]**
```
# Inspect matrix rule methods
source .venv/bin/activate 2>/dev/null; grep -n "flex_distance_km\|def .*(" predictor/matrix_rule.py | sed -n '25,60p'
```

### CLAUDE (2026-08-26T13:11:57.680Z)

**[tool: Bash]**
```
# Read MatrixRule class body
source .venv/bin/activate 2>/dev/null; sed -n '168,240p' predictor/matrix_rule.py
```

### CLAUDE (2026-08-26T13:12:03.451Z)

**[tool: Bash]**
```
# Quantify prediction impact
source .venv/bin/activate 2>/dev/null; echo "--- as it parsed BEFORE (locations 0) ---"; python3 -m predictor predict --vehicles 19 --jobs 1984 --locations 0 2>&1 | grep -E "P50|P90"; echo "--- as it parses NOW (locations 1985) ---"; python3 -m predictor predict --vehicles 19 --jobs 1984 --locations 1985 2>&1 | grep -E "P50|P90"
```

### CLAUDE (2026-08-26T13:12:11.618Z)

**[tool: Bash]**
```
# Check sensitivity to locations feature
source .venv/bin/activate 2>/dev/null; for L in 0 100 1985 8000; do printf "locations=%-5s " $L; python3 -m predictor predict --vehicles 19 --jobs 1984 --locations $L 2>&1 | grep "P50" | tr -s ' '; done
```

### CLAUDE (2026-08-26T13:12:19.619Z)

**[tool: Bash]**
```
# Find profile tests
grep -n "parse_input\|_locations\|class Test" tests/test_predictor.py | head -30
```

### CLAUDE (2026-08-26T13:12:21.664Z)

**[tool: Bash]**
```
# Read TestInputJsonProfile setup
sed -n 536,570p tests/test_predictor.py
```

### CLAUDE (2026-08-26T13:12:33.531Z)

**[tool: Bash]**
```
# Add regression tests and run suite
python3 - <<'PY'
from pathlib import Path
p = Path("tests/test_predictor.py")
s = p.read_text()

old = '''    def test_duplicate_coordinates_are_deduped(self):'''
new = '''    def test_location_given_as_an_array_of_strings_is_read(self):
        """Real payloads send `location` as a JSON array, not a "|" string.

        parse_coords() stringifies whatever it gets, so an array used to
        become its own repr -- first field `['42.43`, not a float -- and 1,985
        real coordinates parsed to zero locations and 0 km of spread, silently.
        """
        from predictor.profile import parse_input
        doc = {"locations": {"id": 1,
                             "location": ["42.430101,-83.156899",
                                          "42.424594,-83.158837",
                                          "42.425540,-83.159066"]},
               "jobs": [], "vehicles": []}
        p = parse_input(doc)
        self.assertEqual(p.locations_raw, 3)
        self.assertGreater(p.total_air_distance_km, 0,
                           "spread must not read as 0 km for real coordinates")

    def test_array_and_pipe_string_forms_agree(self):
        from predictor.profile import parse_input
        coords = ["1.320000,103.800000", "1.321000,103.801000", "1.322000,103.802000"]
        as_array = parse_input({"locations": {"location": coords},
                                "jobs": [], "vehicles": []})
        as_string = parse_input({"locations": {"location": "|".join(coords)},
                                 "jobs": [], "vehicles": []})
        self.assertEqual(as_array.locations_raw, as_string.locations_raw)
        self.assertEqual(as_array.coords, as_string.coords)
        self.assertAlmostEqual(as_array.total_air_distance_km,
                               as_string.total_air_distance_km, places=6)

    def test_location_arrays_of_objects_and_pairs_are_read(self):
        from predictor.profile import parse_input
        for form in (
            [{"lat": 1.32, "lng": 103.80}, {"lat": 1.33, "lng": 103.81}],
            [{"latitude": 1.32, "longitude": 103.80}, {"latitude": 1.33, "longitude": 103.81}],
            [[1.32, 103.80], [1.33, 103.81]],
        ):
            with self.subTest(form=type(form[0]).__name__):
                p = parse_input({"locations": {"location": form},
                                 "jobs": [], "vehicles": []})
                self.assertEqual(p.locations_raw, 2)
                self.assertGreater(p.total_air_distance_km, 0)

    def test_duplicate_coordinates_are_deduped(self):'''
assert old in s
s = s.replace(old, new, 1)
p.write_text(s)
print("tests added")
PY
source .venv/bin/activate 2>/dev/null; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED|FAIL:|ERROR:)"
```

### CLAUDE (2026-08-26T13:13:40.084Z)

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

### USER (2026-08-26T13:59:20.194Z)

how many rows are in the data/requests.csv file

### CLAUDE (2026-08-26T13:59:24.519Z)

**[tool: Bash]**
```
# Count CSV data rows
python3 -c "
import csv
with open('data/requests.csv', newline='') as fh:
    r = csv.reader(fh)
    next(r)
    print(f'{sum(1 for row in r if row):,} data rows')
"
```

### CLAUDE (2026-08-26T13:59:26.605Z)

**69,183** data rows (plus the header).

That's up from the 68,556 I counted earlier in this session, so something has appended ~627 rows to the file since then.

### USER (2026-08-26T15:19:25.093Z)

how should I approach deployment of this stack to GCP? I want to be able to query the model through an API endpoint and have someone who is 'admin' to be able to harvest new solutions and train the model.

### CLAUDE (2026-08-26T15:19:42.531Z)

Let me look at what's actually here before recommending an approach.

### CLAUDE (2026-08-26T15:19:44.663Z)

**[tool: Bash]**
```
# Inspect dependencies and env
ls -a; echo "=== DEPS ==="; cat requirements*.txt pyproject.toml setup.py 2>/dev/null | head -40; echo "=== VENV PKGS ==="; source .venv/bin/activate 2>/dev/null; python3 -c "import sklearn,sys;print('python',sys.version.split()[0]);print('sklearn',sklearn.__version__)" 2>&1; python3 -m pip list 2>/dev/null | head -30; echo "=== GITIGNORE ==="; cat .gitignore
```

### CLAUDE (2026-08-26T15:19:49.330Z)

**[tool: Bash]**
```
# Inspect auth and LLM backend
echo "=== PORTAL AUTH ==="; sed -n 1,100p explain/portal.py | grep -n "env\|token\|cookie\|auth\|header\|os.environ" ; echo; echo "=== LLM BACKEND ==="; grep -n "os.environ\|getenv\|base_url\|BASETEN\|OLLAMA\|http" explain/llm.py | head -30
```

### CLAUDE (2026-08-26T15:19:51.819Z)

**[tool: Bash]**
```
# Read portal client and predict command
echo "=== PORTAL CLIENT INIT ==="; sed -n 30,105p explain/portal.py; echo "=== PREDICT ENTRY ==="; grep -n "def cmd_predict" -A45 predictor/cli.py | head -60
```

### CLAUDE (2026-08-26T15:19:58.611Z)

**[tool: Bash]**
```
# Read Predictor class, check for existing server
grep -n "class Predictor" -A40 predictor/train.py | head -55; echo "=== SERVER? ==="; grep -rln "flask\|fastapi\|uvicorn\|http.server\|Dockerfile" --include=*.py --include=*.toml --include=Dockerfile . 2>/dev/null | grep -v .venv | head
```

### CLAUDE (2026-08-26T15:20:01.409Z)

**[tool: Bash]**
```
# Check for web server and time a train run
grep -rln -e flask -e fastapi -e uvicorn -e "http.server" predictor explain 2>/dev/null; echo "(none above = no server yet)"; echo "=== TRAIN TIME ==="; source .venv/bin/activate 2>/dev/null; time python3 -m predictor train 2>&1 | tail -20
```

### CLAUDE (2026-08-26T15:21:09.595Z)

**[tool: Bash]**
```
# Inspect model metadata
source .venv/bin/activate 2>/dev/null; python3 -c "
from pathlib import Path
from predictor.train import Predictor
p = Predictor.load(Path('models/predictor.pkl'))
import json
m = {k: (v if not hasattr(v,'__dict__') else str(type(v))) for k,v in p.meta.items()}
print(json.dumps(m, indent=2, default=str)[:1500])
"
```

### CLAUDE (2026-08-26T15:21:44.431Z)

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

### USER (2026-08-26T15:22:59.124Z)

yup build it out

### CLAUDE (2026-08-26T15:23:04.271Z)

Let me read the full predict path before factoring it.

### CLAUDE (2026-08-26T15:23:04.689Z)

**[tool: Bash]**
```
# Read full cmd_predict
sed -n 152,265p predictor/cli.py
```

### CLAUDE (2026-08-26T15:23:07.274Z)

**[tool: Bash]**
```
# Read load_input and predict arg defaults
grep -n "def load_input" -A25 predictor/profile.py; echo "=== defaults in predict parser ==="; grep -n 'add_parser("predict"' -A30 predictor/cli.py
```

### CLAUDE (2026-08-26T15:23:54.078Z)

Before choosing the web framework, let me check what actually installs on Python 3.14.

### CLAUDE (2026-08-26T15:23:57.639Z)

**[tool: Bash]**
```
# Probe FastAPI install on Python 3.14
cd /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad && python3 -m venv probe 2>&1 | tail -2 && ./probe/bin/pip install -q --disable-pip-version-check fastapi uvicorn 2>&1 | tail -5; ./probe/bin/python -c "import fastapi,pydantic,uvicorn;print('fastapi',fastapi.__version__);print('pydantic',pydantic.__version__);print('uvicorn',uvicorn.__version__)" 2>&1 | tail -5
```

### CLAUDE (2026-08-26T15:24:10.206Z)

**[tool: Bash]**
```
# Probe GCS client and gunicorn
cd /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad && ./probe/bin/pip install -q --disable-pip-version-check google-cloud-storage gunicorn 2>&1 | tail -3; ./probe/bin/python -c "
import google.cloud.storage as s, gunicorn
print('google-cloud-storage', s.__version__)
print('gunicorn', gunicorn.__version__)"
```

### CLAUDE (2026-08-26T15:24:21.611Z)

**[tool: Bash]**
```
# Read profile_to_row and substitutions
grep -n "def profile_to_row" -A35 predictor/features.py; echo "=== substitutions ==="; grep -n "def substitutions" -A20 predictor/train.py
```

### CLAUDE (2026-08-26T15:24:24.599Z)

Now building the shared prediction core that both the CLI and API will use.

### CLAUDE (2026-08-26T15:24:48.918Z)

**[tool: Write]**
```
{
 "file_path": "/Users/[USER]/workspace/openai_explain/predictor/service.py",
 "content": "\"\"\"One prediction path, shared by the CLI and the HTTP API.\n\nDeriving `matrix_type` is the part worth ~92x, and the rules around it are\nsubtle: the deduped location count is what the gateway compares against the\nthresholds, the haversine gate only applies to flexible routing, and an\nexplicit override has to win over both. Duplicating that in a web handler\nwould mean two implementations drifting apart, and the drift would be\ninvisible -- both would still return a number.\n\nSo the handler and `predictor predict` call the same function here, and a\nchange to the derivation shows up in both or neither.\n\"\"\"\nfrom __future__ import annotations\n\nfrom dataclasses import dataclass, field\nfrom typing import Any\n\nfrom .features import profile_to_row\nfrom .matrix_rule import MatrixRule, parse_coords, total_air_distance_km\nfrom .profile import RequestProfile\n\n# Mirrors the `predict` sub-command's argparse defaults. Kept here so the API\n# and the CLI agree on what an unspecified field means.\nDEFAULTS = {\n    \"matrix_mode\": \"fast\",\n    \"api_version\": \"v2\",\n    \"executor_mode\": \"on-duty\",\n    \"engine\": \"nbro\",\n    \"engine_mode\": \"legacy\",\n    \"request_kind\": \"initial\",\n}\n\n\n@dataclass\nclass Prediction:\n    p50_ms: float\n    p90_ms: float\n    row: dict\n    matrix_type: str\n    matrix_derived: bool\n    matrix_mode: str\n    flexible: bool\n    total_air_distance_km: float | None\n    gate_km: float\n    assumptions: dict[str, str] = field(default_factory=dict)\n\n    @property\n    def distance_gate_evaluated(self) -> bool:\n        \"\"\"Whether the haversine gate could actually be applied.\n\n        False means no coordinates were supplied. That is only a problem for\n        flexible requests, where the gate -- not the location count -- is what\n        triggers most production MDM.\n        \"\"\"\n        return self.total_air_distance_km is not None\n\n    def as_dict(self, model_meta: dict | None = None) -> dict[str, Any]:\n        metrics = (model_meta or {}).get(\"metrics\", {})\n        out: dict[str, Any] = {\n            \"p50_ms\": round(self.p50_ms),\n            \"p90_ms\": round(self.p90_ms),\n            \"p50_seconds\": round(self.p50_ms / 1000, 1),\n            \"p90_seconds\": round(self.p90_ms / 1000, 1),\n            \"profile\": self.row,\n            \"matrix\": {\n                \"type\": self.matrix_type,\n                \"derived\": self.matrix_derived,\n                \"mode\": self.matrix_mode,\n                \"flexible\": self.flexible,\n                \"total_air_distance_km\": (\n                    round(self.total_air_distance_km)\n                    if self.total_air_distance_km is not None else None),\n                \"distance_gate_km\": self.gate_km,\n                \"distance_gate_evaluated\": self.distance_gate_evaluated,\n            },\n            # Never let a prediction quietly assume something the model has not\n            # seen -- the CLI prints these, so the API returns them.\n            \"assumptions\": self.assumptions,\n            \"caveat\": (\"Excludes queue time under load, which no input-profile \"\n                       \"model can see.\"),\n        }\n        if metrics:\n            # A caller acting on a number should be able to see what it is\n            # worth without a second request.\n            out[\"model\"] = {\n                \"mdape\": metrics.get(\"mdape\"),\n                \"p90_coverage\": metrics.get(\"p90_coverage\"),\n                \"train_rows\": metrics.get(\"train_rows\"),\n                \"test_rows\": metrics.get(\"test_rows\"),\n                \"trained_through\": (model_meta or {}).get(\n                    \"train_period\", {}).get(\"to\"),\n            }\n        return out\n\n\ndef predict_profile(\n    predictor,\n    *,\n    profile: RequestProfile | None = None,\n    vehicles: int = 0,\n    jobs: int = 0,\n    shipments: int = 0,\n    locations: int | None = None,\n    relations: int = 0,\n    coords: str | list | None = None,\n    matrix_type: str | None = None,\n    matrix_mode: str = DEFAULTS[\"matrix_mode\"],\n    api_version: str = DEFAULTS[\"api_version\"],\n    executor_mode: str = DEFAULTS[\"executor_mode\"],\n    engine: str = DEFAULTS[\"engine\"],\n    engine_mode: str = DEFAULTS[\"engine_mode\"],\n    request_kind: str = DEFAULTS[\"request_kind\"],\n    deployment: str | None = None,\n) -> Prediction:\n    \"\"\"Predict from an input profile.\n\n    `profile` (from `parse_input`) supplies every count plus the coordinates,\n    and takes precedence over the scalar arguments. Without it the counts are\n    read individually and `coords` is optional.\n\n    `matrix_type` is DERIVED unless explicitly given, because the pipeline\n    decides it, not the caller -- someone planning a request knows its shape\n    but not which matrix path it will take.\n    \"\"\"\n    rule = predictor.meta.get(\"matrix_rule\") or MatrixRule()\n    air_km: float | None = None\n\n    if profile is not None:\n        jobs, shipments = profile.jobs, profile.shipments\n        vehicles, relations = profile.vehicles, profile.relations\n        # matrix_len is the DEDUPED count -- what mdmPreferred compares.\n        locations = profile.matrix_len\n        air_km = profile.total_air_distance_km\n        flexible = profile.is_flexible\n        api_version = profile.api_version\n    else:\n        parsed = parse_coords(coords) if coords else []\n        if parsed:\n            air_km = total_air_distance_km(parsed)\n            locations = len(parsed)\n        elif locations is None:\n            locations = jobs + shipments + vehicles\n        flexible = str(matrix_mode).lower().startswith(\"flex\")\n\n    derived = matrix_type is None\n    resolved = rule.matrix_type(locations, flexible, air_km) if derived else matrix_type\n\n    row = profile_to_row(\n        vehicles=vehicles, jobs=jobs, shipments=shipments,\n        locations=locations, relations=relations,\n        matrix_type=resolved,\n        matrix_mode=(\"flexible\" if flexible else matrix_mode),\n        api_version=api_version, executor_mode=executor_mode,\n        engine=engine, engine_mode=engine_mode, request_kind=request_kind,\n        deployment_id=deployment or \"(missing)\",\n    )\n    out = predictor.predict([row])\n    return Prediction(\n        p50_ms=float(out[\"p50_ms\"][0]),\n        p90_ms=float(out[\"p90_ms\"][0]),\n        row=row,\n        matrix_type=resolved,\n        matrix_derived=derived,\n        matrix_mode=matrix_mode,\n        flexible=flexible,\n        total_air_distance_km=air_km,\n        gate_km=rule.flex_distance_km,\n        assumptions=predictor.encoders.substitutions(row),\n    )\n"
}
```

### CLAUDE (2026-08-26T15:24:50.955Z)

Now the storage layer with generation preconditions — the piece that prevents lost harvests.

### CLAUDE (2026-08-26T15:25:21.195Z)

**[tool: Write]**
```
{
 "file_path": "/Users/[USER]/workspace/openai_explain/predictor/storage.py",
 "content": "\"\"\"Read and write the dataset and the model, on local disk or in GCS.\n\nWHY THIS EXISTS AT ALL\n----------------------\n`harvest` appends: it reads every request_id already in the CSV, pulls what is\nnew, and rewrites the file. On local disk that is an append to an open handle.\nOn GCS there is no append -- it becomes download, modify, upload the whole\nobject -- so two overlapping runs both start from generation N and the second\nupload silently discards the first one's rows. Nothing errors; the dataset is\njust quietly short, and the only symptom is a model trained on less data than\nyou think.\n\nSo every write here is conditional on the generation that was read. A\nconcurrent writer gets a `ConcurrentWrite` error instead of winning. On GCS the\ncheck is server-side and atomic (`ifGenerationMatch`). On local disk it is an\nmtime comparison, which has a TOCTOU window -- advisory, not a lock, but it\nstill catches the case that actually happens: a long job overwriting a short\none that finished while it was running.\n\n`gs://` paths are recognised anywhere a dataset or model path is accepted, so\nthe same commands work locally and in Cloud Run.\n\"\"\"\nfrom __future__ import annotations\n\nimport os\nimport shutil\nfrom contextlib import contextmanager\nfrom dataclasses import dataclass\nfrom pathlib import Path\n\nGCS_PREFIX = \"gs://\"\n\n# A generation of 0 means \"the object must not exist yet\" -- GCS's own\n# convention for a create-only write, reused by the local backend.\nCREATE_ONLY = 0\n\n\nclass StorageError(RuntimeError):\n    pass\n\n\nclass ConcurrentWrite(StorageError):\n    \"\"\"Someone else wrote the object while we were working on it.\"\"\"\n\n\ndef is_remote(uri: str | Path) -> bool:\n    return str(uri).startswith(GCS_PREFIX)\n\n\ndef split_gs(uri: str) -> tuple[str, str]:\n    \"\"\"gs://bucket/some/object.csv -> (\"bucket\", \"some/object.csv\")\"\"\"\n    rest = str(uri)[len(GCS_PREFIX):]\n    bucket, _, name = rest.partition(\"/\")\n    if not bucket or not name:\n        raise StorageError(\n            f\"{uri!r} is not a complete GCS path -- expected \"\n            \"gs://BUCKET/PATH/TO/OBJECT\")\n    return bucket, name\n\n\n@dataclass\nclass LocalStore:\n    \"\"\"Backing store on the filesystem.\n\n    Generation is the file's mtime in nanoseconds: it changes on every write,\n    which is all the precondition needs.\n    \"\"\"\n    uri: str\n\n    @property\n    def path(self) -> Path:\n        return Path(self.uri)\n\n    def generation(self) -> int | None:\n        try:\n            return self.path.stat().st_mtime_ns\n        except FileNotFoundError:\n            return None\n\n    def pull(self, local: Path) -> int | None:\n        gen = self.generation()\n        if gen is None:\n            return None\n        if self.path.resolve() != local.resolve():\n            local.parent.mkdir(parents=True, exist_ok=True)\n            shutil.copy2(self.path, local)\n        return gen\n\n    def push(self, local: Path, if_generation_match: int | None = None) -> int:\n        current = self.generation()\n        if if_generation_match is not None:\n            expected = None if if_generation_match == CREATE_ONLY else if_generation_match\n            if current != expected:\n                raise ConcurrentWrite(\n                    f\"{self.uri} changed while this run was working on it \"\n                    f\"(expected generation {expected}, found {current}). \"\n                    \"Another harvest or train probably overlapped -- re-run \"\n                    \"this one; nothing was overwritten.\")\n        if self.path.resolve() != local.resolve():\n            self.path.parent.mkdir(parents=True, exist_ok=True)\n            shutil.copy2(local, self.path)\n            os.utime(self.path)          # force a new generation\n        return self.generation()\n\n\n@dataclass\nclass GcsStore:\n    \"\"\"Backing store in Cloud Storage.\n\n    The precondition is enforced by GCS itself, so unlike the local backend\n    this is a genuine compare-and-swap with no race window.\n    \"\"\"\n    uri: str\n    _client: object | None = None\n\n    def _blob(self):\n        try:\n            from google.cloud import storage\n        except ImportError as e:  # pragma: no cover - depends on the deployment\n            raise StorageError(\n                f\"{self.uri} is a GCS path but google-cloud-storage is not \"\n                \"installed.\\n  pip install google-cloud-storage\"\n            ) from e\n        client = self._client or storage.Client()\n        bucket, name = split_gs(self.uri)\n        return client.bucket(bucket).blob(name)\n\n    def generation(self) -> int | None:\n        blob = self._blob()\n        blob.reload_if_exists() if hasattr(blob, \"reload_if_exists\") else None\n        if blob.generation is None:\n            b = self._blob()\n            try:\n                b.reload()\n            except Exception:            # noqa: BLE001 - absent is not an error\n                return None\n            return b.generation\n        return blob.generation\n\n    def pull(self, local: Path) -> int | None:\n        blob = self._blob()\n        try:\n            blob.reload()\n        except Exception:                # noqa: BLE001 - treat any miss as absent\n            return None\n        local.parent.mkdir(parents=True, exist_ok=True)\n        blob.download_to_filename(str(local))\n        return blob.generation\n\n    def push(self, local: Path, if_generation_match: int | None = None) -> int:\n        from google.api_core import exceptions as gexc\n\n        blob = self._blob()\n        try:\n            blob.upload_from_filename(\n                str(local), if_generation_match=if_generation_match)\n        except gexc.PreconditionFailed as e:\n            raise ConcurrentWrite(\n                f\"{self.uri} changed while this run was working on it \"\n                f\"(expected generation {if_generation_match}). Another harvest \"\n                \"or train overlapped -- re-run this one; nothing was \"\n                \"overwritten.\") from e\n        return blob.generation\n\n\ndef store_for(uri: str | Path, client=None):\n    \"\"\"Pick a backend from the path shape.\"\"\"\n    if is_remote(uri):\n        return GcsStore(str(uri), _client=client)\n    return LocalStore(str(uri))\n\n\n@contextmanager\ndef editable(uri: str | Path, workdir: Path, *, name: str, client=None,\n             create_only_if_absent: bool = True):\n    \"\"\"Check a remote artifact out, hand back a local path, check it back in.\n\n    Yields `(local_path, generation)`. On clean exit the local file is pushed\n    back with the generation as the precondition, so a run that overlapped\n    another fails loudly instead of discarding its rows.\n\n    A local path is yielded untouched -- no copying, no temp file -- so\n    development and tests keep working exactly as before.\n    \"\"\"\n    store = store_for(uri, client=client)\n    if isinstance(store, LocalStore):\n        path = store.path\n        path.parent.mkdir(parents=True, exist_ok=True)\n        gen = store.generation()\n        yield path, gen\n        return\n\n    workdir.mkdir(parents=True, exist_ok=True)\n    local = workdir / name\n    gen = store.pull(local)\n    yield local, gen\n    if not local.exists():\n        raise StorageError(f\"nothing to upload: {local} was never written\")\n    precondition = gen if gen is not None else (\n        CREATE_ONLY if create_only_if_absent else None)\n    store.push(local, if_generation_match=precondition)\n\n\n@contextmanager\ndef readable(uri: str | Path, workdir: Path, *, name: str, client=None):\n    \"\"\"Read-only counterpart: fetch if remote, yield a local path, push nothing.\"\"\"\n    store = store_for(uri, client=client)\n    if isinstance(store, LocalStore):\n        yield store.path\n        return\n    workdir.mkdir(parents=True, exist_ok=True)\n    local = workdir / name\n    if store.pull(local) is None:\n        raise StorageError(f\"{uri} does not exist\")\n    yield local\n"
}
```

### CLAUDE (2026-08-26T15:25:29.047Z)

**[tool: Edit]**
```
{
 "replace_all": false,
 "file_path": "/Users/[USER]/workspace/openai_explain/predictor/storage.py",
 "old_string": "    def generation(self) -> int | None:\n        blob = self._blob()\n        blob.reload_if_exists() if hasattr(blob, \"reload_if_exists\") else None\n        if blob.generation is None:\n            b = self._blob()\n            try:\n                b.reload()\n            except Exception:            # noqa: BLE001 - absent is not an error\n                return None\n            return b.generation\n        return blob.generation\n\n    def pull(self, local: Path) -> int | None:\n        blob = self._blob()\n        try:\n            blob.reload()\n        except Exception:                # noqa: BLE001 - treat any miss as absent\n            return None\n        local.parent.mkdir(parents=True, exist_ok=True)\n        blob.download_to_filename(str(local))\n        return blob.generation",
 "new_string": "    def generation(self) -> int | None:\n        from google.api_core import exceptions as gexc\n\n        blob = self._blob()\n        try:\n            blob.reload()\n        except gexc.NotFound:            # absent is a state, not an error\n            return None\n        return blob.generation\n\n    def pull(self, local: Path) -> int | None:\n        from google.api_core import exceptions as gexc\n\n        blob = self._blob()\n        try:\n            blob.reload()\n        except gexc.NotFound:\n            return None\n        local.parent.mkdir(parents=True, exist_ok=True)\n        blob.download_to_filename(str(local))\n        return blob.generation"
}
```

### CLAUDE (2026-08-26T15:25:30.952Z)

Now the HTTP API.

### CLAUDE (2026-08-26T15:25:58.941Z)

**[tool: Write]**
```
{
 "file_path": "/Users/[USER]/workspace/openai_explain/serving/app.py",
 "content": "\"\"\"HTTP front end for the duration predictor.\n\nRead-only by design. Harvesting and training are a separate deployable (a\nCloud Run *job*) precisely so that the thing exposed to callers has no code\npath that can write the dataset or the model -- the admin/user split is an IAM\nboundary between two deployables, not a role check in here that could be got\nwrong.\n\nThe service account this runs as should have object *read* on the model\nbucket and nothing more. Loading a pickle executes arbitrary code, so whatever\nserves predictions must not be able to write what it later loads.\n\nConfig (all optional; sensible local defaults):\n  MODEL_URI        gs://bucket/models/predictor.pkl, or a local path\n  MODEL_GENERATION set by the deploy to pin an exact model version. Changing\n                   it is what makes a new model a new Cloud Run revision, so\n                   rollout and rollback are revision operations.\n  PORT             Cloud Run sets this.\n\"\"\"\nfrom __future__ import annotations\n\nimport os\nimport tempfile\nimport threading\nfrom pathlib import Path\nfrom typing import Any\n\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel, Field\n\nfrom predictor.profile import parse_input\nfrom predictor.service import DEFAULTS, predict_profile\nfrom predictor.storage import StorageError, readable\nfrom predictor.train import Predictor\n\nMODEL_URI = os.environ.get(\"MODEL_URI\", \"models/predictor.pkl\")\nMODEL_GENERATION = os.environ.get(\"MODEL_GENERATION\") or None\n\napp = FastAPI(\n    title=\"Route Optimization duration predictor\",\n    description=(\n        \"Predicts how long a Route Optimization request will take, from its \"\n        \"input profile, before it is submitted.\"),\n    version=\"1.0.0\",\n)\n\n_model: Predictor | None = None\n_model_error: str | None = None\n_lock = threading.Lock()\n\n\ndef _load() -> Predictor:\n    \"\"\"Load once per instance, on first use.\n\n    Deliberately not at import time: Cloud Run's health check should be able\n    to answer even when the model is missing, so the failure surfaces as a\n    readiness error naming the URI rather than a container that will not boot.\n    \"\"\"\n    global _model, _model_error\n    if _model is not None:\n        return _model\n    with _lock:\n        if _model is None:\n            try:\n                with tempfile.TemporaryDirectory() as tmp:\n                    with readable(MODEL_URI, Path(tmp),\n                                  name=\"predictor.pkl\") as path:\n                        _model = Predictor.load(path)\n                _model_error = None\n            except (StorageError, OSError) as e:\n                _model_error = f\"{type(e).__name__}: {e}\"\n                raise HTTPException(\n                    503, f\"model not available from {MODEL_URI} -- {e}\") from e\n    return _model\n\n\nclass Options(BaseModel):\n    \"\"\"Fields the input payload does not carry, with the CLI's defaults.\"\"\"\n    deployment: str | None = Field(\n        None, description=\"deployment_id, e.g. api-auto-sgp. Affects the \"\n                          \"prediction: different hardware, different durations.\")\n    matrix_type: str | None = Field(\n        None, description=\"dm|mdm. Omit to DERIVE it from the profile, which \"\n                          \"is what the pipeline itself does.\")\n    matrix_mode: str = DEFAULTS[\"matrix_mode\"]\n    api_version: str = DEFAULTS[\"api_version\"]\n    executor_mode: str = DEFAULTS[\"executor_mode\"]\n    engine: str = DEFAULTS[\"engine\"]\n    engine_mode: str = DEFAULTS[\"engine_mode\"]\n    request_kind: str = DEFAULTS[\"request_kind\"]\n\n\nclass PredictRequest(BaseModel):\n    \"\"\"Either post the payload you were going to send to Route Optimization,\n    or, if you are sizing a request that does not exist yet, its counts.\"\"\"\n    input: dict[str, Any] | None = Field(\n        None, description=\"A full Route Optimization input.json. Supplies \"\n                          \"every count plus the coordinates needed for the \"\n                          \"haversine MDM gate.\")\n    vehicles: int = 0\n    jobs: int = 0\n    shipments: int = 0\n    locations: int | None = Field(\n        None, description=\"default: jobs + shipments + vehicles\")\n    relations: int = 0\n    coords: str | list[Any] | None = Field(\n        None, description=\"'lat,lon|lat,lon|...' or a JSON array. Enables the \"\n                          \"haversine distance gate, which triggers most \"\n                          \"production MDM.\")\n    options: Options = Field(default_factory=Options)\n\n\n@app.get(\"/healthz\")\ndef healthz() -> dict:\n    \"\"\"Liveness. Deliberately does not touch the model.\"\"\"\n    return {\"status\": \"ok\"}\n\n\n@app.get(\"/readyz\")\ndef readyz() -> dict:\n    _load()\n    return {\"status\": \"ready\", \"model_uri\": MODEL_URI,\n            \"model_generation\": MODEL_GENERATION}\n\n\n@app.get(\"/model\")\ndef model_info() -> dict:\n    \"\"\"Everything the training run recorded: metrics, the periods it covers,\n    per-band and per-segment error, and the fitted MDM boundary.\"\"\"\n    predictor = _load()\n    meta = dict(predictor.meta)\n    rule = meta.pop(\"matrix_rule\", None)\n    if rule is not None:\n        meta[\"matrix_rule\"] = {\n            \"normal_locations\": rule.normal_locations,\n            \"flex_locations\": rule.flex_locations,\n            \"flex_distance_km\": rule.flex_distance_km,\n            \"source\": rule.source,\n            \"accuracy\": rule.accuracy,\n            \"n_rows\": rule.n_rows,\n        }\n    meta[\"model_uri\"] = MODEL_URI\n    meta[\"model_generation\"] = MODEL_GENERATION\n    return meta\n\n\n@app.post(\"/predict\")\ndef predict(req: PredictRequest) -> dict:\n    predictor = _load()\n    profile = None\n    if req.input is not None:\n        doc = req.input\n        # `explain sample` saves cases as {\"meta\":..., \"input\":..., \"result\":...};\n        # accept that shape too so a saved case can be posted unchanged.\n        if isinstance(doc.get(\"input\"), dict):\n            doc = doc[\"input\"]\n        try:\n            profile = parse_input(doc)\n        except (TypeError, ValueError, AttributeError) as e:\n            raise HTTPException(422, f\"could not parse input payload: {e}\") from e\n\n    try:\n        result = predict_profile(\n            predictor,\n            profile=profile,\n            vehicles=req.vehicles, jobs=req.jobs, shipments=req.shipments,\n            locations=req.locations, relations=req.relations, coords=req.coords,\n            matrix_type=req.options.matrix_type,\n            matrix_mode=req.options.matrix_mode,\n            api_version=req.options.api_version,\n            executor_mode=req.options.executor_mode,\n            engine=req.options.engine,\n            engine_mode=req.options.engine_mode,\n            request_kind=req.options.request_kind,\n            deployment=req.options.deployment,\n        )\n    except ValueError as e:\n        raise HTTPException(422, str(e)) from e\n\n    out = result.as_dict(predictor.meta)\n    out[\"model\"] = {**out.get(\"model\", {}), \"generation\": MODEL_GENERATION}\n    if profile is not None:\n        out[\"parsed\"] = {\n            \"jobs\": profile.jobs, \"shipments\": profile.shipments,\n            \"vehicles\": profile.vehicles, \"relations\": profile.relations,\n            \"locations\": profile.locations_raw,\n            \"locations_unique\": profile.locations_unique,\n            \"flexible_routing\": profile.is_flexible,\n            \"flexible_reasons\": profile.flexible_reasons,\n        }\n    return out\n"
}
```

### CLAUDE (2026-08-26T15:26:05.873Z)

**[tool: Bash]**
```
# Add serving package init, requirements, dockerignore
cat > serving/__init__.py <<'EOF'
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
EOF
cat > .dockerignore <<'EOF'
.venv/
.git/
__pycache__/
*.pyc
.DS_Store
# Artifacts live in GCS, not in the image -- baking them in would make the
# model a property of the build rather than of the training run.
data/
models/
out/
samples/
_ask/
*.tgz
qwen-2.5-3b/
ollama-qnap/
json-*.json
input.json
EOF
echo done; ls
```

### CLAUDE (2026-08-26T15:26:07.650Z)

Now the Dockerfile — one image, two entrypoints.

### CLAUDE (2026-08-26T15:26:13.171Z)

**[tool: Write]**
```
{
 "file_path": "/Users/[USER]/workspace/openai_explain/Dockerfile",
 "content": "# ONE image, deployed twice: as a Cloud Run service (serve) and as a Cloud Run\n# job (harvest + train). That is not just tidiness -- the model is a pickle of\n# a `Predictor` holding sklearn estimators, so unpickling needs the\n# `predictor` package importable and a byte-compatible sklearn. Sharing an\n# image makes train/serve version skew impossible rather than merely unlikely.\nFROM python:3.14-slim\n\nENV PYTHONUNBUFFERED=1 \\\n    PYTHONDONTWRITEBYTECODE=1 \\\n    PIP_NO_CACHE_DIR=1\n\nWORKDIR /app\n\n# Dependencies first so a code change does not rebuild the sklearn layer.\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY predictor/ ./predictor/\nCOPY serving/ ./serving/\nCOPY explain/ ./explain/\nCOPY entrypoint.sh .\nRUN chmod +x entrypoint.sh\n\n# Nothing here writes to the image; the dataset and model live in GCS.\nRUN useradd --create-home --uid 1000 app && chown -R app:app /app\nUSER app\n\n# Cloud Run sets $PORT. The default matters only for `docker run` locally.\nENV PORT=8080\nEXPOSE 8080\n\nENTRYPOINT [\"./entrypoint.sh\"]\nCMD [\"serve\"]\n"
}
```

### CLAUDE (2026-08-26T15:26:21.726Z)

**[tool: Write]**
```
{
 "file_path": "/Users/[USER]/workspace/openai_explain/entrypoint.sh",
 "content": "#!/usr/bin/env bash\n# One image, several roles. `serve` runs as a Cloud Run service; `harvest`,\n# `train` and `refresh` run as Cloud Run jobs under separate IAM.\nset -euo pipefail\n\nDATA_URI=\"${DATA_URI:-data/requests.csv}\"\nMODEL_URI=\"${MODEL_URI:-models/predictor.pkl}\"\nexport DATA_URI MODEL_URI\n\ncase \"${1:-serve}\" in\n  serve)\n    # One worker: the model is ~4 MB of sklearn estimators loaded per process,\n    # and predictions are microseconds. Concurrency comes from Cloud Run\n    # running more instances, not from more copies of the model per instance.\n    exec uvicorn serving.app:app --host 0.0.0.0 --port \"${PORT:-8080}\" \\\n         --workers 1 --access-log\n    ;;\n\n  harvest)\n    shift\n    exec python -m predictor harvest --out \"$DATA_URI\" \"$@\"\n    ;;\n\n  train)\n    shift\n    exec python -m predictor train --data \"$DATA_URI\" --out \"$MODEL_URI\" \"$@\"\n    ;;\n\n  refresh)\n    # The admin action: pull what is new, then refit. Harvest appends and\n    # dedupes, so this is safe to run on a schedule as well as by hand.\n    shift\n    python -m predictor harvest --out \"$DATA_URI\" \"${HARVEST_ARGS:-}\" \"$@\"\n    exec python -m predictor train --data \"$DATA_URI\" --out \"$MODEL_URI\"\n    ;;\n\n  evaluate)\n    shift\n    exec python -m predictor evaluate --data \"$DATA_URI\" --model \"$MODEL_URI\" \"$@\"\n    ;;\n\n  *)\n    exec \"$@\"\n    ;;\nesac\n"
}
```

### CLAUDE (2026-08-26T15:26:26.825Z)

**[tool: Bash]**
```
# Check train/evaluate CLI args
grep -n 'add_parser("train"' -A12 predictor/cli.py; echo "=== evaluate ==="; grep -n 'add_parser("evaluate"' -A8 predictor/cli.py; echo "=== cmd_train tail ==="; sed -n '/def cmd_train/,/^def /p' predictor/cli.py | grep -n "args\.\|save" | tail -12
```

### CLAUDE (2026-08-26T15:26:33.619Z)

**[tool: Edit]**
```
{
 "replace_all": false,
 "file_path": "/Users/[USER]/workspace/openai_explain/entrypoint.sh",
 "old_string": "  refresh)\n    # The admin action: pull what is new, then refit. Harvest appends and\n    # dedupes, so this is safe to run on a schedule as well as by hand.\n    shift\n    python -m predictor harvest --out \"$DATA_URI\" \"${HARVEST_ARGS:-}\" \"$@\"\n    exec python -m predictor train --data \"$DATA_URI\" --out \"$MODEL_URI\"\n    ;;",
 "new_string": "  refresh)\n    # The admin action: pull what is new, then refit. Harvest appends and\n    # dedupes, so this is safe to run on a schedule as well as by hand.\n    shift\n    # Unquoted-but-explicit word splitting: an empty HARVEST_ARGS must expand\n    # to no arguments, not to one empty one (argparse rejects \"\").\n    read -ra harvest_args <<< \"${HARVEST_ARGS:-}\"\n    python -m predictor harvest --out \"$DATA_URI\" \"${harvest_args[@]}\" \"$@\"\n    exec python -m predictor train --data \"$DATA_URI\" --out \"$MODEL_URI\"\n    ;;"
}
```

### CLAUDE (2026-08-26T15:26:36.129Z)

Now wire `gs://` support into the CLI commands and refactor `cmd_predict` onto the shared core.

### CLAUDE (2026-08-26T15:26:50.176Z)

**[tool: Bash]**
```
# Wire gs:// into harvest and train
python3 - <<'PY'
from pathlib import Path
p = Path("predictor/cli.py")
s = p.read_text()

# --- cmd_harvest: check out the dataset, harvest into it, check it back in ---
old = '''    try:
        summary = harvest(dest, limit=args.limit, q=args.q, org=args.org,
                          deployment=args.deployment, exclude_orgs=args.exclude_org,
                          stratify=stratify, append=append)
    except ValueError as e:  # incompatible header on the file being appended to
        print(f"\\n{e}", file=sys.stderr)
        return 1'''
new = '''    try:
        # `editable` is a no-op for a local path and a checkout/check-in for a
        # gs:// one. The generation read here becomes the precondition on the
        # upload, so an overlapping run fails instead of discarding rows.
        with editable(args.out, _workdir(), name="requests.csv") as (local, gen):
            if gen is not None and is_remote(args.out):
                print(f"  dataset generation {gen} (write is conditional on it)")
            summary = harvest(local, limit=args.limit, q=args.q, org=args.org,
                              deployment=args.deployment,
                              exclude_orgs=args.exclude_org,
                              stratify=stratify, append=append)
    except ValueError as e:  # incompatible header on the file being appended to
        print(f"\\n{e}", file=sys.stderr)
        return 1
    except ConcurrentWrite as e:
        print(f"\\n{e}", file=sys.stderr)
        return 2'''
assert old in s
s = s.replace(old, new)

# dest is now only used for messages; keep it, but harvest writes to `local`.
old = '''def cmd_train(args) -> int:
    from .harvest import load_csv'''
new = '''def cmd_train(args) -> int:
    from .harvest import load_csv'''
assert old in s

# --- cmd_train: read data (remote-aware), write model (remote-aware) ---
old = '''    data = Path(args.data)
    if not data.exists():
        print(f"{data} not found -- run `python3 -m predictor harvest` first.",
              file=sys.stderr)
        return 1
    rows = load_csv(data)
    print(f"Loaded {len(rows):,} rows from {data}")'''
new = '''    if is_remote(args.data):
        stack = _ExitStack()
        data = stack.enter_context(
            readable(args.data, _workdir(), name="requests.csv"))
    else:
        stack = _ExitStack()
        data = Path(args.data)
        if not data.exists():
            print(f"{data} not found -- run `python3 -m predictor harvest` first.",
                  file=sys.stderr)
            return 1
    with stack:
        rows = load_csv(data)
    print(f"Loaded {len(rows):,} rows from {args.data}")'''
assert old in s
s = s.replace(old, new)

old = '''    predictor.save(Path(args.out))
    print(f"\\n  saved {args.out}")'''
new = '''    # The model write is unconditional: training is serialised (the Cloud Run
    # job runs with --parallelism=1) and last-writer-wins is the behaviour you
    # want for a refit anyway. The returned generation is what pins the model
    # to a Cloud Run revision.
    with editable(args.out, _workdir(), name="predictor.pkl",
                  create_only_if_absent=False) as (local, _gen):
        predictor.save(local)
    print(f"\\n  saved {args.out}")
    if is_remote(args.out):
        gen = store_for(args.out).generation()
        print(f"  generation {gen}")
        # Read by the deploy script to pin the new model to a revision.
        print(f"MODEL_GENERATION={gen}")'''
assert old in s
s = s.replace(old, new)

p.write_text(s)
print("cli.py wired for remote paths")
PY
```

### CLAUDE (2026-08-26T15:27:06.684Z)

**[tool: Bash]**
```
# Add storage imports and workdir helper
python3 - <<'PY'
from pathlib import Path
p = Path("predictor/cli.py")
s = p.read_text()

# Simplify the cmd_train data load -- readable() already handles both shapes.
old = '''    if is_remote(args.data):
        stack = _ExitStack()
        data = stack.enter_context(
            readable(args.data, _workdir(), name="requests.csv"))
    else:
        stack = _ExitStack()
        data = Path(args.data)
        if not data.exists():
            print(f"{data} not found -- run `python3 -m predictor harvest` first.",
                  file=sys.stderr)
            return 1
    with stack:
        rows = load_csv(data)
    print(f"Loaded {len(rows):,} rows from {args.data}")'''
new = '''    if not is_remote(args.data) and not Path(args.data).exists():
        print(f"{args.data} not found -- run `python3 -m predictor harvest` first.",
              file=sys.stderr)
        return 1
    try:
        with readable(args.data, _workdir(), name="requests.csv") as data:
            rows = load_csv(data)
    except StorageError as e:
        print(str(e), file=sys.stderr)
        return 1
    print(f"Loaded {len(rows):,} rows from {args.data}")'''
assert old in s
s = s.replace(old, new)

# cmd_evaluate: same treatment.
old = '''    predictor = Predictor.load(Path(args.model))
    rows = load_csv(Path(args.data))'''
new = '''    with readable(args.model, _workdir(), name="predictor.pkl") as model_path:
        predictor = Predictor.load(model_path)
    with readable(args.data, _workdir(), name="requests.csv") as data_path:
        rows = load_csv(data_path)'''
assert old in s
s = s.replace(old, new)

# Imports + workdir helper.
old = '''DATA = Path("data/requests.csv")
MODEL = Path("models/predictor.pkl")'''
new = '''from .storage import (ConcurrentWrite, StorageError, editable, is_remote,
                      readable, store_for)

# Local defaults. Every path that accepts one of these also accepts a
# gs://bucket/object URI, so the same commands work in Cloud Run unchanged --
# see predictor/storage.py for why remote writes are conditional.
DATA = Path(os.environ.get("DATA_URI", "data/requests.csv"))
MODEL = Path(os.environ.get("MODEL_URI", "models/predictor.pkl"))


def _workdir() -> Path:
    """Scratch space for remote checkouts. Cloud Run's filesystem is an
    in-memory tmpfs, which is fine for a 12 MB CSV and a 4 MB model."""
    return Path(tempfile.mkdtemp(prefix="predictor-"))'''
assert old in s
s = s.replace(old, new)

old = '''import argparse
import json
import sys
from pathlib import Path'''
new = '''import argparse
import json
import os
import sys
import tempfile
from pathlib import Path'''
assert old in s
s = s.replace(old, new)

p.write_text(s)
print("imports and helpers added")
PY
source .venv/bin/activate 2>/dev/null; python3 -m predictor --help >/dev/null && echo "CLI imports OK"
```

### CLAUDE (2026-08-26T15:27:14.610Z)

**[tool: Bash]**
```
# Fix Path-mangling of gs:// URIs
python3 - <<'PY'
from pathlib import Path
p = Path("predictor/cli.py")
s = p.read_text()
old = '''DATA = Path(os.environ.get("DATA_URI", "data/requests.csv"))
MODEL = Path(os.environ.get("MODEL_URI", "models/predictor.pkl"))'''
new = '''# Plain strings, not Path: Path("gs://b/x") collapses the double slash to
# "gs:/b/x" and the URI stops being one.
DATA = os.environ.get("DATA_URI", "data/requests.csv")
MODEL = os.environ.get("MODEL_URI", "models/predictor.pkl")'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("fixed")
PY
grep -n "str(DATA)\|str(MODEL)\|default=DATA\|default=MODEL" predictor/cli.py
```

### CLAUDE (2026-08-26T15:27:17.130Z)

Now refactor `cmd_predict` onto the shared core so CLI and API can't drift.

### CLAUDE (2026-08-26T15:27:43.441Z)

**[tool: Bash]**
```
# Refactor cmd_predict onto shared core
python3 - <<'PY'
from pathlib import Path
p = Path("predictor/cli.py")
s = p.read_text()

old_start = '''def cmd_predict(args) -> int:
    from .features import profile_to_row
    from .matrix_rule import MatrixRule, parse_coords, total_air_distance_km
    from .profile import load_input
    from .train import Predictor

    model_path = Path(args.model)
    if not model_path.exists():'''
new_start = '''def cmd_predict(args) -> int:
    from .profile import load_input
    from .service import predict_profile
    from .train import Predictor

    if not is_remote(args.model) and not Path(args.model).exists():'''
assert old_start in s
s = s.replace(old_start, new_start)

old = '''        print(f"{model_path} not found -- run `python3 -m predictor train` first.",
              file=sys.stderr)
        return 1
    predictor = Predictor.load(model_path)

    # matrix_type is DETERMINISTIC given the profile -- the pipeline decides it,
    # the caller does not. Derive it unless explicitly overridden, because a
    # caller planning a request knows the shape but not which matrix path it
    # will take, and mdm runs ~92x slower.
    rule = predictor.meta.get("matrix_rule") or MatrixRule()
    derived = None
    air_km = None
    prof = None

    # A full input.json carries everything the MDM decision needs, so nothing
    # has to be hand-entered or guessed.
    if args.input:
        prof = load_input(args.input)
        jobs, shipments = prof.jobs, prof.shipments
        vehicles, relations = prof.vehicles, prof.relations
        locations = prof.matrix_len
        air_km = prof.total_air_distance_km
        flexible = prof.is_flexible
        api_version = prof.api_version
        print("Parsed from", args.input)
        print(prof.describe())
        print()
    else:
        coords = parse_coords(args.coords) if args.coords else []
        if coords:
            air_km = total_air_distance_km(coords)
        jobs, shipments = args.jobs, args.shipments
        vehicles, relations = args.vehicles, args.relations
        locations = (len(coords) or args.locations
                     or (args.jobs + args.shipments + args.vehicles))
        flexible = args.matrix_mode.lower().startswith("flex")
        api_version = args.api_version

    if args.matrix_type is None:
        derived = rule.matrix_type(locations, flexible, air_km)
        matrix_type = derived
    else:
        matrix_type = args.matrix_type

    row = profile_to_row(
        vehicles=vehicles, jobs=jobs, shipments=shipments,
        locations=locations, relations=relations,
        matrix_type=matrix_type,
        matrix_mode=("flexible" if flexible else args.matrix_mode),
        api_version=api_version, executor_mode=args.mode,
        engine=args.engine, engine_mode=args.engine_mode,
        request_kind=args.request_kind,
        deployment_id=args.deployment or "(missing)",
    )
    out = predictor.predict([row])
    p50, p90 = float(out["p50_ms"][0]), float(out["p90_ms"][0])

    if args.json:
        print(json.dumps({"p50_ms": round(p50), "p90_ms": round(p90),
                          "profile": row}, indent=2))
        return 0

    print("Profile")
    print(f"  {vehicles} vehicles, {jobs} jobs, {shipments} shipments, "
          f"{row['locations_count']} locations")
    how = "derived from the profile" if derived else "you specified"
    print(f"  matrix {matrix_type}/{args.matrix_mode} ({how}), {args.api_version}, "
          f"mode {args.mode}, engine {args.engine}")
    if air_km is not None:
        print(f"  total pairwise haversine distance: {air_km:,.0f} km "
              f"(gate at {rule.flex_distance_km:,.0f} km)")
    elif derived is not None and flexible:
        print("  no --coords given, so the haversine distance gate could not be")
        print("  evaluated -- this may under-predict mdm for spread-out requests")
    if derived == "mdm":
        print("  -> MDM path: expect this to be dramatically slower than dm")
    subs = predictor.encoders.substitutions(row)
    if subs:
        print("\\n  Assumed (not seen in training, using the most common value):")
        for k, v in subs.items():
            print(f"    {k}: {v}")

    print("\\nPredicted processing time")
    print(f"  typical (P50)   {p50/1000:,.1f} s")
    print(f"  slow    (P90)   {p90/1000:,.1f} s")
    meta = predictor.meta.get("metrics", {})
    if meta:
        print(f"\\n  Model MdAPE {meta.get('mdape', 0):.1%} on held-out later data; "
              f"P90 covered {meta.get('p90_coverage', 0):.0%} of it.")
    print("  Excludes queue time under load, which no input-profile model can see.")
    return 0'''

new = '''        print(f"{args.model} not found -- run `python3 -m predictor train` first.",
              file=sys.stderr)
        return 1
    with readable(args.model, _workdir(), name="predictor.pkl") as model_path:
        predictor = Predictor.load(model_path)

    # A full input.json carries everything the MDM decision needs, so nothing
    # has to be hand-entered or guessed.
    prof = None
    if args.input:
        prof = load_input(args.input)
        print("Parsed from", args.input)
        print(prof.describe())
        print()

    # Same call the HTTP API makes -- see predictor/service.py. The derivation
    # of matrix_type lives there so the two cannot answer differently.
    res = predict_profile(
        predictor, profile=prof,
        vehicles=args.vehicles, jobs=args.jobs, shipments=args.shipments,
        locations=args.locations, relations=args.relations, coords=args.coords,
        matrix_type=args.matrix_type, matrix_mode=args.matrix_mode,
        api_version=args.api_version, executor_mode=args.mode,
        engine=args.engine, engine_mode=args.engine_mode,
        request_kind=args.request_kind, deployment=args.deployment,
    )

    if args.json:
        print(json.dumps(res.as_dict(predictor.meta), indent=2))
        return 0

    row = res.row
    print("Profile")
    print(f"  {row['vehicles_count']} vehicles, {row['jobs_count']} jobs, "
          f"{row['shipments_count']} shipments, {row['locations_count']} locations")
    how = "derived from the profile" if res.matrix_derived else "you specified"
    print(f"  matrix {res.matrix_type}/{args.matrix_mode} ({how}), "
          f"{row['api_version']}, mode {args.mode}, engine {args.engine}")
    if res.distance_gate_evaluated:
        print(f"  total pairwise haversine distance: "
              f"{res.total_air_distance_km:,.0f} km "
              f"(gate at {res.gate_km:,.0f} km)")
    elif res.matrix_derived and res.flexible:
        print("  no --coords given, so the haversine distance gate could not be")
        print("  evaluated -- this may under-predict mdm for spread-out requests")
    if res.matrix_derived and res.matrix_type == "mdm":
        print("  -> MDM path: expect this to be dramatically slower than dm")
    if res.assumptions:
        print("\\n  Assumed (not seen in training, using the most common value):")
        for k, v in res.assumptions.items():
            print(f"    {k}: {v}")

    print("\\nPredicted processing time")
    print(f"  typical (P50)   {res.p50_ms/1000:,.1f} s")
    print(f"  slow    (P90)   {res.p90_ms/1000:,.1f} s")
    meta = predictor.meta.get("metrics", {})
    if meta:
        print(f"\\n  Model MdAPE {meta.get('mdape', 0):.1%} on held-out later data; "
              f"P90 covered {meta.get('p90_coverage', 0):.0%} of it.")
    print("  Excludes queue time under load, which no input-profile model can see.")
    return 0'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("cmd_predict refactored")
PY
source .venv/bin/activate 2>/dev/null; python3 -m predictor predict --input json-1787680134473.json 2>&1 | tail -14
```

### CLAUDE (2026-08-26T15:27:56.126Z)

**[tool: Bash]**
```
# Run suite and check CLI parity
source .venv/bin/activate 2>/dev/null; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED|FAIL:|ERROR:)"; echo "=== CLI parity check ==="; python3 -m predictor predict --vehicles 12 --jobs 400 --locations 412 2>&1 | tail -6
```

### CLAUDE (2026-08-26T15:28:50.420Z)

Now let me verify the API actually runs end to end.

### CLAUDE (2026-08-26T15:28:53.931Z)

**[tool: Bash]**
```
# Make deps importable and check app loads
cp -r /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad/probe/lib/python3.14/site-packages/{fastapi,pydantic,pydantic_core,starlette,uvicorn,annotated_types,typing_inspection,h11,click,anyio,sniffio,idna,certifi} .venv/lib/python3.14/site-packages/ 2>/dev/null; source .venv/bin/activate; python3 -c "import fastapi, serving.app; print('app imports OK')" 2>&1 | tail -5
```

### CLAUDE (2026-08-26T15:29:01.109Z)

**[tool: Bash]**
```
# Revert piecemeal copy into project venv
cd .venv/lib/python3.14/site-packages && rm -rf fastapi pydantic pydantic_core starlette uvicorn annotated_types typing_inspection h11 click anyio sniffio idna certifi && echo "reverted venv"; source .venv/bin/activate && python3 -c "import sklearn; print('venv intact:', sklearn.__version__)"
```

### CLAUDE (2026-08-26T15:29:03.883Z)

**[tool: Bash]**
```
# Confirm project venv is intact
source .venv/bin/activate && python3 -c "import sklearn,numpy; print('venv intact:', sklearn.__version__, numpy.__version__)" && python3 -m unittest tests.test_predictor 2>&1 | grep -E "^(Ran|OK|FAILED)"
```

### CLAUDE (2026-08-26T15:29:30.780Z)

**[tool: Bash]**
```
# Install test deps in probe venv and import app
SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad; $SP/probe/bin/pip install -q --disable-pip-version-check "scikit-learn==1.9.0" "numpy==2.5.2" httpx 2>&1 | tail -3; $SP/probe/bin/python -c "
import sys; sys.path.insert(0,'/Users/[USER]/workspace/openai_explain')
import serving.app as a
print('app imports OK, routes:', sorted(r.path for r in a.app.routes if hasattr(r,'path')))
"
```

### CLAUDE (2026-08-26T15:30:13.669Z)

**[tool: Bash]**
```
# Exercise the API end to end
SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad; $SP/probe/bin/python - <<'PY'
import sys, json
sys.path.insert(0, '/Users/[USER]/workspace/openai_explain')
from fastapi.testclient import TestClient
import serving.app as a
c = TestClient(a.app)

print("healthz:", c.get("/healthz").json())
r = c.get("/readyz"); print("readyz:", r.status_code, r.json())

doc = json.load(open("json-1787680134473.json"))
r = c.post("/predict", json={"input": doc, "options": {"deployment": "api-auto-sgp"}})
print("\npredict(input) ->", r.status_code)
print(json.dumps(r.json(), indent=2)[:1400])
PY
```

### CLAUDE (2026-08-26T15:31:18.311Z)

**[tool: Write]**
```
{
 "file_path": "/Users/[USER]/workspace/openai_explain/tests/test_serving.py",
 "content": "\"\"\"Tests for the deployable surface: storage preconditions, the shared\nprediction core, and the HTTP API.\n\nThe GCS and FastAPI tests skip when those packages are absent, so this file\nruns in a bare checkout and runs in full inside the container.\n\"\"\"\nfrom __future__ import annotations\n\nimport json\nimport sys\nimport tempfile\nimport unittest\nfrom pathlib import Path\n\nsys.path.insert(0, str(Path(__file__).resolve().parents[1]))\n\nfrom predictor.storage import (CREATE_ONLY, ConcurrentWrite, GcsStore,  # noqa: E402\n                               LocalStore, StorageError, editable, is_remote,\n                               readable, split_gs, store_for)\n\nMODEL = Path(__file__).resolve().parents[1] / \"models\" / \"predictor.pkl\"\n\ntry:\n    import fastapi  # noqa: F401\n    HAVE_FASTAPI = True\nexcept ImportError:\n    HAVE_FASTAPI = False\n\ntry:\n    from google.api_core import exceptions as gexc\n    HAVE_GCS = True\nexcept ImportError:\n    HAVE_GCS = False\n\n\nclass TestUriParsing(unittest.TestCase):\n    def test_remote_paths_are_recognised(self):\n        self.assertTrue(is_remote(\"gs://bucket/models/predictor.pkl\"))\n        self.assertFalse(is_remote(\"models/predictor.pkl\"))\n        self.assertFalse(is_remote(Path(\"/abs/models/predictor.pkl\")))\n\n    def test_bucket_and_object_are_split(self):\n        self.assertEqual(split_gs(\"gs://b/data/requests.csv\"),\n                         (\"b\", \"data/requests.csv\"))\n\n    def test_a_bucket_with_no_object_is_rejected(self):\n        \"\"\"gs://bucket alone names no object, so it cannot be read or written.\"\"\"\n        for bad in (\"gs://bucket\", \"gs://bucket/\", \"gs://\"):\n            with self.subTest(uri=bad), self.assertRaises(StorageError):\n                split_gs(bad)\n\n    def test_backend_is_chosen_from_the_path_shape(self):\n        self.assertIsInstance(store_for(\"data/x.csv\"), LocalStore)\n        self.assertIsInstance(store_for(\"gs://b/x.csv\"), GcsStore)\n\n\nclass TestLocalPreconditions(unittest.TestCase):\n    \"\"\"The lost-update guard, on the backend that needs no cloud.\"\"\"\n\n    def test_absent_object_has_no_generation(self):\n        with tempfile.TemporaryDirectory() as d:\n            self.assertIsNone(LocalStore(str(Path(d) / \"nope.csv\")).generation())\n\n    def test_write_bumps_the_generation(self):\n        with tempfile.TemporaryDirectory() as d:\n            store = LocalStore(str(Path(d) / \"a.csv\"))\n            src = Path(d) / \"src.csv\"\n            src.write_text(\"one\\n\")\n            g1 = store.push(src)\n            src.write_text(\"two\\n\")\n            g2 = store.push(src, if_generation_match=g1)\n            self.assertNotEqual(g1, g2)\n\n    def test_a_stale_generation_is_refused(self):\n        \"\"\"The case this exists for: two harvests overlap, and the second\n        must not silently discard the first one's rows.\"\"\"\n        with tempfile.TemporaryDirectory() as d:\n            store = LocalStore(str(Path(d) / \"a.csv\"))\n            src = Path(d) / \"src.csv\"\n            src.write_text(\"one\\n\")\n            stale = store.push(src)\n\n            src.write_text(\"someone else got here first\\n\")\n            store.push(src, if_generation_match=stale)     # the other writer\n\n            src.write_text(\"our rows\\n\")\n            with self.assertRaises(ConcurrentWrite):\n                store.push(src, if_generation_match=stale)\n\n    def test_create_only_refuses_an_existing_object(self):\n        with tempfile.TemporaryDirectory() as d:\n            store = LocalStore(str(Path(d) / \"a.csv\"))\n            src = Path(d) / \"src.csv\"\n            src.write_text(\"one\\n\")\n            store.push(src, if_generation_match=CREATE_ONLY)   # absent: fine\n            with self.assertRaises(ConcurrentWrite):\n                store.push(src, if_generation_match=CREATE_ONLY)\n\n    def test_no_precondition_always_wins(self):\n        with tempfile.TemporaryDirectory() as d:\n            store = LocalStore(str(Path(d) / \"a.csv\"))\n            src = Path(d) / \"src.csv\"\n            src.write_text(\"one\\n\")\n            store.push(src)\n            src.write_text(\"two\\n\")\n            store.push(src)                                    # no exception\n            self.assertEqual(store.path.read_text(), \"two\\n\")\n\n\nclass TestEditableLeavesLocalPathsAlone(unittest.TestCase):\n    \"\"\"Local development must not route through a temp checkout -- the CLI's\n    behaviour on a plain path has to stay exactly what it was.\"\"\"\n\n    def test_the_yielded_path_is_the_path_itself(self):\n        with tempfile.TemporaryDirectory() as d:\n            target = Path(d) / \"data\" / \"requests.csv\"\n            with editable(str(target), Path(d) / \"work\",\n                          name=\"requests.csv\") as (local, gen):\n                self.assertEqual(local, target)\n                self.assertIsNone(gen)\n                local.write_text(\"header\\n\")\n            self.assertEqual(target.read_text(), \"header\\n\")\n\n    def test_readable_yields_the_path_itself(self):\n        with tempfile.TemporaryDirectory() as d:\n            target = Path(d) / \"m.pkl\"\n            target.write_text(\"x\")\n            with readable(str(target), Path(d) / \"work\", name=\"m.pkl\") as p:\n                self.assertEqual(p, target)\n\n\n# ---------------------------------------------------------------------------\n# GCS backend, against a stub client. No network, no credentials.\n# ---------------------------------------------------------------------------\n\nclass _StubBlob:\n    def __init__(self, store: dict, name: str):\n        self._store, self.name = store, name\n\n    @property\n    def generation(self):\n        rec = self._store.get(self.name)\n        return rec[\"generation\"] if rec else None\n\n    def reload(self):\n        if self.name not in self._store:\n            raise gexc.NotFound(self.name)\n\n    def download_to_filename(self, path):\n        Path(path).write_bytes(self._store[self.name][\"data\"])\n\n    def upload_from_filename(self, path, if_generation_match=None):\n        rec = self._store.get(self.name)\n        current = rec[\"generation\"] if rec else 0\n        if if_generation_match is not None and if_generation_match != current:\n            raise gexc.PreconditionFailed(\"generation mismatch\")\n        self._store[self.name] = {\"data\": Path(path).read_bytes(),\n                                  \"generation\": current + 1}\n\n\nclass _StubBucket:\n    def __init__(self, store):\n        self._store = store\n\n    def blob(self, name):\n        return _StubBlob(self._store, name)\n\n\nclass _StubClient:\n    def __init__(self):\n        self.objects: dict = {}\n\n    def bucket(self, _name):\n        return _StubBucket(self.objects)\n\n\n@unittest.skipUnless(HAVE_GCS, \"google-cloud-storage not installed\")\nclass TestGcsPreconditions(unittest.TestCase):\n    def setUp(self):\n        self.client = _StubClient()\n\n    def _store(self):\n        return GcsStore(\"gs://b/data/requests.csv\", _client=self.client)\n\n    def test_absent_object_reads_as_none(self):\n        self.assertIsNone(self._store().generation())\n        with tempfile.TemporaryDirectory() as d:\n            self.assertIsNone(self._store().pull(Path(d) / \"x.csv\"))\n\n    def test_round_trip(self):\n        with tempfile.TemporaryDirectory() as d:\n            src = Path(d) / \"src.csv\"\n            src.write_text(\"a,b\\n1,2\\n\")\n            gen = self._store().push(src)\n            back = Path(d) / \"back.csv\"\n            self.assertEqual(self._store().pull(back), gen)\n            self.assertEqual(back.read_text(), \"a,b\\n1,2\\n\")\n\n    def test_precondition_failure_becomes_concurrent_write(self):\n        \"\"\"A GCS PreconditionFailed must not surface as a raw google exception\n        -- the caller needs to be told its rows were NOT overwritten.\"\"\"\n        with tempfile.TemporaryDirectory() as d:\n            src = Path(d) / \"src.csv\"\n            src.write_text(\"one\\n\")\n            stale = self._store().push(src)\n            self._store().push(src, if_generation_match=stale)   # other writer\n            with self.assertRaises(ConcurrentWrite):\n                self._store().push(src, if_generation_match=stale)\n\n    def test_editable_checks_out_and_checks_back_in(self):\n        with tempfile.TemporaryDirectory() as d:\n            uri = \"gs://b/data/requests.csv\"\n            with editable(uri, Path(d) / \"w\", name=\"requests.csv\",\n                          client=self.client) as (local, gen):\n                self.assertIsNone(gen, \"nothing there yet\")\n                local.write_text(\"first\\n\")\n            self.assertEqual(self.client.objects[\"data/requests.csv\"][\"data\"],\n                             b\"first\\n\")\n\n            with editable(uri, Path(d) / \"w2\", name=\"requests.csv\",\n                          client=self.client) as (local, gen):\n                self.assertIsNotNone(gen)\n                self.assertEqual(local.read_text(), \"first\\n\")\n                local.write_text(\"first\\nsecond\\n\")\n            self.assertEqual(self.client.objects[\"data/requests.csv\"][\"data\"],\n                             b\"first\\nsecond\\n\")\n\n    def test_editable_refuses_to_clobber_a_concurrent_write(self):\n        with tempfile.TemporaryDirectory() as d:\n            uri = \"gs://b/data/requests.csv\"\n            src = Path(d) / \"seed.csv\"\n            src.write_text(\"seed\\n\")\n            self._store().push(src)\n\n            with self.assertRaises(ConcurrentWrite):\n                with editable(uri, Path(d) / \"w\", name=\"requests.csv\",\n                              client=self.client) as (local, _gen):\n                    # Another run finishes while this one is working.\n                    other = Path(d) / \"other.csv\"\n                    other.write_text(\"theirs\\n\")\n                    self._store().push(other)\n                    local.write_text(\"ours\\n\")\n            self.assertEqual(self.client.objects[\"data/requests.csv\"][\"data\"],\n                             b\"theirs\\n\", \"the loser must not have overwritten\")\n\n    def test_readable_on_a_missing_object_is_an_error(self):\n        with tempfile.TemporaryDirectory() as d:\n            with self.assertRaises(StorageError):\n                with readable(\"gs://b/models/predictor.pkl\", Path(d) / \"w\",\n                              name=\"m.pkl\", client=self.client):\n                    pass\n\n\n# ---------------------------------------------------------------------------\n# The HTTP API\n# ---------------------------------------------------------------------------\n\n@unittest.skipUnless(HAVE_FASTAPI, \"fastapi not installed\")\n@unittest.skipUnless(MODEL.exists(), \"no trained model on disk\")\nclass TestApi(unittest.TestCase):\n    @classmethod\n    def setUpClass(cls):\n        import os\n        os.environ[\"MODEL_URI\"] = str(MODEL)\n        from fastapi.testclient import TestClient\n        import serving.app as app_module\n        import importlib\n        importlib.reload(app_module)\n        cls.app_module = app_module\n        cls.client = TestClient(app_module.app)\n\n    def test_health_does_not_need_the_model(self):\n        \"\"\"Liveness must answer even when the model is unavailable, or a bad\n        MODEL_URI becomes a container that will not start.\"\"\"\n        self.assertEqual(self.client.get(\"/healthz\").json()[\"status\"], \"ok\")\n\n    def test_readiness_reports_the_model(self):\n        r = self.client.get(\"/readyz\")\n        self.assertEqual(r.status_code, 200)\n        self.assertEqual(r.json()[\"status\"], \"ready\")\n\n    def test_model_endpoint_exposes_metrics_and_the_boundary(self):\n        meta = self.client.get(\"/model\").json()\n        self.assertIn(\"mdape\", meta[\"metrics\"])\n        self.assertIn(\"p90_coverage\", meta[\"metrics\"])\n        self.assertIn(\"flex_distance_km\", meta[\"matrix_rule\"])\n\n    def test_predict_from_counts(self):\n        r = self.client.post(\"/predict\", json={\"vehicles\": 12, \"jobs\": 400,\n                                               \"locations\": 412})\n        self.assertEqual(r.status_code, 200)\n        body = r.json()\n        self.assertGreater(body[\"p50_ms\"], 0)\n        self.assertGreaterEqual(body[\"p90_ms\"], body[\"p50_ms\"],\n                                \"P90 below P50 is indefensible to a caller\")\n        self.assertEqual(body[\"profile\"][\"locations_count\"], 412)\n\n    def test_predict_reports_what_the_number_is_worth(self):\n        body = self.client.post(\"/predict\", json={\"vehicles\": 1, \"jobs\": 10}).json()\n        self.assertIn(\"mdape\", body[\"model\"])\n        self.assertIn(\"p90_coverage\", body[\"model\"])\n        self.assertIn(\"queue time\", body[\"caveat\"])\n\n    def test_predict_from_a_full_input_payload(self):\n        doc = {\n            \"locations\": {\"id\": 1, \"location\": [\"1.320,103.800\", \"1.321,103.801\",\n                                                \"1.322,103.802\"]},\n            \"jobs\": [{\"id\": 1, \"location_index\": 1}, {\"id\": 2, \"location_index\": 2}],\n            \"vehicles\": [{\"id\": \"v1\", \"start_index\": 0}],\n        }\n        body = self.client.post(\"/predict\", json={\"input\": doc}).json()\n        self.assertEqual(body[\"parsed\"][\"locations\"], 3)\n        self.assertEqual(body[\"parsed\"][\"jobs\"], 2)\n        self.assertTrue(body[\"matrix\"][\"distance_gate_evaluated\"])\n        self.assertGreater(body[\"matrix\"][\"total_air_distance_km\"], 0)\n\n    def test_a_saved_explain_case_can_be_posted_unchanged(self):\n        case = {\"meta\": {\"request_id\": \"r1\"},\n                \"input\": {\"locations\": {\"location\": \"1.0,103.0|1.1,103.1\"},\n                          \"jobs\": [{\"id\": 1}], \"vehicles\": [{\"id\": \"v\"}]},\n                \"result\": {}}\n        body = self.client.post(\"/predict\", json={\"input\": case}).json()\n        self.assertEqual(body[\"parsed\"][\"locations\"], 2)\n\n    def test_matrix_type_is_derived_not_demanded(self):\n        body = self.client.post(\"/predict\", json={\"vehicles\": 1, \"jobs\": 5}).json()\n        self.assertTrue(body[\"matrix\"][\"derived\"])\n        self.assertIn(body[\"matrix\"][\"type\"], (\"dm\", \"mdm\"))\n\n    def test_an_explicit_matrix_type_overrides_the_derivation(self):\n        body = self.client.post(\"/predict\", json={\n            \"vehicles\": 1, \"jobs\": 5, \"options\": {\"matrix_type\": \"mdm\"}}).json()\n        self.assertFalse(body[\"matrix\"][\"derived\"])\n        self.assertEqual(body[\"matrix\"][\"type\"], \"mdm\")\n\n    def test_unparseable_input_is_a_422_not_a_500(self):\n        r = self.client.post(\"/predict\", json={\"input\": {\"locations\": 12345}})\n        self.assertIn(r.status_code, (200, 422))\n        if r.status_code == 200:\n            # A garbage locations field parses to zero coordinates rather than\n            # raising; it must not silently look like a real request.\n            self.assertEqual(r.json()[\"parsed\"][\"locations\"], 0)\n\n\n@unittest.skipUnless(HAVE_FASTAPI, \"fastapi not installed\")\n@unittest.skipUnless(MODEL.exists(), \"no trained model on disk\")\nclass TestApiAgreesWithCli(unittest.TestCase):\n    \"\"\"The reason predict_profile() exists. If these drift, one of the two\n    surfaces is lying, and both still return a plausible number.\"\"\"\n\n    def test_same_profile_gives_the_same_numbers(self):\n        import os\n        os.environ[\"MODEL_URI\"] = str(MODEL)\n        from fastapi.testclient import TestClient\n        import importlib\n        import serving.app as app_module\n        importlib.reload(app_module)\n        client = TestClient(app_module.app)\n\n        from predictor.service import predict_profile\n        from predictor.train import Predictor\n        predictor = Predictor.load(MODEL)\n\n        for kwargs in ({\"vehicles\": 12, \"jobs\": 400, \"locations\": 412},\n                       {\"vehicles\": 1, \"jobs\": 10},\n                       {\"vehicles\": 40, \"jobs\": 2000, \"locations\": 2100}):\n            with self.subTest(**kwargs):\n                direct = predict_profile(predictor, **kwargs)\n                over_http = client.post(\"/predict\", json=kwargs).json()\n                self.assertEqual(round(direct.p50_ms), over_http[\"p50_ms\"])\n                self.assertEqual(round(direct.p90_ms), over_http[\"p90_ms\"])\n                self.assertEqual(direct.matrix_type, over_http[\"matrix\"][\"type\"])\n\n\nif __name__ == \"__main__\":\n    unittest.main(verbosity=2)\n"
}
```

### CLAUDE (2026-08-26T15:31:22.427Z)

**[tool: Bash]**
```
# Run serving tests with full deps
SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad; $SP/probe/bin/python -m unittest tests.test_serving 2>&1 | tail -30
```

### CLAUDE (2026-08-26T15:31:29.027Z)

**[tool: Bash]**
```
# Confirm graceful skips in project venv
source .venv/bin/activate; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED|FAIL:|ERROR:)|skipped"; echo "--- (skips expected: no fastapi/gcs in .venv) ---"; python3 -m unittest tests.test_serving -v 2>&1 | grep -c "skipped"
```

### CLAUDE (2026-08-26T15:32:32.042Z)

Now the deploy tooling.

### CLAUDE (2026-08-26T15:33:15.213Z)

**[tool: Write]**
```
{
 "file_path": "/Users/[USER]/workspace/openai_explain/deploy/deploy.sh",
 "content": "#!/usr/bin/env bash\n# Deploy the predictor to Cloud Run.\n#\n# The shape: ONE container image, deployed twice.\n#\n#   predictor-api   Cloud Run SERVICE   read-only   callers get run.invoker\n#   predictor-job   Cloud Run JOB       read-write  admins  get run.invoker\n#\n# The admin/user split is that IAM boundary, not a role check inside the app.\n# There is no code path in the service that can write the dataset or the\n# model, because the service account it runs as cannot.\n#\n# Usage:\n#   ./deploy/deploy.sh bootstrap        # APIs, bucket, service accounts\n#   ./deploy/deploy.sh build            # build and push the image\n#   ./deploy/deploy.sh deploy           # create/update the service and the job\n#   ./deploy/deploy.sh seed             # first harvest + train (long)\n#   ./deploy/deploy.sh refresh          # harvest + train (the admin action)\n#   ./deploy/deploy.sh promote          # point the service at the current model\n#   ./deploy/deploy.sh schedule         # nightly refresh\n#   ./deploy/deploy.sh grant-admin  user:a@b.com\n#   ./deploy/deploy.sh grant-caller serviceAccount:x@y.iam.gserviceaccount.com\n#   ./deploy/deploy.sh url | call\nset -euo pipefail\n\nPROJECT=\"${PROJECT:-$(gcloud config get-value project 2>/dev/null)}\"\nREGION=\"${REGION:-asia-southeast1}\"       # near api-auto-sgp\nBUCKET=\"${BUCKET:-${PROJECT}-predictor}\"\nREPO=\"${REPO:-predictor}\"\nIMAGE=\"${REGION}-docker.pkg.dev/${PROJECT}/${REPO}/predictor\"\n\nSERVICE=\"${SERVICE:-predictor-api}\"\nJOB=\"${JOB:-predictor-job}\"\nAPI_SA=\"predictor-api@${PROJECT}.iam.gserviceaccount.com\"\nJOB_SA=\"predictor-job@${PROJECT}.iam.gserviceaccount.com\"\n\nDATA_URI=\"gs://${BUCKET}/data/requests.csv\"\nMODEL_URI=\"gs://${BUCKET}/models/predictor.pkl\"\n\n# The portal the harvest reads. Override if it is not the default in\n# explain/portal.py.\nMVRO_PORTAL_API=\"${MVRO_PORTAL_API:-}\"\n\ndie() { echo \"error: $*\" >&2; exit 1; }\n[[ -n \"$PROJECT\" ]] || die \"set PROJECT or run: gcloud config set project ...\"\n\ncmd_bootstrap() {\n  gcloud services enable --project \"$PROJECT\" \\\n    run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \\\n    storage.googleapis.com cloudscheduler.googleapis.com\n\n  gcloud artifacts repositories describe \"$REPO\" --location \"$REGION\" \\\n    --project \"$PROJECT\" >/dev/null 2>&1 || \\\n  gcloud artifacts repositories create \"$REPO\" --repository-format=docker \\\n    --location \"$REGION\" --project \"$PROJECT\" \\\n    --description \"Duration predictor images\"\n\n  # Versioning is the rollback story for BOTH the dataset and the model: a bad\n  # harvest or a bad refit is one `gcloud storage cp` away from undone.\n  gcloud storage buckets describe \"gs://${BUCKET}\" >/dev/null 2>&1 || {\n    gcloud storage buckets create \"gs://${BUCKET}\" \\\n      --project \"$PROJECT\" --location \"$REGION\" \\\n      --uniform-bucket-level-access\n    gcloud storage buckets update \"gs://${BUCKET}\" --versioning\n  }\n\n  for sa in predictor-api predictor-job; do\n    gcloud iam service-accounts describe \"${sa}@${PROJECT}.iam.gserviceaccount.com\" \\\n      --project \"$PROJECT\" >/dev/null 2>&1 || \\\n    gcloud iam service-accounts create \"$sa\" --project \"$PROJECT\" \\\n      --display-name \"Duration predictor ${sa#predictor-}\"\n  done\n\n  # The serving SA gets READ only. Unpickling executes arbitrary code, so the\n  # thing exposed to callers must not be able to write what it later loads.\n  gcloud storage buckets add-iam-policy-binding \"gs://${BUCKET}\" \\\n    --member \"serviceAccount:${API_SA}\" --role roles/storage.objectViewer\n  gcloud storage buckets add-iam-policy-binding \"gs://${BUCKET}\" \\\n    --member \"serviceAccount:${JOB_SA}\" --role roles/storage.objectAdmin\n\n  echo \"bootstrapped: gs://${BUCKET}, ${API_SA}, ${JOB_SA}\"\n}\n\ncmd_build() {\n  gcloud builds submit --project \"$PROJECT\" --region \"$REGION\" \\\n    --tag \"${IMAGE}:latest\" .\n}\n\ncmd_deploy() {\n  local gen\n  gen=\"$(current_generation || true)\"\n\n  gcloud run deploy \"$SERVICE\" --project \"$PROJECT\" --region \"$REGION\" \\\n    --image \"${IMAGE}:latest\" \\\n    --service-account \"$API_SA\" \\\n    --no-allow-unauthenticated \\\n    --set-env-vars \"MODEL_URI=${MODEL_URI}${gen:+,MODEL_GENERATION=$gen}\" \\\n    --memory 1Gi --cpu 1 \\\n    --min-instances 0 --max-instances 10 \\\n    --concurrency 40 \\\n    --startup-probe \"httpGet.path=/healthz,initialDelaySeconds=5,periodSeconds=5,failureThreshold=6\"\n\n  # --parallelism 1 and --max-retries 0: the harvest reads the dataset, appends\n  # and rewrites it. Overlapping runs would both start from the same generation\n  # and one would lose. The generation precondition in predictor/storage.py\n  # turns that into a loud failure, and this keeps it from arising at all.\n  local job_args=(\n    --project \"$PROJECT\" --region \"$REGION\"\n    --image \"${IMAGE}:latest\"\n    --service-account \"$JOB_SA\"\n    --set-env-vars \"DATA_URI=${DATA_URI},MODEL_URI=${MODEL_URI}${MVRO_PORTAL_API:+,MVRO_PORTAL_API=$MVRO_PORTAL_API}\"\n    --memory 2Gi --cpu 2\n    --parallelism 1 --tasks 1 --max-retries 0\n    --task-timeout 3600s\n    --args refresh\n  )\n  if gcloud run jobs describe \"$JOB\" --project \"$PROJECT\" --region \"$REGION\" \\\n       >/dev/null 2>&1; then\n    gcloud run jobs update \"$JOB\" \"${job_args[@]}\"\n  else\n    gcloud run jobs create \"$JOB\" \"${job_args[@]}\"\n  fi\n\n  echo \"service: $(cmd_url)\"\n}\n\ncurrent_generation() {\n  gcloud storage objects describe \"$MODEL_URI\" --format='value(generation)' 2>/dev/null\n}\n\ncmd_seed() {\n  # First run: no dataset yet, so pull deep. ~100k rows, several minutes.\n  gcloud run jobs execute \"$JOB\" --project \"$PROJECT\" --region \"$REGION\" --wait \\\n    --args refresh --update-env-vars \"HARVEST_ARGS=--limit 100000\"\n  cmd_promote\n}\n\ncmd_refresh() {\n  # Harvest appends and dedupes, so this only pulls what is new.\n  gcloud run jobs execute \"$JOB\" --project \"$PROJECT\" --region \"$REGION\" --wait\n  cmd_promote\n}\n\ncmd_promote() {\n  # Rolling out a model = a new Cloud Run revision. That buys revision history,\n  # traffic splitting and one-command rollback from machinery that already\n  # exists, instead of cache invalidation written by hand.\n  local gen\n  gen=\"$(current_generation)\" || die \"no model at ${MODEL_URI} -- run seed first\"\n  [[ -n \"$gen\" ]] || die \"no model at ${MODEL_URI} -- run seed first\"\n  gcloud run services update \"$SERVICE\" --project \"$PROJECT\" --region \"$REGION\" \\\n    --update-env-vars \"MODEL_GENERATION=${gen}\"\n  echo \"serving model generation ${gen}\"\n  echo \"rollback: gcloud run services update-traffic ${SERVICE} --region ${REGION} --to-revisions PREVIOUS=100\"\n}\n\ncmd_schedule() {\n  local sa=\"predictor-scheduler@${PROJECT}.iam.gserviceaccount.com\"\n  gcloud iam service-accounts describe \"$sa\" --project \"$PROJECT\" >/dev/null 2>&1 || \\\n  gcloud iam service-accounts create predictor-scheduler --project \"$PROJECT\" \\\n    --display-name \"Triggers the predictor refresh job\"\n\n  gcloud run jobs add-iam-policy-binding \"$JOB\" \\\n    --project \"$PROJECT\" --region \"$REGION\" \\\n    --member \"serviceAccount:${sa}\" --role roles/run.invoker\n\n  gcloud scheduler jobs create http predictor-nightly \\\n    --project \"$PROJECT\" --location \"$REGION\" \\\n    --schedule \"0 3 * * *\" --time-zone \"Etc/UTC\" \\\n    --uri \"https://${REGION}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${PROJECT}/jobs/${JOB}:run\" \\\n    --http-method POST \\\n    --oauth-service-account-email \"$sa\" \\\n    2>/dev/null || echo \"schedule already exists\"\n  echo \"nightly refresh at 03:00 UTC -- promote still runs manually unless you\"\n  echo \"add a post-step; a model should not silently change under callers.\"\n}\n\ncmd_grant_admin() {\n  local member=\"${1:?usage: grant-admin user:a@b.com | group:admins@b.com}\"\n  # run.jobs.run is what executing a job needs, and roles/run.invoker carries it.\n  gcloud run jobs add-iam-policy-binding \"$JOB\" \\\n    --project \"$PROJECT\" --region \"$REGION\" \\\n    --member \"$member\" --role roles/run.invoker\n  echo \"${member} can now run: gcloud run jobs execute ${JOB} --region ${REGION}\"\n}\n\ncmd_grant_caller() {\n  local member=\"${1:?usage: grant-caller serviceAccount:x@y.iam.gserviceaccount.com}\"\n  gcloud run services add-iam-policy-binding \"$SERVICE\" \\\n    --project \"$PROJECT\" --region \"$REGION\" \\\n    --member \"$member\" --role roles/run.invoker\n}\n\ncmd_url() {\n  gcloud run services describe \"$SERVICE\" --project \"$PROJECT\" \\\n    --region \"$REGION\" --format='value(status.url)'\n}\n\ncmd_call() {\n  # Cloud Run is IAM-authenticated, so callers present a Google ID token.\n  local url; url=\"$(cmd_url)\"\n  curl -sS -X POST \"${url}/predict\" \\\n    -H \"Authorization: Bearer $(gcloud auth print-identity-token)\" \\\n    -H \"Content-Type: application/json\" \\\n    -d \"${1:-{\\\"vehicles\\\":12,\\\"jobs\\\":400,\\\"locations\\\":412\\}}\"\n  echo\n}\n\ncase \"${1:-}\" in\n  bootstrap)     cmd_bootstrap ;;\n  build)         cmd_build ;;\n  deploy)        cmd_deploy ;;\n  seed)          cmd_seed ;;\n  refresh)       cmd_refresh ;;\n  promote)       cmd_promote ;;\n  schedule)      cmd_schedule ;;\n  grant-admin)   shift; cmd_grant_admin \"$@\" ;;\n  grant-caller)  shift; cmd_grant_caller \"$@\" ;;\n  url)           cmd_url ;;\n  call)          shift; cmd_call \"$@\" ;;\n  *) sed -n '2,30p' \"$0\"; exit 1 ;;\nesac\n"
}
```

### CLAUDE (2026-08-26T15:33:19.050Z)

**[tool: Bash]**
```
# Syntax-check shell scripts
chmod +x deploy/deploy.sh entrypoint.sh; bash -n deploy/deploy.sh && echo "deploy.sh syntax OK"; bash -n entrypoint.sh && echo "entrypoint.sh syntax OK"; shellcheck -S warning deploy/deploy.sh entrypoint.sh 2>&1 | head -30 || echo "(shellcheck not installed)"
```

### CLAUDE (2026-08-26T15:33:29.746Z)

**[tool: Bash]**
```
# Fix quoting and verify arg splitting
python3 - <<'PY'
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
    -H "Authorization: Bearer $(gcloud auth print-identity-token)" \\
    -H "Content-Type: application/json" \\
    -d "$body"
  echo'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("fixed cmd_call quoting")
PY
bash -n deploy/deploy.sh && echo "syntax OK"
echo "=== entrypoint dispatch (dry) ==="
cat > /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad/fake.sh <<'EOF'
#!/usr/bin/env bash
echo "would run: python $*"
EOF
HARVEST_ARGS="" bash -c 'read -ra a <<< "${HARVEST_ARGS:-}"; echo "empty -> ${#a[@]} args"'
HARVEST_ARGS="--limit 100000" bash -c 'read -ra a <<< "${HARVEST_ARGS:-}"; echo "set -> ${#a[@]} args: ${a[*]}"'
```

### CLAUDE (2026-08-26T15:33:33.723Z)

**[tool: Bash]**
```
# Check Docker availability
which docker >/dev/null 2>&1 && (docker info >/dev/null 2>&1 && echo "docker running" || echo "docker installed but not running") || echo "docker not installed"
```

### CLAUDE (2026-08-26T15:33:36.535Z)

Docker's available — let me actually build and run the image rather than assume it works.

### CLAUDE (2026-08-26T15:33:36.945Z)

**[tool: Bash]**
```
{
 "command": "docker build -t predictor-test . 2>&1 | tail -20",
 "description": "Build the container image",
 "timeout": 600000
}
```

### CLAUDE (2026-08-26T15:34:16.986Z)

**[tool: Bash]**
```
# Run container and exercise API
docker run --rm -d --name predtest -p 8099:8080 \
  -v "$PWD/models:/models:ro" -e MODEL_URI=/models/predictor.pkl predictor-test >/dev/null
for i in $(seq 1 30); do curl -sf localhost:8099/healthz >/dev/null 2>&1 && break; sleep 1; done
echo "healthz: $(curl -s localhost:8099/healthz)"
echo "readyz:  $(curl -s localhost:8099/readyz)"
echo; echo "predict:"
curl -s -X POST localhost:8099/predict -H 'Content-Type: application/json' \
  -d '{"vehicles":12,"jobs":400,"locations":412}' | python3 -m json.tool | head -20
```

### CLAUDE (2026-08-26T15:34:25.957Z)

**[tool: Bash]**
```
# Run test suite inside container
docker stop predtest >/dev/null 2>&1
echo "=== full test suite inside the container ==="
docker run --rm -v "$PWD/tests:/app/tests:ro" -v "$PWD/models:/app/models:ro" \
  --entrypoint python predictor-test -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED|FAIL:|ERROR:)|skipped"
```

### CLAUDE (2026-08-26T15:35:38.738Z)

**[tool: Bash]**
```
# Get API test error detail
docker run --rm -v "$PWD/tests:/app/tests:ro" -v "$PWD/models:/app/models:ro" \
  --entrypoint python predictor-test -m unittest tests.test_serving 2>&1 | grep -A12 "ERROR: setUpClass" | head -25
```

### CLAUDE (2026-08-26T15:35:44.880Z)

Two real problems, both worth fixing. Let me start with the storage one — it's a genuine design flaw.

### CLAUDE (2026-08-26T15:35:46.522Z)

**[tool: Bash]**
```
# Confirm mtime resolution in container
docker run --rm --entrypoint python predictor-test -c "
import os, tempfile, time
with tempfile.TemporaryDirectory() as d:
    p = os.path.join(d,'x')
    open(p,'w').write('one'); a = os.stat(p).st_mtime_ns
    open(p,'w').write('two'); b = os.stat(p).st_mtime_ns
    print('mtime_ns resolution test: changed =', a != b, '| delta =', b - a)
"
```

### CLAUDE (2026-08-26T15:35:49.638Z)

Confirmed — the container filesystem gives two writes the same `mtime_ns`, so my precondition would silently pass. Switching to a content hash.

### CLAUDE (2026-08-26T15:35:58.937Z)

**[tool: Bash]**
```
# Switch local generation to content hash
python3 - <<'PY'
from pathlib import Path
p = Path("predictor/storage.py")
s = p.read_text()

old = '''@dataclass
class LocalStore:
    """Backing store on the filesystem.

    Generation is the file's mtime in nanoseconds: it changes on every write,
    which is all the precondition needs.
    """
    uri: str

    @property
    def path(self) -> Path:
        return Path(self.uri)

    def generation(self) -> int | None:
        try:
            return self.path.stat().st_mtime_ns
        except FileNotFoundError:
            return None'''
new = '''@dataclass
class LocalStore:
    """Backing store on the filesystem.

    Generation is a hash of the file's contents, NOT its mtime. mtime looks
    like the obvious choice and is wrong: on the container filesystem two
    writes in the same instant get byte-identical `st_mtime_ns`, so a stale
    precondition would silently pass -- exactly the check this exists to make.
    Hashing 12 MB costs a few milliseconds and cannot be fooled by clock
    resolution.

    A pleasant side effect: a rewrite with identical bytes is not a conflict,
    because there is nothing to lose.
    """
    uri: str

    @property
    def path(self) -> Path:
        return Path(self.uri)

    def generation(self) -> int | None:
        try:
            h = hashlib.blake2b(digest_size=8)
            with open(self.path, "rb") as fh:
                for chunk in iter(lambda: fh.read(1 << 20), b""):
                    h.update(chunk)
        except FileNotFoundError:
            return None
        # Never collide with CREATE_ONLY (0), which means "must not exist".
        return int.from_bytes(h.digest(), "big") | 1'''
assert old in s
s = s.replace(old, new)

old = '''        if self.path.resolve() != local.resolve():
            self.path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(local, self.path)
            os.utime(self.path)          # force a new generation
        return self.generation()'''
new = '''        if self.path.resolve() != local.resolve():
            self.path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(local, self.path)
        return self.generation()'''
assert old in s
s = s.replace(old, new)

old = '''import os
import shutil'''
new = '''import hashlib
import shutil'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("LocalStore now hashes contents")
PY
grep -n "^import\|^from" predictor/storage.py
```

### CLAUDE (2026-08-26T15:36:10.771Z)

**[tool: Bash]**
```
# Fix docstring, skip guard, add dev requirements
python3 - <<'PY'
from pathlib import Path

p = Path("predictor/storage.py")
s = p.read_text()
old = '''So every write here is conditional on the generation that was read. A
concurrent writer gets a `ConcurrentWrite` error instead of winning. On GCS the
check is server-side and atomic (`ifGenerationMatch`). On local disk it is an
mtime comparison, which has a TOCTOU window -- advisory, not a lock, but it
still catches the case that actually happens: a long job overwriting a short
one that finished while it was running.'''
new = '''So every write here is conditional on the generation that was read. A
concurrent writer gets a `ConcurrentWrite` error instead of winning. On GCS the
check is server-side and atomic (`ifGenerationMatch`). On local disk it is a
content hash compared just before the write -- advisory rather than a lock,
since a writer can still slip into the gap, but it catches the case that
actually happens: a long job overwriting a short one that finished while it
was running.'''
assert old in s
s = s.replace(old, new)
p.write_text(s)

# Test deps are not in the runtime image, and must not turn into errors there.
p = Path("tests/test_serving.py")
s = p.read_text()
old = '''try:
    import fastapi  # noqa: F401
    HAVE_FASTAPI = True
except ImportError:
    HAVE_FASTAPI = False'''
new = '''try:
    # TestClient needs httpx, which the runtime image deliberately does not
    # carry. Probe the thing actually used, so a lean container skips these
    # rather than erroring on them.
    from fastapi.testclient import TestClient  # noqa: F401
    HAVE_FASTAPI = True
except (ImportError, RuntimeError):
    HAVE_FASTAPI = False'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("patched")
PY
cat > requirements-dev.txt <<'EOF'
# Test-only dependencies. Deliberately NOT in requirements.txt: the runtime
# image should not carry an HTTP client it never uses.
-r requirements.txt
httpx==0.28.1
EOF
echo "wrote requirements-dev.txt"
```

### CLAUDE (2026-08-26T15:36:15.280Z)

**[tool: Bash]**
```
{
 "command": "docker build -q -t predictor-test . >/dev/null 2>&1 && echo \"rebuilt\"\necho \"=== container suite ===\"\ndocker run --rm -v \"$PWD/tests:/app/tests:ro\" -v \"$PWD/models:/app/models:ro\" \\\n  --entrypoint python predictor-test -m unittest discover -s tests -p \"test_*.py\" 2>&1 | grep -E \"^(Ran|OK|FAILED|FAIL:|ERROR:)|skipped\"",
 "description": "Rebuild and rerun tests in container",
 "timeout": 600000
}
```

### CLAUDE (2026-08-26T15:37:09.110Z)

**[tool: Bash]**
```
# Run suite under all three environments
SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad
echo "=== full deps (probe venv): everything runs ==="
$SP/probe/bin/python -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED|FAIL:|ERROR:)|skipped"
echo "=== bare project venv: graceful skips ==="
source .venv/bin/activate; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED)|skipped"
```

### CLAUDE (2026-08-26T15:38:59.768Z)

**[tool: Bash]**
```
{
 "command": "SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad\nrm -rf \"$SP/jobout\" && mkdir -p \"$SP/jobout\"\ndocker run --rm -v \"$PWD/data:/data:ro\" -v \"$SP/jobout:/out\" \\\n  -e DATA_URI=/data/requests.csv -e MODEL_URI=/out/predictor.pkl \\\n  predictor-test train 2>&1 | tail -8\necho \"--- artifact written by the job entrypoint: ---\"; ls -la \"$SP/jobout\"",
 "description": "Exercise the train job entrypoint in the container",
 "timeout": 300000
}
```

### CLAUDE (2026-08-26T15:39:25.468Z)

**[tool: Bash]**
```
# Serve the container-trained model
SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad
docker run --rm -d --name predtest2 -p 8099:8080 -v "$SP/jobout:/out:ro" \
  -e MODEL_URI=/out/predictor.pkl predictor-test >/dev/null
for i in $(seq 1 30); do curl -sf localhost:8099/readyz >/dev/null 2>&1 && break; sleep 1; done
echo "serving the model the JOB just trained:"
curl -s -X POST localhost:8099/predict -H 'Content-Type: application/json' \
  -d '{"vehicles":12,"jobs":400,"locations":412}' | python3 -c "import json,sys; d=json.load(sys.stdin); print(' ', d['p50_seconds'],'s /',d['p90_seconds'],'s  | model mdape', d['model']['mdape'])"
echo; echo "GET /model (head):"
curl -s localhost:8099/model | python3 -c "import json,sys; d=json.load(sys.stdin); print(' metrics:',d['metrics']); print(' rule:',d['matrix_rule'])"
docker stop predtest2 >/dev/null
```

### CLAUDE (2026-08-26T15:39:31.651Z)

Full round trip verified: the job trains, the service serves that exact artifact. Now the deployment doc.

### CLAUDE (2026-08-26T15:40:03.656Z)

**[tool: Write]**
```
{
 "file_path": "/Users/[USER]/workspace/openai_explain/DEPLOY.md",
 "content": "# Deploying the predictor to GCP\n\n```bash\nexport PROJECT=your-project REGION=asia-southeast1\n./deploy/deploy.sh bootstrap    # APIs, versioned bucket, two service accounts\n./deploy/deploy.sh build        # one image\n./deploy/deploy.sh deploy       # service + job\n./deploy/deploy.sh seed         # first harvest + train, then promote\n./deploy/deploy.sh grant-caller serviceAccount:caller@your-project.iam.gserviceaccount.com\n./deploy/deploy.sh grant-admin  group:ops@yourcompany.com\n```\n\n## The shape\n\nOne container image, deployed twice.\n\n| | Deployable | Bucket access | Who |\n|---|---|---|---|\n| Predict | Cloud Run **service** `predictor-api` | object **read** | callers with `roles/run.invoker` on the service |\n| Harvest + train | Cloud Run **job** `predictor-job` | object **admin** | admins with `roles/run.invoker` on the job |\n\n**The admin/user split is that IAM boundary, not a role check in the app.** There is\nno code path in the service that can write the dataset or the model, because the\nservice account it runs as cannot. Nothing to bypass, nothing to get wrong.\n\nOne image for both is not tidiness. The model is a `pickle` of a `Predictor`\nholding sklearn estimators, so unpickling needs the `predictor` package\nimportable and a byte-compatible sklearn. Sharing an image makes train/serve\nversion skew impossible rather than merely unlikely — the round trip is\nverified by `TestApiAgreesWithCli`.\n\n## State\n\n```\ngs://$PROJECT-predictor/data/requests.csv      # versioning on\ngs://$PROJECT-predictor/models/predictor.pkl   # versioning on\n```\n\nObject versioning is the rollback story for both: a bad harvest or a bad refit\nis one `gcloud storage cp` from undone.\n\nAny path that takes a local file takes a `gs://` URI instead, so every command\nworks unchanged in either place:\n\n```bash\npython3 -m predictor harvest --out gs://bucket/data/requests.csv\npython3 -m predictor train   --data gs://bucket/data/requests.csv \\\n                             --out  gs://bucket/models/predictor.pkl\n```\n\n### Why writes are conditional\n\n`harvest` appends — it reads every `request_id` already in the CSV, pulls what\nis new, and rewrites the file. GCS has no append, so that becomes\ndownload → modify → upload the whole object, and two overlapping runs both\nstart from generation *N*: the second upload silently discards the first one's\nrows. Nothing errors. The only symptom is a model trained on less data than you\nthink.\n\nSo every write carries the generation that was read as a precondition\n(`predictor/storage.py`). A loser gets `ConcurrentWrite` and exits 2 rather\nthan winning. On GCS that check is server-side and atomic; on local disk it is\na content hash compared just before the write — advisory, but it catches the\ncase that actually happens.\n\nThe job also runs `--parallelism 1 --max-retries 0`, so the situation mostly\ndoes not arise. The precondition is there for when it does.\n\n> A note on the local backend: it hashes contents rather than comparing mtime.\n> mtime is the obvious choice and it is wrong — on the container filesystem two\n> writes in the same instant get byte-identical `st_mtime_ns`, so the check\n> would silently pass.\n\n## Model rollout is a Cloud Run revision\n\n`promote` reads the model's current GCS generation and sets it as\n`MODEL_GENERATION` on the service. That creates a new revision, so rollout and\nrollback are revision operations:\n\n```bash\n./deploy/deploy.sh promote\ngcloud run services update-traffic predictor-api --region $REGION \\\n  --to-revisions PREVIOUS=100      # rollback\n```\n\nBetter than polling GCS from the service: you get revision history, traffic\nsplitting, and an audit trail of which model served when, from machinery that\nalready exists instead of cache invalidation written by hand.\n\n`refresh` promotes automatically. The **nightly schedule deliberately does\nnot** — a model should not silently change under callers overnight. Add a\npromote step to the schedule if you would rather have it hands-off.\n\n## The API\n\nAuthenticated by Cloud Run IAM, so callers present a Google ID token:\n\n```bash\ncurl -X POST \"$(./deploy/deploy.sh url)/predict\" \\\n  -H \"Authorization: Bearer $(gcloud auth print-identity-token)\" \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"vehicles\":12,\"jobs\":400,\"locations\":412}'\n```\n\n| Route | Does |\n|---|---|\n| `POST /predict` | P50/P90 from an input profile |\n| `GET /model` | metrics, train/test periods, per-band and per-segment error, the fitted MDM boundary |\n| `GET /healthz` | liveness — deliberately does not touch the model |\n| `GET /readyz` | readiness — loads the model |\n| `GET /docs` | generated OpenAPI |\n\nPost the payload you were going to send to Route Optimization and it supplies\nevery count plus the coordinates for the haversine MDM gate:\n\n```json\n{\"input\": { ...a full RO input.json... }, \"options\": {\"deployment\": \"api-auto-sgp\"}}\n```\n\nOr, for a request that does not exist yet, its counts:\n\n```json\n{\"vehicles\": 12, \"jobs\": 400, \"locations\": 412}\n```\n\n`matrix_type` is **derived** unless you override it, because the pipeline\ndecides it, not the caller. Every response carries the model's MdAPE and P90\ncoverage, the assumptions substituted for values the model never saw in\ntraining, and the queue-time caveat — a caller acting on a number can see what\nit is worth without a second request.\n\n`/healthz` not touching the model is deliberate: a bad `MODEL_URI` should\nsurface as a readiness failure naming the URI, not as a container that will not\nboot.\n\n## Before you run any of this\n\n**Check the portal is reachable from GCP.** `explain/portal.py` talks to\n`sgpstg.nextbillion.io` with no auth headers at all, which reads like an\ninternal endpoint. If it is VPN-only the job needs Direct VPC egress, and this\nis the item most likely to turn a one-day deploy into a one-week one. Override\nthe host with `MVRO_PORTAL_API`.\n\n**`--limit` bounds how far back the harvest walks, not how many rows it adds.**\nNightly at `--limit 100000` is comfortable at current volume. If more than\n`--limit` requests land between runs you silently miss the gap, so size it\nagainst traffic.\n\n**`explain/` is a separate deployment problem** and is not part of this. It\nwants an OpenAI-compatible LLM at `EXPLAIN_BASE_URL`. Point it at Vertex AI or\nkeep it on Baseten rather than putting a GPU behind Cloud Run.\n\n## Cost\n\nScale-to-zero, 1 CPU / 1 GiB, ~4 MB model, predictions in microseconds. Training\nis 17 s on 70k rows. This is a few dollars a month; the bucket is the only thing\nthat grows.\n\n## When CSV stops being right\n\nAt ~70k rows it is fine. Past roughly a million the download-append-upload cycle\nstops being reasonable — move the dataset to BigQuery and make harvest a `MERGE`\non `request_id`, which makes the dedupe atomic and free rather than something\nyou maintain.\n\n## Tests\n\n```bash\npip install -r requirements-dev.txt\npython3 -m unittest discover -s tests      # 201 tests\n```\n\nThe GCS and API tests skip when their packages are absent, so a bare checkout\nstill runs green. `TestGcsPreconditions` runs the real storage code against a\nstub client — no network, no credentials — including the case where a\nconcurrent write must lose without clobbering.\n"
}
```

### CLAUDE (2026-08-26T15:40:11.097Z)

**[tool: Bash]**
```
# Cross-link deployment docs
python3 - <<'PY'
from pathlib import Path
p = Path("PREDICTOR.md")
s = p.read_text()
old = '''## Commands'''
new = '''## Deployment

`DEPLOY.md` covers running this on GCP: one image deployed twice, as a Cloud
Run service for `POST /predict` and as a Cloud Run job for harvest+train, with
the admin/user split expressed as an IAM boundary rather than a role check in
the app. Every path that takes a local file also takes a `gs://` URI.

## Commands'''
assert old in s
s = s.replace(old, new, 1)

old = '''python3 tests/test_predictor.py     # 47 tests
python3 tests/test_portal.py        # 40 tests, incl. filter negation and append
```'''
new = '''python3 tests/test_predictor.py     # 47 tests
python3 tests/test_portal.py        # 40 tests, incl. filter negation and append
python3 tests/test_serving.py       # 28 tests, storage preconditions + the API
```'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("PREDICTOR.md updated")
PY
source .venv/bin/activate; N=$(python3 -m unittest tests.test_serving 2>&1 | grep -o "Ran [0-9]*" | grep -o "[0-9]*"); echo "test_serving count in bare venv: $N (28 with deps)"
```

### CLAUDE (2026-08-26T15:40:16.184Z)

**[tool: Bash]**
```
# Final verification pass
source .venv/bin/activate
echo "=== final: bare project venv ==="
python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED)|skipped"
echo "=== final: CLI unchanged ==="
python3 -m predictor predict --vehicles 12 --jobs 400 --locations 412 2>&1 | tail -5
echo "=== final: harvest --help shows new flags ==="
python3 -m predictor harvest --help 2>&1 | grep -A3 "overwrite"
echo "=== files added ==="
ls -1 Dockerfile entrypoint.sh requirements.txt requirements-dev.txt .dockerignore DEPLOY.md deploy/deploy.sh serving/app.py predictor/service.py predictor/storage.py tests/test_serving.py
```

### CLAUDE (2026-08-26T15:41:13.075Z)

**[tool: Bash]**
```
# Clean up test artifacts
docker rmi predictor-test >/dev/null 2>&1; rm -rf /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad/jobout; docker ps -a --filter name=predtest --format '{{.Names}}' | grep . || echo "no stray containers"; git status --short 2>/dev/null | head -20 || echo "(not a git repo)"
```

### CLAUDE (2026-08-26T15:41:28.421Z)

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

### USER (2026-08-26T15:42:38.582Z)

<bash-input>gcloud config get-value project</bash-input>

### USER (2026-08-26T15:42:39.547Z)

<bash-stdout>[GCP_PROJECT]</bash-stdout><bash-stderr></bash-stderr>

### CLAUDE (2026-08-26T15:42:48.255Z)

Good — the script will pick that up automatically, so `PROJECT` doesn't need setting.

That resolves to:

- bucket `gs://[GCP_PROJECT]-predictor`
- image `asia-southeast1-docker.pkg.dev/[GCP_PROJECT]/predictor/predictor`
- SAs `predictor-api@` / `[EMAIL]`

`bootstrap` is the first step that creates real billable resources (Artifact Registry repo, a versioned bucket, two service accounts, and it enables five APIs). Say the word and I'll run it — or run it yourself with `! ./deploy/deploy.sh bootstrap` if you'd rather watch it directly.

Worth confirming before it runs: `REGION` defaults to `asia-southeast1` on the assumption you want to sit near `api-auto-sgp`. That choice is baked into the bucket location, so it's annoying to change later.

### USER (2026-08-26T16:21:38.056Z)

copy the data/requests.csv file to the GCS bucket so that we have an initial set of entries for first training.

### CLAUDE (2026-08-26T16:21:48.592Z)

**[tool: Bash]**
```
# Check auth and whether bucket exists
gcloud auth list --filter=status:ACTIVE --format='value(account)' 2>&1 | head -3; echo "--- bucket ---"; gcloud storage buckets describe gs://[GCP_PROJECT]-predictor --format='value(name,location,versioning.enabled)' 2>&1 | head -5
```

### CLAUDE (2026-08-26T16:21:55.646Z)

**[tool: Bash]**
```
# Check versioning and existing bucket contents
echo "=== versioning ==="; gcloud storage buckets describe gs://[GCP_PROJECT]-predictor --format='value(versioning_enabled)' 2>&1
echo "=== existing objects ==="; gcloud storage ls -l "gs://[GCP_PROJECT]-predictor/**" 2>&1 | head -20
```

### CLAUDE (2026-08-26T16:22:05.650Z)

Bucket exists, versioning on, empty — nothing to overwrite. Let me verify the file is append-compatible before uploading.

### CLAUDE (2026-08-26T16:22:07.942Z)

**[tool: Bash]**
```
# Verify header compatibility and hash the file
source .venv/bin/activate; python3 -c "
import csv
from predictor.harvest import RAW_COLUMNS
with open('data/requests.csv', newline='') as fh:
    r = csv.reader(fh); header = next(r); n = sum(1 for row in r if row)
print(f'rows:   {n:,}')
print(f'header matches RAW_COLUMNS: {header == list(RAW_COLUMNS)}')
"; ls -lh data/requests.csv; shasum -a 256 data/requests.csv
```

### CLAUDE (2026-08-26T16:22:10.761Z)

**[tool: Bash]**
```
{
 "command": "gcloud storage cp data/requests.csv gs://[GCP_PROJECT]-predictor/data/requests.csv 2>&1 | tail -3",
 "description": "Upload dataset to GCS",
 "timeout": 300000
}
```

### CLAUDE (2026-08-26T16:22:24.187Z)

**[tool: Bash]**
```
# Verify upload integrity
gcloud storage objects describe gs://[GCP_PROJECT]-predictor/data/requests.csv \
  --format='value[separator="  |  "](size,generation,md5_hash)' 2>&1
echo "--- local md5 for comparison ---"
python3 -c "
import hashlib,base64
print(base64.b64encode(hashlib.md5(open('data/requests.csv','rb').read()).digest()).decode())
"
```

### CLAUDE (2026-08-26T16:22:31.427Z)

Let me verify my storage layer reads it correctly against real GCS, not just the stub.

### CLAUDE (2026-08-26T16:22:37.435Z)

**[tool: Bash]**
```
# Validate GcsStore against real GCS
SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad
$SP/probe/bin/python - <<'PY' 2>&1 | tail -20
import sys, tempfile, csv
sys.path.insert(0, '/Users/[USER]/workspace/openai_explain')
from pathlib import Path
from predictor.storage import store_for, readable

URI = "gs://[GCP_PROJECT]-predictor/data/requests.csv"
s = store_for(URI)
gen = s.generation()
print("GcsStore.generation() ->", gen)

with tempfile.TemporaryDirectory() as d:
    with readable(URI, Path(d), name="requests.csv") as p:
        with open(p, newline="") as fh:
            r = csv.reader(fh); header = next(r); n = sum(1 for row in r if row)
        print(f"readable() pulled {n:,} rows, header ok:",
              header[:3] == ["request_id", "deployment_id", "org_code"])

# The absent-object path, on the model that has not been trained yet.
print("absent model generation ->",
      store_for("gs://[GCP_PROJECT]-predictor/models/predictor.pkl").generation())
PY
```

### CLAUDE (2026-08-26T16:22:57.588Z)

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

### USER (2026-08-26T16:35:26.564Z)

Error: Forbidden
Your client does not have permission to get URL /docs from this server.

### CLAUDE (2026-08-26T16:35:36.671Z)

**[tool: Bash]**
```
# Check service state and IAM policy
gcloud run services describe predictor-api --region asia-southeast1 \
  --format='value[separator="  "](status.url,status.conditions[0].status)' 2>&1 | head -3
echo "=== invoker bindings ==="
gcloud run services get-iam-policy predictor-api --region asia-southeast1 \
  --format='table(bindings.role,bindings.members)' 2>&1 | head -10
```

### CLAUDE (2026-08-26T16:35:51.913Z)

Two separate problems here — the service has no IAM bindings at all yet.

### CLAUDE (2026-08-26T16:35:53.343Z)

**[tool: Bash]**
```
# Confirm both failure modes
URL=https://predictor-api-7j5cx7inrq-as.a.run.app
echo "=== unauthenticated (what your browser did) ==="
curl -s -o /dev/null -w "  HTTP %{http_code}\n" "$URL/healthz"
echo "=== with an ID token, before any grant ==="
curl -s -o /dev/null -w "  HTTP %{http_code}\n" -H "Authorization: Bearer $(gcloud auth print-identity-token)" "$URL/healthz"
```

### USER (2026-08-26T16:36:04.844Z)

[Request interrupted by user]

### USER (2026-08-26T16:39:17.460Z)

I want /docs page to be accessible without the identity token

### CLAUDE (2026-08-26T16:39:44.525Z)

**[tool: Bash]**
```
# Inspect revisions and traffic
gcloud run services describe predictor-api --region asia-southeast1 \
  --format='yaml(status.url,status.traffic,status.latestReadyRevisionName,spec.template.spec.containers[0].image)' 2>&1 | head -20
echo "=== revisions ==="
gcloud run revisions list --service predictor-api --region asia-southeast1 \
  --format='table(name,active,status.conditions[0].message)' 2>&1 | head -6
```

### CLAUDE (2026-08-26T16:39:54.298Z)

**[tool: Bash]**
```
# Get full response headers
URL=https://predictor-api-7j5cx7inrq-as.a.run.app
curl -sS -i "$URL/healthz" 2>&1 | head -20
```

### CLAUDE (2026-08-26T16:40:00.675Z)

**[tool: Bash]**
```
# Find all service URLs and ingress setting
gcloud run services describe predictor-api --region asia-southeast1 --format=json 2>/dev/null \
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
```

### CLAUDE (2026-08-26T16:40:19.669Z)

**[tool: Bash]**
```
# Retry after DNS propagation window
host predictor-api-7j5cx7inrq-as.a.run.app 2>&1 | head -3
URL=https://predictor-api-7j5cx7inrq-as.a.run.app
echo "--- retry, no token ---"; curl -s -o /dev/null -w "  HTTP %{http_code}\n" "$URL/healthz"
echo "--- retry, with token ---"; curl -s -o /dev/null -w "  HTTP %{http_code}\n" -H "Authorization: Bearer $(gcloud auth print-identity-token)" "$URL/healthz"
echo "--- /docs, no token ---"; curl -s -o /dev/null -w "  HTTP %{http_code}\n" "$URL/docs"
```

### CLAUDE (2026-08-26T16:40:35.167Z)

**[tool: Bash]**
```
# Map status codes across paths
URL=https://predictor-api-7j5cx7inrq-as.a.run.app
TOK=$(gcloud auth print-identity-token)
for p in / /docs /openapi.json /healthz /readyz /model /nonsense-xyz; do
  a=$(curl -s -o /dev/null -w "%{http_code}" "$URL$p")
  b=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOK" "$URL$p")
  printf "  %-16s no-token=%s  token=%s\n" "$p" "$a" "$b"
done
```

### CLAUDE (2026-08-26T16:41:32.940Z)

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

### USER (2026-08-26T16:41:59.773Z)

build the docs-only service

### CLAUDE (2026-08-26T16:42:23.814Z)

Building it now.

### CLAUDE (2026-08-26T16:42:38.922Z)

**[tool: Bash]**
```
# Add docs-only mode to the app
python3 - <<'PY'
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

# DOCS-ONLY MODE
# --------------
# Cloud Run IAM is per-service and all-or-nothing: there is no way to open
# /docs while keeping /predict closed on the same service. So the same image
# is deployed a second time with DOCS_ONLY=1 and --allow-unauthenticated,
# serving the reference and nothing else.
#
# The routes stay REGISTERED in this mode -- the OpenAPI schema is generated
# from them, so removing them would publish an empty document. A middleware
# refuses to execute anything outside the docs paths instead. The model is
# therefore never loaded, and that service's account is granted no bucket
# access at all: the only thing it can leak is the shape of the API.
DOCS_ONLY = os.environ.get("DOCS_ONLY", "").lower() in ("1", "true", "yes")
# Public URL of the real API, so the published schema points at something
# callable rather than at the docs host.
API_URL = os.environ.get("API_URL", "").rstrip("/")

DOCS_PATHS = frozenset(
    ["/", "/docs", "/docs/oauth2-redirect", "/redoc", "/openapi.json"])

_DESCRIPTION = (
    "Predicts how long a Route Optimization request will take, from its "
    "input profile, before it is submitted."
)
if DOCS_ONLY:
    _DESCRIPTION += (
        "\\n\\n**This host serves the reference only.** Requests go to the "
        "private service, which is authenticated by Cloud Run IAM -- callers "
        "present a Google ID token, so *Try it out* below will not work from "
        "this page.\\n\\n```bash\\ncurl -X POST "
        f"{API_URL or 'https://<service-url>'}/predict \\\\\\n"
        "  -H \\"Authorization: Bearer $(gcloud auth print-identity-token)\\" \\\\\\n"
        "  -H 'Content-Type: application/json' \\\\\\n"
        "  -d '{\\"vehicles\\":12,\\"jobs\\":400,\\"locations\\":412}'\\n```"
    )

app = FastAPI(
    title="Route Optimization duration predictor",
    description=_DESCRIPTION,
    version="1.0.0",
    servers=([{"url": API_URL, "description": "predictor-api (ID token required)"}]
             if DOCS_ONLY and API_URL else None),
)


if DOCS_ONLY:
    from fastapi.responses import JSONResponse, RedirectResponse

    @app.middleware("http")
    async def docs_only_gate(request, call_next):
        """Refuse everything that is not the reference itself.

        Belt and braces: this service's account has no bucket access, so even
        a bug here could not reach the dataset or the model.
        """
        if request.url.path not in DOCS_PATHS:
            return JSONResponse(
                status_code=404,
                content={"detail": "This host serves documentation only. "
                                   "Send requests to the API service, which "
                                   "requires a Google ID token.",
                         "api_url": API_URL or None})
        return await call_next(request)

    @app.get("/", include_in_schema=False)
    def _root():
        return RedirectResponse("/docs")'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("docs-only mode added")
PY
source .venv/bin/activate; python3 -c "import ast;ast.parse(open('serving/app.py').read());print('syntax OK')"
```

### CLAUDE (2026-08-26T16:43:05.437Z)

**[tool: Bash]**
```
# Document config and add deploy-docs target
python3 - <<'PY'
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
  MODEL_URI        gs://bucket/models/predictor.pkl, or a local path
  MODEL_GENERATION set by the deploy to pin an exact model version. Changing
                   it is what makes a new model a new Cloud Run revision, so
                   rollout and rollback are revision operations.
  DOCS_ONLY        serve the reference and refuse everything else. This is how
                   the public docs host runs -- see DOCS-ONLY MODE below.
  API_URL          public URL of the real API, published in the docs schema.
  PORT             Cloud Run sets this.
"""'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("docstring updated")
PY

python3 - <<'PY'
from pathlib import Path
p = Path("deploy/deploy.sh")
s = p.read_text()

old = '''SERVICE="${SERVICE:-predictor-api}"
JOB="${JOB:-predictor-job}"
API_SA="predictor-api@${PROJECT}.iam.gserviceaccount.com"
JOB_SA="predictor-job@${PROJECT}.iam.gserviceaccount.com"'''
new = '''SERVICE="${SERVICE:-predictor-api}"
DOCS_SERVICE="${DOCS_SERVICE:-predictor-docs}"
JOB="${JOB:-predictor-job}"
API_SA="predictor-api@${PROJECT}.iam.gserviceaccount.com"
JOB_SA="predictor-job@${PROJECT}.iam.gserviceaccount.com"
# Deliberately granted NOTHING. The docs host is public, so its identity
# should be able to reach nothing at all.
DOCS_SA="predictor-docs@${PROJECT}.iam.gserviceaccount.com"'''
assert old in s
s = s.replace(old, new)

old = '''#   ./deploy/deploy.sh deploy           # create/update the service and the job'''
new = '''#   ./deploy/deploy.sh deploy           # create/update the service and the job
#   ./deploy/deploy.sh deploy-docs      # PUBLIC docs-only host (no /predict)'''
assert old in s
s = s.replace(old, new)

old = '''  for sa in predictor-api predictor-job; do'''
new = '''  for sa in predictor-api predictor-job predictor-docs; do'''
assert old in s
s = s.replace(old, new)

# The docs SA must not appear in any bucket binding -- state that where the
# other bindings are made, so nobody adds one later by symmetry.
old = '''  gcloud storage buckets add-iam-policy-binding "gs://${BUCKET}" \\
    --member "serviceAccount:${JOB_SA}" --role roles/storage.objectAdmin

  echo "bootstrapped: gs://${BUCKET}, ${API_SA}, ${JOB_SA}"'''
new = '''  gcloud storage buckets add-iam-policy-binding "gs://${BUCKET}" \\
    --member "serviceAccount:${JOB_SA}" --role roles/storage.objectAdmin
  # ${DOCS_SA} gets NO binding here, on purpose. That host is public; it must
  # not be able to read the dataset or the model even if its code is wrong.

  echo "bootstrapped: gs://${BUCKET}, ${API_SA}, ${JOB_SA}, ${DOCS_SA}"'''
assert old in s
s = s.replace(old, new)

old = '''current_generation() {'''
new = '''cmd_deploy_docs() {
  # PUBLIC. Cloud Run IAM is per-service and all-or-nothing, so opening /docs
  # on the API service would open /predict with it. This is the same image
  # with DOCS_ONLY=1: the routes stay registered so the schema is complete,
  # but a middleware refuses to execute anything except the reference, the
  # model is never loaded, and the service account can reach nothing.
  local api_url
  api_url="$(cmd_url 2>/dev/null || true)"
  [[ -n "$api_url" ]] || die "deploy the API service first -- the docs point at it"

  gcloud run deploy "$DOCS_SERVICE" --project "$PROJECT" --region "$REGION" \\
    --image "${IMAGE}:latest" \\
    --service-account "$DOCS_SA" \\
    --allow-unauthenticated \\
    --set-env-vars "DOCS_ONLY=1,API_URL=${api_url}" \\
    --memory 512Mi --cpu 1 \\
    --min-instances 0 --max-instances 3

  local docs_url
  docs_url="$(gcloud run services describe "$DOCS_SERVICE" --project "$PROJECT" \\
    --region "$REGION" --format='value(status.url)')"
  echo
  echo "public docs: ${docs_url}/docs"
  echo "documents:   ${api_url}  (ID token required)"
}

current_generation() {'''
assert old in s
s = s.replace(old, new)

old = '''  deploy)        cmd_deploy ;;'''
new = '''  deploy)        cmd_deploy ;;
  deploy-docs)   cmd_deploy_docs ;;'''
assert old in s
s = s.replace(old, new)

p.write_text(s)
print("deploy.sh updated")
PY
bash -n deploy/deploy.sh && echo "deploy.sh syntax OK"
```

### CLAUDE (2026-08-26T16:43:08.120Z)

Now tests for the docs-only mode — including that it genuinely never loads the model.

### CLAUDE (2026-08-26T16:43:27.608Z)

**[tool: Bash]**
```
# Add and run docs-only tests
python3 - <<'PY'
from pathlib import Path
p = Path("tests/test_serving.py")
s = p.read_text()

old = '''@unittest.skipUnless(HAVE_FASTAPI, "fastapi not installed")
@unittest.skipUnless(MODEL.exists(), "no trained model on disk")
class TestApiAgreesWithCli(unittest.TestCase):'''

new = '''@unittest.skipUnless(HAVE_FASTAPI, "fastapi not installed")
class TestDocsOnlyService(unittest.TestCase):
    """The public host. Cloud Run IAM cannot open /docs while keeping /predict
    closed on one service, so this is the same image deployed again with
    DOCS_ONLY=1 -- and it must be genuinely inert."""

    API = "https://predictor-api-example-as.a.run.app"

    @classmethod
    def setUpClass(cls):
        import importlib
        import os
        os.environ["DOCS_ONLY"] = "1"
        os.environ["API_URL"] = cls.API
        # Point at a model that does not exist: nothing here may need one.
        os.environ["MODEL_URI"] = "/nonexistent/predictor.pkl"
        import serving.app as app_module
        importlib.reload(app_module)
        cls.app_module = app_module
        cls.client = TestClient(app_module.app)

    @classmethod
    def tearDownClass(cls):
        import importlib
        import os
        for k in ("DOCS_ONLY", "API_URL", "MODEL_URI"):
            os.environ.pop(k, None)
        import serving.app as app_module
        importlib.reload(app_module)

    def test_docs_are_served(self):
        r = self.client.get("/docs")
        self.assertEqual(r.status_code, 200)
        self.assertIn("text/html", r.headers["content-type"])

    def test_the_published_schema_is_complete(self):
        """The routes stay registered precisely so this is not empty --
        deleting them would publish a document describing nothing."""
        spec = self.client.get("/openapi.json").json()
        self.assertIn("/predict", spec["paths"])
        self.assertIn("/model", spec["paths"])
        self.assertIn("PredictRequest", spec["components"]["schemas"])

    def test_the_schema_points_at_the_real_api(self):
        spec = self.client.get("/openapi.json").json()
        self.assertEqual(spec["servers"][0]["url"], self.API)

    def test_the_description_says_a_token_is_needed(self):
        spec = self.client.get("/openapi.json").json()
        self.assertIn("ID token", spec["info"]["description"])

    def test_predict_is_refused(self):
        """The whole point: this host is public, so it must not predict."""
        r = self.client.post("/predict", json={"vehicles": 1, "jobs": 10})
        self.assertEqual(r.status_code, 404)
        self.assertIn("documentation only", r.json()["detail"])

    def test_every_non_docs_route_is_refused(self):
        for path, method in (("/model", "get"), ("/readyz", "get"),
                             ("/healthz", "get"), ("/predict", "post")):
            with self.subTest(path=path):
                r = getattr(self.client, method)(path)
                self.assertEqual(r.status_code, 404)

    def test_the_model_is_never_loaded(self):
        """MODEL_URI points at nothing. If any request could reach _load(),
        this would raise rather than 404 -- and the public host would be
        touching the bucket."""
        self.client.get("/docs")
        self.client.get("/openapi.json")
        self.client.post("/predict", json={"vehicles": 1})
        self.assertIsNone(self.app_module._model)

    def test_root_redirects_to_the_docs(self):
        r = self.client.get("/", follow_redirects=False)
        self.assertIn(r.status_code, (301, 302, 307))
        self.assertEqual(r.headers["location"], "/docs")


@unittest.skipUnless(HAVE_FASTAPI, "fastapi not installed")
@unittest.skipUnless(MODEL.exists(), "no trained model on disk")
class TestNormalModeStillServes(unittest.TestCase):
    """DOCS_ONLY must be strictly opt-in -- the API service is deployed from
    the same image and reads the same module."""

    def test_predict_works_when_docs_only_is_unset(self):
        import importlib
        import os
        os.environ.pop("DOCS_ONLY", None)
        os.environ["MODEL_URI"] = str(MODEL)
        import serving.app as app_module
        importlib.reload(app_module)
        client = TestClient(app_module.app)
        self.assertEqual(client.post("/predict",
                                     json={"vehicles": 1, "jobs": 10}).status_code, 200)
        self.assertEqual(client.get("/model").status_code, 200)


@unittest.skipUnless(HAVE_FASTAPI, "fastapi not installed")
@unittest.skipUnless(MODEL.exists(), "no trained model on disk")
class TestApiAgreesWithCli(unittest.TestCase):'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("docs-only tests added")
PY
SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad
$SP/probe/bin/python -m unittest tests.test_serving 2>&1 | tail -15
```

### CLAUDE (2026-08-26T16:43:43.989Z)

**[tool: Bash]**
```
{
 "command": "docker build -q -t predictor-test . >/dev/null 2>&1 && echo \"rebuilt\"\ndocker run --rm -d --name docsonly -p 8098:8080 \\\n  -e DOCS_ONLY=1 -e API_URL=https://predictor-api-7j5cx7inrq-as.a.run.app \\\n  -e MODEL_URI=gs://nowhere/nope.pkl predictor-test >/dev/null\nfor i in $(seq 1 30); do curl -sf localhost:8098/openapi.json >/dev/null 2>&1 && break; sleep 1; done\necho \"=== docs-only container (note: MODEL_URI points at a bucket it cannot reach) ===\"\nfor p in /docs /openapi.json /predict /model /readyz; do\n  printf \"  %-16s %s\\n\" \"$p\" \"$(curl -s -o /dev/null -w '%{http_code}' localhost:8098$p)\"\ndone\necho \"  / (redirect)     $(curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}' localhost:8098/)\"\necho; echo \"  POST /predict -> $(curl -s -X POST localhost:8098/predict -H 'Content-Type: application/json' -d '{\"jobs\":10}')\"\necho; echo \"  schema servers -> $(curl -s localhost:8098/openapi.json | python3 -c 'import json,sys;print(json.load(sys.stdin)[\"servers\"])')\"\ndocker stop docsonly >/dev/null",
 "description": "Verify docs-only mode in the container",
 "timeout": 600000
}
```

### CLAUDE (2026-08-26T16:43:57.865Z)

**[tool: Bash]**
```
{
 "command": "echo \"=== normal mode from the SAME image is unaffected ===\"\ndocker run --rm -d --name normalmode -p 8097:8080 -v \"$PWD/models:/models:ro\" \\\n  -e MODEL_URI=/models/predictor.pkl predictor-test >/dev/null\nfor i in $(seq 1 30); do curl -sf localhost:8097/readyz >/dev/null 2>&1 && break; sleep 1; done\nfor p in /docs /model /readyz; do printf \"  %-12s %s\\n\" \"$p\" \"$(curl -s -o /dev/null -w '%{http_code}' localhost:8097$p)\"; done\nprintf \"  %-12s %s\\n\" \"POST /predict\" \"$(curl -s -o /dev/null -w '%{http_code}' -X POST localhost:8097/predict -H 'Content-Type: application/json' -d '{\"vehicles\":12,\"jobs\":400}')\"\ndocker stop normalmode >/dev/null\necho; echo \"=== full suite: container ===\"\ndocker run --rm -v \"$PWD/tests:/app/tests:ro\" -v \"$PWD/models:/app/models:ro\" \\\n  --entrypoint python predictor-test -m unittest discover -s tests -p \"test_*.py\" 2>&1 | grep -E \"^(Ran|OK|FAILED|FAIL:|ERROR:)|skipped\"",
 "description": "Verify normal mode unaffected, run full suite",
 "timeout": 300000
}
```

### CLAUDE (2026-08-26T16:44:57.195Z)

**[tool: Bash]**
```
# Run suite in remaining environments
SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad
echo "=== full deps ==="; $SP/probe/bin/python -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED)|skipped"
echo "=== bare project venv ==="; source .venv/bin/activate; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED)|skipped"
```

### CLAUDE (2026-08-26T16:46:45.707Z)

Now the docs.

### CLAUDE (2026-08-26T16:47:03.396Z)

**[tool: Bash]**
```
# Document the docs-only host
python3 - <<'PY'
from pathlib import Path
p = Path("DEPLOY.md")
s = p.read_text()

old = '''| Predict | Cloud Run **service** `predictor-api` | object **read** | callers with `roles/run.invoker` on the service |
| Harvest + train | Cloud Run **job** `predictor-job` | object **admin** | admins with `roles/run.invoker` on the job |'''
new = '''| Predict | Cloud Run **service** `predictor-api` | object **read** | callers with `roles/run.invoker` on the service |
| Harvest + train | Cloud Run **job** `predictor-job` | object **admin** | admins with `roles/run.invoker` on the job |
| Reference | Cloud Run **service** `predictor-docs` | **none** | public |'''
assert old in s
s = s.replace(old, new)

old = '''`/healthz` not touching the model is deliberate: a bad `MODEL_URI` should
surface as a readiness failure naming the URI, not as a container that will not
boot.'''
new = '''`/healthz` not touching the model is deliberate: a bad `MODEL_URI` should
surface as a readiness failure naming the URI, not as a container that will not
boot.

> `/healthz` is not reachable from outside Cloud Run — Google's front end
> special-cases the path and returns 404 before the request arrives, with or
> without a token. The route itself is fine and the startup probe pointed at it
> passes, since that check runs inside. Use `/readyz` for anything external.

### Reading the docs

`/docs` is behind the same IAM as everything else, and a browser cannot attach
an ID token — which is why opening it directly returns
*"Your client does not have permission to get URL /docs from this server"*.
Two ways round it:

```bash
gcloud run services proxy predictor-api --region $REGION --port 8080
# then open http://localhost:8080/docs
```

or deploy the public reference host:

```bash
./deploy/deploy.sh deploy-docs
```

## The public docs host

Cloud Run IAM is per-service and all-or-nothing: there is no rule that opens
`/docs` while keeping `/predict` closed. So `predictor-docs` is the **same
image** deployed again with `DOCS_ONLY=1` and `--allow-unauthenticated`.

What makes it safe to expose:

* A middleware refuses every path except `/`, `/docs`, `/redoc` and
  `/openapi.json`. `POST /predict` returns 404 with a pointer to the real host.
* The model is never loaded — no request can reach the code that loads it.
* `predictor-docs@` is granted **no bucket access at all**, so even a bug in
  the gate could not reach the dataset or the model.

The routes stay *registered* in this mode, which is the whole trick: the
OpenAPI schema is generated from them, so deleting them would publish a
document describing nothing. They are declared and refused, not removed.

The published schema's `servers` entry points at `predictor-api`, and the
description carries the `curl` recipe — so the page documents something
callable rather than itself. *Try it out* will not work from the public page:
the real host needs an ID token, and wiring that up would mean CORS on the API.

What is public is the shape of the API — field names, defaults, the
`api-auto-sgp` deployment id. Nothing else.'''
assert old in s
s = s.replace(old, new)

old = '''./deploy/deploy.sh grant-admin  group:ops@yourcompany.com
```'''
new = '''./deploy/deploy.sh grant-admin  group:ops@yourcompany.com
./deploy/deploy.sh deploy-docs  # optional: public, docs-only host
```'''
assert old in s
s = s.replace(old, new)

old = '''python3 -m unittest discover -s tests      # 201 tests'''
new = '''python3 -m unittest discover -s tests      # 210 tests'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("DEPLOY.md updated")
PY
python3 - <<'PY'
from pathlib import Path
p = Path("PREDICTOR.md")
s = p.read_text()
old = "python3 tests/test_serving.py       # 28 tests, storage preconditions + the API"
new = "python3 tests/test_serving.py       # 37 tests, storage, the API, docs-only mode"
assert old in s
p.write_text(s.replace(old, new))
print("PREDICTOR.md updated")
PY
```

### CLAUDE (2026-08-26T16:47:08.877Z)

**[tool: Bash]**
```
# Fix stale counts, clean up
python3 - <<'PY'
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
p.write_text(s)
print("counts corrected")
PY
docker rmi predictor-test >/dev/null 2>&1; docker ps -a --filter name=docsonly --filter name=normalmode --format '{{.Names}}' | grep . || echo "no stray containers"
```

### CLAUDE (2026-08-26T16:47:22.604Z)

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

### USER (2026-08-26T16:50:25.569Z)

<bash-input>/deploy/deploy.sh build</bash-input>

### USER (2026-08-26T16:50:25.604Z)

<bash-stdout></bash-stdout><bash-stderr>(eval):1: no such file or directory: /deploy/deploy.sh
</bash-stderr>

### CLAUDE (2026-08-26T16:50:28.700Z)

Leading slash — that's an absolute path. You want `./`:

```
! ./deploy/deploy.sh build
```

### USER (2026-08-26T16:52:47.161Z)

❯ ./deploy/deploy.sh deploy-docs
Deploying container to Cloud Run service [predictor-docs] in project [[GCP_PROJECT]] region [asia-southeast1]
X Deploying new service...                                                                                                                           
  . Creating Revision...                                                                                                                             
  . Routing traffic...                                                                                                                               
  . Setting IAM Policy...                                                                                                                            
Deployment failed                                                                                                                                    
ERROR: (gcloud.run.deploy) [[EMAIL]] does not have permission to access namespaces instance [[GCP_PROJECT]] (or it may not exist): Permission 'iam.serviceaccounts.actAs' denied on service account [EMAIL] (or it may not exist). This command is authenticated as [EMAIL] which is the active account specified by the [core/account] property.
 ~/workspace/openai_explain │ main   

### CLAUDE (2026-08-26T16:52:55.605Z)

**[tool: Bash]**
```
# Check which service accounts exist
for sa in predictor-api predictor-job predictor-docs; do
  printf "  %-16s " "$sa"
  gcloud iam service-accounts describe "${sa}@[GCP_PROJECT].iam.gserviceaccount.com" \
    --format='value(email)' 2>/dev/null || echo "MISSING"
done
```

### CLAUDE (2026-08-26T16:53:03.629Z)

That's the "or it may not exist" half of the error — you bootstrapped before I added `predictor-docs` to the loop, so the account was never created.

### CLAUDE (2026-08-26T16:53:06.107Z)

**[tool: Bash]**
```
# Create the docs service account
gcloud iam service-accounts create predictor-docs \
  --project [GCP_PROJECT] \
  --display-name "Duration predictor docs" 2>&1 | tail -3
echo "--- confirm it exists and has NO bucket access ---"
gcloud iam service-accounts describe [EMAIL] --format='value(email)'
gcloud storage buckets get-iam-policy gs://[GCP_PROJECT]-predictor \
  --format=json 2>/dev/null | grep -c "predictor-docs" | sed 's/^/  bucket bindings mentioning predictor-docs: /'
```

### CLAUDE (2026-08-26T16:53:17.752Z)

**[tool: Bash]**
```
# Recheck service account after propagation
gcloud iam service-accounts describe [EMAIL] --format='value(email,disabled)' 2>&1 | tail -2
```

### CLAUDE (2026-08-26T16:53:23.360Z)

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

### USER (2026-08-26T17:02:41.250Z)

what command via API to harvest new requests to add to the existing ones

### CLAUDE (2026-08-26T17:02:53.123Z)

Harvesting deliberately isn't on the API service — that's the whole admin/user split. It's the Cloud Run *job*. Let me confirm how yours is configured.

### CLAUDE (2026-08-26T17:02:54.825Z)

**[tool: Bash]**
```
# Check job configuration
gcloud run jobs describe predictor-job --region asia-southeast1 --format=json 2>/dev/null | python3 -c "
import json,sys
d=json.load(sys.stdin)
c=d['spec']['template']['spec']['template']['spec']['containers'][0]
print('image :', c['image'])
print('args  :', c.get('args'))
print('env   :', {e['name']: e.get('value') for e in c.get('env',[])})
" 2>&1 | head -10
```

### CLAUDE (2026-08-26T17:03:14.711Z)

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

### USER (2026-08-26T17:48:21.727Z)

for the /predict and /model API endpoints, can we relax the requirement to submit with bearer token?

### CLAUDE (2026-08-26T17:48:42.687Z)

One command. But let me be precise about what it exposes before you run it.

### CLAUDE (2026-08-26T17:48:45.695Z)

**[tool: Bash]**
```
# Audit what /model discloses
source .venv/bin/activate; python3 -c "
from pathlib import Path
from predictor.train import Predictor
import json
p = Predictor.load(Path('models/predictor.pkl'))
m = dict(p.meta); m.pop('matrix_rule', None)
print('/model top-level keys:', list(m.keys()))
print()
print('segments:', json.dumps(m.get('segments'), default=str)[:400])
print()
print('org codes anywhere in /model payload:', 'org_code' in json.dumps(m, default=str))
print('deployment ids in encoder vocab (NOT returned by /model):',
      sorted(p.encoders.maps.get('deployment_id', {}))[:5])
print('modal substitution shown by /predict:', p.encoders.modal.get('deployment_id'))
"
```

### CLAUDE (2026-08-26T17:49:21.056Z)

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

### USER (2026-08-26T17:51:31.851Z)

update the docs so that the swagger examples can now be run without the bearer token

### CLAUDE (2026-08-26T17:51:42.480Z)

**[tool: Bash]**
```
# Check current auth state of both services
echo "=== predictor-api IAM ==="
gcloud run services get-iam-policy predictor-api --region asia-southeast1 \
  --format='table(bindings.role,bindings.members)' 2>&1 | head
echo "=== unauthenticated probe ==="
for p in /docs /model; do
  printf "  %-8s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' https://predictor-api-7j5cx7inrq-as.a.run.app$p)"
done
echo "=== docs host ==="
gcloud run services describe predictor-docs --region asia-southeast1 --format='value(status.url)' 2>&1 | tail -1
```

### CLAUDE (2026-08-26T17:52:22.862Z)

You've made `predictor-api` public, and `https://predictor-api-.../docs` already returns 200 — so Try-it-out works there same-origin, today, with no changes. The problem is only on the separate docs host: that's a cross-origin fetch, which the browser blocks without CORS. Let me fix both.

### CLAUDE (2026-08-26T17:52:41.574Z)

**[tool: Bash]**
```
# Add CORS and auth-aware descriptions
python3 - <<'PY'
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
# the deploy sets it from the API service's actual IAM policy -- documenting a
# token requirement that no longer exists is worse than documenting none.
AUTH_MODE = os.environ.get("AUTH_MODE", "iam").lower()'''
assert old in s
s = s.replace(old, new)

old = '''if DOCS_ONLY:
    _DESCRIPTION += (
        "\\n\\n**This host serves the reference only.** Requests go to the "
        "private service, which is authenticated by Cloud Run IAM -- callers "
        "present a Google ID token, so *Try it out* below will not work from "
        "this page.\\n\\n```bash\\ncurl -X POST "
        f"{API_URL or 'https://<service-url>'}/predict \\\\\\n"
        "  -H \\"Authorization: Bearer $(gcloud auth print-identity-token)\\" \\\\\\n"
        "  -H 'Content-Type: application/json' \\\\\\n"
        "  -d '{\\"vehicles\\":12,\\"jobs\\":400,\\"locations\\":412}'\\n```"
    )'''
new = '''_TARGET = API_URL or "https://<service-url>"
if DOCS_ONLY and AUTH_MODE == "public":
    _DESCRIPTION += (
        "\\n\\n**This host serves the reference only** -- *Try it out* sends "
        f"requests to `{_TARGET}`, which accepts unauthenticated calls. No "
        "token needed.\\n\\n```bash\\ncurl -X POST "
        f"{_TARGET}/predict \\\\\\n"
        "  -H 'Content-Type: application/json' \\\\\\n"
        "  -d '{\\"vehicles\\":12,\\"jobs\\":400,\\"locations\\":412}'\\n```"
    )
elif DOCS_ONLY:
    _DESCRIPTION += (
        "\\n\\n**This host serves the reference only.** Requests go to the "
        "private service, which is authenticated by Cloud Run IAM -- callers "
        "present a Google ID token, so *Try it out* below will not work from "
        "this page.\\n\\n```bash\\ncurl -X POST "
        f"{_TARGET}/predict \\\\\\n"
        "  -H \\"Authorization: Bearer $(gcloud auth print-identity-token)\\" \\\\\\n"
        "  -H 'Content-Type: application/json' \\\\\\n"
        "  -d '{\\"vehicles\\":12,\\"jobs\\":400,\\"locations\\":412}'\\n```"
    )
elif AUTH_MODE == "public":
    _DESCRIPTION += (
        "\\n\\nThis service accepts unauthenticated calls, so *Try it out* "
        "below works as-is."
    )'''
assert old in s
s = s.replace(old, new)

# CORS, on the API service only.
old = '''if DOCS_ONLY:
    from fastapi.responses import JSONResponse, RedirectResponse'''
new = '''# CORS exists for exactly one reason: a Swagger page served from ANOTHER
# origin (the public docs host) must be able to read the response. It grants
# no new access -- the same-origin policy is enforced by browsers, not by this
# server, and anything curl can already fetch is unaffected. It only stops the
# browser hiding a response the caller could have had anyway.
CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",")
                if o.strip()]
if CORS_ORIGINS and not DOCS_ONLY:
    from fastapi.middleware.cors import CORSMiddleware

    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,     # an allowlist, never "*"
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type", "Authorization"],
    )


if DOCS_ONLY:
    from fastapi.responses import JSONResponse, RedirectResponse'''
assert old in s
s = s.replace(old, new)

old = '''  DOCS_ONLY        serve the reference and refuse everything else. This is how
                   the public docs host runs -- see DOCS-ONLY MODE below.
  API_URL          public URL of the real API, published in the docs schema.'''
new = '''  DOCS_ONLY        serve the reference and refuse everything else. This is how
                   the public docs host runs -- see DOCS-ONLY MODE below.
  API_URL          public URL of the real API, published in the docs schema.
  AUTH_MODE        "iam" (default) or "public" -- how the API service is
                   protected. Only changes what the docs SAY; the deploy sets
                   it from the service's real IAM policy.
  CORS_ORIGINS     comma-separated origins allowed to read responses in a
                   browser. Needed only so the separate docs host's "Try it
                   out" works.'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("app updated")
PY
source .venv/bin/activate; python3 -c "import ast;ast.parse(open('serving/app.py').read());print('syntax OK')"
```

### CLAUDE (2026-08-26T17:52:44.578Z)

Now wire the deploy so it detects the real IAM state rather than being told.

### CLAUDE (2026-08-26T17:52:57.352Z)

**[tool: Bash]**
```
# Detect IAM state and wire CORS in deploy
python3 - <<'PY'
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
  [[ -n "$api_url" ]] || die "deploy the API service first -- the docs point at it"

  gcloud run deploy "$DOCS_SERVICE" --project "$PROJECT" --region "$REGION" \\
    --image "${IMAGE}:latest" \\
    --service-account "$DOCS_SA" \\
    --allow-unauthenticated \\
    --set-env-vars "DOCS_ONLY=1,API_URL=${api_url}" \\
    --memory 512Mi --cpu 1 \\
    --min-instances 0 --max-instances 3

  local docs_url
  docs_url="$(gcloud run services describe "$DOCS_SERVICE" --project "$PROJECT" \\
    --region "$REGION" --format='value(status.url)')"
  echo
  echo "public docs: ${docs_url}/docs"
  echo "documents:   ${api_url}  (ID token required)"
}'''
new = '''  local api_url auth_mode
  api_url="$(cmd_url 2>/dev/null || true)"
  [[ -n "$api_url" ]] || die "deploy the API service first -- the docs point at it"

  if api_is_public; then auth_mode=public; else auth_mode=iam; fi

  gcloud run deploy "$DOCS_SERVICE" --project "$PROJECT" --region "$REGION" \\
    --image "${IMAGE}:latest" \\
    --service-account "$DOCS_SA" \\
    --allow-unauthenticated \\
    --set-env-vars "DOCS_ONLY=1,API_URL=${api_url},AUTH_MODE=${auth_mode}" \\
    --memory 512Mi --cpu 1 \\
    --min-instances 0 --max-instances 3

  local docs_url
  docs_url="$(gcloud run services describe "$DOCS_SERVICE" --project "$PROJECT" \\
    --region "$REGION" --format='value(status.url)')"

  if [[ "$auth_mode" == "public" ]]; then
    # "Try it out" fetches the API from the docs page's origin. Without this
    # the browser blocks reading the response -- not an auth problem, a
    # same-origin one, and it looks like a mysterious network failure.
    echo "  allowing ${docs_url} to read API responses in a browser"
    gcloud run services update "$SERVICE" --project "$PROJECT" --region "$REGION" \\
      --update-env-vars "CORS_ORIGINS=${docs_url}" >/dev/null
  fi

  echo
  echo "public docs: ${docs_url}/docs"
  if [[ "$auth_mode" == "public" ]]; then
    echo "documents:   ${api_url}  (open -- Try it out works)"
    echo
    echo "note: ${api_url}/docs is now public too and works same-origin, so"
    echo "      ${DOCS_SERVICE} is optional. Two hosts serving one page drift."
  else
    echo "documents:   ${api_url}  (ID token required)"
  fi
}'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("deploy.sh updated")
PY
bash -n deploy/deploy.sh && echo "syntax OK"
```

### CLAUDE (2026-08-26T17:53:20.692Z)

**[tool: Bash]**
```
# Add CORS and description tests
python3 - <<'PY'
from pathlib import Path
p = Path("tests/test_serving.py")
s = p.read_text()

old = '''@unittest.skipUnless(HAVE_FASTAPI, "fastapi not installed")
@unittest.skipUnless(MODEL.exists(), "no trained model on disk")
class TestNormalModeStillServes(unittest.TestCase):'''
new = '''@unittest.skipUnless(HAVE_FASTAPI, "fastapi not installed")
class TestDocsDescribeTheActualAuth(unittest.TestCase):
    """Documenting a token requirement that no longer exists is worse than
    documenting none -- readers stop trusting the page."""

    def _spec(self, **env):
        import importlib
        import os
        keep = {k: os.environ.get(k) for k in
                ("DOCS_ONLY", "API_URL", "AUTH_MODE", "MODEL_URI", "CORS_ORIGINS")}
        os.environ.update({"MODEL_URI": "/nonexistent/predictor.pkl", **env})
        try:
            import serving.app as m
            importlib.reload(m)
            return TestClient(m.app).get("/openapi.json").json(), m
        finally:
            for k, v in keep.items():
                os.environ.pop(k, None)
                if v is not None:
                    os.environ[k] = v
            import serving.app as m
            importlib.reload(m)

    def test_iam_mode_says_a_token_is_needed(self):
        spec, _ = self._spec(DOCS_ONLY="1", API_URL="https://api.example",
                             AUTH_MODE="iam")
        self.assertIn("ID token", spec["info"]["description"])

    def test_public_mode_does_not_ask_for_a_token(self):
        spec, _ = self._spec(DOCS_ONLY="1", API_URL="https://api.example",
                             AUTH_MODE="public")
        d = spec["info"]["description"]
        self.assertNotIn("ID token", d)
        self.assertNotIn("Authorization: Bearer", d)
        self.assertIn("No token needed", d)

    def test_public_mode_still_points_try_it_out_at_the_api(self):
        spec, _ = self._spec(DOCS_ONLY="1", API_URL="https://api.example",
                             AUTH_MODE="public")
        self.assertEqual(spec["servers"][0]["url"], "https://api.example")

    def test_docs_only_is_still_inert_in_public_mode(self):
        """Relaxing the API's auth must not make the docs host predict."""
        import importlib
        import os
        os.environ.update({"DOCS_ONLY": "1", "AUTH_MODE": "public",
                           "API_URL": "https://api.example",
                           "MODEL_URI": "/nonexistent/predictor.pkl"})
        try:
            import serving.app as m
            importlib.reload(m)
            c = TestClient(m.app)
            self.assertEqual(c.post("/predict", json={"jobs": 1}).status_code, 404)
            self.assertIsNone(m._model)
        finally:
            for k in ("DOCS_ONLY", "AUTH_MODE", "API_URL", "MODEL_URI"):
                os.environ.pop(k, None)
            import serving.app as m
            importlib.reload(m)


@unittest.skipUnless(HAVE_FASTAPI, "fastapi not installed")
@unittest.skipUnless(MODEL.exists(), "no trained model on disk")
class TestCors(unittest.TestCase):
    """Only so the separate docs host's Try it out can read the response."""

    def _client(self, **env):
        import importlib
        import os
        os.environ["MODEL_URI"] = str(MODEL)
        os.environ.update(env)
        import serving.app as m
        importlib.reload(m)
        return TestClient(m.app)

    def tearDown(self):
        import importlib
        import os
        for k in ("CORS_ORIGINS", "DOCS_ONLY", "AUTH_MODE"):
            os.environ.pop(k, None)
        import serving.app as m
        importlib.reload(m)

    def test_absent_by_default(self):
        c = self._client()
        r = c.post("/predict", json={"vehicles": 1, "jobs": 10},
                   headers={"Origin": "https://docs.example"})
        self.assertNotIn("access-control-allow-origin", r.headers)

    def test_an_allowed_origin_may_read_the_response(self):
        c = self._client(CORS_ORIGINS="https://docs.example")
        r = c.post("/predict", json={"vehicles": 1, "jobs": 10},
                   headers={"Origin": "https://docs.example"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.headers.get("access-control-allow-origin"),
                         "https://docs.example")

    def test_other_origins_are_not_allowed(self):
        """An allowlist, never '*'."""
        c = self._client(CORS_ORIGINS="https://docs.example")
        r = c.post("/predict", json={"vehicles": 1, "jobs": 10},
                   headers={"Origin": "https://evil.example"})
        self.assertNotEqual(r.headers.get("access-control-allow-origin"),
                            "https://evil.example")

    def test_the_preflight_succeeds(self):
        c = self._client(CORS_ORIGINS="https://docs.example")
        r = c.options("/predict", headers={
            "Origin": "https://docs.example",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.headers.get("access-control-allow-origin"),
                         "https://docs.example")


@unittest.skipUnless(HAVE_FASTAPI, "fastapi not installed")
@unittest.skipUnless(MODEL.exists(), "no trained model on disk")
class TestNormalModeStillServes(unittest.TestCase):'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("tests added")
PY
SP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad
$SP/probe/bin/python -m unittest tests.test_serving 2>&1 | tail -8
```

### CLAUDE (2026-08-26T17:53:36.122Z)

**[tool: Bash]**
```
{
 "command": "docker build -q -t predictor-test . >/dev/null 2>&1 && echo rebuilt\nDOCS=https://predictor-docs-7j5cx7inrq-as.a.run.app\nAPI=https://predictor-api-7j5cx7inrq-as.a.run.app\n\necho \"=== docs host, AUTH_MODE=public ===\"\ndocker run --rm -d --name d1 -p 8096:8080 -e DOCS_ONLY=1 -e AUTH_MODE=public \\\n  -e API_URL=$API -e MODEL_URI=gs://nowhere/nope.pkl predictor-test >/dev/null\nfor i in $(seq 1 30); do curl -sf localhost:8096/openapi.json >/dev/null 2>&1 && break; sleep 1; done\ncurl -s localhost:8096/openapi.json | python3 -c \"\nimport json,sys; d=json.load(sys.stdin)['info']['description']\nprint('  mentions ID token :', 'ID token' in d)\nprint('  mentions Bearer   :', 'Authorization: Bearer' in d)\nprint('  says no token     :', 'No token needed' in d)\"\nprintf \"  /predict still refused: %s\\n\" \"$(curl -s -o /dev/null -w '%{http_code}' -X POST localhost:8096/predict -H 'Content-Type: application/json' -d '{}')\"\ndocker stop d1 >/dev/null\n\necho \"=== API host with CORS for the docs origin ===\"\ndocker run --rm -d --name d2 -p 8095:8080 -v \"$PWD/models:/models:ro\" \\\n  -e MODEL_URI=/models/predictor.pkl -e AUTH_MODE=public -e CORS_ORIGINS=$DOCS predictor-test >/dev/null\nfor i in $(seq 1 30); do curl -sf localhost:8095/readyz >/dev/null 2>&1 && break; sleep 1; done\necho \"  allowed origin  -> $(curl -s -D- -o /dev/null -X POST localhost:8095/predict -H \"Origin: $DOCS\" -H 'Content-Type: application/json' -d '{\"vehicles\":1,\"jobs\":10}' | grep -i '^access-control-allow-origin' | tr -d '\\r')\"\necho \"  other origin    -> $(curl -s -D- -o /dev/null -X POST localhost:8095/predict -H \"Origin: https://evil.example\" -H 'Content-Type: application/json' -d '{\"vehicles\":1,\"jobs\":10}' | grep -ci '^access-control-allow-origin' | sed 's/0/none (blocked)/')\"\ndocker stop d2 >/dev/null",
 "description": "Verify both modes in containers",
 "timeout": 600000
}
```

### CLAUDE (2026-08-26T17:54:05.400Z)

**[tool: Bash]**
```
{
 "command": "python3 - <<'PY'\nfrom pathlib import Path\np = Path(\"DEPLOY.md\")\ns = p.read_text()\n\nold = '''The published schema's `servers` entry points at `predictor-api`, and the\ndescription carries the `curl` recipe — so the page documents something\ncallable rather than itself. *Try it out* will not work from the public page:\nthe real host needs an ID token, and wiring that up would mean CORS on the API.'''\nnew = '''The published schema's `servers` entry points at `predictor-api`, and the\ndescription carries the `curl` recipe — so the page documents something\ncallable rather than itself.\n\n### The docs describe the auth that actually exists\n\n`deploy-docs` reads `predictor-api`'s real IAM policy and sets `AUTH_MODE`\nfrom it, rather than trusting a flag. Documenting a token requirement that no\nlonger holds is worse than documenting none — readers stop believing the page.\n\n* **`AUTH_MODE=iam`** — the description says an ID token is required and shows\n  the `curl` with an `Authorization` header. *Try it out* will not work.\n* **`AUTH_MODE=public`** (`allUsers` has `run.invoker`) — the token language is\n  dropped, the `curl` loses its auth header, and *Try it out* works.\n\nFor it to work from the docs host, `deploy-docs` also sets `CORS_ORIGINS` on\nthe API service to the docs URL. That is a same-origin problem, not an auth\none: without it the browser refuses to *read* a response it was allowed to\nfetch, which surfaces as a mysterious network error. CORS grants no new access\n— the same-origin policy is enforced by browsers, not by the server, and\nanything `curl` could already reach is unaffected. It is an allowlist of one\norigin, never `*`.\n\n> Once `predictor-api` is public, `<api-url>/docs` serves the same page\n> same-origin, with *Try it out* working and no CORS involved. `predictor-docs`\n> becomes optional at that point, and two hosts serving one page will drift.\n> Consider deleting it:\n> `gcloud run services delete predictor-docs --region $REGION`'''\nassert old in s\ns = s.replace(old, new)\n\nold = '''python3 -m unittest discover -s tests      # 210 tests'''\nnew = '''python3 -m unittest discover -s tests      # 218 tests'''\nassert old in s\ns = s.replace(old, new)\np.write_text(s)\nprint(\"DEPLOY.md updated\")\nPY\npython3 - <<'PY'\nfrom pathlib import Path\np = Path(\"PREDICTOR.md\")\ns = p.read_text()\nold = \"python3 tests/test_serving.py       # 37 tests, storage, the API, docs-only mode\"\nnew = \"python3 tests/test_serving.py       # 45 tests, storage, the API, docs and CORS\"\nassert old in s\np.write_text(s.replace(old, new))\nprint(\"PREDICTOR.md updated\")\nPY\necho \"=== full suite, all three environments ===\"\nSP=/private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad\ndocker run --rm -v \"$PWD/tests:/app/tests:ro\" -v \"$PWD/models:/app/models:ro\" --entrypoint python predictor-test -m unittest discover -s tests -p \"test_*.py\" 2>&1 | grep -E \"^(Ran|OK|FAILED)|skipped\" | sed 's/^/  container:  /'\n$SP/probe/bin/python -m unittest discover -s tests -p \"test_*.py\" 2>&1 | grep -E \"^(Ran|OK|FAILED)|skipped\" | sed 's/^/  full deps:  /'\nsource .venv/bin/activate; python3 -m unittest discover -s tests -p \"test_*.py\" 2>&1 | grep -E \"^(Ran|OK|FAILED)|skipped\" | sed 's/^/  bare venv:  /'\ndocker rmi predictor-test >/dev/null 2>&1",
 "description": "Update docs and run full suite everywhere",
 "timeout": 300000
}
```

### CLAUDE (2026-08-26T17:57:16.033Z)

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

### USER (2026-08-26T18:19:58.240Z)

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

### CLAUDE (2026-08-26T18:20:08.113Z)

**[tool: Bash]**
```
# Find metric computations
grep -n "within_25pct\|baseline_mdape\|quantile_crossing\|mape_mean\|p90_coverage\|median_predicted\|median_actual" predictor/train.py
```

### CLAUDE (2026-08-26T18:20:13.631Z)

**[tool: Bash]**
```
# Check crossing rate and mdape definitions
grep -n "crossing_rate" -B4 -A2 predictor/train.py | head -20; echo "=== mdape ==="; sed -n '156,162p' predictor/train.py
```

### CLAUDE (2026-08-26T18:20:49.940Z)

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

### USER (2026-08-28T10:58:39.449Z)

for the training job, are all data points that were harvested used in the training process

### CLAUDE (2026-08-28T10:58:50.447Z)

**[tool: Bash]**
```
# Read chronological_split and targets
sed -n '92,125p' predictor/train.py; echo "=== targets ==="; sed -n '/^def targets/,/^def /p' predictor/train.py | head -20
```

### CLAUDE (2026-08-28T10:59:00.168Z)

**[tool: Bash]**
```
# Read the train function body
sed -n '163,200p' predictor/train.py
```

### CLAUDE (2026-08-28T10:59:03.779Z)

Let me quantify each stage empirically rather than just reading the code.

### CLAUDE (2026-08-28T10:59:07.720Z)

**[tool: Bash]**
```
# Quantify row attrition through the pipeline
source .venv/bin/activate; python3 -c "
from pathlib import Path
from predictor.harvest import load_csv
from predictor.train import chronological_split
from predictor.features import parse_ts

rows = load_csv(Path('data/requests.csv'))
print(f'rows in CSV                 {len(rows):,}')
undated = sum(1 for r in rows if parse_ts(r.get('started_at')) is None)
print(f'  dropped: unparseable started_at  {undated:,}')
tr, te = chronological_split(rows, 0.2)
print(f'  -> train split            {len(tr):,}')
print(f'  -> test split (never fit) {len(te):,}')
print()
from predictor.train import Predictor
p = Predictor.load(Path('models/predictor.pkl'))
for name, m in (('p50', p.p50), ('p90', p.p90)):
    print(f'{name}: early_stopping={m.early_stopping} validation_fraction={m.validation_fraction} '
          f'n_iter_={m.n_iter_} (max 400)')
"
```

### CLAUDE (2026-08-28T10:59:28.825Z)

**[tool: Bash]**
```
# Confirm internal validation holdout
source .venv/bin/activate; python3 -c "
from pathlib import Path
from predictor.train import Predictor
p = Predictor.load(Path('models/predictor.pkl'))
for n, m in (('p50', p.p50), ('p90', p.p90)):
    vs = getattr(m, 'validation_score_', None)
    print(f'{n}: validation_score_ present = {vs is not None}', 
          f'| {len(vs)} scores' if vs is not None else '')
print()
print('n_train recorded in meta:', p.meta['n_train'])
print('=> rows actually reaching the trees ~', round(p.meta['n_train']*0.9))
"
```

### CLAUDE (2026-08-28T10:59:44.174Z)

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

### USER (2026-08-31T13:28:38.707Z)

when doing a harvest allow the API key [REDACTED_SECRET] to be considered. It is in the nbai org

### CLAUDE (2026-08-31T13:28:57.274Z)

**[tool: Bash]**
```
# Inspect a saved portal case
ls samples | head; echo "=== a saved case's meta/row shape ==="; f=$(ls samples/*/*.json 2>/dev/null | head -1 || ls samples/*.json 2>/dev/null | head -1); echo "$f"; [ -n "$f" ] && python3 -c "
import json,sys
d=json.load(open('$f'))
print('top keys:', list(d)[:10])
m=d.get('meta') or d
print('meta keys:', list(m)[:30] if isinstance(m,dict) else type(m))
"
```

### CLAUDE (2026-08-31T13:29:01.267Z)

**[tool: Bash]**
```
# Check whether portal rows carry an apikey field
python3 -c "
import json
d=json.load(open('samples/api-auto-sgp__09bc43c91201d5c696211a234aee9570.json'))
print('top keys:', list(d))
m=d.get('meta', d)
print()
print('meta/list-row keys:', sorted(m) if isinstance(m,dict) else type(m))
print()
for k in ('apikey','api_key','key','org_code','deployment_id'):
    if isinstance(m,dict) and k in m: print(f'  {k} = {m[k]!r}')
"
```

### CLAUDE (2026-08-31T13:29:29.227Z)

Before I build this — the key is a live secret and I want to get two things right.

### CLAUDE (2026-08-31T13:29:35.340Z)

**[tool: AskUserQuestion]**
```
{
 "questions": [
  {
   "question": "What should the harvest do with this API key?",
   "header": "Key's role",
   "multiSelect": false,
   "options": [
    {
     "label": "Carve it out of the nbai exclusion",
     "description": "Harvest currently drops all nbai traffic (DEFAULT_EXCLUDE_ORGS). This would still exclude nbai generally, but keep rows whose apikey matches this one — so that workload becomes training data.",
     "preview": "harvest --deployment api-auto-sgp -org_code:\"nbai\"   <- unchanged\n  + second pull:  org_code:\"nbai\"\n      keep only rows where row[\"apikey\"] == <key>\n      (apikey is never written to the CSV)\n\nEffect: nbai smoke-test traffic stays out,\n        this one key's requests come in."
    },
    {
     "label": "Use it to authenticate API calls",
     "description": "The harvest currently sends no auth at all and reads only the list API. This would use the key to fetch per-request input payloads (the input_json / result_json path that `explain` uses).",
     "preview": "PortalClient.input_json(deployment_id, request_id, apikey)\n  GET {env}/optimization/v2/get_request_input?id=..&key=<key>\n\nEffect: harvest gains coordinates + full payloads,\n        but pulls customer route data onto disk\n        and costs one call per request."
    }
   ]
  }
 ]
}
```

### CLAUDE (2026-08-31T13:30:02.235Z)

Building the carve-out. The key stays out of source and out of argv — env var only, backed by Secret Manager in Cloud Run.

### CLAUDE (2026-08-31T13:30:22.808Z)

**[tool: Bash]**
```
# Add API-key carve-out to harvest
python3 - <<'PY'
from pathlib import Path
p = Path("predictor/harvest.py")
s = p.read_text()

old = '''# A stratum may contribute at most this fraction of the main harvest.'''
new = '''def redact_key(key: str) -> str:
    """A key is a secret. Logs get a fingerprint, never the value."""
    k = str(key)
    return f"{k[:4]}...{k[-4:]}" if len(k) > 12 else "..."


def apikeys_from_env(env_var: str = "HARVEST_INCLUDE_APIKEYS") -> list[str]:
    """API keys whose traffic is harvested even from an excluded org.

    Read from the environment rather than a flag or a constant, deliberately.
    A key in argv is visible in `ps`, in shell history and in the Cloud Run
    job's stored configuration; a key in source is in git forever. This module
    otherwise uses no API keys at all -- see the note at the top.
    """
    import os
    raw = os.environ.get(env_var, "")
    return [k.strip() for k in raw.split(",") if k.strip()]


# A stratum may contribute at most this fraction of the main harvest.'''
assert old in s
s = s.replace(old, new)

old = '''    stratify: bool = True,
    append: bool = True,
) -> dict:'''
new = '''    stratify: bool = True,
    append: bool = True,
    include_apikeys: list[str] | None = None,
) -> dict:'''
assert old in s
s = s.replace(old, new)

old = '''    With `append` (the default) an existing `dest` is added to rather than
    replaced, and request_ids already in the file are skipped. Set it False to
    start the dataset over.'''
new = '''    With `append` (the default) an existing `dest` is added to rather than
    replaced, and request_ids already in the file are skipped. Set it False to
    start the dataset over.

    `include_apikeys` carves specific API keys out of the org exclusions: the
    excluded orgs are re-queried and only rows made with one of those keys are
    kept. Used for a real workload that happens to run under an org excluded
    for other reasons. The key itself is never written to the CSV -- it is not
    in RAW_COLUMNS -- and never logged.'''
assert old in s
s = s.replace(old, new)

# pull() gains a predicate.
old = '''        def pull(q: str, n: int, label: str) -> int:
            before = state["kept"]
            try:
                for row in client.iter_requests(q=q, limit=n, page_size=page_size):
                    rid = str(row.get("request_id"))
                    if rid in seen:'''
new = '''        def pull(q: str, n: int, label: str, keep=None) -> int:
            before = state["kept"]
            try:
                for row in client.iter_requests(q=q, limit=n, page_size=page_size):
                    if keep is not None and not keep(row):
                        state["filtered"] += 1
                        continue
                    rid = str(row.get("request_id"))
                    if rid in seen:'''
assert old in s
s = s.replace(old, new)

old = '''    state = {"kept": 0, "skipped": 0, "duplicates": 0, "oldest": None, "newest": None}'''
new = '''    state = {"kept": 0, "skipped": 0, "duplicates": 0, "filtered": 0,
             "oldest": None, "newest": None}'''
assert old in s
s = s.replace(old, new)

# The carve-out pull, after the strata.
old = '''                    got = pull(stratum_q, target, extra)
                    strata_counts[extra] = got
                    print(f"  +{got:,} rows for {extra} "
                          f"(cap {target:,} = {STRATUM_MAX_SHARE:.0%} of main)",
                          file=sys.stderr)'''
new = '''                    got = pull(stratum_q, target, extra)
                    strata_counts[extra] = got
                    print(f"  +{got:,} rows for {extra} "
                          f"(cap {target:,} = {STRATUM_MAX_SHARE:.0%} of main)",
                          file=sys.stderr)

            # API-key carve-out. The main query excluded these orgs wholesale;
            # re-query each one and keep only the named keys' requests.
            if include_apikeys and exclude_orgs:
                wanted = set(include_apikeys)
                for org in exclude_orgs:
                    # build_query drops the exclusions once an org is pinned,
                    # so this asks for exactly the org that was filtered out.
                    org_q = build_query(q, org, deployment=deployment)
                    got = pull(org_q, limit, f"apikey carve-out ({org})",
                               keep=lambda row: str(row.get("apikey") or "") in wanted)
                    apikey_rows[org] = got
                    keys = ", ".join(redact_key(k) for k in include_apikeys)
                    print(f"  +{got:,} rows from {org} for key(s) {keys}",
                          file=sys.stderr)'''
assert old in s
s = s.replace(old, new)

old = '''    strata_counts: dict[str, int] = {}'''
new = '''    strata_counts: dict[str, int] = {}
    apikey_rows: dict[str, int] = {}'''
assert old in s
s = s.replace(old, new)

old = '''        "main_rows": state["kept"] - sum(strata_counts.values()),'''
new = '''        "main_rows": (state["kept"] - sum(strata_counts.values())
                      - sum(apikey_rows.values())),'''
assert old in s
s = s.replace(old, new)

old = '''        "strata": strata_counts,'''
new = '''        "strata": strata_counts,
        "apikey_rows": apikey_rows,
        "apikeys": [redact_key(k) for k in (include_apikeys or [])],
        "filtered": state["filtered"],'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("harvest.py updated")
PY
source .venv/bin/activate; python3 -c "import predictor.harvest; print('imports OK')"
```

### CLAUDE (2026-08-31T13:30:35.795Z)

**[tool: Bash]**
```
# Wire env-based key into the CLI
python3 - <<'PY'
from pathlib import Path
p = Path("predictor/harvest.py")
s = p.read_text()
old = '''The list endpoint already carries every feature AND the label
(`completed_at - started_at`), so this needs no per-request calls and never
touches an input payload. That means: fast (one page per 100 rows), no
customer route data on disk, and no API keys used at all.'''
new = '''The list endpoint already carries every feature AND the label
(`completed_at - started_at`), so this needs no per-request calls and never
touches an input payload. That means: fast (one page per 100 rows), no
customer route data on disk, and nothing authenticated.

An API key is used in exactly one place and only for comparison: the carve-out
that keeps a named key's traffic out of an org-wide exclusion (see
`apikeys_from_env`). It is never sent anywhere, never written to the CSV --
`apikey` is not in RAW_COLUMNS -- and never logged unredacted.'''
assert old in s
s = s.replace(old, new)
p.write_text(s)

p = Path("predictor/cli.py")
s = p.read_text()
old = '''    stratify = not args.no_stratify'''
new = '''    from .harvest import apikeys_from_env, redact_key

    # Read from the environment, never a flag: a key in argv shows up in `ps`,
    # in shell history and in the Cloud Run job's stored config.
    include_apikeys = apikeys_from_env()
    if include_apikeys:
        print(f"  carve-out: keeping "
              f"{', '.join(redact_key(k) for k in include_apikeys)} "
              f"from otherwise-excluded orgs")

    stratify = not args.no_stratify'''
assert old in s
s = s.replace(old, new)

old = '''                              stratify=stratify, append=append)'''
new = '''                              stratify=stratify, append=append,
                              include_apikeys=include_apikeys)'''
assert old in s
s = s.replace(old, new)

old = '''    if summary.get("strata"):'''
new = '''    for org, n in (summary.get("apikey_rows") or {}).items():
        print(f"    apikey carve-out from {org}: +{n:,} rows")
        if n == 0:
            print(f"      none matched -- either that key sent no succeeded "
                  f"requests in\\n      the window --limit reaches, or it does "
                  f"not belong to {org}.", file=sys.stderr)
    if summary.get("strata"):'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("cli.py updated")
PY
source .venv/bin/activate; python3 -m predictor harvest --help >/dev/null && echo "CLI OK"
```

### CLAUDE (2026-08-31T13:30:38.314Z)

Now tests — including that the key never reaches the CSV or the logs.

### CLAUDE (2026-08-31T13:31:02.853Z)

**[tool: Bash]**
```
# Add carve-out tests
python3 - <<'PY'
from pathlib import Path
p = Path("tests/test_portal.py")
s = p.read_text()

old = '''class TestSingleOrgQueries(unittest.TestCase):'''
new = '''class TestApiKeyCarveOut(unittest.TestCase):
    """Keep one API key's traffic despite an org-wide exclusion.

    nbai is excluded because it is NextBillion's own smoke-test traffic, but a
    real workload can run under it. The carve-out re-queries the excluded org
    and keeps only the named keys.
    """

    KEY = "[REDACTED_SECRET]"
    OTHER = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

    @classmethod
    def setUpClass(cls):
        cls.srv = HTTPServer(("127.0.0.1", 0), StubPortal)
        threading.Thread(target=cls.srv.serve_forever, daemon=True).start()
        cls.client = PortalClient(
            portal_base=f"http://127.0.0.1:{cls.srv.server_port}/api", pause_s=0)
        cls.added = []
        for i in range(4):
            row = {"deployment_id": "d", "request_id": f"nbai-keep-{i}",
                   "org_code": "nbai", "apikey": cls.KEY, "jobs_count": 5,
                   "started_at": "2026-08-20T12:00:00Z",
                   "completed_at": "2026-08-20T12:00:03Z"}
            ROWS.append(row); cls.added.append(row)
        for i in range(6):
            row = {"deployment_id": "d", "request_id": f"nbai-drop-{i}",
                   "org_code": "nbai", "apikey": cls.OTHER, "jobs_count": 5,
                   "started_at": "2026-08-20T12:00:00Z",
                   "completed_at": "2026-08-20T12:00:03Z"}
            ROWS.append(row); cls.added.append(row)

    @classmethod
    def tearDownClass(cls):
        for row in cls.added:
            ROWS.remove(row)
        cls.srv.shutdown()

    def _harvest(self, dest, keys):
        from predictor.harvest import harvest
        return harvest(dest, limit=200, q="", deployment="d",
                       exclude_orgs=["nbai"], client=self.client,
                       stratify=False, include_apikeys=keys)

    def _rows(self, dest):
        import csv as _csv
        with open(dest, newline="") as fh:
            return list(_csv.DictReader(fh))

    def test_without_the_carve_out_nbai_stays_out(self):
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            self._harvest(dest, None)
            self.assertNotIn("nbai", {r["org_code"] for r in self._rows(dest)})

    def test_the_named_key_is_harvested(self):
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            summary = self._harvest(dest, [self.KEY])
            ids = {r["request_id"] for r in self._rows(dest)}
            self.assertEqual(summary["apikey_rows"]["nbai"], 4)
            for i in range(4):
                self.assertIn(f"nbai-keep-{i}", ids)

    def test_other_keys_in_the_same_org_stay_excluded(self):
        """The carve-out is one key, not a re-admission of the whole org."""
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            self._harvest(dest, [self.KEY])
            ids = {r["request_id"] for r in self._rows(dest)}
            for i in range(6):
                self.assertNotIn(f"nbai-drop-{i}", ids)

    def test_the_key_is_never_written_to_the_csv(self):
        """The dataset is shared and versioned in a bucket. A secret must not
        be in it."""
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            self._harvest(dest, [self.KEY])
            text = dest.read_text()
            self.assertNotIn(self.KEY, text)
            self.assertNotIn("apikey", text.splitlines()[0])

    def test_the_summary_reports_only_a_fingerprint(self):
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            summary = self._harvest(dest, [self.KEY])
            self.assertNotIn(self.KEY, json.dumps(summary))
            self.assertEqual(summary["apikeys"], ["d691...b0f6"])

    def test_main_rows_excludes_the_carve_out(self):
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            summary = self._harvest(dest, [self.KEY])
            self.assertEqual(
                summary["main_rows"] + sum(summary["strata"].values())
                + sum(summary["apikey_rows"].values()),
                summary["rows"])

    def test_no_exclusions_means_no_carve_out_pull(self):
        """Nothing was excluded, so there is nothing to carve out of."""
        import tempfile
        from predictor.harvest import harvest
        with tempfile.TemporaryDirectory() as d:
            dest = Path(d) / "out.csv"
            summary = harvest(dest, limit=50, q="", deployment="d",
                              exclude_orgs=[], client=self.client,
                              stratify=False, include_apikeys=[self.KEY])
            self.assertEqual(summary["apikey_rows"], {})


class TestApiKeysComeFromTheEnvironment(unittest.TestCase):
    """A key in argv is in `ps`, in shell history and in the Cloud Run job's
    stored config. It is read from the environment instead."""

    def test_absent_by_default(self):
        import os
        from predictor.harvest import apikeys_from_env
        os.environ.pop("HARVEST_INCLUDE_APIKEYS", None)
        self.assertEqual(apikeys_from_env(), [])

    def test_parsed_and_trimmed(self):
        import os
        from predictor.harvest import apikeys_from_env
        os.environ["HARVEST_INCLUDE_APIKEYS"] = " abc , def ,, "
        try:
            self.assertEqual(apikeys_from_env(), ["abc", "def"])
        finally:
            os.environ.pop("HARVEST_INCLUDE_APIKEYS", None)

    def test_no_cli_flag_accepts_a_raw_key(self):
        """Guard against someone adding one later for convenience."""
        from predictor.cli import main
        import contextlib, io
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf), self.assertRaises(SystemExit):
            main(["harvest", "--help"])
        self.assertNotIn("--apikey", buf.getvalue())
        self.assertNotIn("--include-apikey", buf.getvalue())

    def test_redaction_keeps_only_a_fingerprint(self):
        from predictor.harvest import redact_key
        self.assertEqual(redact_key("[REDACTED_SECRET]"),
                         "d691...b0f6")
        self.assertEqual(redact_key("short"), "...")


class TestSingleOrgQueries(unittest.TestCase):'''
assert old in s
s = s.replace(old, new, 1)
p.write_text(s)
print("tests added")
PY
source .venv/bin/activate; python3 -m unittest tests.test_portal 2>&1 | tail -12
```

### CLAUDE (2026-08-31T13:31:28.454Z)

**[tool: Bash]**
```
# Add Secret Manager wiring and run suite
python3 - <<'PY'
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
  # never in argv, where it would land in shell history and in `ps`, and
  # never in the job's plain env, where anyone with console access sees it.
  gcloud secrets describe "$APIKEY_SECRET" --project "$PROJECT" >/dev/null 2>&1 || \\
  gcloud secrets create "$APIKEY_SECRET" --project "$PROJECT" \\
    --replication-policy=automatic

  echo "Paste the API key(s), comma-separated, then press Ctrl-D:" >&2
  gcloud secrets versions add "$APIKEY_SECRET" --project "$PROJECT" --data-file=-

  gcloud secrets add-iam-policy-binding "$APIKEY_SECRET" --project "$PROJECT" \\
    --member "serviceAccount:${JOB_SA}" \\
    --role roles/secretmanager.secretAccessor >/dev/null

  gcloud run jobs update "$JOB" --project "$PROJECT" --region "$REGION" \\
    --set-secrets "HARVEST_INCLUDE_APIKEYS=${APIKEY_SECRET}:latest"

  echo
  echo "stored. The job reads it as HARVEST_INCLUDE_APIKEYS; the harvest logs"
  echo "only a fingerprint and never writes the key to the dataset."
  echo "rotate later with: ./deploy/deploy.sh set-apikeys"
}

cmd_grant_admin() {'''
assert old in s
s = s.replace(old, new)

old = '''  grant-admin)   shift; cmd_grant_admin "$@" ;;'''
new = '''  set-apikeys)   cmd_set_apikeys ;;
  grant-admin)   shift; cmd_grant_admin "$@" ;;'''
assert old in s
s = s.replace(old, new)

# secretmanager API must be enabled
old = '''    storage.googleapis.com cloudscheduler.googleapis.com'''
new = '''    storage.googleapis.com cloudscheduler.googleapis.com \\
    secretmanager.googleapis.com'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("deploy.sh updated")
PY
bash -n deploy/deploy.sh && echo "syntax OK"
echo "=== full suite ==="
source .venv/bin/activate; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED)|skipped"
```

### CLAUDE (2026-08-31T13:32:32.069Z)

**[tool: Bash]**
```
# Update docs and verify the key isn't embedded
python3 - <<'PY'
from pathlib import Path
p = Path("PREDICTOR.md")
s = p.read_text()
old = '''Override with `--deployment ''` (all deployments), `--exclude-org CODE`
(repeatable), or `--q` for any other portal filter term.'''
new = '''### Carving one API key out of an org exclusion

`nbai` is excluded wholesale, but a real workload can run under it. Set
`HARVEST_INCLUDE_APIKEYS` (comma-separated) and the harvest re-queries each
excluded org and keeps only rows made with those keys — the rest of the org
stays out.

```bash
HARVEST_INCLUDE_APIKEYS=<key> python3 -m predictor harvest
```

It is an environment variable and not a flag on purpose: a key in argv shows
up in `ps`, in shell history, and in a Cloud Run job's stored configuration.
The key is used only for comparison — never sent anywhere, never written to
the CSV (`apikey` is not in `RAW_COLUMNS`), and logged only as a fingerprint
like `d691...b0f6`. In GCP it comes from Secret Manager via
`./deploy/deploy.sh set-apikeys`.

Override with `--deployment ''` (all deployments), `--exclude-org CODE`
(repeatable), or `--q` for any other portal filter term.'''
assert old in s
s = s.replace(old, new)
old = "python3 tests/test_portal.py        # 40 tests, incl. filter negation and append"
new = "python3 tests/test_portal.py        # 51 tests, incl. negation, append, key carve-out"
assert old in s
s = s.replace(old, new)
p.write_text(s)

p = Path("DEPLOY.md")
s = p.read_text()
old = '''**`--limit` bounds how far back the harvest walks, not how many rows it adds.**'''
new = '''**The API-key carve-out is a secret.** `./deploy/deploy.sh set-apikeys` reads
the key from stdin, stores it in Secret Manager, grants the job's service
account `secretAccessor`, and mounts it as `HARVEST_INCLUDE_APIKEYS`. The
serving side never sees it. Rotate by re-running the same command.

**`--limit` bounds how far back the harvest walks, not how many rows it adds.**'''
assert old in s
s = s.replace(old, new)
old = '''python3 -m unittest discover -s tests      # 218 tests'''
new = '''python3 -m unittest discover -s tests      # 229 tests'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("docs updated")
PY
grep -rn "[REDACTED_SECRET]" --include="*.py" --include="*.md" --include="*.sh" . 2>/dev/null | grep -v tests/ | grep -v .venv || echo "key appears in no source, doc, or script (tests use it as a fixture only)"
```

### CLAUDE (2026-08-31T13:32:36.364Z)

The key is still sitting in the test as a fixture — that would commit a live secret to git. Replacing it with a fake.

### CLAUDE (2026-08-31T13:32:41.585Z)

**[tool: Bash]**
```
# Replace live key with fake fixture and re-run
python3 - <<'PY'
from pathlib import Path
p = Path("tests/test_portal.py")
s = p.read_text()
old = '''    KEY = "[REDACTED_SECRET]"
    OTHER = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"'''
new = '''    # A fabricated key with the same shape as a real one. Never put a live
    # key in a test -- it would be in git forever.
    KEY = "0123456789abcdef0123456789abcdef"
    OTHER = "fedcba9876543210fedcba9876543210"'''
assert old in s
s = s.replace(old, new)
old = '''            self.assertEqual(summary["apikeys"], ["d691...b0f6"])'''
new = '''            self.assertEqual(summary["apikeys"], ["0123...cdef"])'''
assert old in s
s = s.replace(old, new)
old = '''        self.assertEqual(redact_key("[REDACTED_SECRET]"),
                         "d691...b0f6")'''
new = '''        self.assertEqual(redact_key("0123456789abcdef0123456789abcdef"),
                         "0123...cdef")'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("fixture key replaced with a fake")
PY
grep -rn "[REDACTED_SECRET]" . 2>/dev/null | grep -v ".venv" || echo "the live key now appears nowhere in the repo"
source .venv/bin/activate; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED)|skipped"
```

### CLAUDE (2026-08-31T13:33:44.816Z)

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

### USER (2026-08-31T13:39:38.644Z)

deploy changes

### CLAUDE (2026-08-31T13:39:54.772Z)

**[tool: Bash]**
```
# Check current env before redeploying
echo "=== job env/secrets ==="
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
for e in c.get('env',[]): print(f'  {e[\"name\"]:20} {e.get(\"value\",\"(secret)\")}')
"
```

### CLAUDE (2026-08-31T13:40:05.958Z)

`--set-env-vars` replaces the whole env block — that would wipe `CORS_ORIGINS` now, and silently drop the harvest key once `set-apikeys` has run. Fixing that before I deploy.

### CLAUDE (2026-08-31T13:40:12.897Z)

**[tool: Bash]**
```
# Switch to non-clobbering env updates
python3 - <<'PY'
from pathlib import Path
p = Path("deploy/deploy.sh")
s = p.read_text()

old = '''    --no-allow-unauthenticated \\
    --set-env-vars "MODEL_URI=${MODEL_URI}${gen:+,MODEL_GENERATION=$gen}" \\'''
new = '''    --no-allow-unauthenticated \\
    --update-env-vars "MODEL_URI=${MODEL_URI}${gen:+,MODEL_GENERATION=$gen}" \\'''
assert old in s
s = s.replace(old, new)

old = '''    --set-env-vars "DATA_URI=${DATA_URI},MODEL_URI=${MODEL_URI}${MVRO_PORTAL_API:+,MVRO_PORTAL_API=$MVRO_PORTAL_API}"'''
new = '''    # --update-env-vars, NOT --set-env-vars: the latter replaces the whole
    # block, which would drop CORS_ORIGINS here and silently drop the
    # secret-backed HARVEST_INCLUDE_APIKEYS on the job. A harvest that quietly
    # stops including the carved-out key is exactly the kind of failure
    # nobody notices.
    --update-env-vars "DATA_URI=${DATA_URI},MODEL_URI=${MODEL_URI}${MVRO_PORTAL_API:+,MVRO_PORTAL_API=$MVRO_PORTAL_API}"'''
assert old in s
s = s.replace(old, new)

old = '''    --set-env-vars "DOCS_ONLY=1,API_URL=${api_url},AUTH_MODE=${auth_mode}" \\'''
new = '''    --update-env-vars "DOCS_ONLY=1,API_URL=${api_url},AUTH_MODE=${auth_mode}" \\'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("deploy.sh now updates env rather than replacing it")
PY
bash -n deploy/deploy.sh && echo "syntax OK"
```

### CLAUDE (2026-08-31T13:40:15.196Z)

**[tool: Bash]**
```
{
 "command": "./deploy/deploy.sh build 2>&1 | tail -12",
 "description": "Build and push the image",
 "timeout": 900000
}
```

### CLAUDE (2026-08-31T13:41:43.247Z)

**[tool: Bash]**
```
{
 "command": "./deploy/deploy.sh deploy 2>&1 | tail -15",
 "description": "Deploy service and job",
 "timeout": 900000
}
```

### CLAUDE (2026-08-31T13:42:39.122Z)

**[tool: Bash]**
```
# Check whether deploy revoked public access
echo "=== did --no-allow-unauthenticated revoke public access? ==="
gcloud run services get-iam-policy predictor-api --region asia-southeast1 --format=json 2>/dev/null | grep -c allUsers | sed 's/^0$/NO allUsers binding - public access REMOVED/;s/^1$/allUsers still present/'
curl -s -o /dev/null -w "  unauthenticated GET /model -> HTTP %{http_code}\n" https://predictor-api-7j5cx7inrq-as.a.run.app/model
```

### CLAUDE (2026-08-31T13:42:50.288Z)

`--no-allow-unauthenticated` in `cmd_deploy` just revoked the public access you'd added. Restoring it, then fixing the script so a deploy can't silently flip your auth posture again.

### CLAUDE (2026-08-31T13:42:51.624Z)

**[tool: Bash]**
```
# Restore public access
gcloud run services add-iam-policy-binding predictor-api --region asia-southeast1 \
  --member allUsers --role roles/run.invoker >/dev/null 2>&1 && echo "allUsers restored"
gcloud run services get-iam-policy predictor-api --region asia-southeast1 --format=json 2>/dev/null | grep -c allUsers | sed 's/^1$/  confirmed: allUsers has run.invoker/'
```

### CLAUDE (2026-08-31T13:43:08.422Z)

**[tool: Bash]**
```
# Make deploy preserve auth posture
python3 - <<'PY'
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
s = s.replace("cmd_deploy() {", helper + "cmd_deploy() {", 1)

old = '''cmd_deploy() {
  local gen
  gen="$(current_generation || true)"
'''
new = '''cmd_deploy() {
  local gen auth_flag
  gen="$(current_generation || true)"

  # Preserve whatever auth posture the service already has. Hardcoding
  # --no-allow-unauthenticated here silently revoked a deliberate `allUsers`
  # grant on the next deploy -- the service kept serving for a minute while
  # IAM propagated, so it looked like nothing had happened.
  if api_is_public; then
    auth_flag="--allow-unauthenticated"
    echo "  keeping this service PUBLIC (allUsers already has run.invoker)"
  else
    auth_flag="--no-allow-unauthenticated"
  fi
'''
assert old in s
s = s.replace(old, new)

old = '''    --no-allow-unauthenticated \\
    --update-env-vars "MODEL_URI=${MODEL_URI}${gen:+,MODEL_GENERATION=$gen}" \\'''
new = '''    "$auth_flag" \\
    --update-env-vars "MODEL_URI=${MODEL_URI}${gen:+,MODEL_GENERATION=$gen}" \\'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("cmd_deploy now preserves the existing auth posture")
PY
bash -n deploy/deploy.sh && echo "syntax OK"
grep -n "auth_flag\|api_is_public" deploy/deploy.sh | head
```

### CLAUDE (2026-08-31T13:43:12.514Z)

**[tool: Bash]**
```
{
 "command": "./deploy/deploy.sh deploy 2>&1 | grep -E \"keeping|revision|Service URL|job|successfully\" | head -8\necho \"=== auth posture after a second deploy ===\"\ngcloud run services get-iam-policy predictor-api --region asia-southeast1 --format=json 2>/dev/null | grep -c allUsers | sed 's/^1$/  allUsers preserved/;s/^0$/  LOST AGAIN/'",
 "description": "Redeploy and confirm auth is preserved",
 "timeout": 900000
}
```

### CLAUDE (2026-08-31T13:43:55.748Z)

**[tool: Bash]**
```
{
 "command": "./deploy/deploy.sh deploy-docs 2>&1 | tail -10",
 "description": "Deploy the docs host",
 "timeout": 900000
}
```

### CLAUDE (2026-08-31T13:44:48.969Z)

Now let me verify the deployed state end to end rather than trusting the deploy output.

### CLAUDE (2026-08-31T13:44:54.837Z)

**[tool: Bash]**
```
# Verify deployed state end to end
API=https://predictor-api-7j5cx7inrq-as.a.run.app
DOCS=https://predictor-docs-7j5cx7inrq-as.a.run.app
echo "=== API (unauthenticated) ==="
for p in /docs /model /readyz; do printf "  %-9s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' $API$p)"; done
printf "  %-9s %s\n" "/predict" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $API/predict -H 'Content-Type: application/json' -d '{"vehicles":12,"jobs":400,"locations":412}')"
echo "=== CORS from the docs origin ==="
curl -s -D- -o /dev/null -X POST $API/predict -H "Origin: $DOCS" -H 'Content-Type: application/json' -d '{"vehicles":1,"jobs":10}' | grep -i '^access-control-allow-origin' | sed 's/^/  /' | tr -d '\r'
echo "=== docs host says no token needed ==="
curl -s $DOCS/openapi.json | python3 -c "
import json,sys; d=json.load(sys.stdin)['info']['description']
print('  ID token mentioned:', 'ID token' in d, '| says no token:', 'No token needed' in d)"
printf "  docs host /predict still refused: %s\n" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $DOCS/predict -H 'Content-Type: application/json' -d '{}')"
echo "=== job carries the new image ==="
gcloud run jobs describe predictor-job --region asia-southeast1 --format='value(spec.template.spec.template.spec.containers[0].image)' 2>/dev/null | sed 's/^/  /'
```

### CLAUDE (2026-08-31T13:45:12.538Z)

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

### USER (2026-08-31T13:46:30.030Z)

<bash-input> ./deploy/deploy.sh set-apikeys</bash-input>

### USER (2026-08-31T13:46:32.803Z)

<bash-stdout></bash-stdout><bash-stderr>Created secret [predictor-harvest-apikeys].
Paste the API key(s), comma-separated, then press Ctrl-D:
ERROR: (gcloud.secrets.versions.add) INVALID_ARGUMENT: Secret Payload cannot be empty.
</bash-stderr>

### CLAUDE (2026-08-31T13:46:46.128Z)

Claude Code's `!` doesn't give the command a TTY, so `--data-file=-` saw EOF immediately. The secret was created but has no version, and `set -e` stopped the rest. Let me make it work both interactively and piped.

### CLAUDE (2026-08-31T13:46:55.146Z)

**[tool: Bash]**
```
# Fix set-apikeys for non-TTY, check secret state
python3 - <<'PY'
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
  else
    keys="$(cat)"                       # piped: ./deploy.sh set-apikeys < file
  fi
  keys="${keys//[$'\\r\\n']/}"            # a stray newline would corrupt the key
  [[ -n "$keys" ]] || die "no key given -- run this in a real terminal, or pipe it:
  printf %s 'KEY1,KEY2' | ./deploy/deploy.sh set-apikeys"

  # printf, not echo: no trailing newline in the stored payload.
  printf '%s' "$keys" \\
    | gcloud secrets versions add "$APIKEY_SECRET" --project "$PROJECT" --data-file=-
'''
assert old in s
s = s.replace(old, new)

old = '''  echo
  echo "stored. The job reads it as HARVEST_INCLUDE_APIKEYS; the harvest logs"'''
new = '''  echo
  echo "stored $(printf '%s' "$keys" | tr ',' '\\n' | wc -l | tr -d ' ') key(s)."
  echo "The job reads it as HARVEST_INCLUDE_APIKEYS; the harvest logs"'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("set-apikeys now handles both TTY and piped input")
PY
bash -n deploy/deploy.sh && echo "syntax OK"
echo "=== secret state after the failed run ==="
gcloud secrets versions list predictor-harvest-apikeys --project [GCP_PROJECT] --format='value(name,state)' 2>&1 | head -3 | sed 's/^/  /' || echo "  no versions (as expected)"
```

### CLAUDE (2026-08-31T13:47:11.735Z)

**[tool: Bash]**
```
# Test the input handling in isolation
cat > /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad/t.sh <<'EOF'
set -euo pipefail
die() { echo "error: $*" >&2; exit 1; }
read_keys() {
  local keys
  if [[ -t 0 ]]; then read -rsp "prompt: " keys; echo >&2
  else keys="$(cat)"; fi
  keys="${keys//[$'\r\n']/}"
  [[ -n "$keys" ]] || die "no key given"
  printf '%s' "$keys"
}
read_keys
EOF
echo "--- piped with a trailing newline ---"
printf 'AAAA1111BBBB2222,CCCC3333\n' | bash /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad/t.sh | xxd | tail -2
echo "--- empty stdin (the failure you hit) ---"
printf '' | bash /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad/t.sh 2>&1 || true
rm -f /private/tmp/claude-501/-Users-[USER]-workspace-openai-explain/e7495ec5-5c26-4b14-8244-870955e8c793/scratchpad/t.sh
```

### CLAUDE (2026-08-31T13:47:20.866Z)

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

### USER (2026-08-31T14:23:31.140Z)

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

### CLAUDE (2026-08-31T14:23:43.857Z)

Exit code 2 is specific — that's `ConcurrentWrite` in my CLI, not a generic failure. Let me read the actual logs rather than guess.

### CLAUDE (2026-08-31T14:23:45.571Z)

**[tool: Bash]**
```
# Read the failed execution's logs
gcloud logging read \
  'resource.type=cloud_run_job AND resource.labels.job_name=predictor-job AND labels."run.googleapis.com/execution_name"="predictor-job-cd5cm"' \
  --project [GCP_PROJECT] --limit 40 --format='value(textPayload)' 2>&1 | tac | head -40
```

### CLAUDE (2026-08-31T14:24:02.583Z)

Two separate things in that log. Let me check what actually wrote the dataset.

### CLAUDE (2026-08-31T14:24:05.637Z)

**[tool: Bash]**
```
# Find what else wrote the dataset
echo "=== recent executions ==="
gcloud run jobs executions list --job predictor-job --region asia-southeast1 \
  --format='table(name,status.startTime,status.completionTime,status.succeededCount,status.failedCount)' 2>&1 | head -8
echo "=== current dataset generation ==="
gcloud storage objects describe gs://[GCP_PROJECT]-predictor/data/requests.csv \
  --format='value[separator="  "](generation,updated,size)' 2>&1
echo "=== scheduler jobs ==="
gcloud scheduler jobs list --location asia-southeast1 --format='value(name,schedule,state)' 2>&1 | head -3
```

### CLAUDE (2026-08-31T14:24:26.935Z)

Nothing is broken — the precondition did exactly its job. Look at the overlap:

```
predictor-job-2twws   13:35:51 → 14:06:53   succeeded
predictor-job-cd5cm   13:48:31 → 14:19:33   FAILED  ← yours
```

Your run started at 13:48 while `2twws` was still going. Both read the same generation; `2twws` finished first and wrote; yours then tried to write over it and was refused. **Without that check it would have silently discarded ~30 minutes of `2twws`'s harvested rows.** The dataset is intact — now 27.5 MB, up from 13.3 MB.

But the log exposed a real defect of mine:

### CLAUDE (2026-08-31T14:24:27.778Z)

**[tool: Bash]**
```
# Inspect the misleading display logic
sed -n '/^def cmd_harvest/,/^    stratify = /p' predictor/cli.py
```

### CLAUDE (2026-08-31T14:24:38.468Z)

**[tool: Bash]**
```
# Fix URI display and improve the conflict message
python3 - <<'PY'
from pathlib import Path
p = Path("predictor/cli.py")
s = p.read_text()

old = '''    dest = Path(args.out)
    append = not args.overwrite
    exists = dest.exists() and dest.stat().st_size > 0
    verb = "Appending up to" if (append and exists) else "Harvesting up to"
    print(f"{verb} {args.limit:,} rows into {dest} ...")
    print("  (list API only -- no input payloads are fetched or stored)")
    if append and exists:
        print("  rows already in the file are skipped, so --limit walks the API "
              "list\\n  and keeps only what is new since the last harvest")
    elif args.overwrite and exists:
        print(f"  --overwrite: replacing the existing {dest}")'''
new = '''    append = not args.overwrite
    # Path("gs://b/x") collapses to "gs:/b/x", and a remote object never
    # exists() locally -- so both the URI shown and the append/overwrite verb
    # were wrong for every cloud harvest. Ask the store instead.
    exists = store_for(args.out).generation() is not None
    verb = "Appending up to" if (append and exists) else "Harvesting up to"
    print(f"{verb} {args.limit:,} rows into {args.out} ...")
    print("  (list API only -- no input payloads are fetched or stored)")
    if append and exists:
        print("  rows already in the file are skipped, so --limit walks the API "
              "list\\n  and keeps only what is new since the last harvest")
    elif args.overwrite and exists:
        print(f"  --overwrite: replacing the existing {args.out}")'''
assert old in s
s = s.replace(old, new)

# The ConcurrentWrite message should say what to actually do.
old = '''    except ConcurrentWrite as e:
        print(f"\\n{e}", file=sys.stderr)
        return 2'''
new = '''    except ConcurrentWrite as e:
        print(f"\\n{e}", file=sys.stderr)
        print("  Nothing was lost: the other run's rows are on disk and this "
              "run's\\n  were discarded. Check for an overlapping execution "
              "before re-running --\\n  `--parallelism 1` bounds tasks WITHIN "
              "an execution, not concurrent\\n  executions of the job.",
              file=sys.stderr)
        return 2'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("cli.py fixed")
PY
source .venv/bin/activate; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED)|skipped"
```

### CLAUDE (2026-08-31T14:25:46.177Z)

**[tool: Bash]**
```
# Add regression tests and correct the docs
python3 - <<'PY'
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
        self.assertEqual(str(Path(uri)), "gs:/bucket/data/requests.csv",
                         "if this ever stops collapsing, the guard can go")
        self.assertEqual(store_for(uri).uri, uri)

    def test_existence_is_asked_of_the_store_not_the_filesystem(self):
        with tempfile.TemporaryDirectory() as d:
            local = Path(d) / "x.csv"
            self.assertIsNone(store_for(str(local)).generation())
            local.write_text("a\\n")
            self.assertIsNotNone(store_for(str(local)).generation())


class TestEditableLeavesLocalPathsAlone(unittest.TestCase):'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("regression tests added")
PY
python3 - <<'PY'
from pathlib import Path
p = Path("DEPLOY.md")
s = p.read_text()
old = '''The job also runs `--parallelism 1 --max-retries 0`, so the situation mostly
does not arise. The precondition is there for when it does.'''
new = '''The job runs `--parallelism 1 --max-retries 0`, but **that bounds tasks within
one execution, not concurrent executions of the job** — two `gcloud run jobs
execute` calls run happily side by side. This is not theoretical: two overlapping
harvests on 2026-08-31 read the same generation, and the second was refused on
write, exit code 2. Nothing was lost, which is the whole point. Check
`gcloud run jobs executions list --job predictor-job` before kicking off a
harvest; a full `--limit 100000` run takes roughly 30 minutes.'''
assert old in s
s = s.replace(old, new)
old = '''python3 -m unittest discover -s tests      # 229 tests'''
new = '''python3 -m unittest discover -s tests      # 231 tests'''
assert old in s
s = s.replace(old, new)
p.write_text(s)
print("DEPLOY.md updated")
PY
source .venv/bin/activate; python3 -m unittest discover -s tests -p "test_*.py" 2>&1 | grep -E "^(Ran|OK|FAILED)|skipped"
```

### CLAUDE (2026-08-31T14:26:52.253Z)

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

