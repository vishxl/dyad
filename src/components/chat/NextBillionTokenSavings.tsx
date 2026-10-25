import React from "react";
import { Zap } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import {
  NextBillionCard,
  NextBillionCardHeader,
} from "./NextBillionCardPrimitives";

interface NextBillionTokenSavingsProps {
  originalTokens: number;
  smartContextTokens: number;
}

export const NextBillionTokenSavings: React.FC<
  NextBillionTokenSavingsProps
> = ({ originalTokens, smartContextTokens }) => {
  const tokensSaved = originalTokens - smartContextTokens;
  const percentageSaved =
    originalTokens > 0 ? Math.round((tokensSaved / originalTokens) * 100) : 0;

  return (
    <Tooltip>
      <TooltipTrigger>
        <NextBillionCard accentColor="green">
          <NextBillionCardHeader icon={<Zap size={15} />} accentColor="green">
            <span className="text-xs font-medium text-green-700 dark:text-green-300">
              Saved {percentageSaved}% of codebase tokens with Smart Context
            </span>
          </NextBillionCardHeader>
        </NextBillionCard>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        <div className="text-left">
          Saved {Math.round(tokensSaved).toLocaleString()} tokens
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
