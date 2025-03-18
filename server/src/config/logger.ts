// server/src/config/logger.ts
// پیکربندی سیستم لاگینگ

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// ایجاد مسیر لاگ اگر وجود نداشته باشد
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// فرمت اختصاصی برای لاگ‌ها
const customFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  // تبدیل حروف انگلیسی در سطح لاگ به فارسی برای خوانایی بهتر
  const persianLevel = 
    level === 'error' ? 'خطا' : 
    level === 'warn' ? 'هشدار' : 
    level === 'info' ? 'اطلاعات' : 
    level === 'debug' ? 'دیباگ' : level;

  // اضافه کردن متادیتا به پیام لاگ
  const metaStr = Object.keys(meta).length ? ` - ${JSON.stringify(meta)}` : '';
  
  return `${timestamp} | ${persianLevel.padEnd(10)} | ${message}${metaStr}`;
});

// تنظیمات لاگر
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    // لاگ در کنسول با رنگ‌بندی
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      )
    }),
    // لاگ خطاها در فایل
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    // لاگ همه پیام‌ها در فایل
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log')
    })
  ]
});

// لاگرهای مختلف برای استفاده در برنامه
export const logInfo = (message: string, meta = {}) => {
  logger.info(message, meta);
};

export const logWarn = (message: string, meta = {}) => {
  logger.warn(message, meta);
};

export const logError = (message: string, error?: Error, meta = {}) => {
  if (error) {
    logger.error(`${message}: ${error.message}`, {
      stack: error.stack,
      ...meta
    });
  } else {
    logger.error(message, meta);
  }
};

export const logDebug = (message: string, meta = {}) => {
  logger.debug(message, meta);
};

export default {
  info: logInfo,
  warn: logWarn,
  error: logError,
  debug: logDebug
};
