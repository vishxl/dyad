/**
 * Registry of vendor context packs — injected into the system prompt when
 * toggled. Each pack has a small static routing-table block compiled into the
 * bundle (content.ts) and optionally retrieves detailed docs per message from
 * a local OpenViking server (openviking.ts).
 *
 * Shared by the IPC schema (wire enum) and the chat-bar selector UI, so this
 * module must stay dependency-free.
 *
 * To add a vendor:
 * 1. create `context_packs/<id>/index.md` (routing table + conventions),
 * 2. add its id to CONTEXT_PACK_IDS and an entry to CONTEXT_PACKS,
 * 3. add its static block import in content.ts,
 * 4. ingest its full docs into OpenViking (scripts/openviking-ingest.sh) and
 *    set `vikingUri` — optional; without it the pack runs on the static block
 *    alone.
 */
export const CONTEXT_PACK_IDS = ["nextbillion"] as const;

export type ContextPackId = (typeof CONTEXT_PACK_IDS)[number];

export const CONTEXT_PACKS: Record<
  ContextPackId,
  { name: string; vikingUri?: string }
> = {
  nextbillion: {
    name: "NextBillion.ai",
    vikingUri: "viking://resources/nextbillion-docs",
  },
};

export const MAX_CONTEXT_PACKS = 2;
