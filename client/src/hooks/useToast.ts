// client/src/hooks/useToast.ts
// هوک مدیریت نمایش پیام‌ها

import { useState } from 'react';

interface ToastState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    setToast({
      open: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast({
      ...toast,
      open: false,
    });
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};
