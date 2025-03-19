// client/src/utils/axios.ts
// پیکربندی axios برای استفاده در سیستم

import axios from 'axios';
import { API_URL } from '../config';
import { getAuthToken } from './auth';

// ایجاد یک نمونه axios با تنظیمات پیش‌فرض
const instance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 ثانیه
  headers: {
    'Content-Type': 'application/json',
  },
});

// اضافه کردن هدر احراز هویت به تمام درخواست‌ها
instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// پردازش خطاهای پاسخ
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // خطای سرور با کد وضعیت
      console.error('API Error:', error.response.status, error.response.data);
      
      // بررسی خطای 401 (عدم احراز هویت)
      if (error.response.status === 401) {
        console.warn('Authentication error - redirecting to login');
        // در اینجا می‌توان کاربر را به صفحه ورود هدایت کرد
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // درخواست ارسال شد اما پاسخی دریافت نشد
      console.error('API Request Error - No response:', error.request);
    } else {
      // خطا در تنظیم درخواست
      console.error('API Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// تنظیم هدر احراز هویت در هنگام بارگذاری اولیه برنامه
const token = getAuthToken();
if (token) {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  console.log('Setting default Authorization header with token');
}

export default instance; 