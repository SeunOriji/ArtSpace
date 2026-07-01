"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, CircleCheck, Plus, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadWorkForm() {
  const router = useRouter();
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [forSale, setForSale] = useState(true);
  const [price, setPrice] = useState("620000");
  const [processVideo, setProcessVideo] = useState<File | null>(null);
  const [note, setNote] = useState("");

  // A Proof-of-Craft video is how we verify a sellable work is genuinely the
  // artist's own — only enforced once the work can change hands for money.
  const videoRequired = forSale;
  const canPublish = !videoRequired || processVideo !== null;

  function handleVideoChange(e: ChangeEvent<HTMLInputElement>) {
    setProcessVideo(e.target.files?.[0] ?? null);
  }

  function handleRemoveVideo() {
    setProcessVideo(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  }

  function handlePublish() {
    if (!canPublish) return;
    router.push("/dashboard/portfolio");
  }

  function handleSaveDraft() {
    router.push("/dashboard/portfolio");
  }

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/portfolio"
            aria-label="Back to portfolio"
            className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-foreground-muted transition-colors hover:text-foreground"
          >
            <ChevronLeft size={16} />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-extrabold text-foreground">Add artwork</h1>
            <p className="mt-0.5 text-xs font-medium text-foreground-subtle">Step 3 of 3 · Creative process</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2.5 text-sm font-bold text-foreground-muted transition-colors hover:text-foreground"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={!canPublish}
            title={!canPublish ? "Add a creative process video to publish a work that's for sale" : undefined}
            className={cn(
              "rounded-xl border px-5 py-2.5 text-sm font-bold transition-colors",
              canPublish
                ? "border-accent bg-accent text-white hover:bg-accent-hover"
                : "cursor-not-allowed border-border-subtle bg-transparent text-foreground-subtle"
            )}
          >
            {canPublish ? "Publish work" : "Publish"}
          </button>
        </div>
      </header>

      <div className="mt-7 grid gap-7 lg:grid-cols-[340px_1fr]">
        {/* LEFT: work summary */}
        <div className="flex flex-col gap-4">
          <div className="flex aspect-[4/5] items-end rounded-2xl border border-border bg-gradient-to-br from-surface-overlay to-surface-raised p-3.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground-subtle">
              final artwork
            </span>
          </div>
          <div>
            <p className="font-heading text-lg font-extrabold text-foreground">Harmattan Dusk</p>
            <p className="mt-0.5 text-sm font-medium text-foreground-subtle">Oil on canvas · 90×120cm</p>
          </div>

          <div
            className={cn(
              "rounded-2xl border bg-surface p-4 transition-colors",
              forSale ? "border-accent" : "border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading text-sm font-bold text-foreground">List for sale</p>
                <p className="mt-0.5 text-xs font-medium text-foreground-subtle">
                  {forSale ? "Buyers will see price & buy options" : "Showcase only — not purchasable"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={forSale}
                aria-label="List for sale"
                onClick={() => setForSale((v) => !v)}
                className={cn(
                  "relative h-[26px] w-[46px] flex-shrink-0 rounded-full transition-colors",
                  forSale ? "bg-accent" : "bg-surface-overlay"
                )}
              >
                <span
                  className={cn(
                    "absolute top-[3px] h-5 w-5 rounded-full bg-foreground transition-all",
                    forSale ? "left-[23px]" : "left-[3px]"
                  )}
                />
              </button>
            </div>

            {forSale && (
              <div className="mt-3.5 flex items-center justify-between border-t border-border-subtle pt-3.5">
                <label htmlFor="work-price" className="text-sm font-medium text-foreground-muted">
                  Price
                </label>
                <div className="flex items-center gap-1">
                  <span className="font-heading text-sm font-bold text-accent">₦</span>
                  <input
                    id="work-price"
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-28 bg-transparent text-right font-heading text-sm font-bold text-accent outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: creative process */}
        <div className="flex flex-col gap-[18px]">
          <div
            className={cn(
              "flex items-start gap-3.5 rounded-2xl border p-5",
              videoRequired ? "border-accent bg-surface-raised" : "border-border bg-surface"
            )}
          >
            <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[10px] bg-surface-overlay">
              <CircleCheck size={20} className={videoRequired ? "text-accent" : "text-gold"} />
            </span>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h2 className="font-heading text-base font-bold text-foreground">Creative process</h2>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    videoRequired
                      ? "border-gold bg-gold text-background"
                      : "border-border-subtle bg-surface-overlay text-foreground-muted"
                  )}
                >
                  {videoRequired ? "Required" : "Optional"}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground-muted">
                {videoRequired
                  ? "Because this work is listed for sale, a Proof-of-Craft video is required. It guarantees authenticity and gives buyers confidence the work is genuinely yours."
                  : "This work isn't for sale, so sharing your process is optional — but it helps collectors connect with how the piece was made."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <div>
                <p className="font-heading text-sm font-bold text-foreground">Proof-of-Craft video</p>
                <p className="mt-0.5 text-xs font-medium text-foreground-subtle">
                  A short clip of you creating this work — face &amp; hands visible.
                </p>
              </div>
              <span
                className={cn(
                  "flex-shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  videoRequired
                    ? "border-gold bg-gold text-background"
                    : "border-border-subtle bg-surface-overlay text-foreground-muted"
                )}
              >
                {videoRequired ? "Required" : "Optional"}
              </span>
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleVideoChange}
              className="hidden"
            />

            {processVideo ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-background px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Video size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{processVideo.name}</p>
                    <p className="text-xs text-foreground-subtle">{(processVideo.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  aria-label="Remove video"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className={cn(
                  "flex aspect-[16/7] w-full flex-col items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-dashed transition-colors",
                  videoRequired
                    ? "border-accent/70 bg-background hover:border-accent"
                    : "border-border-subtle bg-background hover:border-foreground-subtle"
                )}
              >
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent">
                  <Video size={20} className="text-background" />
                </span>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">Record or upload a video</p>
                  <p className="mt-0.5 text-xs font-medium text-foreground-subtle">
                    MP4 or MOV · up to 90 seconds · max 200MB
                  </p>
                </div>
              </button>
            )}

            <p className="mt-3 text-xs leading-relaxed text-foreground-subtle">
              This clip becomes a public reel on the work&apos;s page — collectors can watch how it was made.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-heading text-sm font-bold text-foreground">Process timeline</p>
                <p className="mt-0.5 text-xs font-medium text-foreground-subtle">
                  Add progress shots from sketch to finish.
                </p>
              </div>
              <span className="flex-shrink-0 rounded-full border border-border-subtle bg-surface-overlay px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground-muted">
                Optional
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {["Sketch", "Underpaint", "Layering"].map((stage) => (
                <div
                  key={stage}
                  className="relative aspect-square rounded-[10px] border border-border bg-gradient-to-br from-surface-overlay to-surface-raised"
                >
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-background px-1.5 py-0.5 text-[9px] font-bold text-gold">
                    {stage}
                  </span>
                </div>
              ))}
              <button
                type="button"
                className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed border-border-subtle text-foreground-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                <Plus size={20} />
                <span className="text-[10px] font-bold">Add shot</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="font-heading text-sm font-bold text-foreground">
              The story behind it <span className="text-xs font-semibold text-foreground-subtle">· optional</span>
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Painted over three weeks during the dry-season winds…"
              className="mt-2.5 w-full resize-none rounded-xl border border-border-subtle bg-background px-4 py-3.5 text-sm leading-relaxed text-foreground outline-none transition focus:border-accent placeholder:text-foreground-subtle"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
