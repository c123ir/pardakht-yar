// client/src/services/authService.ts
// سرویس احراز هویت

import axios from '../utils/axios';  // استفاده از نمونه axios تنظیم شده
import { setAuthToken, setUserData, getAuthToken } from '../utils/auth';

// حداکثر تعداد تلاش مجدد
const MAX_RETRY_ATTEMPTS = 2;

// تایپ پاسخ ورود
interface ApiResponse {
  status: string;
  data?: {
    token: string;
    user: {
      id: number;
      username: string;
      fullName: string;
      role: string;
    };
  };
  message?: string;
}

// تابع ورود
const login = async (username: string, password: string, retryCount = 0) => {
  try {
    console.log(`Login attempt for: ${username} (retry: ${retryCount}/${MAX_RETRY_ATTEMPTS})`);
    
    // ساخت آبجکت برای ارسال به سرور
    const payload = {
      username,
      password,
    };
    
    // چاپ اطلاعات ارسالی برای دیباگ (بدون نمایش پسورد)
    console.log('Sending login request with data:', { ...payload, password: '******' });
    
    const response = await axios.post<ApiResponse>(`/auth/login`, payload);

    console.log('Raw login response:', response.data);
    
    // ذخیره توکن و اطلاعات کاربر
    if (response.data.status === 'success' && response.data.data) {
      const { token, user } = response.data.data;
      
      if (!token) {
        console.error('No token received in the response');
        throw new Error('توکن احراز هویت دریافت نشد');
      }
      
      setAuthToken(token);
      setUserData(user);

      console.log('Login successful, token saved:', token);
      console.log('Current token after login:', getAuthToken());
      
      return {
        user,
        token,
      };
    } else {
      throw new Error(response.data.message || 'ساختار پاسخ API نامعتبر است');
    }
  } catch (error: any) {
    // لاگ خطا برای دیباگ
    console.error('Login error:', error.response || error);
    
    // بررسی خطای شبکه
    if (error.message === 'Network Error' && retryCount < MAX_RETRY_ATTEMPTS) {
      console.log(`Network error during login, retrying (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})...`);
      // تاخیر کوتاه قبل از تلاش مجدد
      await new Promise(resolve => setTimeout(resolve, 1000));
      return login(username, password, retryCount + 1);
    }
    
    // بررسی خطای CORS
    if (error.message && error.message.includes('Cross-Origin') && retryCount < MAX_RETRY_ATTEMPTS) {
      console.log(`CORS error during login, retrying with alternative method (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})...`);
      // تلاش مجدد با کانفیگ متفاوت
      try {
        const response = await fetch(`${axios.defaults.baseURL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.data) {
            const { token, user } = data.data;
            
            if (!token) {
              throw new Error('توکن احراز هویت دریافت نشد');
            }
            
            setAuthToken(token);
            setUserData(user);
            
            return {
              user,
              token,
            };
          }
        }
        // اگر اینجا رسیدیم، یعنی fetch موفقیت‌آمیز نبوده
        throw new Error('خطا در ارتباط با سرور');
      } catch (fetchError) {
        console.error('Login fetch fallback error:', fetchError);
      }
    }
    
    throw new Error(
      error.response?.data?.message || 'خطا در ورود به سیستم'
    );
  }
};

// دریافت اطلاعات کاربر جاری
const getCurrentUser = async (retryCount = 0) => {
  try {
    console.log(`Getting current user with token (retry: ${retryCount}/${MAX_RETRY_ATTEMPTS}):`, getAuthToken());
    
    // نیازی به ارسال دستی هدر نیست چون interceptor این کار را انجام می‌دهد
    const response = await axios.get(`/auth/me`);
    
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('ساختار پاسخ API نامعتبر است');
    }
  } catch (error: any) {
    console.error('Get current user error:', error.response || error);
    
    // بررسی خطای شبکه و تلاش مجدد
    if (error.message === 'Network Error' && retryCount < MAX_RETRY_ATTEMPTS) {
      console.log(`Network error during getCurrentUser, retrying (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})...`);
      // تاخیر کوتاه قبل از تلاش مجدد
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getCurrentUser(retryCount + 1);
    }
    
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت اطلاعات کاربر'
    );
  }
};

export default {
  login,
  getCurrentUser,
};