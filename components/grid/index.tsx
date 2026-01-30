"use client";

import type React from "react";
import clsx from "clsx";
import { m, HTMLMotionProps, useReducedMotion } from "framer-motion";
import { staggerFast, staggerItem, getAccessibleVariants } from "@/lib/animations";
import { useAnimateOnMount } from "@/hooks/use-animate-on-mount";

interface GridProps extends HTMLMotionProps<"ul"> {
  /** Grid variant style */
  variant?: "default" | "luxury" | "collection";
  /** Number of columns on mobile (1 for single column, 2 for two columns) */
  mobileColumns?: 1 | 2;
  /** RTL layout support */
  isRTL?: boolean;
}

function Grid(props: GridProps) {
  const {
    variant = "luxury",
    mobileColumns = 2,
    isRTL = false,
    ...restProps
  } = props;

  const shouldReduceMotion = useReducedMotion();
  // Fix: Use animate instead of whileInView to trigger on soft navigation
  // This fixes the issue where products don't show on first mobile navigation
  const isVisible = useAnimateOnMount(50);

  return (
    <m.ul
      {...restProps}
      className={clsx(
        "grid gap-4 md:gap-6",
        {
          // Single column mobile (luxury/collection default)
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4":
            (variant === "luxury" || variant === "collection") && mobileColumns === 1,
          // Two column mobile option
          "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4":
            (variant === "luxury" || variant === "collection") && mobileColumns === 2,
          // Default variant
          "grid-flow-row gap-4": variant === "default",
        },
        props.className
      )}
      dir={isRTL ? "rtl" : "ltr"}
      variants={staggerFast}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {props.children}
    </m.ul>
  );
}

interface GridItemProps extends HTMLMotionProps<"li"> {
  /** Item index for staggered animation delay */
  index?: number;
  /** Priority item (first 4) - gets reduced animation delay */
  priority?: boolean;
}

function GridItem(props: GridItemProps) {
  const { index = 0, priority = false, ...restProps } = props;
  const shouldReduceMotion = useReducedMotion();

  // Use simpler animation for reduced motion preference
  const itemVariants = getAccessibleVariants(staggerItem, shouldReduceMotion);

  return (
    <m.li
      {...restProps}
      className={clsx(
        "group relative overflow-hidden transition-colors duration-300",
        props.className
      )}
      variants={itemVariants}
    // Removed excessive hover animations - let individual cards handle their own
    >
      {props.children}
    </m.li>
  );
}

Grid.Item = GridItem;

export { Grid, GridItem };
export default Grid;
