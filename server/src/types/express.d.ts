// server/src/types/express.d.ts
// تعریف تایپ‌های سفارشی برای اکسپرس

import { User } from '@prisma/client';

type Role = 'ADMIN' | 'FINANCIAL_MANAGER' | 'ACCOUNTANT' | 'SELLER' | 'CEO' | 'PROCUREMENT';

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      fullName: string;
      role: Role;
    }

    interface Request {
      user?: {
        userId: number;
        username: string;
        role: Role;
      };
    }
  }
}

export {};
