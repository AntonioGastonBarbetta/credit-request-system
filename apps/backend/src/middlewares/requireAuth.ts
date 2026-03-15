import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../security/jwt';
import { logger } from '../logger';

export interface AuthRequest extends Request {
  user?: JwtPayload | null;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = auth.slice('Bearer '.length);
  const payload = verifyToken(token);
  if (!payload) {
    logger.info('auth.token.invalid');
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.user = { sub: payload.sub, email: payload.email };
  return next();
}
