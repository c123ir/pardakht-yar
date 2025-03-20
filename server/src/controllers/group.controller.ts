import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { Logger } from '../utils/logger';

const logger = new Logger('GroupController');

// دریافت لیست گروه‌ها
export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.paymentGroup.findMany({
      include: {
        members: true,
      },
    });
    res.json({ success: true, data: groups });
  } catch (error) {
    logger.error('Error fetching groups:', error);
    res.status(500).json({ success: false, message: 'خطا در دریافت لیست گروه‌ها' });
  }
};

// دریافت اطلاعات یک گروه
export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = await prisma.paymentGroup.findUnique({
      where: { id: parseInt(id) },
      include: {
        members: true,
      },
    });
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'گروه یافت نشد' });
    }
    
    res.json({ success: true, data: group });
  } catch (error) {
    logger.error('Error fetching group:', error);
    res.status(500).json({ success: false, message: 'خطا در دریافت اطلاعات گروه' });
  }
};

// ایجاد گروه جدید
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    // اطمینان از وجود req.user
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'احراز هویت ناموفق' });
    }
    
    const group = await prisma.paymentGroup.create({
      data: {
        title: name,
        description,
        creatorId: req.user.userId,
      },
      include: {
        members: true,
      },
    });
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    logger.error('Error creating group:', error);
    res.status(500).json({ success: false, message: 'خطا در ایجاد گروه' });
  }
};

// به‌روزرسانی گروه
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const group = await prisma.paymentGroup.update({
      where: { id: parseInt(id) },
      data: {
        title: name,
        description,
      },
      include: {
        members: true,
      },
    });
    res.json({ success: true, data: group });
  } catch (error) {
    logger.error('Error updating group:', error);
    res.status(500).json({ success: false, message: 'خطا در بروزرسانی گروه' });
  }
};

// حذف گروه
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.paymentGroup.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true, message: 'گروه با موفقیت حذف شد' });
  } catch (error) {
    logger.error('Error deleting group:', error);
    res.status(500).json({ success: false, message: 'خطا در حذف گروه' });
  }
}; 