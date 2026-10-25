import { describe, expect, it } from "vitest";
import { buildOptimisticChatDisplay } from "./optimisticChatDisplay";
import { buildNextBillionAttachmentTag } from "../../shared/nextBillionAttachment";

describe("optimistic media display", () => {
  it("renders selected and generated media as attachments without exposing wire tokens", () => {
    const display = buildOptimisticChatDisplay(
      "Use @media:my%20image.png and @media:generated.png",
      "my app",
      [
        { fileName: "my image.png", mimeType: "image/png" },
        { fileName: "generated.png", mimeType: "image/png" },
      ],
    );
    expect(display).not.toContain("@media:");
    expect(display).toContain('name="my image.png"');
    expect(display).toContain(
      'url="nextbillion-media://media/my%20app/.nextbillion/media/generated.png"',
    );
    expect(display).toContain('type="image/png"');
  });

  it("shows a filename fallback when media metadata is not loaded", () => {
    expect(
      buildOptimisticChatDisplay("@media:file.txt", undefined, []),
    ).toContain('name="file.txt"');
    expect(
      buildOptimisticChatDisplay("@media:file.txt", undefined, []),
    ).not.toContain("@media:");
  });

  it("uses one escaped display-tag format for local and persisted attachments", () => {
    expect(
      buildNextBillionAttachmentTag({
        name: 'a"<&.png',
        type: "image/png",
        url: "blob:preview",
        path: "",
        attachmentType: "chat-context",
      }),
    ).toBe(
      '\n<nextbillion-attachment name="a&quot;&lt;&amp;.png" type="image/png" url="blob:preview" path="" attachment-type="chat-context"></nextbillion-attachment>\n',
    );
  });
});
