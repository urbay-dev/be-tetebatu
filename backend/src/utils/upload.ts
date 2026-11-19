import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/error.js';
import { logger } from '../middleware/error.js';
import path from 'path';
import crypto from 'crypto';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});

const supabase = createClient(env.SUPABASE_URL || '', env.SUPABASE_SERVICE_ROLE_KEY || '');

export const supabaseStorage = {
  async uploadFile(bucket: string, path: string, file: Express.Multer.File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      logger.error({ error }, 'Supabase upload failed');
      throw new AppError(500, 'Failed to upload image to storage');
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return {
      bucket,
      storagePath: path,
      url: publicUrlData.publicUrl,
    };
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      logger.error({ error }, 'Supabase deletion failed');
      // We don't throw here to avoid blocking DB deletion, but we log it.
    }
  },
};

export const generateUniqueFileName = (originalName: string) => {
  const ext = path.extname(originalName);
  const hash = crypto.randomBytes(8).toString('hex');
  return `${hash}${ext}`;
};
