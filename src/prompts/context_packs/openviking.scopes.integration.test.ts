import { describe, expect, it, beforeAll } from "vitest";
import { CONTEXT_PACKS, CONTEXT_PACK_IDS } from "./registry";
import { getContextPackRetrievalBlock } from "./openviking";

/**
 * Canary integration test: every declared pack scope must actually return
 * content through the real retrieval path (real OpenViking on 127.0.0.1:1933).
 *
 * Why this exists: a scope can be present in the registry while invisible to
 * the agent — a subtree missing from the OpenViking store, a renamed path,
 * a migration that never ran. Storage-level checks ("the files exist on
 * disk") do not catch that; only a find through the same API the chat path
 * calls does. Each scope therefore gets a canary: a query whose top hits can
 * only come from that scope's own content.
 *
 * Requires a running OpenViking server (local dev or the deployed VM
 * pattern: `openviking-server` on 127.0.0.1:1933). Skips when absent so the
 * unit project stays green without one; run it before claiming any KB
 * migration "verified".
 */
const OPENVIKING_URL =
  process.env.NEXTBILLION_OPENVIKING_URL ?? "http://127.0.0.1:1933";

async function openVikingAvailable(): Promise<boolean> {
  try {
    const response = await fetch(
      `${OPENVIKING_URL}/api/v1/content/read?uri=${encodeURIComponent(
        CONTEXT_PACKS.nextbillion.policyUri,
      )}&raw=true`,
      { signal: AbortSignal.timeout(2_000) },
    );
    return response.ok;
  } catch {
    return false;
  }
}

/** One canary per scope: a query + a substring only that scope's content has. */
const SCOPE_CANARIES: Record<string, { query: string; mustContain: string }> = {
  "viking://resources/nextbillion-docs": {
    query: "how to configure the maps sdk",
    mustContain: "maps",
  },
  "viking://resources/nextbillion-app-kb": {
    query: "common failures and durable lessons",
    mustContain: "failures",
  },
  "viking://resources/nextbillion-sessions/support-tickets": {
    query: "support ticket themes truck size coordinate order",
    mustContain: "support-ticket",
  },
  "viking://resources/nextbillion-sessions/route-planner-monorepo": {
    query: "route planner monorepo architecture",
    mustContain: "route-planner-monorepo",
  },
  "viking://resources/nextbillion-sessions/mock-datasets": {
    query: "synthetic mock datasets postoffice",
    mustContain: "mock-datasets",
  },
  "viking://resources/nextbillion-sessions/gcp-cloud-run-deploy": {
    query: "cloud run deployment terraform",
    mustContain: "gcp-cloud-run-deploy",
  },
  "viking://resources/nextbillion-sessions/nb-routing-playground": {
    query: "routing playground markers reverse geocoding",
    mustContain: "nb-routing-playground",
  },
  "viking://resources/nextbillion-sessions/eta-predictor-model": {
    query: "eta predictor model training",
    mustContain: "eta-predictor-model",
  },
  "viking://resources/nextbillion-sessions/nbai-bookmarks-extension": {
    query: "bookmarks chrome extension clustering",
    mustContain: "nbai-bookmarks-extension",
  },
  "viking://resources/nextbillion-sessions/truck-routing-hos-app": {
    query: "truck routing hours of service hos",
    mustContain: "truck-routing-hos-app",
  },
  "viking://resources/nextbillion-sessions/isochrone-geocode-demo": {
    query: "isochrone geocode demo deploy",
    mustContain: "isochrone-geocode-demo",
  },
};

