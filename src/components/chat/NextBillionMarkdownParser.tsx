import { ClaudeCodeToolCard } from "./ClaudeCodeToolCard";
import { normalizeLegacyTags } from "@/lib/legacy_tags";
import React, { useDeferredValue, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { NextBillionWrite } from "./NextBillionWrite";
import { NextBillionRename } from "./NextBillionRename";
import { NextBillionCopy } from "./NextBillionCopy";
import { NextBillionDelete } from "./NextBillionDelete";
import { NextBillionAddDependency } from "./NextBillionAddDependency";
import { NextBillionExecuteSql } from "./NextBillionExecuteSql";
import { NextBillionLogs } from "./NextBillionLogs";
import { NextBillionGrep } from "./NextBillionGrep";
import { NextBillionSearchChats } from "./NextBillionSearchChats";
import { NextBillionReadChat } from "./NextBillionReadChat";
import { NextBillionExploreCode } from "./NextBillionExploreCode";
import { NextBillionExploreChatHistory } from "./NextBillionExploreChatHistory";
import { NextBillionAddIntegration } from "./NextBillionAddIntegration";
import { NextBillionSuggestPlugin } from "./NextBillionSuggestPlugin";
import { NextBillionEnableNitro } from "./NextBillionEnableNitro";
import { NextBillionEdit } from "./NextBillionEdit";
import { NextBillionSearchReplace } from "./NextBillionSearchReplace";
import { NextBillionCodebaseContext } from "./NextBillionCodebaseContext";
import { NextBillionThink } from "./NextBillionThink";
import { CodeHighlight } from "./CodeHighlight";
import { useAtomValue } from "jotai";
import { selectedChatIdAtom } from "@/atoms/chatAtoms";
import {
  useChatStreamPreview,
  useChatStreamState,
} from "@/hooks/useChatStream";
import { isStreamActive } from "@/chat_stream/transition";
import { CustomTagState } from "./stateTypes";
import { NextBillionOutput } from "./NextBillionOutput";
import { NextBillionProblemSummary } from "./NextBillionProblemSummary";
import { NextBillionSecurityFinding } from "./NextBillionSecurityFinding";
import { ipc } from "@/ipc/types";
import { NextBillionMcpToolCall } from "./NextBillionMcpToolCall";
import { NextBillionMcpToolResult } from "./NextBillionMcpToolResult";
import {
  buildMcpPairing,
  EMPTY_MCP_PAIRING,
  type McpPairing,
  type CustomTagBlock,
} from "./mcpPairing";
import { NextBillionMcpToolSearch } from "./NextBillionMcpToolSearch";
import { NextBillionMcpToolSchema } from "./NextBillionMcpToolSchema";
import { NextBillionWebSearchResult } from "./NextBillionWebSearchResult";
import { NextBillionWebSearch } from "./NextBillionWebSearch";
import { NextBillionWebCrawl } from "./NextBillionWebCrawl";
import { NextBillionWebFetch } from "./NextBillionWebFetch";
import { NextBillionImageGeneration } from "./NextBillionImageGeneration";
import { NextBillionCodeSearchResult } from "./NextBillionCodeSearchResult";
import { NextBillionCodeSearch } from "./NextBillionCodeSearch";
import { NextBillionRead } from "./NextBillionRead";
import { NextBillionListFiles } from "./NextBillionListFiles";
import { NextBillionDatabaseSchema } from "./NextBillionDatabaseSchema";
import { NextBillionDbTableSchema } from "./NextBillionDbTableSchema";
import { NextBillionSupabaseProjectInfo } from "./NextBillionSupabaseProjectInfo";
import { NextBillionNeonProjectInfo } from "./NextBillionNeonProjectInfo";
import { NextBillionStatus } from "./NextBillionStatus";
import { NextBillionCompaction } from "./NextBillionCompaction";
import { NextBillionWritePlan } from "./NextBillionWritePlan";
import { NextBillionExitPlan } from "./NextBillionExitPlan";
import { NextBillionQuestionnaire } from "./NextBillionQuestionnaire";
import { NextBillionStepLimit } from "./NextBillionStepLimit";
import { NextBillionAppBlueprintCard } from "./NextBillionAppBlueprintCard";
import { NextBillionTestAssertionsCard } from "./NextBillionTestAssertionsCard";
import { NextBillionReadGuide } from "./NextBillionReadGuide";
import { NextBillionScript } from "./NextBillionScript";
import { NextBillionGit } from "./NextBillionGit";
import { NextBillionSubagent } from "./NextBillionSubagent";
import { mapActionToButton } from "./ChatInput";
import { SuggestedAction } from "@/lib/schemas";
import { FixAllErrorsButton } from "./FixAllErrorsButton";
import {
  advanceParser,
  type Block,
  getOpenBlock,
  initialParserState,
  parseFullMessage,
  type ParserState,
} from "@/lib/streamingMessageParser";

interface NextBillionMarkdownParserProps {
  content: string;
  messageId?: number;
  showStreamingPreview?: boolean;
}

const customLink = ({
  node: _node,
  ...props
}: {
  node?: any;
  [key: string]: any;
}) => (
  <a
    {...props}
    onClick={(e) => {
      const url = props.href;
      if (url) {
        e.preventDefault();
        ipc.system.openExternalUrl(url);
      }
    }}
  />
);

export const VanillaMarkdownParser = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: CodeHighlight,
        a: customLink,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

/**
 * Custom component to parse markdown content with NextBillion-specific tags.
 *
 * The block list is sourced from a component-local incremental parser. Completed
 * blocks keep referential identity across streaming chunks, so React.memo can
 * skip prior blocks and leave only the open trailing block to re-render.
 */
export const NextBillionMarkdownParser: React.FC<
  NextBillionMarkdownParserProps
> = ({ content, messageId, showStreamingPreview = false }) => {
  const chatId = useAtomValue(selectedChatIdAtom);
  const streamState = useChatStreamState(chatId ?? undefined) ?? {
    type: "idle",
  };
  const isStreaming = isStreamActive(streamState);
  const deferredContent = useDeferredValue(content);
  const contentToParse = normalizeLegacyTags(
    isStreaming ? deferredContent : content,
  );

  // Component-local parser cache. Closed-block refs stay stable across chunks
  // so MemoClosedBlocks can skip its subtree; only the open trailing block
  // changes shape per chunk. On prefix-mismatch (full-message replace, etc.)
  // we restart from initialParserState — same correctness as a one-shot parse.
  //
  // Note: we write to parserCacheRef inside useMemo. React docs flag this as
  // a side effect during render; in practice the cache is purely advisory and
  // advanceParser is deterministic on (state, content), so the worst case
  // (StrictMode dev double-render, discarded concurrent render) is a wasted
  // re-parse, not a correctness issue.
  const parserCacheRef = useRef<{
    messageId?: number;
    content: string;
    state: ParserState;
  } | null>(null);

  const parserState = useMemo(() => {
    const cached = parserCacheRef.current;
    if (
      cached &&
      cached.messageId === messageId &&
      contentToParse.startsWith(cached.content)
    ) {
      const state = advanceParser(cached.state, contentToParse);
      parserCacheRef.current = { messageId, content: contentToParse, state };
      return state;
    }
    const state = advanceParser(initialParserState(), contentToParse);
    parserCacheRef.current = { messageId, content: contentToParse, state };
    return state;
  }, [messageId, contentToParse]);

  const closedBlocks = parserState.blocks;
  const openBlock = getOpenBlock(parserState);

  // Pair MCP tool-call blocks with their tool-result blocks by call-id so the
  // renderer can collapse the two into one card. Keyed on `closedBlocks`, which
  // only changes when a block closes (not per streamed token), so the scan
  // stays off the streaming hot path.
  const mcpPairing = useMemo(
    () => buildMcpPairing(closedBlocks),
    [closedBlocks],
  );

  // The button is hidden while streaming, so avoid scanning the block list on
  // every chunk. Do the full scan only for settled content.
  const { errorMessages, errorCount, lastErrorIndex } = useMemo(() => {
    if (isStreaming) {
      return EMPTY_ERROR_SCAN;
    }
    const errors: string[] = [];
    let lastIndex = -1;
    closedBlocks.forEach((block, index) => {
      if (
        block.kind === "custom-tag" &&
        block.tag === "nextbillion-output" &&
        block.attributes.type === "error"
      ) {
        const msg = block.attributes.message?.trim();
        if (msg) {
          errors.push(msg);
          lastIndex = index;
        }
      }
    });
    return {
      errorMessages: errors,
      errorCount: errors.length,
      lastErrorIndex: lastIndex,
    };
  }, [closedBlocks, isStreaming]);

  const showFixAll =
    errorCount > 1 && !isStreaming && chatId !== null && chatId !== undefined;

  return (
    <>
      <MemoClosedBlocks
        blocks={closedBlocks}
        lastErrorIndex={lastErrorIndex}
        errorMessages={errorMessages}
        showFixAll={showFixAll}
        chatId={chatId ?? null}
        resultByCallId={mcpPairing.resultByCallId}
        callIds={mcpPairing.callIds}
        isStreaming={isStreaming}
      />
      {openBlock ? renderOpenBlock(openBlock, isStreaming, mcpPairing) : null}
      {showStreamingPreview && chatId !== null && chatId !== undefined && (
        <StreamingPreviewBlocks chatId={chatId} isStreaming={isStreaming} />
      )}
    </>
  );
};

// Stable ref for the "nothing to scan" return path so MemoClosedBlocks's
// memo doesn't invalidate every render during streaming.
const EMPTY_ERROR_SCAN: {
  errorMessages: string[];
  errorCount: number;
  lastErrorIndex: number;
} = { errorMessages: [], errorCount: 0, lastErrorIndex: -1 };

function StreamingPreviewBlocks({
  chatId,
  isStreaming,
}: {
  chatId: number;
  isStreaming: boolean;
}) {
  const previewXml = useChatStreamPreview(chatId);
  const previewBlocks = useMemo<Block[] | null>(() => {
    if (!previewXml) return null;
    return parseFullMessage(previewXml).blocks;
  }, [previewXml]);

  const previewPairing = useMemo(
    () => (previewBlocks ? buildMcpPairing(previewBlocks) : EMPTY_MCP_PAIRING),
    [previewBlocks],
  );

  if (!previewBlocks) return null;

  return (
    <>
      {previewBlocks.map((block) => (
        <React.Fragment key={`preview-${block.id}`}>
          {renderOpenBlock(block, isStreaming, previewPairing)}
        </React.Fragment>
      ))}
    </>
  );
}

function renderBlock(block: Block, isStreaming: boolean): React.ReactNode {
  if (block.kind === "markdown") {
    return block.content ? <MemoMarkdown content={block.content} /> : null;
  }
  return <MemoBlockCustomTag block={block} isStreaming={isStreaming} />;
}

// Render the trailing open block, accounting for MCP pairing: an open
// tool-call shows as a pending card; an open tool-result whose call already
// has a card is hidden (the call card will absorb it once it closes).
function renderOpenBlock(
  block: Block,
  isStreaming: boolean,
  pairing: McpPairing,
): React.ReactNode {
  if (block.kind === "custom-tag") {
    const callId = block.attributes["call-id"];
    if (callId && block.tag === "nextbillion-mcp-tool-call") {
      return (
        <MemoMcpToolPair
          callBlock={block}
          resultBlock={pairing.resultByCallId.get(callId)}
          isStreaming={isStreaming}
        />
      );
    }
    if (
      callId &&
      block.tag === "nextbillion-mcp-tool-result" &&
      pairing.callIds.has(callId)
    ) {
      return null;
    }
  }
  return renderBlock(block, isStreaming);
}

// Render a closed block, collapsing MCP call/result pairs into one card and
// hiding the standalone result block that the call card now renders.
function renderClosedBlock(
  block: Block,
  {
    resultByCallId,
    callIds,
    isStreaming,
  }: {
    resultByCallId: Map<string, CustomTagBlock>;
    callIds: Set<string>;
    isStreaming: boolean;
  },
): React.ReactNode {
  if (block.kind === "custom-tag") {
    const callId = block.attributes["call-id"];
    if (callId && block.tag === "nextbillion-mcp-tool-call") {
      return (
        <MemoMcpToolPair
          callBlock={block}
          resultBlock={resultByCallId.get(callId)}
          isStreaming={isStreaming}
        />
      );
    }
    // Hide the standalone result only when its call is on screen to absorb it;
    // an unmatched result still renders on its own.
    if (
      callId &&
      block.tag === "nextbillion-mcp-tool-result" &&
      callIds.has(callId)
    ) {
      return null;
    }
  }
  return renderBlock(block, false);
}

// One card for an MCP tool call + its result. Memoizes on both block refs;
// once the result is present the card is "finished" regardless of streaming,
// so isStreaming is only compared while still waiting for a result.
const MemoMcpToolPair = React.memo(
  function MemoMcpToolPair({
    callBlock,
    resultBlock,
    isStreaming,
  }: {
    callBlock: CustomTagBlock;
    resultBlock: CustomTagBlock | undefined;
    isStreaming: boolean;
  }) {
    const isError = resultBlock?.attributes["is-error"] === "true";
    const state: CustomTagState = !resultBlock
      ? isStreaming
        ? "pending"
        : "aborted"
      : isError
        ? "aborted"
        : "finished";
    return (
      <NextBillionMcpToolCall
        node={{
          properties: {
            serverName: callBlock.attributes.server || "",
            toolName: callBlock.attributes.tool || "",
            autoApprovedReason:
              callBlock.attributes["auto-approved-reason"] || "",
          },
        }}
        resultContent={resultBlock?.content}
        state={state}
        isError={isError}
      >
        {callBlock.content}
      </NextBillionMcpToolCall>
    );
  },
  (prev, next) =>
    prev.callBlock === next.callBlock &&
    prev.resultBlock === next.resultBlock &&
    (next.resultBlock != null || prev.isStreaming === next.isStreaming),
);

// Memoized wrapper for closed blocks. Memo hits when blocks ref + error
// props are unchanged, so the closed-block subtree is skipped per chunk.
// Closed children also memo on `prev.block === next.block` and skip their
// subtrees on commit chunks.
const MemoClosedBlocks = React.memo(function MemoClosedBlocks({
  blocks,
  lastErrorIndex,
  errorMessages,
  showFixAll,
  chatId,
  resultByCallId,
  callIds,
  isStreaming,
}: {
  blocks: Block[];
  lastErrorIndex: number;
  errorMessages: string[];
  showFixAll: boolean;
  chatId: number | null;
  resultByCallId: Map<string, CustomTagBlock>;
  callIds: Set<string>;
  isStreaming: boolean;
}) {
  // Hoisted once per render rather than allocated per block in the map.
  const mcpCtx = { resultByCallId, callIds, isStreaming };
  return (
    <>
      {blocks.map((block, index) => (
        <React.Fragment key={block.id}>
          {renderClosedBlock(block, mcpCtx)}
          {showFixAll &&
            index === lastErrorIndex &&
            chatId !== null &&
            chatId !== undefined && (
              <div className="mt-3 w-full flex">
                <FixAllErrorsButton
                  errorMessages={errorMessages}
                  chatId={chatId}
                />
              </div>
            )}
        </React.Fragment>
      ))}
    </>
  );
});

// Module-level constants so MemoMarkdown never gets fresh refs for these
// props, which would defeat ReactMarkdown's internal prop-equality checks.
const REMARK_PLUGINS = [remarkGfm];
const MARKDOWN_COMPONENTS = { code: CodeHighlight, a: customLink };

// Memoized markdown piece. Without this, ReactMarkdown re-parses every
// completed segment's text into an AST on every streaming chunk.
const MemoMarkdown = React.memo(function MemoMarkdown({
  content,
}: {
  content: string;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={REMARK_PLUGINS}
      components={MARKDOWN_COMPONENTS}
    >
      {content}
    </ReactMarkdown>
  );
});

// Memoized custom-tag block. The incremental parser preserves the Block
// reference for any completed (closed) tag across streaming patches, so
// referential equality on `block` is sufficient — completed blocks
// short-circuit and skip renderCustomTag entirely.
const MemoBlockCustomTag = React.memo(
  function MemoBlockCustomTag({
    block,
    isStreaming,
  }: {
    block: CustomTagBlock;
    isStreaming: boolean;
  }) {
    return <>{renderCustomTag(block, { isStreaming })}</>;
  },
  (prev, next) =>
    prev.block === next.block &&
    // Completed tags ignore isStreaming (getState returns "finished"
    // regardless), so skip the check to avoid one-time re-renders of every
    // completed tag when streaming ends.
    (prev.block.inProgress === false || prev.isStreaming === next.isStreaming),
);

function getState({
  isStreaming,
  inProgress,
  explicitState,
}: {
  isStreaming?: boolean;
  inProgress?: boolean;
  explicitState?: string;
}): CustomTagState {
  if (
    explicitState === "aborted" ||
    explicitState === "error" ||
    explicitState === "finished" ||
    explicitState === "warning"
  ) {
    return explicitState;
  }
  if (explicitState === "in-progress" || explicitState === "pending") {
    return "pending";
  }
  if (!inProgress) {
    return "finished";
  }
  return isStreaming ? "pending" : "aborted";
}

/**
 * Render a custom tag based on its type
 */
function renderCustomTag(
  block: CustomTagBlock,
  { isStreaming }: { isStreaming: boolean },
): React.ReactNode {
  const { tag, attributes, content, inProgress } = block;

  switch (tag) {
    case "nextbillion-subagent": {
      const subagentChatId = Number(attributes["chat-id"]);
      if (!Number.isSafeInteger(subagentChatId)) return null;
      return (
        <NextBillionSubagent
          chatId={subagentChatId}
          threadId={attributes["thread-id"] || ""}
          persona={attributes.persona || "agent"}
          taskName={attributes["task-name"] || "Sub-agent task"}
          renderActivity={(xml, activityId) => (
            <NextBillionMarkdownParser content={xml} messageId={activityId} />
          )}
        />
      );
    }
    case "nextbillion-read":
      return (
        <NextBillionRead
          node={{
            properties: {
              path: attributes.path || "",
              startLine: attributes.start_line || "",
              endLine: attributes.end_line || "",
              appName: attributes.app_name || "",
            },
          }}
        >
          {content}
        </NextBillionRead>
      );
    case "nextbillion-git":
      return (
        <NextBillionGit
          node={{
            properties: {
              ...attributes,
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionGit>
      );
    case "nextbillion-web-search":
      return (
        <NextBillionWebSearch
          node={{
            properties: {
              query: attributes.query || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionWebSearch>
      );
    case "nextbillion-search-chats":
      return (
        <NextBillionSearchChats
          node={{
            properties: {
              query: attributes.query || "",
              indexStatus: attributes["index-status"] || "",
              resultCount: attributes["result-count"],
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state as CustomTagState,
              }),
            },
          }}
        >
          {content}
        </NextBillionSearchChats>
      );
    case "nextbillion-read-chat":
      return (
        <NextBillionReadChat
          node={{
            properties: {
              chatId: attributes["chat-id"] || "",
              title: attributes.title || "",
              range: attributes.range || "",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state as CustomTagState,
              }),
            },
          }}
        >
          {content}
        </NextBillionReadChat>
      );
    case "nextbillion-web-crawl":
      return (
        <NextBillionWebCrawl
          node={{
            properties: {},
          }}
        >
          {content}
        </NextBillionWebCrawl>
      );
    case "nextbillion-web-fetch":
      return (
        <NextBillionWebFetch
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionWebFetch>
      );
    case "nextbillion-code-search":
      return (
        <NextBillionCodeSearch
          node={{
            properties: {
              query: attributes.query || "",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
              appName: attributes.app_name || "",
            },
          }}
        >
          {content}
        </NextBillionCodeSearch>
      );
    case "nextbillion-code-search-result":
      return (
        <NextBillionCodeSearchResult
          node={{
            properties: {},
          }}
        >
          {content}
        </NextBillionCodeSearchResult>
      );
    case "nextbillion-web-search-result":
      return (
        <NextBillionWebSearchResult
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionWebSearchResult>
      );
    case "think":
      return (
        <NextBillionThink
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionThink>
      );
    // "nextbillion-generate-test" is legacy: no longer emitted, but historical chats
    // still contain it. Both tags carry a path/description and a file body, so
    // the old test cards render as plain file-write cards instead of raw markup.
    case "nextbillion-generate-test":
    case "nextbillion-write":
      return (
        <NextBillionWrite
          node={{
            properties: {
              path: attributes.path || "",
              description: attributes.description || "",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
            },
          }}
        >
          {content}
        </NextBillionWrite>
      );

    case "nextbillion-rename":
      return (
        <NextBillionRename
          node={{
            properties: {
              from: attributes.from || "",
              to: attributes.to || "",
            },
          }}
        >
          {content}
        </NextBillionRename>
      );

    case "nextbillion-copy":
      return (
        <NextBillionCopy
          node={{
            properties: {
              from: attributes.from || "",
              to: attributes.to || "",
              description: attributes.description || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionCopy>
      );

    case "nextbillion-delete":
      return (
        <NextBillionDelete
          node={{
            properties: {
              path: attributes.path || "",
            },
          }}
        >
          {content}
        </NextBillionDelete>
      );

    case "nextbillion-add-dependency":
      return (
        <NextBillionAddDependency
          node={{
            properties: {
              packages: attributes.packages || "",
            },
          }}
        >
          {content}
        </NextBillionAddDependency>
      );

    case "nextbillion-execute-sql":
      return (
        <NextBillionExecuteSql
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
              description: attributes.description || "",
            },
          }}
        >
          {content}
        </NextBillionExecuteSql>
      );

    case "nextbillion-read-logs":
      return (
        <NextBillionLogs
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
              time: attributes.time || "",
              type: attributes.type || "",
              level: attributes.level || "",
              count: attributes.count || "",
            },
          }}
        >
          {content}
        </NextBillionLogs>
      );

    case "nextbillion-grep":
      return (
        <NextBillionGrep
          node={{
            properties: {
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
              query: attributes.query || "",
              include: attributes.include || "",
              exclude: attributes.exclude || "",
              "case-sensitive": attributes["case-sensitive"] || "",
              count: attributes.count || "",
              total: attributes.total || "",
              truncated: attributes.truncated || "",
              appName: attributes.app_name || "",
            },
          }}
        >
          {content}
        </NextBillionGrep>
      );

    case "nextbillion-explore-chat-history":
      return (
        <NextBillionExploreChatHistory
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
              query: attributes.query || "",
              chats: attributes.chats || "",
              evidence: attributes.evidence || "",
              outcome: attributes.outcome || "",
            },
          }}
        >
          {content}
        </NextBillionExploreChatHistory>
      );

    case "nextbillion-explore-code":
      return (
        <NextBillionExploreCode
          node={{
            properties: {
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
              query: attributes.query || "",
              appName: attributes.app_name || "",
              files: attributes.files || "",
              symbols: attributes.symbols || "",
              indexMs: attributes.index_ms || "",
              searchMs: attributes.search_ms || "",
              truncated: attributes.truncated || "",
            },
          }}
        >
          {content}
        </NextBillionExploreCode>
      );

    case "nextbillion-add-integration":
      return (
        <NextBillionAddIntegration
          provider={
            attributes.provider === "neon" || attributes.provider === "supabase"
              ? attributes.provider
              : undefined
          }
          outcome={
            attributes.outcome === "pending" ||
            attributes.outcome === "skipped" ||
            attributes.outcome === "completed" ||
            attributes.outcome === "dismissed"
              ? attributes.outcome
              : undefined
          }
        >
          {content}
        </NextBillionAddIntegration>
      );

    case "nextbillion-suggest-plugin":
      return (
        <NextBillionSuggestPlugin
          slug={attributes.slug || ""}
          name={attributes.name}
          reason={attributes.reason || ""}
          requestId={attributes["request-id"]}
          outcome={
            attributes.outcome === "pending" ||
            attributes.outcome === "connected" ||
            attributes.outcome === "declined" ||
            attributes.outcome === "never" ||
            attributes.outcome === "dismissed"
              ? attributes.outcome
              : undefined
          }
        />
      );

    case "nextbillion-enable-nitro":
      return (
        <NextBillionEnableNitro state={getState({ isStreaming, inProgress })} />
      );

    case "nextbillion-edit":
      return (
        <NextBillionEdit
          node={{
            properties: {
              path: attributes.path || "",
              description: attributes.description || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionEdit>
      );

    case "nextbillion-search-replace":
      return (
        <NextBillionSearchReplace
          node={{
            properties: {
              path: attributes.path || "",
              description: attributes.description || "",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
            },
          }}
        >
          {content}
        </NextBillionSearchReplace>
      );

    case "nextbillion-codebase-context":
      return (
        <NextBillionCodebaseContext
          node={{
            properties: {
              files: attributes.files || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionCodebaseContext>
      );

    case "nextbillion-mcp-tool-search":
      return (
        <NextBillionMcpToolSearch
          node={{
            properties: {
              query: attributes.query || "",
              server: attributes.server || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionMcpToolSearch>
      );

    case "nextbillion-mcp-tool-schema":
      return (
        <NextBillionMcpToolSchema
          node={{
            properties: {
              tools: attributes.tools || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionMcpToolSchema>
      );
    case "nextbillion-mcp-tool-call":
      return (
        <NextBillionMcpToolCall
          node={{
            properties: {
              serverName: attributes.server || "",
              toolName: attributes.tool || "",
              autoApprovedReason: attributes["auto-approved-reason"] || "",
            },
          }}
        >
          {content}
        </NextBillionMcpToolCall>
      );

    case "nextbillion-mcp-tool-result":
      return (
        <NextBillionMcpToolResult
          node={{
            properties: {
              serverName: attributes.server || "",
              toolName: attributes.tool || "",
            },
          }}
        >
          {content}
        </NextBillionMcpToolResult>
      );

    case "nextbillion-output":
      return (
        <NextBillionOutput
          type={attributes.type as "warning" | "error"}
          message={attributes.message}
        >
          {content}
        </NextBillionOutput>
      );

    case "nextbillion-script":
      return (
        <NextBillionScript
          node={{
            properties: {
              description: attributes.description || "",
              truncated: attributes.truncated || "",
              executionMs: attributes["execution-ms"] || "",
              fullOutputPath: attributes["full-output-path"] || "",
            },
          }}
        >
          {content}
        </NextBillionScript>
      );

    case "nextbillion-problem-report":
      return (
        <NextBillionProblemSummary summary={attributes.summary}>
          {content}
        </NextBillionProblemSummary>
      );

    case "nextbillion-security-finding":
      return (
        <NextBillionSecurityFinding
          title={attributes.title}
          level={attributes.level}
        >
          {content}
        </NextBillionSecurityFinding>
      );

    case "nextbillion-chat-summary":
      // Don't render anything for nextbillion-chat-summary
      return null;

    case "nextbillion-command":
      if (attributes.type) {
        const action = {
          id: attributes.type,
        } as SuggestedAction;
        return <>{mapActionToButton(action)}</>;
      }
      return null;

    case "nextbillion-list-files":
      return (
        <NextBillionListFiles
          node={{
            properties: {
              directory: attributes.directory || "",
              recursive: attributes.recursive || "",
              include_ignored:
                attributes.include_ignored || attributes.include_hidden || "",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
              appName: attributes.app_name || "",
            },
          }}
        >
          {content}
        </NextBillionListFiles>
      );

    case "nextbillion-database-schema":
      return (
        <NextBillionDatabaseSchema
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionDatabaseSchema>
      );

    case "nextbillion-db-table-schema":
    // Backward compat: old messages used provider-specific tags
    case "nextbillion-supabase-table-schema":
    case "nextbillion-neon-table-schema":
      return (
        <NextBillionDbTableSchema
          provider={
            tag === "nextbillion-supabase-table-schema"
              ? "Supabase"
              : tag === "nextbillion-neon-table-schema"
                ? "Neon"
                : (attributes.provider as string) || ""
          }
          node={{
            properties: {
              table: attributes.table || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionDbTableSchema>
      );

    case "nextbillion-supabase-project-info":
      return (
        <NextBillionSupabaseProjectInfo
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionSupabaseProjectInfo>
      );

    case "nextbillion-neon-project-info":
      return (
        <NextBillionNeonProjectInfo
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionNeonProjectInfo>
      );

    case "nextbillion-read-guide":
      return (
        <NextBillionReadGuide
          node={{
            properties: {
              name: attributes.name || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionReadGuide>
      );

    case "nextbillion-image-generation":
      return (
        <NextBillionImageGeneration
          node={{
            properties: {
              prompt: attributes.prompt || "",
              path: attributes.path || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionImageGeneration>
      );

    case "nextbillion-claude-tool":
      return <ClaudeCodeToolCard content={content} />;

    case "nextbillion-status":
      return (
        <NextBillionStatus
          node={{
            properties: {
              title: attributes.title || "Processing...",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
            },
          }}
        >
          {content}
        </NextBillionStatus>
      );

    case "nextbillion-compaction":
      return (
        <NextBillionCompaction
          node={{
            properties: {
              title: attributes.title || "Compacting conversation",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionCompaction>
      );

    case "nextbillion-write-plan":
      return (
        <NextBillionWritePlan
          node={{
            properties: {
              title: attributes.title || "Implementation Plan",
              summary: attributes.summary,
              complete: attributes.complete,
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionWritePlan>
      );

    case "nextbillion-exit-plan":
      return (
        <NextBillionExitPlan
          node={{
            properties: {
              notes: attributes.notes,
            },
          }}
        />
      );

    case "nextbillion-questionnaire":
      return <NextBillionQuestionnaire>{content}</NextBillionQuestionnaire>;

    case "nextbillion-step-limit":
      return (
        <NextBillionStepLimit
          node={{
            properties: {
              steps: attributes.steps,
              limit: attributes.limit,
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionStepLimit>
      );

    case "nextbillion-app-blueprint":
      return (
        <NextBillionAppBlueprintCard
          node={{
            properties: {
              "app-name": attributes["app-name"] || "",
              template: attributes.template || "react",
              theme: attributes.theme || "default",
              "design-direction": attributes["design-direction"] || "",
              "primary-color": attributes["primary-color"] || "",
              complete: attributes.complete,
              state: getState({ isStreaming, inProgress }),
            },
          }}
        />
      );

    case "nextbillion-test-assertions":
      return (
        <NextBillionTestAssertionsCard
          node={{
            properties: {
              "proposal-id": attributes["proposal-id"] || "",
              "request-id": attributes["request-id"] || "",
              status: attributes.status || "proposed",
              "spec-path": attributes["spec-path"] || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </NextBillionTestAssertionsCard>
      );

    default:
      return null;
  }
}
