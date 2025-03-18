// server/src/lib/prisma.ts
// نمونه مرکزی Prisma Client

import { PrismaClient } from '@prisma/client';

// استفاده از یک نمونه واحد از Prisma در کل برنامه
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;