import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomTagState } from "./stateTypes";
import { BookOpen } from "lucide-react";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionExpandIcon,
  NextBillionStateIndicator,
  NextBillionCardContent,
} from "./NextBillionCardPrimitives";

interface NextBillionReadGuideProps {
  node: {
    properties: {
      name?: string;
      state?: CustomTagState;
    };
  };
  children: React.ReactNode;
}

export function NextBillionReadGuide({
  node,
  children,
}: NextBillionReadGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation("chat");
  const { name, state } = node.properties;
  const isLoading = state === "pending";
  const isAborted = state === "aborted";

  return (
    <NextBillionCard
      state={state}
      accentColor="indigo"
      isExpanded={isExpanded}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <NextBillionCardHeader icon={<BookOpen size={15} />} accentColor="indigo">
        <NextBillionBadge color="indigo">{t("guide")}</NextBillionBadge>
        {name && (
          <span className="text-sm text-foreground truncate">{name}</span>
        )}
        {isLoading && <NextBillionStateIndicator state="pending" />}
        {isAborted && <NextBillionStateIndicator state="aborted" />}
        <div className="ml-auto">
          <NextBillionExpandIcon isExpanded={isExpanded} />
        </div>
      </NextBillionCardHeader>
      <NextBillionCardContent isExpanded={isExpanded}>
        {children && (
          <div className="p-3 text-xs font-mono whitespace-pre-wrap max-h-80 overflow-y-auto bg-muted/20 rounded-lg">
            {children}
          </div>
        )}
      </NextBillionCardContent>
    </NextBillionCard>
  );
}
