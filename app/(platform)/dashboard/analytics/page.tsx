import type { Metadata } from "next";
import { AnalyticsView } from "@/components/dashboard/analytics/analytics-view";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Track profile views, revenue, and audience insights.",
};

export default function AnalyticsPage() {
  return (
    <div className="px-5 py-7 lg:px-8 lg:py-8">
      <AnalyticsView />
    </div>
  );
}
