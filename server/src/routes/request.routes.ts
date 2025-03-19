import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requestController } from '../controllers/request.controller';

const router = Router();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authMiddleware);

// دریافت لیست درخواست‌ها
router.get('/', requestController.getAllRequests);

// دریافت یک درخواست
router.get('/:id', requestController.getRequestById);

// ایجاد درخواست جدید
router.post('/', requestController.createRequest);

// به‌روزرسانی درخواست
router.put('/:id', requestController.updateRequest);

// حذف درخواست
router.delete('/:id', requestController.deleteRequest);

export default router; 