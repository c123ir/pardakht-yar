import { Router } from 'express';
import { login, register, getCurrentUser } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getCurrentUser);

export default router; 