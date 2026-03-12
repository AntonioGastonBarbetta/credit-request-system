import { Router } from 'express';
import healthRoutes from './health';
import authRoutes from './auth';
import creditRequestsRoutes from './creditRequests';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/credit-requests', creditRequestsRoutes);

export default router;
