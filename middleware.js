import { NextResponse } from 'next/server';

// NOTE: Auth middleware is disabled until a real backend is connected.
// Re-enable by uncommenting the block below once API auth is in place.

export function middleware(request) {
  return NextResponse.next();

  /* --- Enable this when backend auth is ready ---

  const { pathname } = request.nextUrl;
  const token = request.cookies.get('nb_token')?.value;

  const protectedPrefixes = ['/dashboard', '/admin'];
  const authRoutes = ['/login', '/register', '/forgot-password'];

  const isProtected = protectedPrefixes.some(p => pathname.startsWith(p));
  const isAuthRoute  = authRoutes.some(p => pathname.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
  --- end of protected block --- */
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
  ],
};
