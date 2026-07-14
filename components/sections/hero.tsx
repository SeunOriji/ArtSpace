import Link from "next/link";
import { Shield, Users, CheckCircle2 } from "lucide-react";
import { artworks } from "@/lib/artworks";
import { ArtworkThumbnail } from "@/components/artwork-lightbox";

const stats = [
  { icon: Users, value: "10,000+", label: "Artists onboarded" },
  { icon: Shield, value: "Escrow-protected", label: "Every sale" },
  { icon: CheckCircle2, value: "Verified", label: "Authenticity" },
];

const heroArtwork = artworks.find((a) => a.category === "african-art") ?? artworks[0];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -top-40 right-1/3 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-gold/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Text */}
          <div>
            <h1 className="font-heading text-display-xl font-extrabold leading-none tracking-tight text-foreground">
              Where African art
              <br />
              finds its{" "}
              <span className="text-gradient-accent">global voice.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-foreground-muted">
              ArtSpace is the platform built for African artists — portfolio, marketplace, commissions, and
              collector connections in one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/sign-up?role=artist"
                className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Join as an artist
              </Link>
              <Link
                href="/marketplace"
                className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground-muted"
              >
                Explore the marketplace
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-wrap gap-8">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon size={16} className="shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{value}</p>
                    <p className="text-xs text-foreground-subtle">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured artwork card */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-2xl shadow-black/40">
              {/* Featured artwork */}
              <div className="relative aspect-[4/5] bg-surface-overlay">
                <ArtworkThumbnail
                  artwork={{
                    id: heroArtwork.id,
                    image: heroArtwork.image,
                    imageLarge: heroArtwork.imageLarge,
                    title: heroArtwork.title,
                    artist: heroArtwork.artist,
                  }}
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  priority
                />

                {/* Verified badge */}
                <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                  <CheckCircle2 size={12} className="text-gold" />
                  <span className="text-xs font-medium text-foreground">Verified Artist</span>
                </div>
              </div>

              {/* Artwork info overlay */}
              <div className="border-t border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-heading text-base font-bold text-foreground">Harmattan Dusk</p>
                    <p className="mt-0.5 text-xs text-foreground-muted">Oluwaseun Adeyemi · Lagos, NG</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-base font-bold text-gold">₦480,000</p>
                    <p className="text-xs text-foreground-subtle">Oil on canvas</p>
                  </div>
                </div>
                <button className="mt-3 w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
                  View artwork
                </button>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-surface px-4 py-3 shadow-lg">
              <p className="text-xs font-semibold text-foreground">72hr verification</p>
              <p className="text-xs text-foreground-subtle">Fastest in the market</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
