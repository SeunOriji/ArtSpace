"use client";

import { useMemo, useState } from "react";
import { CalendarDays, List, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type EventType = "exhibition" | "fair" | "workshop" | "talk" | "virtual";
type EventBadge = "official" | "verified" | "virtual";
type CityKey = "lagos" | "accra" | "nairobi" | "online";
type Chip = "all" | "this-week" | "exhibitions" | "workshops" | "free" | "virtual";

interface EventItem {
  id: string;
  day: string;
  month: string;
  title: string;
  venue: string;
  city: CityKey;
  type: EventType;
  badge: EventBadge;
  price: number | null;
  cta: string;
  isThisWeek?: boolean;
}

const events: EventItem[] = [
  { id: "1", day: "26", month: "Jun", title: "New Voices: Group Show", venue: "Rele Gallery · Lagos", city: "lagos", type: "exhibition", badge: "verified", price: 5_000, cta: "Tickets", isThisWeek: true },
  { id: "2", day: "02", month: "Jul", title: "Clay & Fire Workshop", venue: "Nike Art Gallery · Lagos", city: "lagos", type: "workshop", badge: "official", price: 15_000, cta: "Book" },
  { id: "3", day: "05", month: "Jul", title: "Diaspora Collectors Talk", venue: "Online · Live stream", city: "online", type: "virtual", badge: "virtual", price: null, cta: "RSVP" },
  { id: "4", day: "11", month: "Jul", title: "Textile Traditions", venue: "Centre for Contemporary Art", city: "lagos", type: "exhibition", badge: "verified", price: null, cta: "RSVP", isThisWeek: true },
  { id: "5", day: "18", month: "Jul", title: "Accra Art Night", venue: "Gallery 1957 · Accra", city: "accra", type: "fair", badge: "official", price: 8_000, cta: "Tickets" },
  { id: "6", day: "24", month: "Jul", title: "Portfolio Review Clinic", venue: "Online · Zoom", city: "online", type: "virtual", badge: "virtual", price: 3_000, cta: "Book" },
  { id: "7", day: "01", month: "Aug", title: "Nairobi Print Fair", venue: "Circle Art Gallery · Nairobi", city: "nairobi", type: "fair", badge: "verified", price: 4_000, cta: "Tickets" },
  { id: "8", day: "06", month: "Aug", title: "Bronze & Bead: Artist Talk", venue: "Terra Kulture · Lagos", city: "lagos", type: "talk", badge: "verified", price: null, cta: "RSVP" },
  { id: "9", day: "14", month: "Aug", title: "Watercolor Weekend", venue: "Nike Art Gallery · Lagos", city: "lagos", type: "workshop", badge: "official", price: 12_000, cta: "Book" },
];

const featured = {
  badgeLabel: "Featured · Official",
  dateLabel: "Jun 24 – Jul 2 · Lagos",
  title: "Lagos Contemporary Art Fair 2026",
  description:
    "120 galleries, 400 artists, and the continent's biggest collectors — under one roof at the Federal Palace.",
};

const chips: { key: Chip; label: string }[] = [
  { key: "this-week", label: "This week" },
  { key: "exhibitions", label: "Exhibitions" },
  { key: "workshops", label: "Workshops" },
  { key: "free", label: "Free entry" },
  { key: "virtual", label: "Virtual" },
];

const typeLabels: Record<EventType, string> = {
  exhibition: "Exhibitions",
  fair: "Fairs & markets",
  workshop: "Workshops",
  talk: "Talks",
  virtual: "Virtual",
};

const cityLabels: Record<CityKey, string> = {
  lagos: "Lagos",
  accra: "Accra",
  nairobi: "Nairobi",
  online: "Online",
};

const badgeTone: Record<EventBadge, string> = {
  official: "border-gold/40 text-gold",
  verified: "border-border-subtle text-foreground-muted",
  virtual: "border-blue-400/40 text-blue-400",
};

const badgeText: Record<EventBadge, string> = {
  official: "Official",
  verified: "Verified",
  virtual: "Virtual",
};

function formatPrice(price: number | null): string {
  return price === null ? "Free" : `₦${price.toLocaleString("en-NG")}`;
}

export function EventsView() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState<Chip>("all");
  const [activeType, setActiveType] = useState<EventType | "all">("all");
  const [activeCity, setActiveCity] = useState<CityKey | "all">("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    let list = events;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }
    if (activeChip === "this-week") list = list.filter((e) => e.isThisWeek);
    else if (activeChip === "exhibitions") list = list.filter((e) => e.type === "exhibition");
    else if (activeChip === "workshops") list = list.filter((e) => e.type === "workshop");
    else if (activeChip === "free") list = list.filter((e) => e.price === null);
    else if (activeChip === "virtual") list = list.filter((e) => e.type === "virtual");

    if (activeType !== "all") list = list.filter((e) => e.type === activeType);
    if (activeCity !== "all") list = list.filter((e) => e.city === activeCity);

    return list;
  }, [search, activeChip, activeType, activeCity]);

  const visible = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  function handleChipClick(key: Chip) {
    setActiveChip((c) => (c === key ? "all" : key));
    setVisibleCount(6);
  }

  function handleTypeClick(key: EventType) {
    setActiveType((t) => (t === key ? "all" : key));
    setVisibleCount(6);
  }

  function handleCityClick(key: CityKey) {
    setActiveCity((c) => (c === key ? "all" : key));
    setVisibleCount(6);
  }

  const typeCounts: Record<EventType, number> = {
    exhibition: events.filter((e) => e.type === "exhibition").length,
    fair: events.filter((e) => e.type === "fair").length,
    workshop: events.filter((e) => e.type === "workshop").length,
    talk: events.filter((e) => e.type === "talk").length,
    virtual: events.filter((e) => e.type === "virtual").length,
  };

  return (
    <div className="grid gap-7 lg:grid-cols-[220px_1fr]">
      {/* Filters sidebar */}
      <aside className="flex flex-col gap-6 lg:sticky lg:top-7 lg:self-start">
        <div>
          <p className="mb-2.5 px-1 text-xs font-bold uppercase tracking-wide text-foreground-subtle">Type</p>
          <div className="flex flex-col gap-0.5">
            {(Object.keys(typeLabels) as EventType[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleTypeClick(key)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition-colors",
                  activeType === key ? "bg-surface-raised text-foreground" : "text-foreground-muted hover:text-foreground"
                )}
              >
                {typeLabels[key]}
                <span className="text-xs font-medium text-foreground-subtle">{typeCounts[key]}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2.5 px-1 text-xs font-bold uppercase tracking-wide text-foreground-subtle">City</p>
          <div className="flex flex-col gap-0.5">
            {(Object.keys(cityLabels) as CityKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleCityClick(key)}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition-colors",
                  activeCity === key ? "bg-surface-raised text-foreground" : "text-foreground-muted hover:text-foreground"
                )}
              >
                {cityLabels[key]}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">Events</h1>
            <p className="mt-1.5 text-sm text-foreground-muted">
              Fairs, workshops, talks and exhibitions from artists you follow.
            </p>
          </div>
          <button
            type="button"
            className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-hover"
          >
            <span className="text-base leading-none">+</span>
            <span className="hidden sm:inline">Submit event</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, galleries, cities…"
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-4 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent"
          />
        </div>

        {/* Featured event */}
        <div className="relative mb-6 flex min-h-[220px] items-end overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised p-7">
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          <div className="relative max-w-lg">
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
                {featured.badgeLabel}
              </span>
              <span className="text-xs font-semibold text-foreground-muted">{featured.dateLabel}</span>
            </div>
            <h2 className="font-heading text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-foreground-muted">{featured.description}</p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-hover"
              >
                Get tickets
              </button>
              <button
                type="button"
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-surface-overlay"
              >
                More info
              </button>
            </div>
          </div>
        </div>

        {/* Chips + view toggle */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
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
          <div className="hidden flex-shrink-0 overflow-hidden rounded-lg border border-border-subtle sm:flex">
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-colors",
                view === "list" ? "bg-surface-raised text-foreground" : "bg-surface text-foreground-muted hover:text-foreground"
              )}
            >
              <List size={13} />
              List
            </button>
            <button
              type="button"
              onClick={() => setView("calendar")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-colors",
                view === "calendar" ? "bg-surface-raised text-foreground" : "bg-surface text-foreground-muted hover:text-foreground"
              )}
            >
              <CalendarDays size={13} />
              Calendar
            </button>
          </div>
        </div>

        {view === "calendar" ? (
          <p className="py-16 text-center text-sm text-foreground-subtle">Calendar view coming soon.</p>
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-foreground-subtle">No events match these filters.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((e) => (
              <div key={e.id} className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
                <div className="relative aspect-[16/10] bg-gradient-to-br from-surface-overlay to-surface-raised">
                  <span className="absolute left-3 top-3 flex flex-col items-center rounded-xl border border-border-subtle bg-background px-3 py-1.5">
                    <span className="font-heading text-lg font-extrabold leading-none text-foreground">{e.day}</span>
                    <span className="text-[10px] font-semibold uppercase text-foreground-subtle">{e.month}</span>
                  </span>
                  <span
                    className={cn(
                      "absolute right-3 top-3 rounded-full border bg-background/85 px-2.5 py-1 text-[10px] font-bold",
                      badgeTone[e.badge]
                    )}
                  >
                    {badgeText[e.badge]}
                  </span>
                </div>
                <div className="p-4">
                  <p className="truncate font-heading text-base font-bold text-foreground">{e.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-foreground-subtle">
                    <MapPin size={12} />
                    {e.venue}
                  </p>
                  <div className="mt-3.5 flex items-center justify-between gap-2">
                    <span className={cn("text-sm font-bold", e.price === null ? "text-emerald-400" : "text-foreground")}>
                      {formatPrice(e.price)}
                    </span>
                    <button
                      type="button"
                      className="rounded-lg border border-border-subtle px-3.5 py-2 text-xs font-bold text-foreground transition-colors hover:bg-surface-overlay"
                    >
                      {e.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "list" && canLoadMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 6)}
              className="rounded-xl border border-border-subtle px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-raised"
            >
              See more events
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
