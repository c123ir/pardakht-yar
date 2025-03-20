import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Logger } from '../utils/logger';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const logger = new Logger('AuthController');

// ورود کاربر
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    logger.info(`Login attempt for: ${username}`);

    // بررسی وجود کاربر
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      logger.warn(`Failed login: User not found - ${username}`);
      return res.status(401).json({
        status: 'error',
        message: 'نام کاربری یا رمز عبور اشتباه است',
      });
    }

    // بررسی رمز عبور
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.warn(`Failed login: Invalid password for user ${username}`);
      return res.status(401).json({
        status: 'error',
        message: 'نام کاربری یا رمز عبور اشتباه است',
      });
    }

    // ایجاد توکن
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        role: user.role  // اضافه کردن نقش کاربر به توکن
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // به‌روزرسانی آخرین زمان ورود
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    logger.info(`Successful login: ${username}`);
    
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
    logger.error('Login error:', error);
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

    logger.info(`Registration attempt for: ${username}`);

    // بررسی تکراری نبودن نام کاربری
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      logger.warn(`Registration failed: Username ${username} already exists`);
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
      { 
        userId: user.id, 
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`Registration successful for: ${username}`);

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
    logger.error('Register error:', error);
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
      logger.warn('Get current user: No authenticated user');
      return res.status(401).json({
        status: 'error',
        message: 'کاربر احراز هویت نشده است',
      });
    }

    logger.info(`Getting current user info for user ID: ${userId}`);

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
      logger.warn(`User with ID ${userId} not found`);
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
    logger.error('Get current user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در دریافت اطلاعات کاربر',
    });
  }
}; 