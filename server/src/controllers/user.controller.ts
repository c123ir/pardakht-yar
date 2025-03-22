import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/ApiError';
import { Logger } from '../utils/logger';

const logger = new Logger('UserController');
const prisma = new PrismaClient();

// تعریف تایپ برای user در درخواست
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        role: string;
        id?: number; // برای سازگاری
      };
    }
  }
}

// دریافت لیست کاربران
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      status: 'success',
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در دریافت لیست کاربران',
    });
  }
};

// دریافت اطلاعات یک کاربر
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'کاربر مورد نظر یافت نشد',
      });
    }

    res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در دریافت اطلاعات کاربر',
    });
  }
};

// ایجاد کاربر جدید
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, fullName, role, email, phone, avatar, isActive } = req.body;

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

    // رمزنگاری کلمه عبور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ایجاد کاربر جدید
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        fullName,
        role,
        email: email || null,
        phone: phone || null,
        avatar: avatar || null,
        isActive: isActive !== undefined ? isActive : true,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: newUser,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در ایجاد کاربر جدید',
    });
  }
};

// به‌روزرسانی اطلاعات کاربر
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, role, password, email, phone, avatar, isActive } = req.body;

    // اگر کلمه عبور ارسال شده باشد، رمزنگاری انجام شود
    let updateData: any = { 
      fullName, 
      role, 
      email: email || null,
      phone: phone || null,
      avatar: avatar || null,
    };
    
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در به‌روزرسانی اطلاعات کاربر',
    });
  }
};

// حذف کاربر
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      status: 'success',
      message: 'کاربر با موفقیت حذف شد',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در حذف کاربر',
    });
  }
};

// آپلود آواتار کاربر
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    // تایید وجود فایل آپلود شده
    if (!req.file) {
      logger.warn('No file uploaded');
      return res.status(400).json({ message: 'هیچ فایلی آپلود نشده است' });
    }

    // اطمینان از وجود دایرکتوری آپلود
    const avatarDir = path.join(__dirname, '../../uploads/avatars');
    
    try {
      // بررسی و ایجاد دایرکتوری در صورت عدم وجود
      if (!fs.existsSync(avatarDir)) {
        logger.info(`Creating avatar directory at ${avatarDir}`);
        fs.mkdirSync(avatarDir, { recursive: true });
        logger.info('Avatar directory created successfully');
      }
    } catch (error) {
      logger.error('Error checking/creating avatar directory:', error);
      return res.status(500).json({ message: 'خطا در ایجاد دایرکتوری آپلود' });
    }

    // بررسی مجوز کاربر و تعیین userId هدف
    let targetUserId = req.user?.userId;
    
    if (req.body.userId) {
      // اگر userId در درخواست وجود دارد (توسط ادمین)
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'شما مجوز تغییر آواتار کاربران دیگر را ندارید' });
      }
      targetUserId = parseInt(req.body.userId);
    }

    if (!targetUserId) {
      return res.status(400).json({ message: 'شناسه کاربر مشخص نشده است' });
    }

    // دریافت اطلاعات کاربر
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    // بررسی فایل آپلود شده
    logger.info(`Avatar uploaded: ${req.file.originalname}, size: ${req.file.size}, path: ${req.file.path}`);
    
    // اطمینان از دسترس بودن فایل
    try {
      const stats = fs.statSync(req.file.path);
      logger.info(`File stats: size=${stats.size}, isFile=${stats.isFile()}, permissions=${stats.mode.toString(8)}`);
    } catch (statError) {
      logger.error('Error checking file stats:', statError);
    }

    // مسیر نسبی برای دسترسی HTTP
    const relativePath = `/uploads/avatars/${path.basename(req.file.path)}`;
    logger.info(`Relative HTTP path for avatar: ${relativePath}`);

    // به‌روزرسانی مسیر آواتار کاربر در دیتابیس
    await prisma.user.update({
      where: { id: targetUserId },
      data: { avatar: relativePath },
    });

    // پاسخ موفق
    return res.status(200).json({
      message: 'آواتار با موفقیت آپلود شد',
      path: relativePath,
      originalName: req.file.originalname,
      userId: targetUserId,
      fullName: user.fullName
    });
  } catch (error) {
    logger.error('Error in uploadAvatar:', error);
    return res.status(500).json({ message: 'خطا در آپلود آواتار' });
  }
}; 