'use client';

import { useTranslations as useNextIntlTranslations, useLocale } from 'next-intl';
import { formatPrice as formatPriceUtil } from '@/lib/i18n/formatters';
import { UAE_DIRHAM_CODE } from '@/lib/constants';

// Extended translator type that is callable AND has additional properties
type ExtendedTranslator = ReturnType<typeof useNextIntlTranslations> & {
  t: ReturnType<typeof useNextIntlTranslations>;
  locale: string;
  isRTL: boolean;
  direction: 'rtl' | 'ltr';
  formatPrice: (price: number, currency?: string) => string;
};

export function useTranslations(namespace: string = 'common'): ExtendedTranslator {
  const t = useNextIntlTranslations(namespace);
  const locale = useLocale();
  
  const formatPrice = (price: number, currency: string = UAE_DIRHAM_CODE): string => {
    return formatPriceUtil(price, locale as 'en' | 'ar', currency);
  };
  
  // Create an extended translator that is callable but also has properties
  // This supports both usage patterns:
  // - const t = useTranslations('ns'); t('key')  <- calling t directly
  // - const { t, locale } = useTranslations('ns'); t('key') <- destructuring
  const extendedT = Object.assign(
    // Make it callable by spreading the t function
    (...args: Parameters<typeof t>) => t(...args),
    // Add all the t function's own properties (like .rich, .raw, etc.)
    t,
    // Add our custom properties
    {
      t,
      locale,
      isRTL: locale === 'ar',
      direction: (locale === 'ar' ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
      formatPrice
    }
  );
  
  return extendedT as ExtendedTranslator;
}

// For backward compatibility with existing code
export function useTranslationContext() {
  const locale = useLocale();
  const t = useNextIntlTranslations('common');
  
  return {
    t,
    language: locale as 'en' | 'ar',
    isRTL: locale === 'ar'
  };
}
