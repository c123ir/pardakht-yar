import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    // اضافه کردن Breakpoint سفارشی
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true; // اضافه کردن یک breakpoint جدید
  }
  
  interface Theme {
    customShadows: {
      button: string;
      card: string;
      dialog: string;
    };
    customTransitions: {
      fast: string;
      medium: string;
      slow: string;
    };
  }
  
  interface ThemeOptions {
    customShadows?: {
      button?: string;
      card?: string;
      dialog?: string;
    };
    customTransitions?: {
      fast?: string;
      medium?: string;
      slow?: string;
    };
  }
}

// تنظیمات مشترک بین تم روشن و تاریک
const commonSettings = {
  direction: 'rtl' as const,
  typography: {
    fontFamily: 'IRANSans, Vazirmatn, Tahoma, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  customShadows: {
    button: '0 4px 10px rgba(0, 0, 0, 0.15)',
    card: '0 8px 24px rgba(0, 0, 0, 0.12)',
    dialog: '0 16px 32px rgba(0, 0, 0, 0.15)',
  },
  customTransitions: {
    fast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    medium: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// تم روشن
const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3', // آبی
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057', // صورتی
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
});

// تم تاریک
const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#42a5f5', // آبی روشن‌تر برای تم تاریک
      light: '#80d6ff',
      dark: '#0077c2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f06292', // صورتی روشن‌تر برای تم تاریک
      light: '#ff94c2',
      dark: '#ba2d65',
      contrastText: '#fff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

// اعمال فونت‌های responsive
const theme = (mode: 'light' | 'dark') => 
  responsiveFontSizes(mode === 'light' ? lightTheme : darkTheme);

export default theme; 