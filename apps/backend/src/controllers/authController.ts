import { Request, Response, NextFunction } from 'express';
import { login, logout } from '../services/authService';

export const placeholderAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.path.endsWith('/login')) {
      const result = await login(req.body);
      return res.status(501).json(result);
    }

    if (req.path.endsWith('/logout')) {
      const result = await logout(null);
      return res.status(200).json(result);
    }

    return res.status(404).json({ message: 'Not found' });
  } catch (err) {
    next(err);
  }
};
