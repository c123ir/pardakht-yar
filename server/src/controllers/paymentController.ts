// server/src/controllers/paymentController.ts
// کنترلر مدیریت پرداخت‌ها

import { Request, Response } from 'express';
import { PrismaClient, Prisma, PaymentStatus } from '@prisma/client';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import logger from '../config/logger';
import { ApiError } from '../middleware/error';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';
import { sendSMS } from '../services/smsService';
import config from '../config/app';

const prisma = new PrismaClient();

/**
 * دریافت لیست درخواست‌های پرداخت
 */
export const getPayments = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      groupId,
      contactId,
      startDate,
      endDate,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // تبدیل پارامترها به فرمت مناسب
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    
    // ساخت شروط جستجو
    const whereConditions: Prisma.PaymentRequestWhereInput = {};
    
    // فیلتر بر اساس وضعیت
    if (status) {
      whereConditions.status = status as PaymentStatus;
    }
    
    // فیلتر بر اساس گروه
    if (groupId) {
      whereConditions.groupId = Number(groupId);
    }
    
    // فیلتر بر اساس طرف‌حساب
    if (contactId) {
      whereConditions.contactId = Number(contactId);
    }
    
    // فیلتر بر اساس تاریخ
    if (startDate || endDate) {
      whereConditions.effectiveDate = {};
      
      if (startDate) {
        whereConditions.effectiveDate.gte = new Date(String(startDate));
      }
      
      if (endDate) {
        whereConditions.effectiveDate.lte = new Date(String(endDate));
      }
    }
    
    // جستجوی متنی
    if (search) {
      const searchStr = String(search);
      const searchNumber = isNaN(Number(search)) ? undefined : Number(search);
      
      whereConditions.OR = [
        { title: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
        { beneficiaryName: { contains: searchStr, mode: 'insensitive' } },
      ];
      
      // اگر جستجو عددی باشد، در مبلغ هم جستجو می‌کنیم
      if (searchNumber) {
        whereConditions.OR.push({ amount: searchNumber });
      }
    }
    
    // تنظیم مرتب‌سازی
    const orderBy: any = {};
    orderBy[String(sortBy)] = String(sortOrder).toLowerCase();

    // گرفتن پرداخت‌ها از پایگاه داده
    const [payments, totalItems] = await Promise.all([
      prisma.paymentRequest.findMany({
        where: whereConditions,
        skip,
        take: limitNumber,
        orderBy,
        include: {
          contact: {
            select: {
              id: true,
              companyName: true,
            },
          },
          group: {
            select: {
              id: true,
              title: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              fullName: true,
            },
          },
          paidBy: {
            select: {
              id: true,
              fullName: true,
            },
          },
          images: {
            select: {
              id: true,
              filePath: true,
              thumbnailPath: true,
              uploadedAt: true,
            },
            take: 1,
            orderBy: {
              uploadedAt: 'desc',
            },
          },
        },
      }),
      prisma.paymentRequest.count({
        where: whereConditions,
      }),
    ]);

    // آماده‌سازی پاسخ
    const totalPages = Math.ceil(totalItems / limitNumber);

    return res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    logger.error('خطا در دریافت لیست درخواست‌های پرداخت', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت لیست درخواست‌های پرداخت',
    });
  }
};

