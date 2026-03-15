import { Router } from 'express';
import healthRoutes from './health';
import authRoutes from './auth';
import creditRequestsRoutes from './creditRequests';
import mockExternalRoutes from './mockExternal';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/credit-requests', creditRequestsRoutes);
router.use('/mock-external', mockExternalRoutes);

export default router;
