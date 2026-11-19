import express from 'express';
import { 
  getAreas, 
  getAreaBySlug, 
  adminGetAreas, 
  adminGetAreaById, 
  adminCreateArea, 
  adminUpdateArea, 
  adminDeleteArea 
} from '../controllers/area.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getAreas);

// Admin
router.get('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetAreas);
router.get('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetAreaById);
router.post('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminCreateArea);
router.patch('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminUpdateArea);
router.delete('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminDeleteArea);

router.get('/:slug', getAreaBySlug);
export default router;
