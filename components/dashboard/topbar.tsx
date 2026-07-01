"use client";

import Link from "next/link";
import { Bell, Search, Upload } from "lucide-react";
import { useNotificationsStore } from "@/store/notifications.store";

interface TopbarProps {
  artistName?: string;
  artistInitials?: string;
}

export function Topbar({ artistName = "Amara Obi", artistInitials = "AO" }: TopbarProps) {
  const unreadCount = useNotificationsStore((s) => s.unreadCount());
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/90 backdrop-blur-md px-4 lg:px-6">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <label htmlFor="dashboard-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none"
          />
          <input
            id="dashboard-search"
            type="search"
            placeholder="Search..."
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-4 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Upload CTA */}
        <Link
          href="/dashboard/portfolio/new"
          className="hidden sm:flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <Upload size={15} />
          Upload work
        </Link>

        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted transition-colors hover:bg-surface-raised hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-background bg-accent px-1 font-heading text-[10px] font-extrabold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent/20 text-xs font-bold text-accent"
          title={artistName}
        >
          {artistInitials}
        </div>
      </div>
    </header>
  );
}
