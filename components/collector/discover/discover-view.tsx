"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  BellRing,
  Bookmark,
  Heart,
  MessageCircle,
  Play,
  Search,
  Share2,
} from "lucide-react";
import { ArtworkThumbnail } from "@/components/artwork-lightbox";
import { WorkCommentsModal } from "@/components/dashboard/portfolio/work-comments-modal";
import { cn, formatNumber } from "@/lib/utils";
import { artworks } from "@/lib/artworks";
import { useInteractionsStore } from "@/store/interactions.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { useHasMounted } from "@/hooks/use-has-mounted";

type Tab = "for-you" | "following";

interface Work {
  id: string;
  title: string;
  artist: string;
  price: number;
  image?: string;
  imageLarge?: string;
  detail: string;
}

const works: Record<string, Work> = {
  "harmattan-dusk": {
    id: "harmattan-dusk",
    title: "Harmattan Dusk",
    artist: "Tunde Adeyemi",
    price: 620_000,
    image: artworks[3]?.image,
    imageLarge: artworks[3]?.imageLarge,
    detail: "Oil on canvas · 90×120cm",
  },
  "reclaimed-throne": {
    id: "reclaimed-throne",
    title: "Reclaimed Throne",
    artist: "Ngozi Eze",
    price: 1_200_000,
    image: artworks[7]?.image,
    imageLarge: artworks[7]?.imageLarge,
    detail: "Mixed media · 100×140cm",
  },
  "night-masquerade": {
    id: "night-masquerade",
    title: "Night Masquerade",
    artist: "Bola Taiwo",
    price: 880_000,
    image: artworks[4]?.image,
    imageLarge: artworks[4]?.imageLarge,
    detail: "Bronze & raffia · edition of 10",
  },
  "clay-and-fire": {
    id: "clay-and-fire",
    title: "Clay & Fire",
    artist: "Adaeze N.",
    price: 210_000,
    image: artworks[8]?.image,
    imageLarge: artworks[8]?.imageLarge,
    detail: "Glazed stoneware",
  },
  "ancestral-gold": {
    id: "ancestral-gold",
    title: "Ancestral Gold",
    artist: "Amara O.",
    price: 486_000,
    image: artworks[2]?.image,
    imageLarge: artworks[2]?.imageLarge,
    detail: "Oil & gold leaf",
  },
  "river-memory": {
    id: "river-memory",
    title: "River Memory",
    artist: "Chuka I.",
    price: 175_000,
    image: artworks[10]?.image,
    imageLarge: artworks[10]?.imageLarge,
    detail: "Archival pigment print",
  },
};

const picks = [works["clay-and-fire"], works["ancestral-gold"], works["river-memory"]];

const stories = [
  { initials: "TA", name: "Tunde", live: true, following: true },
  { initials: "NE", name: "Ngozi", following: true },
  { initials: "BT", name: "Bola", following: true },
  { initials: "AO", name: "Amara", following: true },
  { initials: "KB", name: "Kwame" },
  { initials: "AN", name: "Adaeze" },
  { initials: "CI", name: "Chuka" },
];

const suggestedArtists = [
  { id: "ao", name: "Amara Okonkwo", initials: "AO", role: "Oil & mixed media · Lagos" },
  { id: "ci", name: "Chuka Ibe", initials: "CI", role: "Photographer · Enugu" },
  { id: "fo", name: "Femi Ojo", initials: "FO", role: "Painter · Accra" },
];

const styles = ["Abstract", "Portraiture", "Sculpture", "Textile", "Under ₦200k"];

