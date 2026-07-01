"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, ChevronDown, Heart, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Medium = "painting" | "sculpture" | "photography" | "textile" | "digital";
type Tag = "limited" | "sale" | "commission" | "new";
type Chip = "all" | "trending" | "new" | "limited" | "under200k" | "commission";
type PriceRange = "all" | "under100k" | "100k-500k" | "500k-1m" | "1m+";
type SortBy = "trending" | "newest" | "price-asc" | "price-desc";

interface MarketplaceWork {
  id: string;
  title: string;
  artist: string;
  artistInitials: string;
  price: number;
  priceLabel?: string;
  medium: Medium;
  tag: Tag;
  tagLabel: string;
  trending?: boolean;
  isNew?: boolean;
  aspect: string;
}

const works: MarketplaceWork[] = [
  { id: "1", title: "Harmattan Dusk", artist: "Tunde A.", artistInitials: "TA", price: 620_000, medium: "painting", tag: "limited", tagLabel: "Limited · 5/20", trending: true, aspect: "aspect-[1/1.2]" },
  { id: "2", title: "Reclaimed Throne", artist: "Ngozi E.", artistInitials: "NE", price: 1_200_000, medium: "sculpture", tag: "sale", tagLabel: "For sale", trending: true, aspect: "aspect-square" },
  { id: "3", title: "Lagos Lines", artist: "Kwame B.", artistInitials: "KB", price: 250_000, priceLabel: "From", medium: "digital", tag: "commission", tagLabel: "Commission", aspect: "aspect-[1/1.15]" },
  { id: "4", title: "Ancestral Gold", artist: "Amara O.", artistInitials: "AO", price: 540_000, medium: "painting", tag: "sale", tagLabel: "For sale", aspect: "aspect-[1/0.95]" },
  { id: "5", title: "Market Day", artist: "Femi O.", artistInitials: "FO", price: 390_000, medium: "painting", tag: "new", tagLabel: "New", isNew: true, aspect: "aspect-[1/1.1]" },
  { id: "6", title: "Clay & Fire", artist: "Adaeze N.", artistInitials: "AN", price: 210_000, medium: "sculpture", tag: "sale", tagLabel: "For sale", aspect: "aspect-square" },
  { id: "7", title: "Night Masquerade", artist: "Bola T.", artistInitials: "BT", price: 880_000, medium: "photography", tag: "limited", tagLabel: "Limited · 2/10", trending: true, aspect: "aspect-[1/1.2]" },
  { id: "8", title: "River Memory", artist: "Chuka I.", artistInitials: "CI", price: 175_000, medium: "photography", tag: "sale", tagLabel: "For sale", aspect: "aspect-[1/0.9]" },
  { id: "9", title: "Woven Spirits", artist: "Halima Y.", artistInitials: "HY", price: 95_000, medium: "textile", tag: "sale", tagLabel: "For sale", aspect: "aspect-square" },
  { id: "10", title: "Sahel Horizon", artist: "Tunde A.", artistInitials: "TA", price: 460_000, medium: "painting", tag: "new", tagLabel: "New", isNew: true, aspect: "aspect-[1/1.1]" },
  { id: "11", title: "Bronze Memory", artist: "Ngozi E.", artistInitials: "NE", price: 150_000, priceLabel: "From", medium: "sculpture", tag: "commission", tagLabel: "Commission", aspect: "aspect-[1/0.95]" },
  { id: "12", title: "Indigo Cloth", artist: "Halima Y.", artistInitials: "HY", price: 68_000, medium: "textile", tag: "sale", tagLabel: "For sale", trending: true, aspect: "aspect-[1/1.2]" },
];

const chips: { key: Chip; label: string }[] = [
  { key: "all", label: "All works" },
  { key: "trending", label: "Trending" },
  { key: "new", label: "New arrivals" },
  { key: "limited", label: "Limited editions" },
  { key: "under200k", label: "Under ₦200k" },
  { key: "commission", label: "Commissions open" },
];

const mediumFilters: { key: Medium; label: string; count: number }[] = [
  { key: "painting", label: "Painting", count: 412 },
  { key: "sculpture", label: "Sculpture", count: 96 },
  { key: "photography", label: "Photography", count: 154 },
  { key: "textile", label: "Textile & craft", count: 73 },
  { key: "digital", label: "Digital", count: 61 },
];

const priceFilters: { key: PriceRange; label: string }[] = [
  { key: "under100k", label: "Under 100k" },
  { key: "100k-500k", label: "100k – 500k" },
  { key: "500k-1m", label: "500k – 1M" },
  { key: "1m+", label: "1M+" },
];

