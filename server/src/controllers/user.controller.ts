import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// دریافت لیست کاربران
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
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
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
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

// به‌روزرسانی اطلاعات کاربر
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, role } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        fullName,
        role,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
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