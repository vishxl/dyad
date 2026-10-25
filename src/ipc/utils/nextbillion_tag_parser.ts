import { normalizePath } from "../../../shared/normalizePath";
import { unescapeXmlAttr, unescapeXmlContent } from "../../../shared/xmlEscape";
import log from "electron-log";
import { SqlQuery } from "../../lib/schemas";

const logger = log.scope("nextbillion_tag_parser");

interface NextBillionFileTag {
  path: string;
  content: string;
  description?: string;
}

function escapeRegexLiteral(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Parse `<tagName path="..." description="...">content</tagName>` occurrences
 * into file tags. Used for `<nextbillion-write>`: a `path`/`description` plus a body
 * with optional surrounding markdown fences.
 */
function parseNextBillionFileTags(
  fullResponse: string,
  tagName: string,
): NextBillionFileTag[] {
  const escapedTagName = escapeRegexLiteral(tagName);
  const tagRegex = new RegExp(
    `<${escapedTagName}([^>]*)>([\\s\\S]*?)</${escapedTagName}>`,
    "gi",
  );
  const pathRegex = /path="([^"]+)"/;
  const descriptionRegex = /description="([^"]+)"/;

  let match;
  const tags: NextBillionFileTag[] = [];

  while ((match = tagRegex.exec(fullResponse)) !== null) {
    const attributesString = match[1];
    let content = unescapeXmlContent(match[2].trim());

    const pathMatch = pathRegex.exec(attributesString);
    const descriptionMatch = descriptionRegex.exec(attributesString);

    if (pathMatch && pathMatch[1]) {
      const path = unescapeXmlAttr(pathMatch[1]);
      const description = descriptionMatch?.[1]
        ? unescapeXmlAttr(descriptionMatch[1])
        : undefined;

      const contentLines = content.split("\n");
      if (contentLines[0]?.startsWith("```")) {
        contentLines.shift();
      }
      if (contentLines[contentLines.length - 1]?.startsWith("```")) {
        contentLines.pop();
      }
      content = contentLines.join("\n");

      tags.push({ path: normalizePath(path), content, description });
    } else {
      logger.warn(
        `Found <${tagName}> tag without a valid 'path' attribute:`,
        match[0],
      );
    }
  }
  return tags;
}

export function getNextBillionWriteTags(
  fullResponse: string,
): NextBillionFileTag[] {
  return parseNextBillionFileTags(fullResponse, "nextbillion-write");
}

export function getNextBillionRenameTags(fullResponse: string): {
  from: string;
  to: string;
}[] {
  const nextBillionRenameRegex =
    /<nextbillion-rename from="([^"]+)" to="([^"]+)"[^>]*>([\s\S]*?)<\/nextbillion-rename>/g;
  let match;
  const tags: { from: string; to: string }[] = [];
  while ((match = nextBillionRenameRegex.exec(fullResponse)) !== null) {
    tags.push({
      from: normalizePath(unescapeXmlAttr(match[1])),
      to: normalizePath(unescapeXmlAttr(match[2])),
    });
  }
  return tags;
}

export function getNextBillionCopyTags(fullResponse: string): {
  from: string;
  to: string;
  description?: string;
}[] {
  const nextBillionCopyRegex =
    /<nextbillion-copy([^>]*?)(?:>([\s\S]*?)<\/nextbillion-copy>|\/>)/gi;
  const fromRegex = /from="([^"]+)"/;
  const toRegex = /to="([^"]+)"/;
  const descriptionRegex = /description="([^"]+)"/;

  let match;
  const tags: { from: string; to: string; description?: string }[] = [];

  while ((match = nextBillionCopyRegex.exec(fullResponse)) !== null) {
    const attrs = match[1];
    const fromMatch = fromRegex.exec(attrs);
    const toMatch = toRegex.exec(attrs);
    const descriptionMatch = descriptionRegex.exec(attrs);

    if (fromMatch?.[1] && toMatch?.[1]) {
      tags.push({
        from: normalizePath(unescapeXmlAttr(fromMatch[1])),
        to: normalizePath(unescapeXmlAttr(toMatch[1])),
        description: descriptionMatch?.[1]
          ? unescapeXmlAttr(descriptionMatch[1])
          : undefined,
      });
    } else {
      logger.warn(
        "Found <nextbillion-copy> tag without valid 'from' or 'to' attributes:",
        match[0],
      );
    }
  }
  return tags;
}

