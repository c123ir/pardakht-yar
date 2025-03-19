// server/src/middleware/requireUser.ts
// میدل‌ور برای اطمینان از وجود کاربر در درخواست

import { Request, Response, NextFunction } from 'express';

/**
 * این میدل‌ور بررسی می‌کند که کاربر احراز هویت شده باشد
 * با استفاده از این میدل‌ور، نیازی به بررسی req.user در کنترلرها نیست
 */
export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'لطفا ابتدا وارد سیستم شوید',
    });
  }
  
  next();
}; 