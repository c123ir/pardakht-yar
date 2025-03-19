// server/src/types/prisma.d.ts
// تایپ‌های سفارشی برای Prisma

import { FieldConfig } from './request.types';

declare global {
  namespace Prisma {
    // گسترش تایپ InputJsonValue برای پذیرش FieldConfig
    type InputJsonValue = string | number | boolean | Record<string, any> | Array<any> | { [key: string]: any };
  }
} 