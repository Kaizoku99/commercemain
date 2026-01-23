import { type Locale, getLocaleConfig } from './config'
import { UAE_DIRHAM_SYMBOL, UAE_DIRHAM_CODE } from '@/lib/constants'

export class I18nFormatters {
  private locale: Locale
  private config: ReturnType<typeof getLocaleConfig>

  constructor(locale: Locale) {
    this.locale = locale
    this.config = getLocaleConfig(locale)
  }

  formatPrice(price: number, currency: string = UAE_DIRHAM_CODE): string {
    // For UAE Dirham, use custom formatting with the official symbol
    if (currency === UAE_DIRHAM_CODE) {
      const formatter = new Intl.NumberFormat(
        this.locale === 'ar' ? 'ar-AE' : 'en-AE',
        {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }
      )

      const formattedNumber = formatter.format(price)

      // Use the Arabic symbol for Arabic, just the number for English (SVG will be used in components)
      if (this.locale === 'ar') {
        return `${this.convertToArabicNumerals(formattedNumber)}`
      }

      return formattedNumber
    }

    // Fallback to standard currency formatting for other currencies
    const formatter = new Intl.NumberFormat(
      this.locale === 'ar' ? 'ar-AE' : 'en-AE',
      {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )

    const formatted = formatter.format(price)

    // For Arabic, ensure proper RTL formatting
    if (this.locale === 'ar') {
      return formatted.replace(/(\d+)/, (match) => {
        // Convert to Arabic-Indic numerals if needed
        return this.convertToArabicNumerals(match)
      })
    }

    return formatted
  }

  formatNumber(number: number): string {
    const formatter = new Intl.NumberFormat(
      this.locale === 'ar' ? 'ar-AE' : 'en-AE'
    )

    const formatted = formatter.format(number)

    if (this.locale === 'ar') {
      return this.convertToArabicNumerals(formatted)
    }

    return formatted
  }

  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    const formatter = new Intl.DateTimeFormat(
      this.locale === 'ar' ? 'ar-AE' : 'en-AE',
      { ...defaultOptions, ...options }
    )

    return formatter.format(date)
  }

  formatDateTime(date: Date): string {
    return this.formatDate(date, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    const rtf = new Intl.RelativeTimeFormat(
      this.locale === 'ar' ? 'ar-AE' : 'en-AE',
      { numeric: 'auto' }
    )

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second')
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
    }
  }

  formatPercentage(value: number, decimals: number = 0): string {
    const formatter = new Intl.NumberFormat(
      this.locale === 'ar' ? 'ar-AE' : 'en-AE',
      {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }
    )

    const formatted = formatter.format(value / 100)

    if (this.locale === 'ar') {
      return this.convertToArabicNumerals(formatted)
    }

    return formatted
  }

  private convertToArabicNumerals(text: string): string {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    return text.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)])
  }

  // Format text direction for mixed content
  formatMixedContent(text: string): string {
    if (this.locale === 'ar') {
      // Add RTL marks for proper text direction
      return `\u202B${text}\u202C`
    }
    return text
  }

  // Format phone numbers for UAE
  formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '')

    // UAE phone number formatting
    if (cleaned.startsWith('971')) {
      // International format
      const formatted = cleaned.replace(/^971(\d{2})(\d{3})(\d{4})$/, '+971 $1 $2 $3')
      return this.locale === 'ar' ? this.convertToArabicNumerals(formatted) : formatted
    } else if (cleaned.startsWith('0')) {
      // Local format
      const formatted = cleaned.replace(/^0(\d{2})(\d{3})(\d{4})$/, '0$1 $2 $3')
      return this.locale === 'ar' ? this.convertToArabicNumerals(formatted) : formatted
    }

    return phone
  }
}

// Utility functions for use in components
export function formatPrice(price: number, locale: Locale, currency: string = 'AED'): string {
  return new I18nFormatters(locale).formatPrice(price, currency)
}

export function formatNumber(number: number, locale: Locale): string {
  return new I18nFormatters(locale).formatNumber(number)
}

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  return new I18nFormatters(locale).formatDate(date, options)
}

export function formatPercentage(value: number, locale: Locale, decimals?: number): string {
  return new I18nFormatters(locale).formatPercentage(value, decimals)
}