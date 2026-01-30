/**
 * TypeScript definitions for Lingui i18n system
 * Provides type safety and IntelliSense support for internationalization
 */

import type { I18n, MessageDescriptor } from '@lingui/core'
import type { ReactNode, ComponentType } from 'react'

// Define Messages type locally since it may not be exported from @lingui/core
export type Messages = Record<string, string>

// Re-export core Lingui types for convenience
export type { I18n, MessageDescriptor }

// Locale-related types
export const locales = ['en', 'ar'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'en'
export type LocaleDirection = 'ltr' | 'rtl'

// Locale configuration type
export interface LocaleConfig {
  code: Locale
  name: string
  nativeName: string
  direction: LocaleDirection
  flag: string
}

// Translation function types
export type TranslationFunction = (id: string, values?: Record<string, any>) => string

// Message catalog types
export type MessageCatalog = Record<string, string>
export type LocalizedMessages = Record<Locale, MessageCatalog>

// Component prop types for translation components
export interface TransProps {
  id?: string
  message?: string
  comment?: string
  children?: ReactNode
  values?: Record<string, any>
  components?: Record<string, ComponentType<any> | string>
  render?: (chunks: ReactNode[]) => ReactNode
}

export interface PluralProps {
  value: number
  one?: ReactNode
  other?: ReactNode
  zero?: ReactNode
  two?: ReactNode
  few?: ReactNode
  many?: ReactNode
  [key: string]: ReactNode | number | undefined
}

export interface SelectProps {
  value: string
  other?: ReactNode
  [key: string]: ReactNode | string | undefined
}

export interface SelectOrdinalProps {
  value: number
  one?: ReactNode
  other?: ReactNode
  zero?: ReactNode
  two?: ReactNode
  few?: ReactNode
  many?: ReactNode
  [key: string]: ReactNode | number | undefined
}

// Hook return types
export interface UseLinguiReturn {
  i18n: I18n
  _: TranslationFunction
  t: TranslationFunction
}

export interface UseLocaleReturn {
  currentLocale: Locale
  switchLocale: (locale: Locale) => Promise<void>
  isRTL: boolean
  direction: LocaleDirection
}

// Server-side i18n types
export interface ServerI18nConfig {
  locale: Locale
  messages: MessageCatalog
}

export interface I18nInstanceConfig {
  locale: Locale
  messages: LocalizedMessages
  missing?: (locale: string, id: string) => string
}

// Client provider types
export interface LinguiClientProviderProps {
  children: ReactNode
  initialLocale: Locale
  initialMessages: MessageCatalog
}

// Routing types
export interface LocaleRouteParams {
  locale: Locale
}

export interface LocalizedPathname {
  pathname: string
  locale: Locale
}

// Error types
export class LocaleError extends Error {
  constructor(
    message: string,
    public locale?: string,
    public messageId?: string
  ) {
    super(message)
    this.name = 'LocaleError'
  }
}

export class TranslationError extends Error {
  constructor(
    message: string,
    public messageId: string,
    public locale: string
  ) {
    super(message)
    this.name = 'TranslationError'
  }
}

// Utility types for type-safe message IDs
export type MessageId = string
export type MessageValues = Record<string, string | number | ReactNode>

// Type guards
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function isLocaleError(error: unknown): error is LocaleError {
  return error instanceof LocaleError
}

export function isTranslationError(error: unknown): error is TranslationError {
  return error instanceof TranslationError
}

// Configuration validation types
export interface LinguiConfigValidation {
  sourceLocale: Locale
  locales: readonly Locale[]
  catalogs: Array<{
    path: string
    include: string[]
    exclude?: string[]
  }>
}

// Development mode types
export interface DevModeConfig {
  showMissingTranslations: boolean
  logTranslationUsage: boolean
  validateMessageIds: boolean
}

// Performance monitoring types
export interface I18nPerformanceMetrics {
  localeLoadTime: number
  translationLookupTime: number
  componentRenderTime: number
}

// Bundle analysis types
export interface LocaleBundleInfo {
  locale: Locale
  size: number
  messageCount: number
  loadTime: number
}

// Development mode utilities
export interface LinguiDevTools {
  extractMessages(): Promise<void>
  compileMessages(): Promise<void>
  validateMessages(): Promise<boolean>
  getStats(): {
    totalMessages: number
    translatedMessages: number
    missingMessages: string[]
  }
}

// Type-safe locale configuration
export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦'
  }
} as const

// Export type-safe locale utilities
export function getLocaleConfig(locale: Locale): LocaleConfig {
  return localeConfigs[locale]
}

export function getAllLocaleConfigs(): LocaleConfig[] {
  return Object.values(localeConfigs)
}

export function isRTLLocale(locale: Locale): boolean {
  return localeConfigs[locale].direction === 'rtl'
}