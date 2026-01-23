'use client'

import { I18nProvider } from '@lingui/react'
import { i18n as globalI18n, type Messages } from '@lingui/core'
import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useLingui } from '@lingui/react'
import { 
  type Locale, 
  type MessageCatalog,
  type LinguiClientProviderProps,
  type UseLocaleReturn,
  defaultLocale, 
  isValidLocale,
  LocaleError 
} from './types'

/**
 * Client-side provider component for Lingui i18n
 * Uses the global i18n instance to support dynamic locale switching
 * Based on Lingui best practices: https://lingui.dev/tutorials/react-rsc
 */
export function LinguiClientProvider({ 
  children, 
  initialLocale, 
  initialMessages 
}: LinguiClientProviderProps) {
  // Validate initial locale
  const validatedLocale = isValidLocale(initialLocale) ? initialLocale : defaultLocale
  
  // Track current locale state for dynamic switching
  const [currentLocale, setCurrentLocale] = useState<Locale>(validatedLocale)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize the global i18n instance on mount
  useEffect(() => {
    // Load initial messages into global i18n
    if (initialMessages && Object.keys(initialMessages).length > 0) {
      globalI18n.load(validatedLocale, initialMessages)
    }
    
    // Activate the initial locale
    globalI18n.activate(validatedLocale)
    setIsInitialized(true)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ LinguiClientProvider initialized: locale=${validatedLocale}, messages=${Object.keys(initialMessages || {}).length}`)
    }
  }, [validatedLocale, initialMessages])
  


  /**
   * Dynamically loads and activates a new locale with proper error handling
   * @param newLocale - The locale to switch to
   * @throws {LocaleError} When locale switching fails
   */
  const switchLocale = useCallback(async (newLocale: Locale): Promise<void> => {
    try {
      // Validate the new locale
      if (!isValidLocale(newLocale)) {
        throw new LocaleError(`Invalid locale: ${newLocale}`, newLocale)
      }

      // Skip if already active
      if (currentLocale === newLocale) {
        return
      }

      // Check if messages are already loaded
      if (!globalI18n.messages[newLocale]) {
        // Dynamic import of new locale messages with proper typing
        const { messages }: { messages: MessageCatalog } = await import(`../locales/${newLocale}/messages.js`)
        
        // Validate messages structure
        if (!messages || typeof messages !== 'object') {
          throw new LocaleError(`Invalid message catalog for locale: ${newLocale}`, newLocale)
        }
        
        // Load messages into i18n instance
        globalI18n.load(newLocale, messages)
      }

      // Activate the new locale
      globalI18n.activate(newLocale)
      
      // Update local state
      setCurrentLocale(newLocale)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Switched to locale: ${newLocale}`)
      }
    } catch (error) {
      const errorMessage = `Failed to switch to locale "${newLocale}"`
      console.error(errorMessage, error)
      
      // Create typed error
      const localeError = error instanceof LocaleError 
        ? error 
        : new LocaleError(errorMessage, newLocale)
      
      // Fallback to default locale if not already trying default
      if (newLocale !== defaultLocale) {
        console.warn(`Falling back to default locale: ${defaultLocale}`)
        try {
          await switchLocale(defaultLocale)
        } catch (fallbackError) {
          throw new LocaleError(
            `Failed to switch to both requested locale "${newLocale}" and default locale "${defaultLocale}"`,
            newLocale
          )
        }
      } else {
        throw localeError
      }
    }
  }, [currentLocale])

  /**
   * Preloads messages for a locale without activating it
   * Useful for performance optimization
   * @param locale - The locale to preload
   * @throws {LocaleError} When locale preloading fails
   */
  const preloadLocale = useCallback(async (locale: Locale): Promise<void> => {
    try {
      if (!isValidLocale(locale)) {
        throw new LocaleError(`Invalid locale for preloading: ${locale}`, locale)
      }

      // Skip if already loaded
      if (globalI18n.messages[locale]) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Locale already loaded: ${locale}`)
        }
        return
      }

      // Dynamic import and load messages with proper typing
      const { messages }: { messages: MessageCatalog } = await import(`../locales/${locale}/messages.js`)
      
      // Validate messages structure
      if (!messages || typeof messages !== 'object') {
        throw new LocaleError(`Invalid message catalog for preloading locale: ${locale}`, locale)
      }
      
      globalI18n.load(locale, messages)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Preloaded locale: ${locale} (${Object.keys(messages).length} messages)`)
      }
    } catch (error) {
      const errorMessage = `Failed to preload locale "${locale}"`
      console.error(errorMessage, error)
      
      if (process.env.NODE_ENV === 'development') {
        throw error instanceof LocaleError 
          ? error 
          : new LocaleError(errorMessage, locale)
      }
    }
  }, [])

  // Expose locale switching functionality through context with proper typing
  const contextValue: UseLocaleReturn = {
    currentLocale,
    switchLocale,
    isRTL: currentLocale === 'ar',
    direction: currentLocale === 'ar' ? 'rtl' : 'ltr'
  }

  // Handle locale changes from external sources (e.g., URL changes)
  useEffect(() => {
    // Listen for locale changes and update accordingly
    const handleLocaleChange = (event: CustomEvent<{ locale: Locale }>) => {
      const { locale } = event.detail
      if (locale !== currentLocale) {
        switchLocale(locale)
      }
    }

    // Add event listener for custom locale change events
    window.addEventListener('linguiLocaleChange', handleLocaleChange as EventListener)

    return () => {
      window.removeEventListener('linguiLocaleChange', handleLocaleChange as EventListener)
    }
  }, [currentLocale, switchLocale])

  // Don't render until initialized to prevent flash of untranslated content
  if (!isInitialized) {
    return null
  }

  return (
    <I18nProvider i18n={globalI18n}>
      <LocaleContext.Provider value={contextValue}>
        {children}
      </LocaleContext.Provider>
    </I18nProvider>
  )
}

// Create context for locale management utilities with proper typing
const LocaleContext = createContext<UseLocaleReturn | null>(null)

/**
 * Hook to access locale management utilities with type safety
 * @returns Locale context value with switching functions
 * @throws {Error} When used outside of LinguiClientProvider
 */
export function useLocale(): UseLocaleReturn {
  const context = useContext(LocaleContext)
  
  if (!context) {
    throw new Error('useLocale must be used within a LinguiClientProvider')
  }
  
  return context
}

/**
 * Hook to get current locale information
 * @returns Current locale and RTL status
 */
export function useCurrentLocale(): { locale: Locale; isRTL: boolean } {
  const { currentLocale, isRTL } = useLocale()
  
  return {
    locale: currentLocale,
    isRTL
  }
}

/**
 * Safe translation hook that handles cases where i18n is not ready
 * @returns Safe translation function that won't throw errors
 */
export function useSafeTranslation() {
  const context = useContext(LocaleContext)
  
  const safeTranslate = useCallback((messageId: string, values?: Record<string, any>) => {
    try {
      // First try to get from Lingui context
      const { _ } = useLingui()
      return _(messageId, values)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Translation not ready for "${messageId}":`, error)
      }
      // Return the message ID as fallback
      return messageId
    }
  }, [])
  
  return { _: safeTranslate }
}

/**
 * Utility function to trigger locale change from anywhere in the app
 * @param locale - The locale to switch to
 */
export function triggerLocaleChange(locale: Locale): void {
  const event = new CustomEvent('linguiLocaleChange', {
    detail: { locale }
  })
  window.dispatchEvent(event)
}