import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { VanillaMarkdownParser } from "./NextBillionMarkdownParser";
import { CustomTagState } from "./stateTypes";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionExpandIcon,
  NextBillionStateIndicator,
  NextBillionCardContent,
} from "./NextBillionCardPrimitives";

interface NextBillionWebSearchResultProps {
  node?: any;
  children?: React.ReactNode;
}

export const NextBillionWebSearchResult: React.FC<
  NextBillionWebSearchResultProps
> = ({ children, node }) => {
  const state = node?.properties?.state as CustomTagState;
  const inProgress = state === "pending";
  const [isExpanded, setIsExpanded] = useState(inProgress);

  useEffect(() => {
    if (!inProgress && isExpanded) {
      setIsExpanded(false);
    }
  }, [inProgress]);

  return (
    <NextBillionCard
      state={state}
      accentColor="blue"
      onClick={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    >
      <NextBillionCardHeader icon={<Globe size={15} />} accentColor="blue">
        <NextBillionBadge color="blue">Web Search Result</NextBillionBadge>
        {inProgress && (
          <NextBillionStateIndicator
            state="pending"
            pendingLabel="Loading..."
          />
        )}
        <div className="ml-auto">
          <NextBillionExpandIcon isExpanded={isExpanded} />
        </div>
      </NextBillionCardHeader>
      <NextBillionCardContent isExpanded={isExpanded}>
        <div className="text-sm text-muted-foreground">
          {typeof children === "string" ? (
            <VanillaMarkdownParser content={children} />
          ) : (
            children
          )}
        </div>
      </NextBillionCardContent>
    </NextBillionCard>
  );
};
