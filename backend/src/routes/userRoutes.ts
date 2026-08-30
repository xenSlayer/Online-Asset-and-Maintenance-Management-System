import { Router } from 'express';
import {
  getUsers,
  patchDeactivateUser,
  postUser,
  putUser,
} from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getUsers);
router.post('/', authenticate, postUser);
router.put('/:id', authenticate, putUser);
router.patch('/:id/deactivate', authenticate, patchDeactivateUser);

export default router;
