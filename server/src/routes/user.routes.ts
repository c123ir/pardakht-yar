import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadAvatar } from '../middleware/upload.middleware';

const router = Router();

// استفاده از میدلور احراز هویت برای همه مسیرهای کاربر
router.use(authMiddleware);

// مسیرهای API
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// مسیر آپلود آواتار - نکته: آدرس مسیر باید قبل از مسیر :id باشد تا با آن تداخل نداشته باشد
router.post('/upload-avatar', uploadAvatar, userController.uploadAvatar);

export default router; 