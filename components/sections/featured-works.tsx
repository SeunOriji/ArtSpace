import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { artworks } from "@/lib/artworks";
import { ArtworkThumbnail } from "@/components/artwork-lightbox";

const badges = ["Verified", "Featured", "New"] as const;

const works = artworks.slice(0, 3).map((a, i) => ({
  id: a.id,
  title: a.title,
  artist: a.artist,
  image: a.image,
  imageLarge: a.imageLarge,
  location: a.culture || a.year,
  price: a.price,
  medium: a.medium,
  badge: badges[i],
  pricePrefix: i === 2 ? "from " : undefined,
}));

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
              {/* Artwork image */}
              <div className="relative aspect-[4/5] bg-surface-overlay">
                <ArtworkThumbnail
                  artwork={{ id: work.id, image: work.image, imageLarge: work.imageLarge, title: work.title, artist: work.artist }}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />

                {/* Badge */}
                <div className="pointer-events-none absolute left-3 top-3">
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
                    <p className="mt-0.5 truncate text-xs text-foreground-muted">
                      {work.location ? `${work.artist} · ${work.location}` : work.artist}
                    </p>
                    <p className="mt-1 truncate text-xs text-foreground-subtle">{work.medium}</p>
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
