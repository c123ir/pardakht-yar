// server/src/routes/contactRoutes.ts
// مسیرهای API مدیریت طرف‌حساب‌ها

import express from 'express';
import { 
  getContacts, 
  getContactById, 
  createContact, 
  updateContact, 
  deleteContact,
  regenerateAccessToken 
} from '../controllers/contactController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validator';
import { contactSchema } from '../validators/contactValidator';

const router = express.Router();

// محافظت از تمام مسیرها با میدل‌ور احراز هویت
router.use(authenticate);

// دریافت لیست طرف‌حساب‌ها - دسترسی عمومی برای کاربران احراز هویت شده
router.get('/', getContacts);

// دریافت اطلاعات یک طرف‌حساب با شناسه - دسترسی عمومی برای کاربران احراز هویت شده
router.get('/:id', getContactById);

// ایجاد طرف‌حساب جدید - مدیران مالی، حسابداران و ادمین‌ها
router.post(
  '/',
  authorize(['ADMIN', 'FINANCIAL_MANAGER', 'ACCOUNTANT']),
  validate(contactSchema),
  createContact
);

// به‌روزرسانی طرف‌حساب - مدیران مالی، حسابداران و ادمین‌ها
router.put(
  '/:id',
  authorize(['ADMIN', 'FINANCIAL_MANAGER', 'ACCOUNTANT']),
  validate(contactSchema),
  updateContact
);

// بازتولید توکن دسترسی - فقط ادمین‌ها و مدیران مالی
router.post(
  '/:id/regenerate-token',
  authorize(['ADMIN', 'FINANCIAL_MANAGER']),
  regenerateAccessToken
);

// حذف طرف‌حساب - فقط ادمین‌ها و مدیران مالی
router.delete(
  '/:id',
  authorize(['ADMIN', 'FINANCIAL_MANAGER']),
  deleteContact
);

export default router;