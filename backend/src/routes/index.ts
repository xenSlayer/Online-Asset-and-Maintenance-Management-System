import { Router } from 'express';
import authRoutes from './authRoutes';
import assetRoutes from './assetRoutes';
import dashboardRoutes from './dashboardRoutes';
import maintenanceRecordRoutes from './maintenanceRecordRoutes';
import maintenanceRequestRoutes from './maintenanceRequestRoutes';
import statsRoutes from './statsRoutes';
import technicianRoutes from './technicianRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/stats', statsRoutes);
router.use('/users', userRoutes);
router.use('/assets', assetRoutes);
router.use('/technicians', technicianRoutes);
router.use('/maintenance-requests', maintenanceRequestRoutes);
router.use('/maintenance-records', maintenanceRecordRoutes);

export default router;
