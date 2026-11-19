import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  shortDescription: z.string().optional(),
  shortDescriptionEn: z.string().optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  areaId: z.string().nullable().optional(),
  address: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).nullable().optional(),
  longitude: z.coerce.number().min(-180).max(180).nullable().optional(),
  googleMapsUrl: z.union([z.string().url(), z.literal("")]).optional(),
  directions: z.string().optional(),
  directionsEn: z.string().optional(),
  openingHours: z.any().optional(),
  vehicleType: z.string().optional(),
  passengerCapacity: z.coerce.number().int().min(1).nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  isRecommended: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  
  // Relational data (handled in transactions in controller)
  contacts: z.array(z.object({
    type: z.enum(['WHATSAPP', 'PHONE', 'EMAIL', 'WEBSITE', 'INSTAGRAM', 'FACEBOOK', 'OTHER']),
    label: z.string().optional(),
    value: z.string().min(1),
    isPrimary: z.boolean().optional(),
  })).optional(),
  
  facilities: z.array(z.object({
    name: z.string().min(1),
    nameEn: z.string().min(1),
    icon: z.string().optional(),
  })).optional(),
  
  features: z.array(z.object({
    name: z.string().min(1),
    nameEn: z.string().min(1),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
  })).optional(),
  
  prices: z.array(z.object({
    label: z.string().min(1),
    labelEn: z.string().min(1),
    type: z.enum(['FIXED', 'RANGE', 'STARTING_FROM', 'FREE', 'CONTACT_FOR_PRICE']),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    currency: z.string().default('IDR'),
    unit: z.string().optional(),
    unitEn: z.string().optional(),
  })).optional(),
});

export const serviceUpdateSchema = serviceSchema.partial();
