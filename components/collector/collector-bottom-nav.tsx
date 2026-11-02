"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Compass, LayoutGrid, MessageCircle, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/store/messages.store";
import { useHasMounted } from "@/hooks/use-has-mounted";

const navItems = [
  { label: "Discover", href: "/collector", icon: Compass },
  { label: "Market", href: "/collector/marketplace", icon: ShoppingBag },
  { label: "Events", href: "/collector/events", icon: CalendarDays },
  { label: "Chats", href: "/collector/messages", icon: MessageCircle },
  { label: "Collection", href: "/collector/collection", icon: LayoutGrid },
];

export function CollectorBottomNav() {
  const pathname = usePathname();
  const hasMounted = useHasMounted();
  const unreadMessagesCount = useMessagesStore((s) => s.totalUnreadCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-surface lg:hidden">
      {navItems.map(({ label, href, icon: Icon }) => {
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
    </nav>
  );
}
