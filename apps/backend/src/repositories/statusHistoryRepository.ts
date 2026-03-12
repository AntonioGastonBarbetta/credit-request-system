import { getDb } from '../db';
import type { Database } from '../db/types';
import type { Selectable, Insertable } from 'kysely';

export const statusHistoryRepository = {
  async create(entry: Insertable<Database['status_history']>): Promise<Selectable<Database['status_history']>> {
    const db = getDb();
    const created = await db.insertInto('status_history').values(entry).returningAll().executeTakeFirst();
    if (!created) throw new Error('Failed to create status history');
    return created;
  },

  async listByCreditRequestId(creditRequestId: string): Promise<Selectable<Database['status_history']>[]> {
    const db = getDb();
    const rows = await db.selectFrom('status_history').selectAll().where('credit_request_id', '=', creditRequestId).orderBy('created_at', 'asc').execute();
    return rows;
  }
};
