import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "For Artists",
  description: "Everything African artists need — portfolio, marketplace, commissions, and more.",
};

export default function ArtistsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-heading text-display-lg font-extrabold text-foreground">For Artists</h1>
          <p className="mt-3 text-foreground-muted">
            Everything you need to run your art practice from one place.
          </p>
          <div className="mt-12 text-center text-foreground-subtle">Coming soon</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
