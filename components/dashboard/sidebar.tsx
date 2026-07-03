"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Home,
  LayoutGrid,
  ShoppingBag,
  Rss,
  MessageCircle,
  Palette,
  CalendarDays,
  BarChart2,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotificationsStore } from "@/store/notifications.store";
import { useCommissionsStore } from "@/store/commissions.store";
import { useMessagesStore } from "@/store/messages.store";
import { useAuthStore } from "@/store/auth.store";
import { useHasMounted } from "@/hooks/use-has-mounted";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "My Portfolio", href: "/dashboard/portfolio", icon: LayoutGrid },
  { label: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingBag },
  { label: "Feed", href: "/dashboard/feed", icon: Rss },
  { label: "Messages", href: "/dashboard/messages", icon: MessageCircle },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Commissions", href: "/dashboard/commissions", icon: Palette },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const hasMounted = useHasMounted();
  const unreadCount = useNotificationsStore((s) => s.unreadCount());
  const newCommissionsCount = useCommissionsStore((s) => s.newRequestsCount());
  const unreadMessagesCount = useMessagesStore((s) => s.totalUnreadCount());
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleLogout() {
    clearAuth();
    router.push("/");
  }

  return (
    <aside className="hidden lg:flex h-screen w-[236px] flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="flex h-16 items-center px-5 border-b border-border">
        <Link href="/">
          <span className="font-heading text-xl font-extrabold text-foreground">
            Art<span className="text-accent">Space</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-foreground-muted hover:bg-surface-raised hover:text-foreground"
                  )}
                >
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
                  {label}
                  {hasMounted && label === "Notifications" && unreadCount > 0 && (
                    <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1.5 font-heading text-[10px] font-extrabold text-white">
                      {unreadCount}
                    </span>
                  )}
                  {hasMounted && label === "Commissions" && newCommissionsCount > 0 && (
                    <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1.5 font-heading text-[10px] font-extrabold text-white">
                      {newCommissionsCount}
                    </span>
                  )}
                  {hasMounted && label === "Messages" && unreadMessagesCount > 0 && (
                    <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1.5 font-heading text-[10px] font-extrabold text-white">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Upgrade card */}
      <div className="p-3">
        <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-gold" />
            <span className="text-xs font-semibold text-gold">Free plan</span>
          </div>
          <p className="text-xs text-foreground-muted mb-3 leading-relaxed">
            Unlock analytics, priority placement, and more.
          </p>
          <Link
            href="/pricing"
            className="block w-full rounded-xl bg-gold px-3 py-2 text-center text-xs font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>

      {/* Log out */}
      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-raised hover:text-red-400"
        >
          <LogOut size={18} strokeWidth={1.75} />
          Log out
        </button>
      </div>
    </aside>
  );
}
