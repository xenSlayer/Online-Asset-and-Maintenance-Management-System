import { Router } from 'express';
import { getMaintenanceRecords } from '../controllers/maintenanceRecordController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getMaintenanceRecords);

export default router;
