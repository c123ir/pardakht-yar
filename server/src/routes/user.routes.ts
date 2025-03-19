import { Router } from 'express';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authenticate);

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router; 