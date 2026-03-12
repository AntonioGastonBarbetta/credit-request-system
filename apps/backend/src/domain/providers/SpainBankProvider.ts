import { BankProvider, BankData } from './BankProvider';

export class SpainBankProvider implements BankProvider {
  async getBankData(_document: string): Promise<BankData> {
    // Mocked response
    const total_debt = Math.floor(Math.random() * 2001); // 0 - 2000
    return { bank_account_valid: true, total_debt };
  }
}
