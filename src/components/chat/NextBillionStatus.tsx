import React, { useState } from "react";
import { CustomTagState } from "./stateTypes";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionExpandIcon,
  NextBillionFinishedIcon,
  NextBillionCardContent,
} from "./NextBillionCardPrimitives";
import { AlertTriangle, CircleX, Loader2 } from "lucide-react";

interface NextBillionStatusProps {
  node: {
    properties: {
      title?: string;
      state?: CustomTagState;
    };
  };
  children?: React.ReactNode;
}

export function NextBillionStatus({ node, children }: NextBillionStatusProps) {
  const { title = "Processing...", state } = node.properties;
  const isInProgress = state === "pending";
  const isAborted = state === "aborted";
  const isError = state === "error";
  const isWarning = state === "warning";
  const isFinished = state === "finished";
  const content = typeof children === "string" ? children : "";
  const [isContentVisible, setIsContentVisible] = useState(false);

  // Pick accent color based on state
  const accentColor =
    isAborted || isError
      ? "red"
      : isInProgress || isWarning
        ? "amber"
        : "green";

  // Pick the left icon based on state
  const icon = isInProgress ? (
    <Loader2 size={15} className="animate-spin" />
  ) : isAborted || isError ? (
    <CircleX size={15} />
  ) : isWarning ? (
    <AlertTriangle size={15} />
  ) : (
    <NextBillionFinishedIcon />
  );

  const hasDetails = typeof children === "string" && children.trim().length > 0;

  return (
    <NextBillionCard
      state={state}
      accentColor={accentColor}
      showAccent={isWarning || isError || undefined}
      isExpanded={hasDetails && isContentVisible}
      onClick={
        hasDetails ? () => setIsContentVisible(!isContentVisible) : undefined
      }
    >
      <NextBillionCardHeader icon={icon} accentColor={accentColor}>
        <span
          className={`font-medium text-sm ${
            isInProgress
              ? "bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] bg-clip-text text-transparent"
              : isFinished || isWarning
                ? "text-foreground"
                : "text-muted-foreground"
          }`}
        >
          {title}
        </span>
        <div className="ml-auto">
          {hasDetails && (
            <NextBillionExpandIcon isExpanded={isContentVisible} />
          )}
        </div>
      </NextBillionCardHeader>
      <NextBillionCardContent isExpanded={hasDetails && isContentVisible}>
        {content && (
          <div
            className="p-3 text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto bg-muted/20 rounded-lg cursor-text"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        )}
      </NextBillionCardContent>
    </NextBillionCard>
  );
}
