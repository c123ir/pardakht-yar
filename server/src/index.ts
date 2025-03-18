// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

// بارگذاری تنظیمات محیطی
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// میدل‌ورها
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// مسیر آزمایشی
app.get('/api', (req, res) => {
  res.json({ message: 'سرور پرداخت‌یار در حال اجراست!' });
});

// مسیر ورود
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // اعتبارسنجی ساده
  if (username === 'admin' && password === 'admin') {
    return res.json({
      success: true,
      token: 'mock_token_123456',
      user: {
        id: 1,
        username: 'admin',
        fullName: 'کاربر مدیر',
        role: 'ADMIN'
      }
    });
  }
  
  // خطای اعتبارسنجی
  return res.status(401).json({
    success: false,
    message: 'نام کاربری یا رمز عبور اشتباه است'
  });
});

// مسیر دریافت اطلاعات کاربر
app.get('/api/auth/me', (req, res) => {
  // در مثال اولیه، همیشه کاربر مدیر را برمی‌گرداند
  // در حالت واقعی باید توکن را بررسی کرد
  res.json({
    success: true,
    user: {
      id: 1,
      username: 'admin',
      fullName: 'کاربر مدیر',
      email: 'admin@example.com',
      role: 'ADMIN'
    }
  });
});

// اضافه کردن مسیرهای کاربران
app.use('/api/users', userRoutes);

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`سرور در پورت ${PORT} در حال اجراست`);
});