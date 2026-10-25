import { SubscriptionBillingError } from "@/shared/subscription_billing_error";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChatErrorBox } from "./ChatErrorBox";

const mocks = vi.hoisted(() => ({
  openExternalUrl: vi.fn(),
  isTrial: false as boolean | null,
}));

vi.mock("@/ipc/types", () => ({
  ipc: { system: { openExternalUrl: mocks.openExternalUrl } },
}));

vi.mock("@/hooks/useFreeAgentQuota", () => ({
  useFreeAgentQuota: () => ({
    messagesLimit: 10,
    resetTime: null,
  }),
}));

vi.mock("@/hooks/useFreeModelQuota", () => ({
  useFreeModelQuota: () => ({
    messagesLimit: 5,
    resetTime: null,
  }),
}));

vi.mock("@/hooks/useUserBudgetInfo", () => ({
  useUserBudgetInfo: () => ({
    userBudget: mocks.isTrial === null ? null : { isTrial: mocks.isTrial },
  }),
}));

describe("ChatErrorBox Basic Agent quota error", () => {
  beforeEach(() => {
    mocks.openExternalUrl.mockReset();
  });

  it("offers a non-retrying Build switch", () => {
    const onDismiss = vi.fn();
    const onSwitchToBuildMode = vi.fn();

    render(
      <ChatErrorBox
        error='{"type":"FREE_AGENT_QUOTA_EXCEEDED","resetTime":1787295600000}'
        isNextBillionProEnabled={false}
        onDismiss={onDismiss}
        onSwitchToBuildMode={onSwitchToBuildMode}
      />,
    );

    expect(
      screen.getByText(/used all 10 free Agentic Mode messages/),
    ).toBeTruthy();
    expect(screen.getByText(/Your quota resets at/)).toBeTruthy();

    expect(screen.queryByText("Upgrade to NextBillion Pro")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Switch to Build" }));
    expect(onSwitchToBuildMode).toHaveBeenCalledOnce();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("explains that NextBillion Free must be changed before using Build", () => {
    render(
      <ChatErrorBox
        error='{"type":"FREE_AGENT_QUOTA_EXCEEDED","resetTime":1787295600000}'
        isNextBillionProEnabled={false}
        onDismiss={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/first choose a model other than NextBillion Free/),
    ).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Switch to Build" }),
    ).toBeNull();
  });
});

describe("ChatErrorBox error presentation", () => {
  it("bounds long string errors in a scrollable region", () => {
    render(
      <ChatErrorBox
        error={`Implementer failures:\n${"Detailed failure line\n".repeat(200)}`}
        isNextBillionProEnabled
        onDismiss={vi.fn()}
      />,
    );

    const scrollRegion = screen
      .getByTestId("chat-error-box")
      .querySelector(".overflow-y-auto");
    expect(scrollRegion?.className).toContain("max-h-64");
    expect(scrollRegion?.className).toContain("scrollbar-on-hover");
  });
});

describe("ChatErrorBox subscription billing errors", () => {
  it.each([
    ["OUT_OF_CREDITS", "Add credits to continue using your subscription."],
    ["KEY_REJECTED", "Check your Pro key in settings."],
  ] as const)(
    "shows the right notice for %s, without an external link",
    (code, message) => {
      mocks.openExternalUrl.mockReset();
      render(
        <ChatErrorBox
          error={new SubscriptionBillingError(code).serialize()}
          isNextBillionProEnabled
          onDismiss={vi.fn()}
          onStartNewChat={vi.fn()}
        />,
      );
      expect(screen.getByText(message)).toBeTruthy();
      expect(screen.queryByText("Start new chat")).toBeNull();
      expect(screen.queryByText("Read docs")).toBeNull();
      expect(mocks.openExternalUrl).not.toHaveBeenCalled();
    },
  );
});

describe("ChatErrorBox exhausted credit notice", () => {
  it.each([false, true, null])(
    "shows the credit notice without external links (trial: %s)",
    (isTrial) => {
      mocks.isTrial = isTrial;
      mocks.openExternalUrl.mockReset();
      const onDismiss = vi.fn();
      render(
        <ChatErrorBox
          error="ExceededBudget: exhausted"
          isNextBillionProEnabled
          onDismiss={onDismiss}
          onStartNewChat={vi.fn()}
        />,
      );
      expect(screen.getByText("You’re out of AI credits")).toBeTruthy();
      expect(screen.queryByText(/this month/)).toBeNull();
      if (isTrial !== false) {
        expect(screen.queryByText(/Switch to the Free model/)).toBeNull();
        expect(screen.getByText("Add credits to continue.")).toBeTruthy();
      } else {
        expect(
          screen.getByText(
            "Switch to the Free model for 5 free messages per day, or add credits to continue.",
          ),
        ).toBeTruthy();
      }
      expect(screen.queryByText("Start new chat")).toBeNull();
      expect(
        screen.queryByRole("button", { name: "Get more credits" }),
      ).toBeNull();
      fireEvent.click(
        screen.getByRole("button", { name: "Dismiss billing notice" }),
      );
      expect(onDismiss).toHaveBeenCalledOnce();
      mocks.isTrial = false;
    },
  );
});

describe("ChatErrorBox legacy rejected Pro key", () => {
  it.each([false, true])(
    "shows the rejected-key notice (Pro enabled: %s)",
    (isNextBillionProEnabled) => {
      mocks.openExternalUrl.mockReset();
      const onDismiss = vi.fn();
      render(
        <ChatErrorBox
          error="Provider returned error: LiteLLM Virtual Key expected"
          isNextBillionProEnabled={isNextBillionProEnabled}
          onDismiss={onDismiss}
          onStartNewChat={vi.fn()}
        />,
      );
      expect(
        screen.getByText("Your NextBillion Pro key was rejected"),
      ).toBeTruthy();
      expect(screen.getByText("Check your Pro key in settings.")).toBeTruthy();
      expect(screen.queryByText("Upgrade to NextBillion Pro")).toBeNull();
      expect(screen.queryByText("Start new chat")).toBeNull();
      expect(screen.queryByText("Read docs")).toBeNull();
      expect(
        screen.queryByRole("button", { name: "Open membership portal" }),
      ).toBeNull();
      fireEvent.click(
        screen.getByRole("button", { name: "Dismiss billing notice" }),
      );
      expect(onDismiss).toHaveBeenCalledOnce();
    },
  );
});

it("recognizes a legacy rejected key inside fallback details", () => {
  render(
    <ChatErrorBox
      error={
        'All models failed. Fallbacks=[{"error":"LiteLLM Virtual Key expected"}]'
      }
      isNextBillionProEnabled
      onDismiss={vi.fn()}
    />,
  );
  expect(
    screen.getByText("Your NextBillion Pro key was rejected"),
  ).toBeTruthy();
});
