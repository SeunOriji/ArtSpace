import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | ArtSpace" },
  description: "How ArtSpace collects, uses and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <LegalDocument file="privacy.md" />
      </main>
      <Footer />
    </>
  );
}
