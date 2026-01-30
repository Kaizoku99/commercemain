import { setupI18n, type I18n } from '@lingui/core'
import { setI18n } from '@lingui/react/server'
import { i18n as globalI18n } from '@lingui/core'
import { type Locale, defaultLocale, isValidLocale } from './index'
import { detectLocaleFromHeader, normalizeLocale } from './routing'

// Cache for server-side i18n instances per locale
const serverI18nCache = new Map<Locale, I18n>()

/**
 * Creates a new i18n instance for server-side rendering
 * @param locale - The locale to initialize the instance with
 * @returns Promise resolving to configured i18n instance
 */
export async function getI18nInstance(locale: Locale): Promise<I18n> {
  try {
    // Validate locale
    if (!isValidLocale(locale)) {
      console.warn(`Invalid locale "${locale}", falling back to default: ${defaultLocale}`)
      locale = defaultLocale
    }

    // Check cache first for performance
    if (serverI18nCache.has(locale)) {
      const cached = serverI18nCache.get(locale)!
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Using cached i18n instance for locale: ${locale}`)
      }
      return cached
    }

    // Dynamic import of locale messages
    const { messages } = await import(`../locales/${locale}/messages.js`)
    
    if (!messages || Object.keys(messages).length === 0) {
      console.error(`❌ No messages loaded for locale "${locale}"`)
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Loaded ${Object.keys(messages).length} messages for locale: ${locale}`)
    }
    
    // Create new i18n instance for server-side rendering
    const i18n = setupI18n({
      locale,
      messages: { [locale]: messages }
    })

    // Load and activate immediately to ensure messages are available
    i18n.load(locale, messages)
    i18n.activate(locale)

    // Cache the instance
    serverI18nCache.set(locale, i18n)

    return i18n
  } catch (error) {
    console.error(`❌ Failed to create i18n instance for locale "${locale}":`, error)
    
    // Fallback to default locale if not already trying default
    if (locale !== defaultLocale) {
      console.warn(`Falling back to default locale: ${defaultLocale}`)
      return getI18nInstance(defaultLocale)
    }
    
    // If even default locale fails, create minimal instance
    const fallbackI18n = setupI18n({
      locale: defaultLocale,
      messages: { [defaultLocale]: {} }
    })
    
    return fallbackI18n
  }
}

/**
 * Sets up server-side i18n instance and integrates with Lingui's server context
 * @param locale - The locale to setup
 * @returns Promise resolving to configured i18n instance
 */
export async function setupServerI18n(locale: Locale): Promise<I18n> {
  try {
    // Get i18n instance for the specified locale
    const i18n = await getI18nInstance(locale)
    
    // Set the i18n instance for server-side rendering
    // This allows server components to access translations
    setI18n(i18n)
    
    return i18n
  } catch (error) {
    console.error(`Failed to setup server i18n for locale "${locale}":`, error)
    
    // Create and set fallback instance
    const fallbackI18n = setupI18n({
      locale: defaultLocale,
      messages: { [defaultLocale]: {} }
    })
    
    setI18n(fallbackI18n)
    return fallbackI18n
  }
}

/**
 * Detects locale from server-side context (headers, params, etc.)
 * @param localeParam - Optional locale parameter from URL
 * @returns Detected and validated locale
 */
export async function detectServerLocale(localeParam?: string): Promise<Locale> {
  try {
    // First priority: URL parameter
    if (localeParam) {
      const normalizedParam = normalizeLocale(localeParam)
      if (isValidLocale(normalizedParam)) {
        return normalizedParam
      }
    }

    // Second priority: Accept-Language header (only on server)
    if (typeof window === 'undefined') {
      try {
        const { headers } = await import('next/headers')
        const headersList = await headers()
        const acceptLanguage = headersList.get('accept-language')
        
        if (acceptLanguage) {
          const detectedLocale = detectLocaleFromHeader(acceptLanguage)
          if (isValidLocale(detectedLocale)) {
            return detectedLocale
          }
        }
      } catch (error) {
        console.warn('Failed to access headers:', error)
      }
    }

    // Fallback to default locale
    return defaultLocale
  } catch (error) {
    console.error('Error detecting server locale:', error)
    return defaultLocale
  }
}

