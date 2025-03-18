// server/src/controllers/authController.ts
// کنترلر احراز هویت

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import config from '../config/app';
import logger from '../config/logger';

const prisma = new PrismaClient();

// ورود به سیستم
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // بررسی وجود نام کاربری و رمز عبور
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'لطفا نام کاربری و رمز عبور خود را وارد کنید',
      });
    }

    // جستجوی کاربر در پایگاه داده
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // اگر کاربر یافت نشد یا غیرفعال است
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'نام کاربری وارد شده اشتباه است',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'حساب کاربری شما غیرفعال شده است. لطفا با پشتیبانی تماس بگیرید',
      });
    }

    // بررسی صحت رمز عبور
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'اطلاعات ورود نامعتبر است',
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'رمز عبور وارد شده اشتباه است',
      });
    }

    // به‌روزرسانی زمان آخرین ورود
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // ایجاد توکن با رفع مشکل تایپ
    const jwtSecret = String(config.jwt.secret);
    const payload = { id: user.id, username: user.username, role: user.role };
    const options: SignOptions = { 
      expiresIn: config.jwt.expire as jwt.SignOptions['expiresIn']
    };
    
    const token = jwt.sign(payload, jwtSecret, options);

    // ارسال پاسخ موفقیت‌آمیز
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('خطا در ورود به سیستم', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در احراز هویت',
    });
  }
};

// دریافت اطلاعات کاربر جاری
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // نیاز به میدل‌ور احراز هویت دارد که req.user را تنظیم کند
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      });
    }

    // دریافت اطلاعات کاربر از پایگاه داده
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد',
      });
    }

    // ارسال اطلاعات کاربر
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error('خطا در دریافت اطلاعات کاربر', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت اطلاعات کاربر',
    });
  }
};