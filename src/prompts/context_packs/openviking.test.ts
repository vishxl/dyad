import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getContextPackBlocks,
  getContextPackRetrievalBlock,
  getPolicyBlock,
} from "./openviking";
import { CONTEXT_PACKS } from "./registry";

const okEnvelope = (resources: unknown[]) => ({
  ok: true,
  status: 200,
  json: async () => ({ status: "ok", result: { resources } }),
});

const okRead = (content: string) => ({
  ok: true,
  status: 200,
  json: async () => ({ status: "ok", result: content }),
});

/** Stub fetch for the multi-scope fan-out: routes by URL, echoing each
 * search/find's target_uri back in the hit so tests can assert per-scope
 * fan-out. */
function stubScopedFind(
  hitsForScope: (targetUri: string) => unknown[],
  policyContent = "# policy",
) {
  return vi.fn().mockImplementation((url: string | URL, init?: RequestInit) => {
    const u = String(url);
    if (u.includes("/search/find")) {
      const target = JSON.parse(String(init?.body)).target_uri as string;
      return Promise.resolve(okEnvelope(hitsForScope(target)));
    }
    return Promise.resolve(okRead(policyContent));
  });
}

describe("getContextPackRetrievalBlock (OpenViking)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns empty for no packs or empty prompt", async () => {
    expect(await getContextPackRetrievalBlock(undefined, "route app")).toBe("");
    expect(await getContextPackRetrievalBlock(["nextbillion"], "  ")).toBe("");
  });

  it("wraps retrieved hits with the vendor tag", async () => {
    vi.stubGlobal(
      "fetch",
      stubScopedFind(() => [
        {
          uri: "viking://resources/nextbillion-docs/optimization/x.md",
          content: "POST /optimization/v2 params...",
        },
      ]),
    );
    const block = await getContextPackRetrievalBlock(
      ["nextbillion"],
      "optimize delivery stops",
    );
    expect(block).toContain('<context-retrieval vendor="NextBillion.ai">');
    expect(block).toContain("POST /optimization/v2");
  });

  it("fans out a find per declared scope and merges results", async () => {
    const fetchMock = vi.fn(
      stubScopedFind((target) =>
        target.includes("nextbillion-docs")
          ? [
              {
                uri: "viking://resources/nextbillion-docs/a.md",
                score: 0.9,
                content: "docs hit",
              },
            ]
          : target.includes("support-tickets")
            ? [
                {
                  uri: "viking://resources/nextbillion-sessions/support-tickets/b.md",
                  score: 0.95,
                  content: "ticket hit",
                },
              ]
            : [],
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const block = await getContextPackRetrievalBlock(["nextbillion"], "q");
    // One find per declared scope
    const findBodies = fetchMock.mock.calls
      .map((c) => String(c[0]))
      .filter((u) => u.includes("/search/find"))
      .map(
        (_, i) =>
          JSON.parse(
            fetchMock.mock.calls.filter((c) =>
              String(c[0]).includes("/search/find"),
            )[i][1].body,
          ).target_uri,
      );
    expect(findBodies).toContain("viking://resources/nextbillion-docs");
    expect(findBodies).toContain(
      "viking://resources/nextbillion-sessions/support-tickets",
    );
    // Merged, score-ordered: the 0.95 ticket hit outranks the 0.9 docs hit
    const ticketIdx = block.indexOf("ticket hit");
    const docsIdx = block.indexOf("docs hit");
    expect(ticketIdx).toBeGreaterThan(-1);
    expect(docsIdx).toBeGreaterThan(-1);
    expect(ticketIdx).toBeLessThan(docsIdx);
  });

  it("dedupes a hit returned by multiple scopes", async () => {
    vi.stubGlobal(
      "fetch",
      stubScopedFind((target) =>
        target.includes("nextbillion-docs")
          ? [
              {
                uri: "viking://resources/nextbillion-docs/a.md",
                score: 0.9,
                content: "docs hit",
              },
            ]
          : [],
      ),
    );
    const block = await getContextPackRetrievalBlock(["nextbillion"], "q");
    // Only the scopes returning this URI get it; no duplicate blocks
    expect(block.split("docs hit").length - 1).toBe(
      CONTEXT_PACKS.nextbillion.vikingScopes.filter((s) =>
        s.includes("nextbillion-docs"),
      ).length,
    );
  });

  it("caps merged hits at HITS_PER_PACK", async () => {
    vi.stubGlobal(
      "fetch",
      stubScopedFind((target) =>
        target.includes("nextbillion-docs")
          ? Array.from({ length: 6 }, (_, i) => ({
              uri: `viking://resources/nextbillion-docs/d${i}.md`,
              score: 0.9 - i * 0.01,
              content: `docs hit ${i}`,
            }))
          : target.includes("support-tickets")
            ? [
                {
                  uri: "viking://resources/nextbillion-sessions/support-tickets/top.md",
                  score: 0.99,
                  content: "top ticket hit",
                },
              ]
            : [],
      ),
    );
    const block = await getContextPackRetrievalBlock(["nextbillion"], "q");
    expect(block).toContain("top ticket hit");
    // 6 docs hits + 1 ticket = 7 raw; merged cap keeps the best 6 overall
    expect(block.split("--- viking://resources/").length - 1).toBe(6);
  });

  it("fail-opens on HTTP error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );
    expect(await getContextPackRetrievalBlock(["nextbillion"], "q")).toBe("");
  });

  it("fail-opens when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    );
    expect(await getContextPackRetrievalBlock(["nextbillion"], "q")).toBe("");
  });

  it("includes the full SKILL.md, not the ~300-char abstract teaser", async () => {
    const fullSkill =
      "---\nname: nextbillion-map\n---\n\n# Map rendering\n\n" +
      "## URLs that must survive hosted previews\n" +
      "Map subresources are fetched by maplibre's Web Worker: use " +
      "`import.meta.env.BASE_URL` prefixes, never `window.location.origin`.";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string | URL) => {
        const u = String(url);
        if (u.includes("/skills/find")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              status: "ok",
              result: {
                skills: [
                  {
                    name: "nextbillion-map",
                    root_uri: "viking://user/default/skills/nextbillion-map",
                    skill_md_uri:
                      "viking://user/default/skills/nextbillion-map/SKILL.md",
                    abstract: "# Map rendering with NextBillion.ai (teaser)",
                  },
                ],
              },
            }),
          });
        }
        if (u.includes("SKILL.md")) {
          return Promise.resolve(okRead(fullSkill));
        }
        return Promise.resolve(okEnvelope([]));
      }),
    );
    const block = await getContextPackRetrievalBlock(
      ["nextbillion"],
      "build a route planner with a map",
    );
    expect(block).toContain("import.meta.env.BASE_URL");
    expect(block).toContain("skills/nextbillion-map/SKILL.md");
    expect(block).not.toContain("(teaser)");
  });

  it("falls back to the abstract when SKILL.md read fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string | URL) => {
        const u = String(url);
        if (u.includes("/skills/find")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              status: "ok",
              result: {
                skills: [
                  {
                    name: "s",
                    root_uri: "viking://user/default/skills/s",
                    skill_md_uri: "viking://user/default/skills/s/SKILL.md",
                    abstract: "abstract fallback body",
                  },
                ],
              },
            }),
          });
        }
        if (u.includes("SKILL.md")) {
          return Promise.resolve({ ok: false, status: 500 });
        }
        return Promise.resolve(okEnvelope([]));
      }),
    );
    const block = await getContextPackRetrievalBlock(
      ["nextbillion"],
      "anything with a map",
    );
    expect(block).toContain("abstract fallback body");
  });
});

