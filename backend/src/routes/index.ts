import { Router } from 'express';
import authRoutes from './authRoutes';
import assetRoutes from './assetRoutes';
import dashboardRoutes from './dashboardRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/assets', assetRoutes);

export default router;
