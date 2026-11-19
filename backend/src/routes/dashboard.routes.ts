import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), getDashboardStats);

export default router;
