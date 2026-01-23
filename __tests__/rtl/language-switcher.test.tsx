import { screen, fireEvent, waitFor } from '@testing-library/react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { renderWithRTL, rtlTestUtils, mockRTLHook } from '@/lib/test-utils/rtl-test-utils'

// Mock the useRTL hook
jest.mock('@/hooks/use-rtl', () => ({
  useRTL: jest.fn(),
}))

// Mock the useTranslations hook
jest.mock('@/hooks/use-translations', () => ({
  useTranslations: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'nav.switchLanguage': 'Switch language',
        'nav.autoDetected': 'Auto-detected',
      }
      return translations[key] || key
    },
  }),
}))

describe('LanguageSwitcher RTL Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly in LTR mode', () => {
    const mockHook = mockRTLHook('en')
    require('@/hooks/use-rtl').useRTL.mockReturnValue(mockHook)

    renderWithRTL(<LanguageSwitcher />, { locale: 'en' })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('English')
    expect(rtlTestUtils.hasRTLDirection(button)).toBe(false)
  })

  it('renders correctly in RTL mode', () => {
    const mockHook = mockRTLHook('ar')
    require('@/hooks/use-rtl').useRTL.mockReturnValue(mockHook)

    renderWithRTL(<LanguageSwitcher />, { locale: 'ar' })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('العربية')
    expect(rtlTestUtils.hasRTLDirection(button)).toBe(true)
  })

  it('switches language when option is clicked', async () => {
    const mockHook = mockRTLHook('en')
    require('@/hooks/use-rtl').useRTL.mockReturnValue(mockHook)

    renderWithRTL(<LanguageSwitcher />, { locale: 'en' })

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      const arabicOption = screen.getByText('العربية')
      expect(arabicOption).toBeInTheDocument()
    })

    const arabicOption = screen.getByText('العربية')
    fireEvent.click(arabicOption)

    expect(mockHook.switchToLocale).toHaveBeenCalledWith('ar')
  })

  it('has proper ARIA labels for accessibility', () => {
    const mockHook = mockRTLHook('en')
    require('@/hooks/use-rtl').useRTL.mockReturnValue(mockHook)

    renderWithRTL(<LanguageSwitcher />, { locale: 'en' })

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch language')
  })

  it('displays correct flag and native name for each language', async () => {
    const mockHook = mockRTLHook('en')
    require('@/hooks/use-rtl').useRTL.mockReturnValue(mockHook)

    renderWithRTL(<LanguageSwitcher />, { locale: 'en' })

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('العربية')).toBeInTheDocument()
      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
      expect(screen.getByText('🇸🇦')).toBeInTheDocument()
    })
  })

  it('applies correct RTL flex direction in Arabic mode', () => {
    const mockHook = mockRTLHook('ar')
    require('@/hooks/use-rtl').useRTL.mockReturnValue(mockHook)

    renderWithRTL(<LanguageSwitcher />, { locale: 'ar' })

    const button = screen.getByRole('button')
    const flexContainer = button.querySelector('div')
    
    expect(flexContainer).toHaveClass('flex-row-reverse')
  })
})