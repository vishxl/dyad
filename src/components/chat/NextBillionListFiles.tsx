import React, { useState } from "react";
import { CustomTagState } from "./stateTypes";
import { FolderOpen } from "lucide-react";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionExpandIcon,
  NextBillionStateIndicator,
  NextBillionCardContent,
} from "./NextBillionCardPrimitives";

interface NextBillionListFilesProps {
  node: {
    properties: {
      directory?: string;
      summary?: string;
      count?: string;
      recursive?: string;
      include_ignored?: string;
      state?: CustomTagState;
      appName?: string;
    };
  };
  children: React.ReactNode;
}

export function NextBillionListFiles({
  node,
  children,
}: NextBillionListFilesProps) {
  const { directory, recursive, include_ignored, state, appName } =
    node.properties;
  const isRecursive = recursive === "true";
  const isIncludeIgnored = include_ignored === "true";
  const content = typeof children === "string" ? children : "";
  const [isExpanded, setIsExpanded] = useState(false);

  const title = directory ? directory : "List Files";

  const hasDetails = typeof children === "string" && children.trim().length > 0;

  return (
    <NextBillionCard
      state={state}
      accentColor="slate"
      isExpanded={hasDetails && isExpanded}
      onClick={hasDetails ? () => setIsExpanded(!isExpanded) : undefined}
      data-testid="nextbillion-list-files"
    >
      <NextBillionCardHeader
        icon={<FolderOpen size={15} />}
        accentColor="slate"
      >
        <span className="font-medium text-sm text-foreground truncate">
          {title}
        </span>
        {appName && <NextBillionBadge color="sky">{appName}</NextBillionBadge>}
        {isRecursive && (
          <NextBillionBadge color="slate">recursive</NextBillionBadge>
        )}
        {isIncludeIgnored && (
          <NextBillionBadge color="slate">include ignored</NextBillionBadge>
        )}
        {state && state !== "finished" && (
          <NextBillionStateIndicator
            state={state}
            pendingLabel="Listing..."
            errorLabel="Failed"
            abortedLabel="Did not finish"
          />
        )}
        {node.properties.count !== undefined && (
          <span className="text-xs text-muted-foreground">
            {node.properties.count} paths
          </span>
        )}
        <div className="ml-auto">
          {hasDetails && <NextBillionExpandIcon isExpanded={isExpanded} />}
        </div>
      </NextBillionCardHeader>
      {node.properties.summary && (
        <div className="px-3 pb-2 text-xs text-muted-foreground break-words">
          {node.properties.summary}
        </div>
      )}
      <NextBillionCardContent isExpanded={hasDetails && isExpanded}>
        {content && (
          <div className="p-3 text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto bg-muted/20 rounded-lg">
            {content}
          </div>
        )}
      </NextBillionCardContent>
    </NextBillionCard>
  );
}
