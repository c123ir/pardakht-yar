// server/src/index.ts
// نقطه ورود برنامه

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import Logger from './utils/logger';
import { connectDB } from './utils/db';
import { setupSwagger } from './utils/swagger';
import path from 'path';
import fs from 'fs';

// بارگذاری تنظیمات محیطی
config();

const app = express();
const port = parseInt(process.env.PORT || '5050', 10);

// تنظیمات CORS
app.use(cors({
  origin: function(origin, callback) {
    // برای دیباگ
    console.log('Request origin:', origin);
    
    // لیست دامنه‌های مجاز
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5050',
      undefined, // برای درخواست‌های بدون origin مثل curl یا postman
      'null' // برای فایل‌های محلی
    ];
    
    // بررسی اینکه آیا origin در لیست مجاز است
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`⛔ Origin rejected: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true, // اجازه ارسال کوکی
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-Custom-Auth'],
}));

// میدلور اضافی برای اطمینان از تنظیم هدرهای CORS
app.use((req, res, next) => {
  // دیباگ برای تشخیص مشکلات CORS
  console.log(`[CORS] درخواست ${req.method} به ${req.url} از ${req.headers.origin || 'نامشخص'}`);
  
  // تنظیم هدرها برای همه درخواست‌ها
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, X-Custom-Auth');
  
  // پاسخ مستقیم به درخواست‌های OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// میدلور‌ها
app.use(express.json());
app.use(cookieParser());

// ایجاد پوشه‌های مورد نیاز برای آپلود فایل‌ها
const uploadsDir = path.join(__dirname, '../uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory at ${uploadsDir}`);
}

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
  console.log(`Created avatars directory at ${avatarsDir}`);
} else {
  console.log(`Avatars directory exists at ${avatarsDir}`);
  // چک کردن دسترسی‌ها
  try {
    fs.accessSync(avatarsDir, fs.constants.R_OK | fs.constants.W_OK);
    console.log('Avatars directory has read/write permissions');
  } catch (err) {
    console.error('Avatars directory permission error:', err);
  }
}

// میدلور برای بررسی وجود فایل آواتار و هدایت به آواتار پیش‌فرض
app.use('/uploads/avatars', (req, res, next) => {
  console.log('👉 آواتار درخواستی:', req.path);
  
  // هدایت به فایل بعدی اگر درخواست برای آواتار پیش‌فرض است
  if (req.path.includes('default.png')) {
    console.log('درخواست برای آواتار پیش‌فرض، ارسال به میدلور بعدی');
    return next();
  }
  
  const avatarPath = path.join(avatarsDir, path.basename(req.path));
  console.log('👉 مسیر کامل فایل آواتار:', avatarPath);
  
  // بررسی وجود فایل آواتار
  fs.access(avatarPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`⛔ آواتار یافت نشد: ${avatarPath}, هدایت به آواتار پیش‌فرض`);
      // هدایت به آواتار پیش‌فرض
      res.redirect('/uploads/avatars/default.png');
    } else {
      console.log(`✅ آواتار یافت شد: ${avatarPath}`);
      // تنظیم هدرهای مربوط به کنترل کش برای فایل‌های آواتار
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      next();
    }
  });
});

// دسترسی به فایل‌های استاتیک - قبل از مسیرهای API
app.use('/uploads', express.static(uploadsDir));
console.log('✅ مسیر آپلود به عنوان فولدر استاتیک تنظیم شد:', uploadsDir);

// دیباگ درخواست‌های مربوط به آپلودها
app.use((req, res, next) => {
  if (req.url.includes('/uploads')) {
    console.log('📥 درخواست آپلود - URL:', req.url);
    const cleanedUrl = req.url.replace(/^\/uploads\/?/, '');
    const filePath = path.join(uploadsDir, cleanedUrl);
    console.log('🔍 مسیر فیزیکی فایل:', filePath);
    
    // بررسی وجود فایل
    if (fs.existsSync(filePath)) {
      console.log('✅ فایل موجود است:', filePath);
      try {
        const stats = fs.statSync(filePath);
        console.log('📊 اطلاعات فایل:', {
          size: stats.size + ' bytes',
          created: stats.birthtime,
          modified: stats.mtime,
          permissions: stats.mode
        });
      } catch (err) {
        console.error('❌ خطا در خواندن اطلاعات فایل:', err);
      }
    } else {
      console.log('⛔ فایل موجود نیست:', filePath);
    }
  }
  next();
});

// اتصال روت‌های API
app.use('/api', routes);

// مستندات Swagger
setupSwagger(app);

// مدیریت خطاها
app.use(errorHandler);

// استفاده از میدلور برای ارائه فایل‌های استاتیک
app.use('/', express.static(path.join(__dirname, '..', 'public')));

// شروع سرور
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});