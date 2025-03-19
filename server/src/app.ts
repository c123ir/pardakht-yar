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
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import settingRoutes from './routes/settingRoutes';
import contactRoutes from './routes/contactRoutes'; // اضافه کردن مسیرهای طرف‌حساب‌ها
import paymentRoutes from './routes/paymentRoutes'; // اضافه کردن مسیرهای پرداخت‌ها
import requestTypeRoutes from './routes/requestTypeRoutes'; // اضافه کردن مسیرهای انواع درخواست‌ها
import requestRoutes from './routes/requestRoutes'; // اضافه کردن مسیرهای درخواست‌ها
import requestGroupRoutes from './routes/requestGroupRoutes'; // اضافه کردن مسیرهای گروه‌های درخواست
import requestSubGroupRoutes from './routes/requestSubGroupRoutes'; // اضافه کردن مسیرهای زیرگروه‌های درخواست
import { errorHandler, notFound } from './middleware/error';

// ایجاد اپلیکیشن Express
const app: Express = express();

// میدل‌ورهای عمومی
//app.use(helmet()); // امنیت هدرها
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}));
app.use(compression()); // فشرده‌سازی پاسخ‌ها
app.use(express.json()); // پارس کردن JSON در بدنه درخواست
app.use(express.urlencoded({ extended: true })); // پارس کردن URL-encoded در بدنه درخواست

// لاگینگ درخواست‌ها در محیط توسعه
if (config.server.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// دسترسی به فایل‌های استاتیک
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

// مسیرهای API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/contacts', contactRoutes); // اضافه کردن مسیرهای طرف‌حساب‌ها
app.use('/api/payments', paymentRoutes); // اضافه کردن مسیرهای پرداخت‌ها
app.use('/api/request-types', requestTypeRoutes); // اضافه کردن مسیرهای انواع درخواست‌ها
app.use('/api/requests', requestRoutes); // اضافه کردن مسیرهای درخواست‌ها
app.use('/api/request-groups', requestGroupRoutes); // اضافه کردن مسیرهای گروه‌های درخواست
app.use('/api/request-sub-groups', requestSubGroupRoutes); // اضافه کردن مسیرهای زیرگروه‌های درخواست

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