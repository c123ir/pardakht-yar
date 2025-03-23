// client/src/utils/axios.ts
// تنظیمات پیشفرض axios

import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from '../config';

// تنظیم URL پایه برای همه درخواست‌ها
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// اضافه کردن اینترسپتور برای ارسال توکن در هدر درخواست‌ها
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// اضافه کردن اینترسپتور برای مدیریت خطاها
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // اگر خطای 401 رخ داد (عدم احراز هویت)، کاربر را به صفحه ورود هدایت کن
    if (error.response && error.response.status === 401) {
      // پاک کردن توکن از حافظه محلی
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
      // هدایت به صفحه ورود
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance; 