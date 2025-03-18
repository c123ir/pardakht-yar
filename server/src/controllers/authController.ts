// server/src/controllers/authController.ts
// کنترلر احراز هویت

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
        message: 'نام کاربری و رمز عبور الزامی است',
      });
    }

    // موقتاً برای تست - در محیط واقعی باید از پایگاه داده استفاده شود
    // ایجاد یک کاربر ساختگی
    if (username === 'admin' && password === 'admin') {
      const user = {
        id: 1,
        username: 'admin',
        fullName: 'کاربر مدیر',
        role: 'ADMIN',
      };

      // ایجاد توکن - اصلاح شده
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expire }
      );

      // ارسال پاسخ موفقیت‌آمیز
      return res.status(200).json({
        success: true,
        token,
        user,
      });
    }

    // پاسخ خطا برای مشخصات نامعتبر
    return res.status(401).json({
      success: false,
      message: 'نام کاربری یا رمز عبور اشتباه است',
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

    // موقتاً برای تست - در محیط واقعی باید از پایگاه داده استفاده شود
    const user = {
      id: req.user.id,
      username: req.user.username,
      fullName: 'کاربر مدیر',
      email: 'admin@example.com',
      role: req.user.role,
    };

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