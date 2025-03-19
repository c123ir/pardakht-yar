// server/src/middleware/roleMiddleware.ts
// میدل‌ور کنترل دسترسی براساس نقش کاربر

import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { Logger } from '../utils/logger';

const logger = new Logger('RoleMiddleware');

/**
 * میدل‌ور کنترل دسترسی براساس نقش‌های مجاز
 * @param allowedRoles آرایه‌ای از نقش‌های مجاز
 * @returns میدل‌ور اکسپرس
 */
export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // بررسی وجود کاربر در درخواست (میدل‌ور احراز هویت باید قبلاً اجرا شده باشد)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'احراز هویت نشده است',
        });
      }

      // بررسی نقش کاربر
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(`کاربر ${req.user.id} با نقش ${req.user.role} تلاش کرد به منبعی که نیاز به نقش‌های ${allowedRoles.join(', ')} دارد دسترسی پیدا کند`);
        return res.status(403).json({
          success: false,
          message: 'شما مجوز دسترسی به این منبع را ندارید',
        });
      }

      next();
    } catch (error) {
      logger.error('خطا در میدل‌ور کنترل دسترسی:', error);
      return res.status(500).json({
        success: false,
        message: 'خطای سرور در کنترل دسترسی',
      });
    }
  };
}; 