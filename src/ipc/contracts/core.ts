import { z } from "zod";
import {
  isInvocationRef,
  invocationRegistryKey,
  InvocationRegistry,
  type InvocationRef,
  type InvocationClaim,
} from "../../state_machines/invocation_ref";
import { DyadError, DyadErrorKind, isDyadError } from "../../errors/dyad_error";
import type { QueryInvalidationScope } from "../../window_infrastructure/types";

// =============================================================================
// Contract Type Definitions
// =============================================================================

/**
 * Standard IPC contract for invoke/response pattern.
 * Used for request-response style IPC calls.
 */
export interface IpcContract<
  TChannel extends string,
  TInput extends z.ZodType,
  TOutput extends z.ZodType,
> {
  readonly channel: TChannel;
  readonly input: TInput;
  readonly output: TOutput;
  readonly invalidates?: (
    input: z.infer<TInput>,
    output: z.infer<TOutput>,
  ) => readonly QueryInvalidationScope[];
  readonly originHandles?: (
    input: z.infer<TInput>,
    output: z.infer<TOutput>,
  ) => readonly QueryInvalidationScope[];
}

/**
 * Event contract for pub/sub pattern (main -> renderer).
 * Used for events pushed from main process to renderer.
 */
export interface EventContract<
  TChannel extends string,
  TPayload extends z.ZodType,
> {
  readonly channel: TChannel;
  readonly payload: TPayload;
}

/**
 * One-way IPC contract (renderer -> main), fire-and-forget with NO response.
 *
 * Unlike an invoke contract, the main process never replies. This matters for
 * messages fired while the renderer frame is being torn down (e.g. on
 * `pagehide` during app quit): a two-way `invoke` would leave the main process
 * trying to post its reply back to an already-destroyed frame, which Electron
 * surfaces as an unhandled "Object has been destroyed" error. A one-way send
 * has no reply, so there is nothing to deliver back.
 */
export interface SendContract<
  TChannel extends string,
  TInput extends z.ZodType,
> {
  readonly channel: TChannel;
  readonly input: TInput;
}

/**
 * Stream contract for invoke + multiple events pattern.
 * Used for streaming responses (e.g., chat streaming).
 */
export interface StreamContract<
  TChannel extends string,
  TInput extends z.ZodType,
  TKey extends string,
  TChunk extends z.ZodType,
  TEnd extends z.ZodType,
  TError extends z.ZodType,
> {
  readonly channel: TChannel;
  readonly input: TInput;
  readonly keyField: TKey;
  readonly events: {
    readonly chunk: { channel: string; payload: TChunk };
    readonly end: { channel: string; payload: TEnd };
    readonly error: { channel: string; payload: TError };
  };
}

// =============================================================================
// Contract Factories
// =============================================================================

/**
 * Creates a typed IPC contract definition.
 * Contract = Single Source of Truth for channel name, input schema, and output schema.
 */
export function defineContract<
  TChannel extends string,
  TInput extends z.ZodType,
  TOutput extends z.ZodType,
>(contract: {
  channel: TChannel;
  input: TInput;
  output: TOutput;
  invalidates?: (
    input: z.infer<TInput>,
    output: z.infer<TOutput>,
  ) => readonly QueryInvalidationScope[];
  originHandles?: (
    input: z.infer<TInput>,
    output: z.infer<TOutput>,
  ) => readonly QueryInvalidationScope[];
}): IpcContract<TChannel, TInput, TOutput> {
  return contract;
}

/**
 * Creates a typed event contract definition.
 * Used for main -> renderer pub/sub events.
 */
export function defineEvent<
  TChannel extends string,
  TPayload extends z.ZodType,
>(event: {
  channel: TChannel;
  payload: TPayload;
}): EventContract<TChannel, TPayload> {
  return event;
}

/**
 * Creates a typed one-way send contract definition (renderer -> main, no reply).
 */
