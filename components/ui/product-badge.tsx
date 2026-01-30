'use client';

import { m, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { popVariants } from '@/lib/animations/variants';
import type { Product } from '@/lib/shopify/types';

export type BadgeType = 'bestseller' | 'new' | 'low-stock' | 'sale';

interface ProductBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Override default animation */
  animate?: boolean;
}

interface ProductBadgesProps {
  product: Product;
  /** Threshold for low stock warning. Default: 5 */
  lowStockThreshold?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const badgeStyles: Record<BadgeType, string> = {
  bestseller: 'glass-gold text-atp-gold border-atp-gold/30',
  new: 'glass text-emerald-500 border-emerald-500/30',
  'low-stock': 'glass text-orange-500 border-orange-500/30',
  sale: 'glass text-atp-gold border-atp-gold/30',
};

/**
 * Single badge component with animation
 */
export function ProductBadge({
  type,
  size = 'sm',
  className,
  animate = true,
}: ProductBadgeProps) {
  const t = useTranslations('badges');
  const shouldReduceMotion = useReducedMotion();

  const badgeLabels: Record<BadgeType, string> = {
    bestseller: t('bestseller'),
    new: t('new'),
    'low-stock': t('lowStock'),
    sale: t('sale'),
  };

  const Component = animate && !shouldReduceMotion ? m.span : 'span';
  const animationProps = animate && !shouldReduceMotion
    ? {
        initial: 'hidden',
        animate: 'visible',
        variants: popVariants,
      }
    : {};

  return (
    <Component
      {...animationProps}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium border backdrop-blur-sm',
        sizeClasses[size],
        badgeStyles[type],
        className
      )}
    >
      {badgeLabels[type]}
    </Component>
  );
}

/**
 * Detects which badges apply to a product and renders them
 */
export function ProductBadges({
  product,
  lowStockThreshold = 5,
  className,
  size = 'sm',
}: ProductBadgesProps) {
  const badges: BadgeType[] = [];

  // Check for bestseller tag
  if (product.tags?.some(tag => tag.toLowerCase() === 'bestseller')) {
    badges.push('bestseller');
  }

  // Check if product is new (created within last 30 days)
  if (product.updatedAt) {
    const createdDate = new Date(product.updatedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (createdDate > thirtyDaysAgo && !badges.includes('bestseller')) {
      badges.push('new');
    }
  }

  // Check for sale (compareAtPrice > price)
  const hasComparePrice = product.priceRange?.maxVariantPrice?.amount && 
    product.variants?.[0]?.price?.amount &&
    parseFloat(product.priceRange.maxVariantPrice.amount) > parseFloat(product.variants[0].price.amount);
  
  if (hasComparePrice) {
    badges.push('sale');
  }

  // Check for low stock - only if variant has quantityAvailable
  // Note: This requires inventory data from Shopify, which may not always be present
  // For now, we check if the product has limited availability
  if (!product.availableForSale) {
    // Product not available at all - don't show low stock, it's out of stock
  } else {
    // Could add inventory check here if quantityAvailable is exposed in the API
    // For now, low-stock badge would need to be set via tags
    if (product.tags?.some(tag => tag.toLowerCase() === 'low-stock' || tag.toLowerCase() === 'limited')) {
      badges.push('low-stock');
    }
  }

  if (badges.length === 0) return null;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {badges.map((badge, index) => (
        <ProductBadge
          key={badge}
          type={badge}
          size={size}
          animate
          className={index > 0 ? 'animation-delay-100' : undefined}
        />
      ))}
    </div>
  );
}

export default ProductBadge;
