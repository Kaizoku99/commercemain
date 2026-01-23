"use client"

import { useState, useTransition } from "react"
import { m, AnimatePresence } from "framer-motion"
import { Tag, X, Check, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import type { CartDiscountCode, CartDiscountAllocation } from "@/lib/shopify/types"

interface DiscountCodeInputProps {
  /** Currently applied discount codes */
  appliedCodes: CartDiscountCode[]
  /** Discount allocations showing savings */
  discountAllocations?: CartDiscountAllocation[]
  /** Function to apply a discount code */
  onApplyCode: (code: string) => Promise<{ success: boolean; error?: string }>
  /** Function to remove a discount code */
  onRemoveCode: (code: string) => Promise<{ success: boolean; error?: string }>
  /** Whether the input is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * DiscountCodeInput Component
 * 
 * Allows customers to enter discount codes and see applied discounts.
 * Supports multiple stackable discount codes.
 */
export function DiscountCodeInput({
  appliedCodes = [],
  discountAllocations = [],
  onApplyCode,
  onRemoveCode,
  disabled = false,
  className = "",
}: DiscountCodeInputProps) {
  const t = useTranslations('cart')
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isApplying, startApplyTransition] = useTransition()
  const [isRemoving, startRemoveTransition] = useTransition()
  const [removingCode, setRemovingCode] = useState<string | null>(null)

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      setError(t('discounts.enterCode'))
      return
    }

    setError(null)

    startApplyTransition(async () => {
      const result = await onApplyCode(code.trim().toUpperCase())

      if (result.success) {
        setCode("")
      } else {
        setError(result.error || t('discounts.invalidCode'))
      }
    })
  }

  const handleRemoveCode = (codeToRemove: string) => {
    setRemovingCode(codeToRemove)

    startRemoveTransition(async () => {
      await onRemoveCode(codeToRemove)
      setRemovingCode(null)
    })
  }

  // Calculate total discount from allocations
  const totalDiscount = discountAllocations.reduce((sum, allocation) => {
    return sum + parseFloat(allocation.discountedAmount.amount)
  }, 0)

  const currencyCode = discountAllocations[0]?.discountedAmount.currencyCode || 'AED'

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Applied Discount Codes */}
      {appliedCodes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            {t('discounts.appliedCodes')}
          </p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {appliedCodes.map((discountCode) => (
                <m.div
                  key={discountCode.code}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant={discountCode.applicable ? "default" : "secondary"}
                    className={`flex items-center gap-1.5 px-2 py-1 ${discountCode.applicable
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}
                  >
                    <Tag className="h-3 w-3" />
                    <span className="font-mono text-xs">{discountCode.code}</span>
                    {discountCode.applicable ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <button
                      onClick={() => handleRemoveCode(discountCode.code)}
                      disabled={isRemoving && removingCode === discountCode.code}
                      className="ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                      aria-label={t('discounts.removeCode', { code: discountCode.code })}
                    >
                      {isRemoving && removingCode === discountCode.code ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </button>
                  </Badge>
                </m.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Total Discount Display */}
      {totalDiscount > 0 && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between text-sm"
        >
          <span className="text-green-600 dark:text-green-400 font-medium">
            {t('discounts.savings')}
          </span>
          <span className="text-green-600 dark:text-green-400 font-semibold">
            -{new Intl.NumberFormat('en-AE', {
              style: 'currency',
              currency: currencyCode,
            }).format(totalDiscount)}
          </span>
        </m.div>
      )}

      {/* Discount Code Input Form */}
      <form onSubmit={handleApplyCode} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError(null)
            }}
            placeholder={t('discounts.placeholder')}
            disabled={disabled || isApplying}
            className={`pl-9 font-mono text-sm uppercase ${error ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
            aria-label={t('discounts.label')}
          />
        </div>
        <Button
          type="submit"
          disabled={disabled || isApplying || !code.trim()}
          size="sm"
          className="shrink-0"
        >
          {isApplying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('discounts.apply')
          )}
        </Button>
      </form>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <m.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * DiscountSummary Component
 * 
 * Shows a summary of all applied discounts in the cart
 */
export function DiscountSummary({
  discountAllocations = [],
  className = "",
}: {
  discountAllocations: CartDiscountAllocation[]
  className?: string
}) {
  const t = useTranslations('cart')

  if (discountAllocations.length === 0) {
    return null
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {discountAllocations.map((allocation, index) => {
        const title = allocation.title || allocation.code || t('discounts.discount')
        const isCodeDiscount = !!allocation.code

        return (
          <div
            key={`${allocation.code || allocation.title}-${index}`}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <Tag className="h-3 w-3" />
              {isCodeDiscount ? (
                <span className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                  {allocation.code}
                </span>
              ) : (
                <span>{title}</span>
              )}
            </span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              -{new Intl.NumberFormat('en-AE', {
                style: 'currency',
                currency: allocation.discountedAmount.currencyCode,
              }).format(parseFloat(allocation.discountedAmount.amount))}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default DiscountCodeInput
