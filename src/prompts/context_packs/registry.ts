/**
 * Registry of vendor context packs — injected into the system prompt when
 * toggled. Each pack lives entirely in a local OpenViking server
 * (https://github.com/volcengine/OpenViking): a policy doc (framing, routing
 * table, mandatory rules) read deterministically by URI every message, plus
 * per-message semantic retrieval over the vendor's full docs corpus.
 *
 * Shared by the IPC schema (wire enum) and the chat-bar selector UI, so this
 * module must stay dependency-free.
 *
 * To add a vendor:
 * 1. author a policy md and write it into OpenViking (POST /api/v1/content/write),
 *    e.g. `viking://resources/<id>-policy/index.md`,
 * 2. ingest its full docs corpus (scripts/openviking-ingest.sh <dir>
 *    viking://resources/<id>-docs),
 * 3. add its id to CONTEXT_PACK_IDS and an entry to CONTEXT_PACKS.
 */
export const CONTEXT_PACK_IDS = ["nextbillion", "stripi"] as const;

export type ContextPackId = (typeof CONTEXT_PACK_IDS)[number];

export const CONTEXT_PACKS: Record<
  ContextPackId,
  { name: string; policyUri: string; vikingUri?: string }
> = {
  nextbillion: {
    name: "NextBillion.ai",
    policyUri: "viking://resources/nextbillion-policy/index.md",
    vikingUri: "viking://resources/nextbillion-docs",
  },
  stripi: {
    name: "Stripi Design",
    policyUri: "viking://resources/stripi-policy/index.md",
    // no vikingUri — full spec is in the per-message policy; no retrieval
  },
};

export const MAX_CONTEXT_PACKS = 2;
