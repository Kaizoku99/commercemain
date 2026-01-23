import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

// Export as 'proxy' instead of 'default' for Next.js 16
export const proxy = createMiddleware(routing);

export default proxy;

export const config = {
  // Match all pathnames except for
  // - API routes (/api/*)
  // - TRPC routes (/trpc/*)
  // - Next.js internals (/_next/*, /_vercel/*)
  // - Static files (containing a dot)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)' 
};