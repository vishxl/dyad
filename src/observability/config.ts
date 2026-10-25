/**
 * Central observability configuration — the single source of truth for all
 * logging/tracing switching and backend integration in nextbillion.
 *
 * Every observability consumer (provider modules, call sites, the Settings
 * toggle, shutdown hooks) reads from this file. Adding a new backend later
 * means: add its provider module in this directory, wire it here, and keep
 * all other call sites unchanged.
 *
 * Secrets and endpoints are never committed: they are read at runtime from
 * the environment variables named below (documented in `.env.example`).
 */
export const OBSERVABILITY_CONFIG = {
  /** Deployment-level master switch. Users can still opt out per-app via Settings. */
  enabled: true,
  /** Active backend. New providers plug in here (e.g. "datadog", "none"). */
  provider: "langfuse" as "langfuse" | "none",
  /** What gets captured. */
  capture: {
    /** Full LLM request/response: system prompt, messages, streamed output, usage, errors. */
    llmRequests: true,
    /** Agent tool calls: file writes, shell commands, SQL, sandbox scripts. */
    toolCalls: true,
  },
  /**
   * Environment variable names holding backend connection details.
   */
  env: {
    baseUrl: "LANGFUSE_BASE_URL",
    publicKey: "LANGFUSE_PUBLIC_KEY",
    secretKey: "LANGFUSE_SECRET_KEY",
  },
} as const;

export type ObservabilityConfig = typeof OBSERVABILITY_CONFIG;

/** Settings-shape subset the observability system depends on. */
export type ObservabilitySettings = {
  /** User-facing opt-out. Default is ON; only `false` disables. */
  observabilityEnabled?: boolean;
};

/**
 * Effective observability decision: config master switch AND user setting.
 * This is the only gating function — consumers must not read raw settings
 * or env vars for observability decisions themselves.
 */
export function isObservabilityEnabled(
  settings?: ObservabilitySettings,
): boolean {
  if (!OBSERVABILITY_CONFIG.enabled) return false;
  return settings?.observabilityEnabled !== false;
}
