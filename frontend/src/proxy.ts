import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { UserRole } from './types/user';

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get('access_token')?.value;
  const role = req.cookies.get('user_role')?.value;
  const path = req.nextUrl.pathname;

  const authPaths = ['/auth/login', '/auth/register'];
  const privatePaths = ['/admin', '/dashboard', '/profile', '/orders'];

  if (token && authPaths.includes(path)) {
    if (role === 'admin') url.pathname = '/admin/dashboard';
    else if (role === 'repartidor') url.pathname = '/repartidor/dashboard';
    else url.pathname = '/dashboard'; // cliente u otros

    //TODO>: ajustar rutas
    switch (role) {
      case UserRole.admin:
        url.pathname = '/admin/';
        break;
      case UserRole.delivery:
        url.pathname = '/delivery/';
        break;
      case UserRole.customer:
        url.pathname = '/customer/';
        break;
      case UserRole.cashier:
        url.pathname = '/cashier/';
        break;
      default:
        url.pathname = '/auth/login';
    }

    return NextResponse.redirect(url);
  }

  if (!token && privatePaths.some((p) => path.startsWith(p))) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};
