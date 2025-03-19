// server/src/utils/logger.ts
// ماژول لاگر برای رفع خطای 'Cannot find module ../utils/logger'

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// ایجاد پوشه لاگ در صورت عدم وجود
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// تنظیمات فرمت لاگ
const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
  }`;
});

// ایجاد لاگر
const winstonLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    // لاگ در کنسول
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    // لاگ در فایل
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * کلاس لاگر برای ثبت رویدادهای سیستم
 */
export class Logger {
  private context: string;

  /**
   * سازنده کلاس لاگر
   * @param context نام سرویس یا کامپوننتی که لاگ می‌کند
   */
  constructor(context: string) {
    this.context = context;
  }

  /**
   * ثبت پیام سطح اطلاعات
   * @param message پیام لاگ
   * @param meta اطلاعات اضافی (اختیاری)
   */
  info(message: string, meta?: any): void {
    winstonLogger.info(`[${this.context}] ${message}`, meta);
  }

  /**
   * ثبت پیام سطح خطا
   * @param message پیام لاگ
   * @param meta اطلاعات اضافی (اختیاری)
   */
  error(message: string, meta?: any): void {
    winstonLogger.error(`[${this.context}] ${message}`, meta);
  }

  /**
   * ثبت پیام سطح اخطار
   * @param message پیام لاگ
   * @param meta اطلاعات اضافی (اختیاری)
   */
  warn(message: string, meta?: any): void {
    winstonLogger.warn(`[${this.context}] ${message}`, meta);
  }

  /**
   * ثبت پیام سطح دیباگ
   * @param message پیام لاگ
   * @param meta اطلاعات اضافی (اختیاری)
   */
  debug(message: string, meta?: any): void {
    winstonLogger.debug(`[${this.context}] ${message}`, meta);
  }
}

// لاگر پیش‌فرض برای استفاده در کل پروژه
export default new Logger('App'); 