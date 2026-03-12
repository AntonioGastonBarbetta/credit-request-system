import { BankProvider, BankData } from './BankProvider';

export class PortugalBankProvider implements BankProvider {
  async getBankData(_document: string): Promise<BankData> {
    const total_debt = Math.floor(Math.random() * 3001); // 0 - 3000
    return { bank_account_valid: true, total_debt };
  }
}
