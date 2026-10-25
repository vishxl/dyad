import { expect, it } from "vitest";
import type { UserSettings } from "@/lib/schemas";
import { subscriptionBillingKey } from "./subscription_billing";
it.each(["build", "ask", "plan", "local-agent"] as const)(
  "captures the shared subscription billing key for %s",
  (selectedChatMode) => {
    for (const enableNextBillionPro of [true, false]) {
      const settings = {
        selectedChatMode,
        enableNextBillionPro,
        providerSettings: { auto: { apiKey: { value: "accepted-test-key" } } },
      } as unknown as UserSettings;
      expect(subscriptionBillingKey(settings)).toBe(
        enableNextBillionPro && selectedChatMode === "local-agent"
          ? "accepted-test-key"
          : null,
      );
    }
  },
);
