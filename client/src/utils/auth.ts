// client/src/utils/auth.ts
// توابع مربوط به احراز هویت

import { LOCAL_STORAGE_KEYS } from '../config';

/**
 * دریافت توکن احراز هویت از لوکال استوریج
 * @returns توکن احراز هویت یا null
 */
export const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    
    // اگر توکن وجود ندارد، نیازی به بررسی نیست
    if (!token) {
      return null;
    }
    
    // اطمینان از اعتبار توکن
    if (!isTokenValid(token)) {
      console.warn('Invalid or expired token found, removing...');
      // حذف توکن نامعتبر
      removeAuthToken();
      removeUserData();
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
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
    
    // افزودن یک بافر 5 دقیقه‌ای برای زمان انقضا
    const EXPIRATION_BUFFER = 5 * 60 * 1000; // 5 دقیقه به میلی‌ثانیه
    const isValid = expTime > (currentTime + EXPIRATION_BUFFER);
    
    if (!isValid) {
      console.warn(`Token expired or expiring soon: ${new Date(expTime).toISOString()}, Current time: ${new Date(currentTime).toISOString()}`);
    }
    
    return isValid;
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
  try {
    if (!token) {
      console.warn('Attempted to save empty token');
      return;
    }
    
    // بررسی اعتبار توکن قبل از ذخیره
    if (!isTokenValid(token)) {
      console.warn('Attempted to save invalid token');
      return;
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
    console.log('Auth token saved successfully');
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
};

/**
 * حذف توکن احراز هویت از لوکال استوریج
 */
export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    console.log('Auth token removed');
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

/**
 * دریافت هدرهای احراز هویت برای استفاده در درخواست‌های API
 * @returns آبجکت حاوی هدرهای احراز هویت
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
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
  try {
    if (!userData) {
      console.warn('Attempted to save empty user data');
      return;
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

/**
 * دریافت اطلاعات کاربر از لوکال استوریج
 * @returns اطلاعات کاربر یا null
 */
export const getUserData = (): any | null => {
  try {
    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * حذف اطلاعات کاربر از لوکال استوریج
 */
export const removeUserData = (): void => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    console.log('User data removed');
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

/**
 * خروج کاربر از سیستم و پاک کردن اطلاعات احراز هویت
 */
export const logout = (): void => {
  try {
    removeAuthToken();
    removeUserData();
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
  }
}; 