function formatNGN(n: number) {
  return n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` : `₦${Math.round(n / 1000)}k`;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** Counts down to a target fixed at mount; renders placeholders until then to avoid a hydration mismatch. */
function useCountdown(offsetMs: number) {
  const [target, setTarget] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const start = Date.now();
    setTarget(start + offsetMs);
    setNow(start);
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [offsetMs]);

  if (target === null) return { days: "--", hours: "--", mins: "--" };
  const remaining = Math.max(0, target - now);
  return {
    days: pad(Math.floor(remaining / 86_400_000)),
    hours: pad(Math.floor((remaining % 86_400_000) / 3_600_000)),
    mins: pad(Math.floor((remaining % 3_600_000) / 60_000)),
  };
}

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "flex flex-shrink-0 items-center justify-center rounded-full bg-surface-overlay font-heading font-bold text-gold",
        size === "md" ? "h-10 w-10 text-sm" : "h-9 w-9 text-xs"
      )}
    >
      {initials}
    </span>
  );
}

function PostHeader({
  initials,
  name,
  meta,
  verified,
  children,
}: {
  initials: string;
  name: string;
  meta: string;
  verified?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-3.5 flex items-center gap-3">
      <Avatar initials={initials} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-bold text-foreground">{name}</p>
          {verified && <BadgeCheck size={14} className="flex-shrink-0 text-gold" />}
        </div>
        <p className="truncate text-xs font-medium text-foreground-subtle">{meta}</p>
      </div>
      {children}
    </div>
  );
}

function SaveButton({ workId, className }: { workId: string; className?: string }) {
  const hasMounted = useHasMounted();
  const saved = useInteractionsStore((s) => s.savedWorkIds[workId] ?? false) && hasMounted;
  const toggleSave = useInteractionsStore((s) => s.toggleSave);

  return (
    <button
      type="button"
      onClick={() => toggleSave(workId)}
      aria-pressed={saved}
      aria-label={saved ? "Remove from watchlist" : "Save to watchlist"}
      className={cn("flex items-center gap-2 transition-colors", saved ? "text-gold" : "hover:text-foreground", className)}
    >
      <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}

function EngagementRow({ postId, likes, comments, workId }: { postId: string; likes: number; comments: number; workId?: string }) {
  const hasMounted = useHasMounted();
  const liked = useInteractionsStore((s) => s.likedWorkIds[postId] ?? false) && hasMounted;
  const toggleLike = useInteractionsStore((s) => s.toggleLike);
  const storedCommentCount = useInteractionsStore((s) => s.commentsByWork[postId]?.length ?? 0);
  const [commentsOpen, setCommentsOpen] = useState(false);

  return (
    <div className="mt-4 flex items-center gap-6 text-xs font-semibold text-foreground-muted">
      <button
        type="button"
        onClick={() => toggleLike(postId)}
        aria-pressed={liked}
        className={cn("flex items-center gap-2 transition-colors", liked ? "text-accent" : "hover:text-foreground")}
      >
        <Heart size={17} fill={liked ? "currentColor" : "none"} />
        {formatNumber(likes + (liked ? 1 : 0))}
      </button>
      <button
        type="button"
        onClick={() => setCommentsOpen(true)}
        className="flex items-center gap-2 transition-colors hover:text-foreground"
      >
        <MessageCircle size={17} />
        {formatNumber(comments + (hasMounted ? storedCommentCount : 0))}
      </button>
      <button type="button" className="flex items-center gap-2 transition-colors hover:text-foreground">
        <Share2 size={17} />
        Share
      </button>
      {workId && <SaveButton workId={workId} className="ml-auto" />}

      <WorkCommentsModal
        workId={postId}
        workTitle="Comments"
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
      />
    </div>
  );
}

function DropPost() {
  const work = works["night-masquerade"];
  const { days, hours, mins } = useCountdown((2 * 24 + 14) * 3_600_000 + 36 * 60_000);
  const [notify, setNotify] = useState(false);

  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <PostHeader initials="BT" name="Bola Taiwo" meta="Upcoming drop · Sculptor, Ibadan" verified>
        <span className="flex-shrink-0 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
          Drop
        </span>
      </PostHeader>

      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised sm:aspect-[16/10]">
        {work.image && (
          <Image src={work.image} alt={`${work.title} series preview`} fill sizes="(min-width: 1024px) 640px, 90vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gold">Limited edition · 10 pieces</p>
            <p className="mt-1 font-heading text-xl font-extrabold text-foreground sm:text-2xl">Night Masquerade series</p>
            <p className="mt-1 text-sm font-medium text-foreground-muted">Bronze &amp; raffia · from {formatNGN(work.price)}</p>
          </div>
          <div className="flex flex-shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
            <div className="flex gap-1.5" aria-label={`Drops in ${days} days ${hours} hours ${mins} minutes`}>
              {[
                [days, "Days"],
                [hours, "Hrs"],
                [mins, "Min"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-border bg-background px-2.5 py-2 text-center">
                  <p className="font-heading text-lg font-extrabold leading-none text-foreground">{value}</p>
                  <p className="mt-1 text-[9px] font-semibold uppercase text-foreground-subtle">{label}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setNotify((n) => !n)}
              aria-pressed={notify}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-colors",
                notify
                  ? "border border-gold/40 bg-gold/10 text-gold"
                  : "bg-accent text-white hover:bg-accent-hover"
              )}
            >
              {notify ? <BellRing size={14} /> : <Bell size={14} />}
              {notify ? "You'll be notified" : "Notify me"}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-foreground-subtle">
        {notify ? 419 : 418} collectors are waiting for this drop
      </p>
    </article>
  );
}

function SalePost() {
  const work = works["harmattan-dusk"];

  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <PostHeader initials="TA" name="Tunde Adeyemi" meta="Available now · 3h" verified />
      <p className="mb-3.5 text-sm leading-relaxed text-foreground-muted">
        &ldquo;Harmattan Dusk&rdquo; is finished. Three weeks of layered ochre and red earth from my courtyard.
      </p>

      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised">
        {work.image && (
          <ArtworkThumbnail
            artwork={{
              id: work.id,
              image: work.image,
              imageLarge: work.imageLarge ?? work.image,
              title: work.title,
              artist: work.artist,
            }}
            sizes="(min-width: 1024px) 640px, 90vw"
          />
        )}
        <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-border-subtle bg-background/85 px-3 py-1 text-[11px] font-bold text-foreground">
          <Play size={10} className="text-accent" fill="currentColor" />
          Proof-of-Craft reel
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-border-subtle bg-background/85 px-3 py-1 text-[11px] font-bold text-gold">
          Limited · 5/20
        </span>
      </div>

      <div className="mt-3.5 flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-heading text-base font-extrabold text-foreground">{work.title}</p>
          <p className="text-xs font-medium text-foreground-subtle">{work.detail} · Escrow-protected</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Link
            href="/collector/marketplace"
            className="rounded-lg border border-border px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-surface-overlay"
          >
            Make offer
          </Link>
          <Link
            href="/collector/marketplace"
            className="rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-accent-hover"
          >
            Buy · {formatNGN(work.price)}
          </Link>
        </div>
      </div>

      <EngagementRow postId="collector-sale-1" likes={248} comments={32} workId={work.id} />
    </article>
  );
}

function PicksSection() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gold">Picked for you</p>
          <h2 className="mt-1 font-heading text-base font-extrabold text-foreground sm:text-lg">
            Because you saved Reclaimed Throne
          </h2>
        </div>
        <Link href="/collector/marketplace" className="flex-shrink-0 text-xs font-bold text-foreground-muted transition-colors hover:text-foreground">
          See all →
        </Link>
      </div>
      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
        {picks.map((p) => (
          <PickCard key={p.id} work={p} />
        ))}
      </div>
    </section>
  );
}

function PickCard({ work }: { work: Work }) {
  const hasMounted = useHasMounted();
  const saved = useInteractionsStore((s) => s.savedWorkIds[work.id] ?? false) && hasMounted;
  const toggleSave = useInteractionsStore((s) => s.toggleSave);

  return (
    <div className="w-36 flex-shrink-0 sm:w-auto">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised">
        {work.image && (
          <ArtworkThumbnail
            artwork={{
              id: work.id,
              image: work.image,
              imageLarge: work.imageLarge ?? work.image,
              title: work.title,
              artist: work.artist,
            }}
            sizes="(min-width: 640px) 220px, 144px"
          />
        )}
        <button
          type="button"
          onClick={() => toggleSave(work.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${work.title} from watchlist` : `Save ${work.title} to watchlist`}
          className={cn(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle bg-background/85 transition-colors",
            saved ? "text-gold" : "text-foreground-muted hover:text-foreground"
          )}
        >
          <Bookmark size={13} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <p className="truncate font-heading text-sm font-bold text-foreground">{work.title}</p>
        <p className="flex-shrink-0 font-heading text-xs font-extrabold text-accent">{formatNGN(work.price)}</p>
      </div>
      <p className="truncate text-xs font-medium text-foreground-subtle">{work.artist}</p>
    </div>
  );
}