/**
 * دریافت اطلاعات یک درخواست پرداخت با شناسه
 */
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentId = parseInt(id);

    if (isNaN(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه درخواست پرداخت نامعتبر است',
      });
    }

    // گرفتن پرداخت از پایگاه داده
    const payment = await prisma.paymentRequest.findUnique({
      where: { id: paymentId },
      include: {
        contact: {
          select: {
            id: true,
            companyName: true,
            accountantName: true,
            accountantPhone: true,
          },
        },
        group: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
        paidBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
        images: {
          select: {
            id: true,
            fileName: true,
            filePath: true,
            thumbnailPath: true,
            originalName: true,
            size: true,
            mimeType: true,
            hasWatermark: true,
            uploadedAt: true,
            uploadedBy: {
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
        notifications: {
          select: {
            id: true,
            message: true,
            method: true,
            status: true,
            sentAt: true,
          },
          orderBy: {
            sentAt: 'desc',
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'درخواست پرداخت مورد نظر یافت نشد',
      });
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    logger.error('خطا در دریافت اطلاعات درخواست پرداخت', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت اطلاعات درخواست پرداخت',
    });
  }
};

/**
 * به‌روزرسانی درخواست پرداخت
 */
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentId = parseInt(id);
    
    if (isNaN(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه درخواست پرداخت نامعتبر است',
      });
    }

    // دریافت اطلاعات از بدنه درخواست
    const { 
      title, 
      amount,
      effectiveDate,
      description,
      status,
      groupId,
      contactId,
      beneficiaryName,
      beneficiaryPhone,
    } = req.body;

    // بررسی وجود درخواست پرداخت
    const existingPayment = await prisma.paymentRequest.findUnique({
      where: { id: paymentId },
    });

    if (!existingPayment) {
      return res.status(404).json({
        success: false,
        message: 'درخواست پرداخت مورد نظر یافت نشد',
      });
    }

    // تبدیل شماره موبایل فارسی به انگلیسی
    const phoneNormalized = beneficiaryPhone ? convertPersianToEnglishNumbers(beneficiaryPhone) : undefined;

    // آماده‌سازی داده‌ها برای به‌روزرسانی
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (amount !== undefined) updateData.amount = Number(amount);
    if (effectiveDate !== undefined) updateData.effectiveDate = new Date(effectiveDate);
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (groupId !== undefined) updateData.groupId = groupId ? Number(groupId) : null;
    if (contactId !== undefined) updateData.contactId = contactId ? Number(contactId) : null;
    if (beneficiaryName !== undefined) updateData.beneficiaryName = beneficiaryName;
    if (phoneNormalized !== undefined) updateData.beneficiaryPhone = phoneNormalized;
    
    // ثبت کاربر به‌روزرسان
    updateData.updaterId = req.user!.id;

    // به‌روزرسانی در وضعیت 'پرداخت شده'
    if (status === 'PAID' && existingPayment.status !== 'PAID') {
      updateData.paymentDate = new Date();
      updateData.paidById = req.user!.id;
    }

    // به‌روزرسانی درخواست پرداخت
    const updatedPayment = await prisma.paymentRequest.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        contact: {
          select: {
            companyName: true,
          },
        },
        group: {
          select: {
            title: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedPayment,
    });
  } catch (error) {
    logger.error('خطا در به‌روزرسانی درخواست پرداخت', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در به‌روزرسانی درخواست پرداخت',
    });
  }
};

/**
 * تغییر وضعیت درخواست پرداخت
 */
export const changePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const paymentId = parseInt(id);
    
    if (isNaN(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه درخواست پرداخت نامعتبر است',
      });
    }

    if (!status || !Object.values(PaymentStatus).includes(status as PaymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'وضعیت درخواست پرداخت نامعتبر است',
      });
    }

    // بررسی وجود درخواست پرداخت
    const payment = await prisma.paymentRequest.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'درخواست پرداخت مورد نظر یافت نشد',
      });
    }

    // آماده‌سازی داده‌ها برای به‌روزرسانی
    const updateData: any = {
      status,
      updaterId: req.user!.id,
    };

    // در وضعیت 'پرداخت شده'، تاریخ پرداخت و کاربر پرداخت‌کننده را ثبت می‌کنیم
    if (status === 'PAID' && payment.status !== 'PAID') {
      updateData.paymentDate = new Date();
      updateData.paidById = req.user!.id;
    }

    // به‌روزرسانی وضعیت
    const updatedPayment = await prisma.paymentRequest.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        contact: {
          select: {
            companyName: true,
            accountantPhone: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedPayment,
    });
  } catch (error) {
    logger.error('خطا در تغییر وضعیت درخواست پرداخت', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در تغییر وضعیت درخواست پرداخت',
    });
  }
};

