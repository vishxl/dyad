// Fails when the legacy product name appears where it must not.
//   node scripts/check-branding.mjs                      # tracked files
//   node scripts/check-branding.mjs --build <dir> [...]  # also scan build output (content + file names)
//
// Allowlist: branding-allowlist.txt, one rule per line:
//   <glob> [:: <regex>]  # justification
// A glob alone allows every hit in matching files; with `:: regex` only hits whose
// matched token (the surrounding non-space run) matches the regex are allowed.
// Prefix a rule with `build:` to apply it to build output instead of tracked files.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
process.chdir(root);

const NAME = /dyad/i;
const TOKEN = /\S*dyad\S*/gi;

const args = process.argv.slice(2);
const buildDirs = [];
for (let i = 0; i < args.length; i++)
  if (args[i] === "--build") buildDirs.push(args[++i]);

function globToRegex(glob) {
  const esc = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "\u0000")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0000/g, ".*");
  return new RegExp(`^${esc}$`);
}

const rules = { src: [], build: [] };
for (const raw of fs
  .readFileSync("branding-allowlist.txt", "utf8")
  .split("\n")) {
  const line = raw.replace(/#.*$/, "").trim();
  if (!line) continue;
  const kind = line.startsWith("build:") ? "build" : "src";
  const body = line.replace(/^build:/, "");
  const [glob, re] = body.split(/\s+::\s+/);
  rules[kind].push({
    glob: globToRegex(glob.trim()),
    re: re ? new RegExp(re.trim(), "i") : null,
  });
}

function violations(rel, text, kind) {
  if (!NAME.test(text)) return [];
  const applicable = rules[kind].filter((r) => r.glob.test(rel));
  if (applicable.some((r) => !r.re)) return [];
  const out = [];
  const lines = text.split("\n");
  lines.forEach((l, i) => {
    if (!NAME.test(l)) return;
    for (const m of l.match(TOKEN) ?? []) {
      if (applicable.some((r) => r.re.test(m))) continue;
      out.push(`${rel}:${i + 1}: ${m.slice(0, 120)}`);
    }
  });
  return out;
}

const failures = [];

const tracked = execSync("git ls-files -z", { maxBuffer: 1e9 })
  .toString()
  .split("\0")
  .filter(Boolean);
for (const f of tracked) {
  if (NAME.test(f) && !rules.src.some((r) => !r.re && r.glob.test(f)))
    failures.push(`${f}: file name`);
  let buf;
  try {
    buf = fs.readFileSync(f);
  } catch {
    continue;
  }
  if (buf.includes(0)) continue;
  failures.push(...violations(f, buf.toString("utf8"), "src"));
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
for (const dir of buildDirs) {
  for (const p of walk(dir)) {
    const rel = path.relative(dir, p);
    if (NAME.test(rel) && !rules.build.some((r) => !r.re && r.glob.test(rel)))
      failures.push(`build:${rel}: file name`);
    const buf = fs.readFileSync(p);
    if (buf.includes(0)) continue;
    failures.push(
      ...violations(rel, buf.toString("utf8"), "build").map(
        (v) => `build:${v}`,
      ),
    );
  }
}

if (failures.length) {
  console.error(`check-branding: ${failures.length} unallowed occurrence(s)`);
  console.error(failures.slice(0, 200).join("\n"));
  if (failures.length > 200)
    console.error(`... and ${failures.length - 200} more`);
  process.exit(1);
}
console.log(
  `check-branding: OK (${tracked.length} tracked files${buildDirs.length ? `, ${buildDirs.length} build dir(s)` : ""})`,
);
