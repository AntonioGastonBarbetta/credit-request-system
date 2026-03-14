import { getDb } from '../db';
import type { Database } from '../db/types';
import type { Insertable, Selectable } from 'kysely';

export const auditLogsRepository = {
  async create(entry: Insertable<Database['audit_logs']>): Promise<Selectable<Database['audit_logs']>> {
    const db = getDb();
    const created = await db.insertInto('audit_logs').values(entry).returningAll().executeTakeFirst();
    if (!created) throw new Error('Failed to create audit log');
    return created;
  }
};