describe("context pack scopes reach the live OpenViking store", () => {
  let vikingUp = false;
  beforeAll(async () => {
    vikingUp = await openVikingAvailable();
  });

  it.skipIf(process.env.NEXTBILLION_SKIP_VIKING === "1")(
    "every canary is retrievable through the real find path",
    { timeout: 120_000 },
    async () => {
      if (!vikingUp) {
        console.warn(
          "OpenViking not reachable — scope canaries skipped. Start openviking-server to verify KB reachability.",
        );
        return;
      }
      for (const id of CONTEXT_PACK_IDS) {
        const scopes = CONTEXT_PACKS[id].vikingScopes;
        if (scopes.length === 0) continue;
        for (const scope of scopes) {
          const canary = SCOPE_CANARIES[scope];
          expect(
            canary,
            `no canary registered for scope ${scope} — add one to SCOPE_CANARIES when adding the scope to the registry`,
          ).toBeDefined();
          const block = await getContextPackRetrievalBlock([id], canary.query);
          // The canary must surface its own scope's content: the merged
          // retrieval block contains a hit URI under that scope.
          expect(
            block,
            `scope ${scope} returned nothing — is the subtree ingested into OpenViking?`,
          ).not.toBe("");
          const uriMarker = scope.split("/").pop();
          expect(
            block,
            `scope ${scope} did not surface its own content for the canary query — the subtree is likely missing from the store (dead scope)`,
          ).toContain(uriMarker);
        }
      }
    },
  );

  it.skipIf(process.env.NEXTBILLION_SKIP_VIKING === "1")(
    "the distilled support-ticket themes surface end to end",
    { timeout: 30_000 },
    async () => {
      if (!vikingUp) {
        console.warn("OpenViking not reachable — canary skipped.");
        return;
      }
      const block = await getContextPackRetrievalBlock(
        ["nextbillion"],
        "most common support ticket failure patterns and their resolutions",
      );
      // Themes that exist only in the migrated support-tickets subtree —
      // not in vendor docs and not guessable. If these come back, the
      // migrated corpus is genuinely reachable by the chat path.
      expect(block).toMatch(/truck|support-ticket/i);
    },
  );

  it.skipIf(process.env.NEXTBILLION_SKIP_VIKING === "1")(
    "add-memory lessons reach the builder (memories ride only unscoped finds)",
    { timeout: 30_000 },
    async () => {
      if (!vikingUp) {
        console.warn("OpenViking not reachable — canary skipped.");
        return;
      }
      // History: durable lessons stored via add-memory (runbook §13) land in
      // viking://user/default/memories, which OpenViking attaches to a find
      // response ONLY on unscoped finds — a target_uri-scoped find returns
      // resources but never memories. retrievePackBlock therefore runs one
      // unscoped find per pack and merges result.memories in. This canary
      // fails if that merge regresses and the lessons go dead-weight again.
      const block = await getContextPackRetrievalBlock(
        ["nextbillion"],
        "what truck_size parameter order and units must the routing request use",
      );
      expect(
        block,
        "add-memory lessons not in the retrieval block — the unscoped memory find was dropped or regressed",
      ).toMatch(/viking:\/\/user\/default\/memories\//);
    },
  );

  it.skipIf(process.env.NEXTBILLION_SKIP_VIKING === "1")(
    "the distilled ticket digest is retrievable, not just stored",
    { timeout: 60_000 },
    async () => {
      if (!vikingUp) {
        console.warn("OpenViking not reachable — canary skipped.");
        return;
      }
      // History: the 74K monolithic digest was written into the store but
      // never surfaced in find — its single embedding drowned among the
      // store's small files, so it was dead weight despite "being ingested".
      // The fix splits it into per-theme files under themes/ (small focused
      // docs are what the index ranks). This canary queries the
      // support-tickets scope directly and fails if the theme files stop
      // surfacing, i.e. if a future re-ingest reverts to one big file.
      const response = await fetch(`${OPENVIKING_URL}/api/v1/search/find`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query:
            "support team triage routing-API issues biggest pain points severity frequency resolutions",
          target_uri: "viking://resources/nextbillion-sessions/support-tickets",
          limit: 6,
          read_content: false,
        }),
        signal: AbortSignal.timeout(30_000),
      });
      const data = (await response.json()) as {
        result?: { resources?: { uri?: string }[] };
      };
      const uris = (data.result?.resources ?? []).map((h) => h.uri ?? "");
      expect(
        uris.join("\n"),
        "distilled ticket themes/ files no longer surface in the support-tickets scope — the KB update is dead weight again",
      ).toMatch(/\/themes\//);
    },
  );
});
