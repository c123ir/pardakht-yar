import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ورود کاربر
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // بررسی وجود کاربر
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'نام کاربری یا رمز عبور اشتباه است',
      });
    }

    // بررسی رمز عبور
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'نام کاربری یا رمز عبور اشتباه است',
      });
    }

    // ایجاد توکن
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // به‌روزرسانی آخرین زمان ورود
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // ارسال پاسخ
    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در ورود به سیستم',
    });
  }
};

// ثبت‌نام کاربر
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, fullName, role } = req.body;

    // بررسی تکراری نبودن نام کاربری
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'این نام کاربری قبلاً ثبت شده است',
      });
    }

    // رمزنگاری رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ایجاد کاربر جدید
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        fullName,
        role,
        isActive: true,
      },
    });

    // ایجاد توکن
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // ارسال پاسخ
    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در ثبت‌نام',
    });
  }
};

// دریافت اطلاعات کاربر جاری
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'کاربر احراز هویت نشده است',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'کاربر یافت نشد',
      });
    }

    res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در دریافت اطلاعات کاربر',
    });
  }
}; 