// client/src/services/smsService.ts
// سرویس ارتباط با API پیامک

import api from './api';

// دریافت تنظیمات پیامکی
const getSmsSettings = async () => {
  try {
    const response = await api.get('/settings/sms');
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت تنظیمات پیامکی'
    );
  }
};

// به‌روزرسانی تنظیمات پیامکی
const updateSmsSettings = async (settingsData: {
  provider: string;
  username: string;
  password: string;
  from: string;
  isActive: boolean;
}) => {
  try {
    const response = await api.put('/settings/sms', settingsData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در به‌روزرسانی تنظیمات پیامکی'
    );
  }
};

// ارسال پیامک آزمایشی
const sendTestSms = async (data: { to: string; text: string }) => {
  try {
    const response = await api.post('/settings/sms/test', data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ارسال پیامک آزمایشی'
    );
  }
};

export default {
  getSmsSettings,
  updateSmsSettings,
  sendTestSms,
};