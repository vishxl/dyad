import type React from "react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Search, ArrowLeftRight } from "lucide-react";
import { CodeHighlight } from "./CodeHighlight";
import { CustomTagState } from "./stateTypes";
import {
  type SearchReplaceBlock,
  parseSearchReplaceBlocks,
} from "@/pro/shared/search_replace_parser";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionExpandIcon,
  NextBillionStateIndicator,
  NextBillionFilePath,
  NextBillionDescription,
  NextBillionCardContent,
} from "./NextBillionCardPrimitives";

interface NextBillionSearchReplaceProps {
  children?: ReactNode;
  node?: any;
  path?: string;
  description?: string;
  blocks?: SearchReplaceBlock[];
}

export const NextBillionSearchReplace: React.FC<
  NextBillionSearchReplaceProps
> = ({
  children,
  blocks: suppliedBlocks,
  node,
  path: pathProp,
  description: descriptionProp,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const path = pathProp || node?.properties?.path || "";
  const description = descriptionProp || node?.properties?.description || "";
  const state = node?.properties?.state as CustomTagState;
  const inProgress = state === "pending";
  const aborted = state === "aborted";

  const blocks = useMemo(
    () => suppliedBlocks ?? parseSearchReplaceBlocks(String(children ?? "")),
    [children, suppliedBlocks],
  );

  const fileName = path ? path.split("/").pop() : "";

  const hasDetails =
    blocks.length > 0 ||
    (typeof children === "string" && children.trim().length > 0);

  return (
    <NextBillionCard
      state={state}
      accentColor="violet"
      isExpanded={hasDetails && isContentVisible}
      onClick={
        hasDetails ? () => setIsContentVisible(!isContentVisible) : undefined
      }
      data-testid="nextbillion-search-replace"
    >
      <NextBillionCardHeader icon={<Search size={15} />} accentColor="violet">
        <NextBillionBadge color="violet">Search & Replace</NextBillionBadge>
        {fileName && (
          <span className="font-medium text-sm text-foreground truncate">
            {fileName}
          </span>
        )}
        {inProgress && (
          <NextBillionStateIndicator
            state="pending"
            pendingLabel="Applying changes..."
          />
        )}
        {state === "error" && <NextBillionStateIndicator state="error" />}
        {aborted && (
          <NextBillionStateIndicator
            state="aborted"
            abortedLabel="Did not finish"
          />
        )}
        <div className="ml-auto">
          {hasDetails && (
            <NextBillionExpandIcon isExpanded={isContentVisible} />
          )}
        </div>
      </NextBillionCardHeader>
      <NextBillionFilePath path={path} />
      {description && (
        <NextBillionDescription>
          <span className="font-medium">Summary: </span>
          {description}
        </NextBillionDescription>
      )}
      <NextBillionCardContent isExpanded={hasDetails && isContentVisible}>
        <div
          className="text-xs cursor-text"
          onClick={(e) => e.stopPropagation()}
        >
          {blocks.length === 0 ? (
            <CodeHighlight className="language-typescript">
              {children}
            </CodeHighlight>
          ) : (
            <div className="space-y-2">
              {blocks.map((b, i) => (
                <div
                  key={i}
                  className="border border-border/60 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 text-[11px]">
                    <ArrowLeftRight
                      size={13}
                      className="text-muted-foreground"
                    />
                    <span className="font-medium text-muted-foreground">
                      Change {i + 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="p-3 border-t border-border/40 md:border-r">
                      <div className="text-[11px] mb-1 text-muted-foreground font-medium">
                        Search
                      </div>
                      <CodeHighlight className="language-typescript">
                        {b.searchContent}
                      </CodeHighlight>
                    </div>
                    <div className="p-3 border-t border-border/40">
                      <div className="text-[11px] mb-1 text-muted-foreground font-medium">
                        Replace
                      </div>
                      <CodeHighlight className="language-typescript">
                        {b.replaceContent}
                      </CodeHighlight>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </NextBillionCardContent>
    </NextBillionCard>
  );
};
