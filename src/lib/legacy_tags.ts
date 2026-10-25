// Chats stored before the rebrand (and models that still emit the original
// tag dialect) use <dyad-*> tags. Everything downstream only knows
// <nextbillion-*>, so legacy text is rewritten at the boundary.
export function normalizeLegacyTags(text: string): string {
  if (!text.includes("dyad")) return text;
  return text
    .replace(/<(\/?)dyad-/g, "<$1nextbillion-")
    .replace(/＜dyad/g, "＜nextbillion");
}
