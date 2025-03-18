// server/src/middleware/auth.ts
// میدل‌ور احراز هویت

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';
import config from '../config/app';

const prisma = new PrismaClient();

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
    
    // تایید توکن
    const decoded = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload & {
      id: number;
      username: string;
      role: string;
    };

    // بررسی وجود کاربر در دیتابیس
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'کاربر معتبر نیست',
      });
    }

    // افزودن اطلاعات کاربر به درخواست
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
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

// میدل‌ور بررسی دسترسی بر اساس نقش
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'دسترسی غیرمجاز',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز دسترسی به این منبع را ندارید',
      });
    }

    next();
  };
};
