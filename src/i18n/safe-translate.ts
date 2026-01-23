'use client'

/**
 * Safe translation function that doesn't rely on hooks
 * Can be used anywhere without context dependencies
 */
export function safeTranslate(messageId: string, fallback?: string): string {
  try {
    // Try to access the global i18n instance if available
    if (typeof window !== 'undefined' && (window as any).__LINGUI_I18N__) {
      const i18n = (window as any).__LINGUI_I18N__
      if (i18n && i18n.locale && i18n.messages[i18n.locale]) {
        // Try to translate using the i18n instance
        const translated = i18n._(messageId)
        return translated
      }
    }
    
    // Fallback to the message ID or provided fallback
    return fallback || messageId
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Safe translate failed for "${messageId}":`, error)
    }
    return fallback || messageId
  }
}

/**
 * Hook version of safe translate for React components
 */
export function useSafeTranslate() {
  return { _: safeTranslate }
}