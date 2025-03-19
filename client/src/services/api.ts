// client/src/services/api.ts
// سرویس پایه API

import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../config';
import { getAuthHeader } from '../utils/auth';

// ایجاد نمونه axios با تنظیمات پایه
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// افزودن interceptor برای اضافه کردن توکن به هدر درخواست‌ها
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthHeader();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// افزودن interceptor برای مدیریت خطاهای پاسخ
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // بررسی خطای 401 (احراز هویت نشده)
    if (error.response && error.response.status === 401) {
      console.error('خطای احراز هویت: توکن نامعتبر یا منقضی شده است');
      // در اینجا می‌توانید کاربر را به صفحه ورود هدایت کنید یا اقدامات دیگری انجام دهید
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;