import type { Metadata } from "next";
import { FeedView } from "@/components/dashboard/feed/feed-view";

export const metadata: Metadata = {
  title: "Feed",
  description: "Process updates, new work and reels from artists you follow.",
};

export default function FeedPage() {
  return (
    <div className="px-5 py-7 lg:px-8 lg:py-8">
      <FeedView />
    </div>
  );
}
