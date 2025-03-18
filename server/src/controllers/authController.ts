// server/src/controllers/authController.ts
// کنترلر احراز هویت

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import config from '../config/app';
import logger from '../config/logger';

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

    // جستجوی کاربر در پایگاه داده
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // اگر کاربر یافت نشد یا غیرفعال است
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'نام کاربری یا رمز عبور اشتباه است',
      });
    }

    // بررسی صحت رمز عبور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'نام کاربری یا رمز عبور اشتباه است',
      });
    }

    // به‌روزرسانی زمان آخرین ورود
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // ایجاد توکن
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );

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