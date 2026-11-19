import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.js';

export const getHomepage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { services: { where: { status: 'PUBLISHED' }, take: 4, orderBy: [{ isFeatured: 'desc' }, { isRecommended: 'desc' }, { sortOrder: 'asc' }], include: { images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 } } } },
    });

    const featuredServices = await prisma.service.findMany({
      where: { status: 'PUBLISHED', isFeatured: true, category: { isActive: true } },
      orderBy: { sortOrder: 'asc' },
      take: 6,
      include: { category: true, area: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 }, prices: true },
    });

    const recommendedServices = await prisma.service.findMany({
      where: { status: 'PUBLISHED', isRecommended: true, category: { isActive: true } },
      orderBy: { sortOrder: 'asc' },
      take: 6,
      include: { category: true, area: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 }, prices: true },
    });

    const latestArticles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });

    const [attractions, activities] = await Promise.all(['tourist-attractions', 'tours-activities'].map(slug => prisma.service.findMany({
      where: { status: 'PUBLISHED', category: { slug, isActive: true } },
      include: { category: true, area: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 }, prices: true },
      orderBy: [{ isRecommended: 'desc' }, { sortOrder: 'asc' }], take: 3,
    })));
    res.json({
      success: true,
      message: 'Homepage data retrieved',
      data: {
        sections: sections.filter(s => s.isActive),
        hiddenSections: sections.filter(s => !s.isActive).map(s => s.key),
        categories,
        featuredServices,
        recommendedServices,
        latestArticles,
        attractions,
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminGetHomepage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, message: 'Admin homepage data retrieved', data: { sections } });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateHomepageSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const section = await prisma.homepageSection.findUnique({ where: { id } });
    if (!section) throw new AppError(404, 'Section not found');

    const updated = await prisma.homepageSection.update({
      where: { id },
      data: updates,
    });

    res.json({ success: true, message: 'Section updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const adminCreateHomepageSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const section = await prisma.homepageSection.create({ data });
    res.status(201).json({ success: true, message: 'Section created', data: section });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteHomepageSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.homepageSection.delete({ where: { id } });
    res.json({ success: true, message: 'Section deleted' });
  } catch (error) {
    next(error);
  }
};
