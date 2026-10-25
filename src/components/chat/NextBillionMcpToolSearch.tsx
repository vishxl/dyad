import type React from "react";
import { useState, type ReactNode } from "react";
import { Wrench } from "lucide-react";
import { CustomTagState } from "./stateTypes";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionExpandIcon,
  NextBillionStateIndicator,
  NextBillionCardContent,
} from "./NextBillionCardPrimitives";

interface NextBillionMcpToolSearchProps {
  children?: ReactNode;
  node?: {
    properties?: { query?: string; server?: string; state?: CustomTagState };
  };
}

export const NextBillionMcpToolSearch: React.FC<
  NextBillionMcpToolSearchProps
> = ({ children, node }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const query = node?.properties?.query || "";
  const server = node?.properties?.server || "";
  const state = node?.properties?.state as CustomTagState;
  const inProgress = state === "pending";
  const resultText = typeof children === "string" ? children.trimEnd() : "";
  // No-match results start with "No MCP"; "Matching tools:" would mislabel them.
  const resultsLabel = resultText.startsWith("No MCP")
    ? "Results:"
    : "Matching tools:";

  return (
    <NextBillionCard
      state={state}
      accentColor="indigo"
      onClick={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    >
      <NextBillionCardHeader icon={<Wrench size={15} />} accentColor="indigo">
        <NextBillionBadge color="indigo">MCP Tools</NextBillionBadge>
        {server && <NextBillionBadge color="sky">{server}</NextBillionBadge>}
        {!isExpanded && query && (
          <span className="text-sm text-muted-foreground italic truncate min-w-0">
            {query}
          </span>
        )}
        {inProgress && (
          <NextBillionStateIndicator
            state="pending"
            pendingLabel="Searching..."
          />
        )}
        <div className="ml-auto">
          <NextBillionExpandIcon isExpanded={isExpanded} />
        </div>
      </NextBillionCardHeader>
      <NextBillionCardContent isExpanded={isExpanded}>
        <div className="text-sm text-muted-foreground space-y-2">
          {query && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Query:
              </span>
              <div className="italic mt-0.5 text-foreground">{query}</div>
            </div>
          )}
          {children && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {resultsLabel}
              </span>
              <pre className="mt-0.5 whitespace-pre-wrap font-mono text-xs text-foreground overflow-x-auto">
                {resultText || children}
              </pre>
            </div>
          )}
        </div>
      </NextBillionCardContent>
    </NextBillionCard>
  );
};
