import express from 'express';
import { 
  getServices, 
  getFeaturedServices, 
  getRecommendedServices, 
  getServiceBySlug, 
  adminGetServices, 
  adminGetServiceById, 
  adminCreateService, 
  adminUpdateService, 
  adminDeleteService,
  adminUploadServiceImage,
  adminDeleteServiceImage,
  adminSetPrimaryServiceImage
} from '../controllers/service.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

// Public
router.get('/', getServices);
router.get('/featured', getFeaturedServices);
router.get('/recommended', getRecommendedServices);

// Admin
router.get('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetServices);
router.post('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminCreateService);
router.get('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetServiceById);
router.patch('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminUpdateService);
router.delete('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminDeleteService);
router.post('/admin/:id/images', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('image'), adminUploadServiceImage);
router.delete('/admin/:id/images/:imageId', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminDeleteServiceImage);
router.patch('/admin/:id/images/:imageId/primary', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminSetPrimaryServiceImage);

// Public dynamic
router.get('/:slug', getServiceBySlug);

export default router;
