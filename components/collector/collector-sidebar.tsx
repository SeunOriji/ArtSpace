"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  CalendarDays,
  Compass,
  LayoutGrid,
  LogOut,
  MessageCircle,
  Palette,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/store/messages.store";
import { useAuthStore } from "@/store/auth.store";
import { useHasMounted } from "@/hooks/use-has-mounted";

export const collectorNavItems = [
  { label: "Discover", href: "/collector", icon: Compass },
  { label: "Marketplace", href: "/collector/marketplace", icon: ShoppingBag },
  { label: "Drops", href: "/collector/drops", icon: Sparkles },
  { label: "Events", href: "/collector/events", icon: CalendarDays },
  { label: "Messages", href: "/collector/messages", icon: MessageCircle },
  { label: "Saved", href: "/collector/saved", icon: Bookmark },
  { label: "My Collection", href: "/collector/collection", icon: LayoutGrid },
  { label: "My Commissions", href: "/collector/commissions", icon: Palette },
];

export function CollectorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const hasMounted = useHasMounted();
  const unreadMessagesCount = useMessagesStore((s) => s.totalUnreadCount());
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleLogout() {
    clearAuth();
    router.push("/");
  }

  return (
    <aside className="hidden h-screen w-[236px] flex-shrink-0 flex-col border-r border-border bg-surface lg:flex">
      {/* Logo */}
      <div className="flex h-16 flex-col justify-center border-b border-border px-5">
        <Link href="/">
          <span className="font-heading text-xl font-extrabold text-foreground">
            Art<span className="text-accent">Space</span>
          </span>
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gold">Collector</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {collectorNavItems.map(({ label, href, icon: Icon }) => {
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

      {/* Profile */}
      <div className="p-3">
        <div className="flex items-center gap-3 rounded-2xl bg-surface-raised p-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-overlay font-heading text-xs font-extrabold text-gold">
            CE
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">Chidi Eze</p>
            <p className="truncate text-xs text-foreground-subtle">Collector · 6 works</p>
          </div>
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
