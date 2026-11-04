"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Bookmark, Check, ChevronDown, Heart, Play, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import { ArtworkThumbnail } from "@/components/artwork-lightbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  collectorWorks,
  collectorWorkToCartItem,
  formatNaira,
  formatNairaShort,
  type CollectorMedium,
  type CollectorWork,
  type ShipFrom,
} from "@/lib/collector-works";
import { useCartStore } from "@/store/cart.store";
import { useInteractionsStore } from "@/store/interactions.store";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { CartPanel, cartTotals, itemCountLabel, useCartItems, useIsInCart } from "./cart-panel";

type Chip = "all" | "new" | "limited" | "under200k" | "following";
type SortBy = "trending" | "newest" | "price-asc" | "price-desc";

const PRICE_MIN = 50_000;
const PRICE_MAX = 1_500_000;
const PRICE_STEP = 50_000;

const chips: { key: Chip; label: string; short: string }[] = [
  { key: "all", label: "All works", short: "All" },
  { key: "new", label: "New arrivals", short: "New" },
  { key: "limited", label: "Limited editions", short: "Limited" },
  { key: "under200k", label: "Under ₦200k", short: "Under ₦200k" },
  { key: "following", label: "From artists you follow", short: "Following" },
];

const mediums: { key: CollectorMedium | "all"; label: string }[] = [
  { key: "all", label: "All mediums" },
  { key: "painting", label: "Painting" },
  { key: "sculpture", label: "Sculpture" },
  { key: "photography", label: "Photography" },
  { key: "textile", label: "Textile & craft" },
  { key: "ceramic", label: "Ceramic" },
  { key: "print", label: "Print" },
];

const countries: ShipFrom[] = ["Nigeria", "Ghana", "Kenya"];

