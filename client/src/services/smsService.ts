// client/src/services/smsService.ts
// سرویس ارتباط با API پیامک

import axios from '../utils/axios';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';
import { SmsSettings, SmsDeliveryStatus } from '../types/sms';
import { ApiResponse } from '../types/api';

const smsService = {
  getSettings: async (): Promise<ApiResponse<SmsSettings>> => {
    try {
      const response = await axios.get('/settings/sms');
      return response.data;
    } catch (error: any) {
      console.error('خطا در دریافت تنظیمات پیامک:', error);
      
      const errorMessage = error.response?.data?.message || 'خطا در دریافت تنظیمات پیامک';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  updateSettings: async (settings: SmsSettings): Promise<ApiResponse<SmsSettings>> => {
    try {
      const response = await axios.put('/settings/sms', settings);
      return response.data;
    } catch (error: any) {
      console.error('خطا در به‌روزرسانی تنظیمات پیامک:', error);
      
      const errorMessage = error.response?.data?.message || 'خطا در به‌روزرسانی تنظیمات پیامک';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  sendTestSms: async (to: string, text: string): Promise<ApiResponse<{ messageId: string }>> => {
    try {
      // تبدیل اعداد فارسی به انگلیسی در شماره موبایل
      const convertedTo = convertPersianToEnglishNumbers(to);
      
      // ارسال درخواست
      const response = await axios.post('/settings/sms/test', { to: convertedTo, text });
      return response.data;
    } catch (error: any) {
      console.error('خطا در ارسال پیامک آزمایشی:', error);
      
      const errorMessage = error.response?.data?.message || 'خطا در ارسال پیامک آزمایشی';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
  
  getSmsDeliveryStatus: async (messageId: string): Promise<ApiResponse<SmsDeliveryStatus>> => {
    try {
      const response = await axios.get(`/settings/sms/delivery/${messageId}`);
      return response.data;
    } catch (error: any) {
      console.error('خطا در دریافت وضعیت تحویل پیامک:', error);
      
      const errorMessage = error.response?.data?.message || 'خطا در دریافت وضعیت تحویل پیامک';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
  
  getCredit: async (): Promise<ApiResponse<{ credit: number }>> => {
    try {
      const response = await axios.get('/settings/sms/credit');
      return response.data;
    } catch (error: any) {
      console.error('خطا در دریافت اعتبار پیامک:', error);
      
      const errorMessage = error.response?.data?.message || 'خطا در دریافت اعتبار پیامک';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
};

export default smsService;