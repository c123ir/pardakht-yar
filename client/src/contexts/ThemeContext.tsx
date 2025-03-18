// client/src/contexts/ThemeContext.tsx
// کانتکست مدیریت تم

import React, { createContext, useState, useEffect } from 'react';

// تایپ‌های مورد نیاز
type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

// ایجاد کانتکست با مقدار پیش‌فرض
const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  toggleTheme: () => {},
});

// کامپوننت Provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // خواندن تم ذخیره شده از localStorage یا استفاده از مقدار پیش‌فرض
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeMode) || 'light';
  });

  // تغییر تم
  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // ذخیره تم در localStorage هنگام تغییر
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
    
    // اعمال کلاس مناسب به بدنه سند
    if (themeMode === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
