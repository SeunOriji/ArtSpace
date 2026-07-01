import Link from "next/link";

const steps = [
  {
    label: "Create your account",
    subtitle: null,
    state: "done" as const,
    action: null,
  },
  {
    label: "Add profile photo & bio",
    subtitle: null,
    state: "done" as const,
    action: null,
  },
  {
    label: "Upload 5 portfolio works",
    subtitle: "1 of 5 added — almost there",
    state: "active" as const,
    action: { label: "Continue", href: "/dashboard/portfolio" },
  },
  {
    label: "Record Proof-of-Craft video",
    subtitle: "Required to start selling",
    state: "pending" as const,
    action: { label: "Start", href: "/dashboard/verification" },
  },
  {
    label: "Set your availability & payout",
    subtitle: "Connect Paystack or Stripe",
    state: "pending" as const,
    action: { label: "Set up", href: "/dashboard/settings" },
  },
];

const doneCount = steps.filter((s) => s.state === "done").length;
const pct = Math.round((doneCount / steps.length) * 100);

export function GettingStarted() {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-surface-raised to-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-foreground">Getting started</h2>
        <span className="text-sm font-semibold text-foreground-muted">
          {doneCount} of {steps.length} done
        </span>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-background">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {steps.map(({ label, subtitle, state, action }) => {
          if (state === "done") {
            return (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-background p-3.5 opacity-60"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 8.2l2.4 2.4L12 5"
                      stroke="#14110D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-foreground-muted line-through">
                  {label}
                </span>
              </div>
            );
          }

          if (state === "active") {
            return (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-accent bg-surface-raised p-3.5"
              >
                <span className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-accent" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{label}</p>
                  {subtitle && (
                    <p className="text-xs text-foreground-muted">{subtitle}</p>
                  )}
                </div>
                {action && (
                  <Link
                    href={action.href}
                    className="flex-shrink-0 rounded-lg bg-accent px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-accent-hover"
                  >
                    {action.label}
                  </Link>
                )}
              </div>
            );
          }

          return (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl bg-background p-3.5"
            >
              <span className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-border" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                {subtitle && (
                  <p className="text-xs text-foreground-muted">{subtitle}</p>
                )}
              </div>
              {action && (
                <Link
                  href={action.href}
                  className="flex-shrink-0 rounded-lg border border-border px-3.5 py-2 text-xs font-bold text-foreground transition-colors hover:bg-surface-raised"
                >
                  {action.label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
