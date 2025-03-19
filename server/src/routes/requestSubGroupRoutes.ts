// server/src/routes/requestSubGroupRoutes.ts
// مسیرهای API برای مدیریت زیرگروه‌های درخواست

import express from 'express';
import {
  getAllActiveSubGroups,
  getSubGroupsByGroup,
  getSubGroupById,
  createSubGroup,
  updateSubGroup,
  deleteSubGroup,
  toggleSubGroupStatus
} from '../controllers/requestSubGroupController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();
// مسیرهای API با محافظت توسط احراز هویت و مجوزدهی
router.get('/', authenticate, requireUser, getSubGroupsByGroup);
router.get('/active', authenticate, requireUser, getAllActiveSubGroups);
router.get('/:id', authenticate, requireUser, getSubGroupById);
router.post('/', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), createSubGroup);
router.put('/:id', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), updateSubGroup);
router.delete('/:id', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), deleteSubGroup);
router.patch('/:id/status', authenticate, requireUser, authorize(['ADMIN', 'FINANCIAL_MANAGER']), toggleSubGroupStatus);

export default router; 