import { Router } from 'express';
import {
  deleteUserById,
  getUsers,
  postUser,
  putUser,
} from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getUsers);
router.post('/', authenticate, postUser);
router.put('/:id', authenticate, putUser);
router.delete('/:id', authenticate, deleteUserById);

export default router;
