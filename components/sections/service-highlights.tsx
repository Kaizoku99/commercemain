"use client";

import { m, useInView, useMotionValue, useTransform, Variant } from "framer-motion";
import { useRef, useState } from "react";
import React from "react";
import {
  Leaf,
  Heart,
  Dumbbell,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Timer,
  Users,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ServiceHighlight {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  image: string;
  link: string;
  gradient: string;
  badge?: string;
  stats: {
    duration: string;
    sessions: string;
    rating: number;
  };
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
}

export default function ServiceHighlights() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeService, setActiveService] = useState(0);
  const t = useTranslations('services');

  const serviceHighlights: ServiceHighlight[] = [
    {
      id: "supplements",
      icon: Leaf,
      title: t('supplements.title'),
      subtitle: t('supplements.subtitle'),
      description: t('supplements.description'),
      benefits: [
        t('supplements.benefit1'),
        t('supplements.benefit2'),
        t('supplements.benefit3'),
        t('supplements.benefit4'),
        t('supplements.benefit5'),
      ],
      image: "/vitamin-c-supplement.png",
      link: "/skincare-supplements",
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      badge: t('supplements.badge'),
      stats: {
        duration: t('supplements.duration'),
        sessions: t('supplements.sessions'),
        rating: 4.9,
      },
      testimonial: {
        text: t('supplements.testimonialText'),
        author: t('supplements.testimonialAuthor'),
        role: t('supplements.testimonialRole'),
      },
    },
    {
      id: "beauty",
      icon: Heart,
      title: t('beauty.title'),
      subtitle: t('beauty.subtitle'),
      description: t('beauty.description'),
      benefits: [
        t('beauty.benefit1'),
        t('beauty.benefit2'),
        t('beauty.benefit3'),
        t('beauty.benefit4'),
        t('beauty.benefit5'),
      ],
      image: "/anti-aging-serum.png",
      link: "/skincare-supplements",
      gradient: "from-rose-400 via-pink-500 to-purple-600",
      badge: t('beauty.badge'),
      stats: {
        duration: t('beauty.duration'),
        sessions: t('beauty.sessions'),
        rating: 4.8,
      },
      testimonial: {
        text: t('beauty.testimonialText'),
        author: t('beauty.testimonialAuthor'),
        role: t('beauty.testimonialRole'),
      },
    },
    {
      id: "ems",
      icon: Zap,
      title: t('ems.title'),
      subtitle: t('ems.subtitle'),
      description: t('ems.description'),
      benefits: [
        t('ems.benefit1'),
        t('ems.benefit2'),
        t('ems.benefit3'),
        t('ems.benefit4'),
        t('ems.benefit5'),
      ],
      image: "/ems-training-facility.png",
      link: "/ems",
      gradient: "from-orange-400 via-red-500 to-pink-600",
      badge: t('ems.badge'),
      stats: {
        duration: t('ems.duration'),
        sessions: t('ems.sessions'),
        rating: 4.7,
      },
      testimonial: {
        text: t('ems.testimonialText'),
        author: t('ems.testimonialAuthor'),
        role: t('ems.testimonialRole'),
      },
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Safe accessor for current service
  const currentService = serviceHighlights[activeService];

  if (!currentService) {
    return null; // Safety fallback
  }

  return (
    <section
      ref={ref}
      className="py-32 bg-gradient-to-b from-atp-charcoal via-atp-black to-atp-charcoal relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-atp-gold/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-1/4 w-64 h-64 bg-emerald-500/3 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <m.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <m.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-atp-gold/20 to-purple-500/20 backdrop-blur-sm rounded-full px-8 py-4 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-5 h-5 text-atp-gold" />
            <span className="text-atp-gold font-semibold">
              {t('premiumServices')}
            </span>
            <Star className="w-5 h-5 text-atp-gold" />
          </m.div>

          <h2 className="text-5xl md:text-7xl font-light text-white mb-8 leading-tight">
            {t('yourComplete')}
            <br />
            <span className="bg-gradient-to-r from-atp-gold via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {t('wellnessJourney')}
            </span>
          </h2>

          <p className="text-xl text-atp-white/70 max-w-4xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </m.div>

        {/* Service navigation tabs */}
        <m.div
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {serviceHighlights.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <m.button
                key={service.id}
                className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base ${activeService === index
                    ? `bg-gradient-to-r ${service.gradient} text-white shadow-lg`
                    : "bg-white/5 text-atp-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                onClick={() => setActiveService(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center">
                  <IconComponent className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <span className="font-medium hidden sm:inline">{service.title}</span>
                <span className="font-medium sm:hidden text-xs">{service.title.split(' ')[0]}</span>
              </m.button>
            )
          })}
        </m.div>

        {/* Active service showcase */}
        <m.div
          key={activeService}
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Service content */}
            <div className="space-y-8">
              <div>
                {currentService.badge && (
                  <Badge
                    className={`bg-gradient-to-r ${currentService.gradient} text-white mb-4`}
                  >
                    {currentService.badge}
                  </Badge>
                )}

                <h3 className="text-4xl md:text-5xl font-light text-white mb-4">
                  {currentService.title}
                </h3>

                <p className="text-xl text-atp-gold font-medium mb-6">
                  {currentService.subtitle}
                </p>

                <p className="text-atp-white/80 text-lg leading-relaxed mb-8">
                  {currentService.description}
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white mb-4">
                  {t('whatYouGet')}
                </h4>
                {currentService.benefits.map(
                  (benefit, index) => (
                    <m.div
                      key={index}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-atp-white/80">{benefit}</span>
                    </m.div>
                  )
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center sm:text-center">
                  <div className="flex items-center justify-center sm:justify-center space-x-3 sm:space-x-0 sm:flex-col">
                    <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-atp-gold flex-shrink-0 sm:mx-auto sm:mb-2" />
                    <div className="flex flex-col sm:text-center">
                      <div className="text-lg sm:text-2xl font-bold text-white">
                        {currentService.stats.duration}
                      </div>
                      <div className="text-atp-white/60 text-sm">{t('duration')}</div>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-center">
                  <div className="flex items-center justify-center sm:justify-center space-x-3 sm:space-x-0 sm:flex-col">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-atp-gold flex-shrink-0 sm:mx-auto sm:mb-2" />
                    <div className="flex flex-col sm:text-center">
                      <div className="text-lg sm:text-2xl font-bold text-white">
                        {currentService.stats.sessions}
                      </div>
                      <div className="text-atp-white/60 text-sm">{t('frequency')}</div>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-center">
                  <div className="flex items-center justify-center sm:justify-center space-x-3 sm:space-x-0 sm:flex-col">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-atp-gold flex-shrink-0 sm:mx-auto sm:mb-2" />
                    <div className="flex flex-col sm:text-center">
                      <div className="text-lg sm:text-2xl font-bold text-white">
                        {currentService.stats.rating}
                      </div>
                      <div className="text-atp-white/60 text-sm">{t('rating')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link href={currentService.link}>
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${currentService.gradient} text-white hover:shadow-lg hover:shadow-current/25 transition-all duration-300 group`}
                >
                  {t('explore')} {currentService.title}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Service image and testimonial */}
            <div className="space-y-8">
              <m.div
                className="relative h-96 rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={currentService.image}
                  alt={currentService.title}
                  fill
                  className="object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${currentService.gradient} opacity-20`}
                />
              </m.div>

              {/* Testimonial */}
              {currentService.testimonial && (
                <m.div
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-atp-gold to-yellow-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-atp-white/90 italic mb-3">
                        "{currentService.testimonial.text}"
                      </p>
                      <div>
                        <div className="text-white font-semibold">
                          {currentService.testimonial.author}
                        </div>
                        <div className="text-atp-white/60 text-sm">
                          {currentService.testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </m.div>
              )}
            </div>
          </div>
        </m.div>

        {/* All services grid */}
        <m.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {serviceHighlights.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <m.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
                onClick={() => setActiveService(index)}
              >
                <Card
                  className={`bg-white/5 backdrop-blur-sm border transition-all duration-300 overflow-hidden ${activeService === index
                      ? "border-atp-gold/50 shadow-lg shadow-atp-gold/10"
                      : "border-white/10 hover:border-white/20"
                    }`}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        <IconComponent className="w-6 h-6 sm:w-10 sm:h-10 flex-shrink-0" />
                      </div>
                    </div>
                    <h4 className="text-white font-semibold mb-2 text-sm sm:text-base leading-tight">
                      {service.title}
                    </h4>
                    <p className="text-atp-white/60 text-xs sm:text-sm leading-relaxed">
                      {service.subtitle}
                    </p>
                  </CardContent>
                </Card>
              </m.div>
            )
          })}
        </m.div>
      </div>
    </section>
  );
}
