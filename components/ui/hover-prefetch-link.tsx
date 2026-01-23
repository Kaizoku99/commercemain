'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface HoverPrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetchOnHover?: boolean;
  /** Delay in ms before prefetching starts (default: 100ms) */
  prefetchDelay?: number;
  /** Additional props to pass to the Link component */
  [key: string]: unknown;
}

/**
 * HoverPrefetchLink - Optimized Link Component
 * 
 * Implements deferred prefetching that only triggers when user hovers over the link.
 * This reduces initial page load and bandwidth usage while still providing
 * fast navigation for links users are likely to click.
 * 
 * Best practice from Next.js documentation for large sites with many links.
 */
export function HoverPrefetchLink({
  href,
  children,
  className,
  prefetchOnHover = true,
  prefetchDelay = 100,
  ...props
}: HoverPrefetchLinkProps) {
  const [shouldPrefetch, setShouldPrefetch] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (!prefetchOnHover) return;
    
    // Small delay to avoid prefetching on accidental hovers
    const timeout = setTimeout(() => {
      setShouldPrefetch(true);
    }, prefetchDelay);
    
    setHoverTimeout(timeout);
  }, [prefetchOnHover, prefetchDelay]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  }, [hoverTimeout]);

  return (
    <Link
      href={href}
      prefetch={shouldPrefetch ? null : false}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * NavLink - Styled navigation link with hover prefetch
 * 
 * Combines hover prefetch optimization with common navigation styling.
 */
export function NavLink({
  href,
  children,
  className,
  activeClassName,
  isActive = false,
  ...props
}: HoverPrefetchLinkProps & {
  activeClassName?: string;
  isActive?: boolean;
}) {
  return (
    <HoverPrefetchLink
      href={href}
      className={cn(
        'text-sm font-medium transition-colors duration-200',
        'hover:text-atp-gold focus-visible:text-atp-gold',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atp-gold focus-visible:ring-offset-2',
        isActive && activeClassName,
        className
      )}
      {...props}
    >
      {children}
    </HoverPrefetchLink>
  );
}

export default HoverPrefetchLink;
