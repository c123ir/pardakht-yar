// client/src/App.tsx
// کامپوننت اصلی برنامه

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { SnackbarProvider } from './contexts/SnackbarContext';
import AppRoutes from './routes';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// پیکربندی RTL برای Material-UI
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const App: React.FC = () => {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <SnackbarProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </SnackbarProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;