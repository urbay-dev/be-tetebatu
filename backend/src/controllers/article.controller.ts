import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.js';
import { articleSchema, articleUpdateSchema } from '../utils/article.validation.js';
import { slugify } from '../utils/slug.js';
import { paginationSchema } from '../utils/validation.js';

export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, type } = paginationSchema.parse(req.query);

    const where: any = { status: 'PUBLISHED' };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (type) where.type = type;

    const total = await prisma.article.count({ where });
    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    res.json({
      success: true,
      message: 'Articles retrieved',
      data: req.query.view === 'page' ? { items: articles, totalPages: Math.ceil(total / limit) } : articles,
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

export const getArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { images: true },
    });

    if (!article) throw new AppError(404, 'Article not found');
    if (article.status !== 'PUBLISHED') throw new AppError(404, 'Article is not published');

    res.json({ success: true, message: 'Article retrieved', data: article });
  } catch (error) {
    next(error);
  }
};

export const adminGetArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, message: 'Admin articles retrieved', data: articles });
  } catch (error) {
    next(error);
  }
};

export const adminGetArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!article) throw new AppError(404, 'Article not found');
    res.json({ success: true, message: 'Article retrieved', data: article });
  } catch (error) {
    next(error);
  }
};

export const adminCreateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = articleSchema.parse(req.body);
    const slug = validatedData.slug || slugify(validatedData.title);

    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) throw new AppError(400, 'Slug already exists');

    const article = await prisma.article.create({
      data: { ...validatedData, slug },
    });

    res.status(201).json({ success: true, message: 'Article created', data: article });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = articleUpdateSchema.parse(req.body);

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) throw new AppError(404, 'Article not found');

    let slug = article.slug;
    if (validatedData.title) {
      slug = validatedData.slug || slugify(validatedData.title);
    } else if (validatedData.slug) {
      slug = validatedData.slug;
    }

    if (slug !== article.slug) {
      const existing = await prisma.article.findUnique({ where: { slug } });
      if (existing) throw new AppError(400, 'Slug already exists');
    }

    const updated = await prisma.article.update({
      where: { id },
      data: { ...validatedData, slug },
    });

    res.json({ success: true, message: 'Article updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id } });
    res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    next(error);
  }
};
