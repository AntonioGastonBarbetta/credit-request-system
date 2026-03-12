export * from './types';
export * as policies from './policies';
export * as providers from './providers';

// countries index acts as the extension point for country-specific logic
// Country-specific rule registration placeholder
export const countries = {
  ES: { code: 'ES', name: 'Spain' },
  PT: { code: 'PT', name: 'Portugal' }
};

export type CountryCode = keyof typeof countries;
