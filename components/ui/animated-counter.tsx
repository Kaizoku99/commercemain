'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { easing } from '@/lib/animations/variants';

interface AnimatedCounterProps {
  /** The value to count up to */
  value: number;
  /** Text to prepend */
  prefix?: string;
  /** Text to append */
  suffix?: string;
  /** Duration in seconds */
  duration?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Formatting locales (e.g., 'en-US', 'ar-AE') */
  locale?: string;
  /** Class name */
  className?: string;
  /** Delay before starting animation */
  delay?: number;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 2,
  decimals = 0,
  locale = 'en-US',
  className,
  delay = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
    duration: duration * 1000,
  });
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(prefix + '0' + suffix);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isInView, value, motionValue, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      const formattedNumber = Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(latest);
      
      if (ref.current) {
        ref.current.textContent = `${prefix}${formattedNumber}${suffix}`;
      }
    });

    return unsubscribe;
  }, [springValue, decimals, locale, prefix, suffix]);

  // Handle reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      motionValue.set(value);
      // Force immediate update
      const formattedNumber = Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
      if (ref.current) {
        ref.current.textContent = `${prefix}${formattedNumber}${suffix}`;
      }
    }
  }, [value, motionValue, locale, decimals, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={cn('font-variant-numeric tabular-nums', className)}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {prefix}0{suffix}
    </span>
  );
}
