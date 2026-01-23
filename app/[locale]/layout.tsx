import { type ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/src/i18n/routing';
import { CartProvider } from "@/components/cart/cart-context";
import { CartNotificationProvider } from "@/components/cart/cart-provider";
import { MembershipProvider } from "@/hooks/use-atp-membership-context";
import { Navbar } from "@/components/layout/navbar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import Footer from "@/components/layout/footer";
import { WelcomeToast } from "@/components/welcome-toast";
import { getCart } from "@/lib/shopify/server";
import { Toaster } from "sonner";
import { Inter, Cairo } from "next/font/google";
import { StructuredData } from "@/components/structured-data";
import { SkipToContentSimple } from "@/components/ui/skip-navigation";
import { baseUrl } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return ['en', 'ar'].map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: t('siteTitle'),
    description: t('siteDescription'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      locale: locale === "ar" ? "ar_AE" : "en_AE",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for client components
  const messages = await getMessages();

  let cart;
  try {
    cart = await getCart();
  } catch (error) {
    console.error("Error fetching cart:", error);
    cart = undefined;
  }

  const isRTL = locale === 'ar';

  return (
    <>
      {/* Locale-specific structured data */}
      <StructuredData
        type="Organization"
        data={{
          name: locale === "ar" ? "مجموعة ATP للخدمات" : "ATP Group Services",
          url: `${baseUrl}/${locale}`,
          logo: `${baseUrl}/logo.png`,
          description:
            locale === "ar"
              ? "حلول العافية المتميزة والتكنولوجيا المتقدمة مع فوائد العضوية الحصرية لـ ATP"
              : "Premium wellness and technology solutions with exclusive ATP membership benefits",
        }}
      />

      <div
        className={`bg-atp-white text-atp-black selection:bg-atp-gold/20 selection:text-atp-black ${isRTL ? "rtl arabic font-cairo" : "ltr english font-inter"
          } ${inter.variable} ${cairo.variable}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <NextIntlClientProvider messages={messages}>
          <CartProvider initialCart={cart}>
            <CartNotificationProvider>
              <MembershipProvider>
                <SkipToContentSimple label={isRTL ? 'انتقل إلى المحتوى الرئيسي' : 'Skip to main content'} />
                <Navbar />
                <main id="main-content" className="min-h-screen pb-16 md:pb-0" tabIndex={-1}>
                  {children}
                  <Toaster
                    closeButton
                    theme="light"
                    position={isRTL ? "bottom-left" : "bottom-right"}
                    toastOptions={{
                      style: {
                        background: "var(--atp-white)",
                        border: "1px solid var(--atp-light-gray)",
                        color: "var(--atp-black)",
                      },
                    }}
                  />
                  <WelcomeToast />
                </main>
                <Footer />
                <MobileBottomNav />
              </MembershipProvider>
            </CartNotificationProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </div>
    </>
  );
}
