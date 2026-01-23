import { redirect as nextRedirect } from 'next/navigation'
import { type Locale, defaultLocale } from './types'
import { getPathnameWithLocale } from './routing'

/**
 * Server-side redirect function with locale support
 */
export function redirect(href: string, locale?: Locale) {
  const targetLocale = locale || defaultLocale
  const localizedHref = getPathnameWithLocale(href, targetLocale)
  return nextRedirect(localizedHref)
}