"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Facebook, Flag, Heart, MessageCircle, MoreVertical, Share2 } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArtworkThumbnail } from "@/components/artwork-lightbox";
import { useInteractionsStore, type WorkComment } from "@/store/interactions.store";
import { WorkCommentsModal } from "./work-comments-modal";

export type WorkStatus = "for-sale" | "sold" | "draft" | "commission";

export interface Work {
  id: string;
  title: string;
  medium: string;
  status: WorkStatus;
  price?: number;
  priceLabel?: string;
  limited?: { sold: number; total: number };
  likes?: number;
  comments?: WorkComment[];
  image?: string;
  imageLarge?: string;
}

const badgeText: Record<WorkStatus, string> = {
  "for-sale": "For sale",
  sold: "Sold",
  draft: "Draft",
  commission: "Commission",
};

function formatNGN(n: number) {
  return n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` : `₦${Math.round(n / 1000)}k`;
}

export function WorkCard({ work }: { work: Work }) {
  const isDraft = work.status === "draft";
  const isSold = work.status === "sold";
  const badge = work.limited ? `Limited · ${work.limited.sold}/${work.limited.total}` : badgeText[work.status];

  const liked = useInteractionsStore((s) => s.likedWorkIds[work.id] ?? false);
  const toggleLike = useInteractionsStore((s) => s.toggleLike);
  const storedCommentCount = useInteractionsStore((s) => s.commentsByWork[work.id]?.length ?? 0);
  const reported = useInteractionsStore((s) => s.reportedWorkIds[work.id] ?? false);
  const reportWork = useInteractionsStore((s) => s.reportWork);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const likeCount = (work.likes ?? 0) + (liked ? 1 : 0);
  const commentCount = (work.comments?.length ?? 0) + storedCommentCount;

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/dashboard/portfolio` : "/dashboard/portfolio";
  const shareText = `${work.title} on ArtSpace`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — silently ignore, link sharing still works via the other options
    }
  }

  function openShareWindow(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
    setShareOpen(false);
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div
        className={`relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-surface-overlay to-surface-raised ${
          isDraft ? "border border-dashed border-border" : "border border-border"
        }`}
      >
        {work.image && (
          <ArtworkThumbnail
            artwork={{ id: work.id, image: work.image, imageLarge: work.imageLarge ?? work.image, title: work.title }}
            sizes="(min-width: 1024px) 22vw, 45vw"
          />
        )}
        {isSold && <div className="pointer-events-none absolute inset-0 bg-background/50" />}

        <span
          className={`pointer-events-none absolute left-2.5 top-2.5 rounded-full border border-border-subtle bg-background/85 px-2.5 py-1 text-[10px] font-bold ${
            work.limited
              ? "text-gold"
              : work.status === "commission"
              ? "text-accent"
              : isDraft
              ? "text-gold"
              : isSold
              ? "text-foreground-subtle"
              : "text-foreground-muted"
          }`}
        >
          {badge}
        </span>

        {!isDraft && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More options"
                className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg border border-border-subtle bg-background/85 text-foreground-muted transition-colors hover:text-foreground"
              >
                <MoreVertical size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled={reported} destructive onClick={() => reportWork(work.id)}>
                <Flag size={14} />
                {reported ? "Reported — thanks" : "Report artwork"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {!isDraft && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => toggleLike(work.id)}
            aria-pressed={liked}
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold transition-colors",
              liked ? "text-accent" : "text-foreground-muted hover:text-foreground"
            )}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            {formatNumber(likeCount)}
          </button>

          <button
            type="button"
            onClick={() => setCommentsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-foreground-muted transition-colors hover:text-foreground"
          >
            <MessageCircle size={16} />
            {formatNumber(commentCount)}
          </button>

          <DropdownMenu open={shareOpen} onOpenChange={setShareOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Share"
                className="flex items-center gap-1.5 text-xs font-semibold text-foreground-muted transition-colors hover:text-foreground"
              >
                <Share2 size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleCopyLink}>
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy link"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  openShareWindow(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
                  )
                }
              >
                <span className="flex h-3.5 w-3.5 items-center justify-center text-[11px] font-black">𝕏</span>
                Share to X
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  openShareWindow(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`)
                }
              >
                <span className="flex h-3.5 w-3.5 items-center justify-center text-[11px] font-black">W</span>
                Share to WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)
                }
              >
                <Facebook size={14} />
                Share to Facebook
              </DropdownMenuItem>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.share?.({ title: shareText, url: shareUrl }).catch(() => {});
                      setShareOpen(false);
                    }}
                  >
                    <Share2 size={14} />
                    More options…
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold text-foreground">{work.title}</p>
          <p className="truncate text-xs text-foreground-muted">{work.medium}</p>
        </div>

        {isDraft ? (
          <Link
            href="/dashboard/portfolio/new"
            className="flex-shrink-0 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-bold text-foreground transition-colors hover:bg-surface-raised"
          >
            Finish
          </Link>
        ) : (
          work.price !== undefined && (
            <p
              className={`flex-shrink-0 font-heading text-sm font-bold ${
                isSold ? "text-foreground-subtle" : "text-accent"
              }`}
            >
              {work.priceLabel ? `${work.priceLabel} ` : ""}
              {formatNGN(work.price)}
            </p>
          )
        )}
      </div>

      {!isDraft && (
        <WorkCommentsModal
          workId={work.id}
          workTitle={work.title}
          seedComments={work.comments}
          open={commentsOpen}
          onOpenChange={setCommentsOpen}
        />
      )}
    </div>
  );
}
