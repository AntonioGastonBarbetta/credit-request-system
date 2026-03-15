import { z } from 'zod';
import { getDb } from '../db';
import { creditRequestsRepository } from '../repositories/creditRequestsRepository';
import { statusHistoryRepository } from '../repositories/statusHistoryRepository';
import type { Insertable, Selectable } from 'kysely';
import type { Database } from '../db/types';
import { CreditRequestStatus, SYSTEM_USER_ID } from '@credit-request-system/shared';
import { resolvePolicy, resolveProvider } from '../domain/countries/CountryResolver';
import { emitEvent } from '../realtime/socketServer';
import { cacheDel } from '../cache/cacheService';
import { creditRequestsListKey, creditRequestByIdKey } from '../cache/cacheKeys';

// Simple DTO validation schema
const createSchema = z.object({
  country_code: z.string().min(2).max(4),
  applicant_name: z.string().min(1).max(255),
  document_number: z.string().min(1).max(100),
  monthly_income: z.number().nonnegative(),
  requested_amount: z.number().positive(),
  currency: z.string().min(1).max(10)
});

// Development/demo user id (replace with real auth later)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function createCreditRequest(data: unknown): Promise<Selectable<Database['credit_requests']>> {
  const parsed = createSchema.safeParse(data);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    const message = Object.values(err.fieldErrors).flat().join('; ') || 'Invalid payload';
    const error = new Error(message);
    (error as any).status = 400;
    throw error;
  }

  const policy = resolvePolicy(parsed.data.country_code);
  const provider = resolveProvider(parsed.data.country_code);

  // validate document format per country policy
  if (!policy.validateDocument(parsed.data.document_number)) {
    const error = new Error(`Invalid document for country ${parsed.data.country_code}`);
    (error as any).status = 400;
    throw error;
  }

  // Evaluate policy decision
  const decision = policy.evaluateRequest({ requested_amount: parsed.data.requested_amount, monthly_income: parsed.data.monthly_income, document: parsed.data.document_number });

  // Fetch bank data from provider
  const bankData = await provider.getBankData(parsed.data.document_number);

  const payload: Insertable<Database['credit_requests']> = {
    country_code: parsed.data.country_code,
    applicant_name: parsed.data.applicant_name,
    document_number: parsed.data.document_number,
    monthly_income: parsed.data.monthly_income,
    requested_amount: parsed.data.requested_amount,
    currency: parsed.data.currency,
    status: decision.initialStatus,
    decision_reason: decision.decisionReason ?? null,
    bank_account_valid: bankData.bank_account_valid,
    total_debt: bankData.total_debt.toString(),
    created_by_user_id: DEMO_USER_ID
  } as unknown as Insertable<Database['credit_requests']>;

  const created = await creditRequestsRepository.create(payload);

  // create initial status history
  const historyEntry: Insertable<Database['status_history']> = {
    credit_request_id: created.id,
    previous_status: null,
    new_status: decision.initialStatus,
    changed_by_user_id: DEMO_USER_ID,
    reason: decision.decisionReason ?? null
  } as unknown as Insertable<Database['status_history']>;

  await statusHistoryRepository.create(historyEntry);

  // emit realtime event for created credit request
  try {
    emitEvent('credit_request.created', { creditRequest: created });
  } catch (err) {
    // don't block on realtime failures
  }

  // invalidate caches that may be affected
  try {
    await cacheDel(creditRequestsListKey());
    await cacheDel(creditRequestByIdKey(created.id));
  } catch (e) {
    // ignore cache errors
  }

  return created;
}

export async function listCreditRequests(filters?: { country_code?: string; status?: Database['credit_requests']['status'] }): Promise<Selectable<Database['credit_requests']>[]> {
  return creditRequestsRepository.list({ limit: 100, offset: 0, filters });
}

export async function getCreditRequestDetail(id: string) {
  const creditRequest = await creditRequestsRepository.findById(id);
  if (!creditRequest) {
    const error = new Error('Not found');
    (error as any).status = 404;
    throw error;
  }

  const history = await statusHistoryRepository.listByCreditRequestId(id);

  return { creditRequest, history };
}

export async function updateCreditRequestStatus(id: string, newStatus: Database['credit_requests']['status'], reason: string | null) {
  const creditRequest = await creditRequestsRepository.findById(id);
  if (!creditRequest) {
    const error = new Error('Not found');
    (error as any).status = 404;
    throw error;
  }

  const currentStatus = creditRequest.status;

  // transition rules
  const allowedTransitions: Record<Database['credit_requests']['status'], Database['credit_requests']['status'][] > = {
    PENDING: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'],
    UNDER_REVIEW: ['APPROVED', 'REJECTED'],
    APPROVED: [],
    REJECTED: [],
    DRAFT: [],
    SUBMITTED: []
  };

  const allowed = allowedTransitions[currentStatus as Database['credit_requests']['status']] || [];
  if (!allowed.includes(newStatus)) {
    const err = new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    (err as any).status = 400;
    throw err;
  }

  const updated = await creditRequestsRepository.updateStatus(id, newStatus, reason);
  if (!updated) {
    const error = new Error('Failed to update status');
    (error as any).status = 500;
    throw error;
  }

  // create status history
  await statusHistoryRepository.create({
    credit_request_id: id,
    previous_status: currentStatus as Database['status_history']['previous_status'],
    new_status: newStatus as Database['status_history']['new_status'],
    changed_by_user_id: SYSTEM_USER_ID,
    reason: reason ?? null
  } as unknown as Insertable<Database['status_history']>);

  // placeholder hook for future async jobs
  // e.g., enqueueNotification(updated) -- left for later

  // emit realtime event for status change
  try {
    emitEvent('credit_request.status_changed', { creditRequest: updated });
  } catch (err) {
    // ignore
  }

  // invalidate caches
  try {
    await cacheDel(creditRequestsListKey());
    await cacheDel(creditRequestByIdKey(id));
  } catch (e) {
    // ignore
  }

  return updated;
}

