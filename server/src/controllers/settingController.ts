// server/src/controllers/settingController.ts
// کنترلر مدیریت تنظیمات سیستم

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';

const prisma = new PrismaClient();

// دریافت تنظیمات پیامکی
export const getSmsSettings = async (req: Request, res: Response) => {
  try {
    // در اینجا فرض می‌کنیم یک مدل Setting در Prisma داریم
    // اگر وجود ندارد، باید در schema.prisma اضافه شود
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

    return res.status(200).json({
      success: true,
      data: smsSettings,
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
    const { provider, username, password, from, isActive } = req.body;

    // بررسی وجود تنظیمات
    const existingSettings = await prisma.setting.findFirst({
      where: { category: 'SMS' },
    });

    let updatedSettings;

    if (existingSettings) {
      // به‌روزرسانی تنظیمات موجود
      updatedSettings = await prisma.setting.update({
        where: { id: existingSettings.id },
        data: {
          value: JSON.stringify({
            provider,
            username,
            password,
            from,
            isActive,
          }),
        },
      });
    } else {
      // ایجاد تنظیمات جدید
      updatedSettings = await prisma.setting.create({
        data: {
          category: 'SMS',
          key: 'sms_settings',
          value: JSON.stringify({
            provider,
            username,
            password,
            from,
            isActive,
          }),
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        provider,
        username,
        password: '********', // برای امنیت، رمز عبور را بازنمی‌گردانیم
        from,
        isActive,
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
    const { to, text } = req.body;

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

    // ارسال پیامک با استفاده از سرویس 0098
    // این بخش باید با توجه به مستندات سرویس پیامکی پیاده‌سازی شود
    // برای مثال با استفاده از axios برای ارسال درخواست HTTP

    // نمونه پیاده‌سازی ساده (مستقل از سرویس واقعی)
    const smsResult = {
      status: 'success',
      messageId: `test-${Date.now()}`,
      to,
      text,
    };

    return res.status(200).json({
      success: true,
      data: smsResult,
    });
  } catch (error) {
    logger.error('خطا در ارسال پیامک آزمایشی', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در ارسال پیامک آزمایشی',
    });
  }
};