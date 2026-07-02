"use client";

import { useState } from "react";
import { Check, CheckCircle2, Clock, Sparkles, Wallet, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCommissionsStore,
  type ActiveCommission,
  type CommissionRequest,
  type CompletedCommission,
} from "@/store/commissions.store";

type TabKey = "requests" | "in-progress" | "completed";

function formatNaira(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  return `₦${amount.toLocaleString("en-NG")}`;
}

function RequestCard({ request }: { request: CommissionRequest }) {
  const sendQuote = useCommissionsStore((s) => s.sendQuote);
  const decline = useCommissionsStore((s) => s.decline);
  const isNew = request.status === "new";

  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        isNew ? "border-accent bg-surface-raised" : "border-border-subtle bg-surface"
      )}
    >
      <div className="flex items-start gap-3.5">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-surface-overlay font-heading text-sm font-bold text-gold">
          {request.clientInitials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-heading text-sm font-bold text-foreground">{request.clientName}</p>
            {isNew ? (
              <span className="flex-shrink-0 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
                New request
              </span>
            ) : (
              <span className="flex-shrink-0 rounded-full border border-border-subtle bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground-muted">
                Quote sent
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs font-medium text-foreground-subtle">
            {request.timeLabel} · Budget {request.budgetLabel}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">“{request.message}”</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {isNew && (
              <button
                type="button"
                onClick={() => sendQuote(request.id)}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-accent-hover"
              >
                Send a quote
              </button>
            )}
            <button
              type="button"
              className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-bold text-foreground transition-colors hover:bg-surface-overlay"
            >
              Message
            </button>
            {isNew && (
              <button
                type="button"
                onClick={() => decline(request.id)}
                className="rounded-lg px-3 py-2 text-xs font-bold text-foreground-muted transition-colors hover:text-foreground"
              >
                Decline
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveCommissionCard({
  commission,
  isSpotlighted,
  onSelect,
}: {
  commission: ActiveCommission;
  isSpotlighted: boolean;
  onSelect: () => void;
}) {
  const current = commission.milestones.find((m) => m.status === "current");
  const doneCount = commission.milestones.filter((m) => m.status === "done").length;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-2xl border p-5 text-left transition-colors",
        isSpotlighted ? "border-accent bg-surface-raised" : "border-border-subtle bg-surface hover:bg-surface-raised"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-heading text-sm font-bold text-foreground">{commission.title}</p>
        <span className="flex-shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
          {commission.healthLabel}
        </span>
      </div>
      <p className="mt-0.5 text-xs font-medium text-foreground-subtle">
        For {commission.clientName} · {formatNaira(commission.price)} · {commission.dueLabel}
      </p>
      <p className="mt-3 text-xs text-foreground-muted">
        {doneCount}/{commission.milestones.length} milestones ·{" "}
        <span className="font-semibold text-foreground">{current?.label ?? "Complete"}</span>
      </p>
    </button>
  );
}

function CompletedCommissionCard({ commission }: { commission: CompletedCommission }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-foreground">{commission.title}</p>
        <p className="mt-0.5 text-xs text-foreground-subtle">
          {commission.clientName} · {commission.completedLabel}
        </p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2.5">
        <span className="text-sm font-bold text-foreground">{formatNaira(commission.price)}</span>
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
          Paid out
        </span>
      </div>
    </div>
  );
}

function SpotlightPanel({ commission }: { commission: ActiveCommission | undefined }) {
  const advanceMilestone = useCommissionsStore((s) => s.advanceMilestone);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border-subtle bg-surface p-5">
        {commission ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-gold">Active commission</p>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                {commission.healthLabel}
              </span>
            </div>
            <p className="font-heading text-lg font-extrabold text-foreground">{commission.title}</p>
            <p className="mb-5 mt-0.5 text-xs font-medium text-foreground-muted">
              For {commission.clientName} · {formatNaira(commission.price)} · {commission.dueLabel}
            </p>

            <div className="flex flex-col">
              {commission.milestones.map((milestone, i) => {
                const isLast = i === commission.milestones.length - 1;
                return (
                  <div key={milestone.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full",
                          milestone.status === "done" && "bg-accent",
                          milestone.status === "current" && "border-2 border-accent bg-surface-raised",
                          milestone.status === "upcoming" && "border-2 border-border bg-background"
                        )}
                      >
                        {milestone.status === "done" && <Check size={14} className="text-white" />}
                        {milestone.status === "current" && (
                          <span className="h-2 w-2 rounded-full bg-accent" />
                        )}
                      </span>
                      {!isLast && (
                        <span
                          className={cn(
                            "min-h-[26px] w-[2px] flex-1",
                            milestone.status === "done" ? "bg-accent" : "bg-border"
                          )}
                        />
                      )}
                    </div>
                    <div className={cn("flex-1", isLast ? "pb-0" : "pb-4")}>
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm font-bold",
                            milestone.status === "upcoming" ? "text-foreground-muted" : "text-foreground"
                          )}
                        >
                          {milestone.label}
                        </p>
                        {milestone.status === "current" && (
                          <span className="flex-shrink-0 text-[11px] font-bold text-gold">Current</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-foreground-muted">{milestone.detail}</p>
                      {milestone.status === "current" && milestone.actionLabel && (
                        <button
                          type="button"
                          onClick={() => advanceMilestone(commission.id)}
                          className="mt-2.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-accent-hover"
                        >
                          {milestone.actionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-sm text-foreground-subtle">
            No active commissions right now — accepted requests will show progress here.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-surface-overlay">
          <ShieldCheck size={17} className="text-accent" />
        </span>
        <p className="text-xs leading-relaxed text-foreground-muted">
          Funds stay in escrow until the buyer approves each milestone — protecting both of you.
        </p>
      </div>
    </div>
  );
}

export function CommissionsView() {
  const requests = useCommissionsStore((s) => s.requests).filter((r) => r.status !== "declined");
  const active = useCommissionsStore((s) => s.active);
  const completed = useCommissionsStore((s) => s.completed);
  const newRequestsCount = useCommissionsStore((s) => s.newRequestsCount());

  const [activeTab, setActiveTab] = useState<TabKey>("requests");
  const [spotlightId, setSpotlightId] = useState<string | undefined>(active[0]?.id);

  const spotlight = active.find((c) => c.id === spotlightId) ?? active[0];
  const escrowTotal = active.reduce((sum, c) => sum + c.depositAmount, 0);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "requests", label: "Requests", count: requests.length },
    { key: "in-progress", label: "In progress", count: active.length },
    { key: "completed", label: "Completed", count: completed.length },
  ];

  const stats = [
    { label: "New requests", value: String(newRequestsCount), icon: Sparkles, tone: "text-gold" },
    { label: "In progress", value: String(active.length), icon: Clock, tone: "text-foreground" },
    { label: "Completed", value: String(completed.length), icon: CheckCircle2, tone: "text-foreground" },
    { label: "In escrow", value: formatNaira(escrowTotal), icon: Wallet, tone: "text-accent" },
  ];

  return (
    <div className="mx-auto max-w-[1100px]">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">Commissions</h1>
        <p className="mt-1.5 text-sm text-foreground-muted">
          Milestone-based, deposit-protected custom work.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-border bg-surface p-4">
            <Icon size={16} className="text-foreground-subtle" />
            <p className={cn("mt-3 font-heading text-2xl font-extrabold", tone)}>{value}</p>
            <p className="mt-1 text-xs text-foreground-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === tab.key
                ? "bg-accent text-white"
                : "border border-border-subtle bg-surface text-foreground-muted hover:text-foreground"
            )}
          >
            {tab.label} <span className={activeTab === tab.key ? "text-white/80" : "text-foreground-subtle"}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.55fr_1fr]">
        <div className="flex flex-col gap-4">
          {activeTab === "requests" &&
            (requests.length > 0 ? (
              requests.map((request) => <RequestCard key={request.id} request={request} />)
            ) : (
              <p className="py-16 text-center text-sm text-foreground-subtle">No new requests right now.</p>
            ))}

          {activeTab === "in-progress" &&
            (active.length > 0 ? (
              active.map((commission) => (
                <ActiveCommissionCard
                  key={commission.id}
                  commission={commission}
                  isSpotlighted={commission.id === spotlight?.id}
                  onSelect={() => setSpotlightId(commission.id)}
                />
              ))
            ) : (
              <p className="py-16 text-center text-sm text-foreground-subtle">No commissions in progress.</p>
            ))}

          {activeTab === "completed" &&
            (completed.length > 0 ? (
              completed.map((commission) => (
                <CompletedCommissionCard key={commission.id} commission={commission} />
              ))
            ) : (
              <p className="py-16 text-center text-sm text-foreground-subtle">No completed commissions yet.</p>
            ))}
        </div>

        <SpotlightPanel commission={spotlight} />
      </div>
    </div>
  );
}
