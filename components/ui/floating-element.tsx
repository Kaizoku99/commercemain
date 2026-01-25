'use client';

import { m } from 'framer-motion';
import { cn } from '@/lib/utils';
import { easing } from '@/lib/animations/variants';

interface FloatingElementProps {
  children: React.ReactNode;
  /** Floating distance in pixels. Default: 20 */
  range?: number;
  /** Duration of one full cycle in seconds. Default: 3 */
  duration?: number;
  /** Delay before starting. Default: 0 */
  delay?: number;
  className?: string;
}

export function FloatingElement({
  children,
  range = 20,
  duration = 3,
  delay = 0,
  className,
}: FloatingElementProps) {
  return (
    <m.div
      className={cn('relative', className)}
      animate={{
        y: [0, -range, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: easing.smooth,
        delay: delay,
      }}
    >
      {children}
    </m.div>
  );
}
