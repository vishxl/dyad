import type React from "react";
import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionFilePath,
  NextBillionDescription,
} from "./NextBillionCardPrimitives";
import { CustomTagState } from "./stateTypes";

interface NextBillionDeleteProps {
  children?: ReactNode;
  node?: any;
  path?: string;
}

export const NextBillionDelete: React.FC<NextBillionDeleteProps> = ({
  children,
  node,
  path: pathProp,
}) => {
  const path = pathProp || node?.properties?.path || "";
  const state = node?.properties?.state as CustomTagState;
  const fileName = path ? path.split("/").pop() : "";

  return (
    <NextBillionCard accentColor="red" state={state}>
      <NextBillionCardHeader icon={<Trash2 size={15} />} accentColor="red">
        {fileName && (
          <span className="font-medium text-sm text-foreground truncate">
            {fileName}
          </span>
        )}
        <NextBillionBadge color="red">Delete</NextBillionBadge>
      </NextBillionCardHeader>
      <NextBillionFilePath path={path} />
      {children && <NextBillionDescription>{children}</NextBillionDescription>}
    </NextBillionCard>
  );
};
