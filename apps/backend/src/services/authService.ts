export type Credentials = { username: string; password: string };

export async function login(credentials: Credentials) {
  // Placeholder: return standardized shape for future JWT/session implementation
  return {
    message: 'Not implemented - placeholder',
    credentials
  } as const;
}

export async function logout(_token: string | null) {
  // Placeholder: revoke token or session
  return { message: 'Logged out (placeholder)' } as const;
}
