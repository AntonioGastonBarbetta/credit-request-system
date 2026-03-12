import { SpainPolicy } from './SpainPolicy';
import { PortugalPolicy } from './PortugalPolicy';
import { SpainBankProvider } from '../providers/SpainBankProvider';
import { PortugalBankProvider } from '../providers/PortugalBankProvider';
import type { CountryPolicy } from './CountryPolicy';
import type { BankProvider } from '../providers/BankProvider';

export function resolvePolicy(countryCode: string): CountryPolicy {
  switch ((countryCode || '').toUpperCase()) {
    case 'ES':
      return new SpainPolicy();
    case 'PT':
      return new PortugalPolicy();
    default:
      throw new Error(`Unsupported country: ${countryCode}`);
  }
}

export function resolveProvider(countryCode: string): BankProvider {
  switch ((countryCode || '').toUpperCase()) {
    case 'ES':
      return new SpainBankProvider();
    case 'PT':
      return new PortugalBankProvider();
    default:
      throw new Error(`Unsupported country provider: ${countryCode}`);
  }
}
