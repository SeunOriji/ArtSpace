"use client";

import { useState } from "react";
import { Check, Heart, MessageCircle, Share2, Tag, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNotificationsStore,
  type Notification,
  type NotificationCategory,
} from "@/store/notifications.store";

const filters: { key: "all" | NotificationCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "likes", label: "Likes" },
  { key: "comments", label: "Comments" },
  { key: "shares", label: "Shares & tags" },
  { key: "sales", label: "Sales" },
];

const typeBadge: Record<Notification["type"], { icon: typeof Heart; className: string }> = {
  sale: { icon: Check, className: "bg-emerald-500 text-background" },
  comment: { icon: MessageCircle, className: "bg-blue-500 text-white" },
  tag: { icon: Tag, className: "bg-gold text-background" },
  like: { icon: Heart, className: "bg-rose-500 text-white" },
  share: { icon: Share2, className: "bg-teal-500 text-white" },
  follow: { icon: UserPlus, className: "bg-accent text-white" },
};

function NotificationRow({ notification }: { notification: Notification }) {
  const markRead = useNotificationsStore((s) => s.markRead);
  const followBack = useNotificationsStore((s) => s.followBack);
  const followed = useNotificationsStore((s) => s.followedBackIds[notification.id] ?? false);
  const badge = typeBadge[notification.type];
  const Icon = badge.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => markRead(notification.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") markRead(notification.id);
      }}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-colors",
        notification.read
          ? "border-border-subtle bg-surface hover:bg-surface-raised"
          : "border-accent bg-surface-raised"
      )}
    >
      <span className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-surface-overlay font-heading text-sm font-bold text-gold">
        {notification.actorInitials}
        <span
          className={cn(
            "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface",
            badge.className
          )}
        >
          <Icon size={11} />
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-foreground-muted">
          {notification.parts.map((part, i) => (
            <span key={i} className={part.bold ? "font-bold text-foreground" : undefined}>
              {part.text}
            </span>
          ))}
        </p>
        <p className="mt-1 text-xs font-medium text-foreground-subtle">{notification.timeLabel}</p>
      </div>

      {notification.isFollow ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            followBack(notification.id);
          }}
          disabled={followed}
          className={cn(
            "flex-shrink-0 rounded-lg px-4 py-2.5 text-xs font-bold transition-colors",
            followed
              ? "cursor-default bg-surface-overlay text-foreground-subtle"
              : "bg-accent text-white hover:bg-accent-hover"
          )}
        >
          {followed ? "Following" : "Follow back"}
        </button>
      ) : (
        notification.thumbnail && (
          <span className="h-11 w-11 flex-shrink-0 rounded-xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised" />
        )
      )}
    </div>
  );
}

export function NotificationsList() {
  const notifications = useNotificationsStore((s) => s.notifications);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const unreadCount = useNotificationsStore((s) => s.unreadCount());
  const [activeFilter, setActiveFilter] = useState<"all" | NotificationCategory>("all");

  const filtered =
    activeFilter === "all" ? notifications : notifications.filter((n) => n.category === activeFilter);
  const newOnes = filtered.filter((n) => n.group === "new");
  const earlierOnes = filtered.filter((n) => n.group === "earlier");

  return (
    <div className="mx-auto max-w-[720px]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">Notifications</h1>
            {unreadCount > 0 && (
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-accent px-2 font-heading text-xs font-extrabold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-foreground-muted">
            Every like, comment, share, tag and sale on your work.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="flex-shrink-0 text-sm font-semibold text-gold transition-colors hover:text-gold-hover disabled:cursor-not-allowed disabled:text-foreground-subtle"
        >
          Mark all read
        </button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              "flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              activeFilter === f.key
                ? "bg-accent text-white"
                : "border border-border-subtle bg-surface text-foreground-muted hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {newOnes.length > 0 && (
        <div className="mt-7">
          <p className="mb-2.5 px-1 text-xs font-bold uppercase tracking-wide text-foreground-subtle">New</p>
          <div className="flex flex-col gap-2">
            {newOnes.map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </div>
        </div>
      )}

      {earlierOnes.length > 0 && (
        <div className="mt-7">
          <p className="mb-2.5 px-1 text-xs font-bold uppercase tracking-wide text-foreground-subtle">Earlier</p>
          <div className="flex flex-col gap-2">
            {earlierOnes.map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-foreground-subtle">No notifications in this category yet.</p>
      )}
    </div>
  );
}
