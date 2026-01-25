"use client";

import { m, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ShoppingBag, Eye, Clock, MapPin, Star, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { fadeUpVariants, containerVariants, itemVariants, easing } from "@/lib/animations/variants";

interface PurchaseNotification {
  id: string;
  productName: string;
  location: string;
  timeAgo: string;
  imageUrl?: string;
}

interface SocialProofProps {
  /** Enable live purchase notifications popup. Default: true */
  showNotifications?: boolean;
  /** Show "X people viewing" indicator. Default: true */
  showViewers?: boolean;
  /** Show stats bar. Default: true */
  showStats?: boolean;
  className?: string;
}

// Simulated purchase notifications (in production, these would come from Shopify webhooks or real-time API)
const SAMPLE_NOTIFICATIONS: PurchaseNotification[] = [
  { id: "1", productName: "EMS Training Suit Pro", location: "Dubai, UAE", timeAgo: "2 min ago" },
  { id: "2", productName: "Collagen Gold Serum", location: "Abu Dhabi, UAE", timeAgo: "5 min ago" },
  { id: "3", productName: "Thai Herbal Supplements Pack", location: "Sharjah, UAE", timeAgo: "8 min ago" },
  { id: "4", productName: "Hydrogen Water Generator", location: "Dubai, UAE", timeAgo: "12 min ago" },
  { id: "5", productName: "Premium Skincare Bundle", location: "Ajman, UAE", timeAgo: "15 min ago" },
  { id: "6", productName: "EMS Recovery Suit", location: "Dubai, UAE", timeAgo: "18 min ago" },
];

// Stats for social proof
const TRUST_STATS = [
  { label: "Happy Customers", value: 15000, suffix: "+" },
  { label: "Products Sold", value: 85000, suffix: "+" },
  { label: "5-Star Reviews", value: 4800, suffix: "+" },
  { label: "Countries Shipped", value: 25, suffix: "+" },
];

export function SocialProof({
  showNotifications = true,
  showViewers = true,
  showStats = true,
  className,
}: SocialProofProps) {
  const t = useTranslations("socialProof");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Simulate viewer count with realistic fluctuation
  useEffect(() => {
    // Initial random viewer count
    setViewerCount(Math.floor(Math.random() * 30) + 45);

    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const newCount = prev + change;
        return Math.max(35, Math.min(120, newCount)); // Keep between 35-120
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // Cycle through purchase notifications
  useEffect(() => {
    if (!showNotifications || prefersReducedMotion) return;

    let notificationIndex = 0;

    const showNextNotification = () => {
      setCurrentNotification(SAMPLE_NOTIFICATIONS[notificationIndex]);
      setNotificationVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setNotificationVisible(false);
      }, 4000);

      // Move to next notification
      notificationIndex = (notificationIndex + 1) % SAMPLE_NOTIFICATIONS.length;
    };

    // Initial delay before first notification
    const initialDelay = setTimeout(showNextNotification, 3000);

    // Show new notification every 10 seconds
    const interval = setInterval(showNextNotification, 10000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [showNotifications, prefersReducedMotion]);

  return (
    <>
      {/* === STATS SECTION === */}
      {showStats && (
        <section
          ref={sectionRef}
          className={cn(
            "relative py-16 sm:py-20 lg:py-24 bg-black overflow-hidden",
            className
          )}
          aria-label={t("statsAriaLabel") || "Customer trust statistics"}
        >
          {/* Subtle gold glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--atp-gold)_0%,_transparent_60%)] opacity-[0.05]" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <m.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easing.smooth }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-white mb-4">
                {t("trustedByThousands") || "Trusted by Thousands"}
              </h2>
              <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
                {t("joinCommunity") || "Join our growing community of wellness enthusiasts across the UAE and beyond."}
              </p>
            </m.div>

            {/* Stats Grid */}
            <m.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {TRUST_STATS.map((stat, index) => (
                <m.div
                  key={stat.label}
                  className="text-center group"
                  variants={itemVariants}
                >
                  <div className="relative inline-block mb-3">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[var(--atp-gold)]">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        duration={2.5}
                        delay={0.3 + index * 0.15}
                      />
                    </span>
                    {/* Decorative underline */}
                    <m.div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-[var(--atp-gold)]"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: "50%" } : {}}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                  <p className="text-white/60 text-sm sm:text-base font-medium">
                    {t(stat.label.toLowerCase().replace(/\s+/g, "")) || stat.label}
                  </p>
                </m.div>
              ))}
            </m.div>

            {/* Live Viewers Indicator */}
            {showViewers && (
              <m.div
                className="mt-12 sm:mt-16 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                  </span>
                  <span className="text-white/80 text-sm sm:text-base">
                    <Eye className="inline w-4 h-4 mr-1.5 text-[var(--atp-gold)]" />
                    <AnimatedCounter
                      value={viewerCount}
                      duration={0.5}
                      className="text-white font-semibold"
                    />
                    <span className="ml-1">
                      {t("peopleViewing") || "people viewing now"}
                    </span>
                  </span>
                </div>
              </m.div>
            )}

            {/* Trending Products Bar */}
            <m.div
              className="mt-8 sm:mt-12 flex justify-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="inline-flex items-center gap-2 text-white/50 text-sm">
                <TrendingUp className="w-4 h-4 text-[var(--atp-gold)]" />
                <span>{t("trendingNow") || "Trending:"}</span>
                <span className="text-white/70">EMS Training Suits</span>
                <span>•</span>
                <span className="text-white/70">Hydrogen Water</span>
                <span>•</span>
                <span className="text-white/70">Collagen Serums</span>
              </div>
            </m.div>
          </div>
        </section>
      )}

      {/* === PURCHASE NOTIFICATION POPUP === */}
      {showNotifications && (
        <AnimatePresence>
          {notificationVisible && currentNotification && (
            <m.div
              className="fixed bottom-4 left-4 z-50 max-w-sm"
              initial={{ opacity: 0, x: -100, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -100, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-luxury-lg border border-neutral-200 dark:border-neutral-800 p-4 flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--atp-gold)]/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[var(--atp-gold)]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {t("someoneJustPurchased") || "Someone just purchased"}
                  </p>
                  <p className="text-sm text-[var(--atp-gold)] font-semibold truncate">
                    {currentNotification.productName}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {currentNotification.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {currentNotification.timeAgo}
                    </span>
                  </div>
                </div>

                {/* Verified Badge */}
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{t("verified") || "Verified"}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <m.div
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--atp-gold)] origin-left rounded-full"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </m.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export default SocialProof;
