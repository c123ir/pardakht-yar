// server/src/controllers/settingController.ts
// کنترلر مدیریت تنظیمات سیستم

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';
import axios from 'axios';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';

const prisma = new PrismaClient();

// دریافت تنظیمات پیامکی
export const getSmsSettings = async (req: Request, res: Response) => {
  try {
    const smsSettings = await prisma.setting.findFirst({
      where: { category: 'SMS' },
    });

    if (!smsSettings) {
      return res.status(200).json({
        success: true,
        data: {
          provider: '0098sms',
          username: '',
          password: '',
          from: '',
          isActive: false,
        },
      });
    }

    const settings = JSON.parse(smsSettings.value);
    
    // برای امنیت، رمز عبور را حذف می‌کنیم
    const responseData = {
      ...settings,
      password: settings.password ? '********' : '',
    };

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    logger.error('خطا در دریافت تنظیمات پیامکی', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت تنظیمات پیامکی',
    });
  }
};

// به‌روزرسانی تنظیمات پیامکی
export const updateSmsSettings = async (req: Request, res: Response) => {
  try {
    const provider = req.body.provider;
    const username = req.body.username;
    const password = req.body.password;
    // تبدیل شماره فرستنده از فارسی به انگلیسی
    const from = convertPersianToEnglishNumbers(req.body.from);
    const isActive = req.body.isActive;

    // بررسی وجود تنظیمات
    const existingSettings = await prisma.setting.findFirst({
      where: { category: 'SMS' },
    });

    let updatedSettings;
    const settingsData = {
      provider,
      username,
      password,
      from,
      isActive,
    };

    if (existingSettings) {
      // حفظ اطلاعات موجود که در درخواست نیستند
      const currentSettings = JSON.parse(existingSettings.value);
      
      // اگر رمز عبور ارسال نشده یا رمزعبور مخفی شده ارسال شده، از رمز موجود استفاده می‌کنیم
      if (!password || password === '********') {
        settingsData.password = currentSettings.password;
      }
      
      // به‌روزرسانی تنظیمات موجود
      updatedSettings = await prisma.setting.update({
        where: { id: existingSettings.id },
        data: {
          value: JSON.stringify(settingsData),
        },
      });
    } else {
      // ایجاد تنظیمات جدید
      updatedSettings = await prisma.setting.create({
        data: {
          category: 'SMS',
          key: 'sms_settings',
          value: JSON.stringify(settingsData),
        },
      });
    }

    // برای امنیت، رمز عبور را در پاسخ نمی‌فرستیم
    const responseSettings = JSON.parse(updatedSettings.value);
    return res.status(200).json({
      success: true,
      data: {
        ...responseSettings,
        password: '********',
      },
    });
  } catch (error) {
    logger.error('خطا در به‌روزرسانی تنظیمات پیامکی', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در به‌روزرسانی تنظیمات پیامکی',
    });
  }
};

