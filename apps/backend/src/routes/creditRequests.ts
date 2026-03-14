import { Router } from 'express';
import {
  listCreditRequests,
  getCreditRequest,
  createCreditRequest
} from '../controllers/creditRequestsController';
import { updateCreditRequestStatus } from '../controllers/creditRequestsController';

const router = Router();

// Placeholder endpoints for credit requests
router.get('/', listCreditRequests);
router.get('/:id', getCreditRequest);
router.post('/', createCreditRequest);
router.patch('/:id/status', updateCreditRequestStatus);

export default router;
