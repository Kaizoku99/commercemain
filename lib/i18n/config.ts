export type Locale = 'en' | 'ar'

export const locales: Locale[] = ['en', 'ar']
export const defaultLocale: Locale = 'en'

export const localeConfig = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr' as const,
    currency: 'AED',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl' as const,
    currency: 'AED',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '12h',
  },
} as const

export function getLocaleConfig(locale: Locale) {
  return localeConfig[locale] || localeConfig[defaultLocale]
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getOppositeLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ar' : 'en'
}