import { OpenAICompatibleChatLanguageModel } from "@ai-sdk/openai-compatible";
import { OpenAIResponsesLanguageModel } from "@ai-sdk/openai/internal";
import { createAnthropic } from "@ai-sdk/anthropic";
import {
  FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from "@ai-sdk/provider-utils";

import log from "electron-log";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";
import { getExtraProviderOptionsForEngine } from "./thinking_utils";
import { getTestFetchOption } from "./test_fetch_override";
import { NEXTBILLION_INTERNAL_REQUEST_ID_HEADER } from "./provider_options";
import {
  describeRequestUrl,
  fetchWithRequestLogging,
} from "./model_request_logging";
import type { ModelSelection, UserSettings } from "../../lib/schemas";
import type { LanguageModel } from "ai";
import {
  findInvalidProviderApiKeyCharacter,
  formatInvalidProviderApiKeyMessage,
  normalizeProviderApiKeyInput,
} from "@/lib/providerApiKey";

import { withAnthropicPreservedThinking } from "./anthropic_preserved_thinking";

const logger = log.scope("llm_engine_provider");

export type ExampleChatModelId = string & {};
export interface ChatParams {
  providerId: string;
}

type NextBillionEngineProviderOptions = Record<string, any>;

export interface ExampleProviderSettings {
  /**
Example API key.
*/
  apiKey?: string;
  /**
Base URL for the API calls.
*/
  baseURL?: string;
  /**
Custom headers to include in the requests.
*/
  headers?: Record<string, string>;
  /**
Optional custom url query parameters to include in request urls.
*/
  queryParams?: Record<string, string>;
  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
*/
  fetch?: FetchFunction;

  nextBillionOptions: {
    enableLazyEdits?: boolean;
    enableSmartFilesContext?: boolean;
    enableWebSearch?: boolean;
  };
  settings: UserSettings;
  modelSelection?: ModelSelection;
}

export interface NextBillionEngineProvider {
  /**
Creates a model for text generation.
*/
  (modelId: ExampleChatModelId, chatParams: ChatParams): LanguageModel;

  /**
Creates a chat model for text generation.
*/
  chatModel(modelId: ExampleChatModelId, chatParams: ChatParams): LanguageModel;

  freeChatModel(
    modelId: ExampleChatModelId,
    chatParams: ChatParams,
  ): LanguageModel;

  responses(modelId: ExampleChatModelId, chatParams: ChatParams): LanguageModel;

  anthropic(modelId: ExampleChatModelId, chatParams: ChatParams): LanguageModel;
}

// The Engine's free route only accepts text and image parts, so callers need
// to know when a model uses it before sending files.
const engineFreeModels = new WeakSet<object>();

export function isNextBillionEngineFreeModel(model: LanguageModel) {
  return typeof model === "object" && engineFreeModels.has(model);
}

export function createNextBillionEngine(
  options: ExampleProviderSettings,
): NextBillionEngineProvider {
  const modelSelection =
    options.modelSelection ??
    ({
      ...options.settings.selectedModel,
      effortLevel: "medium",
    } satisfies ModelSelection);
  const baseURL = withoutTrailingSlash(options.baseURL);
  logger.debug("creating nextbillion engine with baseURL", baseURL);

  // Track request ID attempts
  const requestIdAttempts = new Map<string, number>();

  const getHeaders = () => ({
    Authorization: `Bearer ${getNextBillionEngineApiKey(options.apiKey)}`,
    ...options.headers,
  });

  interface CommonModelConfig {
    provider: string;
    url: ({ path }: { path: string }) => string;
    headers: () => Record<string, string>;
    fetch?: FetchFunction;
  }

  const getCommonModelConfig = (pathPrefix = ""): CommonModelConfig => ({
    provider: `nextbillion-engine`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${pathPrefix}${path}`);
      if (options.queryParams) {
        url.search = new URLSearchParams(options.queryParams).toString();
      }
      return url.toString();
    },
    headers: getHeaders,
    fetch: options.fetch,
  });

  const appendQueryParams = (input: RequestInfo | URL): RequestInfo | URL => {
    if (!options.queryParams) {
      return input;
    }

    const appendToUrl = (urlValue: string) => {
      const url = new URL(urlValue);
      for (const [key, value] of Object.entries(options.queryParams ?? {})) {
        url.searchParams.set(key, value);
      }
      return url.toString();
    };

    if (typeof input === "string") {
      return appendToUrl(input);
    }
    if (input instanceof URL) {
      return new URL(appendToUrl(input.toString()));
    }
    if (input instanceof Request) {
      return new Request(appendToUrl(input.url), input);
    }
    return input;
  };

  // Custom fetch implementation that adds nextbillion-specific options to the request
  const createNextBillionFetch = ({
    providerId,
    nextBillionProviderOptions,
    disableNextBillionOptions = false,
    includeFreeQuotaKey = false,
  }: {
    providerId: string;
    nextBillionProviderOptions?: NextBillionEngineProviderOptions;
    disableNextBillionOptions?: boolean;
    includeFreeQuotaKey?: boolean;
  }): FetchFunction => {
    return (input: RequestInfo | URL, init?: RequestInit) => {
      const requestInput = appendQueryParams(input);

      // Use default fetch if no init or body
      if (!init || !init.body || typeof init.body !== "string") {
        return (options.fetch || fetch)(requestInput, init);
      }

      try {
        // Parse the request body to manipulate it
        const parsedBody = {
          ...JSON.parse(init.body),
          ...getExtraProviderOptionsForEngine(providerId, modelSelection),
        };

        const getNextBillionOption = (key: string) =>
          key in parsedBody
            ? parsedBody[key]
            : nextBillionProviderOptions?.[key];

        const nextBillionVersionedFiles = getNextBillionOption(
          "nextBillionVersionedFiles",
        );
        if ("nextBillionVersionedFiles" in parsedBody) {
          delete parsedBody.nextBillionVersionedFiles;
        }
        const nextBillionFiles = getNextBillionOption("nextBillionFiles");
        if ("nextBillionFiles" in parsedBody) {
          delete parsedBody.nextBillionFiles;
        }
        // Read from body (OpenAICompatible models spread providerOptions into
        // the body) with a fallback to an internal header (OpenAIResponses
        // models don't forward providerOptions, so we pass it via header).
        const requestId =
          getNextBillionOption("nextBillionRequestId") ??
          (init.headers as Record<string, string> | undefined)?.[
            NEXTBILLION_INTERNAL_REQUEST_ID_HEADER
          ];
        if ("nextBillionRequestId" in parsedBody) {
          delete parsedBody.nextBillionRequestId;
        }
        const nextBillionAppId = getNextBillionOption("nextBillionAppId");
        if ("nextBillionAppId" in parsedBody) {
          delete parsedBody.nextBillionAppId;
        }
        const nextBillionDisableFiles =
          disableNextBillionOptions ||
          getNextBillionOption("nextBillionDisableFiles");
        if ("nextBillionDisableFiles" in parsedBody) {
          delete parsedBody.nextBillionDisableFiles;
        }
        const nextBillionMentionedApps = getNextBillionOption(
          "nextBillionMentionedApps",
        );
        if ("nextBillionMentionedApps" in parsedBody) {
          delete parsedBody.nextBillionMentionedApps;
        }
        const nextBillionSmartContextMode = getNextBillionOption(
          "nextBillionSmartContextMode",
        );
        if ("nextBillionSmartContextMode" in parsedBody) {
          delete parsedBody.nextBillionSmartContextMode;
        }

        // Track and modify requestId with attempt number
        let modifiedRequestId = requestId;
        if (requestId) {
          const currentAttempt = (requestIdAttempts.get(requestId) || 0) + 1;
          requestIdAttempts.set(requestId, currentAttempt);
          modifiedRequestId = `${requestId}:attempt-${currentAttempt}`;
        }

        // Add files to the request if they exist
        if (!nextBillionDisableFiles) {
          parsedBody.dyad_options = {
            files: nextBillionFiles,
            versioned_files: nextBillionVersionedFiles,
            enable_lazy_edits: options.nextBillionOptions.enableLazyEdits,
            enable_smart_files_context:
              options.nextBillionOptions.enableSmartFilesContext,
            smart_context_mode: nextBillionSmartContextMode,
            enable_web_search: options.nextBillionOptions.enableWebSearch,
            app_id: nextBillionAppId,
          };
          if (nextBillionMentionedApps?.length) {
            parsedBody.dyad_options.mentioned_apps = nextBillionMentionedApps;
          }
        }

        // Return modified request with files included and requestId in headers
        const {
          [NEXTBILLION_INTERNAL_REQUEST_ID_HEADER]: _,
          ...outgoingHeaders
        } = (init.headers as Record<string, string>) ?? {};
        const modifiedInit = {
          ...init,
          headers: {
            ...outgoingHeaders,
            ...(modifiedRequestId && {
              "X-Dyad-Request-Id": modifiedRequestId,
            }),
            ...(includeFreeQuotaKey &&
              requestId && {
                "X-Dyad-Free-Quota-Key": requestId,
              }),
          },
          body: JSON.stringify(parsedBody),
        };

        // Use the provided fetch or default fetch
        const fetchFn =
          providerId === "anthropic"
            ? withAnthropicPreservedThinking(options.fetch)
            : options.fetch || fetch;
        return fetchWithRequestLogging(
          modifiedRequestId ?? "engine",
          describeRequestUrl(requestInput),
          () => fetchFn(requestInput, modifiedInit),
        );
      } catch (e) {
        logger.error("Error parsing request body", e);
        // If parsing fails, use original request
        return (options.fetch || fetch)(requestInput, init);
      }
    };
  };

  const createChatModel = (
    modelId: ExampleChatModelId,
    chatParams: ChatParams,
    pathPrefix = "",
  ) => {
    const config = {
      ...getCommonModelConfig(pathPrefix),
      fetch: createNextBillionFetch({
        providerId: chatParams.providerId,
        disableNextBillionOptions: pathPrefix === "/free",
        includeFreeQuotaKey: pathPrefix === "/free",
      }),
    };

    return new OpenAICompatibleChatLanguageModel(modelId, config);
  };

  const createFreeChatModel = (
    modelId: ExampleChatModelId,
    chatParams: ChatParams,
  ) => {
    const model = createChatModel(modelId, chatParams, "/free");
    engineFreeModels.add(model);
    return model;
  };

  const createResponsesModel = (
    modelId: ExampleChatModelId,
    chatParams: ChatParams,
  ) => {
    const config = {
      ...getCommonModelConfig(),
      fetch: createNextBillionFetch({ providerId: chatParams.providerId }),
    };

    return new OpenAIResponsesLanguageModel(modelId, config);
  };

  const createAnthropicModel = (
    modelId: ExampleChatModelId,
    chatParams: ChatParams,
  ) => {
    const createModel = (
      nextBillionProviderOptions?: NextBillionEngineProviderOptions,
    ) => {
      const provider = createAnthropic({
        authToken: getNextBillionEngineApiKey(options.apiKey),
        baseURL,
        headers: options.headers,
        fetch: createNextBillionFetch({
          providerId: chatParams.providerId,
          nextBillionProviderOptions,
        }),
        name: "nextbillion-engine",
      });

      return provider(modelId);
    };
    const model = createModel();
    const getNextBillionProviderOptions = (callOptions: {
      providerOptions?: Record<string, unknown>;
    }) =>
      callOptions.providerOptions?.["nextbillion-engine"] as
        | NextBillionEngineProviderOptions
        | undefined;

    const wrappedModel = {
      specificationVersion: model.specificationVersion,
      provider: model.provider,
      modelId: model.modelId,
      supportedUrls: model.supportedUrls,
      doGenerate: (callOptions) =>
        createModel(getNextBillionProviderOptions(callOptions)).doGenerate(
          callOptions,
        ),
      doStream: (callOptions) =>
        createModel(getNextBillionProviderOptions(callOptions)).doStream(
          callOptions,
        ),
    } satisfies LanguageModel;

    const defaultObjectGenerationMode = (
      model as LanguageModel & { defaultObjectGenerationMode?: unknown }
    ).defaultObjectGenerationMode;
    if (defaultObjectGenerationMode !== undefined) {
      Object.assign(wrappedModel, { defaultObjectGenerationMode });
    }

    return wrappedModel;
  };

  const provider = (modelId: ExampleChatModelId, chatParams: ChatParams) =>
    createChatModel(modelId, chatParams);

  provider.chatModel = createChatModel;
  provider.freeChatModel = createFreeChatModel;
  provider.responses = createResponsesModel;
  provider.anthropic = createAnthropicModel;

  return provider;
}

export async function transcribeWithNextBillionEngine(
  audioBuffer: Buffer,
  filename: string,
  requestId: string,
  options: ExampleProviderSettings,
): Promise<string> {
  const baseURL = withoutTrailingSlash(options.baseURL);
  const apiKey = getNextBillionEngineApiKey(options.apiKey);
  logger.info("transcribing with nextbillion engine with baseURL", baseURL);

  const formData = new FormData();
  const mimeType = filename.endsWith(".webm")
    ? "audio/webm"
    : filename.endsWith(".mp3")
      ? "audio/mpeg"
      : filename.endsWith(".wav")
        ? "audio/wav"
        : filename.endsWith(".m4a")
          ? "audio/mp4"
          : "audio/webm";
  const audioBytes = new Uint8Array(
    audioBuffer.buffer as ArrayBuffer,
    audioBuffer.byteOffset,
    audioBuffer.byteLength,
  );
  const blob = new Blob([audioBytes], { type: mimeType });
  formData.append("file", blob, filename);
  formData.append("model", "dyad/transcribe");

  const fetchFn = options.fetch || getTestFetchOption().fetch || fetch;
  const response = await fetchFn(`${baseURL}/audio/transcriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-Dyad-Request-Id": requestId,
      ...options.headers,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new NextBillionError(
      `NextBillion Engine transcription failed: ${response.status} ${response.statusText} - ${errorText}`,
      NextBillionErrorKind.External,
    );
  }
  const data = (await response.json()) as { text: string };
  return data.text;
}

function getNextBillionEngineApiKey(apiKey: string | undefined): string {
  const loadedApiKey = loadApiKey({
    apiKey,
    environmentVariableName: "NEXTBILLION_PRO_API_KEY",
    description: "NextBillion Pro API key",
  });
  const normalizedApiKey = normalizeProviderApiKeyInput(loadedApiKey);
  const invalidCharacter = findInvalidProviderApiKeyCharacter(normalizedApiKey);
  if (invalidCharacter) {
    throw new NextBillionError(
      formatInvalidProviderApiKeyMessage("NextBillion", invalidCharacter),
      NextBillionErrorKind.Validation,
    );
  }
  return normalizedApiKey;
}
