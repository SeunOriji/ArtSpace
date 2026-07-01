import { AnnouncementBar } from "@/components/sections/announcement-bar";
import { Hero } from "@/components/sections/hero";
import { Pillars } from "@/components/sections/pillars";
import { FeaturedWorks } from "@/components/sections/featured-works";
import { Differentiators } from "@/components/sections/differentiators";
import { Pricing } from "@/components/sections/pricing";
import { CTABanner } from "@/components/sections/cta-banner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Pillars />
        <FeaturedWorks />
        <Differentiators />
        <Pricing />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
