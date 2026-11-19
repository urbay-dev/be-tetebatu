import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { AppError } from '../middleware/error.js';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_SECRET || 'fallback_secret_must_be_32_chars_long', {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, env.JWT_SECRET || 'fallback_secret_must_be_32_chars_long') as { userId: string };
  } catch (error) {
    throw new AppError(401, 'Invalid or expired token');
  }
};
