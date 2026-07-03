import type { Metadata } from "next";
import { CommissionSettingsView } from "@/components/dashboard/commissions/commission-settings-view";

export const metadata: Metadata = {
  title: "Commission settings",
  description: "Set your commission pricing, deposit, turnaround and availability.",
};

export default function CommissionSettingsPage() {
  return (
    <div className="px-5 py-7 lg:px-8 lg:py-8">
      <CommissionSettingsView />
    </div>
  );
}
