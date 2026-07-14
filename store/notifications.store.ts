import { create } from "zustand";
import { persist } from "zustand/middleware";
import { artworks } from "@/lib/artworks";

export type NotificationType = "sale" | "comment" | "tag" | "like" | "share" | "follow";
export type NotificationCategory = "likes" | "comments" | "shares" | "sales";

export interface NotificationPart {
  text: string;
  bold?: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  category?: NotificationCategory;
  actorInitials: string;
  parts: NotificationPart[];
  timeLabel: string;
  group: "new" | "earlier";
  thumbnail?: boolean;
  image?: string;
  isFollow?: boolean;
  read: boolean;
}

const seedNotifications: Notification[] = [
  {
    id: "n1",
    type: "sale",
    category: "sales",
    actorInitials: "CE",
    parts: [
      { text: "Chidi Eze", bold: true },
      { text: " purchased " },
      { text: "Movement No. 4", bold: true },
      { text: " — ₦480,000", bold: true },
    ],
    timeLabel: "12 minutes ago · Tap to arrange shipping",
    group: "new",
    thumbnail: true,
    image: artworks[22]?.image,
    read: false,
  },
  {
    id: "n2",
    type: "comment",
    category: "comments",
    actorInitials: "TA",
    parts: [{ text: "Tunde A.", bold: true }, { text: " commented: “The texture in this is unreal 🔥”" }],
    timeLabel: "1 hour ago · Harmattan Dusk",
    group: "new",
    thumbnail: true,
    image: artworks[20]?.image,
    read: false,
  },
  {
    id: "n3",
    type: "tag",
    category: "shares",
    actorInitials: "NK",
    parts: [
      { text: "Nneka K.", bold: true },
      { text: " tagged you in a post about the Lagos Contemporary Fair" },
    ],
    timeLabel: "2 hours ago",
    group: "new",
    read: false,
  },
  {
    id: "n4",
    type: "like",
    category: "likes",
    actorInitials: "AO",
    parts: [
      { text: "Ada O.", bold: true },
      { text: ", " },
      { text: "Femi B.", bold: true },
      { text: " and " },
      { text: "22 others", bold: true },
      { text: " liked " },
      { text: "Reclaimed Throne", bold: true },
    ],
    timeLabel: "3 hours ago",
    group: "new",
    thumbnail: true,
    image: artworks[21]?.image,
    read: false,
  },
  {
    id: "n5",
    type: "share",
    category: "shares",
    actorInitials: "KB",
    parts: [
      { text: "Kwame B.", bold: true },
      { text: " shared " },
      { text: "Harmattan Dusk", bold: true },
      { text: " to their story" },
    ],
    timeLabel: "Yesterday",
    group: "earlier",
    read: true,
  },
  {
    id: "n6",
    type: "follow",
    actorInitials: "IM",
    parts: [{ text: "Ifeoma M.", bold: true }, { text: " started following you" }],
    timeLabel: "Yesterday",
    group: "earlier",
    isFollow: true,
    read: true,
  },
];

interface NotificationsState {
  notifications: Notification[];
  followedBackIds: Record<string, boolean>;
  markAllRead: () => void;
  markRead: (id: string) => void;
  followBack: (id: string) => void;
  unreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: seedNotifications,
      followedBackIds: {},
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      markRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      followBack: (id) => set((s) => ({ followedBackIds: { ...s.followedBackIds, [id]: true } })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: "artspace-notifications", skipHydration: true }
  )
);
