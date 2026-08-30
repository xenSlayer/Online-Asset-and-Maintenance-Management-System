import { Router } from 'express';
import {
  getTechnician,
  getTechnicians,
  putTechnician,
} from '../controllers/technicianController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getTechnicians);
router.get('/:id', authenticate, getTechnician);
router.put('/:id', authenticate, putTechnician);

export default router;
