/**
 * ATP Group Services - Award-Winning Animation Library
 * 
 * Reusable Framer Motion variants for consistent, delightful animations
 * across the entire e-commerce experience.
 * 
 * Design Philosophy:
 * - Luxury feel through smooth, deliberate motion
 * - Mobile-first performance (GPU-accelerated transforms only)
 * - Accessibility-aware with reduced motion support
 * - Stagger patterns for visual hierarchy
 */

import { Variants, Transition, TargetAndTransition } from 'framer-motion';

// ============================================
// EASING CURVES
// Award-winning motion design timing
// ============================================

export const easing = {
  // Smooth deceleration - elegant reveals
  smooth: [0.16, 1, 0.3, 1] as const,
  smoothIn: [0.7, 0, 0.84, 0] as const,

  // Spring-like bounce - playful interactions
  bounce: [0.34, 1.56, 0.64, 1] as const,
  bounceSoft: [0.22, 1.3, 0.36, 1] as const,

  // Physical spring - natural motion
  spring: [0.175, 0.885, 0.32, 1.275] as const,
  springHeavy: [0.68, -0.55, 0.265, 1.55] as const,

  // Elastic - attention-grabbing
  elastic: [0.68, -0.6, 0.32, 1.6] as const,

  // Cinematic - hero animations
  cinematic: [0.77, 0, 0.175, 1] as const,
  cinematicSlow: [0.645, 0.045, 0.355, 1] as const,

  // Expo - luxury feel
  expoOut: [0.19, 1, 0.22, 1] as const,
  luxury: [0.25, 0.46, 0.45, 0.94] as const,
} as const;

// ============================================
// TRANSITION PRESETS
// Reusable transition configurations
// ============================================

export const transitions = {
  fast: {
    duration: 0.15,
    ease: easing.smooth,
  },
  normal: {
    duration: 0.3,
    ease: easing.smooth,
  },
  slow: {
    duration: 0.5,
    ease: easing.smooth,
  },
  slower: {
    duration: 0.7,
    ease: easing.expoOut,
  },
  cinematic: {
    duration: 1.2,
    ease: easing.cinematic,
  },
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  springBouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
  springGentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 40,
  },
} as const;

// ============================================
// STAGGER CONFIGURATIONS
// For sequential element reveals
// ============================================

export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  dramatic: 0.2,
} as const;

// ============================================
// FADE VARIANTS
// Simple opacity transitions
// ============================================

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

export const fadeDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: transitions.fast,
  },
};

export const fadeLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    x: -15,
    transition: transitions.fast,
  },
};

export const fadeRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    x: 15,
    transition: transitions.fast,
  },
};

// ============================================
// SCALE VARIANTS
// Zoom in/out transitions
// ============================================

export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

export const scaleUpVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...transitions.slow,
      ease: easing.bounce,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: transitions.fast,
  },
};

export const popVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.springBouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: transitions.fast,
  },
};

// ============================================
// CONTAINER VARIANTS
// For staggered children animations
// ============================================

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: stagger.fast,
      staggerDirection: -1,
    },
  },
};

export const containerFastVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.fast,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const containerSlowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.slow,
      delayChildren: 0.2,
    },
  },
};

export const containerDramaticVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.dramatic,
      delayChildren: 0.3,
    },
  },
};

// ============================================
// ITEM VARIANTS
// Children of staggered containers
// ============================================

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
};

export const itemScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...transitions.slow,
      ease: easing.bounce,
    },
  },
};

export const itemSlideVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },
};

// ============================================
// HERO & CINEMATIC VARIANTS
// For dramatic page reveals
// ============================================

export const heroVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: easing.expoOut,
    },
  },
};

export const heroTextVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: easing.expoOut,
    },
  },
};

export const heroImageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
    filter: 'blur(20px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: easing.cinematic,
    },
  },
};

export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

// ============================================
// CARD VARIANTS
// For product cards and content cards
// ============================================

export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easing.smooth,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: transitions.normal,
  },
  tap: {
    scale: 0.98,
    transition: transitions.fast,
  },
};

export const cardImageVariants: Variants = {
  rest: {
    scale: 1,
    transition: transitions.slow,
  },
  hover: {
    scale: 1.05,
    transition: transitions.slow,
  },
};

// ============================================
// BUTTON VARIANTS
// For interactive elements
// ============================================

export const buttonVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const buttonLuxuryVariants: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 0 0 rgba(179, 145, 85, 0)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 20px 0 rgba(179, 145, 85, 0.3)',
    transition: transitions.normal,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// ============================================
// MODAL & OVERLAY VARIANTS
// For dialogs and popups
// ============================================

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.springGentle,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: transitions.fast,
  },
};

export const slideOverVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: transitions.normal,
  },
};

export const slideOverLeftVariants: Variants = {
  hidden: {
    x: '-100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions.springGentle,
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: transitions.normal,
  },
};

// ============================================
// MENU & DROPDOWN VARIANTS
// For navigation and dropdowns
// ============================================

export const menuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.fast,
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const menuItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.fast,
  },
};

// ============================================
// NOTIFICATION & TOAST VARIANTS
// For alerts and messages
// ============================================

export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.springBouncy,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: transitions.fast,
  },
};

export const notificationSlideVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: transitions.fast,
  },
};

// ============================================
// IMAGE REVEAL VARIANTS
// For progressive image loading
// ============================================