function ReelPost() {
  const work = works["reclaimed-throne"];

  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <PostHeader initials="NE" name="Ngozi Eze" meta="Process reel · 6h" verified />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div className="relative aspect-[4/5] w-full flex-shrink-0 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised sm:w-56">
          {work.image && <Image src={work.image} alt={`Process reel for ${work.title}`} fill sizes="(min-width: 640px) 224px, 90vw" className="object-cover" />}
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-0.5 text-[10px] font-bold text-foreground">
            <Play size={9} className="text-accent" fill="currentColor" />
            REEL
          </span>
          <span className="absolute bottom-3 right-3 rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
            0:45
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/30 bg-background/60">
              <Play size={18} className="ml-0.5 text-foreground" fill="currentColor" />
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed text-foreground-muted">
            Building &ldquo;Reclaimed Throne&rdquo; from salvaged Lagos doorframes — 45 seconds from raw wood to finished piece.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface-raised p-3">
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
              {work.image && <Image src={work.image} alt="" fill sizes="44px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-bold text-foreground">{work.title}</p>
              <p className="truncate text-xs text-foreground-subtle">{work.detail}</p>
            </div>
            <Link
              href="/collector/marketplace"
              className="flex-shrink-0 rounded-lg bg-accent px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-accent-hover"
            >
              {formatNGN(work.price)}
            </Link>
          </div>
          <EngagementRow postId="collector-reel-1" likes={1_400} comments={96} workId={work.id} />
        </div>
      </div>
    </article>
  );
}

