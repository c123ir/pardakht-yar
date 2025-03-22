// client/src/config.ts
// تنظیمات سیستم

// آدرس API - اطمینان از عدم وجود / اضافی در انتها
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5050/api').replace(/\/$/, '');

// تنظیمات عمومی
export const APP_NAME = 'پرداخت‌یار';
export const APP_VERSION = '0.2.0';

// تنظیمات ذخیره‌سازی لوکال
export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME_MODE: 'theme_mode',
}; 