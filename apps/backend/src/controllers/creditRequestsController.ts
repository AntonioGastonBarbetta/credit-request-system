import { Request, Response, NextFunction } from 'express';
import { createCreditRequest as createCreditRequestService, listCreditRequests as listService, getCreditRequestDetail, updateCreditRequestStatus as updateStatusService } from '../services/creditRequestsService';
import { CreditRequestStatus } from '@credit-request-system/shared';
import type { Database } from '../db/types';
import { statusUpdateSchema } from '../validation/statusUpdate';
import { logger } from '../logger';
import { cacheGet, cacheSet } from '../cache/cacheService';
import { creditRequestsListKey, creditRequestByIdKey } from '../cache/cacheKeys';

export const listCreditRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawStatus = req.query.status as string | undefined;
    const status = rawStatus && (Object.values(CreditRequestStatus) as string[]).includes(rawStatus) ? (rawStatus as unknown as Database['credit_requests']['status']) : undefined;
    const filters = {
      country_code: req.query.country_code as string | undefined,
      status
    };
    const key = creditRequestsListKey(filters as any);
    const cached = await cacheGet<{ data: any[] }>(key);
    if (cached) return res.json(cached);

    const data = await listService(filters);
    const payload = { data };
    await cacheSet(key, payload);
    res.json(payload);
  } catch (err) {
    next(err);
  }
};

export const getCreditRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const key = creditRequestByIdKey(id);
    const cached = await cacheGet<any>(key);
    if (cached) return res.json(cached);

    const result = await getCreditRequestDetail(id);
    await cacheSet(key, result);
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

export const updateCreditRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = statusUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const err = new Error('Invalid payload');
      (err as any).status = 400;
      throw err;
    }

    const id = req.params.id;
    logger.info({ id, requestedStatus: parsed.data.status }, 'status.update.request');

    const updated = await updateStatusService(id, parsed.data.status, parsed.data.reason ?? null);

    logger.info({ id, newStatus: parsed.data.status }, 'status.update.success');

    res.json({ creditRequest: updated });
  } catch (err) {
    logger.warn({ err, params: req.params }, 'status.update.error');
    next(err);
  }
};
