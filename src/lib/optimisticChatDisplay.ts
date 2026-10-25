import { buildNextBillionAttachmentTag } from "../../shared/nextBillionAttachment";
import {
  parseMediaMentions,
  stripResolvedMediaMentions,
} from "@/shared/parse_media_mentions";

/** Render composer media from already loaded metadata without waiting on IPC. */
export function buildOptimisticChatDisplay(
  prompt: string,
  appPath: string | undefined,
  files: readonly { fileName: string; mimeType: string }[],
): string {
  const refs = [...new Set(parseMediaMentions(prompt))];
  const tags = refs
    .map((ref) => {
      let name: string;
      try {
        name = decodeURIComponent(ref);
      } catch {
        name = ref;
      }
      const file = files.find((candidate) => candidate.fileName === name);
      return buildNextBillionAttachmentTag({
        name,
        type: file?.mimeType ?? "application/octet-stream",
        url:
          appPath && file
            ? `nextbillion-media://media/${encodeURIComponent(appPath)}/.nextbillion/media/${encodeURIComponent(name)}`
            : "",
        path: "",
        attachmentType: "chat-context",
      });
    })
    .join("");
  return stripResolvedMediaMentions(prompt, refs) + tags;
}
