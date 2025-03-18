// server/src/controllers/userController.ts
// کنترلر مدیریت کاربران

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';

const prisma = new PrismaClient();

// دریافت لیست کاربران
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
// ایجاد کاربر جدید
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, fullName, email, phone, role, isActive } = req.body;

    // موقتاً برای تست، یک کاربر ساختگی جدید را برگردانید
    const newUser = {
      id: Math.floor(Math.random() * 1000) + 3,
      username,
      fullName,
      email,
      phone,
      role: role || 'ADMIN',
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString(),
    };

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

    // موقتاً برای تست، یک کاربر به‌روزرسانی شده ساختگی را برگردانید
    const updatedUser = {
      id: Number(id),
      username: 'user' + id,
      fullName,
      email,
      phone,
      role,
      isActive,
      updatedAt: new Date().toISOString(),
    };

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

    return res.status(200).json({
      success: true,
      message: 'کاربر با موفقیت حذف شد',
    });
  } catch (error) {
    logger.error('خطا در حذف کاربر', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در حذف کاربر',
    });
  }
};