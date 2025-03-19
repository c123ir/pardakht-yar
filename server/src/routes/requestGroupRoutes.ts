// server/src/routes/requestGroupRoutes.ts
// مسیرهای API برای مدیریت گروه‌های درخواست

import express from 'express';
import {
  getActiveRequestGroups,
  getRequestGroups,
  getRequestGroupById,
  createRequestGroup,
  updateRequestGroup,
  deleteRequestGroup,
  toggleRequestGroupStatus
} from '../controllers/requestGroupController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

// مسیرهای API با محافظت توسط احراز هویت و مجوزدهی
router.get('/', authenticate, requireUser, getRequestGroups);
router.get('/active', authenticate, requireUser, getActiveRequestGroups);
router.get('/:id', authenticate, requireUser, getRequestGroupById);
router.post('/', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), createRequestGroup);
router.put('/:id', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), updateRequestGroup);
router.delete('/:id', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), deleteRequestGroup);
router.patch('/:id/status', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), toggleRequestGroupStatus);

export default router; 