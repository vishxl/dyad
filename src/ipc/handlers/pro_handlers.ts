import { academyBaseUrl } from "../../external_endpoints";
import fetch from "node-fetch"; // Electron main process might need node-fetch
import { shell } from "electron";
import log from "electron-log";
import { createLoggedHandler } from "./safe_handle";
import { createLoggedTypedHandler } from "./base";
import { readSettings } from "../../main/settings"; // Assuming settings are read this way
import {
  SubscriptionStatusSchema,
  systemContracts,
  UserBudgetInfo,
  UserBudgetInfoSchema,
} from "@/ipc/types";
import { IS_TEST_BUILD } from "../utils/test_utils";
import {
  AUDIO_REQUEST_ID_PATTERN,
  audioContracts,
  MAX_AUDIO_FILENAME_LENGTH,
  MAX_AUDIO_RECORDING_BYTES,
  MAX_AUDIO_REQUEST_ID_LENGTH,
} from "../types/audio";
import type { TranscribeAudioParams } from "../types/audio";
import { transcribeWithNextBillionEngine } from "../utils/llm_engine_provider";
import { getNextBillionEngineBaseUrl } from "../utils/nextbillion_engine_url";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";

import { fetchUserInfo } from "../services/user_budget_service";
export {
  UserInfoResponseSchema,
  type UserInfoResponse,
} from "../services/user_budget_service";

const logger = log.scope("pro_handlers");
const handle = createLoggedHandler(logger);
const typedHandle = createLoggedTypedHandler(logger);

function validateAudioTranscriptionRequest(input: TranscribeAudioParams) {
  if (
    input.audioData.byteLength === 0 ||
    input.audioData.byteLength > MAX_AUDIO_RECORDING_BYTES
  ) {
    throw new NextBillionError(
      `Audio data must be between 1 and ${MAX_AUDIO_RECORDING_BYTES} bytes`,
      NextBillionErrorKind.Validation,
    );
  }

  const trimmedFilename = input.filename.trim();
  if (
    trimmedFilename.length === 0 ||
    trimmedFilename.length > MAX_AUDIO_FILENAME_LENGTH ||
    trimmedFilename.includes("/") ||
    trimmedFilename.includes("\\") ||
    trimmedFilename === "." ||
    trimmedFilename === ".."
  ) {
    throw new NextBillionError(
      "Invalid audio filename",
      NextBillionErrorKind.Validation,
    );
  }

  if (
    input.requestId.trim().length === 0 ||
    input.requestId.length > MAX_AUDIO_REQUEST_ID_LENGTH ||
    !AUDIO_REQUEST_ID_PATTERN.test(input.requestId)
  ) {
    throw new NextBillionError(
      "Invalid transcription request ID",
      NextBillionErrorKind.Validation,
    );
  }
}

function getSubscriptionStatusUrl() {
  return (
    process.env.NEXTBILLION_SUBSCRIPTION_STATUS_URL ??
    `${academyBaseUrl()}/api/desktop/subscription-status`
  );
}

function getSubscriptionStatusApiKey() {
  const url = getSubscriptionStatusUrl();
  const fixtureApiKey =
    process.env.NEXTBILLION_SUBSCRIPTION_STATUS_FIXTURE_API_KEY;
  if (fixtureApiKey) {
    try {
      const hostname = new URL(url).hostname;
      if (
        hostname === "127.0.0.1" ||
        hostname === "localhost" ||
        hostname === "[::1]"
      ) {
        return fixtureApiKey;
      }
    } catch {
      // The request path below will log and safely ignore an invalid URL.
    }
  }
  return readSettings().providerSettings?.auto?.apiKey?.value;
}

export function parseBillingActionUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new NextBillionError(
      "Invalid billing action URL",
      NextBillionErrorKind.Validation,
    );
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== new URL(academyBaseUrl()).hostname ||
    url.username !== "" ||
    url.password !== "" ||
    url.port !== ""
  ) {
    throw new NextBillionError(
      "Invalid billing action URL",
      NextBillionErrorKind.Validation,
    );
  }
  return url.toString();
}

