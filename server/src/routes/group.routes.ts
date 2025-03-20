import { Router } from 'express';
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup
} from '../controllers/group.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authMiddleware);

// دریافت لیست گروه‌ها
router.get('/', getAllGroups);

// دریافت اطلاعات یک گروه
router.get('/:id', getGroupById);

// ایجاد گروه جدید
router.post('/', createGroup);

// به‌روزرسانی گروه
router.put('/:id', updateGroup);

// حذف گروه
router.delete('/:id', deleteGroup);

export default router; 