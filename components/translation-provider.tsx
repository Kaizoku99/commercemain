"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useRTL } from "@/hooks/use-rtl"
import { translations, type Language } from "@/lib/translations"

interface TranslationContextType {
  language: Language
  t: (key: string, params?: Record<string, string | number>) => string
  isRTL: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { language, isRTL, direction } = useRTL()

  // Update document attributes when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
      document.documentElement.dir = direction
      
      // Update body classes for CSS targeting
      document.body.classList.toggle('rtl', isRTL)
      document.body.classList.toggle('ltr', !isRTL)
      document.body.classList.toggle('arabic', language === 'ar')
      document.body.classList.toggle('english', language === 'en')
    }
  }, [language, direction, isRTL])

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".")
    let translation: any = translations[language]

    for (const k of keys) {
      translation = translation?.[k]
    }

    // Fallback to English if translation not found
    if (!translation && language !== "en") {
      let fallback: any = translations.en
      for (const k of keys) {
        fallback = fallback?.[k]
      }
      translation = fallback
    }

    if (typeof translation !== "string") {
      console.warn(`Translation missing for key: ${key} in language: ${language}`)
      return key
    }

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value))
      })
    }

    return translation
  }

  return <TranslationContext.Provider value={{ language, t, isRTL }}>{children}</TranslationContext.Provider>
}

export function useTranslationContext() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslationContext must be used within TranslationProvider")
  }
  return context
}
