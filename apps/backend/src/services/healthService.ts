export async function checkHealth() {
  return {
    status: 'ok',
    environment: process.env.NODE_ENV || 'development'
  } as const;
}
