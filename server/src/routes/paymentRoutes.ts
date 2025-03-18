// server/src/routes/paymentRoutes.ts
// مسیرهای API مدیریت پرداخت‌ها

import express from 'express';
import { 
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  changePaymentStatus,
  uploadPaymentImage,
  getPaymentImages,
  sendPaymentNotification,
} from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { createPaymentSchema, updatePaymentSchema } from '../validators/paymentValidator';
import { uploadPaymentImage as uploadMiddleware, handleUploadError } from '../middleware/upload';

const router = express.Router();

// محافظت از تمام مسیرها با میدل‌ور احراز هویت
router.use(authenticate);

// دریافت لیست پرداخت‌ها - دسترسی عمومی برای کاربران احراز هویت شده
router.get('/', getPayments);

// دریافت اطلاعات یک پرداخت با شناسه - دسترسی عمومی برای کاربران احراز هویت شده
router.get('/:id', getPaymentById);

// ایجاد درخواست پرداخت جدید - دسترسی محدود
router.post(
  '/',
  authorize(['ADMIN', 'FINANCIAL_MANAGER', 'ACCOUNTANT']),
  validate(createPaymentSchema),
  createPayment
);

// به‌روزرسانی درخواست پرداخت - دسترسی محدود
router.put(
  '/:id',
  authorize(['ADMIN', 'FINANCIAL_MANAGER', 'ACCOUNTANT']),
  validate(updatePaymentSchema),
  updatePayment
);

// تغییر وضعیت پرداخت - دسترسی محدود
router.patch(
  '/:id/status',
  authorize(['ADMIN', 'FINANCIAL_MANAGER', 'ACCOUNTANT']),
  changePaymentStatus
);

// آپلود تصویر فیش پرداخت - دسترسی محدود
router.post(
  '/:id/images',
  authorize(['ADMIN', 'FINANCIAL_MANAGER', 'ACCOUNTANT']),
  uploadMiddleware,
  handleUploadError,
  uploadPaymentImage
);

// دریافت تصاویر پرداخت - دسترسی عمومی برای کاربران احراز هویت شده
router.get('/:id/images', getPaymentImages);

// ارسال اطلاع‌رسانی پیامکی - دسترسی محدود
router.post(
  '/:id/notify',
  authorize(['ADMIN', 'FINANCIAL_MANAGER', 'ACCOUNTANT']),
  sendPaymentNotification
);

// حذف درخواست پرداخت - فقط ادمین‌ها و مدیران مالی
router.delete(
  '/:id',
  authorize(['ADMIN', 'FINANCIAL_MANAGER']),
  deletePayment
);

export default router;