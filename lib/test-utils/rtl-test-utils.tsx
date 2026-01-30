import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { TranslationProvider } from '@/components/translation-provider'
import { UAE_DIRHAM_CODE, UAE_DIRHAM_SYMBOL } from "@/lib/constants";

// Type-safe mock function type
type MockFunction = (...args: unknown[]) => unknown;

// Mock the useRTL hook for testing
export const mockRTLHook = (language: 'en' | 'ar' = 'en') => {
  const isRTL = language === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  return {
    language,
    direction,
    isRTL,
    localeConfig: {
      name: language === 'ar' ? 'Arabic' : 'English',
      nativeName: language === 'ar' ? 'العربية' : 'English',
      flag: language === 'ar' ? '🇸🇦' : '🇺🇸',
      dir: direction,
      currency: UAE_DIRHAM_CODE,
      dateFormat: language === 'ar' ? 'dd/MM/yyyy' : 'MM/dd/yyyy',
      timeFormat: '12h',
    },
    setLanguage: (() => {}) as MockFunction,
    toggleLanguage: (() => {}) as MockFunction,
    switchToLocale: (() => {}) as MockFunction,
  }
}

// Custom render function for RTL testing
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: 'en' | 'ar'
}

function RTLTestWrapper({ children, locale = 'en' }: { children: ReactNode; locale?: 'en' | 'ar' }) {
  // Mock the document direction for testing
  if (typeof document !== 'undefined') {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
  }

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </div>
  )
}

export function renderWithRTL(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { locale = 'en', ...renderOptions } = options

  return render(ui, {
    wrapper: ({ children }) => (
      <RTLTestWrapper locale={locale}>{children}</RTLTestWrapper>
    ),
    ...renderOptions,
  })
}

// Test utilities for RTL-specific assertions
export const rtlTestUtils = {
  // Check if element has RTL direction
  hasRTLDirection: (element: HTMLElement) => {
    return element.dir === 'rtl' ||
      getComputedStyle(element).direction === 'rtl' ||
      element.closest('[dir="rtl"]') !== null
  },

  // Check if element has Arabic text class
  hasArabicTextClass: (element: HTMLElement) => {
    return element.classList.contains('arabic-text') ||
      element.classList.contains('font-arabic') ||
      element.classList.contains('arabic')
  },

  // Check if element has proper RTL flex direction
  hasRTLFlexDirection: (element: HTMLElement) => {
    const style = getComputedStyle(element)
    return style.flexDirection === 'row-reverse'
  },

  // Check if text alignment is appropriate for RTL
  hasRTLTextAlignment: (element: HTMLElement) => {
    const style = getComputedStyle(element)
    return style.textAlign === 'right' || style.textAlign === 'start'
  },

  // Check if element has proper RTL margin/padding
  hasRTLSpacing: (element: HTMLElement) => {
    const style = getComputedStyle(element)
    // This is a simplified check - in real scenarios you'd check specific spacing
    return style.marginInlineStart !== style.marginInlineEnd ||
      style.paddingInlineStart !== style.paddingInlineEnd
  },
}

// Mock translation function for testing
export const mockTranslation = (locale: 'en' | 'ar' = 'en') => {
  const translations = {
    en: {
      'nav.home': 'Home',
      'nav.cart': 'Cart',
      'nav.search': 'Search',
      'common.loading': 'Loading...',
      'products.addToCart': 'Add to Cart',
    },
    ar: {
      'nav.home': 'الرئيسية',
      'nav.cart': 'السلة',
      'nav.search': 'البحث',
      'common.loading': 'جاري التحميل...',
      'products.addToCart': 'أضف للسلة',
    },
  }

  return (key: string) => {
    return translations[locale][key as keyof typeof translations[typeof locale]] || key
  }
}

// Test data generators for different locales
export const testDataGenerators = {
  generatePrice: (locale: 'en' | 'ar', amount: number = 100) => {
    if (locale === 'ar') {
      return `${amount} ${UAE_DIRHAM_SYMBOL}` // Arabic AED format
    } else {
      return `AED ${amount}`
    }
  },

  generateDate: (locale: 'en' | 'ar', date: Date = new Date()) => {
    if (locale === 'ar') {
      return new Intl.DateTimeFormat('ar-AE').format(date)
    }
    return new Intl.DateTimeFormat('en-AE').format(date)
  },

  generatePhoneNumber: (locale: 'en' | 'ar') => {
    const number = '+971 50 123 4567'
    if (locale === 'ar') {
      // Convert to Arabic numerals
      return number.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])
    }
    return number
  },
}

// Accessibility testing helpers for RTL
export const a11yRTLHelpers = {
  // Check if screen reader will read content in correct order for RTL
  checkReadingOrder: (container: HTMLElement) => {
    const elements = container.querySelectorAll('[role], input, button, a, [tabindex]')
    // This would need more sophisticated logic in a real implementation
    return Array.from(elements)
  },

  // Check if focus management works correctly in RTL
  checkFocusOrder: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    return Array.from(focusableElements)
  },

  // Check if ARIA labels are appropriate for the locale
  checkAriaLabels: (element: HTMLElement, locale: 'en' | 'ar') => {
    const ariaLabel = element.getAttribute('aria-label')
    const ariaLabelledBy = element.getAttribute('aria-labelledby')

    if (locale === 'ar' && ariaLabel) {
      // Check if Arabic text (simplified check)
      return /[\u0600-\u06FF]/.test(ariaLabel)
    }

    return !!ariaLabel || !!ariaLabelledBy
  },
}