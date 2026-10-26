#!/usr/bin/env node
/**
 * Ingest the distilled support-ticket knowledge into OpenViking so that
 * semantic retrieval actually surfaces it.
 *
 * The monolithic 74K digest embeds as one weak vector that never outranks the
 * store's small .overview.md/.abstract.md files — stored but unretrievable
 * (dead weight). So this splits the digest on its `## ` theme headings into
 * small per-theme files under <base>/themes/, plus an index file, and writes
 * each with content/write (wait:true). Small focused files match how the
 * rest of the store is indexed and win retrieval.
 *
 * Usage: node scripts/ingest-support-tickets-kb.mjs <viking-url> [digest-path]
 *   viking-url  e.g. http://127.0.0.1:1933 (local) — for the VM, scp this
 *               script + the digest there and run against its local endpoint.
 *   digest-path defaults to context/nextbillion-sessions/digests/nb-support-tickets-distilled.md
 */
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import process from "node:process";

const url = process.argv[2] ?? "http://127.0.0.1:1933";
const digestPath =
  process.argv[3] ??
  "context/nextbillion-sessions/digests/nb-support-tickets-distilled.md";
const BASE = "viking://resources/nextbillion-sessions/support-tickets";

const content = readFileSync(digestPath, "utf8");
if (content.length < 10_000) {
  console.error(
    `digest at ${digestPath} looks truncated (${content.length} chars)`,
  );
  process.exit(1);
}

// Split on `## ` headings; everything before the first is the preamble.
const lines = content.split("\n");
const sections = [];
let current = { title: "overview", lines: [] };
for (const line of lines) {
  const m = line.match(/^## (.+)$/);
  if (m) {
    sections.push(current);
    current = { title: m[1], lines: [] };
  } else {
    current.lines.push(line);
  }
}
sections.push(current);

// Keep the substantive theme sections; drop the "Full ticket records" raw
// dumps (already in the store as individual per-cluster files) and empty ones.
const isFullRecords = (t) => /^Full ticket records/i.test(t);
const themes = sections.filter(
  (s) => !isFullRecords(s.title) && s.lines.join("").trim().length > 200,
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function write(uri, body) {
  const res = await fetch(`${url}/api/v1/content/write`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri, content: body, wait: true }),
  });
  const data = await res.json();
  if (data.status !== "ok") {
    // A previously interrupted run can leave the resource locked (409 CONFLICT);
    // OpenViking releases it after its busy timeout, so back off and retry.
    if (res.status === 409) {
      for (let i = 0; i < 5; i++) {
        await sleep(20_000);
        const retry = await fetch(`${url}/api/v1/content/write`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uri, content: body, wait: true }),
        });
        const retryData = await retry.json();
        if (retryData.status === "ok") return retryData.result?.uri ?? uri;
      }
      throw new Error(`write ${uri}: still CONFLICT after retries`);
    }
    throw new Error(
      `write ${uri}: ${res.status} ${JSON.stringify(data).slice(0, 200)}`,
    );
  }
  return data.result?.uri ?? uri;
}

const slug = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .replace(/-$/, "");

const indexLines = [
  "# Support-ticket distilled knowledge — index",
  "",
  "Per-theme files under themes/ hold the distilled lessons from 102 real",
  "support tickets, grouped by product area. Each theme file is self-contained:",
  "the failure mode, why it happens, and how it was resolved.",
  "",
  ...themes.map((s) => `- themes/${slug(s.title)}.md — ${s.title}`),
];

let written = 0;
for (const s of themes) {
  const body = `# ${s.title}\n\n(from ${basename(digestPath)} — distilled from real support tickets)\n\n${s.lines.join("\n").trim()}\n`;
  const uri = await write(`${BASE}/themes/${slug(s.title)}.md`, body);
  console.log(`wrote ${uri} (${body.length} chars)`);
  written++;
}
await write(`${BASE}/themes/INDEX.md`, indexLines.join("\n") + "\n");
console.log(`wrote index; total ${written + 1} files`);
