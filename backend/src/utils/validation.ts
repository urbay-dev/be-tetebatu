import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameEn: z.string().min(1, 'Name in English is required'),
  slug: z.string().optional(), // Generated if not provided
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const categoryUpdateSchema = categorySchema.partial();

export const areaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(), // Generated if not provided
  description: z.string().optional(),
});

export const areaUpdateSchema = areaSchema.partial();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  area: z.string().optional(),
  type: z.enum(['ARTICLE', 'GUIDE', 'EVENT', 'CULTURE']).optional(),
  sort: z.enum(['name', 'sortOrder', 'createdAt', 'isRecommended']).default('name'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});
