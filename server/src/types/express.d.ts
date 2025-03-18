// server/src/types/express.d.ts
// تایپ‌های اختصاصی Express

declare namespace Express {
  interface Request {
    user?: {
      id: number;
      username: string;
      role: string;
    };
  }
}
