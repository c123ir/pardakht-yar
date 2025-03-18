// server/src/index.ts
// نقطه ورود برنامه

import app from './app';
import config from './config/app';
import logger from './config/logger';
import { PrismaClient } from '@prisma/client';

// راه‌اندازی سرور
const server = app.listen(config.server.port, () => {
  logger.info(`سرور در پورت ${config.server.port} در حال اجراست (محیط: ${config.server.nodeEnv})`);
});

// اتصال به پایگاه داده
const prisma = new PrismaClient();

// مدیریت سیگنال‌های خروج
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('سرور بسته شد');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// مدیریت خطاهای دسته‌نشده
const unexpectedErrorHandler = (error: Error) => {
  logger.error('خطای دسته‌نشده', error);
  exitHandler();
};

// ثبت سیگنال‌های خروج
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  logger.info('سیگنال SIGTERM دریافت شد');
  exitHandler();
});
process.on('SIGINT', () => {
  logger.info('سیگنال SIGINT دریافت شد');
  exitHandler();
});
