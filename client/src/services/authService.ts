// client/src/services/authService.ts
// سرویس احراز هویت

import axios from '../utils/axios';  // استفاده از نمونه axios تنظیم شده
import { setAuthToken, setUserData, getAuthToken } from '../utils/auth';

// تایپ پاسخ ورود
interface ApiResponse {
  status: string;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      fullName: string;
      role: string;
    };
  };
}

// تابع ورود
const login = async (username: string, password: string) => {
  try {
    console.log('Login attempt for:', username);
    
    const response = await axios.post<ApiResponse>(`/auth/login`, {
      username,
      password,
    });

    console.log('Raw login response:', response.data);
    
    // ذخیره توکن و اطلاعات کاربر
    if (response.data.status === 'success' && response.data.data) {
      const { token, user } = response.data.data;
      
      if (!token) {
        console.error('No token received in the response');
        throw new Error('توکن احراز هویت دریافت نشد');
      }
      
      setAuthToken(token);
      setUserData(user);

      console.log('Login successful, token saved:', token);
      console.log('Current token after login:', getAuthToken());
      
      return {
        user,
        token,
      };
    } else {
      throw new Error('ساختار پاسخ API نامعتبر است');
    }
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
    const response = await axios.get(`/auth/me`);
    
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('ساختار پاسخ API نامعتبر است');
    }
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