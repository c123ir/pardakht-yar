// client/src/services/authService.ts
// سرویس احراز هویت

import axios from '../utils/axios';  // استفاده از نمونه axios تنظیم شده
import { setAuthToken, setUserData, getAuthToken } from '../utils/auth';

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
    console.log('Login attempt for:', username);
    
    const response = await axios.post<LoginResponse>(`/auth/login`, {
      username,
      password,
    });

    // ذخیره توکن و اطلاعات کاربر
    setAuthToken(response.data.token);
    setUserData(response.data.user);

    console.log('Login successful, token saved:', response.data.token);
    console.log('Current token after login:', getAuthToken());
    
    // دیگر نیازی به تنظیم هدر پیش‌فرض برای axios نیست
    // چون این کار در axios.ts از طریق interceptor انجام می‌شود

    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error: any) {
    console.error('Login error:', error.response || error);
    throw new Error(
      error.response?.data?.message || 'خطا در ورود به سیستم'
    );
  }
};

// دریافت اطلاعات کاربر جاری
const getCurrentUser = async () => {
  try {
    console.log('Getting current user with token:', getAuthToken());
    
    // نیازی به ارسال دستی هدر نیست چون interceptor این کار را انجام می‌دهد
    const response = await axios.get<UserResponse>(`/auth/me`);
    
    return response.data.user;
  } catch (error: any) {
    console.error('Get current user error:', error.response || error);
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت اطلاعات کاربر'
    );
  }
};

export default {
  login,
  getCurrentUser,
};