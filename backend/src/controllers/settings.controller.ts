import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.js';

export const getPublicSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    
    // Filter only public settings (no keys starting with INTERNAL_ or SECRET_)
    const publicSettings = settings.filter(s => 
      !s.key.startsWith('INTERNAL_') && !s.key.startsWith('SECRET_')
    );

    res.json({ success: true, message: 'Public settings retrieved', data: publicSettings });
  } catch (error) {
    next(error);
  }
};

export const adminGetSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    res.json({ success: true, message: 'All settings retrieved', data: settings });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.body;
    const value = req.body.value;

    if (!key) throw new AppError(400, 'Setting key is required');

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.json({ success: true, message: 'Setting updated', data: setting });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.siteSetting.delete({ where: { id } });
    res.json({ success: true, message: 'Setting deleted' });
  } catch (error) {
    next(error);
  }
};
