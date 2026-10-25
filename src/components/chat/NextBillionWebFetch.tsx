import type { FC, ReactNode } from "react";
import { Globe } from "lucide-react";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionStateIndicator,
} from "./NextBillionCardPrimitives";
import { CustomTagState } from "./stateTypes";

interface NextBillionWebFetchProps {
  children?: ReactNode;
  node?: {
    properties: {
      state?: CustomTagState;
    };
  };
}

export const NextBillionWebFetch: FC<NextBillionWebFetchProps> = ({
  children,
  node,
}) => {
  const state = node?.properties?.state as CustomTagState;

  return (
    <NextBillionCard state={state} accentColor="blue">
      <NextBillionCardHeader icon={<Globe size={15} />} accentColor="blue">
        <NextBillionBadge color="blue">Web Fetch</NextBillionBadge>
        {state && (
          <NextBillionStateIndicator
            state={state}
            pendingLabel="Fetching..."
            finishedLabel="Done"
            abortedLabel="Aborted"
          />
        )}
      </NextBillionCardHeader>
      {children && (
        <div className="px-3 pb-2 text-sm italic text-muted-foreground">
          {children}
        </div>
      )}
    </NextBillionCard>
  );
};
