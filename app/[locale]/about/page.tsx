import { AboutHero } from "@/components/about/about-hero";
import { AboutStats } from "@/components/about/about-stats";
import { AboutMission } from "@/components/about/about-mission";
import { AboutTimeline } from "@/components/about/about-timeline";
import { AboutValues } from "@/components/about/about-values";
import { AboutTeam } from "@/components/about/about-team";
import { AboutCTA } from "@/components/about/about-cta";
import { StructuredData } from "@/components/structured-data";

export default function AboutPage() {
  return (
    <div className="bg-atp-white">
      {/* Organization Schema for About page */}
      <StructuredData
        type="Organization"
        data={{
          description: "Learn about ATP Group Services - premium wellness and technology solutions including EMS Training, Skincare, Supplements, and Water Technology with exclusive ATP membership benefits in UAE.",
        }}
      />

      {/* Hero Section - Brand introduction */}
      <AboutHero />

      {/* Stats Section - Social proof with animated counters */}
      <AboutStats />

      {/* Mission Section - Our purpose and values */}
      <AboutMission />

      {/* Timeline Section - Brand story and milestones */}
      <AboutTimeline />

      {/* Values Section - What we stand for */}
      <AboutValues />

      {/* Call to Action - Convert interest to action */}
      <AboutCTA />
    </div>
  );
}
