import bcrypt from 'bcryptjs';
import { getDb } from '../db';
import { logger } from '../logger';
import type { Insertable } from 'kysely';
import type { Database } from '../db/types';

export async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'password';

  try {
    const db = await getDb();
    const existing = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
    if (existing) return;

    const hash = await bcrypt.hash(password, 10);
    const insertObj = { email, password_hash: hash } as unknown as Insertable<Database['users']>;
    await db.insertInto('users').values(insertObj).execute();
    logger.info({ email }, 'seed.user.created');
  } catch (err) {
    logger.warn({ err }, 'seed.user.error');
  }
}
