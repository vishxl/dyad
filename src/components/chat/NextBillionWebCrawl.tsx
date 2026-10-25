import type React from "react";
import type { ReactNode } from "react";
import { ScanQrCode } from "lucide-react";
import {
  NextBillionCard,
  NextBillionCardHeader,
  NextBillionBadge,
} from "./NextBillionCardPrimitives";

interface NextBillionWebCrawlProps {
  children?: ReactNode;
  node?: any;
}

export const NextBillionWebCrawl: React.FC<NextBillionWebCrawlProps> = ({
  children,
  node: _node,
}) => {
  return (
    <NextBillionCard accentColor="blue">
      <NextBillionCardHeader icon={<ScanQrCode size={15} />} accentColor="blue">
        <NextBillionBadge color="blue">Web Crawl</NextBillionBadge>
      </NextBillionCardHeader>
      {children && (
        <div className="px-3 pb-2 text-sm italic text-muted-foreground">
          {children}
        </div>
      )}
    </NextBillionCard>
  );
};
