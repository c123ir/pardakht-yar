import { Router } from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contact.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authMiddleware);

// دریافت لیست مخاطبین
router.get('/', getContacts);

// دریافت اطلاعات یک مخاطب
router.get('/:id', getContact);

// ایجاد مخاطب جدید
router.post('/', createContact);

// به‌روزرسانی مخاطب
router.put('/:id', updateContact);

// حذف مخاطب
router.delete('/:id', deleteContact);

export default router; 