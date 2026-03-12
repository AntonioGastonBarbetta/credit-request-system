import { CreditRequestStatus } from '@credit-request-system/shared';

export type DecisionResult = {
  initialStatus: CreditRequestStatus;
  reviewRequired: boolean;
  decisionReason?: string | null;
};

export interface CountryPolicy {
  validateDocument(document: string): boolean;
  evaluateRequest(input: { requested_amount: number; monthly_income: number; document: string }): DecisionResult;
  getRequiredDocumentType(): string;
}
