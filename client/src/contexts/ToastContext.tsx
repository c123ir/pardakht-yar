// client/src/contexts/ToastContext.tsx
// کانتکست مدیریت پیام‌های اطلاع‌رسانی (Toast)

import React, { createContext, useContext } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useToast as useToastHook } from '../hooks/useToast';

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast, showToast, hideToast } = useToastHook();

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={hideToast} severity={toast.type} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast باید درون ToastProvider استفاده شود');
  }
  return context;
}; 