import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requestGroupController } from '../controllers/requestGroup.controller';

const router = Router();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authMiddleware);

// دریافت لیست گروه‌های درخواست
router.get('/', requestGroupController.getAllRequestGroups);

// دریافت یک گروه درخواست
router.get('/:id', requestGroupController.getRequestGroupById);

// ایجاد گروه درخواست جدید
router.post('/', requestGroupController.createRequestGroup);

// به‌روزرسانی گروه درخواست
router.put('/:id', requestGroupController.updateRequestGroup);

// حذف گروه درخواست
router.delete('/:id', requestGroupController.deleteRequestGroup);

export default router; 