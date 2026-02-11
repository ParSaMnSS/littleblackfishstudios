import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fa'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(fa|en)/:path*']
};
