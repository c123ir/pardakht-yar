// client/src/contexts/ImageContext.tsx
// کانتکست مدیریت تصاویر برای استفاده در کل پروژه

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import userService from '../services/userService';
import { API_URL } from '../config';

export interface ImageContextType {
  isUploading: boolean;
  uploadProgress: number;
  uploadAvatar: (file: File, userId?: string) => Promise<{ path: string }>;
  uploadImage: (file: File, folder?: string) => Promise<string>;
  getImageUrl: (relativePath: string | null | undefined) => string;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImages = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // تنظیمات از متغیرهای محیطی
  const useUiAvatars = import.meta.env.VITE_USE_UI_AVATARS === 'true';
  const uiAvatarsUrl = import.meta.env.VITE_UI_AVATARS_URL || 'https://ui-avatars.com/api';
  
  // تابع دریافت آواتار از سرویس UI Avatars
  const getUiAvatarUrl = useCallback((name: string, size: number = 100): string => {
    const params = new URLSearchParams({
      name,
      size: String(size),
      background: 'random',
      color: 'ffffff',
    });
    return `${uiAvatarsUrl}?${params.toString()}`;
  }, [uiAvatarsUrl]);
  
  // آپلود آواتار پروفایل
  const uploadAvatar = async (file: File, userId?: string): Promise<{ path: string }> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      // اضافه کردن شناسه کاربر در صورت وجود (برای ادمین)
      const result = await userService.uploadAvatar(formData, userId);
      
      setUploadProgress(100);
      return result;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  // آپلود سایر تصاویر
  const uploadImage = async (file: File, folder = 'general'): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      
      // این API باید بعداً پیاده‌سازی شود
      const result = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      }).then(res => res.json());
      
      if (!result.success) {
        throw new Error(result.message || 'خطا در آپلود تصویر');
      }
      
      setUploadProgress(100);
      return result.filePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  // تبدیل مسیر نسبی به URL کامل
  const getImageUrl = useCallback((path?: string | null): string => {
    if (!path) {
      // اگر مسیر نداریم از آواتار پیش‌فرض استفاده می‌کنیم
      return '/avatar.jpg';
    }
    
    // بررسی می‌کنیم آیا مسیر یک URL کامل است
    if (path.startsWith('http://') || path.startsWith('https://')) {
      // حتی برای URL های کامل، یک پارامتر زمان اضافه می‌کنیم تا کش نشوند
      const separator = path.includes('?') ? '&' : '?';
      return `${path}${separator}t=${Date.now()}&nocache=true`;
    }
    
    // اگر مسیر با '/' شروع نشده باشد، اضافه می‌کنیم
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // اگر مسیر آواتار است
    if (normalizedPath.includes('/avatars/')) {
      // تنظیم URL کامل برای تصویر آواتار
      const baseUrl = API_URL.replace('/api', '');
      
      // برای جلوگیری از مشکل کش، یک تایم استمپ اضافه می‌کنیم و مقدار آن را کاملاً تصادفی می‌کنیم
      const timestamp = Date.now();
      const randomValue = Math.floor(Math.random() * 1000000);
      const fullUrl = `${baseUrl}${normalizedPath}?t=${timestamp}&r=${randomValue}&nocache=true`;
      
      return fullUrl;
    }
    
    // برای سایر تصاویر، مسیر را به URL API اضافه می‌کنیم
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${normalizedPath}?t=${Date.now()}&nocache=true`;
  }, []);
  
  return (
    <ImageContext.Provider
      value={{
        isUploading,
        uploadProgress,
        uploadAvatar,
        uploadImage,
        getImageUrl,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContext; 