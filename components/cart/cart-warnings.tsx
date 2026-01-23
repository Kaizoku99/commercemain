"use client"

import { useEffect, useState } from "react"
import { m, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, AlertCircle, Info, Package, Tag, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { CartWarning, CartWarningCode, CartWarningCategory } from "@/lib/shopify/types"
import { getWarningCategory } from "@/lib/shopify/types"
import { useTranslations } from "next-intl"

interface CartWarningsProps {
  warnings: CartWarning[]
  onDismiss?: (warning: CartWarning) => void
  onRemoveItem?: (lineId: string) => void
  className?: string
}

/**
 * Get icon for warning category
 */
const getWarningIcon = (category: CartWarningCategory) => {
  switch (category) {
    case 'inventory':
      return Package
    case 'discount':
      return Tag
    case 'address':
      return MapPin
    case 'payment':
      return CreditCard
    default:
      return AlertCircle
  }
}

/**
 * Get severity level for warning code
 */
const getWarningSeverity = (code: CartWarningCode): 'warning' | 'error' | 'info' => {
  // Critical warnings that need immediate attention
  if (code === 'MERCHANDISE_OUT_OF_STOCK') return 'error'
  if (code === 'MERCHANDISE_NOT_ENOUGH_STOCK') return 'error'

  // Important but not critical
  if (code.startsWith('DISCOUNT_')) return 'warning'

  // Informational
  return 'info'
}

/**
 * Get human-readable title for warning code
 */
const getWarningTitle = (code: CartWarningCode, t: (key: string) => string): string => {
  const titles: Partial<Record<CartWarningCode, string>> = {
    'MERCHANDISE_OUT_OF_STOCK': t('warnings.outOfStock'),
    'MERCHANDISE_NOT_ENOUGH_STOCK': t('warnings.lowStock'),
    'DISCOUNT_CODE_NOT_HONOURED': t('warnings.discountNotApplied'),
    'DISCOUNT_CURRENTLY_INACTIVE': t('warnings.discountInactive'),
    'DISCOUNT_CUSTOMER_NOT_ELIGIBLE': t('warnings.discountNotEligible'),
    'DISCOUNT_CUSTOMER_USAGE_LIMIT_REACHED': t('warnings.discountUsageLimitReached'),
    'DISCOUNT_USAGE_LIMIT_REACHED': t('warnings.discountLimitReached'),
    'DISCOUNT_NOT_FOUND': t('warnings.discountNotFound'),
    'DUPLICATE_DELIVERY_ADDRESS': t('warnings.duplicateAddress'),
    'PAYMENTS_GIFT_CARDS_UNAVAILABLE': t('warnings.giftCardsUnavailable'),
  }
  return titles[code] || t('warnings.generic')
}

/**
 * CartWarnings Component
 * 
 * Displays warnings from cart mutations (e.g., out of stock items, invalid discounts)
 * These are not errors - the mutation succeeded but automatic changes were made.
 * 
 * @see https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/cart-warnings
 */
export function CartWarnings({
  warnings,
  onDismiss,
  onRemoveItem,
  className = ""
}: CartWarningsProps) {
  const t = useTranslations('cart')
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set())

  // Filter out dismissed warnings
  const visibleWarnings = warnings.filter(w => !dismissedWarnings.has(w.target))

  const handleDismiss = (warning: CartWarning) => {
    setDismissedWarnings(prev => new Set([...prev, warning.target]))
    onDismiss?.(warning)
  }

  const handleRemoveItem = (warning: CartWarning) => {
    if (warning.code === 'MERCHANDISE_OUT_OF_STOCK' || warning.code === 'MERCHANDISE_NOT_ENOUGH_STOCK') {
      onRemoveItem?.(warning.target)
    }
  }

  if (visibleWarnings.length === 0) {
    return null
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence>
        {visibleWarnings.map((warning) => {
          const category = getWarningCategory(warning.code)
          const severity = getWarningSeverity(warning.code)
          const Icon = getWarningIcon(category)

          return (
            <m.div
              key={warning.target}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Alert
                variant={severity === 'error' ? 'destructive' : 'default'}
                className={`relative ${severity === 'warning'
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                  : severity === 'info'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    : ''
                  }`}
              >
                <Icon className="h-4 w-4" />
                <AlertTitle className="text-sm font-medium">
                  {getWarningTitle(warning.code, t)}
                </AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  {warning.message}
                </AlertDescription>

                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {/* Remove item button for out-of-stock warnings */}
                  {(warning.code === 'MERCHANDISE_OUT_OF_STOCK' ||
                    warning.code === 'MERCHANDISE_NOT_ENOUGH_STOCK') &&
                    onRemoveItem && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleRemoveItem(warning)}
                      >
                        {t('warnings.removeItem')}
                      </Button>
                    )}

                  {/* Dismiss button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => handleDismiss(warning)}
                    aria-label={t('warnings.dismiss')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Alert>
            </m.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

/**
 * CartWarningsBanner Component
 * 
 * A more prominent banner for critical warnings (out of stock)
 */
export function CartWarningsBanner({
  warnings,
  onRemoveItem
}: {
  warnings: CartWarning[]
  onRemoveItem?: (lineId: string) => void
}) {
  const t = useTranslations('cart')

  // Only show for critical inventory warnings
  const criticalWarnings = warnings.filter(
    w => w.code === 'MERCHANDISE_OUT_OF_STOCK' || w.code === 'MERCHANDISE_NOT_ENOUGH_STOCK'
  )

  if (criticalWarnings.length === 0) {
    return null
  }

  return (
    <m.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800 dark:text-red-200">
            {t('warnings.stockIssuesTitle')}
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            {t('warnings.stockIssuesDescription', { count: criticalWarnings.length })}
          </p>
          {onRemoveItem && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => criticalWarnings.forEach(w => onRemoveItem(w.target))}
            >
              {t('warnings.removeAllUnavailable')}
            </Button>
          )}
        </div>
      </div>
    </m.div>
  )
}

export default CartWarnings
