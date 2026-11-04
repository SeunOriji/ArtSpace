import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service | ArtSpace" },
  description: "The terms that govern your use of ArtSpace.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <LegalDocument file="terms.md" />
      </main>
      <Footer />
    </>
  );
}
