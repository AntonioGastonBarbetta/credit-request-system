// Top-level providers: place generic or cross-cutting providers here (logging, metrics, feature-flags).
// Country-specific bank providers belong under `modules/countries/providers`.
export interface GenericProvider {
  id: string;
  name: string;
}

export const providers: Record<string, GenericProvider> = {
  example: { id: 'example', name: 'Example Generic Provider (placeholder)' }
};
