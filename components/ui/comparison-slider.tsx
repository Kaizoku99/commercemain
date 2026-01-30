'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { m, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { transitions } from '@/lib/animations/variants';

export interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  /** Initial position 0-100, default 50 */
  initialPosition?: number;
}

/**
 * Before/After comparison slider with drag interaction
 * Supports RTL layout and reduced motion
 */
export function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  className,
  initialPosition = 50,
}: ComparisonSliderProps) {
  const t = useTranslations('comparison');
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  
  // Detect RTL
  const [isRTL, setIsRTL] = useState(false);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsRTL(document.documentElement.dir === 'rtl');
    }
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let newPosition = ((clientX - rect.left) / rect.width) * 100;
    
    // In RTL, invert the position
    if (isRTL) {
      newPosition = 100 - newPosition;
    }
    
    // Clamp between 0 and 100
    newPosition = Math.max(0, Math.min(100, newPosition));
    setPosition(newPosition);
  }, [isRTL]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse events for dragging outside container
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Calculate clip path based on position and RTL
  const clipPath = isRTL
    ? `inset(0 0 0 ${position}%)`
    : `inset(0 ${100 - position}% 0 0)`;

  // Handle position for RTL
  const handlePosition = isRTL ? `${100 - position}%` : `${position}%`;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full aspect-[4/3] overflow-hidden rounded-2xl cursor-ew-resize select-none',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Before image (full background) */}
      <div className="absolute inset-0">
        <Image
          src={beforeImage}
          alt={beforeAlt || t('before')}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* After image (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath }}
      >
        <Image
          src={afterImage}
          alt={afterAlt || t('after')}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Divider line */}
      <m.div
        className="absolute top-0 bottom-0 w-1 bg-atp-gold shadow-gold-lg z-10"
        style={{ left: handlePosition, x: '-50%' }}
        animate={shouldReduceMotion ? {} : { x: '-50%' }}
        transition={shouldReduceMotion ? { duration: 0 } : transitions.spring}
      />

      {/* Drag handle */}
      <m.div
        className={cn(
          'absolute top-1/2 z-20 flex items-center justify-center',
          'w-12 h-12 -translate-y-1/2 rounded-full',
          'glass-gold border-2 border-atp-gold shadow-gold-lg',
          'cursor-grab active:cursor-grabbing',
          isDragging && 'scale-110'
        )}
        style={{ left: handlePosition, x: '-50%' }}
        onMouseDown={handleMouseDown}
        whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        transition={shouldReduceMotion ? { duration: 0 } : transitions.spring}
      >
        {/* Grip lines */}
        <div className="flex gap-1">
          <div className="w-0.5 h-5 bg-atp-gold/80 rounded-full" />
          <div className="w-0.5 h-5 bg-atp-gold/80 rounded-full" />
          <div className="w-0.5 h-5 bg-atp-gold/80 rounded-full" />
        </div>
      </m.div>

      {/* Labels */}
      <div
        className={cn(
          'absolute top-4 px-3 py-1.5 glass rounded-full text-sm font-medium text-atp-white',
          isRTL ? 'right-4' : 'left-4'
        )}
      >
        {t('before')}
      </div>
      <div
        className={cn(
          'absolute top-4 px-3 py-1.5 glass rounded-full text-sm font-medium text-atp-white',
          isRTL ? 'left-4' : 'right-4'
        )}
      >
        {t('after')}
      </div>
    </div>
  );
}

export default ComparisonSlider;
