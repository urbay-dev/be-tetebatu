import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.js';
import { areaSchema, areaUpdateSchema } from '../utils/validation.js';
import { slugify } from '../utils/slug.js';

export const getAreas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const areas = await prisma.area.findMany();
    res.json({ success: true, message: 'Areas retrieved', data: areas });
  } catch (error) {
    next(error);
  }
};

export const getAreaBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const area = await prisma.area.findUnique({
      where: { slug },
      include: { services: { where: { status: 'PUBLISHED' } } }
    });
    if (!area) throw new AppError(404, 'Area not found');
    res.json({ success: true, message: 'Area retrieved', data: area });
  } catch (error) {
    next(error);
  }
};

export const adminGetAreas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const areas = await prisma.area.findMany();
    res.json({ success: true, message: 'Admin areas retrieved', data: areas });
  } catch (error) {
    next(error);
  }
};

export const adminGetAreaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const area = await prisma.area.findUnique({ where: { id } });
    if (!area) throw new AppError(404, 'Area not found');
    res.json({ success: true, message: 'Area retrieved', data: area });
  } catch (error) {
    next(error);
  }
};

export const adminCreateArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = areaSchema.parse(req.body);
    const slug = validatedData.slug || slugify(validatedData.name);

    const existing = await prisma.area.findUnique({ where: { slug } });
    if (existing) throw new AppError(400, 'Slug already exists');

    const area = await prisma.area.create({
      data: { ...validatedData, slug },
    });

    res.status(201).json({ success: true, message: 'Area created', data: area });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = areaUpdateSchema.parse(req.body);
    
    const area = await prisma.area.findUnique({ where: { id } });
    if (!area) throw new AppError(404, 'Area not found');

    let slug = area.slug;
    if (validatedData.name) {
      slug = validatedData.slug || slugify(validatedData.name);
    } else if (validatedData.slug) {
      slug = validatedData.slug;
    }

    if (slug !== area.slug) {
      const existing = await prisma.area.findUnique({ where: { slug } });
      if (existing) throw new AppError(400, 'Slug already exists');
    }

    const updated = await prisma.area.update({
      where: { id },
      data: { ...validatedData, slug },
    });

    res.json({ success: true, message: 'Area updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.area.delete({ where: { id } });
    res.json({ success: true, message: 'Area deleted' });
  } catch (error) {
    next(error);
  }
};
