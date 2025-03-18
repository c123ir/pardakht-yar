// server/src/types/express.d.ts
// تایپ‌های اختصاصی Express

import { Role } from '@prisma/client';

declare namespace Express {
  interface Request {
    user?: {
      id: number;
      username: string;
      role: string | Role;
    };
  }
}
