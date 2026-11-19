import express from 'express';
import { 
  getHomepage, 
  adminGetHomepage, 
  adminUpdateHomepageSection, 
  adminCreateHomepageSection, 
  adminDeleteHomepageSection 
} from '../controllers/homepage.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getHomepage);

// Admin
router.get('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetHomepage);
router.post('/admin/sections', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminCreateHomepageSection);
router.patch('/admin/sections/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminUpdateHomepageSection);
router.delete('/admin/sections/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminDeleteHomepageSection);

export default router;
