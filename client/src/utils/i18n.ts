// کانفیگ پیکربندی i18n برای پشتیبانی چندزبانگی (فارسی/انگلیسی)

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// منابع ترجمه
const resources = {
  fa: {
    translation: {
      // کلمات و عبارات عمومی
      'avatar': 'آواتار',
      'save': 'ذخیره',
      'cancel': 'انصراف',
      'loading': 'در حال بارگذاری...',
      'error': 'خطا',
      'success': 'موفقیت',
      'processing': 'در حال پردازش...',
      
      // پیام‌های خطا
      'errorUploadingAvatar': 'خطا در آپلود آواتار',
      'fileSizeError': 'حجم فایل نباید بیشتر از 5 مگابایت باشد',
      'fileTypeError': 'فقط فایل‌های تصویری مجاز هستند',
      
      // عناوین دیالوگ‌ها
      'cropAvatar': 'برش تصویر پروفایل',
      'zoom': 'بزرگنمایی',
      'rotation': 'چرخش',
    }
  },
  en: {
    translation: {
      // عمومی
      'avatar': 'Avatar',
      'save': 'Save',
      'cancel': 'Cancel',
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      'processing': 'Processing...',
      
      // پیام‌های خطا
      'errorUploadingAvatar': 'Error uploading avatar',
      'fileSizeError': 'File size should not exceed 5 MB',
      'fileTypeError': 'Only image files are allowed',
      
      // عناوین دیالوگ‌ها
      'cropAvatar': 'Crop Avatar',
      'zoom': 'Zoom',
      'rotation': 'Rotation',
    }
  }
};

// پیکربندی i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fa', // زبان پیش‌فرض
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false, // واکشی‌ها در React به صورت خودکار escape می‌شوند
    },
    react: {
      useSuspense: true,
    }
  });

export default i18n; 