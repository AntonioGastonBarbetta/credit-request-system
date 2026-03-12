import { getDb } from '../db';
import type { Database } from '../db/types';
import type { Selectable, Insertable } from 'kysely';

export const usersRepository = {
  async findByEmail(email: string): Promise<Selectable<Database['users']> | undefined> {
    const db = getDb();
    const user = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
    return user ?? undefined;
  },

  async create(payload: Insertable<Database['users']>): Promise<Selectable<Database['users']>> {
    const db = getDb();
    const created = await db.insertInto('users').values(payload).returningAll().executeTakeFirst();
    if (!created) throw new Error('Failed to create user');
    return created;
  }
};
