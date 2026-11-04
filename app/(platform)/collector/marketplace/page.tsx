import type { Metadata } from "next";
import { MarketplaceView } from "@/components/collector/marketplace/marketplace-view";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Verified original African art — escrow-protected, with insured shipping.",
};

export default function CollectorMarketplacePage() {
  return <MarketplaceView />;
}
