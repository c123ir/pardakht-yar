// client/src/services/api.ts
// تنظیمات پایه برای ارتباط با API

import axios, { InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
// ایجاد نمونه axios با تنظیمات پایه
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// افزودن اینترسپتور برای درخواست‌ها
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // افزودن توکن به هدر Authorization اگر موجود باشد
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// افزودن اینترسپتور برای پاسخ‌ها
api.interceptors.response.use(
  (response) => response,
  (error) => {
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