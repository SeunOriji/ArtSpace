import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CommissionRequestStatus = "new" | "quoted" | "declined";

export interface CommissionRequest {
  id: string;
  clientName: string;
  clientInitials: string;
  budgetLabel: string;
  timeLabel: string;
  message: string;
  status: CommissionRequestStatus;
}

export type MilestoneStatus = "done" | "current" | "upcoming";

export interface CommissionMilestone {
  id: string;
  label: string;
  detail: string;
  status: MilestoneStatus;
  actionLabel?: string;
}

export interface ActiveCommission {
  id: string;
  title: string;
  clientName: string;
  clientInitials: string;
  price: number;
  depositAmount: number;
  dueLabel: string;
  healthLabel: string;
  milestones: CommissionMilestone[];
}

export interface CompletedCommission {
  id: string;
  title: string;
  clientName: string;
  price: number;
  completedLabel: string;
}

const seedRequests: CommissionRequest[] = [
  {
    id: "req-1",
    clientName: "Chidi Eze",
    clientInitials: "CE",
    budgetLabel: "₦800,000 – ₦1,200,000",
    timeLabel: "Requested 3 hours ago",
    message:
      "I'd love a large mixed-media piece for my living room — something in the spirit of Harmattan Dusk but with cooler tones. Around 120×150cm. Needed before December.",
    status: "new",
  },
  {
    id: "req-2",
    clientName: "Lola Martins",
    clientInitials: "LM",
    budgetLabel: "₦250,000 – ₦400,000",
    timeLabel: "Requested 1 day ago",
    message: "A portrait commission of my grandmother from a photo — oil, roughly 60×80cm.",
    status: "new",
  },
];

const seedActive: ActiveCommission[] = [
  {
    id: "com-1",
    title: "Ancestral Portrait",
    clientName: "Ifeoma M.",
    clientInitials: "IM",
    price: 650_000,
    depositAmount: 195_000,
    dueLabel: "Due Aug 30",
    healthLabel: "On track",
    milestones: [
      {
        id: "m1",
        label: "Deposit received",
        detail: "₦195,000 (30%) held in escrow · Jul 12",
        status: "done",
      },
      {
        id: "m2",
        label: "Sketch approved",
        detail: "Buyer signed off · Jul 24",
        status: "done",
      },
      {
        id: "m3",
        label: "Work in progress",
        detail: "Share a progress update with your buyer.",
        status: "current",
        actionLabel: "Upload update",
      },
      {
        id: "m4",
        label: "Final delivery & payout",
        detail: "Remaining ₦455,000 released on approval",
        status: "upcoming",
        actionLabel: "Mark as delivered",
      },
    ],
  },
  {
    id: "com-2",
    title: "Skyline Study",
    clientName: "Tunde A.",
    clientInitials: "TA",
    price: 420_000,
    depositAmount: 126_000,
    dueLabel: "Due Aug 12",
    healthLabel: "On track",
    milestones: [
      {
        id: "m1",
        label: "Deposit received",
        detail: "₦126,000 (30%) held in escrow · Jul 5",
        status: "done",
      },
      {
        id: "m2",
        label: "Sketch approved",
        detail: "Submit a sketch for the buyer to approve.",
        status: "current",
        actionLabel: "Submit sketch",
      },
      {
        id: "m3",
        label: "Work in progress",
        detail: "Share progress on the finished piece.",
        status: "upcoming",
        actionLabel: "Upload update",
      },
      {
        id: "m4",
        label: "Final delivery & payout",
        detail: "Remaining ₦294,000 released on approval",
        status: "upcoming",
        actionLabel: "Mark as delivered",
      },
    ],
  },
  {
    id: "com-3",
    title: "Golden Hour Diptych",
    clientName: "Wale O.",
    clientInitials: "WO",
    price: 900_000,
    depositAmount: 0,
    dueLabel: "Due Sep 18",
    healthLabel: "Awaiting deposit",
    milestones: [
      {
        id: "m1",
        label: "Deposit received",
        detail: "Waiting on ₦270,000 (30%) deposit to clear.",
        status: "current",
        actionLabel: "Confirm deposit received",
      },
      {
        id: "m2",
        label: "Sketch approved",
        detail: "Submit a sketch for the buyer to approve.",
        status: "upcoming",
        actionLabel: "Submit sketch",
      },
      {
        id: "m3",
        label: "Work in progress",
        detail: "Share progress on the finished piece.",
        status: "upcoming",
        actionLabel: "Upload update",
      },
      {
        id: "m4",
        label: "Final delivery & payout",
        detail: "Remaining ₦630,000 released on approval",
        status: "upcoming",
        actionLabel: "Mark as delivered",
      },
    ],
  },
];

