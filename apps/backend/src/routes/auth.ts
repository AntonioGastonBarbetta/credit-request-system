import { Router } from 'express';
import { placeholderAuth } from '../controllers/authController';

const router = Router();

// Placeholder auth endpoints for future implementation
router.post('/login', placeholderAuth);
router.post('/logout', placeholderAuth);

export default router;
