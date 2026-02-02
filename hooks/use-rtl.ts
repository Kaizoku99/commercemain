"use client"

import { useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { type Locale, locales, getLocaleConfig, getOppositeLocale } from "@/lib/i18n/config"
import { useDirection } from "@/components/ui/direction"

export type Language = Locale
export type Direction = "ltr" | "rtl"

interface RTLState {
  language: Language
  direction: Direction
  isRTL: boolean
  localeConfig: ReturnType<typeof getLocaleConfig>
}

export function useRTL(): RTLState & {
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  switchToLocale: (locale: Locale) => void
} {
  const router = useRouter()
  const pathname = usePathname()
  
  // Use next-intl's useLocale for reliable, hydration-safe locale detection
  const language = useLocale() as Language
  
  // Use shadcn's useDirection hook if available (from DirectionProvider context)
  const radixDirection = useDirection()

  useEffect(() => {
    updateDocumentDirection(language)
  }, [language])

  const updateDocumentDirection = (lang: Language) => {
    const config = getLocaleConfig(lang)
    const direction = config.dir
    
    document.documentElement.dir = direction
    document.documentElement.lang = lang

    // Update body classes for styling
    document.body.classList.toggle("rtl", lang === "ar")
    document.body.classList.toggle("ltr", lang === "en")
    
    // Set cookie for persistence
    document.cookie = `atp-locale=${lang}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
  }

  const switchToLocale = useCallback((locale: Locale) => {
    if (language === locale) return

    // Remove current locale from pathname and add new locale
    const segments = pathname.split('/')
    const isCurrentLocaleInPath = locales.includes(segments[1] as Locale)
    
    let newPathname: string
    if (isCurrentLocaleInPath) {
      // Replace existing locale
      segments[1] = locale
      newPathname = segments.join('/')
    } else {
      // Add locale to beginning
      newPathname = `/${locale}${pathname}`
    }

    // Update document direction immediately for UI responsiveness
    updateDocumentDirection(locale)
    
    // Navigate to new locale - next-intl will handle the language state update
    router.push(newPathname)
  }, [pathname, router, language])

  const setLanguage = useCallback((lang: Language) => {
    switchToLocale(lang)
  }, [switchToLocale])

  const toggleLanguage = useCallback(() => {
    const newLang = getOppositeLocale(language)
    switchToLocale(newLang)
  }, [language, switchToLocale])

  const config = getLocaleConfig(language)
  // Prefer shadcn's useDirection value if available, fallback to config
  const direction = radixDirection || config.dir
  const isRTL = direction === "rtl"

  return {
    language,
    direction,
    isRTL,
    localeConfig: config,
    setLanguage,
    toggleLanguage,
    switchToLocale,
  }
}
