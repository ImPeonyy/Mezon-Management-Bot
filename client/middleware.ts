import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Định nghĩa các routes
const publicRoutes = ['/', '/login'];
const protectedRoutes = ['/dashboard', '/change-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Lấy token từ localStorage (sẽ được xử lý ở client-side)
  // Middleware chỉ có thể kiểm tra cookies, không thể access localStorage
  const token = request.cookies.get('auth_token')?.value;
  
  // Kiểm tra nếu đang ở protected route mà không có token
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Kiểm tra nếu đang ở public route mà đã có token
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
