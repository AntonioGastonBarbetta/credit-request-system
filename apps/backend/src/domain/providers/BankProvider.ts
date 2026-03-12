export type BankData = {
  bank_account_valid: boolean;
  total_debt: number;
  credit_score?: number | null;
};

export interface BankProvider {
  getBankData(document: string): Promise<BankData>;
}
