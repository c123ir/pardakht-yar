// client/src/contexts/AuthContext.tsx
// کانتکست مدیریت احراز هویت

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { getAuthToken, getUserData, removeAuthToken, removeUserData } from '../utils/auth';
import axiosInstance from '../utils/axios';

// تایپ‌های مورد نیاز
interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// ایجاد کانتکست با مقدار پیش‌فرض
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: () => {},
});

// کامپوننت Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // بررسی اعتبار توکن هنگام بارگذاری
  useEffect(() => {
    const checkAuth = async () => {
      // بررسی وجود توکن در localStorage
      const token = getAuthToken(); // این تابع اکنون اعتبار توکن را نیز بررسی می‌کند
      console.log('Initial token check:', token ? 'Valid token exists' : 'No valid token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      // ابتدا از داده‌های محلی استفاده می‌کنیم
      const localUserData = getUserData();
      if (localUserData) {
        setUser(localUserData);
      }
      
      // سپس از سرور برای تایید اطلاعات استفاده می‌کنیم
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('خطا در دریافت اطلاعات کاربر:', err);
        // حذف داده‌های کاربر در صورت خطا
        removeAuthToken();
        removeUserData();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // اضافه کردن بررسی دوره‌ای اعتبار توکن
    const tokenCheckInterval = setInterval(() => {
      const token = getAuthToken();
      // اگر کاربر لاگین است اما توکن معتبر نیست
      if (user && !token) {
        console.warn('Token expired during session, logging out...');
        logout();
      }
    }, 60000); // هر دقیقه بررسی کن
    
    return () => clearInterval(tokenCheckInterval);
  }, []);

  // تابع ورود
  const login = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { user: userData } = await authService.login(username, password);
      
      setUser(userData);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'خطا در ورود به سیستم';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // تابع خروج
  const logout = () => {
    // پاک کردن Authorization هدر
    delete axiosInstance.defaults.headers.common['Authorization'];
    
    // پاک کردن داده‌های localStorage
    removeAuthToken();
    removeUserData();
    
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;