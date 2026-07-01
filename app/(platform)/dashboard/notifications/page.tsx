import type { Metadata } from "next";
import { NotificationsList } from "@/components/dashboard/notifications-list";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Every like, comment, share, tag and sale on your work.",
};

export default function NotificationsPage() {
  return (
    <div className="px-5 py-7 lg:px-8 lg:py-8">
      <NotificationsList />
    </div>
  );
}
