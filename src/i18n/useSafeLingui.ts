'use client'

import { useLingui as useOriginalLingui } from '@lingui/react'
import { useMemo } from 'react'
import type { MessageDescriptor } from '@lingui/core'

/**
 * Safe wrapper around useLingui that handles cases where i18n context isn't ready
 * Prevents "Attempted to call a translation function without setting a locale" errors
 * 
 * Based on Lingui best practices from https://lingui.dev/ref/react#uselingui
 */
export function useSafeLingui() {
  try {
    const lingui = useOriginalLingui()
    
    // Check if i18n is properly initialized and activated
    // According to Lingui docs, setupI18n() should create an activated instance
    if (lingui.i18n && lingui.i18n.locale && typeof lingui.i18n._ === 'function') {
      return lingui
    }
    
    // If not activated, throw to trigger fallback
    throw new Error('i18n not activated')
  } catch (error) {
    // In development, warn about fallback usage but don't spam console
    if (process.env.NODE_ENV === 'development') {
      // Use a flag to only warn once per component mount
      if (!(error as any).__warned) {
        console.warn('[useSafeLingui] i18n not ready, using fallback. This may indicate a race condition.')
        ;(error as any).__warned = true
      }
    }
    
    // Return safe fallback implementation that mimics useLingui API
    return useMemo(() => ({
      i18n: {
        locale: 'en',
        activate: () => {},
        load: () => {},
        _: (descriptor: MessageDescriptor | string) => {
          if (typeof descriptor === 'string') {
            return descriptor
          }
          return descriptor.message || descriptor.id || ''
        }
      } as any,
      _: (descriptor: string | MessageDescriptor, values?: Record<string, any>) => {
        // Return the message text as fallback
        if (typeof descriptor === 'string') {
          return descriptor
        }
        // For MessageDescriptor, prefer message over id (more readable)
        return descriptor.message || descriptor.id || ''
      }
    }), [])
  }
}
