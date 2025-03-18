// server/src/middleware/error.ts
// میدل‌ور مدیریت خطا

import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import config from '../config/app';

// کلاس خطای API
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// میدل‌ور مدیریت خطاها
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'خطای سرور';
  
  // بررسی نوع خطا
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  
  // لاگ خطا
  logger.error(`${req.method} ${req.path} - ${err.message}`, err);
  
  // پاسخ خطا
  res.status(statusCode).json({
    success: false,
    message,
    // در محیط توسعه، جزئیات بیشتری نمایش داده می‌شود
    ...(config.server.nodeEnv === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

// میدل‌ور مدیریت مسیرهای یافت نشده
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `مسیر ${req.originalUrl} یافت نشد`);
  next(error);
};
