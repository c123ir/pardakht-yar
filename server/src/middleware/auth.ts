// server/src/middleware/auth.ts
// میدل‌ور احراز هویت

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/app';
import logger from '../config/logger';

// گسترش تایپ Express Request برای اضافه کردن اطلاعات کاربر
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}

// میدل‌ور احراز هویت
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // بررسی وجود هدر Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'توکن احراز هویت یافت نشد',
      });
    }

    // استخراج توکن
    const token = authHeader.split(' ')[1];
    
    // تایید توکن - اصلاح شده
    const decoded = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload & {
      id: number;
      username: string;
      role: string;
    };

    // افزودن اطلاعات کاربر به درخواست
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    logger.error('خطا در احراز هویت', error as Error);
    
    if ((error as Error).name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'توکن منقضی شده است',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'توکن نامعتبر است',
    });
  }
};