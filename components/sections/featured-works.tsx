import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const works = [
  {
    id: "1",
    title: "Harmattan Dusk",
    artist: "Oluwaseun Adeyemi",
    location: "Lagos, NG",
    price: 620_000,
    medium: "Oil on canvas · 90×120cm",
    badge: "Verified",
  },
  {
    id: "2",
    title: "Reclaimed Throne",
    artist: "Adaeze Okonkwo",
    location: "Enugu, NG",
    price: 1_200_000,
    medium: "Mixed media · 100×100cm",
    badge: "Featured",
  },
  {
    id: "3",
    title: "Lagos Lines",
    artist: "Emeka Nwachukwu",
    location: "Abuja, NG",
    price: 250_000,
    medium: "Photography prints · from",
    badge: "New",
    pricePrefix: "from ",
  },
];

function formatNGN(n: number) {
  return `₦${(n / 1000).toFixed(0)}k`;
}

export function FeaturedWorks() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
              Fresh from the studio
            </p>
            <h2 className="font-heading text-display-md font-bold text-foreground">Featured works</h2>
          </div>
          <Link
            href="/marketplace"
            className="hidden text-sm font-medium text-foreground-muted underline-offset-4 hover:text-foreground hover:underline sm:block"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <article
              key={work.id}
              className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-border/80"
            >
              {/* Artwork image placeholder */}
              <div className="relative aspect-[4/5] bg-surface-overlay">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-12 w-12 text-border"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>

                {/* Badge */}
                <div className="absolute left-3 top-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      work.badge === "Verified"
                        ? "bg-gold/20 text-gold"
                        : work.badge === "Featured"
                        ? "bg-accent/20 text-accent"
                        : "bg-surface text-foreground-muted"
                    }`}
                  >
                    {work.badge === "Verified" && <CheckCircle2 size={10} />}
                    {work.badge}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-base font-bold text-foreground">
                      {work.title}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground-muted">
                      {work.artist} · {work.location}
                    </p>
                    <p className="mt-1 text-xs text-foreground-subtle">{work.medium}</p>
                  </div>
                  <div className="ml-3 shrink-0 text-right">
                    <p className="font-heading text-base font-bold text-gold">
                      {work.pricePrefix ?? ""}
                      {formatNGN(work.price)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/marketplace"
            className="block text-center text-sm font-medium text-foreground-muted underline-offset-4 hover:text-foreground hover:underline"
          >
            View all artworks
          </Link>
        </div>
      </div>
    </section>
  );
}
