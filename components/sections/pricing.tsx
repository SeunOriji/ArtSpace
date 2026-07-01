import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "For artists just getting started.",
    cta: "Get started free",
    ctaHref: "/sign-up",
    featured: false,
    features: [
      "5-artwork portfolio",
      "Basic artist profile",
      "Marketplace listings (10% commission)",
      "Community feed access",
      "Standard verification",
    ],
  },
  {
    name: "Studio",
    price: 3_500,
    period: "per month",
    description: "For working artists ready to grow.",
    cta: "Start Studio plan",
    ctaHref: "/sign-up?plan=studio",
    featured: true,
    badge: "Most popular",
    features: [
      "Unlimited portfolio",
      "Artist Room (custom micro-site)",
      "Marketplace listings (5% commission)",
      "Commission Flow tools",
      "Priority verification (72hr SLA)",
      "Drop Alert notifications",
      "Multi-currency payouts",
    ],
  },
  {
    name: "Gallery",
    price: 7_500,
    period: "per month",
    description: "For established artists and galleries.",
    cta: "Start Gallery plan",
    ctaHref: "/sign-up?plan=gallery",
    featured: false,
    features: [
      "Everything in Studio",
      "Provenance Passport per artwork",
      "Marketplace listings (3% commission)",
      "Dedicated account manager",
      "Event hosting tools",
      "Analytics dashboard",
      "API access",
    ],
  },
];

function formatNGN(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function Pricing() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28" id="pricing">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Pricing</p>
          <h2 className="font-heading text-display-md font-bold text-foreground">
            Invest in your craft
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-foreground-muted">
            No hidden fees. Cancel anytime. Start free and upgrade when your art practice demands it.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border p-8 transition-all",
                plan.featured
                  ? "border-accent bg-accent/5 shadow-xl shadow-accent/5"
                  : "border-border bg-surface"
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="font-heading text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-foreground-muted">{plan.description}</p>
                <div className="mt-4">
                  <span className="font-heading text-3xl font-extrabold text-foreground">
                    {plan.price === 0 ? "Free" : formatNGN(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="ml-1 text-sm text-foreground-subtle">/{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground-muted">
                    <CheckCircle2
                      size={15}
                      className={cn("mt-0.5 shrink-0", plan.featured ? "text-accent" : "text-foreground-subtle")}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={cn(
                  "block w-full rounded-full py-3 text-center text-sm font-semibold transition-colors",
                  plan.featured
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "border border-border text-foreground hover:border-foreground-muted"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