export function getNextBillionDeleteTags(fullResponse: string): string[] {
  const nextBillionDeleteRegex =
    /<nextbillion-delete path="([^"]+)"[^>]*>([\s\S]*?)<\/nextbillion-delete>/g;
  let match;
  const paths: string[] = [];
  while ((match = nextBillionDeleteRegex.exec(fullResponse)) !== null) {
    paths.push(normalizePath(unescapeXmlAttr(match[1])));
  }
  return paths;
}

export function getNextBillionAddDependencyTags(
  fullResponse: string,
): string[] {
  const nextBillionAddDependencyRegex =
    /<nextbillion-add-dependency packages="([^"]+)">[^<]*<\/nextbillion-add-dependency>/g;
  let match;
  const packages: string[] = [];
  while ((match = nextBillionAddDependencyRegex.exec(fullResponse)) !== null) {
    packages.push(...unescapeXmlAttr(match[1]).trim().split(/\s+/));
  }
  return packages;
}

export function getNextBillionChatSummaryTag(
  fullResponse: string,
): string | null {
  const nextBillionChatSummaryRegex =
    /<nextbillion-chat-summary>([\s\S]*?)<\/nextbillion-chat-summary>/g;
  const match = nextBillionChatSummaryRegex.exec(fullResponse);
  if (match && match[1]) {
    return unescapeXmlContent(match[1].trim());
  }
  return null;
}

export function getNextBillionExecuteSqlTags(fullResponse: string): SqlQuery[] {
  const nextBillionExecuteSqlRegex =
    /<nextbillion-execute-sql([^>]*)>([\s\S]*?)<\/nextbillion-execute-sql>/g;
  const descriptionRegex = /description="([^"]+)"/;
  let match;
  const queries: { content: string; description?: string }[] = [];

  while ((match = nextBillionExecuteSqlRegex.exec(fullResponse)) !== null) {
    const attributesString = match[1] || "";
    let content = unescapeXmlContent(match[2].trim());
    const descriptionMatch = descriptionRegex.exec(attributesString);
    const description = descriptionMatch?.[1]
      ? unescapeXmlAttr(descriptionMatch[1])
      : undefined;

    // Handle markdown code blocks if present
    const contentLines = content.split("\n");
    if (contentLines[0]?.startsWith("```")) {
      contentLines.shift();
    }
    if (contentLines[contentLines.length - 1]?.startsWith("```")) {
      contentLines.pop();
    }
    content = contentLines.join("\n");

    queries.push({ content, description });
  }

  return queries;
}

export function getNextBillionCommandTags(fullResponse: string): string[] {
  const nextBillionCommandRegex =
    /<nextbillion-command type="([^"]+)"[^>]*><\/nextbillion-command>/g;
  let match;
  const commands: string[] = [];

  while ((match = nextBillionCommandRegex.exec(fullResponse)) !== null) {
    commands.push(unescapeXmlAttr(match[1]));
  }

  return commands;
}

export function getNextBillionSearchReplaceTags(fullResponse: string): {
  path: string;
  content: string;
  description?: string;
}[] {
  const nextBillionSearchReplaceRegex =
    /<nextbillion-search-replace([^>]*)>([\s\S]*?)<\/nextbillion-search-replace>/gi;
  const pathRegex = /path="([^"]+)"/;
  const descriptionRegex = /description="([^"]+)"/;

  let match;
  const tags: { path: string; content: string; description?: string }[] = [];

  while ((match = nextBillionSearchReplaceRegex.exec(fullResponse)) !== null) {
    const attributesString = match[1] || "";
    let content = unescapeXmlContent(match[2].trim());

    const pathMatch = pathRegex.exec(attributesString);
    const descriptionMatch = descriptionRegex.exec(attributesString);

    if (pathMatch && pathMatch[1]) {
      const path = unescapeXmlAttr(pathMatch[1]);
      const description = descriptionMatch?.[1]
        ? unescapeXmlAttr(descriptionMatch[1])
        : undefined;

      // Handle markdown code fences if present
      const contentLines = content.split("\n");
      if (contentLines[0]?.startsWith("```")) {
        contentLines.shift();
      }
      if (contentLines[contentLines.length - 1]?.startsWith("```")) {
        contentLines.pop();
      }
      content = contentLines.join("\n");

      tags.push({ path: normalizePath(path), content, description });
    } else {
      logger.warn(
        "Found <nextbillion-search-replace> tag without a valid 'path' attribute:",
        match[0],
      );
    }
  }
  return tags;
}
