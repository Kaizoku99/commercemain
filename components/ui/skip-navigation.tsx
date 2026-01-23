'use client';

import { useTranslations } from 'next-intl';

/**
 * Skip Navigation Link - Accessibility Component
 * 
 * Allows keyboard users to skip directly to main content.
 * Only visible when focused (using keyboard navigation).
 * 
 * Best practices from WCAG 2.1 Success Criterion 2.4.1
 */
export function SkipToContent() {
  const t = useTranslations('accessibility');
  
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-atp-gold focus:text-atp-black focus:font-medium focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-atp-black focus:ring-offset-2 transition-all duration-200"
    >
      {t('skipToContent', { defaultValue: 'Skip to main content' })}
    </a>
  );
}

/**
 * Skip Navigation Link - Simple version without i18n
 */
export function SkipToContentSimple({ label = 'Skip to main content' }: { label?: string }) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-atp-gold focus:text-atp-black focus:font-medium focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-atp-black focus:ring-offset-2 transition-all duration-200"
    >
      {label}
    </a>
  );
}

export default SkipToContent;
