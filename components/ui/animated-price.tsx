"use client"

import { m, AnimatePresence } from "framer-motion"
import { twMerge } from "tailwind-merge"
import clsx from "clsx"
import { UAE_DIRHAM_CODE } from "@/lib/constants"
import { DirhamSymbol } from "@/components/icons/dirham-symbol"
import { isValidPrice } from "@/lib/price-utils"

interface AnimatedPriceProps {
  amount: string
  className?: string
  currencyCode?: string
  currencyCodeClassName?: string
  /** Enable animation when price changes */
  animate?: boolean
  /** Show original price with strikethrough */
  compareAtPrice?: string
  /** Custom label for discounted prices */
  saleLabel?: string
}

/**
 * Animated Price Component
 * 
 * Features:
 * - Smooth animation when price changes (variant selection)
 * - Compare at price display for discounts
 * - UAE Dirham support with custom symbol
 * - Accessible with proper ARIA attributes
 */
export function AnimatedPrice({
  amount,
  className,
  currencyCode = UAE_DIRHAM_CODE,
  currencyCodeClassName,
  animate = true,
  compareAtPrice,
  saleLabel = "Sale",
}: AnimatedPriceProps) {
  const isUAE = currencyCode === UAE_DIRHAM_CODE
  const price = parseFloat(amount)
  const comparePrice = compareAtPrice ? parseFloat(compareAtPrice) : null
  const hasDiscount = comparePrice && comparePrice > price

  // Format number for display
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num)
  }

  // Format with currency for non-UAE
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(num)
  }

  // Handle invalid amounts
  if (!isValidPrice(amount)) {
    return (
      <p className={twMerge("text-xs flex items-center gap-1", className)}>
        {isUAE && <DirhamSymbol className="flex-shrink-0 w-[1em] h-[1em] text-current" />}
        <span>0.00</span>
      </p>
    )
  }

  const priceContent = (
    <AnimatePresence mode="wait">
      <m.span
        key={amount}
        initial={animate ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: 1, y: 0 }}
        {...(animate && { exit: { opacity: 0, y: 10 } })}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="inline-flex items-center gap-1"
      >
        {isUAE ? (
          <>
            <DirhamSymbol className="flex-shrink-0 w-[1em] h-[1em] text-current" />
            <span>{formatNumber(price)}</span>
          </>
        ) : (
          <>
            <span>{formatCurrency(price)}</span>
            <span className={clsx("ml-1 inline text-muted-foreground", currencyCodeClassName)}>
              {currencyCode}
            </span>
          </>
        )}
      </m.span>
    </AnimatePresence>
  )

  // If there's a compare at price (discount)
  if (hasDiscount) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <p
          className={twMerge("text-xs flex items-center gap-1 font-semibold", className)}
          aria-label={`Sale price: ${price} ${currencyCode}`}
        >
          {priceContent}
        </p>
        <p
          className="text-xs text-muted-foreground line-through"
          aria-label={`Original price: ${comparePrice} ${currencyCode}`}
        >
          {isUAE ? (
            <span className="flex items-center gap-1">
              <DirhamSymbol className="flex-shrink-0 w-[1em] h-[1em]" />
              {formatNumber(comparePrice)}
            </span>
          ) : (
            formatCurrency(comparePrice)
          )}
        </p>
        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
          {Math.round(((comparePrice - price) / comparePrice) * 100)}% off
        </span>
      </div>
    )
  }

  return (
    <p
      className={twMerge("text-xs flex items-center gap-1", className)}
      suppressHydrationWarning
      aria-label={`Price: ${price} ${currencyCode}`}
    >
      {priceContent}
    </p>
  )
}

export default AnimatedPrice
