// client/src/contexts/ImageContext.tsx
// کانتکست مدیریت تصاویر برای استفاده در کل پروژه

import React, { createContext, useContext, useState, ReactNode } from 'react';
import userService from '../services/userService';

export interface ImageContextType {
  isUploading: boolean;
  uploadProgress: number;
  uploadAvatar: (file: File) => Promise<string>;
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
  
  // آپلود آواتار پروفایل
  const uploadAvatar = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      // بعد از پیاده‌سازی کامل کامپوننت و API، این فانکشن باید پیشرفت آپلود را نیز گزارش دهد
      const result = await userService.uploadAvatar(formData);
      
      setUploadProgress(100);
      return result.filePath;
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
  
  // تبدیل مسیر نسبی تصویر به URL کامل
  const getImageUrl = (relativePath: string | null | undefined): string => {
    if (!relativePath) {
      return '';
    }
    
    // اگر مسیر با http شروع شده باشد، به صورت مستقیم برگردانده می‌شود
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    
    // آدرس سرور
    const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5050';
    
    // اطمینان از شروع مسیر با /
    const normalizedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    
    // ساخت آدرس کامل تصویر
    const fullUrl = `${serverUrl}${normalizedPath}`;
    
    // برای دیباگ
    console.log('Image context:', {
      serverUrl,
      relativePath,
      normalizedPath,
      fullUrl
    });
    
    return fullUrl;
  };
  
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