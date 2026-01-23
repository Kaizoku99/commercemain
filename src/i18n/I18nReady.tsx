'use client'

import { useLingui } from '@lingui/react'
import { useEffect, useState } from 'react'

interface I18nReadyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Component that ensures i18n is ready before rendering children
 * Prevents race condition errors when components try to use translations
 */
export function I18nReady({ children, fallback }: I18nReadyProps) {
  const { i18n } = useLingui()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check if i18n is properly initialized
    const checkReady = () => {
      if (i18n && i18n.locale && Object.keys(i18n.messages).length > 0) {
        setIsReady(true)
      } else {
        // Retry after a short delay
        setTimeout(checkReady, 10)
      }
    }

    checkReady()
  }, [i18n])

  if (!isReady) {
    return fallback || (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return <>{children}</>
}