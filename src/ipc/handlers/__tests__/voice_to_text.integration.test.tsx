import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { cleanup, screen, waitFor } from "@testing-library/react";

import type { UserSettings } from "@/lib/schemas";
import { writeSettings } from "@/main/settings";
import {
  setupHybridChatHarness,
  type HybridChatHarness,
} from "@/testing/hybrid_chat_harness";
import { h } from "@/testing/hybrid.setup";

const PRO_SETTINGS: Partial<UserSettings> = {
  enableNextBillionPro: true,
  providerSettings: {
    auto: {
      apiKey: { value: "testnextbillionkey" },
    },
  },
};

describe("voice-to-text chat input controls (integration)", () => {
  let harness: HybridChatHarness;

  beforeAll(async () => {
    harness = await setupHybridChatHarness({
      electronMock: h,
      autoApprove: true,
      // Tests below enable NextBillion Pro, which triggers free-quota fetches; route
      // them to the fake engine instead of the real engine.dyad.sh.
      engine: true,
      settings: { isTestMode: true },
    });
  }, 60_000);

  afterEach(() => {
    cleanup();
    writeSettings({
      enableNextBillionPro: false,
      providerSettings: {},
    });
  });

  afterAll(async () => {
    await harness?.dispose();
  });

  it("shows an enabled mic button for Pro users", async () => {
    writeSettings(PRO_SETTINGS);
    const chatId = await harness.createChat();
    harness.mount({ chatId });

    const micButton = await screen.findByRole("button", {
      name: "Voice to text",
    });
    expect(micButton).toBeTruthy();
    expect((micButton as HTMLButtonElement).disabled).toBe(false);
  });

  it("hides the mic button for non-Pro users", async () => {
    writeSettings({
      enableNextBillionPro: false,
      providerSettings: {},
    });
    const chatId = await harness.createChat();
    harness.mount({ chatId });

    await screen.findByTestId("chat-input-container");
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: /Voice to text/ }),
      ).toBeNull(),
    );
  });
});
