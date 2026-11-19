import express from 'express';
import { 
  getPublicSettings, 
  adminGetSettings, 
  adminUpdateSetting, 
  adminDeleteSetting 
} from '../controllers/settings.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/public', getPublicSettings);

// Admin
router.get('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetSettings);
router.patch('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminUpdateSetting);
router.delete('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminDeleteSetting);

export default router;
