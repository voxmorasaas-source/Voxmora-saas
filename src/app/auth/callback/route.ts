import { createServerClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';
  const origin = requestUrl.origin;

  if (code) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Successfully exchanged code for session cookie
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      }

      console.error('[Auth Callback] Code exchange error:', error.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    } catch (err: any) {
      console.error('[Auth Callback] Unexpected error:', err);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent('Authentication exchange failed')}`
      );
    }
  }

  // No code was present in query params
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('No authentication code provided')}`);
}