/**
 * Initializes i18n for server components with automatic locale detection
 * @param localeParam - Optional locale parameter from URL
 * @returns Promise resolving to configured i18n instance
 */
export async function initializeServerI18n(localeParam?: string): Promise<I18n> {
  // Detect the appropriate locale
  const locale = await detectServerLocale(localeParam)
  
  // Setup and return i18n instance
  return setupServerI18n(locale)
}

/**
 * Gets the current server-side locale from various sources
 * This is a utility function for server components that need locale information
 * @param localeParam - Optional locale parameter from URL
 * @returns Promise resolving to the current locale
 */
export async function getServerLocale(localeParam?: string): Promise<Locale> {
  return detectServerLocale(localeParam)
}

/**
 * Preloads messages for a specific locale (useful for static generation)
 * @param locale - The locale to preload
 * @returns Promise resolving to the messages object
 */
export async function preloadMessages(locale: Locale): Promise<Record<string, any>> {
  try {
    if (!isValidLocale(locale)) {
      console.warn(`Invalid locale "${locale}", using default: ${defaultLocale}`)
      locale = defaultLocale
    }

    const { messages } = await import(`../locales/${locale}/messages.js`)
    
    if (!messages || typeof messages !== 'object') {
      console.error(`❌ Invalid messages structure for locale "${locale}"`)
      return {}
    }

    const messageCount = Object.keys(messages).length
    if (messageCount === 0) {
      console.warn(`⚠️ No messages found for locale "${locale}"`)
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Preloaded ${messageCount} messages for locale: ${locale}`)
    }

    return messages
  } catch (error) {
    console.error(`❌ Failed to preload messages for locale "${locale}":`, error)
    
    // Try to fallback to default locale
    if (locale !== defaultLocale) {
      console.warn(`⚠️ Attempting fallback to default locale: ${defaultLocale}`)
      try {
        const { messages } = await import(`../locales/${defaultLocale}/messages.js`)
        return messages || {}
      } catch (fallbackError) {
        console.error(`❌ Fallback also failed:`, fallbackError)
      }
    }
    
    // Return empty messages object as final fallback
    return {}
  }
}

/**
 * Creates a server-side i18n instance with preloaded messages
 * Useful for static generation where you want to avoid dynamic imports
 * @param locale - The locale to setup
 * @param messages - Preloaded messages object
 * @returns Configured i18n instance
 */
export function createServerI18nWithMessages(
  locale: Locale, 
  messages: Record<string, any>
): I18n {
  const i18n = setupI18n({
    locale,
    messages: { [locale]: messages }
  })

  // Set the i18n instance for server-side rendering
  setI18n(i18n)
  
  return i18n
}

/**
 * Server-side translation function similar to next-intl's getTranslations
 * @param namespace - Optional namespace for scoped translations
 * @param locale - Optional locale, will be detected if not provided
 * @returns Promise resolving to translation function
 */
export async function getTranslations(namespace?: string, locale?: Locale) {
  const detectedLocale = locale || await detectServerLocale()
  const i18n = await getI18nInstance(detectedLocale)
  
  return (messageId: string, values?: Record<string, any>) => {
    const fullMessageId = namespace ? `${namespace}.${messageId}` : messageId
    return i18n._(fullMessageId, values)
  }
}

/**
 * Server-side locale setting function (no-op for Lingui compatibility)
 * This is for compatibility with next-intl's setRequestLocale
 * @param locale - The locale to set (not used in Lingui)
 */
export function setRequestLocale(locale: Locale) {
  // This is a no-op function for compatibility with next-intl
  // Lingui handles locale setting differently
  if (process.env.NODE_ENV === 'development') {
    console.log(`setRequestLocale called with locale: ${locale}`)
  }
}

// Re-export server navigation utilities
export { redirect } from './navigation-server'