// ارسال پیامک آزمایشی
export const sendTestSms = async (req: Request, res: Response) => {
  try {
    // استخراج پارامترها و تبدیل اعداد فارسی به انگلیسی
    const to = convertPersianToEnglishNumbers(req.body.to);
    const text = req.body.text;

    // بررسی صحت شماره موبایل
    if (!/^09[0-9]{9}$/.test(to)) {
      return res.status(400).json({
        success: false,
        message: 'شماره موبایل نامعتبر است. لطفا یک شماره موبایل معتبر وارد کنید.',
      });
    }

    // دریافت تنظیمات پیامکی
    const smsSettings = await prisma.setting.findFirst({
      where: { category: 'SMS' },
    });

    if (!smsSettings) {
      return res.status(400).json({
        success: false,
        message: 'تنظیمات پیامکی یافت نشد',
      });
    }

    const settings = JSON.parse(smsSettings.value);

    if (!settings.isActive) {
      return res.status(400).json({
        success: false,
        message: 'سرویس پیامکی غیرفعال است',
      });
    }

    // استفاده از SendSMSWithID برای دریافت شناسه پیامک
    try {
      const webServiceUrl = `https://webservice.0098sms.com/service.asmx/SendSMSWithID?username=${encodeURIComponent(settings.username)}&password=${encodeURIComponent(settings.password)}&text=${encodeURIComponent(text)}&mobileno=${encodeURIComponent(to)}&pnlno=${encodeURIComponent(settings.from)}`;
      
      logger.info('ارسال درخواست به وب سرویس با شناسه پیامک:', webServiceUrl);
      
      const response = await axios.get(webServiceUrl);
      
      // بررسی پاسخ سرویس
      const responseData = response.data;
      
      // لاگ پاسخ برای اشکال‌زدایی
      logger.info(`پاسخ سرویس پیامک: ${typeof responseData} - ${JSON.stringify(responseData)}`);
      
      // تبدیل پاسخ به رشته
      const responseText = String(responseData).trim();
      
      // بررسی پاسخ XML و استخراج شناسه پیامک
      let smsId = null;
      let success = false;
      
      if (typeof responseData === 'string') {
        // استخراج شناسه پیامک از XML - در صورت موفقیت، شناسه یک عدد طولانی است
        const idMatch = responseData.match(/<string[^>]*>(\d{10,})<\/string>/i);
        
        if (idMatch && idMatch[1]) {
          smsId = idMatch[1];
          success = true;
        }
      }
      
      if (success && smsId) {
        return res.status(200).json({
          success: true,
          data: {
            status: 'success',
            message: 'عملیات با موفقیت به پایان رسید',
            messageId: smsId,
            to,
            text,
          },
        });
      } else {
        // استخراج کد خطا از XML
        let errorCode = '0';
        let errorMessage = 'خطا در ارسال پیامک';
        
        if (typeof responseData === 'string') {
          const errorMatch = responseData.match(/<string[^>]*>(.+?)<\/string>/i);
          if (errorMatch && errorMatch[1]) {
            errorCode = errorMatch[1];
          }
        }
        
        // کدهای خطای وب سرویس
        switch (errorCode) {
          case '-3':
          case '66':
          case '10':
            errorMessage = 'نام کاربری یا کلمه عبور اشتباه است';
            break;
          case '11':
          case '1111':
            errorMessage = 'کاراکتر غیرمجاز در متن وجود دارد';
            break;
          case '17':
            errorMessage = 'متن پیامک خالی است';
            break;
          case '18':
          case '19':
            errorMessage = 'اعتبار پیامک شما کافی نیست';
            break;
          case '22':
            errorMessage = 'شماره موبایل صحیح نیست';
            break;
          default:
            // اگر پاسخ یک عدد بزرگ باشد، احتمالاً شناسه پیامک است و ارسال موفق بوده
            if (/^\d{10,}$/.test(errorCode)) {
              return res.status(200).json({
                success: true,
                data: {
                  status: 'success',
                  message: 'عملیات با موفقیت به پایان رسید',
                  messageId: errorCode,
                  to,
                  text,
                },
              });
            }
            errorMessage = `خطای نامشخص با کد ${errorCode}`;
        }
        
        return res.status(400).json({
          success: false,
          message: errorMessage,
        });
      }
    } catch (error) {
      logger.error('خطا در ارسال پیامک آزمایشی', error as Error);
      
      // در صورت خطا، از روش ارسال قبلی به عنوان پشتیبان استفاده می‌کنیم
      try {
        const domain = '0098';
        const url = `https://0098sms.com/sendsmslink.aspx?FROM=${encodeURIComponent(settings.from)}&TO=${encodeURIComponent(to)}&TEXT=${encodeURIComponent(text)}&USERNAME=${encodeURIComponent(settings.username)}&PASSWORD=${encodeURIComponent(settings.password)}&DOMAIN=${domain}`;
        
        logger.info('تلاش برای ارسال با لینک ارتباطی:', url);
        
        const backupResponse = await axios.get(url);
        const backupData = backupResponse.data;
        
        logger.info(`پاسخ سرویس پشتیبان: ${typeof backupData} - ${JSON.stringify(backupData)}`);
        
        // تبدیل پاسخ به رشته
        const backupText = String(backupData).trim();
        
        if (backupText === '0') {
          return res.status(200).json({
            success: true,
            data: {
              status: 'success',
              message: 'عملیات با موفقیت به پایان رسید',
              messageId: `sms-${Date.now()}`,
              to,
              text,
            },
          });
        } else {
          // کدهای خطا طبق مستندات
          let errorMessage = 'خطا در ارسال پیامک';
          
          switch (backupText) {
            case '1':
              errorMessage = 'شماره گیرنده اشتباه است';
              break;
            case '2':
              errorMessage = 'گیرنده تعریف نشده است';
              break;
            case '3':
              errorMessage = 'فرستنده تعریف نشده است';
              break;
            case '4':
              errorMessage = 'متن تنظیم نشده است';
              break;
            case '5':
              errorMessage = 'نام کاربری تنظیم نشده است';
              break;
            case '6':
              errorMessage = 'کلمه عبور تنظیم نشده است';
              break;
            case '7':
              errorMessage = 'نام دامین تنظیم نشده است';
              break;
            case '8':
              errorMessage = 'مجوز شما باطل شده است';
              break;
            case '9':
              errorMessage = 'اعتبار پیامک شما کافی نیست';
              break;
            case '10':
              errorMessage = 'برای این شماره لینک تعریف نشده است';
              break;
            case '11':
              errorMessage = 'عدم مجوز برای اتصال لینک';
              break;
            case '12':
              errorMessage = 'نام کاربری و کلمه ی عبور اشتباه است';
              break;
            case '13':
              errorMessage = 'کاراکتر غیرمجاز در متن وجود دارد';
              break;
            case '14':
              errorMessage = 'سقف ارسال روزانه پر شده است';
              break;
            case '16':
              errorMessage = 'عدم مجوز شماره برای ارسال از لینک';
              break;
            default:
              errorMessage = `خطای نامشخص با کد ${backupText}`;
          }
          
          return res.status(400).json({
            success: false,
            message: errorMessage,
          });
        }
      } catch (backupError) {
        logger.error('خطا در ارسال پیامک با روش پشتیبان', backupError as Error);
        return res.status(500).json({
          success: false,
          message: 'خطای سرور در ارسال پیامک آزمایشی',
        });
      }
    }
  } catch (error) {
    logger.error('خطا در ارسال پیامک آزمایشی', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در ارسال پیامک آزمایشی',
    });
  }
};

