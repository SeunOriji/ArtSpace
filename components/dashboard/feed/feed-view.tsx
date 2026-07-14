"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArtworkThumbnail } from "@/components/artwork-lightbox";
import {
  BadgeCheck,
  Camera,
  Clapperboard,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  Share2,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { artworks } from "@/lib/artworks";
import { useInteractionsStore, type WorkComment } from "@/store/interactions.store";
import { WorkCommentsModal } from "@/components/dashboard/portfolio/work-comments-modal";

type Tab = "following" | "discover";
type PostKind = "process" | "sale" | "reel" | "text";

interface FeedPost {
  id: string;
  kind: PostKind;
  author: string;
  authorInitials: string;
  verified?: boolean;
  timeLabel: string;
  caption: string;
  likes: number;
  comments?: WorkComment[];
  suggested?: boolean;
  // process / sale / reel
  image?: string;
  imageLarge?: string;
  // sale / process
  workTitle?: string;
  price?: number;
  // process
  slideCount?: number;
  // reel
  duration?: string;
}

const stories = [
  { initials: "NE", name: "Ngozi" },
  { initials: "KB", name: "Kwame" },
  { initials: "AN", name: "Adaeze" },
  { initials: "BT", name: "Bola" },
  { initials: "CI", name: "Chuka" },
  { initials: "FO", name: "Femi" },
];

const suggestedArtists = [
  { id: "bt", name: "Bola Taiwo", initials: "BT", role: "Sculptor · Ibadan" },
  { id: "ci", name: "Chuka Ibe", initials: "CI", role: "Photographer · Enugu" },
  { id: "fo", name: "Femi Ojo", initials: "FO", role: "Painter · Accra" },
];

const trendingTags = ["#lagosart", "#processreel", "#mixedmedia", "#afrofuturism", "#ceramics"];

const posts: FeedPost[] = [
  {
    id: "feed-1",
    kind: "process",
    author: "Tunde Adeyemi",
    authorInitials: "TA",
    verified: true,
    timeLabel: "2h ago",
    caption:
      'Three weeks of layering on "Harmattan Dusk" — swipe to see it go from charcoal sketch to finished piece.',
    likes: 248,
    comments: [],
    slideCount: 4,
    workTitle: "Harmattan Dusk",
    image: artworks[3]?.image,
    imageLarge: artworks[3]?.imageLarge,
  },
  {
    id: "feed-2",
    kind: "sale",
    author: "Ngozi Eze",
    authorInitials: "NE",
    verified: true,
    timeLabel: "5h ago",
    caption: '"Reclaimed Throne" is finally available. Mixed media on reclaimed wood, 100×140cm.',
    likes: 512,
    comments: [],
    workTitle: "Reclaimed Throne",
    price: 1_200_000,
    image: artworks[7]?.image,
    imageLarge: artworks[7]?.imageLarge,
  },
  {
    id: "feed-3",
    kind: "reel",
    author: "Kwame Boateng",
    authorInitials: "KB",
    timeLabel: "8h ago",
    caption: "Studio time-lapse — a full day in 30 seconds. Sound on.",
    likes: 1_200,
    comments: [],
    duration: "0:30",
    image: artworks[11]?.image,
  },
  {
    id: "feed-4",
    kind: "text",
    author: "Adaeze Nwosu",
    authorInitials: "AN",
    timeLabel: "12h ago",
    caption:
      "Looking for two ceramicists in Lagos to share a kiln this month — split the firing cost. Drop a comment if you're in.",
    likes: 34,
    comments: [],
  },
  {
    id: "feed-5",
    kind: "sale",
    author: "Bola Taiwo",
    authorInitials: "BT",
    timeLabel: "1d ago",
    caption: 'First sculpture out of the new bronze series — "Drumline" stands 60cm tall.',
    likes: 96,
    comments: [],
    workTitle: "Drumline",
    price: 340_000,
    suggested: true,
    image: artworks[15]?.image,
    imageLarge: artworks[15]?.imageLarge,
  },
];

function formatNGN(n: number) {
  return n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` : `₦${Math.round(n / 1000)}k`;
}

function kindLabel(post: FeedPost) {
  if (post.suggested) return "Suggested for you";
  if (post.kind === "process") return "Creative process";
  if (post.kind === "sale") return "New work for sale";
  if (post.kind === "reel") return "Reel";
  return null;
}

function PostCard({ post }: { post: FeedPost }) {
  const liked = useInteractionsStore((s) => s.likedWorkIds[post.id] ?? false);
  const toggleLike = useInteractionsStore((s) => s.toggleLike);
  const storedCommentCount = useInteractionsStore((s) => s.commentsByWork[post.id]?.length ?? 0);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const likeCount = post.likes + (liked ? 1 : 0);
  const commentCount = (post.comments?.length ?? 0) + storedCommentCount;
  const meta = [kindLabel(post), post.timeLabel].filter(Boolean).join(" · ");

  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-overlay font-heading text-sm font-bold text-gold">
          {post.authorInitials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-foreground">{post.author}</p>
            {post.verified && <BadgeCheck size={14} className="flex-shrink-0 text-gold" />}
          </div>
          <p className="text-xs font-medium text-foreground-subtle">{meta}</p>
        </div>
        <button
          type="button"
          aria-label="More options"
          className="flex-shrink-0 text-foreground-subtle transition-colors hover:text-foreground"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <p className="mt-3.5 text-sm leading-relaxed text-foreground-muted">{post.caption}</p>

      {post.kind === "process" && (
        <div className="relative mt-3.5 aspect-[16/11] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised">
          {post.image && (
            <ArtworkThumbnail
              artwork={{
                id: post.id,
                image: post.image,
                imageLarge: post.imageLarge ?? post.image,
                title: post.workTitle ?? post.author,
                artist: post.author,
              }}
              sizes="(min-width: 1024px) 640px, 90vw"
            />
          )}
          <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-border-subtle bg-background/85 px-3 py-1 text-[11px] font-bold text-gold">
            Process · 1/{post.slideCount}
          </span>
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {Array.from({ length: post.slideCount ?? 0 }).map((_, i) => (
              <span
                key={i}
                className={cn("h-1.5 w-1.5 rounded-full", i === 0 ? "bg-foreground" : "bg-foreground/30")}
              />
            ))}
          </div>
        </div>
      )}

      {post.kind === "sale" && (
        <div className="relative mt-3.5 aspect-[4/3] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised">
          {post.image && (
            <ArtworkThumbnail
              artwork={{
                id: post.id,
                image: post.image,
                imageLarge: post.imageLarge ?? post.image,
                title: post.workTitle ?? post.author,
                artist: post.author,
              }}
              sizes="(min-width: 1024px) 640px, 90vw"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-background/95 to-transparent p-4">
            <div className="min-w-0">
              <p className="truncate font-heading text-base font-extrabold text-foreground">{post.workTitle}</p>
              <p className="text-xs font-medium text-foreground-muted">Escrow-protected · Verified</p>
            </div>
            <Link
              href="/dashboard/marketplace"
              className="flex-shrink-0 rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Buy · {formatNGN(post.price ?? 0)}
            </Link>
          </div>
        </div>
      )}

      {post.kind === "reel" && (
        <div className="relative mt-3.5 h-44 w-44 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised">
          {post.image && (
            <Image src={post.image} alt={post.caption} fill sizes="176px" className="object-cover" />
          )}
          <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-bold text-foreground">
            <Play size={9} className="text-accent" fill="currentColor" />
            REEL
          </span>
          <span className="absolute bottom-2 right-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
            {post.duration}
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/30 bg-background/60">
              <Play size={16} className="ml-0.5 text-foreground" fill="currentColor" />
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-6 text-xs font-semibold text-foreground-muted">
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          aria-pressed={liked}
          className={cn("flex items-center gap-2 transition-colors", liked ? "text-accent" : "hover:text-foreground")}
        >
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
          {formatNumber(likeCount)}
        </button>
        <button
          type="button"
          onClick={() => setCommentsOpen(true)}
          className="flex items-center gap-2 transition-colors hover:text-foreground"
        >
          <MessageCircle size={17} />
          {formatNumber(commentCount)}
        </button>
        <button type="button" className="flex items-center gap-2 transition-colors hover:text-foreground">
          <Share2 size={17} />
          Share
        </button>
      </div>

      <WorkCommentsModal
        workId={post.id}
        workTitle={`${post.author}'s post`}
        seedComments={post.comments}
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
      />
    </article>
  );
}

