import { afterEach, describe, expect, it, vi } from "vitest";
import { getContextPackRetrievalBlock } from "./openviking";

const okEnvelope = (resources: unknown[]) => ({
  ok: true,
  status: 200,
  json: async () => ({ status: "ok", result: { resources } }),
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
      vi
        .fn()
        .mockResolvedValue(
          okEnvelope([
            {
              uri: "viking://resources/nextbillion-docs/optimization/x.md",
              content: "POST /optimization/v2 params...",
            },
          ]),
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
