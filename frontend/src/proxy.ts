import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { UserRole } from './types/user';

const roleHomeRoutes: Record<UserRole, string> = {
  [UserRole.admin]: '/admin/home',
  [UserRole.customer]: '/customer/home',
  [UserRole.cashier]: '/cashier/home',
  [UserRole.delivery]: '/delivery/home',
};

// Mapeo de rutas por rol - cada rol solo puede acceder a sus rutas
const roleRoutePrefix: Record<UserRole, string> = {
  [UserRole.admin]: '/admin',
  [UserRole.customer]: '/customer',
  [UserRole.cashier]: '/cashier',
  [UserRole.delivery]: '/delivery',
};

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get('access_token')?.value;
  const role = req.cookies.get('user_role')?.value as UserRole | undefined;
  const path = req.nextUrl.pathname;

  const authPaths = ['/auth/login', '/auth/register'];
  const isAuthPath = authPaths.includes(path);

  const protectedPaths = ['/admin', '/customer', '/cashier', '/delivery'];
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));

  if (path === '/' && token && role) {
    url.pathname = roleHomeRoutes[role];
    return NextResponse.redirect(url);
  }

  if (token && role && isAuthPath) {
    url.pathname = roleHomeRoutes[role];
    return NextResponse.redirect(url);
  }

  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (token && role && isProtectedPath) {
    const allowedPrefix = roleRoutePrefix[role];

    if (!path.startsWith(allowedPrefix)) {
      url.pathname = roleHomeRoutes[role];
      return NextResponse.redirect(url);
    }
  }

  if (path === '/' && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api/).*)',
  ],
};
