// Read-only compatibility for persisted cards produced by prototype commit
// 171069cc4 (native-tool backend), before 868819db7 migrated to shared NextBillion cards.
// No current execution path produces this tag.
import { claudeToolCardSchema } from "@/shared/claude_tool_cards";
import { NextBillionRead } from "./NextBillionRead";
import { NextBillionListFiles } from "./NextBillionListFiles";
import { NextBillionWrite } from "./NextBillionWrite";
import { NextBillionSearchReplace } from "./NextBillionSearchReplace";
import { NextBillionLogs } from "./NextBillionLogs";
import { NextBillionAddDependency } from "./NextBillionAddDependency";
import { NextBillionStatus } from "./NextBillionStatus";

// This tag contains escaped JSON display data. Never send its fields through
// the markdown/action parser, even if file contents contain NextBillion tags.
export function ClaudeCodeToolCard({ content }: { content: string }) {
  let value: unknown;
  try {
    value = JSON.parse(content);
  } catch {
    return null;
  }
  const parsed = claudeToolCardSchema.safeParse(value);
  if (!parsed.success) return null;
  const card = parsed.data;
  const node = { properties: { ...card, description: card.summary } };
  switch (card.kind) {
    case "read":
      return (
        <NextBillionRead node={node}>
          {card.state === "error" ? card.summary : undefined}
        </NextBillionRead>
      );
    case "list":
      return (
        <NextBillionListFiles
          node={{ properties: { ...card, directory: card.path } }}
        >
          {card.body}
        </NextBillionListFiles>
      );
    case "write":
      return (
        <NextBillionWrite node={node} allowEdit={false}>
          {card.body}
        </NextBillionWrite>
      );
    case "edit":
      return (
        <NextBillionSearchReplace
          node={node}
          blocks={card.blocks?.filter(
            (b) => b.searchContent || b.replaceContent,
          )}
        />
      );
    case "logs":
      return <NextBillionLogs node={node}>{card.body}</NextBillionLogs>;
    case "packages":
      return (
        <NextBillionAddDependency node={node} execution>
          {card.body}
        </NextBillionAddDependency>
      );
    case "status":
      return (
        <NextBillionStatus node={node}>
          {[card.summary, card.body].filter(Boolean).join("\n")}
        </NextBillionStatus>
      );
  }
}
