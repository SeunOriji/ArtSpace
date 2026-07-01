import type { Metadata } from "next";
import { ProfileHeader } from "@/components/dashboard/portfolio/profile-header";
import { PortfolioGrid } from "@/components/dashboard/portfolio/portfolio-grid";

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Manage your artworks, commissions, and drafts.",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-[1220px] px-5 py-7 lg:px-8 lg:py-8">
      <ProfileHeader />
      <div className="mt-6">
        <PortfolioGrid />
      </div>
    </div>
  );
}