export function defineSendContract<
  TChannel extends string,
  TInput extends z.ZodType,
>(contract: {
  channel: TChannel;
  input: TInput;
}): SendContract<TChannel, TInput> {
  return contract;
}

/**
 * Creates a typed stream contract definition.
 * Used for invoke + streaming response pattern.
 */
export function defineStream<
  TChannel extends string,
  TInput extends z.ZodType,
  TKey extends string,
  TChunk extends z.ZodType,
  TEnd extends z.ZodType,
  TError extends z.ZodType,
>(
  stream: StreamContract<TChannel, TInput, TKey, TChunk, TEnd, TError>,
): StreamContract<TChannel, TInput, TKey, TChunk, TEnd, TError> {
  return stream;
}

// =============================================================================
// Type Helpers
// =============================================================================

/** Extract the input type from a contract */
export type ContractInput<T> =
  T extends IpcContract<any, infer I, any> ? z.infer<I> : never;

/** Extract the output type from a contract */
export type ContractOutput<T> =
  T extends IpcContract<any, any, infer O> ? z.infer<O> : never;

/** Extract the channel name from a contract */
export type ContractChannel<T> =
  T extends IpcContract<infer C, any, any> ? C : never;

/** Extract the payload type from an event contract */
export type EventPayload<T> =
  T extends EventContract<any, infer P> ? z.infer<P> : never;

/** Extract the channel name from an event contract */
export type EventChannel<T> = T extends EventContract<infer C, any> ? C : never;

// =============================================================================
// Client Generators
// =============================================================================

const IPC_ENVELOPE_MARKER = "dyad-ipc-envelope-v1";
const IPC_DATE_TAG = "__dyadDate";

/**
 * Encode Date instances for a JSON transport (browser mode). Electron IPC uses
 * structured clone, which preserves Dates; JSON does not, so we tag them so the
 * browser bridge can revive them without guessing from ISO strings.
 */
export function encodeIpcDates(value: unknown): unknown {
  if (value instanceof Date) {
    return { [IPC_DATE_TAG]: value.toISOString() };
  }
  if (Array.isArray(value)) {
    return value.map((item) => encodeIpcDates(item));
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = encodeIpcDates(item);
    }
    return out;
  }
  return value;
}

/** Revive tagged Dates produced by encodeIpcDates on a JSON transport. */
export function reviveIpcDates(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => reviveIpcDates(item));
  }
  if (value !== null && typeof value === "object") {
    const tag = (value as Record<string, unknown>)[IPC_DATE_TAG];
    if (
      typeof tag === "string" &&
      Object.keys(value as Record<string, unknown>).length === 1
    ) {
      return new Date(tag);
    }
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = reviveIpcDates(item);
    }
    return out;
  }
  return value;
}

export interface SerializedIpcError {
  name?: string;
  message: string;
  kind?: DyadErrorKind;
  code?: string;
  stack?: string;
}

export type IpcInvokeEnvelope<T = unknown> =
  | {
      __dyadIpcEnvelope: typeof IPC_ENVELOPE_MARKER;
      ok: true;
      value: T;
    }
  | {
      __dyadIpcEnvelope: typeof IPC_ENVELOPE_MARKER;
      ok: false;
      error: SerializedIpcError;
    };

export function createIpcSuccessEnvelope<T>(value: T): IpcInvokeEnvelope<T> {
  return {
    __dyadIpcEnvelope: IPC_ENVELOPE_MARKER,
    ok: true,
    value,
  };
}

export function createIpcErrorEnvelope(error: unknown): IpcInvokeEnvelope {
  return {
    __dyadIpcEnvelope: IPC_ENVELOPE_MARKER,
    ok: false,
    error: serializeIpcError(error),
  };
}

export function isIpcInvokeEnvelope(
  value: unknown,
): value is IpcInvokeEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { __dyadIpcEnvelope?: unknown }).__dyadIpcEnvelope ===
      IPC_ENVELOPE_MARKER &&
    typeof (value as { ok?: unknown }).ok === "boolean"
  );
}

