'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  allowAuthenticated?: boolean; // Cho phép user đã đăng nhập truy cập không
}

export default function PublicRoute({ 
  children, 
  fallback = null, 
  redirectTo = '/dashboard',
  allowAuthenticated = false 
}: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu không cho phép user đã đăng nhập và user đã đăng nhập thì redirect
    if (!isLoading && isAuthenticated && !allowAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, allowAuthenticated]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Nếu đã đăng nhập và không cho phép, show fallback hoặc nothing (sẽ redirect)
  if (isAuthenticated && !allowAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  // Render children
  return <>{children}</>;
}

// Higher-order component version
export const withPublicRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    redirectTo?: string;
    allowAuthenticated?: boolean;
  }
) => {
  const WrappedComponent = (props: P) => (
    <PublicRoute {...options}>
      <Component {...props} />
    </PublicRoute>
  );

  WrappedComponent.displayName = `withPublicRoute(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};
