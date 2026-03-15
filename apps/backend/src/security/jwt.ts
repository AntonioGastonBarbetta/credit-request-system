import jwt from 'jsonwebtoken';
import { logger } from '../logger';
import type { Secret, SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  email: string;
}

const SECRET = (process.env.JWT_SECRET || 'dev-secret-change-me') as Secret;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '4h';

export function signToken(payload: JwtPayload): string {
  const opts: SignOptions = { expiresIn: EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, SECRET, opts) as string;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch (_) {
    logger.warn('auth.token.invalid');
    return null;
  }
}
