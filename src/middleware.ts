import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const port = request.nextUrl.port;

  // ── Auto-redirect port 3001 root to /admin ─────────────────────────
  // When accessing via the admin port (3001), redirect / to /admin
  if (port === '3001' && (pathname === '/' || pathname === '')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // ── Protect admin routes ───────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('desi_admin_token')?.value;

    if (pathname === '/admin/login') {
      if (token) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};

