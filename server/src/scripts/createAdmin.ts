// server/src/scripts/createAdmin.ts
// اسکریپت ایجاد کاربر ادمین
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

async function main() {
  try {
    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    // ایجاد یا به‌روزرسانی کاربر ادمین
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        // اگر کاربر موجود باشد، فقط رمز عبور به‌روزرسانی می‌شود
        password: hashedPassword,
        isActive: true,
      },
      create: {
        username: 'admin',
        password: hashedPassword,
        fullName: 'مدیر سیستم',
        email: 'admin@example.com',
        role: 'ADMIN',
        isActive: true,
      },
    });
    
    console.log('کاربر ادمین ایجاد/به‌روزرسانی شد:', admin.username);
  } catch (error) {
    console.error('خطا در ایجاد کاربر ادمین:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای اسکریپت
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });