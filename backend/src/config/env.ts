import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  DATABASE_URL: z.preprocess((val) => (val === '' ? undefined : val), z.string().url().optional()),
  DIRECT_URL: z.preprocess((val) => (val === '' ? undefined : val), z.string().url().optional()),
  SUPABASE_URL: z.preprocess((val) => (val === '' ? undefined : val), z.string().url().optional()),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(1).optional()),
  SUPABASE_BUCKET: z.string().min(1).default('tetebatu-assets'),
  JWT_SECRET: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(32).optional()),
  JWT_EXPIRES_IN: z.string().default('1d'),
  ADMIN_NAME: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(1).optional()),
  ADMIN_EMAIL: z.preprocess((val) => (val === '' ? undefined : val), z.string().email().optional()),
  ADMIN_PASSWORD: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(6).optional()),
  FRONTEND_URL: z.preprocess((val) => (val === '' ? undefined : val), z.string().url().optional()),
  API_URL: z.preprocess((val) => (val === '' ? undefined : val), z.string().url().optional()),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
