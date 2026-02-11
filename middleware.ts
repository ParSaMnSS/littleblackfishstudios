import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fa'],
  defaultLocale: 'en'
});

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 1. Check if the path is an admin route
  // Matches /en/admin, /fa/admin, and any subpaths like /en/admin/settings
  const isAdminPath = /\/(en|fa)\/admin(\/.*)?$/.test(pathname);

  if (isAdminPath) {
    const authHeader = req.headers.get('authorization');

    if (authHeader) {
      const authValue = authHeader.split(' ')[1];
      const [user, password] = Buffer.from(authValue, 'base64').toString().split(':');

      if (
        user === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASSWORD
      ) {
        return intlMiddleware(req);
      }
    }

    // If no auth header or credentials don't match, trigger Basic Auth prompt
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
      },
    });
  }

  // 2. Default behavior for non-admin paths
  return intlMiddleware(req);
}

export const config = {
  // Matcher for all paths except static files and internal Next.js/Vercel paths
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
