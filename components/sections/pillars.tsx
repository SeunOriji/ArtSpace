import { LayoutGrid, ShoppingBag, Users, CalendarDays, BadgeCheck } from "lucide-react";

const pillars = [
  {
    icon: LayoutGrid,
    title: "Portfolio & Identity",
    description: "A living portfolio that tells your story — bio, process shots, exhibitions, and collector history.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "List originals, prints, and commissions. Escrow-protected payments, NGN-first with multi-currency payouts.",
  },
  {
    icon: Users,
    title: "Social Feed",
    description: "Share your process, build a following, and connect with collectors who appreciate your work.",
  },
  {
    icon: CalendarDays,
    title: "Art Events",
    description: "Discover fairs, workshops, and pop-ups. RSVP, sell tickets, and promote your own events.",
  },
  {
    icon: BadgeCheck,
    title: "Verification & Trust",
    description: "Identity-backed profiles with provenance passports. Every artwork traceable from studio to collector.",
  },
];

export function Pillars() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            Everything you need
          </p>
          <h2 className="font-heading text-display-md font-bold text-foreground">
            Five pillars. One platform.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/30 hover:bg-surface-raised"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Icon size={20} className="text-accent" />
              </div>
              <h3 className="mb-2 font-heading text-sm font-bold text-foreground">{title}</h3>
              <p className="text-xs leading-relaxed text-foreground-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
