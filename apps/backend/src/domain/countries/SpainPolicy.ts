import { CountryPolicy, DecisionResult } from './CountryPolicy';
import { CreditRequestStatus } from '@credit-request-system/shared';

export class SpainPolicy implements CountryPolicy {
  validateDocument(document: string): boolean {
    // DNI: 8 digits followed by a letter
    return /^[0-9]{8}[A-Za-z]$/.test(document);
  }

  evaluateRequest(input: { requested_amount: number; monthly_income: number; document: string }): DecisionResult {
    const { requested_amount } = input;
    if (requested_amount > 5000) {
      return { initialStatus: CreditRequestStatus.UNDER_REVIEW, reviewRequired: true, decisionReason: 'Requested amount exceeds 5000 EUR' };
    }
    return { initialStatus: CreditRequestStatus.PENDING, reviewRequired: false, decisionReason: null };
  }

  getRequiredDocumentType(): string {
    return 'DNI';
  }
}
