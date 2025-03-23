// server/src/app.ts
// به‌روزرسانی تنظیمات اصلی اپلیکیشن Express برای اضافه کردن مسیرهای API طرف‌حساب‌ها

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import config from './config/app';
import logger from './config/logger';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import contactRoutes from './routes/contact.routes';
import paymentRoutes from './routes/payment.routes';
import requestTypeRoutes from './routes/requestType.routes';
import requestRoutes from './routes/request.routes';
import requestGroupRoutes from './routes/requestGroup.routes';
import requestSubGroupRoutes from './routes/requestSubGroup.routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import fs from 'fs';

// ایجاد اپلیکیشن Express
const app: Express = express();

// تنظیمات CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', config.server.clientUrl],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'X-Custom-Auth', 'X-Requested-With']
}));

// میدلور اضافی برای اطمینان از تنظیم هدرهای CORS
app.use((req, res, next) => {
  // دیباگ برای تشخیص مشکلات CORS
  console.log(`[CORS APP] درخواست ${req.method} به ${req.url} از ${req.headers.origin || 'نامشخص'}`);
  
  // تنظیم هدرها برای همه درخواست‌ها
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, X-Custom-Auth, x-csrf-token');
  
  // پاسخ مستقیم به درخواست‌های OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// تنظیمات امنیتی helmet با اجازه دسترسی به تصاویر
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    },
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// مسیر فایل‌های آپلود شده - اصلاح شده با استفاده از path.resolve
const uploadsPath = path.resolve(__dirname, '../uploads');
console.log('Uploads directory path (resolved):', uploadsPath);

// اطمینان از وجود دایرکتوری آپلود
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads directory');
}

// بررسی دسترسی فولدر آپلود
try {
  fs.accessSync(uploadsPath, fs.constants.R_OK | fs.constants.W_OK);
  console.log('Uploads directory is readable and writable');
} catch (err) {
  console.error('Uploads directory permission error:', err);
}

// ارائه فایل‌های استاتیک و مدیریت آواتار
app.use('/uploads/avatars', (req, res, next) => {
  const avatarPath = path.join(__dirname, '..', 'uploads', 'avatars', path.basename(req.path));
  
  // اضافه کردن هدرهای ضد کش برای همه درخواست‌های آواتار
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // بررسی وجود فایل آواتار
  fs.access(avatarPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`❌ آواتار یافت نشد: ${avatarPath}`);
      // استفاده از آواتار پیش‌فرض
      res.sendFile(path.join(__dirname, '..', 'public', 'avatar.jpg'));
    } else {
      console.log(`✅ آواتار یافت شد: ${avatarPath}`);
      next();
    }
  });
});

// ارائه فایل‌های استاتیک
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/', express.static(path.join(__dirname, '..', 'public')));

// دیباگ درخواست‌های مربوط به آپلودها
app.use((req, res, next) => {
  if (req.url.includes('/uploads')) {
    console.log('📥 درخواست آپلود - URL:', req.url);
    const cleanedUrl = req.url.replace(/^\/uploads\/?/, '');
    const filePath = path.join(uploadsPath, cleanedUrl);
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
      try {
        const dirPath = path.dirname(filePath);
        if (fs.existsSync(dirPath)) {
          console.log('📁 محتوای دایرکتوری:', fs.readdirSync(dirPath));
        } else {
          console.log('❌ دایرکتوری وجود ندارد:', dirPath);
        }
      } catch (err) {
        console.error('❌ خطا در بررسی دایرکتوری:', err);
      }
    }
  }
  next();
});

// مسیرهای API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/request-types', requestTypeRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/request-groups', requestGroupRoutes);
app.use('/api/request-sub-groups', requestSubGroupRoutes);

// صفحه اصلی API
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'به API پرداخت‌یار خوش آمدید',
    version: '1.0.0',
  });
});

// مدیریت خطاهای 404
app.use(notFound);

// مدیریت سایر خطاها
app.use(errorHandler);

export default app;