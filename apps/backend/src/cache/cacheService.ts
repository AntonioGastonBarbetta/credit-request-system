import { getRedisClient } from './redisClient';
import { logger } from '../logger';

const DEFAULT_TTL = Number(process.env.CACHE_TTL_SECONDS || '45');

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = await getRedisClient();
  if (!client) return null;
  try {
    const raw = await client.get(key);
    if (!raw) {
      logger.info({ key }, 'cache.miss');
      return null;
    }
    logger.info({ key }, 'cache.hit');
    return JSON.parse(raw) as T;
  } catch (err) {
    logger.warn({ err, key }, 'cache.error');
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number = DEFAULT_TTL) {
  const client = await getRedisClient();
  if (!client) return;
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
    logger.info({ key, ttlSeconds }, 'cache.set');
  } catch (err) {
    logger.warn({ err, key }, 'cache.error');
  }
}

export async function cacheDel(key: string) {
  const client = await getRedisClient();
  if (!client) return;
  try {
    await client.del(key);
    logger.info({ key }, 'cache.invalidate');
  } catch (err) {
    logger.warn({ err, key }, 'cache.error');
  }
}