function EventPost() {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <PostHeader initials="AS" name="ArtSpace Events" meta="Near you · Lagos">
        <span className="flex-shrink-0 rounded-full border border-border px-2.5 py-1 text-[10px] font-bold uppercase text-foreground-muted">
          Verified
        </span>
      </PostHeader>
      <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface-raised sm:flex-row">
        <div className="relative h-36 flex-shrink-0 bg-gradient-to-br from-surface-overlay to-surface-raised sm:h-auto sm:w-52">
          {artworks[12]?.image && <Image src={artworks[12].image} alt="" fill sizes="(min-width: 640px) 208px, 90vw" className="object-cover opacity-80" />}
          <span className="absolute left-3 top-3 flex flex-col items-center rounded-lg border border-border bg-background px-3 py-1.5">
            <span className="font-heading text-xl font-extrabold leading-none text-foreground">26</span>
            <span className="text-[10px] font-semibold uppercase text-foreground-subtle">Jun</span>
          </span>
        </div>
        <div className="flex-1 p-4 sm:p-5">
          <p className="font-heading text-lg font-extrabold text-foreground">New Voices: Group Show</p>
          <p className="mt-1 text-sm text-foreground-subtle">Rele Gallery, Lagos · Jun 26–30</p>
          <p className="mt-1.5 text-xs font-semibold text-gold">Tunde Adeyemi and 4 artists you follow are exhibiting</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-foreground">From ₦2,500 · 240 left</span>
            <Link
              href="/collector/events"
              className="flex-shrink-0 rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Get tickets
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function Watchlist() {
  const hasMounted = useHasMounted();
  const savedWorkIds = useInteractionsStore((s) => s.savedWorkIds);
  const saved = hasMounted ? Object.values(works).filter((w) => savedWorkIds[w.id]) : [];

  return (
    <div className="rounded-2xl border border-accent/40 bg-surface-raised p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Your watchlist</h3>
        <span className="text-xs font-semibold text-foreground-subtle">
          {saved.length} {saved.length === 1 ? "work" : "works"}
        </span>
      </div>
      {saved.length === 0 ? (
        <p className="text-xs leading-relaxed text-foreground-subtle">
          Save works you&apos;re interested in and we&apos;ll tell you about price drops and new drops.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {saved.map((w) => (
            <li key={w.id} className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
                {w.image && <Image src={w.image} alt="" fill sizes="40px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{w.title}</p>
                <p className="truncate text-xs text-foreground-subtle">{w.artist}</p>
              </div>
              <span className="flex-shrink-0 font-heading text-xs font-extrabold text-accent">{formatNGN(w.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DiscoverView() {
  const [tab, setTab] = useState<Tab>("for-you");
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});
  const hasMounted = useHasMounted();
  const unreadCount = useNotificationsStore((s) => s.unreadCount());

  const visibleStories = tab === "following" ? stories.filter((s) => s.following) : stories;

  return (
    <div className="flex min-h-full">
      {/* Feed column */}
      <div className="min-w-0 flex-1 xl:border-r xl:border-border">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md lg:px-6">
          <h1 className="font-heading text-lg font-extrabold text-foreground lg:hidden">Discover</h1>
          <div className="hidden max-w-sm flex-1 lg:block">
            <label htmlFor="collector-search" className="sr-only">
              Search artists, works, styles
            </label>
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle" />
              <input
                id="collector-search"
                type="search"
                placeholder="Search artists, works, styles…"
                className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-4 text-sm text-foreground placeholder-foreground-subtle outline-none transition focus:border-accent"
              />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden gap-1.5 sm:flex">
              {(
                [
                  ["for-you", "For you"],
                  ["following", "Following"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                    tab === value
                      ? "bg-accent text-white"
                      : "border border-border-subtle bg-surface text-foreground-muted hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted transition-colors hover:text-foreground lg:hidden"
            >
              <Search size={17} />
            </button>
            <Link
              href="/dashboard/notifications"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              <Bell size={17} />
              {hasMounted && unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-background bg-accent px-1 font-heading text-[10px] font-extrabold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-[720px] px-4 py-5 lg:px-6 lg:py-6">
          {/* Mobile tabs */}
          <div className="mb-4 flex gap-1.5 sm:hidden">
            {(
              [
                ["for-you", "For you"],
                ["following", "Following"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  tab === value
                    ? "bg-accent text-white"
                    : "border border-border-subtle bg-surface text-foreground-muted"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Stories */}
          <div className="-mx-4 mb-5 flex gap-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
            {visibleStories.map((s) => (
              <div key={s.initials} className="flex flex-shrink-0 flex-col items-center gap-2">
                <span
                  className={cn(
                    "relative flex h-16 w-16 items-center justify-center rounded-full p-[2.5px]",
                    s.following ? "bg-gradient-to-br from-accent to-gold" : "bg-border"
                  )}
                >
                  <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-background bg-surface-overlay font-heading text-sm font-bold text-gold">
                    {s.initials}
                  </span>
                  {s.live && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded border-2 border-background bg-[#E0556B] px-1.5 font-heading text-[8px] font-extrabold tracking-wider text-white">
                      LIVE
                    </span>
                  )}
                </span>
                <span className="text-xs font-medium text-foreground-muted">{s.name}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            <DropPost />
            <SalePost />
            {tab === "for-you" && <PicksSection />}
            <ReelPost />
            {tab === "for-you" && <EventPost />}
          </div>
        </div>
      </div>

      {/* Right rail */}
      <aside className="hidden w-[300px] flex-shrink-0 xl:block">
        <div className="sticky top-0 flex flex-col gap-5 p-5">
          <Watchlist />

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="mb-4 text-sm font-bold text-foreground">Artists to follow</h3>
            <div className="flex flex-col gap-4">
              {suggestedArtists.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <Avatar initials={a.initials} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{a.name}</p>
                    <p className="truncate text-xs text-foreground-subtle">{a.role}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFollowedIds((f) => ({ ...f, [a.id]: !f[a.id] }))}
                    className={cn(
                      "flex-shrink-0 text-xs font-bold transition-colors",
                      followedIds[a.id] ? "text-foreground-subtle" : "text-accent hover:text-accent-hover"
                    )}
                  >
                    {followedIds[a.id] ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="mb-3 text-sm font-bold text-foreground">Explore by style</h3>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <Link
                  key={s}
                  href="/collector/marketplace"
                  className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-accent/20"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
