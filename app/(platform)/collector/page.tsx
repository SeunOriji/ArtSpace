import type { Metadata } from "next";
import { DiscoverView } from "@/components/collector/discover/discover-view";

export const metadata: Metadata = {
  title: "Discover",
  description: "Drops, new work and process reels picked for you.",
};

export default function CollectorDiscoverPage() {
  return <DiscoverView />;
}
