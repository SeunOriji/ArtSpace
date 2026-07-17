"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Rss, Plus, MessageCircle, CalendarDays, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/store/messages.store";
import { useHasMounted } from "@/hooks/use-has-mounted";

const leftNavItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Feed", href: "/dashboard/feed", icon: Rss },
];

const rightNavItems = [
  { label: "Chats", href: "/dashboard/messages", icon: MessageCircle },
  { label: "Studio", href: "/dashboard/portfolio", icon: Layers },
  { label: "Events", href: "/dashboard/events", icon: CalendarDays },
];

export function BottomNav() {
  const pathname = usePathname();
  const hasMounted = useHasMounted();
  const unreadMessagesCount = useMessagesStore((s) => s.totalUnreadCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t border-border bg-surface lg:hidden">
      {/* Left pair */}
      <div className="flex flex-1 items-center justify-around">
        {leftNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1 text-xs",
                isActive ? "text-accent" : "text-foreground-subtle"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Center upload button */}
      <div className="px-2">
        <Link
          href="/dashboard/portfolio/new"
          aria-label="Add artwork"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/30 transition-transform active:scale-95"
        >
          <Plus size={22} />
        </Link>
      </div>

      {/* Right group */}
      <div className="flex flex-1 items-center justify-around">
        {rightNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-1 px-3 py-1 text-xs",
                isActive ? "text-accent" : "text-foreground-subtle"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />
              {label === "Chats" && hasMounted && unreadMessagesCount > 0 && (
                <span className="absolute -top-1 right-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full border-[1.5px] border-surface bg-accent px-1 font-heading text-[9px] font-extrabold text-white">
                  {unreadMessagesCount}
                </span>
              )}
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
