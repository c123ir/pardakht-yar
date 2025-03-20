import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// دریافت لیست انواع درخواست
export const getRequestTypes = async (req: Request, res: Response) => {
  try {
    const requestTypes = await prisma.requestType.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      status: 'success',
      data: requestTypes,
    });
  } catch (error) {
    console.error('Get request types error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در دریافت لیست انواع درخواست',
    });
  }
};

// دریافت اطلاعات یک نوع درخواست
export const getRequestType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const requestType = await prisma.requestType.findUnique({
      where: { id: parseInt(id) },
    });

    if (!requestType) {
      return res.status(404).json({
        status: 'error',
        message: 'نوع درخواست مورد نظر یافت نشد',
      });
    }

    res.json({
      status: 'success',
      data: requestType,
    });
  } catch (error) {
    console.error('Get request type error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در دریافت اطلاعات نوع درخواست',
    });
  }
};

// ایجاد نوع درخواست جدید
export const createRequestType = async (req: Request, res: Response) => {
  try {
    const { name, description, iconName, color, fieldConfig, isActive = true } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'احراز هویت انجام نشده است',
      });
    }

    const requestType = await prisma.requestType.create({
      data: {
        name,
        description,
        iconName,
        color,
        fieldConfig,
        isActive,
        creator: {
          connect: { id: userId }
        }
      },
    });

    res.status(201).json({
      status: 'success',
      data: requestType,
    });
  } catch (error) {
    console.error('Create request type error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در ایجاد نوع درخواست',
    });
  }
};

// به‌روزرسانی نوع درخواست
export const updateRequestType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, iconName, color, fieldConfig, isActive } = req.body;

    const requestType = await prisma.requestType.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        iconName,
        color,
        fieldConfig,
        isActive,
      },
    });

    res.json({
      status: 'success',
      data: requestType,
    });
  } catch (error) {
    console.error('Update request type error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در به‌روزرسانی نوع درخواست',
    });
  }
};

// حذف نوع درخواست
export const deleteRequestType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.requestType.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      status: 'success',
      message: 'نوع درخواست با موفقیت حذف شد',
    });
  } catch (error) {
    console.error('Delete request type error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در حذف نوع درخواست',
    });
  }
}; 