import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/v1/auth/login', { email, password });
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/v1/auth/logout');
  },

  me: async (): Promise<User> => {
    const response = await api.get('/v1/auth/me');
    return response.data.data;
  },
};
