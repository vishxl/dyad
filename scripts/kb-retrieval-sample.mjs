#!/usr/bin/env node
/**
 * Statistical retrievability check for an ingested OpenViking subtree.
 *
 * Storage-level checks ("the files exist", read-by-URI works) do not prove an
 * agent can reach the content — the 74K ticket digest was stored but never
 * surfaced in semantic find. At millions of records, per-record canaries are
 * impossible, so this samples verbatim spans from the SOURCE corpus and runs
 * each through the same find API the builder uses, scoped to the subtree.
 * Fails (exit 1) when the hit rate drops below --threshold.
 *
 * Usage:
 *   node scripts/kb-retrieval-sample.mjs <viking-url> <scope-uri> <source-file...>
 *        [--sample N] [--threshold F] [--span CHARS]
 *
 *   viking-url   e.g. http://127.0.0.1:1933 (local; for the VM, scp this there)
 *   scope-uri    e.g. viking://resources/nextbillion-sessions/support-tickets
 *   source-file  one or more corpus files the subtree was ingested from
 *                (md/json/csv — any text; spans are picked verbatim from it)
 *
 * Examples:
 *   node scripts/kb-retrieval-sample.mjs http://127.0.0.1:1933 \
 *     viking://resources/nextbillion-sessions/support-tickets \
 *     context/nextbillion-sessions/digests/nb-support-tickets-distilled.md
 */
import { readFileSync } from "node:fs";
import process from "node:process";

const args = process.argv.slice(2);
const positional = [];
let sampleN = 12;
let threshold = 0.8;
let spanChars = 120;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--sample") sampleN = Number(args[++i]);
  else if (args[i] === "--threshold") threshold = Number(args[++i]);
  else if (args[i] === "--span") spanChars = Number(args[++i]);
  else positional.push(args[i]);
}

const [url, scopeUri, ...sources] = positional;
if (!url || !scopeUri || sources.length === 0) {
  console.error(
    "usage: kb-retrieval-sample.mjs <viking-url> <scope-uri> <source-file...> [--sample N] [--threshold F] [--span CHARS]",
  );
  process.exit(2);
}

// Gather verbatim spans: split each source into chunks, keep chunks with
// enough alphanumeric content to embed meaningfully, pick N at random.
const chunks = [];
for (const path of sources) {
  const text = readFileSync(path, "utf8");
  for (let i = 0; i < text.length; i += spanChars * 4) {
    const span = text.slice(i, i + spanChars).trim();
    if (span.length < 60) continue;
    if ((span.match(/[a-zA-Z0-9]/g) ?? []).length < span.length * 0.3) continue;
    chunks.push(span);
  }
}
if (chunks.length === 0) {
  console.error("no usable spans found in the source file(s)");
  process.exit(2);
}

// Deterministic shuffle so a re-run on the same corpus samples the same spans
// (comparable run-to-run), while still covering different chunks each ingest.
let seed = 42;
const rand = () =>
  (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let i = chunks.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [chunks[i], chunks[j]] = [chunks[j], chunks[i]];
}
const picked = chunks.slice(0, sampleN);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let hits = 0;
const misses = [];
for (const span of picked) {
  // Query = a middle slice of the span: verbatim content, not the chunk edges.
  const q = span.slice(
    Math.max(0, Math.floor((span.length - 80) / 2)),
    80 + Math.max(0, Math.floor((span.length - 80) / 2)),
  );
  let uris = [];
  try {
    const res = await fetch(`${url}/api/v1/search/find`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q,
        limit: 6,
        target_uri: scopeUri,
        read_content: false,
      }),
      signal: AbortSignal.timeout(30_000),
    });
    const data = await res.json();
    uris = (data?.result?.resources ?? []).map((h) => h.uri ?? "");
  } catch (e) {
    console.error(`find failed for span "${q.slice(0, 40)}…": ${e.message}`);
  }
  // A hit is anything from the declared scope (any file in the subtree — the
  // record's content surfacing via its own file, an overview, or an abstract
  // all prove the subtree is indexed and ranked, not dead weight).
  const hit = uris.some((u) => u.startsWith(scopeUri));
  if (hit) hits++;
  else misses.push(q.slice(0, 60));
  process.stdout.write(hit ? "." : "x");
  await sleep(500); // be gentle to the embedding endpoint
}

console.log(`\n${hits}/${picked.length} spans surfaced from ${scopeUri}`);
if (misses.length) {
  console.log("missed spans (first 60 chars each):");
  for (const m of misses) console.log(`  - ${m}`);
}
if (hits / picked.length < threshold) {
  console.error(
    `FAIL: hit rate ${(hits / picked.length).toFixed(2)} < threshold ${threshold} — the subtree is (partially) dead weight; do not report this ingest as verified`,
  );
  process.exit(1);
}
console.log("PASS");
