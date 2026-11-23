import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, favicon, API webhooks, and auth callback endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Refresh Supabase Auth Session and retrieve current user
  const { supabaseResponse, user } = await updateSession(request);

  // 3. Define Auth Pages
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');

  // 4. MANDATORY AUTH GUARD:
  // If user is NOT logged in and attempting to access any protected route (including root '/'),
  // redirect them immediately to /login
  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    if (pathname !== '/') {
      url.searchParams.set('redirectTo', pathname);
    }
    return NextResponse.redirect(url);
  }

  // 5. If user IS already logged in and attempts to visit login/signup, redirect to dashboard '/'
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
