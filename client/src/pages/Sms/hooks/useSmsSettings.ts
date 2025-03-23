// client/src/pages/Sms/hooks/useSmsSettings.ts
// هوک کاستوم برای مدیریت تنظیمات پیامک

import { useState, useEffect } from 'react';
import { SmsSettings, SmsProvider } from '../types';

/**
 * هوک کاستوم برای مدیریت تنظیمات پیامک
 */
export const useSmsSettings = () => {
  // مقادیر اولیه تنظیمات
  const defaultSettings: SmsSettings = {
    provider: SmsProvider.KAVENEGAR,
    username: '',
    password: '',
    apiKey: '',
    apiUrl: '',
    senderNumber: '',
    useLocalBlacklist: false,
    enableDeliveryReports: true,
  };

  // وضعیت‌های کامپوننت
  const [settings, setSettings] = useState<SmsSettings>(defaultSettings);
  const [errors, setErrors] = useState<{
    provider?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    senderNumber?: string;
    apiUrl?: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showAPIKey, setShowAPIKey] = useState<boolean>(false);
  const [testConnectionLoading, setTestConnectionLoading] = useState<boolean>(false);
  const [testConnectionResult, setTestConnectionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  /**
   * دریافت تنظیمات از سرور
   */
  const fetchSettings = async () => {
    setLoading(true);
    
    try {
      // در یک پروژه واقعی، اینجا یک درخواست API به سمت سرور ارسال می‌شود
      // برای توسعه از داده‌های نمونه استفاده می‌کنیم
      setTimeout(() => {
        const mockSettings: SmsSettings = {
          provider: SmsProvider.KAVENEGAR,
          username: 'username123',
          password: 'password123',
          apiKey: 'abcd1234efgh5678ijkl9012',
          apiUrl: '',
          senderNumber: '3000123456',
          useLocalBlacklist: true,
          enableDeliveryReports: true,
        };
        
        setSettings(mockSettings);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('خطا در دریافت تنظیمات پیامک:', error);
      setLoading(false);
    }
  };

  /**
   * ذخیره تنظیمات در سرور
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی فرم
    const validationErrors: {
      provider?: string;
      username?: string;
      password?: string;
      apiKey?: string;
      senderNumber?: string;
      apiUrl?: string;
    } = {};
    
    if (!settings.provider) {
      validationErrors.provider = 'انتخاب سرویس‌دهنده الزامی است';
    }
    
    if (settings.provider !== SmsProvider.CUSTOM) {
      if (!settings.username) {
        validationErrors.username = 'نام کاربری الزامی است';
      }
      
      if (!settings.password) {
        validationErrors.password = 'رمز عبور الزامی است';
      }
    }
    
    if (!settings.apiKey) {
      validationErrors.apiKey = 'کلید API الزامی است';
    }
    
    if (!settings.senderNumber) {
      validationErrors.senderNumber = 'شماره خط ارسال الزامی است';
    }
    
    if (settings.provider === SmsProvider.CUSTOM && !settings.apiUrl) {
      validationErrors.apiUrl = 'آدرس وب‌سرویس الزامی است';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // پاک کردن خطاها
    setErrors({});
    setSaveLoading(true);
    
    try {
      // در یک پروژه واقعی، اینجا یک درخواست API به سمت سرور ارسال می‌شود
      // برای توسعه از تاخیر استفاده می‌کنیم
      setTimeout(() => {
        // ذخیره موفقیت‌آمیز
        setSaveLoading(false);
        setTestConnectionResult({
          success: true,
          message: 'تنظیمات با موفقیت ذخیره شد'
        });
        
        // پاک کردن پیام موفقیت پس از چند ثانیه
        setTimeout(() => {
          setTestConnectionResult(null);
        }, 3000);
      }, 1000);
    } catch (error) {
      console.error('خطا در ذخیره تنظیمات پیامک:', error);
      setSaveLoading(false);
      setTestConnectionResult({
        success: false,
        message: 'خطا در ذخیره تنظیمات'
      });
    }
  };

  /**
   * تست اتصال به سرویس پیامک
   */
  const handleTestConnection = async () => {
    // اعتبارسنجی فرم
    const validationErrors: {
      provider?: string;
      username?: string;
      password?: string;
      apiKey?: string;
    } = {};
    
    if (!settings.provider) {
      validationErrors.provider = 'انتخاب سرویس‌دهنده الزامی است';
    }
    
    if (settings.provider !== SmsProvider.CUSTOM) {
      if (!settings.username) {
        validationErrors.username = 'نام کاربری الزامی است';
      }
      
      if (!settings.password) {
        validationErrors.password = 'رمز عبور الزامی است';
      }
    }
    
    if (!settings.apiKey) {
      validationErrors.apiKey = 'کلید API الزامی است';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // پاک کردن خطاها
    setErrors({});
    setTestConnectionLoading(true);
    setTestConnectionResult(null);
    
    try {
      // در یک پروژه واقعی، اینجا یک درخواست API به سمت سرور ارسال می‌شود
      // برای توسعه از تاخیر استفاده می‌کنیم و به صورت تصادفی موفقیت یا شکست را شبیه‌سازی می‌کنیم
      setTimeout(() => {
        // شبیه‌سازی پاسخ تصادفی
        const isSuccess = Math.random() > 0.3; // 70% احتمال موفقیت
        
        setTestConnectionResult({
          success: isSuccess,
          message: isSuccess 
            ? 'اتصال به سرویس پیامک با موفقیت برقرار شد' 
            : 'خطا در برقراری ارتباط با سرویس پیامک. لطفاً اطلاعات حساب کاربری را بررسی کنید'
        });
        
        setTestConnectionLoading(false);
      }, 1500);
    } catch (error) {
      console.error('خطا در تست اتصال:', error);
      setTestConnectionResult({
        success: false,
        message: 'خطای سیستمی در تست اتصال'
      });
      setTestConnectionLoading(false);
    }
  };

  /**
   * تغییر مقدار فیلدهای فرم
   */
  const handleChange = (field: keyof SmsSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    
    // پاک کردن خطای مرتبط در صورت وجود
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  /**
   * تغییر نمایش رمز عبور
   */
  const handleToggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * تغییر نمایش کلید API
   */
  const handleToggleShowAPIKey = () => {
    setShowAPIKey(prev => !prev);
  };

  // دریافت اولیه داده‌ها
  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    errors,
    loading,
    saveLoading,
    showPassword,
    showAPIKey,
    testConnectionLoading,
    testConnectionResult,
    handleChange,
    handleToggleShowPassword,
    handleToggleShowAPIKey,
    handleSubmit,
    handleTestConnection,
    fetchSettings,
  };
}; 