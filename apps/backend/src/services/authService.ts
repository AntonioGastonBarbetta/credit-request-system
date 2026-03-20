import type { Credentials } from './authService.types';
import { getDb } from '../db';
import type { Database } from '../db/types';
import bcrypt from 'bcryptjs';
import { signToken } from '../security/jwt';
import { logger } from '../logger';

export async function login(credentials: Credentials) {
  const db = await getDb();
  const { email, password } = credentials;
  const row = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
  if (!row) {
    logger.info({ email }, 'auth.login.failure');
    const error = new Error('Invalid credentials') as Error & { status?: number };
    error.status = 401;
    throw error;
  }

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) {
    logger.info({ email }, 'auth.login.failure');
    const error = new Error('Invalid credentials') as Error & { status?: number };
    error.status = 401;
    throw error;
  }

  const token = signToken({ sub: row.id, email: row.email });
  logger.info({ userId: row.id }, 'auth.login.success');
  return { token, user: { id: row.id, email: row.email } };
}

export async function logout(_token: string | null) {
  // stateless JWT: no server-side revoke in this simple implementation
  return { message: 'Logged out' };
}
// types are declared in authService.types.ts
