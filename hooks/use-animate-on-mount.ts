"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook to trigger animations on component mount/navigation.
 * 
 * This fixes the Framer Motion whileInView issue where animations
 * don't trigger on soft navigation (client-side routing) in Next.js.
 * 
 * The Intersection Observer used by whileInView doesn't detect 
 * elements that are already in view when the component mounts.
 * 
 * @param delay - Optional delay in ms before triggering visible state
 * @returns isVisible - Whether the animation should be in "visible" state
 */
export function useAnimateOnMount(delay: number = 0): boolean {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset visibility on route change
    setIsVisible(false);
    
    // Small delay to allow the component to render first
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [pathname, delay]);

  return isVisible;
}

/**
 * Hook that returns animation control state based on pathname.
 * Use this for container animations that should re-trigger on navigation.
 * 
 * @returns animationKey - A key that changes on navigation to force re-mount
 */
export function useAnimationKey(): string {
  const pathname = usePathname();
  return pathname;
}
