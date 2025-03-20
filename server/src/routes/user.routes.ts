import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// استفاده از میدلور احراز هویت برای همه مسیرهای کاربر
router.use(authMiddleware);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router; 