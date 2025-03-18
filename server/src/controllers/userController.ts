// server/src/controllers/userController.ts
// کنترلر مدیریت کاربران

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import logger from '../config/logger';

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
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    logger.error('خطا در دریافت لیست کاربران', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت لیست کاربران',
    });
  }
};

// دریافت اطلاعات یک کاربر با شناسه
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه کاربر نامعتبر است',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر مورد نظر یافت نشد',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('خطا در دریافت اطلاعات کاربر', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت اطلاعات کاربر',
    });
  }
};

// ایجاد کاربر جدید
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, fullName, email, phone, role, isActive } = req.body;

    // بررسی وجود کاربر با نام کاربری مشابه
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'نام کاربری قبلاً استفاده شده است',
      });
    }

    // بررسی وجود کاربر با ایمیل مشابه (اگر ایمیل ارائه شده باشد)
    if (email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithEmail) {
        return res.status(400).json({
          success: false,
          message: 'ایمیل قبلاً استفاده شده است',
        });
      }
    }

    // هش کردن رمز عبور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ایجاد کاربر جدید
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        fullName,
        email,
        phone,
        role: role || 'ADMIN',
        isActive: isActive === false ? false : true,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    logger.error('خطا در ایجاد کاربر جدید', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در ایجاد کاربر جدید',
    });
  }
};

// به‌روزرسانی کاربر
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, role, isActive, password } = req.body;
    
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه کاربر نامعتبر است',
      });
    }

    // بررسی وجود کاربر
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'کاربر مورد نظر یافت نشد',
      });
    }

    // بررسی ایمیل تکراری
    if (email && email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithEmail) {
        return res.status(400).json({
          success: false,
          message: 'ایمیل قبلاً استفاده شده است',
        });
      }
    }

    // آماده‌سازی داده‌ها برای به‌روزرسانی
    const updateData: any = {};
    
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // اگر رمز عبور ارائه شده باشد، آن را هش کنید
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // به‌روزرسانی کاربر
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    logger.error('خطا در به‌روزرسانی کاربر', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در به‌روزرسانی کاربر',
    });
  }
};

// حذف کاربر
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه کاربر نامعتبر است',
      });
    }

    // بررسی وجود کاربر
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر مورد نظر یافت نشد',
      });
    }

    // حذف کاربر
    await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(200).json({
      success: true,
      message: 'کاربر با موفقیت حذف شد',
    });
  } catch (error) {
    logger.error('خطا در حذف کاربر', error as Error);
    
    // اگر خطا به دلیل محدودیت کلید خارجی باشد
    if ((error as any).code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'این کاربر به دلیل وابستگی به داده‌های دیگر قابل حذف نیست',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در حذف کاربر',
    });
  }
};