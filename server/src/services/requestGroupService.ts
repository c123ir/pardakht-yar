// server/src/services/requestGroupService.ts
// سرویس برای مدیریت گروه‌های درخواست

import { PrismaClient, RequestGroup } from '@prisma/client';
import { Logger } from '../utils/logger';

const prisma = new PrismaClient();
const logger = new Logger('RequestGroupService');

/**
 * سرویس مدیریت گروه‌های درخواست
 */
export class RequestGroupService {
  /**
   * ایجاد گروه درخواست جدید
   * @param data اطلاعات گروه درخواست
   * @returns گروه درخواست ایجاد شده
   */
  static async create(data: {
    name: string;
    description?: string;
    requestTypeId: number;
    createdBy: number;
  }): Promise<RequestGroup> {
    try {
      // بررسی وجود نوع درخواست
      const requestType = await prisma.requestType.findUnique({
        where: { id: data.requestTypeId }
      });

      if (!requestType) {
        throw new Error('نوع درخواست مورد نظر یافت نشد');
      }

      const requestGroup = await prisma.requestGroup.create({
        data: {
          name: data.name,
          description: data.description,
          requestTypeId: data.requestTypeId,
          createdBy: data.createdBy,
          isActive: true
        }
      });

      logger.info(`گروه درخواست جدید با نام "${data.name}" ایجاد شد`);
      return requestGroup;
    } catch (error) {
      logger.error(`خطا در ایجاد گروه درخواست:`, error);
      throw error;
    }
  }

  /**
   * ویرایش گروه درخواست
   * @param id شناسه گروه درخواست
   * @param data اطلاعات به‌روزرسانی
   * @returns گروه درخواست به‌روزرسانی شده
   */
  static async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      isActive?: boolean;
    }
  ): Promise<RequestGroup> {
    try {
      // بررسی وجود گروه درخواست
      const existingGroup = await prisma.requestGroup.findUnique({
        where: { id }
      });

      if (!existingGroup) {
        throw new Error('گروه درخواست مورد نظر یافت نشد');
      }

      const updatedGroup = await prisma.requestGroup.update({
        where: { id },
        data
      });

      logger.info(`گروه درخواست ${id} به‌روزرسانی شد`);
      return updatedGroup;
    } catch (error) {
      logger.error(`خطا در به‌روزرسانی گروه درخواست ${id}:`, error);
      throw error;
    }
  }

  /**
   * حذف گروه درخواست
   * @param id شناسه گروه درخواست
   * @returns نتیجه حذف
   */
  static async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      // بررسی وجود گروه درخواست
      const existingGroup = await prisma.requestGroup.findUnique({
        where: { id },
        include: {
          subGroups: true,
          requests: true
        }
      });

      if (!existingGroup) {
        throw new Error('گروه درخواست مورد نظر یافت نشد');
      }

      // بررسی وجود زیرگروه‌ها یا درخواست‌ها
      if (existingGroup.subGroups.length > 0 || existingGroup.requests.length > 0) {
        // به جای حذف، گروه را غیرفعال می‌کنیم
        await prisma.requestGroup.update({
          where: { id },
          data: { isActive: false }
        });

        logger.info(`گروه درخواست ${id} غیرفعال شد (به دلیل وجود زیرگروه یا درخواست)`);
        return {
          success: true,
          message: 'گروه درخواست غیرفعال شد. به دلیل وجود زیرگروه یا درخواست، امکان حذف کامل وجود ندارد.'
        };
      }

      // حذف گروه درخواست
      await prisma.requestGroup.delete({
        where: { id }
      });

      logger.info(`گروه درخواست ${id} با موفقیت حذف شد`);
      return {
        success: true,
        message: 'گروه درخواست با موفقیت حذف شد'
      };
    } catch (error) {
      logger.error(`خطا در حذف گروه درخواست ${id}:`, error);
      throw error;
    }
  }

  /**
   * دریافت لیست گروه‌های درخواست بر اساس نوع درخواست
   * @param requestTypeId شناسه نوع درخواست
   * @param page شماره صفحه
   * @param limit تعداد آیتم در هر صفحه
   * @returns لیست گروه‌های درخواست
   */
  static async findByRequestType(
    requestTypeId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: RequestGroup[]; pagination: any }> {
    try {
      const where = { requestTypeId };
      
      const totalItems = await prisma.requestGroup.count({ where });
      
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(totalItems / limit);
      
      const groups = await prisma.requestGroup.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              fullName: true
            }
          },
          requestType: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              subGroups: true,
              requests: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      });
      
      return {
        data: groups,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages
        }
      };
    } catch (error) {
      logger.error(`خطا در دریافت گروه‌های درخواست برای نوع درخواست ${requestTypeId}:`, error);
      throw error;
    }
  }

  /**
   * دریافت یک گروه درخواست با جزئیات
   * @param id شناسه گروه درخواست
   * @returns جزئیات گروه درخواست
   */
  static async findById(id: number): Promise<RequestGroup | null> {
    try {
      const group = await prisma.requestGroup.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              fullName: true
            }
          },
          requestType: {
            select: {
              id: true,
              name: true,
              fieldConfig: true
            }
          },
          subGroups: {
            where: {
              isActive: true
            },
            orderBy: {
              name: 'asc'
            }
          },
          _count: {
            select: {
              requests: true
            }
          }
        }
      });
      
      return group;
    } catch (error) {
      logger.error(`خطا در دریافت جزئیات گروه درخواست ${id}:`, error);
      throw error;
    }
  }

  /**
   * دریافت همه گروه‌های درخواست فعال
   * @returns لیست همه گروه‌های درخواست فعال
   */
  static async findAllActive(): Promise<RequestGroup[]> {
    try {
      const groups = await prisma.requestGroup.findMany({
        where: {
          isActive: true
        },
        include: {
          requestType: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      return groups;
    } catch (error) {
      logger.error(`خطا در دریافت گروه‌های درخواست فعال:`, error);
      throw error;
    }
  }
} 