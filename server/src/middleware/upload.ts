// server/src/middleware/upload.ts
// میدل‌ور آپلود فایل

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import config from '../config/app';
import logger from '../config/logger';

// اطمینان از وجود مسیر آپلود
const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// تنظیمات ذخیره‌سازی فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(config.upload.path, 'payments');
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // ایجاد نام فایل منحصر به فرد
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `payment-${uniqueSuffix}${ext}`);
  },
});

// فیلتر فایل‌ها بر اساس نوع
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // بررسی نوع فایل
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('نوع فایل مجاز نیست. فقط تصاویر با فرمت JPG و PNG پذیرفته می‌شوند.'));
  }
};

// پیکربندی آپلود
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize, // حداکثر سایز فایل
  },
});

// میدل‌ور آپلود فایل پرداخت
export const uploadPaymentImage = upload.single('image');

// میدل‌ور مدیریت خطای آپلود
export const handleUploadError = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'حجم فایل بیشتر از حد مجاز است'
      });
    }
    
    return res.status(400).json({
      status: 'error',
      message: 'خطا در آپلود فایل',
      error: error.message
    });
  }

  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'خطای غیرمنتظره در آپلود فایل',
      error: error.message
    });
  }

  next();
};
