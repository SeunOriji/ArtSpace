"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Plus, ShieldCheck, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useCommissionsStore,
  DEPOSIT_OPTIONS,
  type CommissionQuote,
  type CommissionRequest,
  type QuoteMilestone,
} from "@/store/commissions.store";

const SKETCH_STAGE_OPTIONS = ["3–5 days", "1 week", "1–2 weeks", "2–3 weeks"];

function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

function guessTotalPrice(budgetLabel: string): number {
  const numbers = budgetLabel.match(/[\d,]+/g)?.map((n) => Number(n.replace(/,/g, ""))) ?? [];
  if (numbers.length === 0) return 0;
  const average = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  return Math.round(average / 5_000) * 5_000;
}

function buildDefaultMilestones(totalPrice: number, depositPercent: number): QuoteMilestone[] {
  const deposit = Math.round((totalPrice * depositPercent) / 100);
  const remaining = totalPrice - deposit;
  const sketch = Math.round(remaining * 0.4);
  const final = remaining - sketch;
  return [
    { id: "ms-1", label: "Deposit to reserve slot", amount: deposit },
    { id: "ms-2", label: "Sketch approved", amount: sketch },
    { id: "ms-3", label: "Final delivery & approval", amount: final },
  ];
}

export function SendQuoteModal({
  request,
  open,
  onOpenChange,
}: {
  request: CommissionRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const sendQuote = useCommissionsStore((s) => s.sendQuote);
  const defaultDepositPercent = useCommissionsStore((s) => s.settings.depositPercent);
  const firstName = request.clientName.split(" ")[0];

  const initialTotal = guessTotalPrice(request.budgetLabel);

  const [title, setTitle] = useState("");
  const [totalPrice, setTotalPrice] = useState(initialTotal);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [depositPercent, setDepositPercent] = useState(defaultDepositPercent);
  const [milestones, setMilestones] = useState<QuoteMilestone[]>(() =>
    buildDefaultMilestones(initialTotal, defaultDepositPercent)
  );
  const [revisionsIncluded, setRevisionsIncluded] = useState(1);
  const [sketchStageLabel, setSketchStageLabel] = useState(SKETCH_STAGE_OPTIONS[1]);
  const [noteToBuyer, setNoteToBuyer] = useState("");

  const depositNow = Math.round((totalPrice * depositPercent) / 100);
  const platformFee = Math.round(totalPrice * 0.1);
  const youReceive = totalPrice - platformFee;

  function updateMilestone(id: string, partial: Partial<QuoteMilestone>) {
    setMilestones((list) => list.map((m) => (m.id === id ? { ...m, ...partial } : m)));
  }

  function addMilestone() {
    setMilestones((list) => [...list, { id: `ms-${Date.now()}`, label: "New milestone", amount: 0 }]);
  }

  function removeMilestone(id: string) {
    setMilestones((list) => list.filter((m) => m.id !== id));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const quote: CommissionQuote = {
      title: title.trim() || `Commission for ${request.clientName}`,
      totalPrice,
      deliveryDate,
      depositPercent,
      milestones,
      revisionsIncluded,
      sketchStageLabel,
      noteToBuyer,
    };
    sendQuote(request.id, quote);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[820px]">
        <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>Send a quote</DialogTitle>
            <DialogDescription>
              {firstName} accepts or declines — nothing is charged until then.
            </DialogDescription>
          </DialogHeader>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-y-auto px-6 py-6 sm:px-7 lg:grid-cols-[1fr_260px]">
            {/* Form */}
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border border-border-subtle bg-background p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-surface-overlay font-heading text-xs font-bold text-gold">
                    {request.clientInitials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{request.clientName}</p>
                    <p className="text-xs text-foreground-subtle">Budget {request.budgetLabel}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-foreground-muted">&ldquo;{request.message}&rdquo;</p>
              </div>

              <Field label="Commission title">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ancestral Portrait, mixed media"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Total price">
                  <div className="flex items-center rounded-xl border border-border bg-background px-4 py-3 focus-within:border-accent">
                    <span className="text-sm font-bold text-foreground-subtle">₦</span>
                    <input
                      type="number"
                      min={0}
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(Number(e.target.value) || 0)}
                      className="min-w-0 flex-1 bg-transparent pl-1 text-sm font-semibold text-foreground outline-none"
                    />
                  </div>
                </Field>
                <Field label="Delivery date">
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent"
                  />
                </Field>
              </div>

              <Field label="Upfront deposit">
                <div className="flex gap-2">
                  {DEPOSIT_OPTIONS.map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDepositPercent(pct)}
                      className={cn(
                        "flex-1 rounded-lg border py-2.5 text-sm font-bold transition-colors",
                        depositPercent === pct
                          ? "border-accent bg-surface-raised text-foreground"
                          : "border-border-subtle text-foreground-muted hover:text-foreground"
                      )}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </Field>

              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <FieldLabel>Milestones &amp; payment split</FieldLabel>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="flex items-center gap-1.5 text-xs font-bold text-gold transition-colors hover:text-gold-hover"
                  >
                    <Plus size={13} />
                    Add
                  </button>
                </div>
                <div className="flex flex-col gap-2.5">
                  {milestones.map((milestone, i) => (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-3 rounded-xl border border-border-subtle bg-background p-3"
                    >
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-surface-overlay font-heading text-xs font-bold text-foreground-muted">
                        {i + 1}
                      </span>
                      <input
                        value={milestone.label}
                        onChange={(e) => updateMilestone(milestone.id, { label: e.target.value })}
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none"
                      />
                      <div className="flex flex-shrink-0 items-center gap-1">
                        <span className="text-xs font-bold text-foreground-subtle">₦</span>
                        <input
                          type="number"
                          min={0}
                          value={milestone.amount}
                          onChange={(e) => updateMilestone(milestone.id, { amount: Number(e.target.value) || 0 })}
                          className="w-24 bg-transparent text-right text-sm font-bold text-foreground outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMilestone(milestone.id)}
                        aria-label="Remove milestone"
                        className="flex-shrink-0 text-foreground-subtle transition-colors hover:text-foreground"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Revisions included">
                  <div className="flex items-center overflow-hidden rounded-xl border border-border">
                    <button
                      type="button"
                      onClick={() => setRevisionsIncluded((n) => Math.max(0, n - 1))}
                      className="px-4 py-3 font-heading text-sm font-bold text-foreground-muted transition-colors hover:text-foreground"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-heading text-sm font-extrabold text-foreground">
                      {revisionsIncluded}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRevisionsIncluded((n) => n + 1)}
                      className="px-4 py-3 font-heading text-sm font-bold text-gold transition-colors hover:text-gold-hover"
                    >
                      +
                    </button>
                  </div>
                </Field>
                <Field label="Sketch stage">
                  <select
                    value={sketchStageLabel}
                    onChange={(e) => setSketchStageLabel(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none focus:border-accent"
                  >
                    {SKETCH_STAGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label={`Note to ${firstName}`}>
                <textarea
                  value={noteToBuyer}
                  onChange={(e) => setNoteToBuyer(e.target.value)}
                  rows={3}
                  placeholder="Share anything about your process, materials, or timeline..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-accent"
                />
              </Field>
            </div>

            {/* Summary rail */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-border-subtle bg-background p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-foreground-muted">Quote summary</p>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <SummaryRow label="Total" value={formatNaira(totalPrice)} />
                  <SummaryRow label="Deposit now" value={formatNaira(depositNow)} />
                  <SummaryRow label="Milestones" value={String(milestones.length)} />
                  <SummaryRow label="Delivery date" value={deliveryDate || "—"} />
                </div>
                <div className="my-3 border-t border-border-subtle" />
                <div className="flex flex-col gap-2 text-sm">
                  <SummaryRow label="ArtSpace fee (10%)" value={`−${formatNaira(platformFee)}`} muted />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">You receive</span>
                    <span className="font-heading text-base font-extrabold text-accent">
                      {formatNaira(youReceive)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-2xl border border-border bg-background p-4">
                <ShieldCheck size={16} className="mt-0.5 flex-shrink-0 text-accent" />
                <p className="text-xs leading-relaxed text-foreground-muted">
                  Funds are held in escrow and released to you as each milestone is approved.
                </p>
              </div>

              <button
                type="button"
                className="text-left text-xs font-bold text-foreground-muted transition-colors hover:text-foreground"
              >
                Preview as buyer
              </button>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              className="text-xs font-bold text-foreground-muted transition-colors hover:text-foreground"
            >
              Save as draft
            </button>
            <div className="flex items-center gap-2.5">
              <DialogClose asChild>
                <button
                  type="button"
                  className="rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-overlay"
                >
                  Cancel
                </button>
              </DialogClose>
              <button
                type="submit"
                className="rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-hover"
              >
                Send quote to {firstName}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-xs font-bold uppercase tracking-wide text-foreground-muted">{children}</span>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground-muted">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground-muted">{label}</span>
      <span className={cn("font-semibold", muted ? "text-foreground-subtle" : "text-foreground")}>{value}</span>
    </div>
  );
}
