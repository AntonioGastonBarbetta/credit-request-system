import { Router } from 'express';
import {
  listCreditRequests,
  getCreditRequest,
  createCreditRequest
} from '../controllers/creditRequestsController';

const router = Router();

// Placeholder endpoints for credit requests
router.get('/', listCreditRequests);
router.get('/:id', getCreditRequest);
router.post('/', createCreditRequest);

export default router;
