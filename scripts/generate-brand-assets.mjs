// Regenerates every raster brand asset from assets/brand/logo-source.png.
//   node scripts/generate-brand-assets.mjs
// Dev tooling only. Needs `sharp` (present transitively; otherwise `npm i --no-save sharp`)
// and, for .icns, macOS `iconutil`.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const out = (...p) => path.join(root, ...p);
const SOURCE = out("assets/brand/logo-source.png");

// The source has faint near-transparent noise around the mark: zero alpha below a floor, then trim.
const { data: raw, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
for (let i = 3; i < raw.length; i += 4) if (raw[i] < 12) raw[i] = 0;
const trimmed = await sharp(raw, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 1 })
  .png()
  .toBuffer();

// The mark scaled to fit `box` px, Lanczos.
const mark = (box) =>
  sharp(trimmed)
    .resize(box, box, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: "lanczos3",
    })
    .png()
    .toBuffer();

/** size x size canvas with the mark centred at `fraction` of the canvas. */
async function icon(size, { fraction = 0.84, background } = {}) {
  const box = Math.round(size * fraction);
  const base = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });
  return base
    .composite([{ input: await mark(box), gravity: "center" }])
    .png()
    .toBuffer();
}

/** macOS-style tile: rounded white square (824/1024) with the mark inside. */
async function macTile(size) {
  const tile = Math.round(size * (824 / 1024));
  const radius = Math.round(tile * 0.225);
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}"><rect width="${tile}" height="${tile}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
  );
  const tilePng = await sharp(mask).png().toBuffer();
  const layer = await sharp(tilePng)
    .composite([
      { input: await mark(Math.round(tile * 0.62)), gravity: "center" },
    ])
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: layer, gravity: "center" }])
    .png()
    .toBuffer();
}

/** Minimal ICO writer: PNG-compressed entries (valid for Vista+ and all browsers). */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = 6 + 16 * entries.length;
  const dirs = [];
  for (const { size, data } of entries) {
    const d = Buffer.alloc(16);
    d.writeUInt8(size >= 256 ? 0 : size, 0);
    d.writeUInt8(size >= 256 ? 0 : size, 1);
    d.writeUInt16LE(1, 4);
    d.writeUInt16LE(32, 6);
    d.writeUInt32LE(data.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += data.length;
    dirs.push(d);
  }
  return Buffer.concat([header, ...dirs, ...entries.map((e) => e.data)]);
}
const icoFor = async (sizes, opts) =>
  ico(
    await Promise.all(
      sizes.map(async (size) => ({ size, data: await icon(size, opts) })),
    ),
  );

const write = (rel, data) => {
  fs.mkdirSync(path.dirname(out(rel)), { recursive: true });
  fs.writeFileSync(out(rel), data);
  console.log("wrote", rel, `${(data.length / 1024).toFixed(1)} KB`);
};

// Desktop packaging + in-app logo.
write("assets/icon/logo.png", await icon(1024));
write(
  "assets/icon/logo.ico",
  await icoFor([16, 32, 48, 64, 128, 256], { fraction: 0.92 }),
);
write("assets/logo.png", await icon(256, { fraction: 0.96 }));

// macOS .icns via iconutil.
if (process.platform === "darwin") {
  const set =
    fs.mkdtempSync(path.join(os.tmpdir(), "brand-")) + "/logo.iconset";
  fs.mkdirSync(set);
  for (const [name, px] of [
    ["16x16", 16],
    ["16x16@2x", 32],
    ["32x32", 32],
    ["32x32@2x", 64],
    ["128x128", 128],
    ["128x128@2x", 256],
    ["256x256", 256],
    ["256x256@2x", 512],
    ["512x512", 512],
    ["512x512@2x", 1024],
  ]) {
    fs.writeFileSync(path.join(set, `icon_${name}.png`), await macTile(px));
  }
  execFileSync("iconutil", [
    "-c",
    "icns",
    set,
    "-o",
    out("assets/icon/logo.icns"),
  ]);
  console.log("wrote assets/icon/logo.icns");
} else console.warn("skipped .icns (needs macOS iconutil)");

// Hosted web UI favicon set (root public/ dir is served at /).
write("public/favicon.ico", await icoFor([16, 32, 48], { fraction: 0.94 }));
write(
  "public/apple-touch-icon.png",
  await icon(180, {
    fraction: 0.72,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  }),
);

// Generated-app scaffold favicon.
write(
  "scaffold/public/favicon.ico",
  await icoFor([16, 32, 48], { fraction: 0.94 }),
);
