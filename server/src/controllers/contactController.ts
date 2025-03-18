// server/src/controllers/contactController.ts
// کنترلر مدیریت طرف‌حساب‌ها

import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';

const prisma = new PrismaClient();

// دریافت لیست طرف‌حساب‌ها
export const getContacts = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // تبدیل پارامترها به فرمت مناسب
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    
    // ساخت شرایط جستجو
    const searchCondition = search 
      ? {
          OR: [
            { companyName: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
            { ceoName: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
            { accountantName: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
            { accountantPhone: { contains: convertPersianToEnglishNumbers(String(search)) } },
            { email: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};
      
    // تنظیم مرتب‌سازی
    const orderBy: any = {};
    orderBy[String(sortBy)] = String(sortOrder).toLowerCase();

    // گرفتن طرف‌حساب‌ها از پایگاه داده
    const [contacts, totalItems] = await Promise.all([
      prisma.contact.findMany({
        where: searchCondition,
        skip,
        take: limitNumber,
        orderBy,
        include: {
          createdBy: {
            select: {
              fullName: true
            }
          }
        }
      }),
      prisma.contact.count({
        where: searchCondition
      })
    ]);

    // آماده‌سازی پاسخ
    const totalPages = Math.ceil(totalItems / limitNumber);

    return res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalItems,
        totalPages
      }
    });
  } catch (error) {
    logger.error('خطا در دریافت لیست طرف‌حساب‌ها', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت لیست طرف‌حساب‌ها'
    });
  }
};

// دریافت اطلاعات یک طرف‌حساب با شناسه
export const getContactById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contactId = parseInt(id);

    if (isNaN(contactId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه طرف‌حساب نامعتبر است'
      });
    }

    // گرفتن طرف‌حساب از پایگاه داده
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        createdBy: {
          select: {
            fullName: true
          }
        },
        paymentRequests: {
          select: {
            id: true,
            title: true,
            amount: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'طرف‌حساب مورد نظر یافت نشد'
      });
    }

    return res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    logger.error('خطا در دریافت اطلاعات طرف‌حساب', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت اطلاعات طرف‌حساب'
    });
  }
};

// ایجاد طرف‌حساب جدید
export const createContact = async (req: Request, res: Response) => {
  try {
    // دریافت اطلاعات از بدنه درخواست
    const { 
      companyName, 
      ceoName,
      fieldOfActivity,
      accountantName, 
      accountantPhone, 
      email,
      address,
      bankInfo
    } = req.body;

    // اعتبارسنجی اطلاعات ضروری
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'نام شرکت الزامی است'
      });
    }

    // تبدیل شماره موبایل فارسی به انگلیسی
    const phoneNormalized = accountantPhone ? convertPersianToEnglishNumbers(accountantPhone) : null;

    // تولید توکن دسترسی منحصر به فرد
    const accessToken = uuidv4();

    // ایجاد طرف‌حساب جدید
    const newContact = await prisma.contact.create({
      data: {
        companyName,
        ceoName,
        fieldOfActivity,
        accountantName,
        accountantPhone: phoneNormalized,
        email,
        address,
        bankInfo: bankInfo ? JSON.parse(JSON.stringify(bankInfo)) : null,
        accessToken,
        creatorId: req.user!.id
      }
    });

    return res.status(201).json({
      success: true,
      data: newContact
    });
  } catch (error) {
    logger.error('خطا در ایجاد طرف‌حساب جدید', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در ایجاد طرف‌حساب جدید'
    });
  }
};

// به‌روزرسانی طرف‌حساب
export const updateContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contactId = parseInt(id);
    
    if (isNaN(contactId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه طرف‌حساب نامعتبر است'
      });
    }

    // دریافت اطلاعات از بدنه درخواست
    const { 
      companyName, 
      ceoName,
      fieldOfActivity,
      accountantName, 
      accountantPhone, 
      email,
      address,
      bankInfo
    } = req.body;

    // بررسی وجود طرف‌حساب
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        message: 'طرف‌حساب مورد نظر یافت نشد'
      });
    }

    // اعتبارسنجی اطلاعات ضروری
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'نام شرکت الزامی است'
      });
    }

    // تبدیل شماره موبایل فارسی به انگلیسی
    const phoneNormalized = accountantPhone ? convertPersianToEnglishNumbers(accountantPhone) : null;

    // به‌روزرسانی طرف‌حساب
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        companyName,
        ceoName,
        fieldOfActivity,
        accountantName,
        accountantPhone: phoneNormalized,
        email,
        address,
        bankInfo: bankInfo ? JSON.parse(JSON.stringify(bankInfo)) : existingContact.bankInfo
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedContact
    });
  } catch (error) {
    logger.error('خطا در به‌روزرسانی طرف‌حساب', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در به‌روزرسانی طرف‌حساب'
    });
  }
};

// بازتولید توکن دسترسی
export const regenerateAccessToken = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contactId = parseInt(id);
    
    if (isNaN(contactId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه طرف‌حساب نامعتبر است'
      });
    }

    // بررسی وجود طرف‌حساب
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        message: 'طرف‌حساب مورد نظر یافت نشد'
      });
    }

    // تولید توکن دسترسی جدید
    const newAccessToken = uuidv4();

    // به‌روزرسانی توکن
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        accessToken: newAccessToken
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        accessToken: updatedContact.accessToken
      }
    });
  } catch (error) {
    logger.error('خطا در بازتولید توکن دسترسی', error as Error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در بازتولید توکن دسترسی'
    });
  }
};

// حذف طرف‌حساب
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contactId = parseInt(id);
    
    if (isNaN(contactId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه طرف‌حساب نامعتبر است'
      });
    }

    // بررسی وجود طرف‌حساب
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        paymentRequests: true
      }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'طرف‌حساب مورد نظر یافت نشد'
      });
    }

    // بررسی وابستگی به پرداخت‌ها
    if (contact.paymentRequests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'این طرف‌حساب دارای سوابق پرداخت است و قابل حذف نیست'
      });
    }

    // حذف فعالیت‌های پورتال مرتبط با طرف‌حساب
    await prisma.contactPortalActivity.deleteMany({
      where: { contactId }
    });

    // حذف طرف‌حساب
    await prisma.contact.delete({
      where: { id: contactId }
    });

    return res.status(200).json({
      success: true,
      message: 'طرف‌حساب با موفقیت حذف شد'
    });
  } catch (error) {
    logger.error('خطا در حذف طرف‌حساب', error as Error);
    
    // اگر خطا به دلیل محدودیت کلید خارجی باشد
    if ((error as any).code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'این طرف‌حساب به دلیل وابستگی به داده‌های دیگر قابل حذف نیست'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در حذف طرف‌حساب'
    });
  }
};