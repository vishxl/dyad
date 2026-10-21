/**
 * Langfuse provider for the observability system — consumed via
 * `src/observability/config.ts` (the central config file).
 *
 * Registers an OpenTelemetry tracer provider with a LangfuseSpanProcessor once
 * per main-process lifetime. All connection details come from the environment
 * variables named in OBSERVABILITY_CONFIG.env — no provider names or env-var
 * names are hardcoded outside config.ts.
 *
 * Every entry point is safe to call when unconfigured or disabled: they are
 * no-ops (and `getTelemetrySettings` returns `undefined`, which leaves the AI
 * SDK's experimental_telemetry off entirely).
 */
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { propagateAttributes } from "@langfuse/tracing";
import type { TelemetrySettings } from "ai";
import log from "electron-log";
import {
  OBSERVABILITY_CONFIG,
  isObservabilityEnabled,
  type ObservabilitySettings,
} from "./config";

const logger = log.scope("observability/langfuse");

type LangfuseState = {
  processor: LangfuseSpanProcessor;
};

let state: LangfuseState | undefined;
let initAttempted = false;

/**
 * Idempotently registers the Langfuse span processor. Returns true only when
 * tracing is actually wired up. Configuration (public/secret key) is read from
 * the env vars named in OBSERVABILITY_CONFIG.env; missing keys mean observability
 * is simply not configured for this deployment — a silent no-op.
 */
function ensureInit(): boolean {
  if (initAttempted) return state !== undefined;
  initAttempted = true;
  const {
    publicKey: publicKeyEnv,
    secretKey: secretKeyEnv,
    baseUrl: baseUrlEnv,
  } = OBSERVABILITY_CONFIG.env;
  const publicKey = process.env[publicKeyEnv];
  const secretKey = process.env[secretKeyEnv];
  const baseUrl = process.env[baseUrlEnv];
  if (!publicKey || !secretKey) {
    return false;
  }
  if (!baseUrl) {
    logger.warn(
      `${baseUrlEnv} is not set; falling back to the LangfuseSpanProcessor default (Langfuse cloud)`,
    );
  }
  try {
    const processor = new LangfuseSpanProcessor({
      publicKey,
      secretKey,
      baseUrl: baseUrl || undefined,
      // When tool-call capture is off, drop the AI SDK's ai.toolCall spans at export.
      shouldExportSpan: OBSERVABILITY_CONFIG.capture.toolCalls
        ? undefined
        : ({ otelSpan }) => !otelSpan.name.startsWith("ai.toolCall"),
    });
    const provider = new NodeTracerProvider({ spanProcessors: [processor] });
    provider.register();
    state = { processor };
    logger.info("Langfuse tracing registered", {
      baseUrl: baseUrl || "(default)",
    });
  } catch (err) {
    logger.warn("Failed to initialize Langfuse tracing:", err);
  }
  return state !== undefined;
}

/**
 * `experimental_telemetry` value for streamText/generateText calls. Returns
 * undefined when observability is disabled (user opt-out, master switch, or
 * unconfigured) so the AI SDK telemetry stays off entirely.
 */
export function getTelemetrySettings(
  functionId: string,
  settings?: ObservabilitySettings,
): TelemetrySettings | undefined {
  if (!isObservabilityEnabled(settings)) return undefined;
  if (!ensureInit()) return undefined;
  return {
    isEnabled: true,
    functionId,
    recordInputs: OBSERVABILITY_CONFIG.capture.llmRequests,
    recordOutputs: OBSERVABILITY_CONFIG.capture.llmRequests,
  };
}

/**
 * Wraps `fn` in a Langfuse context so all spans created inside (AI SDK
 * generations and ai.toolCall spans) share one trace, grouped under `sessionId`
 * (e.g. the chat id). No-op passthrough when observability is disabled.
 */
export function withTrace<T>(
  settings: ObservabilitySettings | undefined,
  params: {
    sessionId: string;
    traceName: string;
    metadata?: Record<string, string>;
  },
  fn: () => T,
): T {
  if (!isObservabilityEnabled(settings)) return fn();
  if (!ensureInit()) return fn();
  try {
    return propagateAttributes(
      {
        sessionId: params.sessionId,
        traceName: params.traceName,
        metadata: params.metadata,
      },
      fn,
    );
  } catch (err) {
    logger.warn("withTrace wrapper failed; running untraced:", err);
    return fn();
  }
}

/**
 * Flushes pending spans and shuts down the processor. Fire-and-forget safe:
 * resolves without error when observability was never initialized.
 */
export async function shutdownObservability(): Promise<void> {
  if (!state) return;
  try {
    await state.processor.forceFlush();
    await state.processor.shutdown();
    state = undefined;
    initAttempted = false;
    logger.info("Langfuse tracing flushed and shut down");
  } catch (err) {
    logger.warn("Langfuse shutdown failed:", err);
  }
}
