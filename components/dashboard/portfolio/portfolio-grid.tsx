"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutGrid, List, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkCard, type Work } from "./work-card";

const works: Work[] = [
  {
    id: "1",
    title: "Harmattan Dusk",
    medium: "Oil on canvas · 90×120cm",
    status: "for-sale",
    price: 620_000,
    limited: { sold: 5, total: 20 },
    likes: 284,
    comments: [
      { id: "c1-1", author: "Tunde A.", authorInitials: "TA", text: "The light in this is incredible.", timeLabel: "2d ago" },
      { id: "c1-2", author: "Naomi K.", authorInitials: "NK", text: "Is this part of the Harmattan series?", timeLabel: "1d ago" },
    ],
  },
  {
    id: "2",
    title: "Reclaimed Throne",
    medium: "Mixed media · 100×140cm",
    status: "for-sale",
    price: 1_200_000,
    likes: 412,
    comments: [
      { id: "c2-1", author: "Chidi O.", authorInitials: "CO", text: "This needs to be in a gallery.", timeLabel: "5h ago" },
    ],
  },
  {
    id: "3",
    title: "Movement No. 4",
    medium: "Oil & mixed media",
    status: "sold",
    price: 480_000,
    likes: 156,
  },
  {
    id: "4",
    title: "Lagos Lines",
    medium: "Custom · made to order",
    status: "commission",
    price: 250_000,
    priceLabel: "From",
    likes: 73,
  },
  {
    id: "5",
    title: "Ancestral Gold",
    medium: "Acrylic · 80×80cm",
    status: "for-sale",
    price: 540_000,
    likes: 198,
  },
  {
    id: "6",
    title: "Untitled (River)",
    medium: "Not published",
    status: "draft",
  },
  {
    id: "7",
    title: "Market Day",
    medium: "Oil on linen · 70×90cm",
    status: "for-sale",
    price: 390_000,
    likes: 91,
  },
];

const tabs = [
  { key: "all", label: "All works" },
  { key: "for-sale", label: "For sale" },
  { key: "sold", label: "Sold" },
  { key: "draft", label: "Drafts" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function PortfolioGrid() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const counts: Record<TabKey, number> = {
    all: works.length,
    "for-sale": works.filter((w) => w.status === "for-sale").length,
    sold: works.filter((w) => w.status === "sold").length,
    draft: works.filter((w) => w.status === "draft").length,
  };

  const filtered = activeTab === "all" ? works : works.filter((w) => w.status === activeTab);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors",
                activeTab === tab.key
                  ? "border-accent text-foreground"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              )}
            >
              {tab.label} <span className="text-foreground-subtle">{counts[tab.key]}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 pb-2.5">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground-muted transition-colors hover:text-foreground"
          >
            Newest first
            <ChevronDown size={13} />
          </button>
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn(
                "flex h-8 w-8 items-center justify-center transition-colors",
                view === "grid" ? "bg-surface-raised text-accent" : "bg-surface text-foreground-subtle hover:text-foreground"
              )}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn(
                "flex h-8 w-8 items-center justify-center transition-colors",
                view === "list" ? "bg-surface-raised text-accent" : "bg-surface text-foreground-subtle hover:text-foreground"
              )}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mt-6 grid gap-4",
          view === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"
        )}
      >
        {filtered.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}

        {activeTab === "all" && (
          <Link
            href="/dashboard/portfolio/new"
            className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-raised transition-colors hover:border-accent/50 hover:bg-accent/5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-overlay text-foreground-subtle transition-colors group-hover:border-accent/40 group-hover:text-accent">
              <Plus size={16} />
            </span>
            <span className="text-xs font-semibold text-foreground-subtle group-hover:text-accent">Add work</span>
          </Link>
        )}
      </div>
    </div>
  );
}