export function registerProHandlers() {
  // This method should try to avoid throwing errors because this is auxiliary
  // information and isn't critical to using the app
  handle("get-user-budget", async (): Promise<UserBudgetInfo | null> => {
    if (IS_TEST_BUILD) {
      // Return mock budget data for E2E tests instead of spamming the API
      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 30); // Reset in 30 days
      return {
        usedCredits: 100,
        totalCredits: 1000,
        budgetResetDate: resetDate,
        redactedUserId: "<redacted-user-id-testing>",
        isTrial: false,
      };
    }
    logger.debug("Attempting to fetch user budget information.");

    const settings = readSettings();

    const apiKey = settings.providerSettings?.auto?.apiKey?.value;

    if (!apiKey) {
      // Expected state for non-Pro users; not an error.
      logger.debug("LLM Gateway API key (NextBillion Pro) is not configured.");
      return null;
    }

    try {
      const data = await fetchUserInfo(apiKey);

      // Turn user_abc1234 =>  "****1234"
      // Preserve the last 4 characters so we can correlate bug reports
      // with the user.
      const redactedUserId =
        data.userId.length > 8 ? "****" + data.userId.slice(-4) : "<redacted>";

      logger.debug("Successfully fetched user budget information.");

      // Transform to UserBudgetInfo format
      const userBudgetInfo = UserBudgetInfoSchema.parse({
        usedCredits: data.usedCredits,
        totalCredits: data.totalCredits,
        budgetResetDate: new Date(data.budgetResetDate),
        redactedUserId: redactedUserId,
        isTrial: data.isTrial,
      });

      return userBudgetInfo;
    } catch (error: any) {
      logger.error(`Error fetching user budget: ${error.message}`, error);
      return null;
    }
  });

  typedHandle(systemContracts.getSubscriptionStatus, async () => {
    const apiKey = getSubscriptionStatusApiKey();
    if (!apiKey) {
      return null;
    }
    if (IS_TEST_BUILD && !process.env.NEXTBILLION_SUBSCRIPTION_STATUS_URL) {
      return null;
    }

    try {
      const response = await fetch(getSubscriptionStatusUrl(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      if (!response.ok) {
        logger.warn(
          `Failed to fetch subscription status. Status: ${response.status}`,
        );
        return null;
      }
      return SubscriptionStatusSchema.parse(await response.json());
    } catch (error) {
      logger.error("Failed to fetch subscription status", error);
      return null;
    }
  });

  typedHandle(systemContracts.openBillingAction, async (_event, value) => {
    const url = parseBillingActionUrl(value);
    if (IS_TEST_BUILD) {
      logger.debug("E2E test mode: skipped opening billing action URL", url);
      return;
    }
    await shell.openExternal(url);
  });

  typedHandle(
    audioContracts.transcribeAudio,
    async (_event, input: TranscribeAudioParams) => {
      const settings = readSettings();
      const apiKey = settings.providerSettings?.auto?.apiKey?.value;

      if (!apiKey || !settings.enableNextBillionPro) {
        throw new NextBillionError(
          "NextBillion Pro is not enabled. Voice-to-text requires a Pro subscription.",
          NextBillionErrorKind.Auth,
        );
      }

      validateAudioTranscriptionRequest(input);

      const audioBuffer = Buffer.from(
        input.audioData.buffer,
        input.audioData.byteOffset,
        input.audioData.byteLength,
      );

      const text = await transcribeWithNextBillionEngine(
        audioBuffer,
        input.filename,
        input.requestId,
        {
          apiKey,
          baseURL: getNextBillionEngineBaseUrl(),
          nextBillionOptions: {},
          settings,
        },
      );

      return { text };
    },
  );
}
