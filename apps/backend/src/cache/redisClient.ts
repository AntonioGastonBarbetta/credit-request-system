import { createClient } from 'redis';
import { logger } from '../logger';

const url = process.env.REDIS_URL || 'redis://localhost:6379';

let client: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (client) return client;
  client = createClient({ url });
  client.on('error', (err: unknown) => logger.warn({ err }, 'cache.error'));
  try {
    await client.connect();
  } catch (err) {
    logger.warn({ err }, 'cache.connect.error');
    client = null;
  }
  return client;
}
