import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleEn: z.string().min(1, 'Title in English is required'),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  excerptEn: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  contentEn: z.string().min(1, 'Content in English is required'),
  coverImage: z.string().optional(),
  type: z.enum(['ARTICLE', 'GUIDE', 'EVENT', 'CULTURE']).default('ARTICLE'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  authorId: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
});

export const articleUpdateSchema = articleSchema.partial();
