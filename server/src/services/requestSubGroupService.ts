// server/src/services/requestSubGroupService.ts
// سرویس برای مدیریت زیرگروه‌های درخواست

import { PrismaClient, RequestSubGroup } from '@prisma/client';
import { Logger } from '../utils/logger';

const prisma = new PrismaClient();
const logger = new Logger('RequestSubGroupService');

/**
 * سرویس مدیریت زیرگروه‌های درخواست
 */
export class RequestSubGroupService {
  /**
   * ایجاد زیرگروه درخواست جدید
   * @param data اطلاعات زیرگروه درخواست
   * @returns زیرگروه درخواست ایجاد شده
   */
  static async create(data: {
    name: string;
    description?: string;
    groupId: number;
    createdBy: number;
  }): Promise<RequestSubGroup> {
    try {
      // بررسی وجود گروه اصلی
      const group = await prisma.requestGroup.findUnique({
        where: { id: data.groupId }
      });

      if (!group) {
        throw new Error('گروه درخواست مورد نظر یافت نشد');
      }

      const subGroup = await prisma.requestSubGroup.create({
        data: {
          name: data.name,
          description: data.description,
          groupId: data.groupId,
          createdBy: data.createdBy,
          isActive: true
        }
      });

      logger.info(`زیرگروه درخواست جدید با نام "${data.name}" در گروه ${data.groupId} ایجاد شد`);
      return subGroup;
    } catch (error) {
      logger.error(`خطا در ایجاد زیرگروه درخواست:`, error);
      throw error;
    }
  }

  /**
   * ویرایش زیرگروه درخواست
   * @param id شناسه زیرگروه درخواست
   * @param data اطلاعات به‌روزرسانی
   * @returns زیرگروه درخواست به‌روزرسانی شده
   */
  static async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      isActive?: boolean;
    }
  ): Promise<RequestSubGroup> {
    try {
      // بررسی وجود زیرگروه درخواست
      const existingSubGroup = await prisma.requestSubGroup.findUnique({
        where: { id }
      });

      if (!existingSubGroup) {
        throw new Error('زیرگروه درخواست مورد نظر یافت نشد');
      }

      const updatedSubGroup = await prisma.requestSubGroup.update({
        where: { id },
        data
      });

      logger.info(`زیرگروه درخواست ${id} به‌روزرسانی شد`);
      return updatedSubGroup;
    } catch (error) {
      logger.error(`خطا در به‌روزرسانی زیرگروه درخواست ${id}:`, error);
      throw error;
    }
  }

  /**
   * حذف زیرگروه درخواست
   * @param id شناسه زیرگروه درخواست
   * @returns نتیجه حذف
   */
  static async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      // بررسی وجود زیرگروه درخواست
      const existingSubGroup = await prisma.requestSubGroup.findUnique({
        where: { id },
        include: {
          requests: true
        }
      });

      if (!existingSubGroup) {
        throw new Error('زیرگروه درخواست مورد نظر یافت نشد');
      }

      // بررسی وجود درخواست‌ها
      if (existingSubGroup.requests.length > 0) {
        // به جای حذف، زیرگروه را غیرفعال می‌کنیم
        await prisma.requestSubGroup.update({
          where: { id },
          data: { isActive: false }
        });

        logger.info(`زیرگروه درخواست ${id} غیرفعال شد (به دلیل وجود درخواست)`);
        return {
          success: true,
          message: 'زیرگروه درخواست غیرفعال شد. به دلیل وجود درخواست، امکان حذف کامل وجود ندارد.'
        };
      }

      // حذف زیرگروه درخواست
      await prisma.requestSubGroup.delete({
        where: { id }
      });

      logger.info(`زیرگروه درخواست ${id} با موفقیت حذف شد`);
      return {
        success: true,
        message: 'زیرگروه درخواست با موفقیت حذف شد'
      };
    } catch (error) {
      logger.error(`خطا در حذف زیرگروه درخواست ${id}:`, error);
      throw error;
    }
  }

  /**
   * دریافت لیست زیرگروه‌های یک گروه درخواست
   * @param groupId شناسه گروه درخواست
   * @param page شماره صفحه
   * @param limit تعداد آیتم در هر صفحه
   * @returns لیست زیرگروه‌های درخواست
   */
  static async findByGroup(
    groupId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: RequestSubGroup[]; pagination: any }> {
    try {
      const where = { groupId };
      
      const totalItems = await prisma.requestSubGroup.count({ where });
      
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(totalItems / limit);
      
      const subGroups = await prisma.requestSubGroup.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              fullName: true
            }
          },
          group: {
            select: {
              id: true,
              name: true,
              requestTypeId: true,
              requestType: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
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
        data: subGroups,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages
        }
      };
    } catch (error) {
      logger.error(`خطا در دریافت زیرگروه‌های درخواست برای گروه ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * دریافت یک زیرگروه درخواست با جزئیات
   * @param id شناسه زیرگروه درخواست
   * @returns جزئیات زیرگروه درخواست
   */
  static async findById(id: number): Promise<RequestSubGroup | null> {
    try {
      const subGroup = await prisma.requestSubGroup.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              fullName: true
            }
          },
          group: {
            select: {
              id: true,
              name: true,
              requestTypeId: true,
              requestType: {
                select: {
                  id: true,
                  name: true,
                  fieldConfig: true
                }
              }
            }
          },
          _count: {
            select: {
              requests: true
            }
          }
        }
      });
      
      return subGroup;
    } catch (error) {
      logger.error(`خطا در دریافت جزئیات زیرگروه درخواست ${id}:`, error);
      throw error;
    }
  }

  /**
   * دریافت همه زیرگروه‌های فعال
   * @returns لیست همه زیرگروه‌های فعال
   */
  static async findAllActive(): Promise<RequestSubGroup[]> {
    try {
      const subGroups = await prisma.requestSubGroup.findMany({
        where: {
          isActive: true
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
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      return subGroups;
    } catch (error) {
      logger.error(`خطا در دریافت زیرگروه‌های درخواست فعال:`, error);
      throw error;
    }
  }
} 