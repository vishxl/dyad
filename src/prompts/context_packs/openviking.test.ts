import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getContextPackBlocks,
  getContextPackRetrievalBlock,
  getPolicyBlock,
} from "./openviking";

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

describe("getContextPackRetrievalBlock (OpenViking)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns empty for no packs or empty prompt", async () => {
    expect(await getContextPackRetrievalBlock(undefined, "route app")).toBe("");
    expect(await getContextPackRetrievalBlock(["nextbillion"], "  ")).toBe("");
  });

  it("wraps retrieved hits with the vendor tag", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string | URL) =>
        String(url).includes("/search/find")
          ? Promise.resolve(
              okEnvelope([
                {
                  uri: "viking://resources/nextbillion-docs/optimization/x.md",
                  content: "POST /optimization/v2 params...",
                },
              ]),
            )
          : Promise.resolve(okRead("# policy")),
      ),
    );
    const block = await getContextPackRetrievalBlock(
      ["nextbillion"],
      "optimize delivery stops",
    );
    expect(block).toContain('<context-retrieval vendor="NextBillion.ai">');
    expect(block).toContain("POST /optimization/v2");
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
