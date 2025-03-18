// client/src/services/api.ts
// تنظیمات پایه برای ارتباط با API

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ایجاد نمونه axios با تنظیمات پایه
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// افزودن اینترسپتور برای درخواست‌ها
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // افزودن توکن به هدر Authorization اگر موجود باشد
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// افزودن اینترسپتور برای پاسخ‌ها
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // بررسی خطای 401 برای توکن منقضی شده
    if (error.response?.status === 401) {
      // پاک کردن توکن و ریدایرکت به صفحه ورود
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
