import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  type HandlerTestHarness,
  setupHandlerTestHarness,
} from "@/testing/handler_test_harness";
import { registerAppBlueprintHandlers } from "./app_blueprint_handlers";

describe("app-blueprint:get-state", () => {
  let harness: HandlerTestHarness;

  beforeEach(() => {
    harness = setupHandlerTestHarness();
    registerAppBlueprintHandlers();
  });

  afterEach(() => {
    harness.dispose();
  });

  it("returns an empty list when the store has no blueprints", async () => {
    expect(await harness.invokeHandler("app-blueprint:get-state")).toEqual([]);
  });

  it("returns stored blueprints keyed by chat with their approved flag", async () => {
    const { setAppBlueprintForChat } = await import("./app_blueprint_handlers");
    setAppBlueprintForChat(7, {
      appName: "FreshBite",
      userPrompt: "Build me a restaurant website",
      attachments: [],
      templateId: "react",
      themeId: "default",
      designDirection: "Warm and inviting",
      primaryColor: "#E85D04",
      visuals: [],
    });

    const entries = await harness.invokeHandler<
      Array<{ chatId: number; approved: boolean; data: unknown }>
    >("app-blueprint:get-state");

    expect(entries).toHaveLength(1);
    expect(entries[0].chatId).toBe(7);
    expect(entries[0].approved).toBe(false);
    expect(entries[0].data).toMatchObject({ appName: "FreshBite" });
  });
});
