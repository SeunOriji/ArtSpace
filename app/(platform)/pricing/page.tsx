import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Pricing } from "@/components/sections/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for African artists on ArtSpace.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
