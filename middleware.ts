// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes for unauthenticated users only
const publicOnlyRoutes = ['/login', '/signup'];

// Routes that require authentication
const protectedRoutes = ['/profile'];

export function middleware(request: NextRequest) {
  // Check for the Medusa session cookie
  const customerCookie = request.cookies.get('connect.sid');

  const { pathname } = request.nextUrl;

  // Case 1: Authenticated user tries to access a public-only page
  if (customerCookie && publicOnlyRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Case 2: Unauthenticated user tries to access a protected page
  if (!customerCookie && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If no conditions are met, continue with the request
  return NextResponse.next();
}

export const config = {
  // Specify which paths the middleware should run on
  matcher: ['/login', '/signup', '/checkout', '/profile',],
};