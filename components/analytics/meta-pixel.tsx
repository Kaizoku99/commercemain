'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '24439733515663379'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _fbq: any
  }
}

export function MetaPixel() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize pixel
    if (typeof window !== 'undefined' && !window.fbq) {
      const fbq: any = function (...args: any[]) {
        fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args)
      }
      fbq.push = fbq
      fbq.loaded = true
      fbq.version = '2.0'
      fbq.queue = []
      window.fbq = fbq
      window._fbq = fbq

      const script = document.createElement('script')
      script.async = true
      script.src = 'https://connect.facebook.net/en_US/fbevents.js'
      document.head.appendChild(script)

      window.fbq('init', PIXEL_ID)
    }
    window.fbq('track', 'PageView')
  }, [pathname])

  return null
}

// Helper tracking functions
export function trackViewContent(product: { id: string; title: string; price: string; currency?: string }) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'ViewContent', {
    content_ids: [product.id],
    content_name: product.title,
    content_type: 'product',
    value: parseFloat(product.price),
    currency: product.currency || 'AED',
  })
}

export function trackAddToCart(product: { id: string; title: string; price: string; currency?: string }, quantity = 1) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'AddToCart', {
    content_ids: [product.id],
    content_name: product.title,
    content_type: 'product',
    value: parseFloat(product.price) * quantity,
    currency: product.currency || 'AED',
    num_items: quantity,
  })
}

export function trackInitiateCheckout(totalPrice: string, itemCount: number, currency = 'AED') {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'InitiateCheckout', {
    value: parseFloat(totalPrice),
    currency,
    num_items: itemCount,
  })
}

export function trackPurchase(orderId: string, total: string, currency = 'AED', productIds: string[] = []) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'Purchase', {
    content_ids: productIds,
    content_type: 'product',
    value: parseFloat(total),
    currency,
    order_id: orderId,
  })
}
