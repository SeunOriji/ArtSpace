import type { Metadata } from "next";
import { MarketplaceView } from "@/components/dashboard/marketplace/marketplace-view";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Buy original African art with escrow-protected transactions.",
};

export default function MarketplacePage() {
  return (
    <div className="px-5 py-7 lg:px-8 lg:py-8">
      <MarketplaceView />
    </div>
  );
}