export function serializeIpcError(error: unknown): SerializedIpcError {
  const code =
    typeof error === "object" &&
    error !== null &&
    typeof (error as { code?: unknown }).code === "string"
      ? (error as { code: string }).code
      : undefined;

  if (isDyadError(error)) {
    return {
      name: error.name,
      message: error.message,
      kind: error.kind,
      code,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      code,
      stack: error.stack,
    };
  }

  return { message: String(error), code };
}

function isDyadErrorKind(value: unknown): value is DyadErrorKind {
  return (
    typeof value === "string" &&
    Object.values(DyadErrorKind).includes(value as DyadErrorKind)
  );
}

export function deserializeIpcError(error: SerializedIpcError): Error {
  if (isDyadErrorKind(error.kind)) {
    const dyadError = new DyadError(error.message, error.kind);
    dyadError.name = error.name ?? dyadError.name;
    if (error.code !== undefined) {
      (dyadError as DyadError & { code: string }).code = error.code;
    }
    dyadError.stack = error.stack;
    return dyadError;
  }

  const genericError = new Error(error.message);
  genericError.name = error.name ?? genericError.name;
  if (error.code !== undefined) {
    (genericError as Error & { code: string }).code = error.code;
  }
  genericError.stack = error.stack;
  return genericError;
}

export function unwrapIpcEnvelope<T>(response: IpcInvokeEnvelope<T>): T {
  if (response.ok) {
    return response.value;
  }
  throw deserializeIpcError(response.error);
}

export function createBrowserIpcBridge(options?: {
  baseUrl?: string;
  wsUrl?: string;
}) {
  // Optional shared secret for the headless RPC surface. The launcher passes
  // the same value to the server (DYAD_RPC_TOKEN) and to Vite
  // (VITE_RPC_TOKEN); when set, every /rpc request and /ws connection must
  // present it. Defensive access to import.meta.env keeps non-Vite consumers
  // of this module working.
  const rpcToken = (() => {
    try {
      const env = (import.meta as { env?: Record<string, string | undefined> })
        .env;
      return env?.VITE_RPC_TOKEN || undefined;
    } catch {
      return undefined;
    }
  })();

  const rpcHeaders = rpcToken ? { "x-dyad-rpc-token": rpcToken } : undefined;

  const getOrigin = () => {
    if (typeof window === "undefined") {
      return "http://127.0.0.1";
    }
    return options?.baseUrl ?? `${window.location.origin}`;
  };

  const getWsOrigin = () => {
    if (typeof window === "undefined") {
      return "ws://127.0.0.1";
    }
    return options?.wsUrl ?? `${window.location.origin.replace(/^http/, "ws")}`;
  };

  const listeners = new Map<string, Set<(payload: unknown) => void>>();
  let socket: WebSocket | null = null;
  let reconnectTimer: number | undefined;

  const ensureSocket = () => {
    if (typeof window === "undefined") {
      return null;
    }
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      return socket;
    }

    const wsUrl = `${getWsOrigin()}/ws${
      rpcToken ? `?token=${encodeURIComponent(rpcToken)}` : ""
    }`;
    socket = new WebSocket(wsUrl);
    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(String(event.data));
        if (!message || typeof message !== "object") {
          return;
        }
        const channel =
          typeof message.channel === "string" ? message.channel : null;
        const payload = (message as { payload?: unknown }).payload;
        if (!channel) {
          return;
        }
        const channelListeners = listeners.get(channel);
        if (!channelListeners) {
          return;
        }
        for (const listener of Array.from(channelListeners)) {
          listener(reviveIpcDates(payload));
        }
      } catch {
        // Ignore malformed browser event frames; they are not valid Dyad events.
      }
    });

    socket.addEventListener("close", () => {
      if (reconnectTimer !== undefined) {
        window.clearTimeout(reconnectTimer);
      }
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = undefined;
        ensureSocket();
      }, 1000);
    });

    return socket;
  };

  const invokeRaw = async (channel: string, input: unknown) => {
    const response = await fetch(
      `${getOrigin()}/rpc/${encodeURIComponent(channel)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...rpcHeaders,
        },
        body: input === undefined ? undefined : JSON.stringify(input),
      },
    );

    if (!response.ok) {
      let payload: unknown = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
      const message =
        payload && typeof payload === "object" && "error" in payload
          ? ((payload as { error?: { message?: string } }).error?.message ??
            response.statusText)
          : response.statusText || "Request failed.";
      throw new Error(message);
    }

    return reviveIpcDates(await response.json());
  };

  return {
    invoke: async (channel: string, input: unknown) => {
      const response = await invokeRaw(channel, input);
      return isIpcInvokeEnvelope(response)
        ? unwrapIpcEnvelope(response)
        : response;
    },
    invokeEnvelope: async (channel: string, input: unknown) => {
      return await invokeRaw(channel, input);
    },
    send: async (channel: string, input?: unknown) => {
      try {
        await fetch(`${getOrigin()}/rpc/${encodeURIComponent(channel)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...rpcHeaders,
          },
          body: input === undefined ? undefined : JSON.stringify(input),
        });
      } catch {
        // Best-effort send only; the browser transport is designed for the renderer
        // event stream and invoke path, not a desktop-style fire-and-forget queue.
      }
    },
    on: (channel: string, listener: (payload: unknown) => void) => {
      const set = listeners.get(channel) ?? new Set();
      set.add(listener);
      listeners.set(channel, set);
      ensureSocket();
      return () => {
        const next = listeners.get(channel);
        if (!next) return;
        next.delete(listener);
        if (next.size === 0) {
          listeners.delete(channel);
        }
      };
    },
    removeAllListeners: (channel: string) => {
      listeners.delete(channel);
    },
    removeListener: (channel: string, listener: (payload: unknown) => void) => {
      const next = listeners.get(channel);
      if (!next) return;
      next.delete(listener);
      if (next.size === 0) {
        listeners.delete(channel);
      }
    },
  };
}

