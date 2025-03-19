import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// دریافت لیست مخاطبین
export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      status: 'success',
      data: contacts,
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در دریافت لیست مخاطبین',
    });
  }
};

// دریافت اطلاعات یک مخاطب
export const getContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: { id: parseInt(id) },
    });

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'مخاطب مورد نظر یافت نشد',
      });
    }

    res.json({
      status: 'success',
      data: contact,
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در دریافت اطلاعات مخاطب',
    });
  }
};

// ایجاد مخاطب جدید
export const createContact = async (req: Request, res: Response) => {
  try {
    const { companyName, email, phone, address } = req.body;

    const contact = await prisma.contact.create({
      data: {
        companyName,
        email,
        phone,
        address,
        creatorId: req.user?.userId || 1, // استفاده از آیدی کاربر فعلی یا مقدار پیش‌فرض
      },
    });

    res.status(201).json({
      status: 'success',
      data: contact,
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در ایجاد مخاطب',
    });
  }
};

// به‌روزرسانی مخاطب
export const updateContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { companyName, email, phone, address } = req.body;

    const contact = await prisma.contact.update({
      where: { id: parseInt(id) },
      data: {
        companyName,
        email,
        phone,
        address,
      },
    });

    res.json({
      status: 'success',
      data: contact,
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در به‌روزرسانی مخاطب',
    });
  }
};

// حذف مخاطب
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.contact.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      status: 'success',
      message: 'مخاطب با موفقیت حذف شد',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطا در حذف مخاطب',
    });
  }
}; 