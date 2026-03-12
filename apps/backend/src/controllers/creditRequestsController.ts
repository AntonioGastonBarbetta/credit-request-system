import { Request, Response, NextFunction } from 'express';
import { createCreditRequest as createCreditRequestService, listCreditRequests as listService, getCreditRequestDetail } from '../services/creditRequestsService';
import { CreditRequestStatus } from '@credit-request-system/shared';
import type { Database } from '../db/types';

export const listCreditRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawStatus = req.query.status as string | undefined;
    const status = rawStatus && (Object.values(CreditRequestStatus) as string[]).includes(rawStatus) ? (rawStatus as unknown as Database['credit_requests']['status']) : undefined;
    const filters = {
      country_code: req.query.country_code as string | undefined,
      status
    };
    const data = await listService(filters);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

export const getCreditRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getCreditRequestDetail(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createCreditRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const created = await createCreditRequestService(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};
