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

// بارگذاری تنظیمات محیطی
config();

const app = express();
const port = parseInt(process.env.PORT || '5050', 10);

// تنظیمات CORS
app.use(cors({
  origin: function(origin, callback) {
    // برای دیباگ
    console.log('Request origin:', origin);
    
    // اجازه دسترسی به همه origin ها در محیط توسعه
    callback(null, true);
  },
  credentials: true, // اجازه ارسال کوکی
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// میدلور‌ها
app.use(express.json());
app.use(cookieParser());

// مسیرها
app.use('/api', routes);

// مستندات Swagger
setupSwagger(app);

// مدیریت خطاها
app.use(errorHandler);

// شروع سرور
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});