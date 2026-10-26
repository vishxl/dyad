#!/usr/bin/env node
/**
 * Ingest the distilled support-ticket knowledge into OpenViking so that
 * semantic retrieval actually surfaces it.
 *
 * The monolithic 74K digest embeds as one weak vector that never outranks the
 * store's small .overview.md/.abstract.md files — stored but unretrievable
 * (dead weight). So this splits the digest into per-theme lessons files under
 * <base>/themes/ and per-theme ticket-record files under <base>/tickets/,
 * plus an INDEX.md that enumerates every file and the ticket IDs it holds
 * (discoverability: agents only see what retrieval surfaces, then follow the
 * index). All writes go through content/write (wait:true). Small focused
 * files match how the rest of the store is indexed and win retrieval.
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

// Per theme, separate the distilled lessons from the `### Full ticket records`
// subsection (its `#### Ticket \`id\` — ...` entries). One file each: lessons
// are what retrieval should rank; ticket records are what the agent reads by
// URI once the index points at them. A 23K combined file embeds weakly (the
// same dead-weight physics that killed the monolithic digest).
const isFullRecords = (t) => /^Full ticket records/i.test(t);
const themes = [];
for (const s of sections) {
  const body = s.lines.join("\n").trim();
  if (body.length < 200) continue;
  const lessonLines = [];
  const ticketLines = [];
  let inTickets = false;
  for (const line of s.lines) {
    if (/^### Full ticket records/i.test(line)) {
      inTickets = true;
      continue;
    }
    (inTickets ? ticketLines : lessonLines).push(line);
  }
  if (isFullRecords(s.title)) {
    // Standalone full-records section (no distilled lessons above it)
    themes.push({ title: s.title, lessons: "", tickets: body });
  } else {
    themes.push({
      title: s.title,
      lessons: lessonLines.join("\n").trim(),
      tickets: ticketLines.join("\n").trim(),
    });
  }
}

const ticketIds = (ticketBody) => [
  ...new Set(
    (ticketBody.match(/^#### Ticket `([a-z0-9]+)`/gim) ?? []).map((m) =>
      m.replace(/^#### Ticket `/, "").replace(/`$/, ""),
    ),
  ),
];

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
  "102 real support tickets distilled into per-theme files. Each theme has a",
  "lessons file (failure modes + resolutions — start there) and, where the",
  "digest recorded them, a ticket-records file (verbatim threads).",
  "",
];

let written = 0;
const manifest = [];
for (const s of themes) {
  const file = slug(s.title);
  const ids = ticketIds(s.tickets);
  if (s.lessons && s.lessons.length > 200) {
    const body = `# ${s.title} — distilled lessons\n\n(from ${basename(digestPath)} — distilled from real support tickets)\n\n${s.lessons}\n`;
    await write(`${BASE}/themes/${file}.md`, body);
    console.log(`wrote themes/${file}.md (${body.length} chars)`);
    written++;
    manifest.push({
      theme: s.title,
      lessons: `themes/${file}.md`,
      tickets: ids.length ? `tickets/${file}.md` : null,
      ticketIds: ids,
    });
  }
  if (s.tickets && s.tickets.length > 200) {
    const body = `# ${s.title} — full ticket records\n\n(from ${basename(digestPath)} — verbatim ticket threads: ${ids.join(", ")})\n\n${s.tickets}\n`;
    await write(`${BASE}/tickets/${file}.md`, body);
    console.log(`wrote tickets/${file}.md (${body.length} chars)`);
    written++;
    const entry = manifest.find((m) => m.theme === s.title);
    if (entry) entry.tickets = `tickets/${file}.md`;
    else
      manifest.push({
        theme: s.title,
        lessons: null,
        tickets: `tickets/${file}.md`,
        ticketIds: ids,
      });
  }
}

// The index is the discoverability layer: agents only see URIs that retrieval
// surfaces, so the index must enumerate every theme/ticket file BY NAME —
// including the ticket IDs each records file holds.
for (const m of manifest) {
  indexLines.push(`## ${m.theme}`);
  if (m.lessons) indexLines.push(`- Lessons: ${m.lessons}`);
  if (m.tickets)
    indexLines.push(
      `- Ticket records: ${m.tickets} (${m.ticketIds.length} tickets${m.ticketIds.length ? `: ${m.ticketIds.slice(0, 12).join(", ")}${m.ticketIds.length > 12 ? ", …" : ""}` : ""})`,
    );
}
indexLines.push(
  "",
  "Read a theme's lessons file for the distilled rules; read its ticket-records",
  "file for the verbatim threads behind them. Ticket IDs are stable — cite them.",
);
await write(`${BASE}/themes/INDEX.md`, indexLines.join("\n") + "\n");
console.log(`wrote index; total ${written + 1} files`);
