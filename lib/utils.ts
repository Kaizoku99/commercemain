import type { ReadonlyURLSearchParams } from "next/navigation"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { config } from "./config"

// Server-side only base URL
export const getBaseUrl = () => config.baseUrl

// For backward compatibility - use getBaseUrl() instead
export const baseUrl = getBaseUrl()

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString()
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`

  return `${pathname}${queryString}`
}

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_STOREFRONT_ACCESS_TOKEN"]
  const missingEnvironmentVariables = [] as string[]

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar)
    }
  })

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        "\n",
      )}\n`,
    )
  }

  if (config.shopify.domain?.includes("[") || config.shopify.domain?.includes("]")) {
    throw new Error(
      "Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.",
    )
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Renders the UAE Dirham symbol for text contexts
 * @param amount - The amount to display
 * @param locale - The locale ('en' or 'ar')
 * @returns Formatted string with Dirham symbol
 */
export function formatDirhamAmount(amount: number, locale: 'en' | 'ar' = 'en'): string {
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedNumber = formatter.format(amount);

  if (locale === 'ar') {
    // Convert to Arabic numerals for Arabic locale
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const arabicNumber = formattedNumber.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
    return arabicNumber;
  }

  return formattedNumber;
}

/**
 * Formats a Dirham amount with the official symbol for display
 * @param amount - The amount to display
 * @param locale - The locale ('en' or 'ar')
 * @returns Object with symbol and formatted amount
 */
export function formatDirhamWithSymbol(amount: number, locale: 'en' | 'ar' = 'en') {
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedNumber = formatter.format(amount);

  if (locale === 'ar') {
    // Convert to Arabic numerals for Arabic locale
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const arabicNumber = formattedNumber.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
    return {
      symbol: 'AED',
      amount: arabicNumber,
      display: arabicNumber
    };
  }

  return {
    symbol: 'AED',
    amount: formattedNumber,
    display: formattedNumber
  };
}