describe("getPolicyBlock (OpenViking read-by-URI)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns empty for no packs", async () => {
    expect(await getPolicyBlock(undefined)).toBe("");
    expect(await getPolicyBlock([])).toBe("");
  });

  it("wraps the policy doc with the vendor tag", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(okRead("use maplibre-gl with style.json")),
    );
    const block = await getPolicyBlock(["nextbillion"]);
    expect(block).toContain('<context-policy vendor="NextBillion.ai">');
    expect(block).toContain("style.json");
  });

  it("fail-opens on HTTP error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );
    expect(await getPolicyBlock(["nextbillion"])).toBe("");
  });

  it("fail-opens when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    );
    expect(await getPolicyBlock(["nextbillion"])).toBe("");
  });
});

describe("getContextPackBlocks", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns both parts empty for no packs", async () => {
    expect(await getContextPackBlocks(undefined, "q")).toEqual({
      policy: "",
      retrieval: "",
    });
  });

  it("returns policy and retrieval together", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string | URL) =>
        String(url).includes("/search/find")
          ? Promise.resolve(
              okEnvelope([
                {
                  uri: "viking://resources/nextbillion-docs/geocode.md",
                  content: "GET /geocode?q=",
                },
              ]),
            )
          : Promise.resolve(okRead("# policy body")),
      ),
    );
    const blocks = await getContextPackBlocks(
      ["nextbillion"],
      "geocode addresses",
    );
    expect(blocks.policy).toContain("# policy body");
    expect(blocks.retrieval).toContain("GET /geocode?q=");
  });
});
