import { Router } from 'express';
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../controllers/group.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authenticate);

// دریافت لیست گروه‌ها
router.get('/', getGroups);

// دریافت اطلاعات یک گروه
router.get('/:id', getGroup);

// ایجاد گروه جدید
router.post('/', createGroup);

// به‌روزرسانی گروه
router.put('/:id', updateGroup);

// حذف گروه
router.delete('/:id', deleteGroup);

export default router; 