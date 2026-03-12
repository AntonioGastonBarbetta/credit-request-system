import { Request, Response, NextFunction } from 'express';
import { checkHealth } from '../services/healthService';

export const health = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await checkHealth();
    res.json(result);
  } catch (err) {
    next(err);
  }
};