// دریافت وضعیت تحویل پیامک
export const getSmsDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const messageId = req.params.messageId;
    
    if (!messageId || !/^\d+$/.test(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه پیامک نامعتبر است',
      });
    }
    
    // دریافت تنظیمات پیامکی
    const smsSettings = await prisma.setting.findFirst({
      where: { category: 'SMS' },
    });

    if (!smsSettings) {
      return res.status(400).json({
        success: false,
        message: 'تنظیمات پیامکی یافت نشد',
      });
    }

    const settings = JSON.parse(smsSettings.value);

    if (!settings.isActive) {
      return res.status(400).json({
        success: false,
        message: 'سرویس پیامکی غیرفعال است',
      });
    }
    
    try {
      // استفاده از تابع smsdeliveryState برای دریافت وضعیت تحویل
      const url = `https://webservice.0098sms.com/service.asmx/smsdeliverystate?username=${encodeURIComponent(settings.username)}&password=${encodeURIComponent(settings.password)}&MessageID=${messageId}`;
      
      logger.info('درخواست وضعیت تحویل پیامک:', url);
      
      const response = await axios.get(url);
      const responseData = response.data;
      
      logger.info(`پاسخ وضعیت تحویل: ${typeof responseData} - ${JSON.stringify(responseData)}`);
      
      // استخراج وضعیت از XML
      let deliveryStatus = null;
      let statusMessage = '';
      
      if (typeof responseData === 'string') {
        const statusMatch = responseData.match(/<string[^>]*>(.+?)<\/string>/i);
        
        if (statusMatch && statusMatch[1]) {
          deliveryStatus = statusMatch[1];
          
          // تفسیر کدهای وضعیت
          switch (deliveryStatus) {
            case '0':
              statusMessage = 'پیامک به مخابرات ارسال شده است';
              break;
            case '1':
              statusMessage = 'پیامک به گوشی مخاطب تحویل داده شده است';
              break;
            case '2':
              statusMessage = 'عدم تحویل پیامک به گوشی مخاطب';
              break;
            case '3':
              statusMessage = 'ارسال به مخابرات با خطا مواجه شده است';
              break;
            case '8':
              statusMessage = 'ارسال پیامک در صف ارسال قرار دارد';
              break;
            case '10':
              statusMessage = 'شناسه پیامک نامعتبر است';
              break;
            case 'null':
            case '-1':
              statusMessage = 'پیامک ارسال نشده یا شناسه نامعتبر است';
              break;
            default:
              statusMessage = `وضعیت نامشخص: ${deliveryStatus}`;
          }
        } else {
          deliveryStatus = null;
          statusMessage = 'وضعیت تحویل نامشخص';
        }
      }
      
      return res.status(200).json({
        success: true,
        data: {
          messageId,
          status: deliveryStatus,
          message: statusMessage,
        },
      });
    } catch (error) {
      logger.error('خطا در دریافت وضعیت تحویل پیامک', error as Error);
      return res.status(500).json({
        success: false,
        message: 'خطای سرور در دریافت وضعیت تحویل پیامک',
      });
    }
  } catch (error) {
    logger.error('خطا در دریافت وضعیت تحویل پیامک', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت وضعیت تحویل پیامک',
    });
  }
};