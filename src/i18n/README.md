# Server-side i18n Setup for Lingui 5.0

This document explains how to use the server-side i18n utilities with Next.js App Router.

## Core Functions

### `getI18nInstance(locale: Locale)`
Creates a new i18n instance for server-side rendering with the specified locale.

```typescript
import { getI18nInstance } from '@/src/i18n/server'

const i18n = await getI18nInstance('en')
```

### `setupServerI18n(locale: Locale)`
Sets up server-side i18n instance and integrates with Lingui's server context using `setI18n`.

```typescript
import { setupServerI18n } from '@/src/i18n/server'

const i18n = await setupServerI18n('ar')
// Now server components can use translations
```

### `detectServerLocale(localeParam?: string)`
Detects locale from server-side context (URL parameters, Accept-Language header).

```typescript
import { detectServerLocale } from '@/src/i18n/server'

// From URL parameter
const locale = await detectServerLocale('en')

// From Accept-Language header
const locale = await detectServerLocale()
```

### `initializeServerI18n(localeParam?: string)`
Convenience function that combines locale detection and i18n setup.

```typescript
import { initializeServerI18n } from '@/src/i18n/server'

const i18n = await initializeServerI18n('en')
```

## Usage in Next.js App Router

### In Layout Components

```typescript
// app/[locale]/layout.tsx
import { setupServerI18n } from '@/src/i18n/server'
import { type Locale } from '@/src/i18n/index'

interface Props {
  children: React.ReactNode
  params: { locale: Locale }
}

export default async function LocaleLayout({ children, params }: Props) {
  // Setup server-side i18n for this locale
  await setupServerI18n(params.locale)
  
  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### In Server Components

```typescript
// app/[locale]/page.tsx
import { Trans } from '@lingui/react/macro'
import { initializeServerI18n } from '@/src/i18n/server'

interface Props {
  params: { locale: string }
}

export default async function HomePage({ params }: Props) {
  // Initialize i18n for this page
  await initializeServerI18n(params.locale)
  
  return (
    <div>
      <h1><Trans>Welcome to our site</Trans></h1>
      <p><Trans>This content is server-side rendered with translations</Trans></p>
    </div>
  )
}
```

### With Static Generation

```typescript
// For static generation, preload messages
import { preloadMessages, createServerI18nWithMessages } from '@/src/i18n/server'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

export default async function StaticPage({ params }: { params: { locale: Locale } }) {
  // Preload messages for static generation
  const messages = await preloadMessages(params.locale)
  const i18n = createServerI18nWithMessages(params.locale, messages)
  
  return (
    <div>
      <Trans>Static content with translations</Trans>
    </div>
  )
}
```

## Error Handling

The server utilities include comprehensive error handling:

- **Invalid locales**: Automatically fallback to default locale
- **Missing message files**: Graceful degradation with fallback messages
- **Import errors**: Fallback to minimal i18n instance
- **Development warnings**: Console warnings for missing translations

## Performance Considerations

- Each server component gets its own i18n instance
- Messages are loaded dynamically only for the requested locale
- Fallback mechanisms prevent application crashes
- Development mode includes helpful warnings and debugging information

## Integration with Client Components

Server-side setup prepares the i18n context that client components can inherit. The client-side provider (to be implemented in task 4) will hydrate with the same locale and messages.
## Cl
ient-Side Provider

The `LinguiClientProvider` component manages client-side internationalization state and provides context to child components.

### Features

- **Hydration consistency**: Ensures server and client render the same content
- **Dynamic locale switching**: Load and switch between locales at runtime
- **Locale preloading**: Preload translations for better performance
- **Event-based communication**: Support for external locale change triggers
- **Error handling**: Graceful fallbacks for missing translations or failed loads
- **RTL support**: Automatic RTL detection for Arabic locale

### Usage

#### Basic Setup

```typescript
import { LinguiClientProvider } from '@/src/i18n/LinguiClientProvider'

function App({ locale, messages, children }) {
  return (
    <LinguiClientProvider 
      initialLocale={locale} 
      initialMessages={messages}
    >
      {children}
    </LinguiClientProvider>
  )
}
```

#### Using Locale Hooks

```typescript
'use client'

import { useLocale, useCurrentLocale } from '@/src/i18n/LinguiClientProvider'
import { useLingui } from '@lingui/react/macro'

export function LanguageSwitcher() {
  const { t } = useLingui()
  const { currentLocale, switchLocale, isRTL } = useLocale()
  
  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      <select 
        value={currentLocale} 
        onChange={(e) => switchLocale(e.target.value)}
      >
        <option value="en">{t`English`}</option>
        <option value="ar">{t`العربية`}</option>
      </select>
    </div>
  )
}
```

#### Preloading Locales

```typescript
export function MyComponent() {
  const { preloadLocale, currentLocale } = useLocale()
  
  useEffect(() => {
    // Preload the other locale for better UX
    const otherLocale = currentLocale === 'en' ? 'ar' : 'en'
    preloadLocale(otherLocale)
  }, [currentLocale, preloadLocale])
  
  return <div>Content</div>
}
```

#### External Locale Changes

```typescript
import { triggerLocaleChange } from '@/src/i18n/LinguiClientProvider'

// Trigger locale change from anywhere in the app
function handleRouteChange(newLocale: string) {
  triggerLocaleChange(newLocale)
}
```

### Integration with Server Components

The client provider should be used in your root layout to wrap the entire application:

```typescript
// app/[locale]/layout.tsx
import { LinguiClientProvider } from '@/src/i18n/LinguiClientProvider'
import { setupServerI18n, preloadMessages } from '@/src/i18n/server'

export default async function RootLayout({ 
  children, 
  params 
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Setup server-side i18n
  await setupServerI18n(params.locale)
  
  // Preload messages for client hydration
  const messages = await preloadMessages(params.locale)
  
  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <LinguiClientProvider 
          initialLocale={params.locale} 
          initialMessages={messages}
        >
          {children}
        </LinguiClientProvider>
      </body>
    </html>
  )
}
```

### Available Hooks

#### `useLocale()`
Returns the full locale context with switching and preloading capabilities:

```typescript
const { 
  currentLocale,    // Current active locale
  switchLocale,     // Function to switch locales
  preloadLocale,    // Function to preload a locale
  isRTL            // Boolean indicating RTL direction
} = useLocale()
```

#### `useCurrentLocale()`
Returns just the current locale information:

```typescript
const { 
  locale,          // Current active locale
  isRTL           // Boolean indicating RTL direction
} = useCurrentLocale()
```

### Error Handling

The client provider includes comprehensive error handling:
- Invalid locale validation with fallback to default
- Missing translation fallbacks
- Dynamic import error handling
- Graceful degradation for locale loading failures

### Testing

The provider is fully tested with unit tests covering:
- Component rendering and initialization
- Hook functionality and error cases
- Event handling and external triggers
- Locale switching and preloading

See `__tests__/i18n/LinguiClientProvider.test.tsx` for comprehensive test examples.