const sortLabels: Record<SortBy, string> = {
  trending: "Trending",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

const tagToneClass: Record<CollectorWork["tagTone"], string> = {
  gold: "text-gold",
  accent: "text-accent",
  green: "text-emerald-400",
  muted: "text-foreground-muted",
};

interface Filters {
  medium: CollectorMedium | "all";
  maxPrice: number;
  shipFrom: ShipFrom[];
}

function FilterPanel({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  function toggleCountry(c: ShipFrom) {
    const shipFrom = filters.shipFrom.includes(c)
      ? filters.shipFrom.filter((x) => x !== c)
      : [...filters.shipFrom, c];
    onChange({ ...filters, shipFrom });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">Medium</p>
        <div className="flex flex-col gap-0.5">
          {mediums.map((m) => {
            const count =
              m.key === "all" ? collectorWorks.length : collectorWorks.filter((w) => w.medium === m.key).length;
            const active = filters.medium === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => onChange({ ...filters, medium: m.key })}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition-colors",
                  active ? "bg-surface-raised text-foreground" : "text-foreground-muted hover:text-foreground"
                )}
              >
                {m.label}
                <span className="text-[11px] text-foreground-subtle">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between px-1">
          <label htmlFor="max-price" className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
            Max price
          </label>
          <span className="text-xs font-semibold text-foreground-muted">
            {filters.maxPrice >= PRICE_MAX ? "Any" : formatNairaShort(filters.maxPrice)}
          </span>
        </div>
        <input
          id="max-price"
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-accent"
        />
        <div className="mt-1 flex justify-between px-0.5 text-[11px] text-foreground-subtle">
          <span>{formatNairaShort(PRICE_MIN)}</span>
          <span>{formatNairaShort(PRICE_MAX)}+</span>
        </div>
      </div>

      <div>
        <p className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">Ships from</p>
        <div className="flex flex-wrap gap-1.5">
          {countries.map((c) => {
            const active = filters.shipFrom.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCountry(c)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border-subtle bg-surface text-foreground-muted hover:text-foreground"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkCard({ work }: { work: CollectorWork }) {
  const hasMounted = useHasMounted();
  const inCart = useIsInCart(work.id);
  const toggleItem = useCartStore((s) => s.toggleItem);
  const saved = useInteractionsStore((s) => s.savedWorkIds[work.id] ?? false) && hasMounted;
  const toggleSave = useInteractionsStore((s) => s.toggleSave);

  return (
    <div className="flex h-full min-w-0 flex-col gap-2.5">
      <div
        className={cn(
          "relative aspect-[1/1.1] overflow-hidden rounded-xl border bg-gradient-to-br from-surface-overlay to-surface-raised transition-colors",
          inCart ? "border-accent" : "border-border"
        )}
      >
        {work.image && (
          <ArtworkThumbnail
            artwork={{
              id: `mkt-${work.id}`,
              image: work.image,
              imageLarge: work.imageLarge ?? work.image,
              title: work.title,
              artist: work.artist,
            }}
            sizes="(min-width: 1280px) 260px, (min-width: 768px) 30vw, 45vw"
          />
        )}
        <span
          className={cn(
            "pointer-events-none absolute left-2 top-2 rounded-full border border-border-subtle bg-background/85 px-2.5 py-0.5 text-[10px] font-bold sm:left-2.5 sm:top-2.5",
            tagToneClass[work.tagTone]
          )}
        >
          {work.tag}
        </span>
        <button
          type="button"
          onClick={() => toggleSave(work.id)}
          aria-pressed={saved}
          aria-label={saved ? `Unsave ${work.title}` : `Save ${work.title}`}
          className={cn(
            "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-background/85 transition-colors sm:right-2.5 sm:top-2.5",
            saved ? "text-accent" : "text-foreground-muted hover:text-foreground"
          )}
        >
          <Heart size={14} fill={saved ? "currentColor" : "none"} />
        </button>
        <span className="pointer-events-none absolute bottom-2.5 left-2.5 hidden items-center gap-1 rounded-full bg-background/85 px-2.5 py-0.5 text-[10px] font-semibold text-foreground-muted sm:flex">
          <Play size={9} className="text-accent" fill="currentColor" />
          Process reel
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-heading text-sm font-bold text-foreground sm:text-[15px]">{work.title}</p>
          <p className="flex-shrink-0 font-heading text-xs font-extrabold text-accent sm:text-sm">
            {formatNairaShort(work.price)}
          </p>
        </div>
        <p className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-foreground-subtle">
          <span className="truncate">{work.artist}</span>
          <BadgeCheck size={12} className="flex-shrink-0 text-gold" />
          <span className="hidden truncate sm:inline">· {work.mediumLabel}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => toggleItem(collectorWorkToCartItem(work))}
        aria-pressed={inCart}
        className={cn(
          "mt-auto flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-bold transition-colors sm:py-2.5 sm:text-[13px]",
          inCart
            ? "border-accent bg-surface-raised text-foreground hover:bg-surface-overlay"
            : "border-accent bg-accent text-white hover:bg-accent-hover"
        )}
      >
        {inCart ? (
          <>
            <Check size={14} />
            In cart<span className="hidden sm:inline"> · Remove</span>
          </>
        ) : (
          "Add to cart"
        )}
      </button>
    </div>
  );
}

export function MarketplaceView() {
  const [chip, setChip] = useState<Chip>("all");
  const [sortBy, setSortBy] = useState<SortBy>("trending");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({ medium: "all", maxPrice: PRICE_MAX, shipFrom: [] });
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const cartItems = useCartItems();
  const { total } = cartTotals(cartItems);

  const visibleWorks = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = collectorWorks.filter((w) => {
      if (chip === "new" && !w.isNew) return false;
      if (chip === "limited" && !w.isLimited) return false;
      if (chip === "under200k" && w.price >= 200_000) return false;
      if (chip === "following" && !w.followed) return false;
      if (filters.medium !== "all" && w.medium !== filters.medium) return false;
      if (filters.maxPrice < PRICE_MAX && w.price > filters.maxPrice) return false;
      if (filters.shipFrom.length > 0 && !filters.shipFrom.includes(w.country)) return false;
      if (q && ![w.title, w.artist, w.mediumLabel, w.city].some((s) => s.toLowerCase().includes(q))) return false;
      return true;
    });
    return list.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
      return b.trending - a.trending;
    });
  }, [chip, sortBy, query, filters]);

  const activeFilterCount =
    (filters.medium !== "all" ? 1 : 0) + (filters.maxPrice < PRICE_MAX ? 1 : 0) + filters.shipFrom.length;

  function resetAll() {
    setChip("all");
    setQuery("");
    setFilters({ medium: "all", maxPrice: PRICE_MAX, shipFrom: [] });
  }

  return (
    <div className="flex min-h-full">
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex-none border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md lg:px-6">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-lg font-extrabold text-foreground lg:hidden">Marketplace</h1>
            <div className="relative hidden max-w-sm flex-1 lg:block">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle" />
              <label htmlFor="market-search" className="sr-only">
                Search works, artists, styles
              </label>
              <input
                id="market-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search works, artists, styles…"
                className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-4 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent"
              />
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <Link
                href="/collector/saved"
                aria-label="Saved works"
                className="hidden h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted transition-colors hover:text-foreground sm:flex"
              >
                <Bookmark size={16} />
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-accent bg-surface-raised px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-surface-overlay 2xl:hidden"
              >
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">Cart</span>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 font-heading text-[11px] font-extrabold text-white">
                  {cartItems.length}
                </span>
              </button>
            </div>
          </div>
          {/* Mobile search + filters */}
          <div className="mt-3 flex gap-2 lg:hidden">
            <div className="relative flex-1">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle" />
              <label htmlFor="market-search-mobile" className="sr-only">
                Search works
              </label>
              <input
                id="market-search-mobile"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search works…"
                className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent"
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              aria-label="Filters"
              className="relative flex w-11 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted"
            >
              <SlidersHorizontal size={16} />
              {activeFilterCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-extrabold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Desktop filters */}
          <aside className="hidden w-56 flex-shrink-0 border-r border-border px-4 py-6 lg:block">
            <div className="sticky top-24">
              <FilterPanel filters={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* Browse */}
          <div className="min-w-0 flex-1 px-4 py-5 pb-32 lg:px-6 lg:py-6 lg:pb-8">
            <div className="mb-4 hidden items-end justify-between gap-4 lg:flex">
              <div>
                <h1 className="font-heading text-2xl font-extrabold text-foreground">Marketplace</h1>
                <p className="mt-1 text-sm text-foreground-subtle">
                  Verified originals · escrow-protected · insured shipping
                </p>
              </div>
              <div className="relative">
                <label htmlFor="market-sort" className="sr-only">
                  Sort by
                </label>
                <select
                  id="market-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="appearance-none rounded-lg border border-border bg-surface py-2 pl-3 pr-8 text-xs font-semibold text-foreground-muted outline-none transition focus:border-accent"
                >
                  {(Object.keys(sortLabels) as SortBy[]).map((s) => (
                    <option key={s} value={s}>
                      Sort: {sortLabels[s]}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle" />
              </div>
            </div>

            <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setChip(c.key)}
                  aria-pressed={chip === c.key}
                  className={cn(
                    "flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                    chip === c.key
                      ? "bg-accent text-white"
                      : "border border-border-subtle bg-surface text-foreground-muted hover:text-foreground"
                  )}
                >
                  <span className="lg:hidden">{c.short}</span>
                  <span className="hidden lg:inline">{c.label}</span>
                </button>
              ))}
            </div>

            {visibleWorks.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <p className="font-heading text-base font-extrabold text-foreground">No works match these filters</p>
                <button type="button" onClick={resetAll} className="text-sm font-bold text-accent hover:text-accent-hover">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 lg:grid-cols-2 lg:gap-x-5 xl:grid-cols-3">
                {visibleWorks.map((w) => (
                  <WorkCard key={w.id} work={w} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Persistent cart on very wide screens */}
      <aside className="hidden w-[360px] flex-shrink-0 border-l border-border 2xl:block">
        <div className="sticky top-0 h-screen">
          <CartPanel />
        </div>
      </aside>

      {/* Mobile cart bar */}
      {cartItems.length > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-3 bottom-[76px] z-40 flex items-center justify-between rounded-2xl bg-accent px-4 py-3 text-left text-white shadow-lg shadow-accent/30 lg:hidden"
        >
          <span>
            <span className="block text-[11px] font-bold">{itemCountLabel(cartItems.length)} in cart</span>
            <span className="block font-heading text-base font-extrabold">{formatNaira(total)}</span>
          </span>
          <span className="rounded-lg bg-background px-4 py-2.5 text-xs font-extrabold text-foreground">View cart →</span>
        </button>
      )}

      {/* Cart slide-over */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent
          showClose={false}
          aria-describedby={undefined}
          className="sm:inset-y-0 sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:max-h-none sm:max-w-md sm:translate-x-0 sm:translate-y-0 sm:rounded-none sm:border-y-0 sm:border-r-0"
        >
          <DialogTitle className="sr-only">Your cart</DialogTitle>
          <CartPanel onClose={() => setCartOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Mobile filters */}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent showClose={false} aria-describedby={undefined} className="sm:max-w-sm">
          <div className="flex flex-none items-center justify-between border-b border-border px-5 py-4">
            <DialogTitle className="text-lg">Filters</DialogTitle>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-raised text-foreground-muted"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FilterPanel filters={filters} onChange={setFilters} />
            <div className="mt-6">
              <label htmlFor="market-sort-mobile" className="mb-2.5 block px-1 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                Sort by
              </label>
              <select
                id="market-sort-mobile"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
              >
                {(Object.keys(sortLabels) as SortBy[]).map((s) => (
                  <option key={s} value={s}>
                    {sortLabels[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-none gap-3 border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={() => setFilters({ medium: "all", maxPrice: PRICE_MAX, shipFrom: [] })}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-bold text-foreground"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="flex-1 rounded-xl bg-accent py-3 text-sm font-bold text-white"
            >
              Show {visibleWorks.length} works
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
