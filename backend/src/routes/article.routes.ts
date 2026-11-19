import express from 'express';
import { 
  getArticles, 
  getArticleBySlug, 
  adminGetArticles, 
  adminGetArticleById, 
  adminCreateArticle, 
  adminUpdateArticle, 
  adminDeleteArticle 
} from '../controllers/article.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getArticles);

// Admin
router.get('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetArticles);
router.get('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetArticleById);
router.post('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminCreateArticle);
router.patch('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminUpdateArticle);
router.delete('/admin/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminDeleteArticle);

router.get('/:slug', getArticleBySlug);
export default router;
