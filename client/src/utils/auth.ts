// client/src/utils/auth.ts
// توابع مربوط به احراز هویت

import { LOCAL_STORAGE_KEYS } from '../config';

/**
 * دریافت توکن احراز هویت از لوکال استوریج
 * @returns توکن احراز هویت یا null
 */
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  
  // اطمینان از اعتبار توکن
  if (token && !isTokenValid(token)) {
    // حذف توکن نامعتبر
    removeAuthToken();
    removeUserData();
    return null;
  }
  
  return token;
};

/**
 * بررسی اعتبار توکن JWT
 * @param token توکن JWT
 * @returns آیا توکن معتبر است یا خیر
 */
export const isTokenValid = (token: string): boolean => {
  try {
    // بررسی ساختار توکن
    if (!token || token.split('.').length !== 3) {
      console.warn('Invalid token structure');
      return false;
    }
    
    // استخراج بخش payload توکن
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // بررسی زمان انقضا
    if (!payload.exp) {
      console.warn('Token has no expiration time');
      return false;
    }
    
    // تبدیل زمان انقضا به میلی‌ثانیه و مقایسه با زمان فعلی
    const expTime = payload.exp * 1000; // تبدیل به میلی‌ثانیه
    const currentTime = Date.now();
    
    console.log(`Token exp time: ${new Date(expTime).toISOString()}, Current time: ${new Date(currentTime).toISOString()}, Valid: ${expTime > currentTime}`);
    
    return expTime > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

/**
 * ذخیره توکن احراز هویت در لوکال استوریج
 * @param token توکن احراز هویت
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * حذف توکن احراز هویت از لوکال استوریج
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * دریافت هدرهای احراز هویت برای استفاده در درخواست‌های API
 * @returns آبجکت حاوی هدرهای احراز هویت
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
  console.log('Current auth token:', token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * بررسی معتبر بودن توکن
 * @returns آیا توکن احراز هویت وجود دارد
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * ذخیره اطلاعات کاربر در لوکال استوریج
 * @param userData اطلاعات کاربر
 */
export const setUserData = (userData: any): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

/**
 * دریافت اطلاعات کاربر از لوکال استوریج
 * @returns اطلاعات کاربر یا null
 */
export const getUserData = (): any | null => {
  const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

/**
 * حذف اطلاعات کاربر از لوکال استوریج
 */
export const removeUserData = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
};

/**
 * خروج کاربر از سیستم و پاک کردن اطلاعات احراز هویت
 */
export const logout = (): void => {
  removeAuthToken();
  removeUserData();
}; 