import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// تنظیمات آپلود تصاویر
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    
    // ساخت پوشه اگر وجود نداشته باشد
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const avatarUpload = multer({ 
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // حداکثر 2 مگابایت
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (ext && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('فقط فایل‌های تصویری مجاز هستند'));
    }
  }
});

// استفاده از میدلور احراز هویت برای همه مسیرهای کاربر
router.use(authMiddleware);

// مسیرهای API
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// مسیر آپلود آواتار
router.post('/avatar', avatarUpload.single('avatar'), userController.uploadAvatar);

export default router; 