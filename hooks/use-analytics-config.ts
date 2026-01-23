import { useMemo } from 'react'

export function useAnalyticsConfig() {
  return useMemo(() => ({
    shopifyAnalytics: {
      enabled: process.env.NEXT_PUBLIC_SHOPIFY_ANALYTICS_ENABLED === 'true',
      appName: 'storefront'
    },
    googleAnalytics: {
      enabled: !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
      trackingId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''
    },
    facebookPixel: {
      enabled: !!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
      pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || ''
    }
  }), [])
}