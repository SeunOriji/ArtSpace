import type { Metadata } from "next";
import { EventsView } from "@/components/dashboard/events/events-view";

export const metadata: Metadata = {
  title: "Events",
  description: "Fairs, workshops, talks and exhibitions from artists you follow.",
};

export default function EventsPage() {
  return (
    <div className="px-5 py-7 lg:px-8 lg:py-8">
      <EventsView />
    </div>
  );
}
