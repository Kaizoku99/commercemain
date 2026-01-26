import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { NewArrivalsWrapper } from "@/components/new-arrivals-wrapper";
import { StructuredData } from "@/components/structured-data";
import ATPWellnessHero from "@/components/hero/atp-wellness-hero";
import ServiceHighlights from "@/components/sections/service-highlights";
import TrustIndicators from "@/components/sections/trust-indicators";
import { InstagramFeed } from "@/components/sections/instagram-feed";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "ar" ? "ar" : "en") as "en" | "ar";
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations('common');

  return (
    <>
      <StructuredData
        type="WebSite"
        data={{
          name: "ATP Group Services - Authentic Thai Wellness meets German Fitness",
          url: `https://atpgroupservices.com/${locale}`,
          description: t('siteDescription'),
        }}
      />

      {/* Enhanced ATP Wellness Hero Section */}
      <ATPWellnessHero />

      {/* New Arrivals and Products */}
      <NewArrivalsWrapper locale={locale} />

      {/* Interactive Service Highlights */}
      <ServiceHighlights />

      {/* Instagram Feed */}
      <InstagramFeed limit={8} />

      {/* Trust Indicators */}
      <TrustIndicators locale={locale} />
    </>
  );
}
