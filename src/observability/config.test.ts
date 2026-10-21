import { afterEach, describe, expect, it, vi } from "vitest";
import {
  OBSERVABILITY_CONFIG,
  isObservabilityEnabled,
  type ObservabilitySettings,
} from "./config";

describe("isObservabilityEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns true by default (opt-out design, no settings)", () => {
    expect(isObservabilityEnabled(undefined)).toBe(true);
    expect(isObservabilityEnabled({})).toBe(true);
  });

  it("returns true when the user setting is explicitly true", () => {
    expect(isObservabilityEnabled({ observabilityEnabled: true })).toBe(true);
  });

  it("returns false when the user opts out", () => {
    const settings: ObservabilitySettings = { observabilityEnabled: false };
    expect(isObservabilityEnabled(settings)).toBe(false);
  });

  it("env vars do not affect the gating decision (they gate initialization)", () => {
    vi.stubEnv("LANGFUSE_PUBLIC_KEY", "");
    vi.stubEnv("LANGFUSE_SECRET_KEY", "");
    expect(isObservabilityEnabled({})).toBe(true);
  });

  it("master switch off wins over any user setting", () => {
    const enabled = OBSERVABILITY_CONFIG.enabled;
    try {
      // Simulate the deployment-level switch being flipped off.
      (OBSERVABILITY_CONFIG as { enabled: boolean }).enabled = false;
      expect(isObservabilityEnabled({ observabilityEnabled: true })).toBe(
        false,
      );
      expect(isObservabilityEnabled(undefined)).toBe(false);
    } finally {
      (OBSERVABILITY_CONFIG as { enabled: boolean }).enabled = enabled;
    }
  });
});
