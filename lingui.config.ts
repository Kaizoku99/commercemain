import { defineConfig } from '@lingui/cli'
import { formatter } from '@lingui/format-po'

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en', 'ar'],
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['components/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}', 'hooks/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'lib/shopify/metafields.ts', 'lib/cart/cart-customer-utils.ts', 'lib/test-utils/rtl-test-utils.ts']
    }
  ],
  format: formatter(),
  orderBy: 'messageId'
})