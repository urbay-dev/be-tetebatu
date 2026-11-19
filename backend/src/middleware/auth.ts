import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';
import { AppError } from '../middleware/error.js';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role?: string;
  };
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError(401, 'Authentication required'));
  }

  try {
    const decoded = verifyToken(token);
    // We'll attach the userId. Role check is usually done in authorize.
    (req as AuthRequest).user = { userId: decoded.userId };
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // In a real scenario, we'd fetch the user from DB here or include role in JWT.
    // Since we want the latest role (in case of changes), we'll fetch the user.
    // But for a simple architecture, including role in JWT is common.
    // Let's check the role from the DB to ensure accuracy.
    try {
      const { prisma } = await import('../lib/prisma.js');
      const userId = (req as AuthRequest).user?.userId;

      if (!userId) return next(new AppError(401, 'User not authenticated'));

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, isActive: true },
      });

      if (!user) return next(new AppError(404, 'User not found'));
      if (!user.isActive) return next(new AppError(403, 'Account is disabled'));
      if (!roles.includes(user.role)) {
        return next(new AppError(403, 'You do not have permission to perform this action'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
