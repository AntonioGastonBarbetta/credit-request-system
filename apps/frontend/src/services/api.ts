const BASE = (import.meta.env.VITE_API_URL as string) || '';
import { getAuthToken } from './auth';

type ApiListResponse<T> = { data: T };

export interface CreditRequest {
  id: string;
  applicant_name: string;
  status: string;
}

async function request<T = unknown>(path: string, opts: RequestInit = {}): Promise<T> {
  // eslint-disable-next-line no-console
  console.debug('[api] request.start', path);
  const token = getAuthToken();
  const incomingHeaders = (opts.headers || {}) as Record<string, string>;
  const headers: Record<string, string> = {
    ...incomingHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  // eslint-disable-next-line no-console
  console.debug('[api] request.ok', path);
  return json as T;
}

export const api = {
  auth: {
    login: async (payload: { email: string; password: string }) => request<{ token: string; user: { id: string; email: string } }>('/api/auth/login', { method: 'POST', body: JSON.stringify(payload), headers: { 'content-type': 'application/json' } })
  },
  creditRequests: {
    list: async () => request<ApiListResponse<CreditRequest[]>>('/api/credit-requests'),
    get: async (id: string) => request<{ creditRequest: CreditRequest; history?: unknown[] }>(`/api/credit-requests/${id}`),
    create: async (payload: unknown) => request<CreditRequest>('/api/credit-requests', { method: 'POST', body: JSON.stringify(payload), headers: { 'content-type': 'application/json' } })
  }
};
