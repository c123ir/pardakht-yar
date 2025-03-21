// client/src/App.tsx
// کامپوننت اصلی برنامه

import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from 'react-error-boundary';
import { Button, Box, Typography } from '@mui/material';

// مسیرهای برنامه
import AppRoutes from './routes';

// مدیریت ورود و احراز هویت
import { AuthProvider } from './contexts/AuthContext';

// کامپوننت‌های اضافی
import { ToastProvider } from './contexts/ToastContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { ImageProvider } from './contexts/ImageContext';

// ایجاد تم سفارشی
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'IRANSans, Arial',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#3a7bd5',
    },
    secondary: {
      main: '#00d2ff',
    },
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: 0,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction: 'rtl',
          margin: 0,
          padding: 0,
        },
        '*': {
          boxSizing: 'border-box',
        },
        '#root': {
          direction: 'rtl',
          minHeight: '100vh',
        },
      },
    },
  },
});

// تنظیمات RTL برای Material-UI
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
  prepend: true,
});

// کامپوننت نمایش خطا
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
      textAlign="center"
    >
      <Typography variant="h4" component="h1" gutterBottom color="error">
        خطایی رخ داده است
      </Typography>
      <Typography variant="body1" gutterBottom>
        {error.message}
      </Typography>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary} sx={{ mt: 2 }}>
        تلاش مجدد
      </Button>
    </Box>
  );
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <SnackbarProvider>
            <ToastProvider>
              <ImageProvider>
                <Router>
                  <AuthProvider>
                    <AppRoutes />
                  </AuthProvider>
                </Router>
              </ImageProvider>
            </ToastProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}

export default App;