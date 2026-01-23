import { I18nFormatters, formatPrice, formatNumber, formatDate } from '@/lib/i18n/formatters'
import { UAE_DIRHAM_CODE, UAE_DIRHAM_SYMBOL } from '@/lib/constants'

describe('I18n Formatters RTL Tests', () => {
  describe('I18nFormatters class', () => {
    it('formats prices correctly in English', () => {
      const formatter = new I18nFormatters('en')
      const result = formatter.formatPrice(100, UAE_DIRHAM_CODE)
      expect(result).toMatch(/AED\s*100/)
    })

    it('formats prices correctly in Arabic with Arabic numerals', () => {
      const formatter = new I18nFormatters('ar')
      const result = formatter.formatPrice(100, UAE_DIRHAM_CODE)
      // Should contain Arabic numerals
      expect(result).toMatch(/[٠-٩]/)
    })

    it('formats numbers correctly in English', () => {
      const formatter = new I18nFormatters('en')
      const result = formatter.formatNumber(1234)
      expect(result).toBe('1,234')
    })

    it('formats numbers correctly in Arabic', () => {
      const formatter = new I18nFormatters('ar')
      const result = formatter.formatNumber(1234)
      expect(result).toMatch(/[٠-٩]/)
    })

    it('formats dates correctly', () => {
      const formatter = new I18nFormatters('en')
      const date = new Date('2024-01-15')
      const result = formatter.formatDate(date)
      expect(result).toBeTruthy()
    })
  })

  describe('Utility functions', () => {
    it('formatPrice utility works correctly', () => {
      const enResult = formatPrice(100, 'en', UAE_DIRHAM_CODE)
      const arResult = formatPrice(100, 'ar', UAE_DIRHAM_CODE)
      
      expect(enResult).toMatch(/AED/)
      expect(arResult).toMatch(/[٠-٩]/)
    })

    it('formatNumber utility works correctly', () => {
      const enResult = formatNumber(1234, 'en')
      const arResult = formatNumber(1234, 'ar')
      
      expect(enResult).toBe('1,234')
      expect(arResult).toMatch(/[٠-٩]/)
    })

    it('formatDate utility works correctly', () => {
      const date = new Date('2024-01-15')
      const enResult = formatDate(date, 'en')
      const arResult = formatDate(date, 'ar')
      
      expect(enResult).toBeTruthy()
      expect(arResult).toBeTruthy()
    })
  })
})