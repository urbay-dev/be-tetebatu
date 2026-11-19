import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalServices,
      totalArticles,
      totalCategories,
      totalAreas,
      publishedServices,
      draftServices,
      featuredServices,
      recommendedServices,
      publishedArticles,
      draftArticles,
    ] = await Promise.all([
      prisma.service.count(),
      prisma.article.count(),
      prisma.serviceCategory.count(),
      prisma.area.count(),
      prisma.service.count({ where: { status: 'PUBLISHED' } }),
      prisma.service.count({ where: { status: 'DRAFT' } }),
      prisma.service.count({ where: { isFeatured: true } }),
      prisma.service.count({ where: { isRecommended: true } }),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
    ]);

    const servicesByCategory = await prisma.service.groupBy({
      by: ['categoryId'],
      _count: { id: true },
    });

    const categoryNames = await prisma.serviceCategory.findMany({
      select: { id: true, name: true },
    });

    const categoryStats = categoryNames.map(cat => ({
      name: cat.name,
      count: servicesByCategory.find(s => s.categoryId === cat.id)?._count.id || 0,
    }));

    // WITA calendar days; zero-fill days without new content instead of inventing trends.
    const offset = 8 * 60 * 60 * 1000;
    const today = new Date(Date.now() + offset).toISOString().slice(0, 10);
    const start = new Date(Date.parse(today + 'T00:00:00+08:00') - 29 * 86400000);
    const [serviceDates, articleDates] = await Promise.all([
      prisma.service.findMany({ where: { createdAt: { gte: start } }, select: { createdAt: true } }),
      prisma.article.findMany({ where: { createdAt: { gte: start } }, select: { createdAt: true } }),
    ]);
    const activity = Array.from({ length: 30 }, (_, index) => ({
      date: new Date(start.getTime() + index * 86400000 + offset).toISOString().slice(0, 10),
      services: 0, articles: 0,
    }));
    const dayMap = new Map(activity.map(day => [day.date, day]));
    for (const row of serviceDates) { const day = dayMap.get(new Date(row.createdAt.getTime() + offset).toISOString().slice(0, 10)); if (day) day.services++; }
    for (const row of articleDates) { const day = dayMap.get(new Date(row.createdAt.getTime() + offset).toISOString().slice(0, 10)); if (day) day.articles++; }

    res.json({
      success: true,
      message: 'Dashboard statistics retrieved',
      data: {
        activity,
        overview: {
          totalServices,
          totalArticles,
          totalCategories,
          totalAreas,
        },
        services: {
          published: publishedServices,
          draft: draftServices,
          featured: featuredServices,
          recommended: recommendedServices,
          byCategory: categoryStats,
        },
        articles: {
          published: publishedArticles,
          draft: draftArticles,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
