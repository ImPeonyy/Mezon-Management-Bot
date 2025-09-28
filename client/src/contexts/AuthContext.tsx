'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface AuthData {
  user: User;
  token: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (id: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  EXPIRES_AT: 'auth_expires_at'
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);

        if (storedToken && storedUser && expiresAt) {
          const now = Date.now();
          const expiration = parseInt(expiresAt);

          if (now < expiration) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Ensure cookie is set
            document.cookie = `auth_token=${storedToken}; path=/; max-age=${Math.floor((expiration - now) / 1000)}; SameSite=Strict`;
          } else {
            // Token expired, try to refresh
            refreshTokenSilently();
          }
        }
      } catch (error) {
        // console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Save auth data to localStorage and cookies
  const saveAuthData = (authData: AuthData) => {
    try {
      // Calculate expiration time (1 hour from now based on server config)
      const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour in milliseconds

      localStorage.setItem(STORAGE_KEYS.TOKEN, authData.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData.user));
      localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

      // Also save to cookies for middleware access
      document.cookie = `auth_token=${authData.token}; path=/; max-age=${60 * 60}; SameSite=Strict`;

      setToken(authData.token);
      setUser(authData.user);
    } catch (error) {
      // console.error('Error saving auth data:', error);
    }
  };

  // Clear auth data
  const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
    
    // Also clear cookies
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setToken(null);
    setUser(null);
  };

  // Login function
  const login = async (id: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Import authAPI dynamically để tránh circular dependency
      const { authAPI } = await import('@/services/api');
      const response = await authAPI.login({ id, password });

      if (response.success && response.data) {
        saveAuthData(response.data);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Đăng nhập thất bại' };
      }
    } catch (error: unknown) {
      // console.error('Login error:', error);
      
      // Xử lý lỗi từ API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          return { success: false, message: apiError.response.data.message };
        }
      }
      
      return { success: false, message: 'Lỗi kết nối server' };
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const currentToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!currentToken) return false;

      // Import authAPI dynamically để tránh circular dependency
      const { authAPI } = await import('@/services/api');
      const response = await authAPI.refreshToken({ token: currentToken });

      if (response.success && response.data) {
        // Update only token, keep user data
        const currentUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (currentUser) {
          const authData: AuthData = {
            user: JSON.parse(currentUser),
            token: response.data.token,
            tokenType: response.data.tokenType,
            expiresIn: response.data.expiresIn
          };
          saveAuthData(authData);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      // console.error('Refresh token error:', error);
      return false;
    }
  };

  // Silent refresh token (for initialization)
  const refreshTokenSilently = async () => {
    const success = await refreshToken();
    if (!success) {
      clearAuthData();
    }
  };

  // Auto refresh token when it's about to expire
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
      if (expiresAt) {
        const expiration = parseInt(expiresAt);
        const now = Date.now();
        const timeUntilExpiry = expiration - now;

        // Refresh token 5 minutes before expiry
        if (timeUntilExpiry <= 5 * 60 * 1000 && timeUntilExpiry > 0) {
          refreshTokenSilently();
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
