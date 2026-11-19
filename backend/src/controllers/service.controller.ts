import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.js';
import { serviceSchema, serviceUpdateSchema } from '../utils/service.validation.js';
import { slugify } from '../utils/slug.js';
import { paginationSchema } from '../utils/validation.js';
import { supabaseStorage, generateUniqueFileName } from '../utils/upload.js';
import { env } from '../config/env.js';

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, category, area, sort, order } = paginationSchema.parse(req.query);

    const where: any = { status: 'PUBLISHED', category: { isActive: true } };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = { isActive: true, OR: [{ id: category }, { slug: category }] };
    if (area) where.areaId = area;

    const total = await prisma.service.count({ where });
    const services = await prisma.service.findMany({
      where,
      include: { category: true, area: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 }, prices: true },
      orderBy: [{ [sort]: order }, { id: 'asc' }],
      take: limit,
      skip: (page - 1) * limit,
    });

    res.json({
      success: true,
      message: 'Services retrieved',
      data: services,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED', isFeatured: true, category: { isActive: true } },
      orderBy: { sortOrder: 'asc' },
      include: { category: true, area: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 }, prices: true },
    });
    res.json({ success: true, message: 'Featured services retrieved', data: services });
  } catch (error) {
    next(error);
  }
};

export const getRecommendedServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED', isRecommended: true, category: { isActive: true } },
      orderBy: { sortOrder: 'asc' },
      include: { category: true, area: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 }, prices: true },
    });
    res.json({ success: true, message: 'Recommended services retrieved', data: services });
  } catch (error) {
    next(error);
  }
};

export const getServiceBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        category: true,
        area: true,
        images: { orderBy: { sortOrder: 'asc' } },
        contacts: true,
        facilities: true,
        features: true,
        prices: true,
      },
    });

    if (!service) throw new AppError(404, 'Service not found');
    if (service.status !== 'PUBLISHED' || !service.category.isActive) throw new AppError(404, 'Service is not available');

    res.json({ success: true, message: 'Service retrieved', data: service });
  } catch (error) {
    next(error);
  }
};

export const adminGetServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, area: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 }, prices: true },
    });
    res.json({ success: true, message: 'Admin services retrieved', data: services });
  } catch (error) {
    next(error);
  }
};

export const adminGetServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        images: true,
        contacts: true,
        facilities: true,
        features: true,
        prices: true,
      },
    });
    if (!service) throw new AppError(404, 'Service not found');
    res.json({ success: true, message: 'Service retrieved', data: service });
  } catch (error) {
    next(error);
  }
};

export const adminCreateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = serviceSchema.parse(req.body);
    const slug = validatedData.slug || slugify(validatedData.name);

    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) throw new AppError(400, 'Slug already exists');

    const service = await prisma.service.create({
      data: {
        ...validatedData,
        slug,
        contacts: { create: validatedData.contacts || [] },
        facilities: { create: validatedData.facilities || [] },
        features: { create: validatedData.features || [] },
        prices: { create: validatedData.prices || [] },
      },
      include: {
        contacts: true,
        facilities: true,
        features: true,
        prices: true,
      },
    });

    res.status(201).json({ success: true, message: 'Service created', data: service });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = serviceUpdateSchema.parse(req.body);

    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new AppError(404, 'Service not found');

    let slug = service.slug;
    if (validatedData.name) {
      slug = validatedData.slug || slugify(validatedData.name);
    } else if (validatedData.slug) {
      slug = validatedData.slug;
    }

    if (slug !== service.slug) {
      const existing = await prisma.service.findUnique({ where: { slug } });
      if (existing) throw new AppError(400, 'Slug already exists');
    }

    // Complex relational update strategy: Replace existing
    const updates: any = { ...validatedData, slug };

    if (validatedData.contacts) {
      updates.contacts = { deleteMany: {}, create: validatedData.contacts };
    }
    if (validatedData.facilities) {
      updates.facilities = { deleteMany: {}, create: validatedData.facilities };
    }
    if (validatedData.features) {
      updates.features = { deleteMany: {}, create: validatedData.features };
    }
    if (validatedData.prices) {
      updates.prices = { deleteMany: {}, create: validatedData.prices };
    }

    const updated = await prisma.service.update({
      where: { id },
      data: updates,
      include: {
        contacts: true,
        facilities: true,
        features: true,
        prices: true,
      },
    });

    res.json({ success: true, message: 'Service updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};

export const adminUploadServiceImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!req.file) throw new AppError(400, 'Image file is required');

    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new AppError(404, 'Service not found');

    const fileName = generateUniqueFileName(req.file.originalname);
    const storagePath = `services/${id}/${fileName}`;
    const uploaded = await supabaseStorage.uploadFile(env.SUPABASE_BUCKET, storagePath, req.file);

    const count = await prisma.serviceImage.count({ where: { serviceId: id } });
    const image = await prisma.serviceImage.create({
      data: {
        serviceId: id,
        bucket: uploaded.bucket,
        storagePath: uploaded.storagePath,
        url: uploaded.url,
        alt: req.body.alt || null,
        altEn: req.body.altEn || null,
        isPrimary: count === 0,
        sortOrder: count,
      },
    });

    res.status(201).json({ success: true, message: 'Image uploaded', data: image });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteServiceImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, imageId } = req.params;
    const image = await prisma.serviceImage.findFirst({ where: { id: imageId, serviceId: id } });
    if (!image) throw new AppError(404, 'Image not found');

    await supabaseStorage.deleteFile(image.bucket, image.storagePath);
    await prisma.serviceImage.delete({ where: { id: imageId } });

    if (image.isPrimary) {
      const next = await prisma.serviceImage.findFirst({
        where: { serviceId: id },
        orderBy: { sortOrder: 'asc' },
      });
      if (next) await prisma.serviceImage.update({ where: { id: next.id }, data: { isPrimary: true } });
    }

    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};

export const adminSetPrimaryServiceImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, imageId } = req.params;
    const image = await prisma.serviceImage.findFirst({ where: { id: imageId, serviceId: id } });
    if (!image) throw new AppError(404, 'Image not found');

    const [, updated] = await prisma.$transaction([
      prisma.serviceImage.updateMany({ where: { serviceId: id }, data: { isPrimary: false } }),
      prisma.serviceImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
    ]);

    res.json({ success: true, message: 'Primary image updated', data: updated });
  } catch (error) {
    next(error);
  }
};
