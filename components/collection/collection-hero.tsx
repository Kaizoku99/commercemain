"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  heroFadeUp, 
  staggerSlow, 
  heroViewport, 
  getAccessibleVariants 
} from "@/lib/animations";

interface CollectionHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  image: {
    src: string;
    alt: string;
    mobileSrc?: string;
  };
  isRTL?: boolean;
}

export default function CollectionHero({
  title,
  subtitle,
  description,
  image,
  isRTL = false,
}: CollectionHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section 
      ref={ref}
      className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-atp-black"
      aria-label={title}
    >
      {/* Parallax Background */}
      <m.div 
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        {/* Mobile Image - Hidden on Desktop */}
        {image.mobileSrc && (
          <div className="block lg:hidden relative w-full h-full">
            <Image
              src={image.mobileSrc}
              alt={image.alt}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        )}
        
        {/* Desktop Image - Hidden on Mobile if mobileSrc exists */}
        <div className={cn(
          "relative w-full h-full",
          image.mobileSrc ? "hidden lg:block" : "block"
        )}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-atp-black/90 via-atp-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-atp-black/30 to-transparent" />
      </m.div>

      {/* Content Container */}
      <m.div 
        className={cn(
          "relative z-10 h-full container mx-auto px-4 flex flex-col justify-end pb-24 md:pb-32",
          isRTL ? "items-start text-right" : "items-start text-left"
        )}
        style={{ opacity }}
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={heroViewport}
      >
        <div className={cn(
          "max-w-4xl flex flex-col gap-4",
          isRTL ? "items-start text-right" : "items-start text-left"
        )}>
          {subtitle && (
            <m.span 
              className="text-atp-gold font-display font-medium tracking-wider uppercase text-sm md:text-base mb-2"
              variants={getAccessibleVariants(heroFadeUp, shouldReduceMotion)}
            >
              {subtitle}
            </m.span>
          )}
          
          <m.h1 
            className="font-display text-display md:text-hero text-atp-white leading-tight"
            variants={getAccessibleVariants(heroFadeUp, shouldReduceMotion)}
          >
            {title}
          </m.h1>

          {description && (
            <m.p 
              className="text-atp-white/80 text-lg md:text-xl lg:text-2xl mt-4 max-w-2xl leading-relaxed font-light"
              variants={getAccessibleVariants(heroFadeUp, shouldReduceMotion)}
            >
              {description}
            </m.p>
          )}
        </div>
      </m.div>
    </section>
  );
}
