// Side-effect import for plain Node entry points (scripts, vite configs): copies
// legacy DYAD_* variables to NEXTBILLION_* when the new name is unset, so deploy
// env files written before the rebrand keep working. Mirrors applyLegacyEnv() in src/brand.ts.
for (const key of Object.keys(process.env)) {
  if (!key.startsWith("DYAD_")) continue;
  const next = `NEXTBILLION_${key.slice(5)}`;
  process.env[next] ??= process.env[key];
}
