"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCommissionsStore,
  COMMISSION_TYPES,
  TURNAROUND_OPTIONS,
  DEPOSIT_OPTIONS,
  type CommissionSettings,
  type PricingTier,
} from "@/store/commissions.store";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative h-7 w-[46px] flex-shrink-0 rounded-full border-0 p-0 transition-colors",
        checked ? "bg-accent" : "bg-surface-overlay"
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white transition-[left]",
          checked ? "left-[22px]" : "left-1"
        )}
      />
    </button>
  );
}

export function CommissionSettingsView() {
  const storeSettings = useCommissionsStore((s) => s.settings);
  const updateSettings = useCommissionsStore((s) => s.updateSettings);
  const router = useRouter();

  const [draft, setDraft] = useState<CommissionSettings>(storeSettings);

  function patch(partial: Partial<CommissionSettings>) {
    setDraft((d) => ({ ...d, ...partial }));
  }

  function updateTier(id: string, partial: Partial<PricingTier>) {
    setDraft((d) => ({
      ...d,
      tiers: d.tiers.map((t) => (t.id === id ? { ...t, ...partial } : t)),
    }));
  }

  function addTier() {
    setDraft((d) => ({
      ...d,
      tiers: [...d.tiers, { id: `tier-${Date.now()}`, label: "New tier", sizeLabel: "Describe size", fromPrice: 0 }],
    }));
  }

  function removeTier(id: string) {
    setDraft((d) => ({ ...d, tiers: d.tiers.filter((t) => t.id !== id) }));
  }

  function toggleType(type: string) {
    setDraft((d) => ({
      ...d,
      acceptedTypes: { ...d.acceptedTypes, [type]: !d.acceptedTypes[type] },
    }));
  }

  function handleSave() {
    updateSettings(draft);
    router.push("/dashboard/commissions");
  }

  function handleCancel() {
    router.push("/dashboard/commissions");
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <Link
        href="/dashboard/commissions"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground"
      >
        <ChevronLeft size={15} />
        Commissions
      </Link>

      <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">Commission settings</h1>
      <p className="mt-1.5 text-sm text-foreground-muted">
        Set your terms once — buyers see them before they request.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {/* Availability */}
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-2xl border p-5",
            draft.isOpen ? "border-accent bg-surface-raised" : "border-border-subtle bg-surface"
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "h-2.5 w-2.5 flex-shrink-0 rounded-full",
                draft.isOpen ? "bg-emerald-400" : "bg-foreground-subtle"
              )}
            />
            <div>
              <p className="font-heading text-base font-bold text-foreground">Open to commissions</p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                Your profile shows a &ldquo;Request commission&rdquo; button.
              </p>
            </div>
          </div>
          <Toggle checked={draft.isOpen} onChange={() => patch({ isOpen: !draft.isOpen })} />
        </div>

        {/* Pricing tiers */}
        <div className="rounded-2xl border border-border-subtle bg-surface p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-heading text-base font-bold text-foreground">Pricing tiers</p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                Give buyers a starting point by size &amp; complexity.
              </p>
            </div>
            <button
              type="button"
              onClick={addTier}
              className="flex flex-shrink-0 items-center gap-1.5 text-xs font-bold text-gold transition-colors hover:text-gold-hover"
            >
              <Plus size={13} />
              Add tier
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {draft.tiers.map((tier) => (
              <div key={tier.id} className="relative rounded-xl border border-border-subtle bg-surface-raised p-4">
                <button
                  type="button"
                  onClick={() => removeTier(tier.id)}
                  aria-label="Remove tier"
                  className="absolute right-2.5 top-2.5 text-foreground-subtle transition-colors hover:text-foreground"
                >
                  <X size={13} />
                </button>
                <input
                  value={tier.label}
                  onChange={(e) => updateTier(tier.id, { label: e.target.value })}
                  className="w-full bg-transparent pr-4 font-heading text-sm font-bold text-foreground outline-none"
                />
                <input
                  value={tier.sizeLabel}
                  onChange={(e) => updateTier(tier.id, { sizeLabel: e.target.value })}
                  className="mt-1 w-full bg-transparent text-xs text-foreground-muted outline-none"
                />
                <div className="mt-2.5 flex items-center gap-1">
                  <span className="text-xs font-bold text-accent">From ₦</span>
                  <input
                    type="number"
                    min={0}
                    value={tier.fromPrice}
                    onChange={(e) => updateTier(tier.id, { fromPrice: Number(e.target.value) || 0 })}
                    className="w-full bg-transparent font-heading text-sm font-extrabold text-accent outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deposit + turnaround */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="font-heading text-base font-bold text-foreground">Upfront deposit</p>
            <p className="mt-0.5 text-xs text-foreground-muted">Held in escrow to secure a slot.</p>
            <div className="mt-4 flex gap-2">
              {DEPOSIT_OPTIONS.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => patch({ depositPercent: pct })}
                  className={cn(
                    "flex-1 rounded-lg border py-2.5 text-sm font-bold transition-colors",
                    draft.depositPercent === pct
                      ? "border-accent bg-surface-raised text-foreground"
                      : "border-border-subtle text-foreground-muted hover:text-foreground"
                  )}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="font-heading text-base font-bold text-foreground">Typical turnaround</p>
            <p className="mt-0.5 text-xs text-foreground-muted">Sets buyer expectations.</p>
            <select
              value={draft.turnaroundLabel}
              onChange={(e) => patch({ turnaroundLabel: e.target.value })}
              className="mt-4 w-full rounded-lg border border-border-subtle bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-accent"
            >
              {TURNAROUND_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* What I accept */}
        <div className="rounded-2xl border border-border-subtle bg-surface p-5">
          <p className="font-heading text-base font-bold text-foreground">What I accept</p>
          <p className="mt-0.5 text-xs text-foreground-muted">Tap to toggle the commission types you take.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {COMMISSION_TYPES.map((type) => {
              const active = draft.acceptedTypes[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
                    active
                      ? "border-accent bg-surface-raised text-foreground"
                      : "border-border-subtle text-foreground-muted hover:text-foreground"
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slots + brief */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-5">
            <div>
              <p className="font-heading text-sm font-bold text-foreground">Limit open slots</p>
              <p className="mt-0.5 text-xs text-foreground-muted">Auto-pause when full.</p>
            </div>
            <div className="flex flex-shrink-0 items-center overflow-hidden rounded-lg border border-border-subtle">
              <button
                type="button"
                onClick={() => patch({ maxSlots: Math.max(1, draft.maxSlots - 1) })}
                className="px-3 py-2 font-heading text-sm font-bold text-foreground-muted transition-colors hover:text-foreground"
              >
                −
              </button>
              <span className="px-2 font-heading text-sm font-extrabold text-foreground">{draft.maxSlots}</span>
              <button
                type="button"
                onClick={() => patch({ maxSlots: draft.maxSlots + 1 })}
                className="px-3 py-2 font-heading text-sm font-bold text-gold transition-colors hover:text-gold-hover"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-5">
            <div>
              <p className="font-heading text-sm font-bold text-foreground">Require a brief</p>
              <p className="mt-0.5 text-xs text-foreground-muted">Buyers must describe the request.</p>
            </div>
            <Toggle checked={draft.requireBrief} onChange={() => patch({ requireBrief: !draft.requireBrief })} />
          </div>
        </div>

        {/* Terms */}
        <div className="rounded-2xl border border-border-subtle bg-surface p-5">
          <p className="font-heading text-base font-bold text-foreground">Terms &amp; notes for buyers</p>
          <p className="mt-0.5 text-xs text-foreground-muted">Shown on your commission request page.</p>
          <textarea
            value={draft.termsText}
            onChange={(e) => patch({ termsText: e.target.value })}
            rows={4}
            className="mt-3 w-full resize-none rounded-xl border border-border-subtle bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="sticky bottom-0 mt-6 flex flex-col gap-3 border-t border-border bg-background/95 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-foreground-subtle">Changes apply to new requests only.</p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-xl border border-border-subtle px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-surface-raised sm:flex-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-hover sm:flex-none"
          >
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
