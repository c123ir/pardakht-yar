// server/src/controllers/requestGroupController.ts
// کنترلر برای مدیریت گروه‌های درخواست

import { Request, Response } from 'express';
import { RequestGroupService } from '../services/requestGroupService';
import { Logger } from '../utils/logger';
import { PrismaClient } from '@prisma/client';

const logger = new Logger('RequestGroupController');
const prisma = new PrismaClient();

// دریافت همه گروه‌های درخواست فعال
export const getAllActiveGroups = async (req: Request, res: Response) => {
  try {
    const groups = await RequestGroupService.findAllActive();
    
    return res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error) {
    logger.error('خطا در دریافت گروه‌های درخواست فعال:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت گروه‌های درخواست فعال',
      error: (error as Error).message,
    });
  }
};

// دریافت گروه‌های درخواست بر اساس نوع درخواست
export const getGroupsByRequestType = async (req: Request, res: Response) => {
  try {
    const { requestTypeId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await RequestGroupService.findByRequestType(
      Number(requestTypeId),
      page,
      limit
    );
    
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error('خطا در دریافت گروه‌های درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت گروه‌های درخواست',
      error: (error as Error).message,
    });
  }
};

// دریافت یک گروه درخواست با شناسه
export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const group = await RequestGroupService.findById(Number(id));
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'گروه درخواست مورد نظر یافت نشد',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    logger.error('خطا در دریافت جزئیات گروه درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت جزئیات گروه درخواست',
      error: (error as Error).message,
    });
  }
};

// ایجاد گروه درخواست جدید
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, requestTypeId } = req.body;
    const userId = req.user!.id;
    
    if (!name || !requestTypeId) {
      return res.status(400).json({
        success: false,
        message: 'نام گروه و نوع درخواست الزامی است',
      });
    }
    
    const newGroup = await RequestGroupService.create({
      name,
      description,
      requestTypeId: Number(requestTypeId),
      createdBy: userId,
    });
    
    logger.info(`گروه درخواست جدید با نام ${name} توسط کاربر ${userId} ایجاد شد`);
    
    return res.status(201).json({
      success: true,
      data: newGroup,
      message: 'گروه درخواست با موفقیت ایجاد شد',
    });
  } catch (error) {
    logger.error('خطا در ایجاد گروه درخواست جدید:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ایجاد گروه درخواست جدید',
      error: (error as Error).message,
    });
  }
};

// بروزرسانی گروه درخواست
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    
    if (!name && description === undefined && isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'حداقل یک فیلد برای بروزرسانی الزامی است',
      });
    }
    
    const updatedGroup = await RequestGroupService.update(
      Number(id),
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      }
    );
    
    logger.info(`گروه درخواست با شناسه ${id} بروزرسانی شد`);
    
    return res.status(200).json({
      success: true,
      data: updatedGroup,
      message: 'گروه درخواست با موفقیت بروزرسانی شد',
    });
  } catch (error) {
    logger.error('خطا در بروزرسانی گروه درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی گروه درخواست',
      error: (error as Error).message,
    });
  }
};

// حذف گروه درخواست
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await RequestGroupService.delete(Number(id));
    
    logger.info(`گروه درخواست با شناسه ${id}: ${result.message}`);
    
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error('خطا در حذف گروه درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در حذف گروه درخواست',
      error: (error as Error).message,
    });
  }
};

