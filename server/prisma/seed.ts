import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ایجاد کاربر ادمین
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      fullName: 'مدیر سیستم',
      email: 'admin@example.com',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Admin user created:', admin);
  
  // ایجاد کاربر دمو با نقش کارمندی و شماره 18
  const hashedUserPassword = await bcrypt.hash('user123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { username: 'user18' },
    update: {},
    create: {
      username: 'user18',
      password: hashedUserPassword,
      fullName: 'کاربر شماره ۱۸',
      email: 'user18@example.com',
      phone: '09123456789',
      role: 'USER',
      isActive: true,
    },
  });

  console.log('Demo user created:', demoUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 