import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { NewArrivalsWrapper } from "@/components/new-arrivals-wrapper";
import { StructuredData } from "@/components/structured-data";
import ATPWellnessHero from "@/components/hero/atp-wellness-hero";
import ServiceHighlights from "@/components/sections/service-highlights";
import TrustIndicators from "@/components/sections/trust-indicators";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  
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

      {/* Trust Indicators */}
      <TrustIndicators locale={locale} />
    </>
  );
}