// دریافت گروه‌های درخواست با فیلتر و پاجینیشن
export const getRequestGroups = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, requestTypeId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    
    // فیلترهای جستجو
    const where: any = {
      isActive: true,
    };
    
    // اگر نوع درخواست مشخص شده باشد
    if (requestTypeId) {
      where.requestTypeId = Number(requestTypeId);
    }
    
    // دریافت گروه‌ها با تعداد زیرگروه‌ها و درخواست‌ها
    const [groups, totalItems] = await Promise.all([
      prisma.requestGroup.findMany({
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
          _count: {
            select: {
              subGroups: true,
              requests: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      prisma.requestGroup.count({ where }),
    ]);
    
    const totalPages = Math.ceil(totalItems / take);
    
    return res.json({
      success: true,
      data: groups,
      pagination: {
        page: Number(page),
        limit: take,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    logger.error('خطا در دریافت گروه‌های درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت گروه‌های درخواست',
    });
  }
};

// دریافت یک گروه درخواست با شناسه
export const getRequestGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const group = await prisma.requestGroup.findUnique({
      where: {
        id: Number(id),
      },
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
        _count: {
          select: {
            subGroups: true,
            requests: true,
          },
        },
      },
    });
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'گروه درخواست یافت نشد',
      });
    }
    
    return res.json({
      success: true,
      data: group,
    });
  } catch (error) {
    logger.error(`خطا در دریافت گروه درخواست با شناسه ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات گروه درخواست',
    });
  }
};

// ایجاد گروه درخواست جدید
export const createRequestGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, requestTypeId } = req.body;
    
    // بررسی وجود نوع درخواست
    const requestType = await prisma.requestType.findUnique({
      where: {
        id: Number(requestTypeId),
      },
    });
    
    if (!requestType) {
      return res.status(404).json({
        success: false,
        message: 'نوع درخواست یافت نشد',
      });
    }
    
    // ایجاد گروه درخواست جدید
    const newGroup = await prisma.requestGroup.create({
      data: {
        name,
        description,
        requestTypeId: Number(requestTypeId),
        createdBy: req.user!.id,
        isActive: true,
      },
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
      },
    });
    
    return res.status(201).json({
      success: true,
      message: 'گروه درخواست با موفقیت ایجاد شد',
      data: newGroup,
    });
  } catch (error) {
    logger.error('خطا در ایجاد گروه درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ایجاد گروه درخواست',
    });
  }
};

// به‌روزرسانی گروه درخواست
export const updateRequestGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, requestTypeId } = req.body;
    
    // بررسی وجود گروه درخواست
    const existingGroup = await prisma.requestGroup.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!existingGroup) {
      return res.status(404).json({
        success: false,
        message: 'گروه درخواست یافت نشد',
      });
    }
    
    // اگر نوع درخواست تغییر کرده باشد، بررسی وجود نوع درخواست جدید
    if (requestTypeId && requestTypeId !== existingGroup.requestTypeId) {
      const requestType = await prisma.requestType.findUnique({
        where: {
          id: Number(requestTypeId),
        },
      });
      
      if (!requestType) {
        return res.status(404).json({
          success: false,
          message: 'نوع درخواست یافت نشد',
        });
      }
    }
    
    // به‌روزرسانی گروه درخواست
    const updatedGroup = await prisma.requestGroup.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        requestTypeId: requestTypeId !== undefined ? Number(requestTypeId) : undefined,
      },
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
      },
    });
    
    return res.json({
      success: true,
      message: 'گروه درخواست با موفقیت به‌روزرسانی شد',
      data: updatedGroup,
    });
  } catch (error) {
    logger.error(`خطا در به‌روزرسانی گروه درخواست با شناسه ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی گروه درخواست',
    });
  }
};

// حذف گروه درخواست
export const deleteRequestGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // بررسی وجود گروه درخواست
    const group = await prisma.requestGroup.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        _count: {
          select: {
            subGroups: true,
            requests: true,
          },
        },
      },
    });
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'گروه درخواست یافت نشد',
      });
    }
    
    // بررسی وجود زیرگروه‌ها یا درخواست‌های وابسته
    if (group._count.subGroups > 0 || group._count.requests > 0) {
      return res.status(400).json({
        success: false,
        message: 'امکان حذف گروه درخواست به دلیل وجود زیرگروه‌ها یا درخواست‌های وابسته وجود ندارد',
      });
    }
    
    // حذف گروه درخواست
    await prisma.requestGroup.delete({
      where: {
        id: Number(id),
      },
    });
    
    return res.json({
      success: true,
      message: 'گروه درخواست با موفقیت حذف شد',
    });
  } catch (error) {
    logger.error(`خطا در حذف گروه درخواست با شناسه ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'خطا در حذف گروه درخواست',
    });
  }
};

// تغییر وضعیت فعال/غیرفعال گروه درخواست
export const toggleRequestGroupStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    // بررسی وجود گروه درخواست
    const group = await prisma.requestGroup.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'گروه درخواست یافت نشد',
      });
    }
    
    // به‌روزرسانی وضعیت گروه درخواست
    const updatedGroup = await prisma.requestGroup.update({
      where: {
        id: Number(id),
      },
      data: {
        isActive: isActive,
      },
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
      },
    });
    
    return res.json({
      success: true,
      message: `گروه درخواست با موفقیت ${isActive ? 'فعال' : 'غیرفعال'} شد`,
      data: updatedGroup,
    });
  } catch (error) {
    logger.error(`خطا در تغییر وضعیت گروه درخواست با شناسه ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'خطا در تغییر وضعیت گروه درخواست',
    });
  }
};

// دریافت گروه‌های درخواست فعال
export const getActiveRequestGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.requestGroup.findMany({
      where: {
        isActive: true,
      },
      include: {
        requestType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return res.json({
      success: true,
      data: groups,
    });
  } catch (error) {
    logger.error('خطا در دریافت گروه‌های درخواست فعال:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت گروه‌های درخواست فعال',
    });
  }
}; 