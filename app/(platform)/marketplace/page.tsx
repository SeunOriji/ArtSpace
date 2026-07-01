import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Buy and sell original African art with escrow-protected transactions.",
};

export default function MarketplacePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-heading text-display-lg font-extrabold text-foreground">Marketplace</h1>
          <p className="mt-3 text-foreground-muted">
            Buy and sell original African art with escrow-protected transactions.
          </p>
          <div className="mt-12 text-center text-foreground-subtle">Coming soon</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
