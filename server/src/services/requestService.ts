// server/src/services/requestService.ts
// سرویس برای عملیات مشترک مربوط به درخواست‌ها

import { PrismaClient, Request as PrismaRequest, RequestActivity } from '@prisma/client';
import { Logger } from '../utils/logger';
import { RequestStatus } from '../types/request.types';

const prisma = new PrismaClient();
const logger = new Logger('RequestService');

/**
 * سرویس درخواست‌ها برای انجام عملیات مشترک
 */
export class RequestService {
  /**
   * ثبت فعالیت مربوط به درخواست
   * @param requestId شناسه درخواست
   * @param userId شناسه کاربر
   * @param action نوع فعالیت
   * @param details جزئیات فعالیت
   * @returns فعالیت ثبت‌شده
   */
  static async logActivity(
    requestId: number,
    userId: number,
    action: string,
    details?: any
  ): Promise<RequestActivity> {
    try {
      const activity = await prisma.requestActivity.create({
        data: {
          requestId,
          userId,
          action,
          details,
        },
      });
      
      logger.info(`فعالیت "${action}" برای درخواست ${requestId} توسط کاربر ${userId} ثبت شد`);
      
      return activity;
    } catch (error) {
      logger.error(`خطا در ثبت فعالیت "${action}" برای درخواست ${requestId}:`, error);
      throw error;
    }
  }
  
  /**
   * تغییر وضعیت درخواست
   * @param requestId شناسه درخواست
   * @param status وضعیت جدید
   * @param userId شناسه کاربر
   * @param comment توضیحات تغییر وضعیت (اختیاری)
   * @returns درخواست بروزرسانی‌شده
   */
  static async changeStatus(
    requestId: number,
    status: RequestStatus,
    userId: number,
    comment?: string
  ): Promise<PrismaRequest> {
    try {
      // بررسی وجود درخواست
      const request = await prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });
      
      if (!request) {
        throw new Error('درخواست مورد نظر یافت نشد');
      }
      
      // بررسی مجاز بودن تغییر وضعیت
      if (request.status === 'COMPLETED' || request.status === 'CANCELED') {
        throw new Error('درخواست در وضعیت فعلی قابل تغییر نیست');
      }
      
      // بروزرسانی وضعیت درخواست
      const updatedRequest = await prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          status,
        },
      });
      
      // ثبت فعالیت تغییر وضعیت
      await this.logActivity(
        requestId,
        userId,
        'STATUS_CHANGE',
        {
          oldStatus: request.status,
          newStatus: status,
          comment,
        }
      );
      
      logger.info(`وضعیت درخواست ${requestId} از "${request.status}" به "${status}" توسط کاربر ${userId} تغییر یافت`);
      
      return updatedRequest;
    } catch (error) {
      logger.error(`خطا در تغییر وضعیت درخواست ${requestId} به ${status}:`, error);
      throw error;
    }
  }
  
  /**
   * بررسی مجاز بودن ویرایش درخواست
   * @param requestId شناسه درخواست
   * @returns آیا درخواست قابل ویرایش است
   */
  static async isRequestEditable(requestId: number): Promise<boolean> {
    try {
      const request = await prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });
      
      if (!request) {
        throw new Error('درخواست مورد نظر یافت نشد');
      }
      
      // درخواست‌های تکمیل‌شده یا لغوشده قابل ویرایش نیستند
      return request.status !== 'COMPLETED' && request.status !== 'CANCELED';
    } catch (error) {
      logger.error(`خطا در بررسی قابلیت ویرایش درخواست ${requestId}:`, error);
      throw error;
    }
  }
  
  /**
   * بررسی قوانین دسترسی به درخواست
   * @param requestId شناسه درخواست
   * @param userId شناسه کاربر
   * @param userRole نقش کاربر
   * @returns آیا کاربر به درخواست دسترسی دارد
   */
  static async canAccessRequest(
    requestId: number,
    userId: number,
    userRole: string
  ): Promise<boolean> {
    try {
      // مدیران سیستم به همه درخواست‌ها دسترسی دارند
      if (userRole === 'ADMIN' || userRole === 'FINANCIAL_MANAGER') {
        return true;
      }
      
      const request = await prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });
      
      if (!request) {
        throw new Error('درخواست مورد نظر یافت نشد');
      }
      
      // ایجادکننده درخواست و شخص مسئول درخواست به آن دسترسی دارند
      return request.creatorId === userId || request.assigneeId === userId;
    } catch (error) {
      logger.error(`خطا در بررسی دسترسی کاربر ${userId} به درخواست ${requestId}:`, error);
      throw error;
    }
  }
  
  /**
   * جستجوی درخواست‌های یک کاربر
   * @param userId شناسه کاربر
   * @param page شماره صفحه
   * @param limit محدودیت تعداد
   * @returns لیست درخواست‌های کاربر
   */
  static async findUserRequests(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PrismaRequest[], pagination: any }> {
    try {
      const where = {
        OR: [
          { creatorId: userId },
          { assigneeId: userId },
        ],
      };
      
      const totalItems = await prisma.request.count({
        where,
      });
      
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(totalItems / limit);
      
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
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });
      
      return {
        data: requests,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      logger.error(`خطا در جستجوی درخواست‌های کاربر ${userId}:`, error);
      throw error;
    }
  }
}