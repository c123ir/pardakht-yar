// server/src/routes/settingRoutes.ts
// مسیرهای API مدیریت تنظیمات

import express from 'express';
import { getSmsSettings, updateSmsSettings, sendTestSms, getSmsDeliveryStatus } from '../controllers/settingController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

// مسیرهای مدیریت تنظیمات - همه باید احراز هویت شوند
router.use(authenticate);

// فقط ادمین می‌تواند تنظیمات را ببیند و تغییر دهد
router.get('/sms', authorize(['ADMIN']), getSmsSettings);
router.put('/sms', authorize(['ADMIN']), updateSmsSettings);
router.post('/sms/test', authorize(['ADMIN']), sendTestSms);
router.get('/sms/delivery/:messageId', authorize(['ADMIN']), getSmsDeliveryStatus);

export default router;