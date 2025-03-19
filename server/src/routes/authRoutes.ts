// server/src/routes/authRoutes.ts
// مسیرهای API احراز هویت

import express from 'express';
import { login, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// مسیر ورود
router.post('/login', login);

// مسیر دریافت اطلاعات کاربر جاری
router.get('/me', authenticate, getCurrentUser);

export default router;