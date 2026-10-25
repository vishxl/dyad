import type React from "react";
import type { ReactNode } from "react";
import { useState } from "react";
import { FileText } from "lucide-react";
import { CodeHighlight } from "./CodeHighlight";
import { CustomTagState } from "./stateTypes";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionExpandIcon,
  NextBillionStateIndicator,
  NextBillionCardContent,
} from "./NextBillionCardPrimitives";

interface NextBillionLogsProps {
  children?: ReactNode;
  node?: any;
}

export const NextBillionLogs: React.FC<NextBillionLogsProps> = ({
  children,
  node,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const state = node?.properties?.state as CustomTagState;
  const inProgress = state === "pending";
  const aborted = state === "aborted";

  const logCount = node?.properties?.count || "";
  const hasResults = !!logCount;

  const logType = node?.properties?.type || "all";
  const logLevel = node?.properties?.level || "all";
  const filters: string[] = [];
  if (logType !== "all") filters.push(`type: ${logType}`);
  if (logLevel !== "all") filters.push(`level: ${logLevel}`);
  const filterDesc = filters.length > 0 ? ` (${filters.join(", ")})` : "";

  const displayText = `Reading ${hasResults ? `${logCount} ` : ""}logs${filterDesc}`;

  const hasDetails = typeof children === "string" && children.trim().length > 0;

  return (
    <NextBillionCard
      state={state}
      accentColor="slate"
      isExpanded={hasDetails && isContentVisible}
      onClick={
        hasDetails ? () => setIsContentVisible(!isContentVisible) : undefined
      }
    >
      <NextBillionCardHeader icon={<FileText size={15} />} accentColor="slate">
        <NextBillionBadge color="slate">LOGS</NextBillionBadge>
        <span className="font-medium text-sm text-foreground truncate">
          {displayText}
        </span>
        {inProgress && (
          <NextBillionStateIndicator
            state="pending"
            pendingLabel="Reading..."
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
      <NextBillionCardContent isExpanded={hasDetails && isContentVisible}>
        <div className="text-xs">
          <CodeHighlight className="language-log">{children}</CodeHighlight>
        </div>
      </NextBillionCardContent>
    </NextBillionCard>
  );
};
