// client/src/contexts/AuthContext.tsx
// کانتکست مدیریت احراز هویت

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

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
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('خطا در دریافت اطلاعات کاربر:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // تابع ورود
  const login = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { user: userData, token } = await authService.login(username, password);
      
      // ذخیره توکن در localStorage
      localStorage.setItem('token', token);
      
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // تابع خروج
  const logout = () => {
    localStorage.removeItem('token');
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