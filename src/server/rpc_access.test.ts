import { describe, expect, it } from "vitest";
import {
  DEFAULT_RPC_ALLOWED_ORIGINS,
  getAllowedRpcOrigins,
  isRpcRequestAllowed,
} from "./rpc_access";

const ALLOWED = new Set(DEFAULT_RPC_ALLOWED_ORIGINS);

describe("isRpcRequestAllowed", () => {
  it("allows requests without an Origin header (curl/node clients)", () => {
    expect(
      isRpcRequestAllowed({
        origin: undefined,
        presentedToken: undefined,
        expectedToken: undefined,
        allowedOrigins: ALLOWED,
      }),
    ).toBe(true);
  });

  it("allows the local renderer origins", () => {
    for (const origin of ALLOWED) {
      expect(
        isRpcRequestAllowed({
          origin,
          presentedToken: undefined,
          expectedToken: undefined,
          allowedOrigins: ALLOWED,
        }),
      ).toBe(true);
    }
  });

  it("rejects cross-origin browser requests (any other web page)", () => {
    expect(
      isRpcRequestAllowed({
        origin: "https://evil.example",
        presentedToken: undefined,
        expectedToken: undefined,
        allowedOrigins: ALLOWED,
      }),
    ).toBe(false);
    expect(
      isRpcRequestAllowed({
        origin: "http://127.0.0.1:8080",
        presentedToken: undefined,
        expectedToken: undefined,
        allowedOrigins: ALLOWED,
      }),
    ).toBe(false);
  });

  it("ignores a trailing slash when matching origins", () => {
    expect(
      isRpcRequestAllowed({
        origin: "http://127.0.0.1:4173/",
        presentedToken: undefined,
        expectedToken: undefined,
        allowedOrigins: ALLOWED,
      }),
    ).toBe(true);
  });

  it("requires the token when one is expected", () => {
    const withToken = {
      expectedToken: "secret",
      allowedOrigins: ALLOWED,
    };
    expect(
      isRpcRequestAllowed({
        origin: undefined,
        presentedToken: undefined,
        ...withToken,
      }),
    ).toBe(false);
    expect(
      isRpcRequestAllowed({
        origin: undefined,
        presentedToken: "wrong",
        ...withToken,
      }),
    ).toBe(false);
    expect(
      isRpcRequestAllowed({
        origin: undefined,
        presentedToken: "secret",
        ...withToken,
      }),
    ).toBe(true);
    // Token does not rescue a disallowed origin.
    expect(
      isRpcRequestAllowed({
        origin: "https://evil.example",
        presentedToken: "secret",
        ...withToken,
      }),
    ).toBe(false);
  });
});

describe("getAllowedRpcOrigins", () => {
  it("defaults to the local renderer origins", () => {
    expect(getAllowedRpcOrigins({})).toEqual(ALLOWED);
  });

  it("parses a custom comma list and normalizes trailing slashes", () => {
    expect(
      getAllowedRpcOrigins({
        DYAD_RPC_ALLOWED_ORIGINS:
          "http://localhost:5173/, http://10.0.0.5:4173",
      }),
    ).toEqual(new Set(["http://localhost:5173", "http://10.0.0.5:4173"]));
  });
});
