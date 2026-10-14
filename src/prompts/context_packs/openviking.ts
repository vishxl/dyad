import log from "electron-log";
import { CONTEXT_PACKS, type ContextPackId } from "./registry";

/**
 * Main-process retrieval of vendor doc details from a local OpenViking server
 * (https://github.com/volcengine/OpenViking). Complements the static routing
 * table in content.ts: per message, semantically retrieve the relevant chunks
 * of the vendor's full documentation corpus.
 *
 * Fail-open: any failure (server down, timeout, error) logs and returns "" —
 * a chat must never hang or fail on the context database.
 */

const OPENVIKING_URL =
  process.env.DYAD_OPENVIKING_URL ?? "http://127.0.0.1:1933";
const OPENVIKING_API_KEY = process.env.DYAD_OPENVIKING_API_KEY;
const FIND_TIMEOUT_MS = 10_000;
const HITS_PER_PACK = 6;
const MAX_HIT_CHARS = 2000;

interface VikingFindHit {
  uri?: string;
  content?: string;
  content_text?: string;
  abstract?: string;
}

interface VikingFindResponse {
  status?: string;
  result?: {
    resources?: VikingFindHit[];
    memories?: VikingFindHit[];
    skills?: VikingFindHit[];
  };
  error?: { message?: string };
}

export async function getContextPackRetrievalBlock(
  packs: readonly (ContextPackId | string)[] | undefined,
  userPrompt: string,
): Promise<string> {
  if (!packs || packs.length === 0 || !userPrompt.trim()) return "";
  const blocks = await Promise.all(
    CONTEXT_PACK_IDS_ORDERED.filter((id) =>
      (packs as readonly string[]).includes(id),
    ).map((id) => retrievePackBlock(id, userPrompt)),
  );
  return blocks.join("");
}

const CONTEXT_PACK_IDS_ORDERED = Object.keys(CONTEXT_PACKS) as ContextPackId[];

async function retrievePackBlock(
  id: ContextPackId,
  userPrompt: string,
): Promise<string> {
  const vikingUri = CONTEXT_PACKS[id].vikingUri;
  if (!vikingUri) return "";
  try {
    const response = await fetch(`${OPENVIKING_URL}/api/v1/search/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(OPENVIKING_API_KEY ? { "X-API-Key": OPENVIKING_API_KEY } : {}),
      },
      body: JSON.stringify({
        query: userPrompt,
        target_uri: vikingUri,
        limit: HITS_PER_PACK,
        read_content: true,
      }),
      signal: AbortSignal.timeout(FIND_TIMEOUT_MS),
    });
    if (!response.ok) {
      log.warn(`openviking find for ${id} failed: HTTP ${response.status}`);
      return "";
    }
    const data = (await response.json()) as VikingFindResponse;
    if (data.status !== "ok") {
      log.warn(
        `openviking find for ${id} errored: ${data.error?.message ?? "unknown"}`,
      );
      return "";
    }
    const hits = [
      ...(data.result?.resources ?? []),
      ...(data.result?.memories ?? []),
      ...(data.result?.skills ?? []),
    ];
    const chunks = hits
      .map((hit) => {
        const content = (hit.content ?? hit.content_text ?? hit.abstract ?? "")
          .trim()
          .slice(0, MAX_HIT_CHARS);
        if (!content) return null;
        return hit.uri ? `--- ${hit.uri} ---\n${content}` : content;
      })
      .filter((c): c is string => c !== null);
    if (chunks.length === 0) return "";
    return `\n\n<context-retrieval vendor="${CONTEXT_PACKS[id].name}">\n${chunks.join("\n\n")}\n</context-retrieval>`;
  } catch (error) {
    log.warn(`openviking find for ${id} failed (fail-open)`, error);
    return "";
  }
}
