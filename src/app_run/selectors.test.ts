import { describe, expect, it, vi, afterEach } from "vitest";
import { projectAppRunRemoteSnapshot } from "./transport";
import type { AppRunInvocationRef, RunState } from "./state";
import { selectRemoteAppExit, selectRemoteAppUrl } from "./selectors";

const invocationRef: AppRunInvocationRef = {
  kind: "app-run",
  entityKey: 7,
  operationId: "run-1",
};

function snapshot(state: RunState) {
  return projectAppRunRemoteSnapshot(7, 1, state);
}

const readyState = (appUrl: string): RunState => ({
  type: "ready",
  appId: 7,
  invocationRef,
  url: {
    appUrl,
    originalUrl: "http://localhost:3200",
    mode: "host" as const,
  },
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("app-run remote selectors", () => {
  it("exposes ready and reloading URLs as a running-server signal", () => {
    const url = {
      appUrl: "http://app-7.localhost:4200",
      previewAuth: { provider: "supabase", state: "pending" } as const,
      originalUrl: "http://localhost:3200",
      mode: "host" as const,
    };

    for (const state of [
      { type: "ready", appId: 7, invocationRef, url },
      {
        type: "reloading",
        appId: 7,
        invocationRef,
        reason: "manual",
        url,
      },
    ] satisfies RunState[]) {
      expect(selectRemoteAppUrl(snapshot(state))).toEqual({ ...url, appId: 7 });
    }
  });

  it("passes preview URLs through unchanged when no template is set", () => {
    vi.stubEnv("VITE_PREVIEW_URL_TEMPLATE", "");
    expect(
      selectRemoteAppUrl(snapshot(readyState("http://localhost:42113"))),
    ).toMatchObject({ appUrl: "http://localhost:42113" });
    expect(
      selectRemoteAppUrl(snapshot(readyState("http://app-7.localhost:42113"))),
    ).toMatchObject({ appUrl: "http://app-7.localhost:42113" });
  });

  it("rewrites localhost preview origins to the public template", () => {
    vi.stubEnv(
      "VITE_PREVIEW_URL_TEMPLATE",
      "https://1-2-3-4-5-6.sslip.io/preview/{port}",
    );
    expect(
      selectRemoteAppUrl(snapshot(readyState("http://localhost:42113"))),
    ).toMatchObject({ appUrl: "https://1-2-3-4-5-6.sslip.io/preview/42113" });
    expect(
      selectRemoteAppUrl(
        snapshot(readyState("http://app-7.localhost:42113/some/path?x=1")),
      ),
    ).toMatchObject({
      appUrl: "https://1-2-3-4-5-6.sslip.io/preview/42113/some/path?x=1",
    });
    expect(
      selectRemoteAppUrl(snapshot(readyState("http://127.0.0.1:42113"))),
    ).toMatchObject({ appUrl: "https://1-2-3-4-5-6.sslip.io/preview/42113" });
  });

  it("leaves non-localhost URLs untouched when a template is set", () => {
    vi.stubEnv(
      "VITE_PREVIEW_URL_TEMPLATE",
      "https://1-2-3-4-5-6.sslip.io/preview/{port}",
    );
    expect(
      selectRemoteAppUrl(snapshot(readyState("https://elsewhere.example"))),
    ).toMatchObject({ appUrl: "https://elsewhere.example" });
  });

  it("projects only an observed process exit", () => {
    expect(
      selectRemoteAppExit(
        snapshot({
          type: "stopped",
          appId: 7,
          invocationRef,
          exitCode: 1,
          timestamp: 100,
        }),
      ),
    ).toEqual({ appId: 7, exitCode: 1, timestamp: 100 });
    expect(
      selectRemoteAppExit(
        snapshot({
          type: "errored",
          appId: 7,
          invocationRef,
          error: { message: "failed" },
        }),
      ),
    ).toBeNull();
  });
});
