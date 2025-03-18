// server/src/services/smsService.ts
// سرویس ارسال پیامک با استفاده از سامانه 0098sms

import axios from 'axios';
import prisma from '../lib/prisma';
import logger from '../config/logger';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';

/**
 * نتیجه ارسال پیامک
 */
interface SmsResult {
  success: boolean;
  messageId?: string;
  status?: string;
  message: string;
}

/**
 * تنظیمات پیامک
 */
interface SmsSettings {
  provider: string;
  username: string;
  password: string;
  from: string;
  isActive: boolean;
}

/**
 * دریافت تنظیمات پیامک از دیتابیس
 */
const getSmsSettings = async (): Promise<SmsSettings | null> => {
  try {
    const settings = await prisma.setting.findFirst({
      where: { category: 'SMS' },
    });

    if (!settings) {
      logger.warn('تنظیمات پیامک یافت نشد');
      return null;
    }

    return JSON.parse(settings.value);
  } catch (error) {
    logger.error('خطا در دریافت تنظیمات پیامک', error as Error);
    return null;
  }
};

/**
 * ارسال پیامک با استفاده از وب‌سرویس 0098sms
 * @param to شماره موبایل گیرنده
 * @param text متن پیامک
 */
export const sendSMS = async (to: string, text: string): Promise<SmsResult> => {
  try {
    // تبدیل شماره موبایل فارسی به انگلیسی
    const phoneNormalized = convertPersianToEnglishNumbers(to);
    
    // دریافت تنظیمات پیامک
    const settings = await getSmsSettings();
    
    if (!settings) {
      return {
        success: false,
        message: 'تنظیمات پیامک یافت نشد',
      };
    }
    
    if (!settings.isActive) {
      return {
        success: false,
        message: 'سرویس پیامک غیرفعال است',
      };
    }
    
    // استفاده از شناسه پیامک برای دریافت وضعیت تحویل
    try {
      const webServiceUrl = `https://webservice.0098sms.com/service.asmx/SendSMSWithID?username=${encodeURIComponent(settings.username)}&password=${encodeURIComponent(settings.password)}&text=${encodeURIComponent(text)}&mobileno=${encodeURIComponent(phoneNormalized)}&pnlno=${encodeURIComponent(settings.from)}`;
      
      logger.info(`ارسال درخواست به وب سرویس پیامک: ${webServiceUrl}`);
      
      const response = await axios.get(webServiceUrl);
      const responseData = response.data;
      
      // لاگ پاسخ برای اشکال‌زدایی
      logger.info(`پاسخ سرویس پیامک:`, responseData);
      
      // استخراج شناسه پیامک از پاسخ XML
      const responseText = responseData.toString();
      
      // بررسی وجود خطا در پاسخ
      if (responseText.includes('Error')) {
        // کد خطا را از پاسخ XML استخراج می‌کنیم
        const errorMatch = responseText.match(/<int xmlns="[^"]*">(-?\d+)<\/int>/);
        const errorCode = errorMatch ? parseInt(errorMatch[1]) : -1;
        
        // ترجمه کدهای خطای سرویس 0098sms
        let errorMessage: string;
        switch (errorCode) {
          case -1:
            errorMessage = 'خطای نامشخص در سرویس پیامک';
            break;
          case -2:
            errorMessage = 'نام کاربری یا رمز عبور نامعتبر است';
            break;
          case -5:
            errorMessage = 'شماره گیرنده نامعتبر است';
            break;
          case -6:
            errorMessage = 'شماره فرستنده نامعتبر است';
            break;
          case -9:
            errorMessage = 'اعتبار کافی برای ارسال پیامک ندارید';
            break;
          case -10:
            errorMessage = 'محتوای پیامک خالی است';
            break;
          case -11:
            errorMessage = 'خطا در سرور پیامک';
            break;
          case -12:
            errorMessage = 'شماره گیرنده در لیست سیاه قرار دارد';
            break;
          case -13:
            errorMessage = 'متن پیامک حاوی محتوای غیرمجاز است';
            break;
          default:
            errorMessage = `خطای سرویس پیامک با کد ${errorCode}`;
        }
        
        logger.error(`خطا در ارسال پیامک: ${errorMessage}`);
        
        return {
          success: false,
          message: errorMessage,
        };
      }
      
      // استخراج شناسه پیامک
      const idMatch = responseText.match(/<long xmlns="[^"]*">(\d+)<\/long>/);
      const messageId = idMatch ? idMatch[1] : undefined;
      
      if (messageId) {
        logger.info(`پیامک با موفقیت ارسال شد. شناسه پیامک: ${messageId}`);
        
        return {
          success: true,
          messageId,
          status: 'SENT',
          message: 'پیامک با موفقیت ارسال شد',
        };
      } else {
        logger.error('شناسه پیامک در پاسخ سرویس یافت نشد');
        
        return {
          success: false,
          message: 'خطا در دریافت شناسه پیامک',
        };
      }
    } catch (error) {
      logger.error('خطا در ارسال درخواست به سرویس پیامک', error as Error);
      
      const errorMessage = error instanceof Error ? error.message : 'خطای نامشخص در ارسال پیامک';
      
      return {
        success: false,
        message: `خطا در ارسال پیامک: ${errorMessage}`,
      };
    }
  } catch (error) {
    logger.error('خطا در ارسال پیامک', error as Error);
    
    const errorMessage = error instanceof Error ? error.message : 'خطای نامشخص در ارسال پیامک';
    
    return {
      success: false,
      message: `خطا در ارسال پیامک: ${errorMessage}`,
    };
  }
};

