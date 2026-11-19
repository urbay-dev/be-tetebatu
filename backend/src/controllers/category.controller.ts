import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.js';
import { categorySchema, categoryUpdateSchema } from '../utils/validation.js';
import { slugify } from '../utils/slug.js';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, message: 'Categories retrieved', data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    // Cari berdasarkan slug
    let category = await prisma.serviceCategory.findUnique({
      where: { slug },
    });

    // Jika tidak ketemu, coba cari berdasarkan ID (untuk fleksibilitas)
    if (!category) {
      category = await prisma.serviceCategory.findUnique({
        where: { id: slug },
      });
    }

    if (!category) throw new AppError(404, `Category with slug or ID '${slug}' not found`);
    res.json({ success: true, message: 'Category retrieved', data: category });
  } catch (error) {
    next(error);
  }
};

export const adminGetCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, message: 'Admin categories retrieved', data: categories });
  } catch (error) {
    next(error);
  }
};

export const adminGetCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
    });
    if (!category) throw new AppError(404, 'Category not found');
    res.json({ success: true, message: 'Category retrieved', data: category });
  } catch (error) {
    next(error);
  }
};

export const adminCreateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = categorySchema.parse(req.body);
    const slug = validatedData.slug || slugify(validatedData.name);

    const existing = await prisma.serviceCategory.findUnique({ where: { slug } });
    if (existing) throw new AppError(400, 'Slug already exists');

    const category = await prisma.serviceCategory.create({
      data: { ...validatedData, slug },
    });

    res.status(201).json({ success: true, message: 'Category created', data: category });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = categoryUpdateSchema.parse(req.body);
    
    const category = await prisma.serviceCategory.findUnique({ where: { id } });
    if (!category) throw new AppError(404, 'Category not found');

    let slug = category.slug;
    if (validatedData.name) {
      slug = validatedData.slug || slugify(validatedData.name);
    } else if (validatedData.slug) {
      slug = validatedData.slug;
    }

    if (slug !== category.slug) {
      const existing = await prisma.serviceCategory.findUnique({ where: { slug } });
      if (existing) throw new AppError(400, 'Slug already exists');
    }

    const updated = await prisma.serviceCategory.update({
      where: { id },
      data: { ...validatedData, slug },
    });

    res.json({ success: true, message: 'Category updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const serviceCount = await prisma.service.count({ where: { categoryId: id } });
    if (serviceCount > 0) {
      throw new AppError(400, 'Cannot delete category that contains services. Please reassign services first.');
    }

    await prisma.serviceCategory.delete({ where: { id } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
