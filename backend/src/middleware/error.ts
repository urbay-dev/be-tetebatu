import { Request, Response, NextFunction } from 'express';
import pino from 'pino';
import { ZodError } from 'zod';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export class AppError extends Error {
  constructor(public statusCode: number, message: string, public details?: any) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ZodError ? 400 : err instanceof AppError ? err.statusCode : err.code === 'P2002' ? 409 : 500;
  const message = err instanceof ZodError ? 'Periksa kembali isian formulir.' : err instanceof AppError ? err.message : err.code === 'P2002' ? 'Nama atau tautan sudah digunakan.' : 'Terjadi kesalahan pada server. Silakan coba lagi.';
  const details = err instanceof ZodError ? err.flatten().fieldErrors : err.details || null;

  logger.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    errors: details,
  });
};
