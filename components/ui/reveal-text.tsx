'use client';

import { m, useInView, Variants, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { transitions } from '@/lib/animations/variants';

interface RevealTextProps {
  children: string;
  /** 'words' splits by space, 'chars' splits by character */
  mode?: 'words' | 'chars';
  className?: string;
  delay?: number;
  once?: boolean;
}

export function RevealText({
  children,
  mode = 'words',
  className,
  delay = 0,
  once = true,
}: RevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  
  const text = typeof children === 'string' ? children : '';
  const items = mode === 'words' ? text.split(' ') : text.split('');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : (mode === 'chars' ? 0.03 : 0.08),
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20,
      filter: shouldReduceMotion ? 'none' : 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: shouldReduceMotion ? { duration: 0 } : transitions.slow,
    },
  };

  return (
    <m.span
      ref={ref}
      className={cn('inline-block', className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {items.map((item, i) => (
        <m.span
          key={i}
          className={cn(
            'inline-block', 
            mode === 'words' ? 'me-[0.25em] last:me-0' : 'me-[-0.05em]'
          )}
          variants={itemVariants}
        >
          {item === ' ' ? '\u00A0' : item}
        </m.span>
      ))}
    </m.span>
  );
}
