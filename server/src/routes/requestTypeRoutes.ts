// server/src/routes/requestTypeRoutes.ts
// مسیرهای API برای مدیریت انواع درخواست‌ها

import express from 'express';
import {
  getAllRequestTypes,
  getRequestTypeById,
  createRequestType,
  updateRequestType,
  deleteRequestType,
} from '../controllers/requestTypeController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();
// مسیرهای API با محافظت توسط احراز هویت و مجوزدهی
router.get('/', authenticate, requireUser, getAllRequestTypes);
router.get('/:id', authenticate, requireUser, getRequestTypeById);
router.post('/', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), createRequestType);
router.put('/:id', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), updateRequestType);
router.delete('/:id', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), deleteRequestType);

export default router; 