/** Type to convert contracts object to client methods */
type ClientFromContracts<
  T extends Record<string, IpcContract<string, z.ZodType, z.ZodType>>,
> = {
  [K in keyof T]: (
    input: z.infer<T[K]["input"]>,
  ) => Promise<z.infer<T[K]["output"]>>;
};

/**
 * Creates a typed client from a contracts object.
 * Each contract key becomes a method name, types are derived automatically.
 *
 * @example
 * const appContracts = {
 *   createApp: defineContract({ channel: "create-app", input: ..., output: ... }),
 *   deleteApp: defineContract({ channel: "delete-app", input: ..., output: ... }),
 * };
 * const appClient = createClient(appContracts);
 * // appClient.createApp(params) - params/result types derived automatically
 */
export function createClient<
  T extends Record<string, IpcContract<string, z.ZodType, z.ZodType>>,
>(contracts: T): ClientFromContracts<T> {
  const getIpcRenderer = () => {
    const maybeElectron = (window as any).electron?.ipcRenderer;
    if (maybeElectron) {
      return maybeElectron;
    }
    if (typeof window !== "undefined") {
      const enableBrowser =
        (typeof import.meta !== "undefined" &&
          (import.meta as any).env?.VITE_BROWSER_IPC === "1") ||
        new URLSearchParams(window.location.search).get("browserIPC") === "1";
      if (enableBrowser) {
        const browserBridge = createBrowserIpcBridge();
        (window as any).electron = { ipcRenderer: browserBridge };
        return browserBridge;
      }
    }
    return undefined;
  };

  const client = {} as ClientFromContracts<T>;
  for (const [methodName, contract] of Object.entries(contracts)) {
    (client as any)[methodName] = async (input: unknown) => {
      const ipcRenderer = getIpcRenderer();
      if (!ipcRenderer) {
        throw new Error(
          `[${contract.channel}] IPC renderer not available. Make sure this is called from the renderer process.`,
        );
      }
      const invoke =
        typeof ipcRenderer.invokeEnvelope === "function"
          ? ipcRenderer.invokeEnvelope
          : ipcRenderer.invoke;
      const response = await invoke(contract.channel, input);
      return isIpcInvokeEnvelope(response)
        ? unwrapIpcEnvelope(response)
        : response;
    };
  }
  return client;
}

