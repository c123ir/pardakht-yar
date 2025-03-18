// server/src/index.ts
// نقطه ورود برنامه

import app from './app';
import config from './config/app';
import logger from './config/logger';

// تنظیم پورت
const PORT = config.server.port;

// راه‌اندازی سرور
app.listen(PORT, () => {
  logger.info(`سرور در پورت ${PORT} در حال اجراست`);
  logger.info(`محیط: ${config.server.nodeEnv}`);
});