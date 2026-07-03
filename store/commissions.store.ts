import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CommissionRequestStatus = "new" | "quoted" | "declined";

export interface QuoteMilestone {
  id: string;
  label: string;
  amount: number;
}

export interface CommissionQuote {
  title: string;
  totalPrice: number;
  deliveryDate: string;
  depositPercent: number;
  milestones: QuoteMilestone[];
  revisionsIncluded: number;
  sketchStageLabel: string;
  noteToBuyer: string;
}

export interface CommissionRequest {
  id: string;
  clientName: string;
  clientInitials: string;
  budgetLabel: string;
  timeLabel: string;
  message: string;
  status: CommissionRequestStatus;
  quote?: CommissionQuote;
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

export interface PricingTier {
  id: string;
  label: string;
  sizeLabel: string;
  fromPrice: number;
}

export const COMMISSION_TYPES = ["Portraits", "Abstract", "Landscapes", "Murals", "Digital", "NSFW"] as const;
export const TURNAROUND_OPTIONS = ["1–2 weeks", "2–4 weeks", "4–6 weeks", "6–8 weeks", "8–12 weeks"] as const;
export const DEPOSIT_OPTIONS = [20, 30, 50] as const;

export interface CommissionSettings {
  isOpen: boolean;
  tiers: PricingTier[];
  depositPercent: number;
  turnaroundLabel: string;
  acceptedTypes: Record<string, boolean>;
  maxSlots: number;
  requireBrief: boolean;
  termsText: string;
}

const seedSettings: CommissionSettings = {
  isOpen: true,
  tiers: [
    { id: "tier-1", label: "Small", sizeLabel: "Up to 60×60cm", fromPrice: 250_000 },
    { id: "tier-2", label: "Medium", sizeLabel: "Up to 100×120cm", fromPrice: 550_000 },
    { id: "tier-3", label: "Large", sizeLabel: "120cm and above", fromPrice: 1_000_000 },
  ],
  depositPercent: 30,
  turnaroundLabel: "4–6 weeks",
  acceptedTypes: {
    Portraits: true,
    Abstract: true,
    Landscapes: true,
    Murals: false,
    Digital: false,
    NSFW: false,
  },
  maxSlots: 4,
  requireBrief: true,
  termsText:
    "One round of revisions is included at the sketch stage. Deposits are non-refundable once the sketch is approved. Shipping is arranged through ArtSpace with tracking.",
};

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
  settings: CommissionSettings;
  sendQuote: (id: string, quote: CommissionQuote) => void;
  decline: (id: string) => void;
  advanceMilestone: (commissionId: string) => void;
  updateSettings: (settings: CommissionSettings) => void;
  newRequestsCount: () => number;
}

export const useCommissionsStore = create<CommissionsState>()(
  persist(
    (set, get) => ({
      requests: seedRequests,
      active: seedActive,
      completed: seedCompleted,
      settings: seedSettings,

      sendQuote: (id, quote) =>
        set((s) => ({
          requests: s.requests.map((r) => (r.id === id ? { ...r, status: "quoted", quote } : r)),
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

      updateSettings: (settings) => set({ settings }),

      newRequestsCount: () => get().requests.filter((r) => r.status === "new").length,
    }),
    { name: "artspace-commissions", skipHydration: true }
  )
);
