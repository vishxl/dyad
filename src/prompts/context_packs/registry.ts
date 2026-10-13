/**
 * Registry of vendor context packs — distilled API references injected into the
 * system prompt when toggled. Shared by the IPC schema (wire enum) and the
 * chat-bar selector UI, so this module must stay dependency-free.
 *
 * To add a vendor: create `context_packs/<id>/index.md`, add its id here, and
 * add an entry to the content loader in content.ts.
 */
export const CONTEXT_PACK_IDS = ["nextbillion"] as const;

export type ContextPackId = (typeof CONTEXT_PACK_IDS)[number];

export const CONTEXT_PACKS: Record<ContextPackId, { name: string }> = {
  nextbillion: { name: "NextBillion.ai" },
};

export const MAX_CONTEXT_PACKS = 2;
