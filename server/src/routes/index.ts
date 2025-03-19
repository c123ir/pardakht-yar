import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import contactRoutes from './contact.routes';
import groupRoutes from './group.routes';
import paymentRoutes from './payment.routes';
import requestRoutes from './request.routes';
import requestTypeRoutes from './requestType.routes';
import requestGroupRoutes from './requestGroup.routes';
import requestSubGroupRoutes from './requestSubGroup.routes';

const router = Router();

// مسیرهای احراز هویت
router.use('/auth', authRoutes);

// مسیرهای کاربران
router.use('/users', userRoutes);

// مسیرهای مخاطبین
router.use('/contacts', contactRoutes);

// مسیرهای گروه‌ها
router.use('/groups', groupRoutes);

// مسیرهای پرداخت
router.use('/payments', paymentRoutes);

// مسیرهای درخواست
router.use('/requests', requestRoutes);

// مسیرهای انواع درخواست
router.use('/request-types', requestTypeRoutes);

// مسیرهای گروه درخواست
router.use('/request-groups', requestGroupRoutes);

// مسیرهای زیرگروه درخواست
router.use('/request-subgroups', requestSubGroupRoutes);

export default router; 