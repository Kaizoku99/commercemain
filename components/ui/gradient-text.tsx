'use client';

import { m } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  /** Gradient preset or custom class. Default: 'gold' */
  gradient?: 'gold' | 'luxury' | 'sunset' | 'ocean' | string;
  /** Whether to animate the gradient. Default: true */
  animate?: boolean;
  className?: string;
}

export function GradientText({
  children,
  gradient = 'gold',
  animate = true,
  className,
}: GradientTextProps) {
  const getGradientClass = (g: string) => {
    switch (g) {
      case 'gold':
        return 'from-[#BF953F] via-[#FCF6BA] to-[#B38728]';
      case 'luxury':
        return 'from-neutral-900 via-neutral-500 to-neutral-900 dark:from-white dark:via-neutral-400 dark:to-neutral-100';
      case 'sunset':
        return 'from-orange-500 via-pink-500 to-purple-500';
      case 'ocean':
        return 'from-blue-500 via-teal-500 to-emerald-500';
      default:
        return g; // Allow custom classes like "from-x via-y to-z"
    }
  };

  const gradientClass = getGradientClass(gradient);

  return (
    <m.span
      className={cn(
        'inline-block bg-clip-text text-transparent bg-gradient-to-r bg-[length:200%_auto]',
        gradientClass,
        className
      )}
      animate={animate ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      } : undefined}
      transition={animate ? {
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      } : undefined}
    >
      {children}
    </m.span>
  );
}
