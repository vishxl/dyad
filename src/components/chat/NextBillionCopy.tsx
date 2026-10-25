import type React from "react";
import type { ReactNode } from "react";
import { Copy } from "lucide-react";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionFilePath,
  NextBillionDescription,
  NextBillionStateIndicator,
} from "./NextBillionCardPrimitives";
import { CustomTagState } from "./stateTypes";

interface NextBillionCopyProps {
  children?: ReactNode;
  node?: any;
}

export const NextBillionCopy: React.FC<NextBillionCopyProps> = ({
  children,
  node,
}) => {
  const from = node?.properties?.from || "";
  const to = node?.properties?.to || "";
  const description = node?.properties?.description || "";
  const state = node?.properties?.state as CustomTagState;

  const toFileName = to ? to.split("/").pop() : "";
  // Hide the "From" line for temp attachment paths (absolute paths) since they
  // show cryptic hash filenames that mean nothing to the user.
  const isTempAttachment =
    /^(\/|[A-Za-z]:\\)/.test(from) || from.includes(".nextbillion/media/");

  return (
    <NextBillionCard accentColor="teal" state={state}>
      <NextBillionCardHeader icon={<Copy size={15} />} accentColor="teal">
        {toFileName && (
          <span className="font-medium text-sm text-foreground truncate">
            {toFileName}
          </span>
        )}
        <NextBillionBadge color="teal">Copy</NextBillionBadge>
        <span className="ml-auto">
          {state === "pending" && (
            <NextBillionStateIndicator
              state="pending"
              pendingLabel="Copying..."
            />
          )}
          {state === "aborted" && (
            <NextBillionStateIndicator
              state="aborted"
              abortedLabel="Did not finish"
            />
          )}
          {state === "finished" && (
            <NextBillionStateIndicator
              state="finished"
              finishedLabel="Copied"
            />
          )}
        </span>
      </NextBillionCardHeader>
      {from && !isTempAttachment && (
        <NextBillionFilePath path={`From: ${from}`} />
      )}
      {to && <NextBillionFilePath path={`To: ${to}`} />}
      {description && (
        <NextBillionDescription>{description}</NextBillionDescription>
      )}
      {children && <NextBillionDescription>{children}</NextBillionDescription>}
    </NextBillionCard>
  );
};
