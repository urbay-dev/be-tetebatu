import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import areaRoutes from './routes/area.routes.js';
import serviceRoutes from './routes/service.routes.js';
import articleRoutes from './routes/article.routes.js';
import homepageRoutes from './routes/homepage.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { setupSwagger } from './utils/swagger.js';
import { env } from './config/env.js';
import { errorHandler, logger } from './middleware/error.js';
import express from 'express';
import helmetModule from 'helmet';
import cors from 'cors';
import rateLimitModule from 'express-rate-limit';

const helmet: any = (helmetModule as any).default ?? helmetModule;
const rateLimit: any = (rateLimitModule as any).default ?? rateLimitModule;

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = (env.FRONTEND_URL ?? '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || (allowedOrigins.length === 0 && env.NODE_ENV !== 'production')) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// Body Parsing & Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Swagger Docs
setupSwagger(app);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/areas', areaRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/homepage', homepageRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/admin/dashboard', dashboardRoutes);

// Error Handler
app.use(errorHandler);

export default app;
