// server/src/types/express.d.ts
// تعریف تایپ‌های سفارشی برای اکسپرس

import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      fullName: string;
      role: Role;
    }

    interface Request {
      user: User;
    }
  }
}
