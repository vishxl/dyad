import { expect, it } from "vitest";
import {
  modelForChatBackend,
  requiresNewChatForModel,
} from "./execution_backend";

it.each(["nextbillion", "claude-code"] as const)(
  "uses the %s chat backend and allows empty-chat switches",
  (executionBackend) => {
    for (const provider of ["openai", "claude-code"]) {
      expect(
        requiresNewChatForModel(
          { executionBackend, messages: [] },
          { provider },
        ),
      ).toBe(false);
      expect(
        requiresNewChatForModel(
          { executionBackend, messages: [{ role: "user" }] },
          { provider },
        ),
      ).toBe(
        (provider === "claude-code") !== (executionBackend === "claude-code"),
      );
    }
  },
);
it("treats legacy populated chats as NextBillion", () => {
  expect(
    requiresNewChatForModel({ messages: [{}] }, { provider: "claude-code" }),
  ).toBe(true);
});
it("keeps legacy NextBillion chats on their backend when the global default is Claude", () => {
  const selectedModel = { provider: "claude-code", name: "sonnet" };
  const previous = { provider: "anthropic", name: "claude-sonnet" };
  expect(
    modelForChatBackend(
      { executionBackend: "nextbillion" },
      { selectedModel, recentModels: [selectedModel, previous] },
    ),
  ).toEqual(previous);
  expect(
    modelForChatBackend({ executionBackend: "nextbillion" }, { selectedModel }),
  ).toEqual({ provider: "auto", name: "auto" });
  expect(
    modelForChatBackend(null, {
      selectedModel,
      enableClaudeCodeSubscription: true,
    }),
  ).toEqual(selectedModel);
  expect(modelForChatBackend(null, { selectedModel })).toEqual({
    provider: "auto",
    name: "auto",
  });
  expect(
    modelForChatBackend(
      {
        executionBackend: "nextbillion",
        modelSelection: { ...previous, effortLevel: "medium" },
      },
      { selectedModel },
    ),
  ).toMatchObject(previous);
});
