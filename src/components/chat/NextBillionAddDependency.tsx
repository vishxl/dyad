import type React from "react";
import type { ReactNode } from "react";
import { useState } from "react";

import { ipc } from "@/ipc/types";

import { Package } from "lucide-react";
import { CodeHighlight } from "./CodeHighlight";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
  NextBillionExpandIcon,
  NextBillionCardContent,
  NextBillionStateIndicator,
} from "./NextBillionCardPrimitives";
import { getNpmPackagePageUrl } from "./npmPackageUrl";

interface NextBillionAddDependencyProps {
  children?: ReactNode;
  node?: any;
  packages?: string;
  execution?: boolean;
}

export const NextBillionAddDependency: React.FC<
  NextBillionAddDependencyProps
> = ({ children, node, execution = false }) => {
  const packages = node?.properties?.packages
    ? node.properties.packages.split(" ").filter(Boolean)
    : [];
  const [isContentVisible, setIsContentVisible] = useState(false);
  const hasChildren =
    typeof children === "string" && children.trim().length > 0;

  return (
    <NextBillionCard
      state={execution ? node?.properties?.state : undefined}
      accentColor="blue"
      isExpanded={isContentVisible}
      onClick={
        hasChildren ? () => setIsContentVisible(!isContentVisible) : undefined
      }
    >
      <NextBillionCardHeader icon={<Package size={15} />} accentColor="blue">
        <NextBillionBadge color="blue">Add Packages</NextBillionBadge>
        {execution && (
          <NextBillionStateIndicator
            state={node?.properties?.state}
            pendingLabel="Installing..."
            finishedLabel="Installed"
          />
        )}
        {hasChildren && (
          <div className="ml-auto">
            <NextBillionExpandIcon isExpanded={isContentVisible} />
          </div>
        )}
      </NextBillionCardHeader>
      {packages.length > 0 && (
        <div className="px-3 pb-2">
          {!execution && (
            <div className="text-sm text-foreground mb-1">
              Do you want to install these packages?
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {packages.map((p: string) => (
              <span
                className="cursor-pointer text-sm px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 ring-1 ring-inset ring-blue-200 dark:ring-blue-800 transition-colors"
                key={p}
                onClick={(e) => {
                  e.stopPropagation();
                  ipc.system.openExternalUrl(getNpmPackagePageUrl(p));
                }}
              >
                {p}
              </span>
            ))}
          </div>
          {!execution && (
            <div className="text-xs text-muted-foreground mt-2">
              Make sure these packages are what you want.
            </div>
          )}
        </div>
      )}
      <NextBillionCardContent isExpanded={isContentVisible}>
        {hasChildren && (
          <div className="text-xs">
            <CodeHighlight className="language-shell">{children}</CodeHighlight>
          </div>
        )}
      </NextBillionCardContent>
    </NextBillionCard>
  );
};
