// client/src/services/authService.ts
// سرویس احراز هویت

import api from './api';

// تایپ پاسخ ورود
interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    role: string;
  };
}

// تایپ پاسخ پروفایل کاربر
interface UserResponse {
  success: boolean;
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string | null;
    role: string;
  };
}

// تابع ورود
const login = async (username: string, password: string) => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      username,
      password,
    });

    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ورود به سیستم'
    );
  }
};

// دریافت اطلاعات کاربر جاری
const getCurrentUser = async () => {
  try {
    const response = await api.get<UserResponse>('/auth/me');
    return response.data.user;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت اطلاعات کاربر'
    );
  }
};

export default {
  login,
  getCurrentUser,
};