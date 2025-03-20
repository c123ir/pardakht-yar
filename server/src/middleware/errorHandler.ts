import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`مسیر ${req.originalUrl} یافت نشد`);
  res.status(404);
  next(error);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // خطای اعتبارسنجی Prisma
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'خطای اعتبارسنجی داده‌ها',
      errors: err.message,
    });
  }

  // خطای یکتا بودن Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      status: 'error',
      message: 'این مقدار قبلاً ثبت شده است',
      field: err.meta?.target?.[0],
    });
  }

  // خطای یافت نشدن رکورد در Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({
      status: 'error',
      message: 'رکورد مورد نظر یافت نشد',
    });
  }

  // سایر خطاهای Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      status: 'error',
      message: 'خطا در عملیات پایگاه داده',
      code: err.code,
    });
  }

  // خطای احراز هویت
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'دسترسی غیرمجاز',
    });
  }

  // سایر خطاها
  return res.status(500).json({
    status: 'error',
    message: 'خطای سرور',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
}; 