/**
 * حذف درخواست پرداخت
 */
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentId = parseInt(id);
    
    if (isNaN(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه درخواست پرداخت نامعتبر است',
      });
    }

    // بررسی وجود درخواست پرداخت
    const payment = await prisma.paymentRequest.findUnique({
      where: { id: paymentId },
      include: {
        images: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'درخواست پرداخت مورد نظر یافت نشد',
      });
    }

    // فقط درخواست‌های در وضعیت "در انتظار" قابل حذف هستند
    if (payment.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'فقط درخواست‌های پرداخت در وضعیت "در انتظار" قابل حذف هستند',
      });
    }

    // حذف فایل‌های تصویر
    for (const image of payment.images) {
      try {
        if (image.filePath) {
          const filePath = path.join(config.upload.path, image.filePath);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        
        if (image.thumbnailPath) {
          const thumbnailPath = path.join(config.upload.path, image.thumbnailPath);
          if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
          }
        }
      } catch (err) {
        logger.error(`خطا در حذف فایل تصویر ${image.fileName}`, err as Error);
      }
    }

    // حذف رکوردهای تصاویر از پایگاه داده
    await prisma.paymentImage.deleteMany({
      where: { paymentId },
    });

    // حذف اطلاع‌رسانی‌ها
    await prisma.notification.deleteMany({
      where: { paymentId },
    });

    // حذف درخواست پرداخت
    await prisma.paymentRequest.delete({
      where: { id: paymentId },
    });

    return res.status(200).json({
      success: true,
      message: 'درخواست پرداخت با موفقیت حذف شد',
    });
  } catch (error) {
    logger.error('خطا در حذف درخواست پرداخت', error as Error);
    
    // اگر خطا به دلیل محدودیت کلید خارجی باشد
    if ((error as any).code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'این درخواست پرداخت به دلیل وابستگی به داده‌های دیگر قابل حذف نیست',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در حذف درخواست پرداخت',
    });
  }
};

/**
 * آپلود تصویر فیش پرداخت
 */
export const uploadPaymentImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentId = parseInt(id);
    
    if (isNaN(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه درخواست پرداخت نامعتبر است',
      });
    }

    // بررسی وجود درخواست پرداخت
    const payment = await prisma.paymentRequest.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'درخواست پرداخت مورد نظر یافت نشد',
      });
    }

    // بررسی وجود فایل
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'لطفاً یک تصویر انتخاب کنید',
      });
    }

    const file = req.file;

    // ایجاد مسیر نسبی فایل در سیستم
    const relativePath = `payments/${file.filename}`;
    const fullPath = path.join(config.upload.path, relativePath);

    // ایجاد تامبنیل
    const thumbnailFilename = `thumb_${file.filename}`;
    const relativeThumbnailPath = `payments/${thumbnailFilename}`;
    const fullThumbnailPath = path.join(config.upload.path, relativeThumbnailPath);

    // ایجاد تامبنیل با sharp
    await sharp(fullPath)
      .resize(300, 300, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFile(fullThumbnailPath);

    // اضافه کردن واترمارک به تصویر اصلی
    const watermarkedFilename = `watermarked_${file.filename}`;
    const relativeWatermarkedPath = `payments/${watermarkedFilename}`;
    const fullWatermarkedPath = path.join(config.upload.path, relativeWatermarkedPath);

    // ایجاد متن واترمارک
    const watermarkText = `پرداخت‌یار - ${payment.title} - ${new Date().toLocaleDateString('fa-IR')}`;

    // اضافه کردن واترمارک به تصویر
    await sharp(fullPath)
      .composite([
        {
          input: Buffer.from(`
            <svg width="1000" height="300">
              <text x="50%" y="50%" font-family="Arial" font-size="36" fill="rgba(255, 255, 255, 0.5)" text-anchor="middle">${watermarkText}</text>
            </svg>`
          ),
          gravity: 'southeast',
        },
      ])
      .toFile(fullWatermarkedPath);

    // ثبت اطلاعات تصویر در پایگاه داده
    const newImage = await prisma.paymentImage.create({
      data: {
        paymentId,
        fileName: watermarkedFilename,
        filePath: relativeWatermarkedPath,
        thumbnailPath: relativeThumbnailPath,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        hasWatermark: true,
        uploaderId: req.user!.id,
      },
    });

    // به‌روزرسانی وضعیت پرداخت به PAID اگر در وضعیت APPROVED باشد
    if (payment.status === 'APPROVED') {
      await prisma.paymentRequest.update({
        where: { id: paymentId },
        data: {
          status: 'PAID',
          paymentDate: new Date(),
          paidById: req.user!.id,
          updaterId: req.user!.id,
        },
      });
    }

    // حذف فایل اصلی بدون واترمارک
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    return res.status(201).json({
      success: true,
      data: newImage,
    });
  } catch (error) {
    logger.error('خطا در آپلود تصویر فیش پرداخت', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در آپلود تصویر فیش پرداخت',
    });
  }
};

