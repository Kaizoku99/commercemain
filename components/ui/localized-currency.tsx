/**
 * Localized Currency Display Component
 * 
 * Displays currency amounts with proper RTL support and localized formatting
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

'use client';

import React from 'react';
import { useCurrentLocale } from '@/src/i18n';
import { DirhamSymbol } from '@/components/icons/dirham-symbol';
import { useMembershipI18n } from '@/lib/utils/membership-i18n';
import { useRTL } from '@/hooks/use-rtl';
import { cn } from '@/lib/utils';

interface LocalizedCurrencyProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSymbol?: boolean;
  showCurrency?: boolean;
  precision?: number;
  className?: string;
  variant?: 'default' | 'muted' | 'accent' | 'success' | 'warning';
}

const sizeConfig = {
  sm: {
    text: 'text-sm',
    symbol: 12,
  },
  md: {
    text: 'text-base',
    symbol: 16,
  },
  lg: {
    text: 'text-lg',
    symbol: 18,
  },
  xl: {
    text: 'text-2xl',
    symbol: 20,
  },
};

const variantConfig = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  accent: 'text-atp-gold',
  success: 'text-green-600',
  warning: 'text-yellow-600',
};

export function LocalizedCurrency({
  amount,
  size = 'md',
  showSymbol = true,
  showCurrency = false,
  precision = 2,
  className,
  variant = 'default',
}: LocalizedCurrencyProps) {
  const { locale } = useCurrentLocale();
  const { isRTL, direction } = useRTL();
  const { formatPrice } = useMembershipI18n(locale);

  const config = sizeConfig[size];
  const variantClass = variantConfig[variant];
  
  const priceData = formatPrice(amount, {
    showSymbol,
    showCurrency,
    precision,
  });

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 currency-display font-medium',
        config.text,
        variantClass,
        isRTL ? 'flex-row-reverse' : 'flex-row',
        className
      )}
      dir={direction}
    >
      {showSymbol && <DirhamSymbol size={config.symbol} />}
      <span className={isRTL ? 'arabic-numerals' : ''}>
        {priceData.formatted}
      </span>
      {showCurrency && (
        <span className="text-xs opacity-75 ml-1">
          {priceData.currency}
        </span>
      )}
    </span>
  );
}

/**
 * Specialized components for common use cases
 */

export function MembershipPrice({ 
  amount, 
  className,
  showOriginal = false,
  originalAmount,
}: {
  amount: number;
  className?: string;
  showOriginal?: boolean;
  originalAmount?: number;
}) {
  const { isRTL } = useRTL();
  
  return (
    <div className={cn(
      'flex items-center gap-3',
      isRTL ? 'flex-row-reverse' : 'flex-row',
      className
    )}>
      {showOriginal && originalAmount && (
        <LocalizedCurrency
          amount={originalAmount}
          size="md"
          variant="muted"
          className="line-through"
        />
      )}
      <LocalizedCurrency
        amount={amount}
        size="xl"
        variant="accent"
        className="font-bold"
      />
    </div>
  );
}

export function SavingsAmount({ 
  amount, 
  className 
}: { 
  amount: number; 
  className?: string; 
}) {
  return (
    <LocalizedCurrency
      amount={amount}
      size="sm"
      variant="success"
      className={cn('font-medium', className)}
    />
  );
}

export function CompactPrice({ 
  amount, 
  className 
}: { 
  amount: number; 
  className?: string; 
}) {
  return (
    <LocalizedCurrency
      amount={amount}
      size="sm"
      className={className}
    />
  );
}