const sortOptions: { key: SortBy; label: string }[] = [
  { key: "trending", label: "Trending" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

const tagColor: Record<Tag, string> = {
  limited: "text-gold",
  sale: "text-foreground-muted",
  commission: "text-accent",
  new: "text-gold",
};

function formatNGN(n: number) {
  return n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` : `₦${Math.round(n / 1000)}k`;
}

function inPriceRange(price: number, range: PriceRange) {
  switch (range) {
    case "under100k":
      return price < 100_000;
    case "100k-500k":
      return price >= 100_000 && price < 500_000;
    case "500k-1m":
      return price >= 500_000 && price < 1_000_000;
    case "1m+":
      return price >= 1_000_000;
    default:
      return true;
  }
}

export function MarketplaceView() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState<Chip>("all");
  const [activeMedium, setActiveMedium] = useState<Medium | "all">("all");
  const [activePrice, setActivePrice] = useState<PriceRange>("all");
  const [sortBy, setSortBy] = useState<SortBy>("trending");
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  function toggleSaved(id: string) {
    setSavedIds((s) => ({ ...s, [id]: !s[id] }));
  }

  const filtered = useMemo(() => {
    let list = works;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((w) => w.title.toLowerCase().includes(q) || w.artist.toLowerCase().includes(q));
    }
    if (activeChip === "trending") list = list.filter((w) => w.trending);
    else if (activeChip === "new") list = list.filter((w) => w.isNew);
    else if (activeChip === "limited") list = list.filter((w) => w.tag === "limited");
    else if (activeChip === "under200k") list = list.filter((w) => w.price < 200_000);
    else if (activeChip === "commission") list = list.filter((w) => w.tag === "commission");

    if (activeMedium !== "all") list = list.filter((w) => w.medium === activeMedium);
    if (activePrice !== "all") list = list.filter((w) => inPriceRange(w.price, activePrice));

    const sorted = [...list];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    else sorted.sort((a, b) => Number(b.trending) - Number(a.trending));

    return sorted;
  }, [search, activeChip, activeMedium, activePrice, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  function handleChipClick(key: Chip) {
    setActiveChip(key);
    setVisibleCount(8);
  }

  function handleMediumClick(key: Medium) {
    setActiveMedium((m) => (m === key ? "all" : key));
    setVisibleCount(8);
  }

  function handlePriceClick(key: PriceRange) {
    setActivePrice((p) => (p === key ? "all" : key));
    setVisibleCount(8);
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[220px_1fr]">
      {/* Filters sidebar */}
      <aside className="flex flex-col gap-6 lg:sticky lg:top-7 lg:self-start">
        <div>
          <p className="mb-2.5 px-1 text-xs font-bold uppercase tracking-wide text-foreground-subtle">Medium</p>
          <div className="flex flex-col gap-0.5">
            {mediumFilters.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => handleMediumClick(m.key)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition-colors",
                  activeMedium === m.key ? "bg-surface-raised text-foreground" : "text-foreground-muted hover:text-foreground"
                )}
              >
                {m.label}
                <span className="text-xs font-medium text-foreground-subtle">{m.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2.5 px-1 text-xs font-bold uppercase tracking-wide text-foreground-subtle">Price (₦)</p>
          <div className="flex flex-col gap-0.5">
            {priceFilters.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => handlePriceClick(p.key)}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition-colors",
                  activePrice === p.key ? "bg-surface-raised text-foreground" : "text-foreground-muted hover:text-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0">
        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search works, artists, styles…"
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-4 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent"
          />
        </div>

        {/* Hero */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-raised to-background p-7">
          <div className="max-w-lg">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-gold">The Marketplace</p>
            <h1 className="font-heading text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
              Original African art, straight from the studio.
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-foreground-muted">
              Every piece is verified, escrow-protected, and ships with a Proof-of-Craft reel. 1,140 works available
              now.
            </p>
          </div>
        </div>

        {/* Chips */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => handleChipClick(c.key)}
              className={cn(
                "flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                activeChip === c.key
                  ? "bg-accent text-white"
                  : "border border-border-subtle bg-surface text-foreground-muted hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Results bar */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground-muted">
            <span className="font-heading font-extrabold text-foreground">{filtered.length}</span> works for sale
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground"
            >
              Sort: {sortOptions.find((o) => o.key === sortBy)?.label}
              <ChevronDown size={13} className={cn("transition-transform", sortOpen && "rotate-180")} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-10 mt-1.5 min-w-[180px] overflow-hidden rounded-xl border border-border bg-surface-raised p-1.5 shadow-2xl">
                {sortOptions.map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => {
                      setSortBy(o.key);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors",
                      sortBy === o.key ? "bg-accent/10 text-accent" : "text-foreground hover:bg-surface-overlay"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-foreground-subtle">No works match these filters.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((w) => (
              <div key={w.id} className="flex flex-col gap-2.5">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised",
                    w.aspect
                  )}
                >
                  <span className={cn("absolute left-2.5 top-2.5 rounded-full border border-border-subtle bg-background/85 px-2.5 py-1 text-[10px] font-bold", tagColor[w.tag])}>
                    {w.tagLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSaved(w.id)}
                    aria-pressed={!!savedIds[w.id]}
                    aria-label="Save work"
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-background/85 text-foreground-muted transition-colors hover:text-accent"
                  >
                    <Heart size={15} fill={savedIds[w.id] ? "currentColor" : "none"} className={savedIds[w.id] ? "text-accent" : undefined} />
                  </button>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-heading text-sm font-bold text-foreground">{w.title}</p>
                  <p className="flex-shrink-0 font-heading text-sm font-extrabold text-accent">
                    {w.priceLabel ? `${w.priceLabel} ` : ""}
                    {formatNGN(w.price)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground-subtle">
                  {w.artist}
                  <BadgeCheck size={13} className="text-gold" />
                </div>
              </div>
            ))}
          </div>
        )}

        {canLoadMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 8)}
              className="rounded-xl border border-border-subtle px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-raised"
            >
              Load more works
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
