// client/src/hooks/useAuth.ts
// هوک دسترسی به کانتکست احراز هویت

import { useContext, useCallback } from 'react';
import AuthContext from '../contexts/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};

const updateUserDetails = useCallback((updatedUser: User) => {
  // دیباگ برای بررسی اطلاعات کاربر
  console.log('[Auth] Updating user details:', updatedUser);
  
  // استفاده از لوکال استوریج برای ذخیره کاربر به‌روزرسانی شده
  if (updatedUser) {
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  
  // به‌روزرسانی state کاربر
  setUser(updatedUser);
}, []);