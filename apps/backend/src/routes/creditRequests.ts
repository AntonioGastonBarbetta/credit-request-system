import { Router } from 'express';
import {
  listCreditRequests,
  getCreditRequest,
  createCreditRequest
} from '../controllers/creditRequestsController';
import { updateCreditRequestStatus } from '../controllers/creditRequestsController';
import { requireAuth } from '../middlewares/requireAuth';

const router = Router();

// Placeholder endpoints for credit requests
router.get('/', listCreditRequests);
router.get('/:id', getCreditRequest);
router.post('/', requireAuth, createCreditRequest);
router.patch('/:id/status', requireAuth, updateCreditRequestStatus);

export default router;
