import {
  Fingerprint,
  Bell,
  Handshake,
  Globe,
  Home,
  Package,
} from "lucide-react";

const items = [
  {
    icon: Fingerprint,
    title: "Provenance Passport",
    description:
      "Every artwork gets a tamper-evident digital certificate linking it back to the artist's verified identity.",
  },
  {
    icon: Bell,
    title: "Drop Alerts",
    description:
      "Collectors follow artists and get instant notifications when new works drop — no algorithm, just direct signal.",
  },
  {
    icon: Handshake,
    title: "Commission Flow",
    description:
      "Structured brief → proposal → milestone → delivery workflow with escrow at each stage.",
  },
  {
    icon: Globe,
    title: "Multi-currency Payouts",
    description:
      "Price in NGN, receive in NGN, USD, GBP, or EUR. Auto-converted at the time of sale.",
  },
  {
    icon: Home,
    title: "Artist Rooms",
    description:
      "A dedicated micro-site inside ArtSpace — your bio, CV, press, and full collection in one shareable link.",
  },
  {
    icon: Package,
    title: "Shipping Accountability",
    description:
      "Integrated logistics tracking with insurance options. Buyers and artists both see every update.",
  },
];

export function Differentiators() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            Built different
          </p>
          <h2 className="font-heading text-display-md font-bold text-foreground">
            Why artists choose ArtSpace
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/20 hover:bg-surface-raised"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Icon size={20} className="text-accent" />
              </div>
              <h3 className="mb-2 font-heading text-sm font-bold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-foreground-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
