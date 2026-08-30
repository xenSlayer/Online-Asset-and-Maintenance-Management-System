import { Router } from 'express';
import {
  getTechnician,
  getTechnicians,
} from '../controllers/technicianController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getTechnicians);
router.get('/:id', authenticate, getTechnician);

export default router;
