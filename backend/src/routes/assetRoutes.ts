import { Router } from 'express';
import {
  getAsset,
  getAssets,
  postAsset,
  putAsset,
} from '../controllers/assetController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getAssets);
router.get('/:id', authenticate, getAsset);
router.post('/', authenticate, postAsset);
router.put('/:id', authenticate, putAsset);

export default router;
