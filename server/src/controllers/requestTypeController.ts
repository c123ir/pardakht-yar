// server/src/controllers/requestTypeController.ts
// کنترلر برای مدیریت انواع درخواست‌ها

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateRequestTypeDto, UpdateRequestTypeDto } from '../types/request.types';
import { Logger } from '../utils/logger';

const prisma = new PrismaClient();
const logger = new Logger('RequestTypeController');

// دریافت همه انواع درخواست‌ها
export const getAllRequestTypes = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;
    
    let filter: any = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    const requestTypes = await prisma.requestType.findMany({
      where: filter,
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return res.status(200).json({
      success: true,
      data: requestTypes,
    });
  } catch (error) {
    logger.error('خطا در دریافت انواع درخواست‌ها:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت انواع درخواست‌ها',
      error: (error as Error).message,
    });
  }
};

// دریافت یک نوع درخواست با شناسه
export const getRequestTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const requestType = await prisma.requestType.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
    
    if (!requestType) {
      return res.status(404).json({
        success: false,
        message: 'نوع درخواست مورد نظر یافت نشد',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: requestType,
    });
  } catch (error) {
    logger.error('خطا در دریافت جزئیات نوع درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت جزئیات نوع درخواست',
      error: (error as Error).message,
    });
  }
};

// ایجاد نوع درخواست جدید
export const createRequestType = async (req: Request, res: Response) => {
  try {
    const { name, description, fieldConfig } = req.body as CreateRequestTypeDto;
    const userId = req.user!.id;
    
    // بررسی تکراری‌نبودن نام
    const existingType = await prisma.requestType.findUnique({
      where: {
        name,
      },
    });
    
    if (existingType) {
      return res.status(400).json({
        success: false,
        message: 'نوع درخواست با این نام قبلاً ثبت شده است',
      });
    }
    
    const newRequestType = await prisma.requestType.create({
      data: {
        name,
        description,
        fieldConfig: fieldConfig as any,
        createdBy: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
    
    logger.info(`نوع درخواست جدید با نام ${name} توسط کاربر ${userId} ایجاد شد`);
    
    return res.status(201).json({
      success: true,
      data: newRequestType,
      message: 'نوع درخواست با موفقیت ایجاد شد',
    });
  } catch (error) {
    logger.error('خطا در ایجاد نوع درخواست جدید:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ایجاد نوع درخواست جدید',
      error: (error as Error).message,
    });
  }
};

// بروزرسانی نوع درخواست
export const updateRequestType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, isActive, fieldConfig } = req.body as UpdateRequestTypeDto;
    
    // بررسی وجود نوع درخواست
    const requestType = await prisma.requestType.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!requestType) {
      return res.status(404).json({
        success: false,
        message: 'نوع درخواست مورد نظر یافت نشد',
      });
    }
    
    // بررسی تکراری‌نبودن نام در صورت تغییر
    if (name && name !== requestType.name) {
      const existingType = await prisma.requestType.findUnique({
        where: {
          name,
        },
      });
      
      if (existingType) {
        return res.status(400).json({
          success: false,
          message: 'نوع درخواست با این نام قبلاً ثبت شده است',
        });
      }
    }
    
    const updatedRequestType = await prisma.requestType.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(fieldConfig && { fieldConfig: fieldConfig as any }),
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
    
    logger.info(`نوع درخواست با شناسه ${id} بروزرسانی شد`);
    
    return res.status(200).json({
      success: true,
      data: updatedRequestType,
      message: 'نوع درخواست با موفقیت بروزرسانی شد',
    });
  } catch (error) {
    logger.error('خطا در بروزرسانی نوع درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی نوع درخواست',
      error: (error as Error).message,
    });
  }
};

// حذف نوع درخواست
export const deleteRequestType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // بررسی وجود نوع درخواست
    const requestType = await prisma.requestType.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        requests: {
          take: 1,
        },
      },
    });
    
    if (!requestType) {
      return res.status(404).json({
        success: false,
        message: 'نوع درخواست مورد نظر یافت نشد',
      });
    }
    
    // بررسی استفاده نشدن در درخواست‌ها
    if (requestType.requests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'این نوع درخواست در درخواست‌های موجود استفاده شده است و قابل حذف نیست',
      });
    }
    
    await prisma.requestType.delete({
      where: {
        id: Number(id),
      },
    });
    
    logger.info(`نوع درخواست با شناسه ${id} حذف شد`);
    
    return res.status(200).json({
      success: true,
      message: 'نوع درخواست با موفقیت حذف شد',
    });
  } catch (error) {
    logger.error('خطا در حذف نوع درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در حذف نوع درخواست',
      error: (error as Error).message,
    });
  }
}; 