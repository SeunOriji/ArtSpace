import type { Metadata } from "next";
import { CommissionsView } from "@/components/dashboard/commissions/commissions-view";

export const metadata: Metadata = {
  title: "Commissions",
  description: "Manage commission requests, active work and milestone payouts.",
};

export default function CommissionsPage() {
  return (
    <div className="px-5 py-7 lg:px-8 lg:py-8">
      <CommissionsView />
    </div>
  );
}
