// server/src/controllers/requestSubGroupController.ts
// کنترلر برای مدیریت زیرگروه‌های درخواست

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// دریافت زیرگروه‌های یک گروه درخواست با پاجینیشن
export const getSubGroupsByGroup = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, groupId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    
    // فیلترهای جستجو
    const where: any = {
      isActive: true,
    };
    
    // اگر گروه مشخص شده باشد
    if (groupId) {
      where.groupId = Number(groupId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'شناسه گروه مورد نیاز است',
      });
    }
    
    // دریافت زیرگروه‌ها با تعداد درخواست‌ها
    const [subGroups, totalItems] = await Promise.all([
      prisma.requestSubGroup.findMany({
        where,
        include: {
          group: {
            select: {
              id: true,
              name: true,
              requestTypeId: true,
              requestType: {
                select: {
                  id: true,
                  name: true,
                },
              },
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
      prisma.requestSubGroup.count({ where }),
    ]);
    
    const totalPages = Math.ceil(totalItems / take);
    
    return res.json({
      success: true,
      data: subGroups,
      pagination: {
        page: Number(page),
        limit: take,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    logger.error('خطا در دریافت زیرگروه‌های درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت زیرگروه‌های درخواست',
    });
  }
};

// دریافت یک زیرگروه درخواست با شناسه
export const getSubGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const subGroup = await prisma.requestSubGroup.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            requestTypeId: true,
            requestType: {
              select: {
                id: true,
                name: true,
              },
            },
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
            requests: true,
          },
        },
      },
    });
    
    if (!subGroup) {
      return res.status(404).json({
        success: false,
        message: 'زیرگروه درخواست یافت نشد',
      });
    }
    
    return res.json({
      success: true,
      data: subGroup,
    });
  } catch (error) {
    logger.error(`خطا در دریافت زیرگروه درخواست با شناسه ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات زیرگروه درخواست',
    });
  }
};

// ایجاد زیرگروه درخواست جدید
export const createSubGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, groupId } = req.body;
    
    // بررسی وجود گروه درخواست
    const requestGroup = await prisma.requestGroup.findUnique({
      where: {
        id: Number(groupId),
      },
    });
    
    if (!requestGroup) {
      return res.status(404).json({
        success: false,
        message: 'گروه درخواست یافت نشد',
      });
    }
    
    // ایجاد زیرگروه درخواست جدید
    const newSubGroup = await prisma.requestSubGroup.create({
      data: {
        name,
        description,
        groupId: Number(groupId),
        createdBy: req.user!.id,
        isActive: true,
      },
      include: {
        group: {
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
      message: 'زیرگروه درخواست با موفقیت ایجاد شد',
      data: newSubGroup,
    });
  } catch (error) {
    logger.error('خطا در ایجاد زیرگروه درخواست:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ایجاد زیرگروه درخواست',
    });
  }
};

// به‌روزرسانی زیرگروه درخواست
export const updateSubGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, groupId } = req.body;
    
    // بررسی وجود زیرگروه درخواست
    const existingSubGroup = await prisma.requestSubGroup.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!existingSubGroup) {
      return res.status(404).json({
        success: false,
        message: 'زیرگروه درخواست یافت نشد',
      });
    }
    
    // اگر گروه تغییر کرده باشد، بررسی وجود گروه جدید
    if (groupId && groupId !== existingSubGroup.groupId) {
      const requestGroup = await prisma.requestGroup.findUnique({
        where: {
          id: Number(groupId),
        },
      });
      
      if (!requestGroup) {
        return res.status(404).json({
          success: false,
          message: 'گروه درخواست یافت نشد',
        });
      }
    }
    
    // به‌روزرسانی زیرگروه درخواست
    const updatedSubGroup = await prisma.requestSubGroup.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        groupId: groupId !== undefined ? Number(groupId) : undefined,
      },
      include: {
        group: {
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
      message: 'زیرگروه درخواست با موفقیت به‌روزرسانی شد',
      data: updatedSubGroup,
    });
  } catch (error) {
    logger.error(`خطا در به‌روزرسانی زیرگروه درخواست با شناسه ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی زیرگروه درخواست',
    });
  }
};

// حذف زیرگروه درخواست
export const deleteSubGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // بررسی وجود زیرگروه درخواست
    const subGroup = await prisma.requestSubGroup.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        _count: {
          select: {
            requests: true,
          },
        },
      },
    });
    
    if (!subGroup) {
      return res.status(404).json({
        success: false,
        message: 'زیرگروه درخواست یافت نشد',
      });
    }
    
    // بررسی وجود درخواست‌های وابسته
    if (subGroup._count.requests > 0) {
      return res.status(400).json({
        success: false,
        message: 'امکان حذف زیرگروه درخواست به دلیل وجود درخواست‌های وابسته وجود ندارد',
      });
    }
    
    // حذف زیرگروه درخواست
    await prisma.requestSubGroup.delete({
      where: {
        id: Number(id),
      },
    });
    
    return res.json({
      success: true,
      message: 'زیرگروه درخواست با موفقیت حذف شد',
    });
  } catch (error) {
    logger.error(`خطا در حذف زیرگروه درخواست با شناسه ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'خطا در حذف زیرگروه درخواست',
    });
  }
};

// تغییر وضعیت فعال/غیرفعال زیرگروه درخواست
export const toggleSubGroupStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    // بررسی وجود زیرگروه درخواست
    const subGroup = await prisma.requestSubGroup.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!subGroup) {
      return res.status(404).json({
        success: false,
        message: 'زیرگروه درخواست یافت نشد',
      });
    }
    
    // به‌روزرسانی وضعیت زیرگروه درخواست
    const updatedSubGroup = await prisma.requestSubGroup.update({
      where: {
        id: Number(id),
      },
      data: {
        isActive: isActive,
      },
      include: {
        group: {
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
      message: `زیرگروه درخواست با موفقیت ${isActive ? 'فعال' : 'غیرفعال'} شد`,
      data: updatedSubGroup,
    });
  } catch (error) {
    logger.error(`خطا در تغییر وضعیت زیرگروه درخواست با شناسه ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'خطا در تغییر وضعیت زیرگروه درخواست',
    });
  }
};

// دریافت تمام زیرگروه‌های فعال
export const getAllActiveSubGroups = async (req: Request, res: Response) => {
  try {
    const subGroups = await prisma.requestSubGroup.findMany({
      where: {
        isActive: true,
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            requestTypeId: true,
            requestType: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return res.json({
      success: true,
      data: subGroups,
    });
  } catch (error) {
    logger.error('خطا در دریافت زیرگروه‌های فعال:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت زیرگروه‌های فعال',
    });
  }
}; 