/** Type to convert send contracts object to fire-and-forget client methods */
type SendClientFromContracts<
  T extends Record<string, SendContract<string, z.ZodType>>,
> = {
  [K in keyof T]: (input: z.infer<T[K]["input"]>) => void;
};

/**
 * Creates a typed one-way send client from a send-contracts object. Each method
 * dispatches a fire-and-forget `ipcRenderer.send` and returns immediately —
 * there is no response to await. Use for writes that must survive being fired
 * during renderer teardown (see {@link SendContract}).
 */
export function createSendClient<
  T extends Record<string, SendContract<string, z.ZodType>>,
>(contracts: T): SendClientFromContracts<T> {
  // Access ipcRenderer from the window.electron exposed by preload
  const getIpcRenderer = () => (window as any).electron?.ipcRenderer;

  const client = {} as SendClientFromContracts<T>;
  for (const [methodName, contract] of Object.entries(contracts)) {
    (client as any)[methodName] = (input: unknown) => {
      const ipcRenderer = getIpcRenderer();
      if (typeof ipcRenderer?.send !== "function") {
        throw new Error(
          `[${contract.channel}] IPC renderer send not available. Make sure this is called from the renderer process.`,
        );
      }
      ipcRenderer.send(contract.channel, input);
    };
  }
  return client;
}

// =============================================================================
// Event Client Generator
// =============================================================================

/** Capitalize first letter of a string type */
type Capitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;

/** Type to convert event contracts object to event client methods */
type EventClientFromContracts<
  T extends Record<string, EventContract<string, z.ZodType>>,
> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (
    handler: (payload: z.infer<T[K]["payload"]>) => void,
  ) => () => void; // Returns unsubscribe function
};

/**
 * Creates a typed event client from an events object.
 * Each event key becomes an on<Key> method, types are derived automatically.
 *
 * @example
 * const agentEvents = {
 *   todosUpdate: defineEvent({ channel: "agent-tool:todos-update", payload: ... }),
 * };
 * const agentEventClient = createEventClient(agentEvents);
 * // agentEventClient.onTodosUpdate(handler) -> unsubscribe fn
 */
export function createEventClient<
  T extends Record<string, EventContract<string, z.ZodType>>,
