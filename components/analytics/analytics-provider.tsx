'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initializeAnalytics, trackPageView } from '@/lib/analytics/shopify-analytics'

interface AnalyticsProviderProps {
  children: React.ReactNode
  config: {
    shopifyAnalytics?: {
      enabled: boolean
      appName: string
    }
    googleAnalytics?: {
      enabled: boolean
      trackingId: string
    }
    facebookPixel?: {
      enabled: boolean
      pixelId: string
    }
  }
}

export function AnalyticsProvider({ children, config }: AnalyticsProviderProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize analytics on mount
    initializeAnalytics(config)
  }, [config])

  useEffect(() => {
    // Track page views on route changes
    if (pathname) {
      trackPageView(pathname, {
        title: document.title,
        url: window.location.href
      })
    }
  }, [pathname])

  return <>{children}</>
}