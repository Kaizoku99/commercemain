"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { type Locale, locales, defaultLocale, getLocaleConfig, getOppositeLocale } from "@/lib/i18n/config"

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
  const [language, setLanguageState] = useState<Language>(defaultLocale)

  // Extract current locale from pathname
  const getCurrentLocale = useCallback((): Language => {
    if (typeof window === 'undefined') {
      // Server-side: try to get from pathname
      const segments = pathname.split('/')
      const potentialLocale = segments[1]
      return locales.includes(potentialLocale as Locale) ? (potentialLocale as Locale) : defaultLocale
    }
    
    // Client-side: get from pathname
    const segments = window.location.pathname.split('/')
    const potentialLocale = segments[1]
    return locales.includes(potentialLocale as Locale) ? (potentialLocale as Locale) : defaultLocale
  }, [pathname])

  useEffect(() => {
    const currentLocale = getCurrentLocale()
    setLanguageState(currentLocale)
    updateDocumentDirection(currentLocale)
  }, [getCurrentLocale])

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
    const currentLocale = getCurrentLocale()
    
    if (currentLocale === locale) return

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

    // Update state immediately for UI responsiveness
    setLanguageState(locale)
    updateDocumentDirection(locale)
    
    // Navigate to new locale
    router.push(newPathname)
  }, [pathname, router, getCurrentLocale])

  const setLanguage = useCallback((lang: Language) => {
    switchToLocale(lang)
  }, [switchToLocale])

  const toggleLanguage = useCallback(() => {
    const newLang = getOppositeLocale(language)
    switchToLocale(newLang)
  }, [language, switchToLocale])

  const config = getLocaleConfig(language)
  const direction = config.dir
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
