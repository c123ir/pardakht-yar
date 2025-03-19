import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { paymentController } from '../controllers/payment.controller';

const router = Router();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authMiddleware);

// دریافت لیست پرداخت‌ها
router.get('/', paymentController.getAllPayments);

// دریافت یک پرداخت
router.get('/:id', paymentController.getPaymentById);

// ایجاد پرداخت جدید
router.post('/', paymentController.createPayment);

// به‌روزرسانی پرداخت
router.put('/:id', paymentController.updatePayment);

// حذف پرداخت
router.delete('/:id', paymentController.deletePayment);

export default router; 