import React from "react";
import { CustomTagState } from "./stateTypes";
import { Database } from "lucide-react";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionStateIndicator,
} from "./NextBillionCardPrimitives";

interface NextBillionDatabaseSchemaProps {
  node: {
    properties: {
      state?: CustomTagState;
    };
  };
  children: React.ReactNode;
}

export function NextBillionDatabaseSchema({
  node,
  children,
}: NextBillionDatabaseSchemaProps) {
  const { state } = node.properties;
  const isLoading = state === "pending";
  const content = typeof children === "string" ? children : "";

  return (
    <NextBillionCard state={state} accentColor="teal">
      <NextBillionCardHeader icon={<Database size={15} />} accentColor="teal">
        <NextBillionBadge color="teal">Database Schema</NextBillionBadge>
        {isLoading && <NextBillionStateIndicator state="pending" />}
      </NextBillionCardHeader>
      {content && (
        <div className="px-3 pb-3">
          <div className="p-3 text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto bg-muted/20 rounded-lg">
            {content}
          </div>
        </div>
      )}
    </NextBillionCard>
  );
}
