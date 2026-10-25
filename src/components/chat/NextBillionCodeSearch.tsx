import type React from "react";
import { useState, type ReactNode } from "react";
import { FileCode } from "lucide-react";
import { CustomTagState } from "./stateTypes";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionExpandIcon,
  NextBillionStateIndicator,
  NextBillionCardContent,
} from "./NextBillionCardPrimitives";

interface NextBillionCodeSearchProps {
  children?: ReactNode;
  node?: {
    properties?: { query?: string; state?: CustomTagState; appName?: string };
  };
}

export const NextBillionCodeSearch: React.FC<NextBillionCodeSearchProps> = ({
  children,
  node,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const query =
    node?.properties?.query || (typeof children === "string" ? children : "");
  const state = node?.properties?.state as CustomTagState;
  const appName = node?.properties?.appName || "";
  const inProgress = state === "pending";

  return (
    <NextBillionCard
      state={state}
      accentColor="indigo"
      onClick={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    >
      <NextBillionCardHeader icon={<FileCode size={15} />} accentColor="indigo">
        <NextBillionBadge color="indigo">Code Search</NextBillionBadge>
        {appName && <NextBillionBadge color="sky">{appName}</NextBillionBadge>}
        {!isExpanded && query && (
          <span className="text-sm text-muted-foreground italic truncate">
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
                Results:
              </span>
              <div className="mt-0.5 whitespace-pre-wrap font-mono text-xs text-foreground">
                {children}
              </div>
            </div>
          )}
        </div>
      </NextBillionCardContent>
    </NextBillionCard>
  );
};
