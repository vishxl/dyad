import React from "react";
import { Server } from "lucide-react";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionStateIndicator,
} from "./NextBillionCardPrimitives";
import { CustomTagState } from "./stateTypes";

interface NextBillionEnableNitroProps {
  state?: CustomTagState;
}

export const NextBillionEnableNitro: React.FC<NextBillionEnableNitroProps> = ({
  state,
}) => {
  const isPending = state === "pending";
  const isAborted = state === "aborted";
  const headline = isPending
    ? "Adding Nitro server layer"
    : isAborted
      ? "Nitro server layer setup aborted"
      : "Added Nitro server layer";
  return (
    <NextBillionCard accentColor="emerald" state={state}>
      <NextBillionCardHeader icon={<Server size={15} />} accentColor="emerald">
        <NextBillionBadge color="emerald">Server layer</NextBillionBadge>
        <span className="text-sm font-medium text-foreground">{headline}</span>
        {state && (
          <NextBillionStateIndicator
            state={state}
            abortedLabel="Did not finish"
          />
        )}
      </NextBillionCardHeader>
      {!isPending && !isAborted && (
        <div className="px-3 pb-3">
          <p className="text-xs text-muted-foreground leading-snug">
            API routes can now live under{" "}
            <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-muted">
              server/routes/api/
            </code>
          </p>
        </div>
      )}
    </NextBillionCard>
  );
};
