import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
    // بررسی وجود فایل
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'هیچ فایلی آپلود نشده است',
      });
    }

    // آماده‌سازی مسیر نسبی برای ذخیره در دیتابیس
    const relativePath = `/uploads/avatars/${req.file.filename}`;
    
    // دریافت شناسه کاربر از توکن
    const userId = (req as any).user.userId;
    
    try {
      // به‌روزرسانی آواتار کاربر در دیتابیس
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: relativePath },
      });

      // ارسال پاسخ موفقیت‌آمیز
      res.json({
        status: 'success',
        data: {
          filePath: relativePath,
          originalName: req.file.originalname,
        },
      });
    } catch (dbError) {
      console.error('Error updating avatar in database:', dbError);
      
      // در صورت بروز خطا در دیتابیس، فایل آپلود شده را حذف می‌کنیم
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.join(__dirname, '../../', relativePath);
      
      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (fsError) {
        console.error('Error deleting uploaded file after db error:', fsError);
      }
      
      throw dbError;
    }
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در آپلود و ذخیره تصویر پروفایل',
    });
  }
}; 