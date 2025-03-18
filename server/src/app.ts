// server/src/app.ts
// تنظیمات اصلی اپلیکیشن Express

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
// ایجاد اپلیکیشن Express
const app: Express = express();

// میدل‌ورهای عمومی
app.use(helmet()); // امنیت هدرها
app.use(cors({ 
  origin: config.server.clientUrl,
  credentials: true,
})); // CORS
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

// مسیرهای API (در فازهای بعدی تکمیل خواهد شد)
// app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);
// صفحه اصلی API
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'به API پرداخت‌یار خوش آمدید',
    version: '1.0.0',
  });
});

// مدیریت خطاهای 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'مسیر مورد نظر یافت نشد',
  });
});

// مدیریت خطاها
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(`خطا در پردازش درخواست: ${req.method} ${req.path}`, err);
  
  res.status(500).json({
    success: false,
    message: 'خطای سرور',
    error: config.server.nodeEnv === 'development' ? err.message : undefined,
  });
});

export default app;