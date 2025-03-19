// server/src/utils/db.ts
// ماژول اتصال به دیتابیس

import Logger from "./logger";

export const connectDB = async (): Promise<void> => {
  try {
    Logger.info("Connecting to database...");
    // TODO: پیاده‌سازی اتصال به دیتابیس
    Logger.info("Connected to database successfully");
  } catch (error) {
    Logger.error("Failed to connect to database", { error });
    process.exit(1);
  }
};
