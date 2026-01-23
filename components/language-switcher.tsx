'use client';

import { usePathname, useRouter } from '@/src/i18n/navigation';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const localeNames = {
  en: 'English',
  ar: 'العربية'
} as const;

const localeFlags = {
  en: '🇺🇸',
  ar: '🇸🇦'
} as const;

const supportedLocales = ['en', 'ar'] as const;

interface LanguageSwitcherProps {
  showFullText?: boolean;
  variant?: 'default' | 'mobile' | 'footer';
}

export function LanguageSwitcher({ showFullText = false, variant = 'default' }: LanguageSwitcherProps = {}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known params
      // are used in combination with a given pathname. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: newLocale }
    );
  };

  const isMobile = variant === 'mobile';
  const isFooter = variant === 'footer';

  // Footer variant uses a native select element
  if (isFooter) {
    return (
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
      >
        {supportedLocales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          suppressHydrationWarning
          variant="ghost"
          size="sm"
          className={`gap-2 ${isMobile ? 'w-full justify-start text-white hover:bg-gray-800 hover:text-yellow-400' : ''}`}
        >
          <Globe className="h-4 w-4" />
          {isMobile || showFullText ? (
            <span>
              {localeFlags[locale as keyof typeof localeFlags]} {localeNames[locale as keyof typeof localeNames]}
            </span>
          ) : (
            <>
              <span className="hidden sm:inline">
                {localeFlags[locale as keyof typeof localeFlags]} {localeNames[locale as keyof typeof localeNames]}
              </span>
              <span className="sm:hidden">
                {localeFlags[locale as keyof typeof localeFlags]}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "start" : "end"}>
        {supportedLocales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`gap-2 ${locale === loc ? 'bg-accent' : ''}`}
          >
            <span>{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}