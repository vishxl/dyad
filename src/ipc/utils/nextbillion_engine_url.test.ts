import { afterEach, describe, expect, it } from "vitest";

import { getNextBillionEngineBaseUrl } from "./nextbillion_engine_url";
import { getLmStudioBaseUrl } from "./lm_studio_utils";

const originalNextBillionEngineUrl = process.env.NEXTBILLION_ENGINE_URL;
const originalLmStudioUrl = process.env.LM_STUDIO_BASE_URL_FOR_TESTING;

describe("call-time model service URLs", () => {
  afterEach(() => {
    if (originalNextBillionEngineUrl === undefined) {
      delete process.env.NEXTBILLION_ENGINE_URL;
    } else {
      process.env.NEXTBILLION_ENGINE_URL = originalNextBillionEngineUrl;
    }
    if (originalLmStudioUrl === undefined) {
      delete process.env.LM_STUDIO_BASE_URL_FOR_TESTING;
    } else {
      process.env.LM_STUDIO_BASE_URL_FOR_TESTING = originalLmStudioUrl;
    }
  });

  it("reads NEXTBILLION_ENGINE_URL when called", () => {
    delete process.env.NEXTBILLION_ENGINE_URL;
    expect(getNextBillionEngineBaseUrl()).toBe("https://engine.dyad.sh/v1");

    process.env.NEXTBILLION_ENGINE_URL = "http://127.0.0.1:4321/v1";
    expect(getNextBillionEngineBaseUrl()).toBe("http://127.0.0.1:4321/v1");
  });

  it("reads LM_STUDIO_BASE_URL_FOR_TESTING when called", () => {
    delete process.env.LM_STUDIO_BASE_URL_FOR_TESTING;
    expect(getLmStudioBaseUrl()).toBe("http://localhost:1234");

    process.env.LM_STUDIO_BASE_URL_FOR_TESTING = "http://127.0.0.1:9876";
    expect(getLmStudioBaseUrl()).toBe("http://127.0.0.1:9876");
  });
});
