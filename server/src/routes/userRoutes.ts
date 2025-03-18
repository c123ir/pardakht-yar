// server/src/routes/userRoutes.ts
// مسیرهای API مدیریت کاربران

import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';

const router = express.Router();

// مسیرهای مدیریت کاربران
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;