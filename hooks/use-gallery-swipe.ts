"use client";

/**
 * useGallerySwipe Hook
 * 
 * Mobile swipe gesture handling for the product gallery.
 * Supports RTL mode with direction inversion.
 * 
 * Part of ATP Group Services luxury e-commerce redesign.
 */

import { useState, useCallback } from "react";
import type { PanInfo } from "framer-motion";

interface UseGallerySwipeOptions {
  totalImages: number;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  isRTL?: boolean;
  swipeThreshold?: number;
  velocityThreshold?: number;
}

interface UseGallerySwipeReturn {
  dragProps: {
    drag: "x";
    dragConstraints: { left: number; right: number };
    dragElastic: number;
    onDragStart: () => void;
    onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  };
  isDragging: boolean;
}

export function useGallerySwipe({
  totalImages,
  currentIndex,
  onIndexChange,
  isRTL = false,
  swipeThreshold = 50,
  velocityThreshold = 500,
}: UseGallerySwipeOptions): UseGallerySwipeReturn {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      
      const velocity = info.velocity.x;
      const offset = info.offset.x;

      // Don't trigger if the swipe was too small
      if (Math.abs(offset) < swipeThreshold && Math.abs(velocity) < velocityThreshold) {
        return;
      }

      // Determine direction based on velocity and offset
      // Positive offset = swiped right, Negative offset = swiped left
      const swipedRight = offset > 0 || velocity > velocityThreshold;
      const swipedLeft = offset < 0 || velocity < -velocityThreshold;

      let newIndex = currentIndex;

      if (swipedRight) {
        // Swiped right: In LTR, go to previous. In RTL, go to next.
        newIndex = isRTL ? currentIndex + 1 : currentIndex - 1;
      } else if (swipedLeft) {
        // Swiped left: In LTR, go to next. In RTL, go to previous.
        newIndex = isRTL ? currentIndex - 1 : currentIndex + 1;
      }

      // Handle looping
      if (newIndex < 0) {
        newIndex = totalImages - 1;
      } else if (newIndex >= totalImages) {
        newIndex = 0;
      }

      if (newIndex !== currentIndex) {
        onIndexChange(newIndex);
      }
    },
    [currentIndex, totalImages, onIndexChange, isRTL, swipeThreshold, velocityThreshold]
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const dragProps = {
    drag: "x" as const,
    dragConstraints: { left: 0, right: 0 },
    dragElastic: 0.2,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  };

  return { dragProps, isDragging };
}
