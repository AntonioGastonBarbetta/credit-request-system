import { CountryPolicy, DecisionResult } from './CountryPolicy';
import { CreditRequestStatus } from '@credit-request-system/shared';

export class PortugalPolicy implements CountryPolicy {
  validateDocument(document: string): boolean {
    // NIF: exactly 9 digits
    return /^[0-9]{9}$/.test(document);
  }

  evaluateRequest(input: { requested_amount: number; monthly_income: number; document: string }): DecisionResult {
    const { requested_amount, monthly_income } = input;
    if (monthly_income <= 0) {
      return { initialStatus: CreditRequestStatus.UNDER_REVIEW, reviewRequired: true, decisionReason: 'Invalid monthly income' };
    }
    if (requested_amount > monthly_income * 5) {
      return { initialStatus: CreditRequestStatus.UNDER_REVIEW, reviewRequired: true, decisionReason: 'Requested amount exceeds allowed ratio (5x monthly income)' };
    }
    return { initialStatus: CreditRequestStatus.PENDING, reviewRequired: false, decisionReason: null };
  }

  getRequiredDocumentType(): string {
    return 'NIF';
  }
}
