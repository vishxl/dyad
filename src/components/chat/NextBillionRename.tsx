import type React from "react";
import type { ReactNode } from "react";
import { FileEdit } from "lucide-react";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionFilePath,
  NextBillionDescription,
} from "./NextBillionCardPrimitives";
import { CustomTagState } from "./stateTypes";

interface NextBillionRenameProps {
  children?: ReactNode;
  node?: any;
  from?: string;
  to?: string;
}

export const NextBillionRename: React.FC<NextBillionRenameProps> = ({
  children,
  node,
  from: fromProp,
  to: toProp,
}) => {
  const from = fromProp || node?.properties?.from || "";
  const to = toProp || node?.properties?.to || "";
  const state = node?.properties?.state as CustomTagState;

  const fromFileName = from ? from.split("/").pop() : "";
  const toFileName = to ? to.split("/").pop() : "";

  const displayTitle =
    fromFileName && toFileName
      ? `${fromFileName} → ${toFileName}`
      : fromFileName || toFileName || "";

  return (
    <NextBillionCard accentColor="amber" state={state}>
      <NextBillionCardHeader icon={<FileEdit size={15} />} accentColor="amber">
        {displayTitle && (
          <span className="font-medium text-sm text-foreground truncate">
            {displayTitle}
          </span>
        )}
        <NextBillionBadge color="amber">Rename</NextBillionBadge>
      </NextBillionCardHeader>
      {from && <NextBillionFilePath path={`From: ${from}`} />}
      {to && <NextBillionFilePath path={`To: ${to}`} />}
      {children && <NextBillionDescription>{children}</NextBillionDescription>}
    </NextBillionCard>
  );
};
