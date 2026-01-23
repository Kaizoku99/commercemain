import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '../middleware'

// Mock the i18n modules
vi.mock('./src/i18n/index', () => ({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  isValidLocale: (locale: string) => ['en', 'ar'].includes(locale)
}))

vi.mock('./src/i18n/routing', () => ({
  getLocaleFromPathname: (pathname: string) => {
    const segments = pathname.split('/')
    const potentialLocale = segments[1]
    return ['en', 'ar'].includes(potentialLocale) ? potentialLocale : potentialLocale || 'en'
  },
  hasLocalePrefix: (pathname: string) => {
    const segments = pathname.split('/')
    return ['en', 'ar'].includes(segments[1]) // Only valid locales return true
  },
  detectLocaleFromHeader: (acceptLanguage?: string) => {
    if (acceptLanguage?.includes('ar')) return 'ar'
    return 'en'
  },
  getPathnameWithLocale: (pathname: string, locale: string) => `/${locale}${pathname === '/' ? '' : pathname}`,
  getPathnameWithoutLocale: (pathname: string) => {
    const segments = pathname.split('/')
    if (['en', 'ar'].includes(segments[1])) {
      return '/' + segments.slice(2).join('/')
    }
    return pathname
  },
  getLocaleDirection: (locale: string) => locale === 'ar' ? 'rtl' : 'ltr'
}))

describe('Custom Lingui Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should skip middleware for API routes', () => {
    const request = new NextRequest('http://localhost:3000/api/test')
    const response = middleware(request)
    
    expect(response.status).toBe(200) // NextResponse.next() returns 200
  })

  it('should skip middleware for static files', () => {
    const request = new NextRequest('http://localhost:3000/favicon.ico')
    const response = middleware(request)
    
    expect(response.status).toBe(200)
  })

  it('should redirect root path to default locale', () => {
    const request = new NextRequest('http://localhost:3000/')
    const response = middleware(request)
    
    expect(response.status).toBe(307) // Redirect status
    expect(response.headers.get('location')).toBe('http://localhost:3000/en')
  })

  it('should redirect path without locale to detected locale from header', () => {
    const request = new NextRequest('http://localhost:3000/about', {
      headers: {
        'accept-language': 'ar,en;q=0.9'
      }
    })
    const response = middleware(request)
    
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/ar/about')
  })

  it('should continue with valid locale in path', () => {
    const request = new NextRequest('http://localhost:3000/en/about')
    const response = middleware(request)
    
    expect(response.status).toBe(200)
    expect(response.headers.get('x-locale')).toBe('en')
    expect(response.headers.get('x-locale-direction')).toBe('ltr')
  })

  it('should redirect invalid locale to default locale', () => {
    const request = new NextRequest('http://localhost:3000/fr/about')
    const response = middleware(request)
    
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/en/about')
  })

  it('should set locale cookie on redirect', () => {
    const request = new NextRequest('http://localhost:3000/about')
    const response = middleware(request)
    
    const setCookieHeader = response.headers.get('set-cookie')
    expect(setCookieHeader).toContain('locale=en')
  })

  it('should use locale from cookie if available', () => {
    const request = new NextRequest('http://localhost:3000/about', {
      headers: {
        cookie: 'locale=ar'
      }
    })
    const response = middleware(request)
    
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/ar/about')
  })

  it('should handle query parameters correctly', () => {
    const request = new NextRequest('http://localhost:3000/about?param=value')
    const response = middleware(request)
    
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/en/about?param=value')
  })

  it('should handle Arabic locale with RTL direction', () => {
    const request = new NextRequest('http://localhost:3000/ar/about')
    const response = middleware(request)
    
    expect(response.status).toBe(200)
    expect(response.headers.get('x-locale')).toBe('ar')
    expect(response.headers.get('x-locale-direction')).toBe('rtl')
  })

  it('should not redirect paths that do not look like locales', () => {
    const request = new NextRequest('http://localhost:3000/about-us')
    const response = middleware(request)
    
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/en/about-us')
  })
})