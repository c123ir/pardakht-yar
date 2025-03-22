// server/src/scripts/createAdmin.ts
// اسکریپت ایجاد کاربر ادمین
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as readline from 'readline';

const prisma = new PrismaClient();

// ایجاد رابط برای دریافت ورودی از کاربر
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// تابع پرسش از کاربر
const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

// تابع اصلی برای ایجاد کاربر ادمین
async function createAdmin() {
  try {
    console.log('\n===== ایجاد کاربر مدیر سیستم =====\n');

    // دریافت اطلاعات کاربر
    const username = await question('نام کاربری (پیش‌فرض: admin): ') || 'admin';
    const fullName = await question('نام کامل (پیش‌فرض: مدیر سیستم): ') || 'مدیر سیستم';
    const email = await question('ایمیل (پیش‌فرض: admin@example.com): ') || 'admin@example.com';
    const password = await question('رمز عبور (پیش‌فرض: admin123): ') || 'admin123';
    const phone = await question('شماره تلفن (اختیاری): ');

    // رمزنگاری رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // بررسی وجود کاربر با این نام کاربری
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    let user;
    if (existingUser) {
      console.log(`\nکاربر با نام کاربری ${username} از قبل وجود دارد.`);
      const updateConfirm = await question('آیا می‌خواهید اطلاعات این کاربر به‌روزرسانی شود؟ (y/n): ');
      
      if (updateConfirm.toLowerCase() === 'y') {
        user = await prisma.user.update({
          where: { username },
          data: {
            password: hashedPassword,
            fullName,
            email,
            phone: phone || null,
            role: 'ADMIN',
            isActive: true,
          },
        });
        console.log('\nاطلاعات کاربر مدیر با موفقیت به‌روزرسانی شد.');
      } else {
        console.log('\nعملیات لغو شد.');
      }
    } else {
      // ایجاد کاربر جدید
      user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          fullName,
          email,
          phone: phone || null,
          role: 'ADMIN',
          isActive: true,
        },
      });
      console.log('\nکاربر مدیر با موفقیت ایجاد شد.');
    }

    if (user) {
      console.log('\n===== اطلاعات کاربر =====');
      console.log(`نام کاربری: ${user.username}`);
      console.log(`نام کامل: ${user.fullName}`);
      console.log(`ایمیل: ${user.email || 'تعیین نشده'}`);
      console.log(`شماره تلفن: ${user.phone || 'تعیین نشده'}`);
      console.log(`نقش: ${user.role}`);
      console.log(`وضعیت: ${user.isActive ? 'فعال' : 'غیرفعال'}`);
    }

  } catch (error) {
    console.error('خطا در ایجاد کاربر مدیر:', error);
  } finally {
    // بستن اتصال به دیتابیس و رابط ورودی
    await prisma.$disconnect();
    rl.close();
  }
}

// اجرای تابع اصلی
createAdmin();