"use client";

import { useEffect, useRef } from "react";
import {
  m,
  useInView,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  counterVariants,
  staggerContainer,
  staggerItem,
  defaultViewport,
  getRTLStaggerContainer,
  luxuryEase,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

interface CollectionStatsProps {
  stats: Stat[];
  isRTL?: boolean;
}

const StatItem = ({
  stat,
  isInView,
  shouldReduceMotion,
}: {
  stat: Stat;
  isInView: boolean;
  shouldReduceMotion: boolean | null;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      count.set(stat.value);
      return;
    }

    if (isInView && !hasAnimated.current) {
      const controls = animate(count, stat.value, {
        duration: 2.5,
        ease: luxuryEase,
      });
      hasAnimated.current = true;
      return controls.stop;
    }
    
    return undefined;
  }, [isInView, shouldReduceMotion, stat.value, count]);

  return (
    <m.div
      variants={staggerItem}
      className="flex flex-col items-center justify-center text-center p-6"
    >
      <m.div 
        variants={counterVariants}
        className="flex items-baseline justify-center mb-2"
      >
        <span className="text-4xl md:text-5xl font-bold text-atp-gold font-sans tracking-tight">
          <m.span>{rounded}</m.span>
          {stat.suffix && <span>{stat.suffix}</span>}
        </span>
      </m.div>
      <span className="text-sm md:text-base font-medium text-atp-black uppercase tracking-widest">
        {stat.label}
      </span>
    </m.div>
  );
};

export default function CollectionStats({ stats, isRTL = false }: CollectionStatsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, defaultViewport);
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = isRTL ? getRTLStaggerContainer(true) : staggerContainer;

  return (
    <div className="w-full bg-atp-off-white py-12 md:py-16">
      <div className="container-premium mx-auto px-4">
        <m.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className={cn(
            "grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12",
            isRTL && "rtl"
          )}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {stats.map((stat, index) => (
            <StatItem
              key={`${stat.label}-${index}`}
              stat={stat}
              isInView={isInView}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </m.div>
      </div>
    </div>
  );
}