/**
 * بررسی وضعیت پیامک ارسال شده از طریق شناسه پیامک
 * @param messageId شناسه پیامک
 */
export const checkSmsStatus = async (messageId: string): Promise<SmsResult> => {
  try {
    // دریافت تنظیمات پیامک
    const settings = await getSmsSettings();
    
    if (!settings) {
      return {
        success: false,
        message: 'تنظیمات پیامک یافت نشد',
      };
    }
    
    // ارسال درخواست به وب سرویس برای بررسی وضعیت پیامک
    const webServiceUrl = `https://webservice.0098sms.com/service.asmx/GetDelivery?username=${encodeURIComponent(settings.username)}&password=${encodeURIComponent(settings.password)}&recid=${messageId}`;
    
    const response = await axios.get(webServiceUrl);
    const responseData = response.data;
    
    // لاگ پاسخ برای اشکال‌زدایی
    logger.info(`پاسخ بررسی وضعیت پیامک:`, responseData);
    
    // استخراج وضعیت تحویل از پاسخ XML
    const responseText = responseData.toString();
    const statusMatch = responseText.match(/<int xmlns="[^"]*">(\d+)<\/int>/);
    const statusCode = statusMatch ? parseInt(statusMatch[1]) : -1;
    
    let status: string;
    let success = false;
    
    switch (statusCode) {
      case 1:
        status = 'رسیده به مخابرات';
        success = true;
        break;
      case 2:
        status = 'رسیده به گوشی';
        success = true;
        break;
      case 3:
        status = 'نرسیده به گوشی';
        break;
      case 4:
        status = 'پیامک در لیست ارسال قرار دارد';
        success = true;
        break;
      case 5:
        status = 'در صف ارسال قرار دارد';
        success = true;
        break;
      case 6:
        status = 'ارسال نشده';
        break;
      case 9:
        status = 'شناسه پیامک نامعتبر است';
        break;
      case 10:
        status = 'مخابرات پاسخی نداده است';
        success = true;
        break;
      default:
        status = 'وضعیت نامشخص';
    }
    
    return {
      success,
      messageId,
      status,
      message: `وضعیت پیامک: ${status}`,
    };
  } catch (error) {
    logger.error('خطا در بررسی وضعیت پیامک', error as Error);
    
    const errorMessage = error instanceof Error ? error.message : 'خطای نامشخص در بررسی وضعیت پیامک';
    
    return {
      success: false,
      messageId,
      status: 'ERROR',
      message: `خطا در بررسی وضعیت پیامک: ${errorMessage}`,
    };
  }
};

/**
 * دریافت میزان اعتبار باقیمانده از سرویس پیامک
 */
export const getCredit = async (): Promise<{success: boolean; credit?: number; message: string}> => {
  try {
    // دریافت تنظیمات پیامک
    const settings = await getSmsSettings();
    
    if (!settings) {
      return {
        success: false,
        message: 'تنظیمات پیامک یافت نشد',
      };
    }
    
    // ارسال درخواست به وب سرویس برای دریافت اعتبار
    const webServiceUrl = `https://webservice.0098sms.com/service.asmx/GetCredit?username=${encodeURIComponent(settings.username)}&password=${encodeURIComponent(settings.password)}`;
    
    const response = await axios.get(webServiceUrl);
    const responseData = response.data;
    
    // لاگ پاسخ برای اشکال‌زدایی
    logger.info(`پاسخ دریافت اعتبار:`, responseData);
    
    // استخراج اعتبار از پاسخ XML
    const responseText = responseData.toString();
    
    // بررسی وجود خطا در پاسخ
    if (responseText.includes('Error')) {
      const errorMatch = responseText.match(/<int xmlns="[^"]*">(-?\d+)<\/int>/);
      const errorCode = errorMatch ? parseInt(errorMatch[1]) : -1;
      
      let errorMessage: string;
      switch (errorCode) {
        case -2:
          errorMessage = 'نام کاربری یا رمز عبور نامعتبر است';
          break;
        default:
          errorMessage = `خطای سرویس پیامک با کد ${errorCode}`;
      }
      
      logger.error(`خطا در دریافت اعتبار: ${errorMessage}`);
      
      return {
        success: false,
        message: errorMessage,
      };
    }
    
    // استخراج مقدار اعتبار
    const creditMatch = responseText.match(/<double xmlns="[^"]*">([\d.]+)<\/double>/);
    const credit = creditMatch ? parseFloat(creditMatch[1]) : 0;
    
    return {
      success: true,
      credit,
      message: `اعتبار باقیمانده: ${credit} ریال`,
    };
  } catch (error) {
    logger.error('خطا در دریافت اعتبار پیامک', error as Error);
    
    const errorMessage = error instanceof Error ? error.message : 'خطای نامشخص در دریافت اعتبار پیامک';
    
    return {
      success: false,
      message: `خطا در دریافت اعتبار پیامک: ${errorMessage}`,
    };
  }
};

export { getSmsSettings };
        