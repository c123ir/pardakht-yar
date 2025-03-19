// server/src/middleware/authMiddleware.ts
// میدل‌ور احراز هویت برای محافظت از مسیرهای API

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Logger } from '../utils/logger';

const prisma = new PrismaClient();
const logger = new Logger('AuthMiddleware');

/**
 * میدل‌ور احراز هویت برای محافظت از مسیرهای API
 * @param req درخواست
 * @param res پاسخ
 * @param next تابع بعدی
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // دریافت توکن از هدر
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'توکن احراز هویت ارائه نشده است',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // بررسی اعتبار توکن
      const secretKey = process.env.JWT_SECRET || 'dev-secret-key';
      const decoded = jwt.verify(token, secretKey) as any;

      // بررسی وجود کاربر در دیتابیس
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
          isActive: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'کاربر یافت نشد',
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'حساب کاربری غیرفعال است',
        });
      }

      // قرار دادن اطلاعات کاربر در درخواست
      req.user = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      };

      next();
    } catch (error) {
      logger.error('خطا در بررسی توکن:', error);
      return res.status(401).json({
        success: false,
        message: 'توکن نامعتبر است',
      });
    }
  } catch (error) {
    logger.error('خطا در میدل‌ور احراز هویت:', error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور در احراز هویت',
    });
  }
}; 