const completedSeed: [title: string, client: string, price: number, when: string][] = [
  ["Reclaimed Throne", "Ada O.", 380_000, "Jun 2"],
  ["Coastal Memory", "Segun T.", 250_000, "May 28"],
  ["Whispers of Osun", "Ngozi A.", 610_000, "May 14"],
  ["Midnight Bloom", "Yusuf K.", 320_000, "Apr 30"],
  ["Portrait: The Elder", "Chiamaka N.", 540_000, "Apr 19"],
  ["Harmattan Dusk II", "Bayo F.", 700_000, "Apr 2"],
  ["Still Life, Kola", "Amina L.", 210_000, "Mar 21"],
  ["Lagos Skyline", "Emeka D.", 460_000, "Mar 8"],
  ["Golden Thread", "Zainab R.", 330_000, "Feb 24"],
  ["Ancestors' Gaze", "Tobi M.", 580_000, "Feb 9"],
  ["Ocean Drift", "Ifeanyi C.", 275_000, "Jan 27"],
  ["The Gathering", "Adaeze P.", 495_000, "Jan 11"],
];

const seedCompleted: CompletedCommission[] = completedSeed.map(([title, clientName, price, when], i) => ({
  id: `done-${i + 1}`,
  title,
  clientName,
  price,
  completedLabel: when,
}));

interface CommissionsState {
  requests: CommissionRequest[];
  active: ActiveCommission[];
  completed: CompletedCommission[];
  sendQuote: (id: string) => void;
  decline: (id: string) => void;
  advanceMilestone: (commissionId: string) => void;
  newRequestsCount: () => number;
}

export const useCommissionsStore = create<CommissionsState>()(
  persist(
    (set, get) => ({
      requests: seedRequests,
      active: seedActive,
      completed: seedCompleted,

      sendQuote: (id) =>
        set((s) => ({
          requests: s.requests.map((r) => (r.id === id ? { ...r, status: "quoted" } : r)),
        })),

      decline: (id) =>
        set((s) => ({
          requests: s.requests.map((r) => (r.id === id ? { ...r, status: "declined" } : r)),
        })),

      advanceMilestone: (commissionId) =>
        set((s) => {
          const index = s.active.findIndex((c) => c.id === commissionId);
          if (index === -1) return s;

          const commission = s.active[index];
          const milestones = commission.milestones.map((m) => ({ ...m }));
          const currentIndex = milestones.findIndex((m) => m.status === "current");
          if (currentIndex === -1) return s;

          milestones[currentIndex].status = "done";

          if (currentIndex < milestones.length - 1) {
            milestones[currentIndex + 1].status = "current";
            const active = [...s.active];
            active[index] = { ...commission, milestones };
            return { active };
          }

          const active = s.active.filter((c) => c.id !== commissionId);
          const completed: CompletedCommission[] = [
            {
              id: commission.id,
              title: commission.title,
              clientName: commission.clientName,
              price: commission.price,
              completedLabel: "Just now",
            },
            ...s.completed,
          ];
          return { active, completed };
        }),

      newRequestsCount: () => get().requests.filter((r) => r.status === "new").length,
    }),
    { name: "artspace-commissions" }
  )
);