>(events: T): EventClientFromContracts<T> {
  const getIpcRenderer = () => {
    const maybeElectron = (window as any).electron?.ipcRenderer;
    if (maybeElectron) {
      return maybeElectron;
    }
    if (typeof window !== "undefined") {
      const enableBrowser =
        (typeof import.meta !== "undefined" &&
          (import.meta as any).env?.VITE_BROWSER_IPC === "1") ||
        new URLSearchParams(window.location.search).get("browserIPC") === "1";
      if (enableBrowser) {
        const browserBridge = createBrowserIpcBridge();
        (window as any).electron = { ipcRenderer: browserBridge };
        return browserBridge;
      }
    }
    return undefined;
  };

  const client = {} as EventClientFromContracts<T>;

  for (const [key, event] of Object.entries(events)) {
    const methodName = `on${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    (client as any)[methodName] = (handler: (payload: unknown) => void) => {
      const ipcRenderer = getIpcRenderer();
      if (!ipcRenderer) {
        console.error(
          `[${event.channel}] IPC renderer not available. Make sure this is called from the renderer process.`,
        );
        return () => {};
      }

      const listener = (data: unknown) => {
        const parsed = event.payload.safeParse(data);
        if (parsed.success) {
          handler(parsed.data);
        } else {
          console.error(
            `[${event.channel}] Invalid payload:`,
            parsed.error.format(),
          );
        }
      };

      const unsubscribe = ipcRenderer.on(event.channel, listener);
      return unsubscribe;
    };
  }

  return client;
}

// =============================================================================
// Stream Client Generator
// =============================================================================

/**
 * Creates a typed stream client from a stream contract.
 * Manages callbacks internally and routes events by key field.
 *
 * @example
 * const chatStreamContract = defineStream({
 *   channel: "chat:stream",
 *   input: ChatStreamParamsSchema,
 *   keyField: "chatId",
 *   events: { chunk: ..., end: ..., error: ... },
 * });
 * const chatStreamClient = createStreamClient(chatStreamContract);
 * chatStreamClient.start({ chatId: 123, prompt: "Hello" }, { onChunk, onEnd, onError });
 */
export function createStreamClient<
  TChannel extends string,
  TInput extends z.ZodType,
  TKey extends string,
  TChunk extends z.ZodType,
  TEnd extends z.ZodType,
  TError extends z.ZodType,
>(contract: StreamContract<TChannel, TInput, TKey, TChunk, TEnd, TError>) {
  const getIpcRenderer = () => {
    const maybeElectron = (window as any).electron?.ipcRenderer;
    if (maybeElectron) {
      return maybeElectron;
    }
    if (typeof window !== "undefined") {
      const enableBrowser =
        (typeof import.meta !== "undefined" &&
          (import.meta as any).env?.VITE_BROWSER_IPC === "1") ||
        new URLSearchParams(window.location.search).get("browserIPC") === "1";
      if (enableBrowser) {
        const browserBridge = createBrowserIpcBridge();
        (window as any).electron = { ipcRenderer: browserBridge };
        return browserBridge;
      }
    }
    return undefined;
  };

  type Input = z.infer<TInput>;
  // Use string | number for KeyValue to support common key types while
  // maintaining better type safety than unknown. TypeScript cannot infer
  // the exact key type from TInput[TKey] due to Zod v4 type system limitations.
  type KeyValue = string | number;

  interface StreamEntry {
    callbacks: {
      onChunk: (data: z.infer<TChunk>) => void;
      onEnd: (data: z.infer<TEnd>) => void;
      onError: (data: z.infer<TError>) => void;
    };
    /** When true (default), the entry is removed on end/error events. */
    autoRelease: boolean;
  }

  const registryKind = `ipc-stream:${contract.channel}`;
  const streams = new InvocationRegistry<StreamEntry>();
  const legacyStructuralSafety = {
    structuralSafety:
      "App-update compatibility: an older producer cannot echo InvocationRef, so an identity-less event intentionally claims the current key.",
  } as const;

  // Legacy monotonic generation counter for callers that do not supply an
  // InvocationRef. Contracts that echo either identity reject stale events.
  // Payloads without either identity retain legacy key-only routing.
  let nextStreamId = 0;

  let listenersSetUp = false;
  const unclaimedChunkListeners = new Set<(data: z.infer<TChunk>) => void>();

  const setupListeners = () => {
    if (listenersSetUp) return;

    const ipcRenderer = getIpcRenderer();
    if (!ipcRenderer) return;

    ipcRenderer.on(contract.events.chunk.channel, (data: unknown) => {
      const parsed = contract.events.chunk.payload.safeParse(data);
      if (parsed.success) {
        const payload = parsed.data as Record<string, unknown>;
        const key = payload[contract.keyField] as KeyValue;
        const claim = claimPayload(key, payload);
        if (claim.kind === "claimed") {
          claim.value.callbacks.onChunk(parsed.data);
        } else if (claim.kind === "unsolicited") {
          for (const listener of unclaimedChunkListeners) {
            listener(parsed.data);
          }
        }
      }
    });

    ipcRenderer.on(contract.events.end.channel, (data: unknown) => {
      const parsed = contract.events.end.payload.safeParse(data);
      if (parsed.success) {
        const payload = parsed.data as Record<string, unknown>;
        const key = payload[contract.keyField] as KeyValue;
        const claim = claimPayload(key, payload);
        if (claim.kind !== "claimed") return;
        claim.value.callbacks.onEnd(parsed.data);
        // The terminal callback may synchronously start another stream with
        // the same key. Only clean up the generation that actually ended.
        if (claim.value.autoRelease) {
          streams.delete(claim.ref);
        }
      }
    });

    ipcRenderer.on(contract.events.error.channel, (data: unknown) => {
      const parsed = contract.events.error.payload.safeParse(data);
      if (parsed.success) {
        const payload = parsed.data as Record<string, unknown>;
        const key = payload[contract.keyField] as KeyValue;
        const claim = claimPayload(key, payload);
        if (claim.kind !== "claimed") return;
        claim.value.callbacks.onError(parsed.data);
        // The error callback may synchronously replace this stream.
        if (claim.value.autoRelease) {
          streams.delete(claim.ref);
        }
      }
    });

    listenersSetUp = true;
  };

  function registryRef(
    key: KeyValue,
    correlation: number | InvocationRef,
  ): InvocationRef<string, KeyValue> {
    const operationId =
      typeof correlation === "number"
        ? `legacy-number:${correlation}`
        : `invocation:${invocationRegistryKey(correlation)}`;
    return { kind: registryKind, entityKey: key, operationId };
  }

  function claimPayload(
    key: KeyValue,
    payload: Record<string, unknown>,
  ): InvocationClaim<StreamEntry> {
    if (payload.invocationRef !== undefined) {
      return isInvocationRef(payload.invocationRef)
        ? streams.claim(registryRef(key, payload.invocationRef))
        : { kind: "unsolicited" };
    }
    if (typeof payload.streamId === "number") {
      return streams.claim(registryRef(key, payload.streamId));
    }
    return streams.claimStructurally(registryKind, key, legacyStructuralSafety);
  }

  function claimCurrentStructurally(
    key: KeyValue,
    structuralSafety: string,
  ): InvocationClaim<StreamEntry> {
    return streams.claimStructurally(registryKind, key, { structuralSafety });
  }

  return {
    /**
     * Start a stream with the given input and callbacks.
     *
     * Returns the correlation identity identifying this start() call. With
     * `autoRelease: false` the entry keeps receiving events after end/error
     * until `release(key, correlation)` is called (used by the chat stream
     * controller, which owns terminal reconciliation).
     */
    start(
      input: Input,
      callbacks: {
        onChunk: (data: z.infer<TChunk>) => void;
        onEnd: (data: z.infer<TEnd>) => void;
        onError: (data: z.infer<TError>) => void;
      },
      opts?: {
        invocationRef?: InvocationRef;
        streamId?: number;
        autoRelease?: boolean;
      },
    ): InvocationRef | number {
      setupListeners();

      const invocationRef = opts?.invocationRef;
      const streamId =
        invocationRef === undefined
          ? (opts?.streamId ?? ++nextStreamId)
          : undefined;
      if (streamId !== undefined && streamId > nextStreamId) {
        nextStreamId = streamId;
      }

      const ipcRenderer = getIpcRenderer();
      if (!ipcRenderer) {
        callbacks.onError({
          [contract.keyField]: (input as Record<string, unknown>)[
            contract.keyField
          ],
          error: "IPC renderer not available",
        } as any);
        return invocationRef ?? streamId!;
      }

      const key = (input as Record<string, unknown>)[
        contract.keyField
      ] as KeyValue;
      const entry: StreamEntry = {
        callbacks,
        autoRelease: opts?.autoRelease !== false,
      };
      const ref = registryRef(key, invocationRef ?? streamId!);
      streams.register(ref, entry);

      ipcRenderer.invoke(contract.channel, input).catch((err: Error) => {
        // Only surface the failure if this start() call still owns the entry.
        const claim = streams.claim(ref);
        if (claim.kind !== "claimed" || claim.value !== entry) return;
        callbacks.onError({
          [contract.keyField]: key,
          error: err.message,
        } as any);
        // The error callback may synchronously replace this stream.
        const current = streams.claim(ref);
        if (current.kind === "claimed" && current.value === entry) {
          streams.delete(ref);
        }
      });
      return invocationRef ?? streamId!;
    },

    /**
     * Cancel a stream by its key value.
     */
    cancel(key: KeyValue): void {
      const claim = claimCurrentStructurally(
        key,
        "Domain cancellation targets whichever operation currently owns this stream key.",
      );
      if (claim.kind === "claimed") {
        streams.delete(claim.ref);
      }
    },

    /**
     * Release a stream entry. When correlation identity is given, only
     * releases the matching entry (stale releases are no-ops).
     */
    release(
      key: KeyValue,
      correlation?: number | { invocationRef: InvocationRef },
    ): void {
      const claim =
        correlation === undefined
          ? claimCurrentStructurally(
              key,
              "Legacy release without correlation targets the current entry for this key.",
            )
          : streams.claim(
              registryRef(
                key,
                typeof correlation === "number"
                  ? correlation
                  : correlation.invocationRef,
              ),
            );
      if (claim.kind === "claimed") {
        streams.delete(claim.ref);
      }
    },

    /**
     * Check if a stream is active for a given key.
     */
    isActive(key: KeyValue): boolean {
      return (
        claimCurrentStructurally(
          key,
          "Presence checks observe current ownership but do not consume or mutate it.",
        ).kind === "claimed"
      );
    },

    /**
     * Observe valid chunks that are not owned by a stream started in this
     * renderer. Multi-window consumers use this to project peer streams.
     */
    subscribeUnclaimedChunks(
      listener: (data: z.infer<TChunk>) => void,
    ): () => void {
      setupListeners();
      unclaimedChunkListeners.add(listener);
      return () => unclaimedChunkListeners.delete(listener);
    },
  };
}

// =============================================================================
// Channel Extraction Helpers
// =============================================================================

/**
 * Extract all invoke channels from a contracts object.
 * Used for building the preload whitelist.
 */
export function getInvokeChannels<
  T extends Record<string, { channel: string }>,
>(contracts: T): T[keyof T]["channel"][] {
  return Object.values(contracts).map((c) => c.channel);
}

/**
 * Extract all one-way send channels from a send-contracts object.
 * Used for building the preload whitelist.
 */
export function getSendChannels<T extends Record<string, { channel: string }>>(
  contracts: T,
): T[keyof T]["channel"][] {
  return Object.values(contracts).map((c) => c.channel);
}

/**
 * Extract all receive (event) channels from an events object.
 * Used for building the preload whitelist.
 */
export function getReceiveChannels<
  T extends Record<string, { channel: string }>,
>(events: T): T[keyof T]["channel"][] {
  return Object.values(events).map((e) => e.channel);
}

/**
 * Extract all channels from a stream contract (invoke + events).
 */
export function getStreamChannels<
  TChannel extends string,
  TInput extends z.ZodType,
  TKey extends string,
  TChunk extends z.ZodType,
  TEnd extends z.ZodType,
  TError extends z.ZodType,
>(
  stream: StreamContract<TChannel, TInput, TKey, TChunk, TEnd, TError>,
): { invoke: TChannel; receive: string[] } {
  return {
    invoke: stream.channel,
    receive: [
      stream.events.chunk.channel,
      stream.events.end.channel,
      stream.events.error.channel,
    ],
  };
}
