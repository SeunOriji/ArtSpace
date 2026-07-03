import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SharedArtwork {
  title: string;
  subtitle: string;
}

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text?: string;
  sharedArtwork?: SharedArtwork;
  timeLabel: string;
  readLabel?: string;
}

export interface Thread {
  id: string;
  name: string;
  initials: string;
  isOnline: boolean;
  timeLabel: string;
  preview: string;
  previewIsMine: boolean;
  unreadCount: number;
  messages: ChatMessage[];
}

const seedThreads: Thread[] = [
  {
    id: "chidi",
    name: "Chidi Eze",
    initials: "CE",
    isOnline: true,
    timeLabel: "2:14 PM",
    preview: "Perfect — sending a quote now 🎨",
    previewIsMine: true,
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        from: "them",
        text: "Hi Amara! I saw Harmattan Dusk and I'm obsessed. Do you take commissions?",
        timeLabel: "1:52 PM",
      },
      {
        id: "m2",
        from: "me",
        text: "Thank you so much 🙏 Yes I do — I'm open right now. What did you have in mind?",
        timeLabel: "1:55 PM",
      },
      {
        id: "m3",
        from: "them",
        text: "A large piece for my living room — same energy but cooler tones. Around 120×150cm, before December. Budget's flexible, ₦800k–1.2M.",
        timeLabel: "2:02 PM",
      },
      {
        id: "m4",
        from: "me",
        sharedArtwork: { title: "Harmattan Dusk", subtitle: "Reference · Oil & mixed media" },
        timeLabel: "2:10 PM",
      },
      {
        id: "m5",
        from: "me",
        text: "Perfect. I'll put together a quote with milestones now — you'll be able to accept it right here. 🎨",
        timeLabel: "2:14 PM",
        readLabel: "Read 2:14 PM",
      },
    ],
  },
  {
    id: "tunde",
    name: "Tunde Adeyemi",
    initials: "TA",
    isOnline: true,
    timeLabel: "1:02 PM",
    preview: "That process reel was 🔥🔥",
    previewIsMine: false,
    unreadCount: 2,
    messages: [
      { id: "m1", from: "them", text: "That process reel was 🔥🔥", timeLabel: "1:02 PM" },
    ],
  },
  {
    id: "ngozi",
    name: "Ngozi Eze",
    initials: "NE",
    isOnline: false,
    timeLabel: "11:40 AM",
    preview: "You: Let's share that kiln next week",
    previewIsMine: true,
    unreadCount: 0,
    messages: [
      { id: "m1", from: "me", text: "Let's share that kiln next week", timeLabel: "11:40 AM" },
    ],
  },
  {
    id: "kwame",
    name: "Kwame Boateng",
    initials: "KB",
    isOnline: false,
    timeLabel: "Yesterday",
    preview: "Sent a photo",
    previewIsMine: false,
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        from: "them",
        sharedArtwork: { title: "Studio corner", subtitle: "Photo" },
        timeLabel: "Yesterday",
      },
    ],
  },
  {
    id: "ifeoma",
    name: "Ifeoma M.",
    initials: "IM",
    isOnline: false,
    timeLabel: "Yesterday",
    preview: "You: Thank you! 🙏",
    previewIsMine: true,
    unreadCount: 0,
    messages: [{ id: "m1", from: "me", text: "Thank you! 🙏", timeLabel: "Yesterday" }],
  },
  {
    id: "bola",
    name: "Bola Taiwo",
    initials: "BT",
    isOnline: false,
    timeLabel: "Mon",
    preview: "Are the pieces still available?",
    previewIsMine: false,
    unreadCount: 0,
    messages: [
      { id: "m1", from: "them", text: "Are the pieces still available?", timeLabel: "Mon" },
    ],
  },
];

interface MessagesState {
  threads: Thread[];
  sendMessage: (threadId: string, text: string) => void;
  markThreadRead: (threadId: string) => void;
  totalUnreadCount: () => number;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      threads: seedThreads,

      sendMessage: (threadId, text) =>
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  preview: text,
                  previewIsMine: true,
                  timeLabel: "Now",
                  messages: [
                    ...t.messages,
                    { id: `m${Date.now()}`, from: "me", text, timeLabel: "Now" },
                  ],
                }
              : t
          ),
        })),

      markThreadRead: (threadId) =>
        set((s) => ({
          threads: s.threads.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t)),
        })),

      totalUnreadCount: () => get().threads.reduce((sum, t) => sum + t.unreadCount, 0),
    }),
    { name: "artspace-messages", skipHydration: true }
  )
);
