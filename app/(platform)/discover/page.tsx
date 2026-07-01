import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Discover",
  description: "Explore African art across all genres, mediums, and artists on ArtSpace.",
};

export default function DiscoverPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-heading text-display-lg font-extrabold text-foreground">Discover</h1>
          <p className="mt-3 text-foreground-muted">
            Explore African art across all genres, mediums, and artists.
          </p>
          <div className="mt-12 text-center text-foreground-subtle">Coming soon</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