export function FeedView() {
  const [tab, setTab] = useState<Tab>("following");
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});

  function toggleFollow(id: string) {
    setFollowedIds((f) => ({ ...f, [id]: !f[id] }));
  }

  const visiblePosts = tab === "following" ? posts.filter((p) => !p.suggested) : posts;

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="grid gap-7 lg:grid-cols-[1fr_300px]">
        {/* Main column */}
        <div className="min-w-0">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">Your feed</h1>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab("following")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  tab === "following"
                    ? "bg-accent text-white"
                    : "border border-border-subtle bg-surface text-foreground-muted hover:text-foreground"
                )}
              >
                Following
              </button>
              <button
                type="button"
                onClick={() => setTab("discover")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  tab === "discover"
                    ? "bg-accent text-white"
                    : "border border-border-subtle bg-surface text-foreground-muted hover:text-foreground"
                )}
              >
                Discover
              </button>
            </div>
          </div>

          {/* Stories rail */}
          <div className="mb-6 flex justify-center gap-5 overflow-x-auto pb-1">
            <Link href="/dashboard/portfolio/new" className="flex flex-shrink-0 flex-col items-center gap-2.5">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-border-subtle text-foreground-subtle transition-colors hover:text-foreground">
                <Plus size={22} />
              </span>
              <span className="text-xs font-medium text-foreground-muted">Your story</span>
            </Link>
            {stories.map((s) => (
              <div key={s.initials} className="flex flex-shrink-0 flex-col items-center gap-2.5">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-gold p-[3px]">
                  <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-background bg-surface-overlay font-heading text-base font-bold text-gold">
                    {s.initials}
                  </span>
                </span>
                <span className="text-xs font-medium text-foreground-muted">{s.name}</span>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-gold text-xs font-bold text-background">
              AO
            </span>
            <Link
              href="/dashboard/portfolio/new"
              className="flex-1 truncate rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground-subtle transition-colors hover:text-foreground-muted"
            >
              Share a work, a process, or a thought…
            </Link>
            <div className="hidden flex-shrink-0 gap-2 sm:flex">
              <Link
                href="/dashboard/portfolio/new"
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground-muted transition-colors hover:text-foreground"
              >
                <Camera size={14} />
                Photo
              </Link>
              <Link
                href="/dashboard/portfolio/new"
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground-muted transition-colors hover:text-foreground"
              >
                <Clapperboard size={14} />
                Reel
              </Link>
            </div>
          </div>

          {/* Posts */}
          {visiblePosts.length === 0 ? (
            <p className="py-16 text-center text-sm text-foreground-subtle">
              No posts yet — follow artists to see their updates here.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {visiblePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Right rail */}
        <aside className="hidden flex-col gap-5 lg:flex lg:sticky lg:top-7 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="mb-4 text-sm font-bold text-foreground">Suggested artists</h3>
            <div className="flex flex-col gap-4">
              {suggestedArtists.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-overlay font-heading text-xs font-bold text-gold">
                    {a.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{a.name}</p>
                    <p className="truncate text-xs text-foreground-subtle">{a.role}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFollow(a.id)}
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
            <h3 className="mb-4 text-sm font-bold text-foreground">Trending tags</h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((t) => (
                <span key={t} className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-gold">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
