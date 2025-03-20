// server/src/middleware/authMiddleware.ts
// میدل‌ور احراز هویت برای محافظت از مسیرهای API

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Logger } from '../utils/logger';

const logger = new Logger('AuthMiddleware');

/**
 * میدل‌ور احراز هویت برای محافظت از مسیرهای API
 * @param req درخواست
 * @param res پاسخ
 * @param next تابع بعدی
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // بررسی وجود توکن در هدر درخواست
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('درخواست بدون توکن معتبر');
      return res.status(401).json({ message: 'احراز هویت ناموفق. لطفاً وارد شوید' });
    }

    // استخراج توکن از هدر
    const token = authHeader.split(' ')[1];
    if (!token) {
      logger.warn('توکن خالی در هدر درخواست');
      return res.status(401).json({ message: 'احراز هویت ناموفق. لطفاً وارد شوید' });
    }

    // بررسی اعتبار توکن
    const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string; role: string };

    // بررسی معتبر بودن نقش کاربر
    const validRoles = ['ADMIN', 'FINANCIAL_MANAGER', 'ACCOUNTANT', 'SELLER', 'CEO', 'PROCUREMENT'];
    if (!validRoles.includes(decoded.role)) {
      logger.warn(`نقش نامعتبر در توکن: ${decoded.role}`);
      return res.status(401).json({ message: 'احراز هویت ناموفق: نقش کاربری معتبر نیست' });
    }

    // تنظیم اطلاعات کاربر در شیء درخواست
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role as any // تبدیل موقت برای حل مشکل تایپ اسکریپت
    };

    // ادامه درخواست
    next();
  } catch (error) {
    logger.error('خطا در احراز هویت', { error });
    
    if ((error as any).name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'توکن منقضی شده است. لطفاً دوباره وارد شوید' });
    }
    
    return res.status(401).json({ message: 'احراز هویت ناموفق. لطفاً وارد شوید' });
  }
}; 