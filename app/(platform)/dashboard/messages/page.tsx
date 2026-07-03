import type { Metadata } from "next";
import { MessagesView } from "@/components/dashboard/messages/messages-view";

export const metadata: Metadata = {
  title: "Messages",
  description: "Message buyers and fellow artists directly.",
};

export default function MessagesPage() {
  return (
    <div className="h-full">
      <MessagesView />
    </div>
  );
}
