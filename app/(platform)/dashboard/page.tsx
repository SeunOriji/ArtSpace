import { GettingStarted } from "@/components/dashboard/getting-started";
import { PortfolioPreview } from "@/components/dashboard/portfolio-preview";
import { VerificationCard } from "@/components/dashboard/verification-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

const completePct = 40;

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1044px] px-5 py-7 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
            Let&apos;s set up your studio, Amara.
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Complete your profile to start selling your work.
          </p>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-border bg-surface-raised px-3.5 py-1.5 lg:flex">
          <span className="relative flex h-2 w-16 overflow-hidden rounded-full bg-background">
            <span
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${completePct}%` }}
            />
          </span>
          <span className="text-xs font-semibold text-foreground-muted">
            Profile {completePct}% complete
          </span>
        </span>
      </div>

      {/* Main 2-column grid */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <GettingStarted />
          <PortfolioPreview />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <VerificationCard />
          <StatsCard />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
