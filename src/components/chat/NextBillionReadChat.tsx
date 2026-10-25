import type React from "react";
import type { ReactNode } from "react";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
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

interface NextBillionReadChatProps {
  children?: ReactNode;
  node?: {
    properties?: {
      state?: CustomTagState;
      chatId?: string;
      title?: string;
      range?: string;
    };
  };
}

export const NextBillionReadChat: React.FC<NextBillionReadChatProps> = ({
  children,
  node,
}) => {
  const { t } = useTranslation("chat");
  const [isContentVisible, setIsContentVisible] = useState(false);

  const state = node?.properties?.state as CustomTagState;
  const inProgress = state === "pending";
  const aborted = state === "aborted";

  const chatId = node?.properties?.chatId || "";
  const title = node?.properties?.title || "";
  const range = node?.properties?.range || "";

  return (
    <NextBillionCard
      state={state}
      accentColor="violet"
      onClick={() => setIsContentVisible(!isContentVisible)}
      isExpanded={isContentVisible}
      data-testid="nextbillion-read-chat"
    >
      <NextBillionCardHeader icon={<BookOpen size={15} />} accentColor="violet">
        <NextBillionBadge color="violet">
          {t("readChatTool.badge")}
        </NextBillionBadge>
        <span className="font-medium text-sm text-foreground truncate">
          {title || t("readChatTool.chatNumber", { chatId })}
        </span>
        {range && (
          <span className="text-xs text-muted-foreground shrink-0">
            ({t("readChatTool.messagesRange", { range })})
          </span>
        )}
        {inProgress && (
          <NextBillionStateIndicator
            state="pending"
            pendingLabel={t("readChatTool.reading")}
          />
        )}
        {aborted && (
          <NextBillionStateIndicator
            state="aborted"
            abortedLabel={t("readChatTool.didNotFinish")}
          />
        )}
        <div className="ml-auto">
          <NextBillionExpandIcon isExpanded={isContentVisible} />
        </div>
      </NextBillionCardHeader>
      <NextBillionCardContent isExpanded={isContentVisible}>
        <div className="text-xs" onClick={(e) => e.stopPropagation()}>
          <CodeHighlight className="language-log">{children}</CodeHighlight>
        </div>
      </NextBillionCardContent>
    </NextBillionCard>
  );
};
