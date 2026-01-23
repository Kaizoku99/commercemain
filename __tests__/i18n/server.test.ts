import { describe, it, expect, vi, beforeEach } from 'vitest'
import { detectServerLocale } from '@/src/i18n/server'
import { defaultLocale } from '@/src/i18n/index'

// Mock Next.js headers
vi.mock('next/headers', () => ({
  headers: vi.fn(() => Promise.resolve({
    get: vi.fn((name: string) => {
      if (name === 'accept-language') {
        return 'en-US,en;q=0.9,ar;q=0.8'
      }
      return null
    })
  }))
}))

// Mock setI18n from @lingui/react/server
vi.mock('@lingui/react/server', () => ({
  setI18n: vi.fn()
}))

describe('Server-side i18n utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('detectServerLocale', () => {
    it('should return locale parameter when provided', async () => {
      const locale = await detectServerLocale('ar')
      expect(locale).toBe('ar')
    })

    it('should detect locale from Accept-Language header', async () => {
      const locale = await detectServerLocale()
      expect(locale).toBe('en') // Based on mocked header
    })

    it('should fallback to default locale when no valid locale found', async () => {
      const locale = await detectServerLocale('invalid')
      expect(locale).toBe(defaultLocale)
    })

    it('should return default locale when no parameters provided', async () => {
      // Mock headers to return null
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockResolvedValueOnce({
        get: vi.fn(() => null)
      } as any)

      const locale = await detectServerLocale()
      expect(locale).toBe(defaultLocale)
    })
  })
})