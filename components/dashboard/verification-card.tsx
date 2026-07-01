import Link from "next/link";
import { ShieldCheck, Clock } from "lucide-react";

const benefits = [
  "Verified badge on your profile",
  "Priority in search results",
  "Access to exclusive drops",
];

export function VerificationCard() {
  return (
    <div className="rounded-2xl border border-accent/30 p-5" style={{ background: "#211913" }}>
      <div className="mb-3 flex items-start gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
          <ShieldCheck size={18} className="text-accent" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-foreground">Get verified</h3>
          <p className="text-xs text-foreground-muted">Build trust with buyers &amp; collectors</p>
        </div>
      </div>

      <ul className="mb-4 space-y-1.5">
        {benefits.map((b) => (
          <li key={b} className="flex items-center gap-2 text-xs text-foreground-muted">
            <span className="h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
            {b}
          </li>
        ))}
      </ul>

      <Link
        href="/dashboard/verification"
        className="block w-full rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-accent-hover"
      >
        Begin verification
      </Link>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-foreground-subtle">
        <Clock size={11} />
        Typical review: under 72 hours
      </div>
    </div>
  );
}
