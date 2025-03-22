// client/src/utils/axios.ts
// پیکربندی axios برای استفاده در سیستم

import axios from 'axios';
import { API_URL } from '../config';
import { getAuthToken, removeAuthToken, removeUserData } from './auth';

// متغیر برای جلوگیری از نمایش پیام‌های تکراری
let isRedirecting = false;

// ایجاد یک نمونه axios با تنظیمات پیش‌فرض
const instance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 ثانیه
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // برای تشخیص درخواست‌های XHR
  },
  // فعال کردن ارسال credentials برای CORS
  withCredentials: true
});

// اضافه کردن هدر احراز هویت به تمام درخواست‌ها
instance.interceptors.request.use(
  (config) => {
    console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`);
    
    const token = getAuthToken();
    
    if (token) {
      // تنظیم هدر Authorization
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[Axios Interceptor] Token added to request headers');
    } else {
      console.log('[Axios Interceptor] No token available, request without Authorization');
    }
    
    // اصلاح مسیر API برای جلوگیری از تکرار /api
    if (config.url && config.url.startsWith('/api') && config.baseURL?.includes('/api')) {
      config.url = config.url.replace(/^\/api/, '');
      console.log('[Axios Interceptor] Fixing duplicated /api path:', config.url);
    }
    
    // اضافه کردن پارامتر زمانی برای جلوگیری از کش
    const timestamp = Date.now();
    const separator = config.url?.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}_t=${timestamp}`;
    
    return config;
  },
  (error) => {
    console.error('[Axios Interceptor] Request error:', error);
    return Promise.reject(error);
  }
);

// پردازش خطاهای پاسخ
instance.interceptors.response.use(
  (response) => {
    console.log(`[Axios Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    // لاگ خطا برای دیباگ
    console.error('[Axios Error] Full error object:', error);
    
    // لاگ اضافی برای مشکلات CORS
    if (error.message && error.message.includes('Network Error')) {
      console.error('[Axios CORS Error] This might be a CORS issue - check server CORS settings');
      // تلاش مجدد با تنظیمات متفاوت برای CORS
      if (error.config && !error.config._retryWithoutCredentials) {
        console.log('[Axios CORS] Retrying request without credentials...');
        const newConfig = { ...error.config };
        newConfig.withCredentials = false; // غیرفعال کردن credentials
        newConfig._retryWithoutCredentials = true; // جلوگیری از حلقه بی‌نهایت
        return instance(newConfig);
      }
    }
    
    if (error.response) {
      // خطای سرور با کد وضعیت
      console.error(`[Axios Error] ${error.response.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response.data);
      
      // بررسی خطای 401 (عدم احراز هویت)
      if (error.response.status === 401) {
        console.warn('[Axios Error] Authentication error - token may be invalid or expired');
        
        // پاک کردن توکن و داده‌های کاربر
        removeAuthToken();
        removeUserData();
        
        // بررسی اینکه آیا در حال حاضر در صفحه لاگین هستیم یا خیر
        // و جلوگیری از ریدایرکت تکراری
        if (!window.location.pathname.includes('/login') && !isRedirecting) {
          isRedirecting = true;
          
          // نمایش پیام به کاربر
          const messageElement = document.createElement('div');
          messageElement.style.position = 'fixed';
          messageElement.style.top = '20px';
          messageElement.style.left = '50%';
          messageElement.style.transform = 'translateX(-50%)';
          messageElement.style.backgroundColor = '#f44336';
          messageElement.style.color = 'white';
          messageElement.style.padding = '15px 30px';
          messageElement.style.borderRadius = '4px';
          messageElement.style.zIndex = '2000';
          messageElement.style.fontFamily = 'Vazirmatn, Tahoma, sans-serif';
          messageElement.style.direction = 'rtl';
          messageElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
          messageElement.textContent = 'نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.';
          
          document.body.appendChild(messageElement);
          
          // بعد از مدتی پیام را حذف کن
          setTimeout(() => {
            if (messageElement.parentNode) {
              document.body.removeChild(messageElement);
            }
          }, 5000);
          
          // هدایت به صفحه ورود بعد از تاخیر کوتاه
          setTimeout(() => {
            window.location.href = '/login';
            isRedirecting = false;
          }, 1500);
        }
      }
    } else if (error.request) {
      // درخواست ارسال شد اما پاسخی دریافت نشد
      console.error('[Axios Error] No response received:', error.request);
      
      // بررسی وضعیت اتصال به اینترنت
      if (!navigator.onLine) {
        console.error('[Axios Error] No internet connection');
        // نمایش یک هشدار به کاربر
        const offlineMessage = document.createElement('div');
        offlineMessage.style.position = 'fixed';
        offlineMessage.style.top = '20px';
        offlineMessage.style.left = '50%';
        offlineMessage.style.transform = 'translateX(-50%)';
        offlineMessage.style.backgroundColor = '#ff9800';
        offlineMessage.style.color = 'white';
        offlineMessage.style.padding = '15px 30px';
        offlineMessage.style.borderRadius = '4px';
        offlineMessage.style.zIndex = '2000';
        offlineMessage.style.fontFamily = 'Vazirmatn, Tahoma, sans-serif';
        offlineMessage.style.direction = 'rtl';
        offlineMessage.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        offlineMessage.textContent = 'اتصال به اینترنت قطع شده است. لطفاً اتصال خود را بررسی کنید.';
        
        document.body.appendChild(offlineMessage);
        
        // حذف پیام پس از مدتی
        setTimeout(() => {
          if (offlineMessage.parentNode) {
            document.body.removeChild(offlineMessage);
          }
        }, 5000);
      }
    } else {
      // خطا در تنظیم درخواست
      console.error('[Axios Error] Request configuration error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

console.log('[Axios Config] Instance configured with baseURL:', API_URL);

export default instance; 