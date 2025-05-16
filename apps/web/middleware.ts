// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  console.log("All cookies in request:", [...req.cookies.getAll()]);

  const hasSecureCookie = cookieHeader.includes('__Secure-next-auth.session-token');
  const hasDevCookie = cookieHeader.includes('next-auth.session-token');

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true,
    cookieName: hasSecureCookie
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
  });

  console.log("Middleware Token:", token);

  const isAuthenticated = !!token;

  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/search')) {
    return NextResponse.next();
  }

  const protectedRoutes = ['/create-ride', '/user-profile', '/user-rides'];

  const shouldProtect = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (shouldProtect && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};