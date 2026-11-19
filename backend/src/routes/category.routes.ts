import express from 'express';
import { 
  getCategories, 
  getCategoryBySlug, 
  adminGetCategories, 
  adminGetCategoryById, 
  adminCreateCategory, 
  adminUpdateCategory, 
  adminDeleteCategory 
} from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getCategories);

// Admin
router.get('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetCategories);
router.post('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminCreateCategory);
router.get('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetCategoryById);
router.patch('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminUpdateCategory);
router.delete('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminDeleteCategory);

// Public dynamic
router.get('/:slug', getCategoryBySlug);

export default router;
