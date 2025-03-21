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

// ایجاد اپلیکیشن Express
const app: Express = express();

// میدل‌ورهای عمومی
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}));

// تنظیمات امنیتی helmet با اجازه دسترسی به تصاویر
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "blob:", "*"],
      },
    },
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// دسترسی به فایل‌های استاتیک - قبل از مسیرهای API
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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