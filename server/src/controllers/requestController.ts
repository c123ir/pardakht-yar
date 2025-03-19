// server/src/controllers/requestController.ts
// کنترلر برای مدیریت درخواست‌ها

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  CreateRequestDto, 
  UpdateRequestDto, 
  RequestFilter, 
  RequestStatus 
} from '../types/request.types';
import { Logger } from '../utils/logger';
import { RequestService } from '../services/requestService';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const logger = new Logger('RequestController');
const UPLOADS_DIR = path.join(__dirname, '../../uploads/requests');

// ایجاد پوشه آپلود در صورت عدم وجود
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// دریافت همه درخواست‌ها با فیلتر و صفحه‌بندی
export const getRequests = async (req: Request, res: Response) => {
  try {
    const {
      requestTypeId,
      status,
      creatorId,
      assigneeId,
      contactId,
      groupId,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query as unknown as RequestFilter;
    
    // تنظیم فیلترها
    let where: any = {};
    
    if (requestTypeId) {
      where.requestTypeId = Number(requestTypeId);
    }
    
    if (status) {
      where.status = status;
    }
    
    if (creatorId) {
      where.creatorId = Number(creatorId);
    }
    
    if (assigneeId) {
      where.assigneeId = Number(assigneeId);
    }
    
    if (contactId) {
      where.contactId = Number(contactId);
    }
    
    if (groupId) {
      where.groupId = Number(groupId);
    }
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.createdAt = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.createdAt = {
        lte: new Date(endDate),
      };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { beneficiaryName: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // محاسبه تعداد کل آیتم‌ها
    const totalItems = await prisma.request.count({
      where,
    });
    
    // تنظیم صفحه‌بندی
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const totalPages = Math.ceil(totalItems / limitNum);
    
    // تنظیم مرتب‌سازی
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    // دریافت درخواست‌ها
    const requests = await prisma.request.findMany({
      where,
      include: {
        requestType: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            fullName: true,
          },
        },
        contact: {
          select: {
            id: true,
            companyName: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            attachments: true,
            activities: true,
          },
        },
      },
      orderBy,
      skip,
      take: limitNum,
    });
    
    return res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    logger.error('خطا در دریافت لیست درخواست‌ها:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست درخواست‌ها',
      error: (error as Error).message,
    });
  }
};

// دریافت یک درخواست با شناسه
export const getRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;
    
    // بررسی دسترسی کاربر به درخواست
    const hasAccess = await RequestService.canAccessRequest(Number(id), userId, userRole);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'شما دسترسی لازم برای مشاهده این درخواست را ندارید',
      });
    }
    
    const request = await prisma.request.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        requestType: true,
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            fullName: true,
          },
        },
        contact: true,
        group: true,
        attachments: {
          include: {
            uploader: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            uploadedAt: 'desc',
          },
        },
        activities: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'درخواست مورد نظر یافت نشد',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    logger.error('خطا در دریافت جزئیات درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت جزئیات درخواست',
      error: (error as Error).message,
    });
  }
};

// ایجاد درخواست جدید
export const createRequest = async (req: Request, res: Response) => {
  try {
    const {
      requestTypeId,
      title,
      description,
      amount,
      effectiveDate,
      beneficiaryName,
      beneficiaryPhone,
      contactId,
      groupId,
      assigneeId,
    } = req.body as CreateRequestDto;
    
    // بررسی وجود کاربر در درخواست
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      });
    }
    
    const userId = req.user.id;
    
    // بررسی وجود نوع درخواست
    const requestType = await prisma.requestType.findUnique({
      where: {
        id: Number(requestTypeId),
        isActive: true,
      },
    });
    
    if (!requestType) {
      return res.status(404).json({
        success: false,
        message: 'نوع درخواست مورد نظر یافت نشد یا غیر فعال است',
      });
    }
    
    // ایجاد درخواست جدید
    const newRequest = await prisma.request.create({
      data: {
        requestTypeId: Number(requestTypeId),
        title,
        description,
        amount: amount ? Number(amount) : null,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
        beneficiaryName,
        beneficiaryPhone,
        contactId: contactId ? Number(contactId) : null,
        groupId: groupId ? Number(groupId) : null,
        status: 'PENDING' as RequestStatus,
        creatorId: userId,
        assigneeId: assigneeId ? Number(assigneeId) : null,
      },
    });
    
    // ثبت فعالیت ایجاد درخواست
    await RequestService.logActivity(
      newRequest.id,
      userId,
      'CREATE',
      {
        title,
        requestTypeId,
        status: 'PENDING',
      }
    );
    
    logger.info(`درخواست جدید با شناسه ${newRequest.id} توسط کاربر ${userId} ایجاد شد`);
    
    return res.status(201).json({
      success: true,
      data: newRequest,
      message: 'درخواست با موفقیت ایجاد شد',
    });
  } catch (error) {
    logger.error('خطا در ایجاد درخواست جدید:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ایجاد درخواست جدید',
      error: (error as Error).message,
    });
  }
};

