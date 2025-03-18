// server/src/routes/userRoutes.ts
// مسیرهای API مدیریت کاربران

import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// محافظت از همه مسیرهای کاربری
router.use(authenticate);

// فقط ادمین می‌تواند کاربران را مدیریت کند
router.get('/', authorize(['ADMIN']), getUsers);
router.post('/', authorize(['ADMIN']), createUser);
router.get('/:id', authorize(['ADMIN']), getUserById);
router.put('/:id', authorize(['ADMIN']), updateUser);
router.delete('/:id', authorize(['ADMIN']), deleteUser);

export default router;