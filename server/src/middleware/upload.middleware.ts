import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { Logger } from '../utils/logger';

const logger = new Logger('UploadMiddleware');

// مسیر دایرکتوری آپلود
const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const AVATARS_DIR = path.join(UPLOAD_DIR, 'avatars');

// اطمینان از وجود دایرکتوری‌های آپلود
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    logger.info(`Creating upload directory at ${UPLOAD_DIR}`);
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(AVATARS_DIR)) {
    logger.info(`Creating avatars directory at ${AVATARS_DIR}`);
    fs.mkdirSync(AVATARS_DIR, { recursive: true });
  }
  
  // بررسی دسترسی‌های دایرکتوری
  fs.accessSync(AVATARS_DIR, fs.constants.W_OK);
  logger.info(`Avatars directory exists at ${AVATARS_DIR}`);
  logger.info('Avatars directory has read/write permissions');
} catch (error) {
  logger.error('Error setting up upload directories:', error);
}

// تنظیمات ذخیره‌سازی برای آواتارها
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATARS_DIR);
  },
  filename: (req, file, cb) => {
    // ایجاد نام فایل منحصر به فرد با timestamp و شماره تصادفی
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});

// فیلتر برای پذیرش فقط تصاویر
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // بررسی نوع فایل
  if (file.mimetype.startsWith('image/')) {
    logger.info(`Accepting file: ${file.originalname}, mimetype: ${file.mimetype}`);
    cb(null, true);
  } else {
    logger.warn(`Rejecting file: ${file.originalname}, mimetype: ${file.mimetype}`);
    cb(new Error('فقط فایل‌های تصویری قابل آپلود هستند'));
  }
};

// میدل‌ور آپلود آواتار
export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // محدودیت سایز: 5 مگابایت
  }
}).single('avatar');

// تنظیمات برای سایر آپلودها (می‌توان بعداً توسعه داد)
// مثال:
/*
export const uploadDocument = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '../../uploads/documents'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `document-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 مگابایت
  }
}).single('document');
*/ 