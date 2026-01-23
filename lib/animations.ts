/**
 * ATP Group Services - Centralized Animation System
 * 
 * Luxury-refined animation presets for Framer Motion.
 * All animations are designed to feel premium, subtle, and elegant.
 * Includes reduced motion support for accessibility.
 */

import type { Variants, Transition } from "framer-motion";

// ============================================
// EASING CURVES
// ============================================

/**
 * Luxury easing curve - smooth and refined
 * Based on easeOutQuad for elegant deceleration
 */
export const luxuryEase = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Expo easing - dramatic but controlled
 * For hero animations and major transitions
 */
export const expoEase = [0.19, 1, 0.22, 1] as const;

/**
 * Soft spring - natural, organic feel
 */
export const softSpring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 0.5,
};

/**
 * Gentle spring - very subtle bounce
 */
export const gentleSpring = {
  type: "spring" as const,
  stiffness: 80,
  damping: 20,
  mass: 0.8,
};

// ============================================
// DURATION PRESETS
// ============================================

export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
  hero: 1.0,
} as const;

// ============================================
// BASE TRANSITIONS
// ============================================

export const luxuryTransition: Transition = {
  duration: durations.normal,
  ease: luxuryEase,
};

export const heroTransition: Transition = {
  duration: durations.hero,
  ease: expoEase,
};

// ============================================
// FADE VARIANTS
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: luxuryTransition,
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast, ease: luxuryEase },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: luxuryTransition,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: durations.fast, ease: luxuryEase },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: luxuryTransition,
  },
};

// ============================================
// SLIDE VARIANTS
// ============================================

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: luxuryEase },
  },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: luxuryEase },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: luxuryTransition,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: luxuryTransition,
  },
};

// ============================================
// SCALE VARIANTS
// ============================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...luxuryTransition, ...softSpring },
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: durations.slow, ease: luxuryEase },
  },
};

// ============================================
// STAGGER CONTAINERS
// ============================================

/**
 * Container for staggering child animations
 * Use with child elements that have their own variants
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Faster stagger for product grids
 */
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

/**
 * Slower stagger for hero sections
 */
export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * Stagger item - use as child of stagger container
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: luxuryTransition,
  },
};

// ============================================
// HERO ANIMATIONS
// ============================================

export const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: heroTransition,
  },
};

export const heroScale: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.hero, ease: expoEase },
  },
};

export const heroImageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: expoEase },
  },
};

// ============================================
// PRODUCT CARD ANIMATIONS
// ============================================

export const productCardHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: durations.normal, ease: luxuryEase },
  },
};

export const productImageHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: durations.slow, ease: luxuryEase },
  },
};

export const productOverlay = {
  rest: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { duration: durations.normal, ease: luxuryEase },
  },
};

export const quickAddButton: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.fast, ease: luxuryEase },
  },
};

// ============================================
// COUNTER ANIMATION (for stats)
// ============================================

export const counterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: luxuryEase },
  },
};

// ============================================
// REDUCED MOTION VARIANTS
// ============================================

/**
 * Reduced motion version - only opacity changes
 * Use when shouldReduceMotion is true
 */
export const reducedMotionFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast },
  },
};

/**
 * Get appropriate variants based on reduced motion preference
 */
export function getAccessibleVariants(
  fullMotionVariants: Variants,
  shouldReduceMotion: boolean | null
): Variants {
  if (shouldReduceMotion) {
    return reducedMotionFade;
  }
  return fullMotionVariants;
}

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

export const scrollReveal: Variants = {
  offscreen: {
    opacity: 0,
    y: 30,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: luxuryEase,
    },
  },
};

export const scrollRevealScale: Variants = {
  offscreen: {
    opacity: 0,
    scale: 0.95,
  },
  onscreen: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: luxuryEase,
    },
  },
};

// ============================================
// VIEWPORT SETTINGS
// ============================================

export const defaultViewport = {
  once: true,
  amount: 0.2,
};

export const heroViewport = {
  once: true,
  amount: 0.3,
};

// ============================================
// RTL-AWARE ANIMATIONS
// ============================================

/**
 * Get slide direction based on RTL
 */
export function getSlideVariants(isRTL: boolean): Variants {
  const direction = isRTL ? -1 : 1;
  return {
    hidden: { opacity: 0, x: 24 * direction },
    visible: {
      opacity: 1,
      x: 0,
      transition: luxuryTransition,
    },
  };
}

/**
 * Get RTL-aware stagger container
 * For grids that need to animate from the correct side
 */
export function getRTLStaggerContainer(isRTL: boolean): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        staggerDirection: isRTL ? -1 : 1,
      },
    },
  };
}
