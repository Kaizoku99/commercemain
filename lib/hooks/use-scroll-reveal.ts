/**
 * useScrollReveal Hook
 * 
 * Intersection Observer-based scroll reveal animation hook
 * with configurable thresholds and animation variants.
 * 
 * Optimized for performance with lazy loading and
 * reduced motion support.
 */

'use client';

import { useRef, useState, useEffect, RefObject } from 'react';
import { useInView, useAnimation, Variants } from 'framer-motion';

interface ScrollRevealConfig {
  /** Threshold for intersection (0-1). Default: 0.2 */
  threshold?: number;
  /** Whether to only animate once. Default: true */
  once?: boolean;
  /** Delay before animation starts (ms). Default: 0 */
  delay?: number;
  /** Root margin for early/late trigger. Default: '0px' */
  rootMargin?: string;
  /** Custom animation variants */
  variants?: Variants;
  /** Initial animation state. Default: 'hidden' */
  initial?: string;
  /** Visible animation state. Default: 'visible' */
  animate?: string;
}

interface ScrollRevealReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Whether element is in view */
  isInView: boolean;
  /** Animation controls for manual control */
  controls: ReturnType<typeof useAnimation>;
  /** Props to spread on motion component */
  motionProps: {
    ref: RefObject<HTMLElement | null>;
    initial: string;
    animate: ReturnType<typeof useAnimation>;
    variants?: Variants;
  };
}

// Default reveal variants
const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function useScrollReveal(config: ScrollRevealConfig = {}): ScrollRevealReturn {
  const {
    threshold = 0.2,
    once = true,
    delay = 0,
    rootMargin = '0px',
    variants = defaultVariants,
    initial = 'hidden',
    animate = 'visible',
  } = config;

  const ref = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  // Use Framer Motion's useInView hook
  const isInView = useInView(ref, {
    amount: threshold,
    once,
    margin: rootMargin as `${number}px ${number}px ${number}px ${number}px`,
  });

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Trigger animation when in view
  useEffect(() => {
    if (prefersReducedMotion) {
      // Immediately show without animation
      controls.set(animate);
      return;
    }

    if (isInView && (!hasAnimated || !once)) {
      const timeout = setTimeout(() => {
        controls.start(animate);
        setHasAnimated(true);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (!isInView && !once && hasAnimated) {
      controls.start(initial);
    }
    
    return undefined;
  }, [isInView, controls, animate, initial, delay, once, hasAnimated, prefersReducedMotion]);

  return {
    ref,
    isInView,
    controls,
    motionProps: {
      ref,
      initial,
      animate: controls,
      variants,
    },
  };
}

/**
 * Preset: Fade up on scroll
 */
export function useScrollFadeUp(delay: number = 0) {
  return useScrollReveal({
    delay,
    variants: {
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      },
    },
  });
}

/**
 * Preset: Scale up on scroll
 */
export function useScrollScaleUp(delay: number = 0) {
  return useScrollReveal({
    delay,
    variants: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
      },
    },
  });
}

/**
 * Preset: Slide in from left
 */
export function useScrollSlideLeft(delay: number = 0) {
  return useScrollReveal({
    delay,
    variants: {
      hidden: { opacity: 0, x: -50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      },
    },
  });
}

/**
 * Preset: Slide in from right
 */
export function useScrollSlideRight(delay: number = 0) {
  return useScrollReveal({
    delay,
    variants: {
      hidden: { opacity: 0, x: 50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      },
    },
  });
}

/**
 * Hook for staggered children reveal
 */
export function useScrollStagger(
  itemCount: number,
  staggerDelay: number = 0.1
) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return {
    containerRef,
    isInView,
    containerProps: {
      ref: containerRef,
      initial: 'hidden' as const,
      animate: isInView ? 'visible' as const : 'hidden' as const,
      variants: containerVariants,
    },
    itemVariants,
  };
}

export default useScrollReveal;
