import indexMd from "./nextbillion/index.md?raw";
import { CONTEXT_PACKS, type ContextPackId } from "./registry";

/**
 * Main-process-only loader for context-pack prompt blocks. Never import this
 * from renderer code: it pulls the distilled vendor documentation into the
 * bundle.
 */
const PACK_INDEX: Record<ContextPackId, string> = {
  nextbillion: indexMd,
};

/**
 * Returns the `<context-pack>` blocks for the given pack ids, or "" when none
 * are enabled. Unknown ids are ignored. One block per id, in registry order
 * (stable ordering keeps the prompt cacheable across identical toggles).
 */
export function getContextPackPromptBlock(
  packs?: readonly (ContextPackId | string)[],
): string {
  if (!packs || packs.length === 0) return "";
  const blocks = CONTEXT_PACK_IDS_ORDERED.filter((id) =>
    (packs as readonly string[]).includes(id),
  ).map(
    (id) =>
      `\n\n<context-pack vendor="${CONTEXT_PACKS[id].name}">\n${PACK_INDEX[id].trim()}\n</context-pack>`,
  );
  return blocks.join("");
}

const CONTEXT_PACK_IDS_ORDERED = Object.keys(CONTEXT_PACKS) as ContextPackId[];
