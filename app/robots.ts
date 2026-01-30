import { baseUrl } from '@/lib/utils';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '/debug-*',
          '/test-*',
          '/auth/',
          '/account/',
          '/cart/',
          '/checkout/',
          '/login',
          '/signup',
          '/*.json$',
          '/search?*',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/account/',
          '/cart/',
          '/checkout/',
          '/login',
          '/signup',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Mobile',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/account/',
          '/cart/',
          '/checkout/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
