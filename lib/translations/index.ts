import { en } from "./en"
import { ar } from "./ar"

export type Language = "en" | "ar"
export type TranslationKey = keyof typeof en
export type NestedTranslationKey<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object ? `${string & K}.${NestedTranslationKey<T[K]>}` : string & K
    }[keyof T]
  : never

export const translations = {
  en,
  ar,
} as const

export function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((current, key) => current?.[key], obj) || path
}
