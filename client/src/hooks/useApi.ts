import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getAuthToken } from '../utils/auth';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

export function useApi() {
  // ایجاد نمونه axios با تنظیمات پایه
  const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 ثانیه تایم‌اوت
  });

  // افزودن interceptor به درخواست‌ها
  api.interceptors.request.use(
    (config) => {
      // افزودن توکن احراز هویت به هدر درخواست
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // افزودن interceptor به پاسخ‌ها
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      // بررسی و پردازش پاسخ موفق
      console.log(`API Response: ${response.status} ${response.config.url}`);
      
      // ساخت ساختار پاسخ یکنواخت
      const apiResponse: ApiResponse = {
        success: true,
        data: response.data,
        status: response.status,
      };
      
      return apiResponse as unknown as AxiosResponse;
    },
    (error) => {
      // پردازش خطاها
      console.error('API Response Error:', error);
      
      // ساخت ساختار پاسخ خطا
      const apiResponse: ApiResponse = {
        success: false,
        message: error.response?.data?.message || error.message || 'خطایی رخ داده است',
        status: error.response?.status,
      };
      
      // بررسی خطای 401 (عدم احراز هویت)
      if (error.response?.status === 401) {
        console.warn('Authentication error - user not authenticated or token expired');
        // اینجا می‌توان منطق خروج از سیستم را پیاده‌سازی کرد
        // مثلاً: logout();
      }
      
      return apiResponse;
    }
  );

  // متدهای کمکی برای فراخوانی API
  const get = async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
    return api.get(url, { params });
  };

  const post = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    return api.post(url, data);
  };

  const put = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    return api.put(url, data);
  };

  const del = async <T>(url: string): Promise<ApiResponse<T>> => {
    return api.delete(url);
  };

  return {
    api,
    get,
    post,
    put,
    delete: del,
  };
}

export default useApi; 