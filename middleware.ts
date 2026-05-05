import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fa'],
  defaultLocale: 'en'
});

export default async function middleware(req: NextRequest) {
  const supabaseResponse = await updateSession(req);

  const pathname = req.nextUrl.pathname;
  const isAdminPath = /\/(en|fa)\/admin(\/.*)?$/.test(pathname);

  if (isAdminPath) {
    const localeMatch = pathname.match(/^\/(en|fa)/);
    const locale = localeMatch ? localeMatch[1] : 'en';

    const sessionResponse = supabaseResponse;

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              sessionResponse.cookies.set(name, value, options as Parameters<typeof sessionResponse.cookies.set>[2])
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = `/${locale}/login`;
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }

    if (user.app_metadata?.role !== 'admin') {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = `/${locale}/login`;
      loginUrl.search = '?error=forbidden';
      return NextResponse.redirect(loginUrl);
    }
  }

  const intlResponse = intlMiddleware(req);

  supabaseResponse.cookies.getAll().forEach(cookie => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
