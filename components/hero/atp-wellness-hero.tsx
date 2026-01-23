"use client";

import { m, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import React from "react";
import { ChevronDown, Heart, Leaf, Dumbbell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

interface WellnessFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function ATPWellnessHero() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const [currentFeature, setCurrentFeature] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Optimized: Reduced positions for background particles to improve mobile performance
  // Using fixed positions to avoid hydration mismatch
  const particlePositions = [
    { left: 15, top: 25 },
    { left: 45, top: 35 },
    { left: 75, top: 15 },
    { left: 25, top: 65 },
    { left: 85, top: 45 },
    { left: 35, top: 85 },
    { left: 65, top: 25 },
    { left: 55, top: 75 },
    { left: 10, top: 50 },
    { left: 90, top: 70 },
  ];

  const wellnessFeatures: WellnessFeature[] = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: t('naturalSupplements'),
      description: t('premiumThaiWellness'),
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: t('beautyCare'),
      description: t('advancedSkincare'),
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('emsTraining'),
      description: t('emsDescription'),
      color: "from-orange-500 to-red-600",
    },
  ];

  const isInView = useInView(ref);

  useEffect(() => {
    setIsClient(true);
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % wellnessFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [wellnessFeatures.length, isInView]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with parallax */}
      <m.div className="absolute inset-0 z-0" style={{ y }}>
        <div className="absolute inset-0 bg-gradient-to-br from-atp-black via-atp-charcoal to-atp-black" />
        <m.div
          className="absolute inset-0 bg-gradient-to-r from-atp-gold/10 via-transparent to-atp-gold/10"
          style={{ scale }}
        />

        {/* Animated background elements - optimized for performance */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particlePositions.map((position, i) => (
              <m.div
                key={i}
                className="absolute w-2 h-2 bg-atp-gold/20 rounded-full will-change-transform"
                style={{
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                }}
                animate={{
                  y: [-15, 15, -15],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 5 + (i % 3),
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        )}
      </m.div>

      {/* Main content */}
      <m.div
        className="relative z-20 container mx-auto px-4 text-center"
        style={{ opacity }}
      >
        {/* Main heading with staggered animation */}
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-tight mb-6 sm:mb-8 px-4 sm:px-0">
            <m.span
              className="block bg-gradient-to-r from-atp-gold via-yellow-300 to-atp-gold bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('welcomeToATP')}
            </m.span>
            <m.span
              className="block text-atp-white/90 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-2 sm:mt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('authenticThaiWellness')}
            </m.span>
          </h1>
        </m.div>

        {/* Subtitle with typing effect */}
        <m.div
          className="max-w-4xl mx-auto mb-8 sm:mb-12 px-4 sm:px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-atp-white/80 leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </m.div>

        {/* Rotating feature showcase */}
        <m.div
          className="mb-8 sm:mb-12 px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 max-w-5xl mx-auto">
            {wellnessFeatures.map((feature, index) => (
              <m.div
                key={index}
                className={`flex flex-col items-center p-4 sm:p-6 rounded-2xl transition-all duration-500 ${index === currentFeature
                  ? "bg-white/10 backdrop-blur-sm scale-105"
                  : "bg-white/5 hover:bg-white/8"
                  }`}
                whileHover={{ scale: 1.05 }}
              >
                <m.div
                  className={`p-3 sm:p-4 rounded-full bg-gradient-to-r ${feature.color} mb-3 flex-shrink-0`}
                  animate={index === currentFeature ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  {feature.icon}
                </m.div>
                <h3 className="text-white font-medium text-sm sm:text-base text-center leading-tight mb-2">
                  {feature.title}
                </h3>
                <p className="text-atp-white/60 text-xs sm:text-sm text-center leading-relaxed">
                  {feature.description}
                </p>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* CTA buttons */}
        <m.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Link href="/atp-membership" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-atp-gold to-yellow-500 text-atp-black hover:from-yellow-500 hover:to-atp-gold font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full shadow-2xl hover:shadow-atp-gold/25 transition-all duration-300 transform hover:scale-105"
            >
              {t('exploreAtpMembership')}
            </Button>
          </Link>
          <Link href="/about" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-atp-gold text-atp-gold hover:bg-atp-gold hover:text-atp-black font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full backdrop-blur-sm transition-all duration-300"
            >
              {t('learnOurStory')}
            </Button>
          </Link>
        </m.div>

        {/* Membership benefits ticker */}
        <m.div
          className="mt-12 sm:mt-16 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <m.div
            className="flex space-x-4 sm:space-x-8 text-atp-white/60 text-xs sm:text-sm whitespace-nowrap"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <span>{t('membershipBenefit1')}</span>
            <span>•</span>
            <span>{t('membershipBenefit2')}</span>
            <span>•</span>
            <span>{t('membershipBenefit3')}</span>
            <span>•</span>
            <span>{t('membershipBenefit4')}</span>
            <span>•</span>
            <span>{t('membershipBenefit5')}</span>
            <span>•</span>
          </m.div>
        </m.div>
      </m.div>

      {/* Scroll indicator */}
      <m.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <m.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="w-8 h-8 text-atp-gold" />
        </m.div>
      </m.div>
    </section>
  );
}
