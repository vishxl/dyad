/**
 * Registry of vendor context packs — injected into the system prompt when
 * toggled. Each pack lives entirely in a local OpenViking server
 * (https://github.com/volcengine/OpenViking): a policy doc (framing, routing
 * table, mandatory rules) read deterministically by URI every message, plus
 * per-message semantic retrieval over the pack's declared scopes.
 *
 * Shared by the IPC schema (wire enum) and the chat-bar selector UI, so this
 * module must stay dependency-free.
 *
 * To add a vendor:
 * 1. author a policy md and write it into OpenViking (POST /api/v1/content/write),
 *    e.g. `viking://resources/<id>-policy/index.md`,
 * 2. ingest its corpus (scripts/openviking-ingest.sh <dir> viking://resources/<id>-docs),
 * 3. add its id to CONTEXT_PACK_IDS and an entry to CONTEXT_PACKS with the
 *    `vikingScopes` list covering every subtree the pack should retrieve from.
 *
 * To widen what a pack can reach (e.g. a newly migrated knowledge corpus):
 * add its resource subtree URI to that pack's `vikingScopes` — retrieval is
 * fanned out per scope and merged, so no code change is needed. A scope that
 * is missing from the OpenViking store fails open (logged, other scopes
 * unaffected) — see the canary integration test for the end-to-end check.
 */
export const CONTEXT_PACK_IDS = ["nextbillion", "stripi"] as const;

export type ContextPackId = (typeof CONTEXT_PACK_IDS)[number];

export const CONTEXT_PACKS: Record<
  ContextPackId,
  { name: string; policyUri: string; vikingScopes: string[] }
> = {
  nextbillion: {
    name: "NextBillion.ai",
    policyUri: "viking://resources/nextbillion-policy/index.md",
    // Curated knowledge only: vendor docs, the distilled application-domain
    // KB, and the distilled session layers (support tickets + per-project
    // digests). Raw session transcripts (`nextbillion-sessions/transcripts`
    // and `/chat-transcripts`) stay out — they are archival residue, and
    // retrieval is 6 hits per message, so noise out-ranks signal there.
    vikingScopes: [
      "viking://resources/nextbillion-docs",
      "viking://resources/nextbillion-app-kb",
      "viking://resources/nextbillion-sessions/support-tickets",
      "viking://resources/nextbillion-sessions/route-planner-monorepo",
      "viking://resources/nextbillion-sessions/mock-datasets",
      "viking://resources/nextbillion-sessions/gcp-cloud-run-deploy",
      "viking://resources/nextbillion-sessions/nb-routing-playground",
      "viking://resources/nextbillion-sessions/eta-predictor-model",
      "viking://resources/nextbillion-sessions/nbai-bookmarks-extension",
      "viking://resources/nextbillion-sessions/truck-routing-hos-app",
      "viking://resources/nextbillion-sessions/isochrone-geocode-demo",
    ],
  },
  stripi: {
    name: "NB Design",
    policyUri: "viking://resources/stripi-policy/index.md",
    // empty scopes — full spec is in the per-message policy; no retrieval
    vikingScopes: [],
  },
};

export const MAX_CONTEXT_PACKS = 2;
