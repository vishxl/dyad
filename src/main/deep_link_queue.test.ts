import { describe, expect, it, vi } from "vitest";
import { createDeepLinkQueue } from "@/main/deep_link_queue";

describe("createDeepLinkQueue", () => {
  it("queues deep links until the app is marked ready", () => {
    const handler = vi.fn();
    const queue = createDeepLinkQueue(handler);

    queue.handle("nextbillion://one");
    queue.handle("nextbillion://two");

    expect(handler).not.toHaveBeenCalled();

    queue.markReady();

    expect(handler).toHaveBeenNthCalledWith(1, "nextbillion://one");
    expect(handler).toHaveBeenNthCalledWith(2, "nextbillion://two");
  });

  it("handles deep links immediately after the app is marked ready", () => {
    const handler = vi.fn();
    const queue = createDeepLinkQueue(handler);

    queue.markReady();
    queue.handle("nextbillion://ready");
    queue.markReady();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith("nextbillion://ready");
  });

  it("queues again while a newly targeted window is loading", () => {
    const handler = vi.fn();
    const queue = createDeepLinkQueue(handler);
    queue.markReady();
    queue.markNotReady();

    queue.handle("nextbillion://new-window");
    expect(handler).not.toHaveBeenCalled();

    queue.markReady();
    expect(handler).toHaveBeenCalledWith("nextbillion://new-window");
  });
});
