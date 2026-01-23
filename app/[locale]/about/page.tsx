import { AboutHero } from "@/components/about/about-hero";
import { AboutMission } from "@/components/about/about-mission";
import { AboutCTA } from "@/components/about/about-cta";

// Note: generateMetadata should be handled via parent layout
// since this is now a Server Component. 

export default function AboutPage() {
  return (
    <div className="bg-atp-white">
      {/* Hero Section */}
      <AboutHero />

      {/* Main Content Grid */}
      <AboutMission />

      {/* Call to Action */}
      <AboutCTA />
    </div>
  );
}