export const imageRevealVariants: Variants = {
  hidden: {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: easing.expoOut,
    },
  },
};

export const imageScaleRevealVariants: Variants = {
  hidden: {
    scale: 1.2,
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: easing.smooth,
    },
  },
};

// ============================================
// TEXT REVEAL VARIANTS
// For animated text reveals
// ============================================

export const textRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easing.smooth,
    },
  },
};

export const charRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easing.smooth,
    },
  },
};

export const wordRevealContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

// ============================================
// COUNTER ANIMATION VARIANTS
// For number counting effects
// ============================================

export const counterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easing.smooth,
    },
  },
};

// ============================================
// SCROLL-LINKED VARIANTS
// For viewport-triggered animations
// ============================================

export const scrollFadeVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 50,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
};

export const scrollScaleVariants: Variants = {
  offscreen: {
    opacity: 0,
    scale: 0.9,
    y: 30,
  },
  onscreen: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easing.bounce,
    },
  },
};

export const scrollSlideLeftVariants: Variants = {
  offscreen: {
    opacity: 0,
    x: 60,
  },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
};

export const scrollSlideRightVariants: Variants = {
  offscreen: {
    opacity: 0,
    x: -60,
  },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
};

// ============================================
// PARALLAX VARIANTS
// For depth effects
// ============================================

export const parallaxVariants = {
  slow: {
    y: [0, -50],
    transition: {
      duration: 1,
      ease: 'linear',
    },
  },
  medium: {
    y: [0, -100],
    transition: {
      duration: 1,
      ease: 'linear',
    },
  },
  fast: {
    y: [0, -150],
    transition: {
      duration: 1,
      ease: 'linear',
    },
  },
};

// ============================================
// UTILITY FUNCTIONS
// Helpers for dynamic animations
// ============================================

/**
 * Creates a staggered container variant with custom timing
 */
export const createStaggerContainer = (
  staggerDelay: number = 0.1,
  initialDelay: number = 0.1
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

/**
 * Creates a fade-up variant with custom distance
 */
export const createFadeUp = (distance: number = 20): Variants => ({
  hidden: {
    opacity: 0,
    y: distance,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
});

/**
 * Creates a delayed variant
 */
export const createDelayed = (
  variant: Variants,
  delay: number
): Variants => {
  const result: Variants = { ...variant };
  if (result.visible && typeof result.visible === 'object') {
    result.visible = {
      ...result.visible,
      transition: {
        ...(result.visible as TargetAndTransition).transition,
        delay,
      },
    };
  }
  return result;
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Returns static or animated variants based on motion preference
 */
export const getMotionSafeVariants = (variants: Variants): Variants => {
  if (prefersReducedMotion()) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0 } },
      exit: { opacity: 0, transition: { duration: 0 } },
    };
  }
  return variants;
};

// ============================================
// VIEWPORT ANIMATION OPTIONS
// For useInView hook
// ============================================

export const viewportOptions = {
  once: true,
  amount: 0.2,
};

export const viewportOptionsEager = {
  once: true,
  amount: 0.1,
};

export const viewportOptionsLazy = {
  once: true,
  amount: 0.4,
};

// ============================================
// WHILEINVIEW PRESETS
// Common whileInView configurations
// ============================================

export const whileInViewPresets = {
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: viewportOptions,
    transition: transitions.slow,
  },
  fadeScale: {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: viewportOptions,
    transition: transitions.slow,
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: viewportOptions,
    transition: transitions.slow,
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: viewportOptions,
    transition: transitions.slow,
  },
};

// ============================================
// ALIAS EXPORTS FOR COLLECTION HERO
// Mapping internal names to those requested by the new component
// ============================================

export const heroFadeUp = fadeUpVariants;
export const staggerSlow = containerSlowVariants;
export const heroViewport = viewportOptions;
export const getAccessibleVariants = getMotionSafeVariants;

export default {
  easing,
  transitions,
  stagger,
  fade: fadeVariants,
  fadeUp: fadeUpVariants,
  fadeDown: fadeDownVariants,
  fadeLeft: fadeLeftVariants,
  fadeRight: fadeRightVariants,
  scale: scaleVariants,
  scaleUp: scaleUpVariants,
  pop: popVariants,
  container: containerVariants,
  containerFast: containerFastVariants,
  containerSlow: containerSlowVariants,
  item: itemVariants,
  itemScale: itemScaleVariants,
  hero: heroVariants,
  heroText: heroTextVariants,
  heroImage: heroImageVariants,
  heroContainer: heroContainerVariants,
  card: cardVariants,
  cardImage: cardImageVariants,
  button: buttonVariants,
  buttonLuxury: buttonLuxuryVariants,
  overlay: overlayVariants,
  modal: modalVariants,
  slideOver: slideOverVariants,
  menu: menuVariants,
  menuItem: menuItemVariants,
  toast: toastVariants,
  notification: notificationSlideVariants,
  imageReveal: imageRevealVariants,
  imageScaleReveal: imageScaleRevealVariants,
  textReveal: textRevealVariants,
  charReveal: charRevealVariants,
  scrollFade: scrollFadeVariants,
  scrollScale: scrollScaleVariants,
  scrollSlideLeft: scrollSlideLeftVariants,
  scrollSlideRight: scrollSlideRightVariants,
  heroFadeUp,
  staggerSlow,
  heroViewport,
  getAccessibleVariants,
};
