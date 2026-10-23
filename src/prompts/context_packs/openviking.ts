import log from "electron-log";
import { CONTEXT_PACKS, type ContextPackId } from "./registry";

/**
 * Main-process context injection from a local OpenViking server
 * (https://github.com/volcengine/OpenViking). Two access patterns over one
 * store:
 * - policy: deterministic read-by-URI every message (routing table + mandatory
 *   rules that retrieval cannot guarantee, e.g. "never use competitor basemaps"),
 * - retrieval: per-message semantic find over the vendor's full docs corpus
 *   (resources + memories hits), plus a skills find (/api/v1/skills/find) —
 *   skills live outside resource URIs so the plain find never surfaces them.
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

interface VikingReadResponse {
  status?: string;
  result?: string;
}

interface VikingSkillHit {
  root_uri?: string;
  skill_md_uri?: string;
  description?: string;
  abstract?: string;
}

interface VikingSkillsFindResponse {
  status?: string;
  result?: { skills?: VikingSkillHit[] };
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

/** Deterministic per-message read of each enabled pack's policy doc. */
export async function getPolicyBlock(
  packs: readonly (ContextPackId | string)[] | undefined,
): Promise<string> {
  if (!packs || packs.length === 0) return "";
  const blocks = await Promise.all(
    CONTEXT_PACK_IDS_ORDERED.filter((id) =>
      (packs as readonly string[]).includes(id),
    ).map((id) => readPolicyBlock(id)),
  );
  return blocks.join("");
}

/** Both context parts in one call, for the injection sites. */
export async function getContextPackBlocks(
  packs: readonly (ContextPackId | string)[] | undefined,
  userPrompt: string,
): Promise<{ policy: string; retrieval: string }> {
  const [policy, retrieval] = await Promise.all([
    getPolicyBlock(packs),
    getContextPackRetrievalBlock(packs, userPrompt),
  ]);
  return { policy, retrieval };
}

const CONTEXT_PACK_IDS_ORDERED = Object.keys(CONTEXT_PACKS) as ContextPackId[];

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(OPENVIKING_API_KEY ? { "X-API-Key": OPENVIKING_API_KEY } : {}),
  };
}

async function readPolicyBlock(id: ContextPackId): Promise<string> {
  const policyUri = CONTEXT_PACKS[id].policyUri;
  try {
    const response = await fetch(
      `${OPENVIKING_URL}/api/v1/content/read?uri=${encodeURIComponent(policyUri)}&raw=true`,
      {
        headers: authHeaders(),
        signal: AbortSignal.timeout(FIND_TIMEOUT_MS),
      },
    );
    if (!response.ok) {
      log.warn(
        `openviking policy read for ${id} failed: HTTP ${response.status}`,
      );
      return "";
    }
    const data = (await response.json()) as VikingReadResponse;
    if (data.status !== "ok" || typeof data.result !== "string") {
      log.warn(`openviking policy read for ${id} errored`);
      return "";
    }
    const content = data.result.trim();
    if (!content) return "";
    return `\n\n<context-policy vendor="${CONTEXT_PACKS[id].name}">\n${content}\n</context-policy>`;
  } catch (error) {
    log.warn(`openviking policy read for ${id} failed (fail-open)`, error);
    return "";
  }
}

/** Skills live outside resource URIs (e.g. viking://user/default/skills), so
 * the plain search/find never surfaces them — query the skills index directly.
 * Fail-open independently so a skills hiccup never blocks resource retrieval. */
async function findSkillHits(
  id: ContextPackId,
  userPrompt: string,
): Promise<VikingFindHit[]> {
  try {
    const response = await fetch(`${OPENVIKING_URL}/api/v1/skills/find`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ query: userPrompt, limit: 3 }),
      signal: AbortSignal.timeout(FIND_TIMEOUT_MS),
    });
    if (!response.ok) {
      log.warn(
        `openviking skills find for ${id} failed: HTTP ${response.status}`,
      );
      return [];
    }
    const data = (await response.json()) as VikingSkillsFindResponse;
    if (data.status !== "ok") {
      log.warn(
        `openviking skills find for ${id} errored: ${data.error?.message ?? "unknown"}`,
      );
      return [];
    }
    const hits: VikingFindHit[] = [];
    for (const hit of data.result?.skills ?? []) {
      const content = (hit.abstract ?? "").trim().slice(0, MAX_HIT_CHARS);
      if (content)
        hits.push({ uri: hit.skill_md_uri ?? hit.root_uri, content });
    }
    return hits;
  } catch (error) {
    log.warn(`openviking skills find for ${id} failed (fail-open)`, error);
    return [];
  }
}

async function retrievePackBlock(
  id: ContextPackId,
  userPrompt: string,
): Promise<string> {
  const vikingUri = CONTEXT_PACKS[id].vikingUri;
  if (!vikingUri) return "";
  try {
    const [response, skillHits] = await Promise.all([
      fetch(`${OPENVIKING_URL}/api/v1/search/find`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          query: userPrompt,
          target_uri: vikingUri,
          limit: HITS_PER_PACK,
          read_content: true,
        }),
        signal: AbortSignal.timeout(FIND_TIMEOUT_MS),
      }),
      findSkillHits(id, userPrompt),
    ]);
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
      ...skillHits,
      ...(data.result?.resources ?? []),
      ...(data.result?.memories ?? []),
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
