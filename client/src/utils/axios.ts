// client/src/utils/axios.ts
// تنظیمات پیشفرض axios

import axios from 'axios';
import { API_URL } from '../config';
import { getAuthToken } from './auth';

// تنظیم URL پایه برای همه درخواست‌ها
const instance = axios.create({
  baseURL: API_URL || 'http://localhost:5050/api',
  timeout: 15000, // افزایش تایم‌اوت به 15 ثانیه
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// اضافه کردن اینترسپتور برای ارسال توکن در هدر درخواست‌ها
instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token:', token.substring(0, 15) + '...');
    } else {
      console.log('Request without token');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// اضافه کردن اینترسپتور برای مدیریت خطاها
instance.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status || error.message);
    
    // اگر خطای 401 رخ داد (عدم احراز هویت)، کاربر را به صفحه ورود هدایت کن
    if (error.response && error.response.status === 401) {
      console.log('Authentication failed (401), redirecting to login...');
      
      // پاک کردن توکن از حافظه محلی با استفاده از localStorage مستقیم
      // مراقب باشیم که در یک رویداد useEffect بی‌نهایت قرار نگیریم
      
      // به جای ریدایرکت مستقیم، یک ایونت منتشر می‌کنیم
      const event = new CustomEvent('auth:unauthorized', { detail: error });
      window.dispatchEvent(event);
    }
    
    return Promise.reject(error);
  }
);

export default instance; 