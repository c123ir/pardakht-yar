// server/src/routes/requestRoutes.ts
// مسیرهای API برای مدیریت درخواست‌ها

import express from 'express';
import multer from 'multer';
import {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  changeRequestStatus,
  uploadAttachment,
  deleteAttachment,
  addActivity,
} from '../controllers/requestController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

// تنظیمات آپلود فایل با multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // حداکثر ۱۰ مگابایت
  },
});

// مسیرهای API با محافظت توسط احراز هویت و مجوزدهی
router.get('/', authenticate, requireUser, getRequests);
router.get('/:id', authenticate, requireUser, getRequestById);
router.post('/', authenticate, requireUser, createRequest);
router.put('/:id', authenticate, requireUser, updateRequest);
router.patch('/:id/status', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), changeRequestStatus);
router.post('/:id/attachments', authenticate, requireUser, upload.single('file'), uploadAttachment);
router.delete('/:id/attachments/:attachmentId', authenticate, requireUser, deleteAttachment);
router.post('/:id/activities', authenticate, requireUser, addActivity);

export default router; 