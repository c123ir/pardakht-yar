// client/src/contexts/AuthContext.tsx
// کانتکست مدیریت احراز هویت

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { getAuthToken, getUserData, removeAuthToken, removeUserData, logout as authLogout } from '../utils/auth';
import axiosInstance from '../utils/axios';

// تایپ‌های مورد نیاز
interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  avatar?: string; // اضافه کردن فیلد آواتار
  email?: string;
  phone?: string;
  isActive?: boolean;
  _avatarUpdated?: number; // اضافه کردن فیلد برای رفرش آواتار
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserDetails: (user: User) => void;
}

// ایجاد کانتکست با مقدار پیش‌فرض
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: () => {},
  updateUserDetails: () => {},
});

// کامپوننت Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // تابع خروج
  const logout = useCallback(() => {
    console.log('Logging out user...');
    
    // پاک کردن Authorization هدر
    if (axiosInstance.defaults.headers.common) {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
    
    // پاک کردن داده‌های localStorage
    authLogout();
    
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // گوش دادن به رویداد خروج
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('Unauthorized event received, logging out...');
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  // بررسی اعتبار توکن هنگام بارگذاری
  useEffect(() => {
    const checkAuth = async () => {
      try {
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
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          // اگر داده‌ای دریافت نشد، خروج انجام شود
          logout();
        }
      } catch (err) {
        console.error('خطا در دریافت اطلاعات کاربر:', err);
        // حذف داده‌های کاربر در صورت خطا
        logout();
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
  }, [logout]);

  // افزودن useEffect برای خواندن کاربر از localStorage در هر رندر
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, [user]);

  // تابع ورود
  const login = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const authResult = await authService.login(username, password);
      
      if (authResult && authResult.user) {
        setUser(authResult.user);
        navigate('/dashboard');
      } else {
        throw new Error('اطلاعات کاربر دریافت نشد');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'خطا در ورود به سیستم';
      console.error('Login error in AuthContext:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // تابع به‌روزرسانی اطلاعات کاربر
  const updateUserDetails = useCallback((updatedUser: User) => {
    console.log('Updating user details:', updatedUser);
    
    const userData = {
      ...user,
      ...updatedUser,
      _avatarUpdated: Date.now() // اضافه کردن timestamp برای مجبور کردن به رفرش آواتار
    };
    
    // ذخیره اطلاعات جدید کاربر در localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // به‌روزرسانی state
    setUser(userData);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        updateUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;