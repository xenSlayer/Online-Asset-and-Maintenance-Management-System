import { Router } from 'express';
import {
  deleteRequest,
  getMaintenanceRequests,
  patchApproveRequest,
  patchAssignRequest,
  patchCompleteRequest,
  patchProgressRequest,
  postMaintenanceRequest,
} from '../controllers/maintenanceRequestController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getMaintenanceRequests);
router.post('/', authenticate, postMaintenanceRequest);
router.patch('/:id/approve', authenticate, patchApproveRequest);
router.patch('/:id/assign', authenticate, patchAssignRequest);
router.patch('/:id/progress', authenticate, patchProgressRequest);
router.patch('/:id/complete', authenticate, patchCompleteRequest);
router.delete('/:id', authenticate, deleteRequest);

export default router;
