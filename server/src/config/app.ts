// server/src/config/app.ts
// تنظیمات اصلی برنامه

import dotenv from 'dotenv';
import path from 'path';

// بارگذاری فایل .env
dotenv.config();

// پیکربندی برنامه
export default {
  // تنظیمات سرور
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  },
  
  // تنظیمات JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expire: process.env.JWT_EXPIRE || '24h',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  
  // تنظیمات آپلود فایل
  upload: {
    path: process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads'),
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  },
  
  // تنظیمات SMS
  sms: {
    apiKey: process.env.SMS_API_KEY || '',
    sender: process.env.SMS_SENDER || '',
  }
};