// بروزرسانی درخواست
export const updateRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      amount,
      effectiveDate,
      beneficiaryName,
      beneficiaryPhone,
      contactId,
      groupId,
      status,
      assigneeId,
    } = req.body as UpdateRequestDto;
    
    const userId = req.user!.id;
    const userRole = req.user!.role;
    
    // بررسی دسترسی کاربر به درخواست
    const hasAccess = await RequestService.canAccessRequest(Number(id), userId, userRole);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'شما دسترسی لازم برای ویرایش این درخواست را ندارید',
      });
    }
    
    // بررسی قابلیت ویرایش درخواست
    const isEditable = await RequestService.isRequestEditable(Number(id));
    if (!isEditable) {
      return res.status(400).json({
        success: false,
        message: 'درخواست در وضعیت فعلی قابل ویرایش نیست',
      });
    }
    
    // بروزرسانی درخواست
    const updatedRequest = await prisma.request.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(amount !== undefined && { amount: amount ? Number(amount) : null }),
        ...(effectiveDate !== undefined && { effectiveDate: effectiveDate ? new Date(effectiveDate) : null }),
        ...(beneficiaryName !== undefined && { beneficiaryName }),
        ...(beneficiaryPhone !== undefined && { beneficiaryPhone }),
        ...(contactId !== undefined && { contactId: contactId ? Number(contactId) : null }),
        ...(groupId !== undefined && { groupId: groupId ? Number(groupId) : null }),
        ...(status && { status }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId ? Number(assigneeId) : null }),
      },
    });
    
    // ثبت فعالیت بروزرسانی درخواست
    await RequestService.logActivity(
      Number(id),
      userId,
      'UPDATE',
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(amount !== undefined && { amount }),
        ...(effectiveDate !== undefined && { effectiveDate }),
        ...(beneficiaryName !== undefined && { beneficiaryName }),
        ...(beneficiaryPhone !== undefined && { beneficiaryPhone }),
        ...(contactId !== undefined && { contactId }),
        ...(groupId !== undefined && { groupId }),
        ...(status && { status }),
        ...(assigneeId !== undefined && { assigneeId }),
      }
    );
    
    logger.info(`درخواست با شناسه ${id} توسط کاربر ${userId} بروزرسانی شد`);
    
    return res.status(200).json({
      success: true,
      data: updatedRequest,
      message: 'درخواست با موفقیت بروزرسانی شد',
    });
  } catch (error) {
    logger.error('خطا در بروزرسانی درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی درخواست',
      error: (error as Error).message,
    });
  }
};

