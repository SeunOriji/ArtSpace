"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ImagePlus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type EventType = "exhibition" | "fair" | "workshop" | "talk";
type LocationMode = "in-person" | "virtual";

interface TicketTier {
  id: string;
  name: string;
  price: string;
  available: string;
}

const eventTypes: { key: EventType; label: string }[] = [
  { key: "exhibition", label: "Exhibition" },
  { key: "fair", label: "Fair & market" },
  { key: "workshop", label: "Workshop" },
  { key: "talk", label: "Talk" },
];

let tierSeq = 0;
function nextTierId(): string {
  tierSeq += 1;
  return `tier-${tierSeq}`;
}

export function SubmitEventForm() {
  const router = useRouter();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const [eventType, setEventType] = useState<EventType>("exhibition");
  const [title, setTitle] = useState("New Voices: Group Show");
  const [startDate, setStartDate] = useState("2026-06-26");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [locationMode, setLocationMode] = useState<LocationMode>("in-person");
  const [venue, setVenue] = useState("Rele Gallery");
  const [city, setCity] = useState("Lagos, Nigeria");
  const [streamLink, setStreamLink] = useState("");
  const [description, setDescription] = useState(
    "A group show spotlighting five emerging painters and sculptors working across Lagos. Opening night reception included."
  );
  const [ticketed, setTicketed] = useState(true);
  const [tiers, setTiers] = useState<TicketTier[]>([
    { id: nextTierId(), name: "General admission", price: "5000", available: "200" },
    { id: nextTierId(), name: "VIP + opening reception", price: "15000", available: "50" },
    { id: nextTierId(), name: "Student", price: "2500", available: "100" },
  ]);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [bannerPreview]);

  function handleBannerChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  }

  function addTier() {
    setTiers((t) => [...t, { id: nextTierId(), name: "", price: "", available: "" }]);
  }

  function removeTier(id: string) {
    setTiers((t) => t.filter((tier) => tier.id !== id));
  }

  function updateTier(id: string, field: keyof Omit<TicketTier, "id">, value: string) {
    setTiers((t) => t.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)));
  }

  const totalCapacity = tiers.reduce((sum, t) => sum + (parseInt(t.available, 10) || 0), 0);
  const canSubmit = title.trim().length > 0 && (locationMode === "virtual" ? true : venue.trim().length > 0);

  function handleSubmit() {
    if (!canSubmit) return;
    router.push("/dashboard/events");
  }

  function handleSaveDraft() {
    router.push("/dashboard/events");
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
        <Link
          href="/dashboard/events"
          aria-label="Back to events"
          className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-foreground-muted transition-colors hover:text-foreground"
        >
          <ChevronLeft size={16} />
        </Link>
        <div>
          <h1 className="font-heading text-xl font-extrabold text-foreground sm:text-2xl">Submit an event</h1>
          <p className="mt-0.5 text-xs font-medium text-foreground-subtle sm:text-sm">
            Reviewed within 48 hours. Approved events get a Verified badge; ArtSpace-run events are Official.
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-6 pb-8">
        {/* Banner upload */}
        <div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleBannerChange}
            className="hidden"
          />
          {bannerPreview ? (
            <div className="relative aspect-[16/6] overflow-hidden rounded-2xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bannerPreview} alt="Event banner preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="absolute bottom-3 right-3 rounded-lg border border-border-subtle bg-background/85 px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-background"
              >
                Change banner
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="flex aspect-[16/6] w-full flex-col items-center justify-center gap-2.5 rounded-2xl border-[1.5px] border-dashed border-border-subtle bg-surface transition-colors hover:border-accent/50"
            >
              <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-surface-overlay">
                <ImagePlus size={20} className="text-gold" />
              </span>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">Upload event banner</p>
                <p className="mt-0.5 text-xs font-medium text-foreground-subtle">
                  1600×600px recommended · JPG or PNG
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Event type */}
        <Field label="Event type">
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setEventType(t.key)}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-bold transition-colors",
                  eventType === t.key
                    ? "border-[1.5px] border-accent bg-surface-raised text-foreground"
                    : "border border-border bg-background text-foreground-muted hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Title */}
        <Field label="Event title" htmlFor={titleId}>
          <input
            id={titleId}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. New Voices: Group Show"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent placeholder:text-foreground-subtle placeholder:font-medium"
          />
        </Field>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start date">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent [color-scheme:dark]"
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent [color-scheme:dark]"
            />
          </Field>
        </div>

        {/* Location */}
        <div>
          <FieldLabel className="mb-2.5 block">Location</FieldLabel>
          <div className="mb-3 flex gap-2">
            {(["in-person", "virtual"] as LocationMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setLocationMode(mode)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-bold transition-colors",
                  locationMode === mode
                    ? "border-[1.5px] border-accent bg-surface-raised text-foreground"
                    : "border border-border bg-background text-foreground-muted hover:text-foreground"
                )}
              >
                {mode === "in-person" ? "In person" : "Virtual"}
              </button>
            ))}
          </div>
          {locationMode === "in-person" ? (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Venue name"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent placeholder:text-foreground-subtle placeholder:font-medium"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City, country"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent placeholder:text-foreground-subtle placeholder:font-medium"
              />
            </div>
          ) : (
            <input
              type="text"
              value={streamLink}
              onChange={(e) => setStreamLink(e.target.value)}
              placeholder="Streaming link (Zoom, YouTube, Instagram Live…)"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent placeholder:text-foreground-subtle placeholder:font-medium"
            />
          )}
        </div>

        {/* Description */}
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What should attendees know about this event?"
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3.5 text-sm leading-relaxed text-foreground outline-none transition focus:border-accent placeholder:text-foreground-subtle"
          />
        </Field>

        {/* Ticketing toggle */}
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-2xl border p-5",
            ticketed ? "border-accent bg-surface-raised" : "border-border bg-surface"
          )}
        >
          <div>
            <p className="font-heading text-sm font-bold text-foreground">This is a ticketed event</p>
            <p className="mt-0.5 text-xs font-medium text-foreground-subtle">
              Sell tickets directly through ArtSpace, with a live availability count.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={ticketed}
            aria-label="Ticketed event"
            onClick={() => setTicketed((v) => !v)}
            className={cn(
              "relative h-[26px] w-[46px] flex-shrink-0 rounded-full transition-colors",
              ticketed ? "bg-accent" : "bg-surface-overlay"
            )}
          >
            <span
              className={cn(
                "absolute top-[3px] h-5 w-5 rounded-full bg-white transition-all",
                ticketed ? "left-[23px]" : "left-[3px]"
              )}
            />
          </button>
        </div>

        {/* Ticket tiers */}
        {ticketed && (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-heading text-base font-bold text-foreground">Ticket types</p>
                <p className="mt-0.5 text-xs font-medium text-foreground-subtle">
                  Set a price and how many are available for each tier.
                </p>
              </div>
              <button
                type="button"
                onClick={addTier}
                className="flex flex-shrink-0 items-center gap-1.5 text-xs font-bold text-gold transition-colors hover:text-gold-hover"
              >
                <Plus size={13} />
                Add ticket type
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="grid grid-cols-[1.4fr_1fr_1fr_auto] items-end gap-3 rounded-xl border border-border-subtle bg-background p-3.5"
                >
                  <TierField label="Tier name">
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => updateTier(tier.id, "name", e.target.value)}
                      placeholder="e.g. General"
                      className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm font-semibold text-foreground outline-none transition focus:border-accent placeholder:text-foreground-subtle placeholder:font-medium"
                    />
                  </TierField>
                  <TierField label="Price">
                    <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface px-3 py-2 focus-within:border-accent">
                      <span className="font-heading text-sm font-bold text-accent">₦</span>
                      <input
                        type="number"
                        min={0}
                        value={tier.price}
                        onChange={(e) => updateTier(tier.id, "price", e.target.value)}
                        placeholder="0"
                        className="w-full min-w-0 bg-transparent font-heading text-sm font-bold text-accent outline-none"
                      />
                    </div>
                  </TierField>
                  <TierField label="Available">
                    <input
                      type="number"
                      min={0}
                      value={tier.available}
                      onChange={(e) => updateTier(tier.id, "available", e.target.value)}
                      placeholder="0"
                      className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 font-heading text-sm font-bold text-foreground outline-none transition focus:border-accent"
                    />
                  </TierField>
                  <button
                    type="button"
                    onClick={() => removeTier(tier.id)}
                    aria-label="Remove ticket tier"
                    disabled={tiers.length === 1}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border-subtle text-foreground-subtle transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4">
              <p className="text-xs font-semibold text-foreground-subtle">Total capacity across tiers</p>
              <p className="font-heading text-sm font-extrabold text-foreground">
                {totalCapacity.toLocaleString("en-NG")} tickets
              </p>
            </div>
          </div>
        )}

        {/* Escrow note */}
        {ticketed && (
          <div className="flex gap-3 rounded-2xl border border-border-subtle bg-surface p-4">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-surface-overlay">
              <ShieldCheck size={16} className="text-accent" />
            </span>
            <p className="text-xs leading-relaxed text-foreground-muted">
              Ticket payments are held until your event date and released after — a 6% platform fee applies to
              ticketed events.
            </p>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 -mx-5 flex flex-col-reverse items-center gap-3 border-t border-border bg-surface px-5 py-4 sm:-mx-8 sm:flex-row sm:justify-between sm:px-8">
        <span className="hidden text-xs font-medium text-foreground-subtle sm:inline">
          You&apos;ll be notified once it&apos;s reviewed.
        </span>
        <div className="flex w-full items-center gap-2.5 sm:w-auto">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex-1 rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-overlay sm:flex-none"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            Submit for review
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("text-xs font-bold uppercase tracking-wide text-foreground-muted", className)}>
      {children}
    </span>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <FieldLabel className="mb-2 block">{label}</FieldLabel>
      {children}
    </label>
  );
}

function TierField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <span className="mb-1.5 block text-[11px] font-semibold text-foreground-subtle">{label}</span>
      {children}
    </div>
  );
}
