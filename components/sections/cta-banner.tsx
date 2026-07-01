import Link from "next/link";

export function CTABanner() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-accent px-8 py-16 text-center sm:px-12 lg:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
            For African artists
          </p>
          <h2 className="font-heading text-display-md font-bold text-white">
            Your gallery is waiting.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Join the first 1,000 artists on ArtSpace and get concierge onboarding, priority
            verification, and a lifetime rate lock on your plan.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up?role=artist"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-accent transition-colors hover:bg-white/90"
            >
              Apply as an artist
            </Link>
            <Link
              href="/marketplace"
              className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60"
            >
              Browse the marketplace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
