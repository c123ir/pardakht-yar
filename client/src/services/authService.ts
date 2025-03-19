// client/src/services/authService.ts
// سرویس احراز هویت

import axios from 'axios';
import { API_URL } from '../config';
import { setAuthToken, getAuthHeader, setUserData, getAuthToken } from '../utils/auth';

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
    
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
      username,
      password,
    });

    // ذخیره توکن و اطلاعات کاربر
    setAuthToken(response.data.token);
    setUserData(response.data.user);

    console.log('Login successful, token saved:', response.data.token);
    console.log('Current token after login:', getAuthToken());
    
    // تنظیم هدر پیش‌فرض برای axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

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
    console.log('Headers:', getAuthHeader());
    
    const response = await axios.get<UserResponse>(`${API_URL}/auth/me`, {
      headers: getAuthHeader(),
    });
    
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