// تغییر وضعیت درخواست
export const changeRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const userId = req.user!.id;
    
    if (!status || !['PENDING', 'APPROVED', 'PAID', 'REJECTED', 'COMPLETED', 'CANCELED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'وضعیت نامعتبر است',
      });
    }
    
    try {
      // استفاده از سرویس برای تغییر وضعیت
      const updatedRequest = await RequestService.changeStatus(
        Number(id),
        status as RequestStatus,
        userId,
        comment
      );
      
      return res.status(200).json({
        success: true,
        data: updatedRequest,
        message: 'وضعیت درخواست با موفقیت تغییر یافت',
      });
    } catch (error) {
      if ((error as Error).message.includes('یافت نشد')) {
        return res.status(404).json({
          success: false,
          message: (error as Error).message,
        });
      } else if ((error as Error).message.includes('قابل تغییر نیست')) {
        return res.status(400).json({
          success: false,
          message: (error as Error).message,
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error('خطا در تغییر وضعیت درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در تغییر وضعیت درخواست',
      error: (error as Error).message,
    });
  }
};

// آپلود پیوست برای درخواست
export const uploadAttachment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'فایلی برای آپلود انتخاب نشده است',
      });
    }
    
    // بررسی وجود درخواست
    const request = await prisma.request.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'درخواست مورد نظر یافت نشد',
      });
    }
    
    // بررسی قابلیت ویرایش درخواست
    const isEditable = await RequestService.isRequestEditable(Number(id));
    if (!isEditable) {
      return res.status(400).json({
        success: false,
        message: 'درخواست در وضعیت فعلی قابل ویرایش نیست',
      });
    }
    
    // تولید نام فایل منحصر به فرد
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    // ذخیره فایل
    fs.writeFileSync(filePath, req.file.buffer);
    
    // ثبت اطلاعات پیوست در دیتابیس
    const attachment = await prisma.requestAttachment.create({
      data: {
        requestId: Number(id),
        filePath: `/uploads/requests/${fileName}`,
        fileType: req.file.mimetype,
        fileName: req.file.originalname,
        uploadedBy: userId,
      },
    });
    
    // ثبت فعالیت آپلود پیوست
    await RequestService.logActivity(
      Number(id),
      userId,
      'ATTACHMENT_UPLOAD',
      {
        attachmentId: attachment.id,
        fileName: req.file.originalname,
      }
    );
    
    logger.info(`پیوست جدید با شناسه ${attachment.id} برای درخواست ${id} توسط کاربر ${userId} آپلود شد`);
    
    return res.status(201).json({
      success: true,
      data: attachment,
      message: 'پیوست با موفقیت آپلود شد',
    });
  } catch (error) {
    logger.error('خطا در آپلود پیوست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در آپلود پیوست',
      error: (error as Error).message,
    });
  }
};

// حذف پیوست
export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const { id, attachmentId } = req.params;
    const userId = req.user!.id;
    
    // بررسی وجود پیوست
    const attachment = await prisma.requestAttachment.findUnique({
      where: {
        id: Number(attachmentId),
        requestId: Number(id),
      },
    });
    
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'پیوست مورد نظر یافت نشد',
      });
    }
    
    // بررسی قابلیت ویرایش درخواست
    const isEditable = await RequestService.isRequestEditable(Number(id));
    if (!isEditable) {
      return res.status(400).json({
        success: false,
        message: 'درخواست در وضعیت فعلی قابل ویرایش نیست',
      });
    }
    
    // حذف فایل فیزیکی
    const filePath = path.join(UPLOADS_DIR, path.basename(attachment.filePath));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // حذف پیوست از دیتابیس
    await prisma.requestAttachment.delete({
      where: {
        id: Number(attachmentId),
      },
    });
    
    // ثبت فعالیت حذف پیوست
    await RequestService.logActivity(
      Number(id),
      userId,
      'ATTACHMENT_DELETE',
      {
        attachmentId: Number(attachmentId),
        fileName: attachment.fileName,
      }
    );
    
    logger.info(`پیوست با شناسه ${attachmentId} از درخواست ${id} توسط کاربر ${userId} حذف شد`);
    
    return res.status(200).json({
      success: true,
      message: 'پیوست با موفقیت حذف شد',
    });
  } catch (error) {
    logger.error('خطا در حذف پیوست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در حذف پیوست',
      error: (error as Error).message,
    });
  }
};

// اضافه کردن فعالیت/کامنت به درخواست
export const addActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, details } = req.body;
    const userId = req.user!.id;
    
    if (!action) {
      return res.status(400).json({
        success: false,
        message: 'نوع فعالیت مشخص نشده است',
      });
    }
    
    // بررسی وجود درخواست
    const request = await prisma.request.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'درخواست مورد نظر یافت نشد',
      });
    }
    
    // ثبت فعالیت
    const activity = await RequestService.logActivity(
      Number(id),
      userId,
      action,
      details
    );
    
    // بازیابی اطلاعات کامل با روابط
    const activityWithUser = await prisma.requestActivity.findUnique({
      where: {
        id: activity.id,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
    
    logger.info(`فعالیت جدید برای درخواست ${id} توسط کاربر ${userId} ثبت شد`);
    
    return res.status(201).json({
      success: true,
      data: activityWithUser,
      message: 'فعالیت با موفقیت ثبت شد',
    });
  } catch (error) {
    logger.error('خطا در ثبت فعالیت:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ثبت فعالیت',
      error: (error as Error).message,
    });
  }
}; 