/**
 * دریافت تصاویر پرداخت
 */
export const getPaymentImages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentId = parseInt(id);
    
    if (isNaN(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه درخواست پرداخت نامعتبر است',
      });
    }

    // بررسی وجود درخواست پرداخت
    const payment = await prisma.paymentRequest.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'درخواست پرداخت مورد نظر یافت نشد',
      });
    }

    // دریافت تصاویر پرداخت
    const images = await prisma.paymentImage.findMany({
      where: { paymentId },
      orderBy: {
        uploadedAt: 'desc',
      },
      include: {
        uploadedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    logger.error('خطا در دریافت تصاویر پرداخت', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت تصاویر پرداخت',
    });
  }
};

/**
 * ارسال اطلاع‌رسانی پیامکی
 */
export const sendPaymentNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentId = parseInt(id);
    
    if (isNaN(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه درخواست پرداخت نامعتبر است',
      });
    }

    // بررسی وجود درخواست پرداخت
    const payment = await prisma.paymentRequest.findUnique({
      where: { id: paymentId },
      include: {
        contact: true,
        images: {
          orderBy: {
            uploadedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'درخواست پرداخت مورد نظر یافت نشد',
      });
    }

    // بررسی وضعیت پرداخت
    if (payment.status !== 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'فقط پرداخت‌های انجام شده قابل اطلاع‌رسانی هستند',
      });
    }

    // بررسی وجود شماره تماس
    const recipientPhone = 
      payment.beneficiaryPhone || 
      (payment.contact?.accountantPhone) || 
      null;

    if (!recipientPhone) {
      return res.status(400).json({
        success: false,
        message: 'شماره تماس ذینفع یا طرف‌حساب یافت نشد',
      });
    }

    // تعیین نام گیرنده
    const recipientName = 
      payment.beneficiaryName || 
      (payment.contact?.accountantName) || 
      (payment.contact?.companyName) || 
      'کاربر محترم';

    // ساخت متن پیامک
    let smsText = `${recipientName} گرامی،\n`;
    smsText += `پرداخت "${payment.title}" به مبلغ ${payment.amount.toLocaleString()} ریال انجام شد.\n`;
    
    // اگر تصویر داشته باشد، لینک پورتال را هم می‌فرستیم
    if (payment.images.length > 0 && payment.contact?.accessToken) {
      const portalUrl = `${config.server.clientUrl}/portal/${payment.contact.accessToken}`;
      smsText += `برای مشاهده فیش واریزی به لینک زیر مراجعه کنید:\n${portalUrl}`;
    }

    // ارسال پیامک
    const smsResult = await sendSMS(recipientPhone, smsText);

    // ثبت اطلاع‌رسانی
    const notification = await prisma.notification.create({
      data: {
        paymentId,
        recipientType: payment.contact ? 'CONTACT' : 'BENEFICIARY',
        recipientId: payment.contact?.id || 0,
        message: smsText,
        method: 'SMS',
        status: smsResult.success ? 'SENT' : 'FAILED',
        sentAt: new Date(),
      },
    });

    // به‌روزرسانی وضعیت ارسال پیامک در درخواست پرداخت
    await prisma.paymentRequest.update({
      where: { id: paymentId },
      data: {
        isSMSSent: true,
        smsSentAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        notification,
        smsResult,
      },
    });
  } catch (error) {
    logger.error('خطا در ارسال اطلاع‌رسانی پیامکی', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در ارسال اطلاع‌رسانی پیامکی',
    });
  }
};

