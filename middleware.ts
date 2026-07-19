import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const AUTH_PATHS = ['/login', '/register', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from app routes
  const isAppRoute = pathname.startsWith('/(client') || pathname.startsWith('/client') ||
                     pathname.startsWith('/(talent') || pathname.startsWith('/talent-dashboard') ||
                     pathname.startsWith('/(admin') || pathname.startsWith('/admin');

  if (isAppRoute && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role;

    // Redirect authenticated users from auth pages
    if (AUTH_PATHS.includes(pathname)) {
      return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
    }

    // Role-based route protection
    if (pathname.startsWith('/client') && role !== 'client') {
      return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
    }
    if (pathname.startsWith('/talent-dashboard') && role !== 'talent') {
      return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
    }
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
    }
  }

  return response;
}

function getDashboardPath(role?: string | null): string {
  switch (role) {
    case 'client': return '/client';
    case 'talent': return '/talent-dashboard';
    case 'admin': return '/admin';
    default: return '/';
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};