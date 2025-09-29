import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Base URL cho API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  EXPIRES_AT: 'auth_expires_at'
};

// Tạo axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config: any) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request trong development
    if (process.env.NODE_ENV === 'development') {
      // console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
      //   headers: config.headers,
      //   data: config.data,
      // });
    }

    return config;
  },
  (error: AxiosError) => {
    // console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý response và refresh token
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response trong development
    if (process.env.NODE_ENV === 'development') {
      // console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      //   status: response.status,
      //   data: response.data,
      // });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Log error trong development
    if (process.env.NODE_ENV === 'development') {
      // console.error(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
      //   status: error.response?.status,
      //   data: error.response?.data,
      // });
    }

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Lấy token hiện tại
        const currentToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        
        if (currentToken) {
          // Gọi API refresh token
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
            token: currentToken,
          });

          if (refreshResponse.data.success && refreshResponse.data.data) {
            const { token: newToken, expiresIn } = refreshResponse.data.data;
            
            // Cập nhật token mới
            const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour
            localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
            localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

            // Cập nhật header cho request ban đầu
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Retry request ban đầu với token mới
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // console.error('Token refresh failed:', refreshError);
        
        // Clear auth data nếu refresh thất bại
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// Các helper functions để gọi API
export const apiClient = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.get(url, config);
  },

  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.post(url, data, config);
  },

  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.put(url, data, config);
  },

  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.patch(url, data, config);
  },

  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete(url, config);
  },
};

// Export axios instance để sử dụng trực tiếp nếu cần
export { axiosInstance };