/**
 * ایجاد درخواست پرداخت جدید
 */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const {
      title,
      amount,
      effectiveDate,
      description,
      groupId,
      contactId,
      beneficiaryName,
      beneficiaryPhone,
    } = req.body;

    // تبدیل شماره موبایل فارسی به انگلیسی
    const phoneNormalized = beneficiaryPhone ? convertPersianToEnglishNumbers(beneficiaryPhone) : undefined;

    // ایجاد درخواست پرداخت جدید
    const newPayment = await prisma.paymentRequest.create({
      data: {
        title,
        amount: Number(amount),
        effectiveDate: new Date(effectiveDate),
        description,
        status: 'PENDING',
        groupId: groupId ? Number(groupId) : null,
        contactId: contactId ? Number(contactId) : null,
        beneficiaryName,
        beneficiaryPhone: phoneNormalized,
        creatorId: req.user!.id,
        updaterId: req.user!.id,
      },
      include: {
        contact: {
          select: {
            companyName: true,
          },
        },
        group: {
          select: {
            title: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: newPayment,
    });
  } catch (error) {
    logger.error('خطا در ایجاد درخواست پرداخت', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در ایجاد درخواست پرداخت',
    });
  }
};

/**
 * حذف تصویر فیش پرداخت
 */
export const deletePaymentImage = async (req: Request, res: Response) => {
  try {
    const { id, imageId } = req.params;
    const paymentId = parseInt(id);
    const paymentImageId = parseInt(imageId);
    
    if (isNaN(paymentId) || isNaN(paymentImageId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه درخواست پرداخت یا تصویر نامعتبر است',
      });
    }

    // بررسی وجود تصویر
    const image = await prisma.paymentImage.findFirst({
      where: {
        id: paymentImageId,
        paymentId: paymentId,
      },
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'تصویر مورد نظر یافت نشد',
      });
    }

    // حذف فایل‌های فیزیکی
    try {
      if (image.filePath) {
        const filePath = path.join(config.upload.path, image.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      if (image.thumbnailPath) {
        const thumbnailPath = path.join(config.upload.path, image.thumbnailPath);
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
    } catch (err) {
      logger.error(`خطا در حذف فایل تصویر ${image.fileName}`, err as Error);
    }

    // حذف رکورد تصویر از پایگاه داده
    await prisma.paymentImage.delete({
      where: { id: paymentImageId },
    });

    return res.status(200).json({
      success: true,
      message: 'تصویر با موفقیت حذف شد',
    });
  } catch (error) {
    logger.error('خطا در حذف تصویر فیش پرداخت', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در حذف تصویر فیش پرداخت',
    });
  }
};

/**
 * دریافت تاریخچه اطلاع‌رسانی‌های پرداخت
 */
export const getPaymentNotifications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentId = parseInt(id);
    
    if (isNaN(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه درخواست پرداخت نامعتبر است',
      });
    }

    // دریافت اطلاع‌رسانی‌های پرداخت
    const notifications = await prisma.notification.findMany({
      where: { paymentId },
      orderBy: {
        sentAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    logger.error('خطا در دریافت تاریخچه اطلاع‌رسانی‌ها', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت تاریخچه اطلاع‌رسانی‌ها',
    });
  }
};  