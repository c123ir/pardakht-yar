// server/src/scripts/createTestUser.ts
// اسکریپت برای ایجاد کاربر تست با نقش ادمین

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // بررسی وجود کاربر قبلی با این نام کاربری
    const existingUser = await prisma.user.findUnique({
      where: {
        username: 'demouser',
      },
    });

    if (existingUser) {
      console.log('کاربر تست قبلا ایجاد شده است.');
      console.log('نام کاربری: demouser');
      console.log('رمز عبور: demo123');
      return;
    }

    // رمزنگاری رمز عبور
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // ایجاد کاربر جدید
    const newUser = await prisma.user.create({
      data: {
        username: 'demouser',
        password: hashedPassword,
        fullName: 'کاربر دمو',
        email: 'demo@example.com',
        phone: '09123456789' + Math.floor(Math.random() * 1000), // شماره تلفن تصادفی
        role: Role.ADMIN,
        isActive: true,
      },
    });

    console.log('کاربر تست با موفقیت ایجاد شد:');
    console.log('نام کاربری:', newUser.username);
    console.log('رمز عبور: demo123');
    console.log('نقش:', newUser.role);
  } catch (error) {
    console.error('خطا در ایجاد کاربر تست:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای اسکریپت
createTestUser(); 