'use client';

import * as React from 'react';
import { m, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { imageRevealVariants, imageScaleRevealVariants } from '@/lib/animations/variants';
import { useParallaxLayer } from '@/lib/hooks/use-parallax-layer';

interface ImageRevealProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  effect?: 'clip' | 'scale' | 'fade';
  parallax?: boolean;
  priority?: boolean;
  className?: string;
  aspectRatio?: string;
}

export function ImageReveal({
  src,
  alt,
  width,
  height,
  effect = 'clip',
  parallax = false,
  priority = false,
  className,
  aspectRatio = 'aspect-[4/3]',
  ...props
}: ImageRevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [isLoaded, setIsLoaded] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Parallax hook (optional usage)
  const { style: parallaxStyle } = useParallaxLayer({
    speed: 0.1,
    smooth: true,
  });

  // Select variants based on effect
  const variants = React.useMemo(() => {
    if (shouldReduceMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
      };
    }

    switch (effect) {
      case 'scale':
        return imageScaleRevealVariants;
      case 'clip':
      default:
        return imageRevealVariants;
    }
  }, [effect, shouldReduceMotion]);

  return (
    <div 
      ref={containerRef} 
      className={cn('relative overflow-hidden bg-neutral-100 dark:bg-neutral-800', aspectRatio, className)}
    >
      <m.div
        className="h-full w-full"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={variants}
        style={parallax && !shouldReduceMotion ? parallaxStyle : undefined}
      >
        <m.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-700',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props as React.ComponentPropsWithoutRef<typeof m.img>} 
        />
      </m.div>
      
      {/* Loading shimmer overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      )}
    </div>
  );
}
