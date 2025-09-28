import { apiClient } from '@/lib/axios';
import { AxiosResponse } from 'axios';

// Types cho API responses
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginRequest {
  id: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface RefreshTokenResponse {
  token: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Auth API services
export const authAPI = {
  // Đăng nhập
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response: AxiosResponse<ApiResponse<LoginResponse>> = await apiClient.post(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  // Refresh token
  refreshToken: async (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
    const response: AxiosResponse<ApiResponse<RefreshTokenResponse>> = await apiClient.post(
      '/auth/refresh',
      data
    );
    return response.data;
  },

  // Đăng xuất (nếu có API)
  logout: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await apiClient.put('/auth/change-password', data);
    return response.data;
  },
};

// User API services
export const userAPI = {
  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.get('/user/me');
    return response.data;
  },

  // Lấy danh sách users
  getUsers: async (params?: any): Promise<ApiResponse<any[]>> => {
    const response: AxiosResponse<ApiResponse<any[]>> = await apiClient.get('/user', { params });
    return response.data;
  },

  // Tạo user mới
  createUser: async (userData: any): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/user', userData);
    return response.data;
  },

  // Cập nhật user
  updateUser: async (userId: string, userData: any): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/user/${userId}`, userData);
    return response.data;
  },

  // Xóa user
  deleteUser: async (userId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await apiClient.delete(`/user/${userId}`);
    return response.data;
  },
};

// Clan API services
export const clanAPI = {
  // Lấy danh sách clans
  getClans: async (params?: any): Promise<ApiResponse<any[]>> => {
    const response: AxiosResponse<ApiResponse<any[]>> = await apiClient.get('/clan', { params });
    return response.data;
  },

  // Lấy thông tin clan với event messages
  getClan: async (clanId: string): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/clan/${clanId}`);
    return response.data;
  },

  // Tạo clan mới
  createClan: async (clanData: any): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/clan', clanData);
    return response.data;
  },

  // Cập nhật clan
  updateClan: async (clanId: string, clanData: any): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/clan/${clanId}`, clanData);
    return response.data;
  },

  // Xóa clan
  deleteClan: async (clanId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await apiClient.delete(`/clan/${clanId}`);
    return response.data;
  },

  // Cập nhật template message
  updateTemplateMessage: async (messageId: number, template: string): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/event-msg/${messageId}`, { template });
    return response.data;
  },
};

// Event Message API services
export const eventMessageAPI = {
  // Lấy danh sách event messages
  getEventMessages: async (params?: any): Promise<ApiResponse<any[]>> => {
    const response: AxiosResponse<ApiResponse<any[]>> = await apiClient.get('/event-msg', { params });
    return response.data;
  },

  // Lấy event message
  getEventMessage: async (messageId: string): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/event-msg/${messageId}`);
    return response.data;
  },

  // Tạo event message mới
  createEventMessage: async (messageData: any): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/event-msg', messageData);
    return response.data;
  },

  // Cập nhật event message
  updateEventMessage: async (messageId: string, messageData: any): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/event-msg/${messageId}`, messageData);
    return response.data;
  },

  // Xóa event message
  deleteEventMessage: async (messageId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await apiClient.delete(`/event-msg/${messageId}`);
    return response.data;
  },
};

// Export tất cả API services
export const api = {
  auth: authAPI,
  user: userAPI,
  clan: clanAPI,
  eventMessage: eventMessageAPI,
};

export default api;
