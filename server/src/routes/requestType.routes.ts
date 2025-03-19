import { Router } from 'express';
import {
  getRequestTypes,
  getRequestType,
  createRequestType,
  updateRequestType,
  deleteRequestType,
} from '../controllers/requestType.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authenticate);

// دریافت لیست انواع درخواست
router.get('/', getRequestTypes);

// دریافت اطلاعات یک نوع درخواست
router.get('/:id', getRequestType);

// ایجاد نوع درخواست جدید
router.post('/', createRequestType);

// به‌روزرسانی نوع درخواست
router.put('/:id', updateRequestType);

// حذف نوع درخواست
router.delete('/:id', deleteRequestType);

export default router; 