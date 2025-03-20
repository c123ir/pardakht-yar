import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requestSubGroupController } from '../controllers/requestSubGroup.controller';

const router = Router();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authMiddleware);

// دریافت لیست زیرگروه‌های درخواست
router.get('/', requestSubGroupController.getAllRequestSubGroups);

// دریافت زیرگروه‌های یک گروه درخواست
router.get('/group/:groupId', requestSubGroupController.getRequestSubGroupsByGroupId);

// دریافت یک زیرگروه درخواست با ID
router.get('/:id', requestSubGroupController.getRequestSubGroupById);

// ایجاد زیرگروه درخواست جدید
router.post('/', requestSubGroupController.createRequestSubGroup);

// به‌روزرسانی زیرگروه درخواست
router.put('/:id', requestSubGroupController.updateRequestSubGroup);

// حذف زیرگروه درخواست
router.delete('/:id', requestSubGroupController.deleteRequestSubGroup);

export default router; 