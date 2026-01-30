/**
 * useParallaxLayer Hook
 * 
 * Creates scroll-linked parallax effects for elements at different
 * depths, giving a sense of 3D space and visual hierarchy.
 * 
 * GPU-accelerated with transform: translateY() for 60fps performance.
 * 
 * IMPORTANT: Fixed for Next.js SSR/hydration compatibility.
 * The useScroll hook requires the ref to be hydrated (attached to DOM)
 * before it can track scroll progress. We handle this by:
 * 1. Not passing target until ref is hydrated
 * 2. Using state to track hydration
 * 
 * @see https://motion.dev/troubleshooting/use-scroll-ref
 */

'use client';

import { useRef, useEffect, useState, RefObject } from 'react';
import { useScroll, useTransform, useSpring, MotionValue, motionValue } from 'framer-motion';

interface ParallaxConfig {
  /** Speed multiplier. Negative = move opposite to scroll. Default: 0.5 */
  speed?: number;
  /** Direction of parallax movement. Default: 'y' */
  direction?: 'x' | 'y';
  /** Spring configuration for smooth movement */
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  /** Whether to use spring physics. Default: true */
  smooth?: boolean;
  /** Offset range for scroll progress. Default: ["start end", "end start"] */
  offset?: [string, string];
}

interface ParallaxReturn {
  /** Ref to attach to the container/section */
  containerRef: RefObject<HTMLElement | null>;
  /** Transform value for the parallax element */
  transform: MotionValue<number>;
  /** Raw scroll progress (0-1) within the container */
  progress: MotionValue<number>;
  /** Style object to spread on motion element */
  style: {
    y?: MotionValue<number>;
    x?: MotionValue<number>;
  };
  /** Whether the hook is ready (ref is hydrated) */
  isReady: boolean;
}

// Create static fallback values for SSR
const staticProgress = motionValue(0);
const staticTransform = motionValue(0);

export function useParallaxLayer(config: ParallaxConfig = {}): ParallaxReturn {
  const {
    speed = 0.5,
    direction = 'y',
    spring: springConfig = { stiffness: 100, damping: 30, mass: 0.5 },
    smooth = true,
    offset = ['start end', 'end start'],
  } = config;

  const containerRef = useRef<HTMLElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Track hydration state - ref becomes available after first render
  useEffect(() => {
    // Only set hydrated if the ref is actually attached to a DOM element
    if (containerRef.current) {
      setIsHydrated(true);
    }
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Track scroll progress within the container
  // IMPORTANT: Only pass target when ref is hydrated to avoid Motion error
  // @see https://motion.dev/troubleshooting/use-scroll-ref
  const { scrollYProgress } = useScroll({
    // Only pass target when hydrated, otherwise track window scroll
    target: isHydrated ? containerRef : undefined,
    offset: offset as ['start end', 'end start'],
  });

  // Calculate the parallax range based on speed
  // speed: 0.5 = moves 50% of scroll distance
  // speed: -0.5 = moves opposite direction at 50%
  const range = speed * 100;
  
  // Transform scroll progress to pixel offset
  const rawTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [-range, range]
  );

  // Apply spring smoothing for natural movement
  const smoothTransform = useSpring(rawTransform, springConfig);
  
  // Use smooth or raw based on config and motion preference
  const transform = prefersReducedMotion
    ? rawTransform // No animation if reduced motion
    : smooth
    ? smoothTransform
    : rawTransform;

  const style = direction === 'y'
    ? { y: transform }
    : { x: transform };

  return {
    containerRef,
    transform,
    progress: scrollYProgress,
    style,
    isReady: isHydrated,
  };
}

/**
 * Preset: Slow background layer (moves slower than scroll)
 */
export function useParallaxBackground() {
  return useParallaxLayer({
    speed: 0.3,
    smooth: true,
    spring: { stiffness: 50, damping: 30 },
  });
}

/**
 * Preset: Foreground layer (moves faster, opposite direction)
 */
export function useParallaxForeground() {
  return useParallaxLayer({
    speed: -0.2,
    smooth: true,
    spring: { stiffness: 100, damping: 25 },
  });
}

/**
 * Preset: Hero image parallax (subtle, slow)
 */
export function useParallaxHero() {
  return useParallaxLayer({
    speed: 0.4,
    smooth: true,
    spring: { stiffness: 80, damping: 40 },
  });
}

/**
 * Hook for multi-layer parallax scene
 * Returns multiple layers with different speeds
 */
export function useParallaxScene() {
  const background = useParallaxLayer({ speed: 0.2 });
  const midground = useParallaxLayer({ speed: 0.4 });
  const foreground = useParallaxLayer({ speed: 0.6 });

  return {
    background,
    midground,
    foreground,
  };
}

/**
 * Simple scroll-linked opacity fade
 * Fixed for SSR hydration
 */
export function useScrollOpacity(
  fadeStart: number = 0,
  fadeEnd: number = 0.5
) {
  const containerRef = useRef<HTMLElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setIsHydrated(true);
    }
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: isHydrated ? containerRef : undefined,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(
    scrollYProgress,
    [fadeStart, fadeEnd],
    [1, 0]
  );

  return {
    containerRef,
    opacity,
    progress: scrollYProgress,
    isReady: isHydrated,
  };
}

/**
 * Scroll-linked scale effect
 * Fixed for SSR hydration
 */
export function useScrollScale(
  scaleStart: number = 1,
  scaleEnd: number = 0.9
) {
  const containerRef = useRef<HTMLElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setIsHydrated(true);
    }
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: isHydrated ? containerRef : undefined,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [scaleStart, scaleEnd]
  );

  const smoothScale = useSpring(scale, {
    stiffness: 100,
    damping: 30,
  });

  return {
    containerRef,
    scale: smoothScale,
    progress: scrollYProgress,
    isReady: isHydrated,
  };
}

/**
 * Scroll-linked rotation effect
 * Fixed for SSR hydration
 */
export function useScrollRotate(
  rotateStart: number = 0,
  rotateEnd: number = 10
) {
  const containerRef = useRef<HTMLElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setIsHydrated(true);
    }
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: isHydrated ? containerRef : undefined,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [rotateStart, rotateEnd]
  );

  const smoothRotate = useSpring(rotate, {
    stiffness: 100,
    damping: 30,
  });

  return {
    containerRef,
    rotate: smoothRotate,
    progress: scrollYProgress,
    isReady: isHydrated,
  };
}

export default useParallaxLayer;
