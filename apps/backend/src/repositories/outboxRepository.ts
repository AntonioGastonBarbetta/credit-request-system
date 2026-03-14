import { getDb } from '../db';
import { sql } from 'kysely';
import type { Database } from '../db/types';
import type { Selectable, Updateable, Insertable } from 'kysely';

export const outboxRepository = {
  async listPending(limit = 100): Promise<Selectable<Database['outbox_events']>[]> {
    const db = getDb();
    const rows = await db
      .selectFrom('outbox_events')
      .selectAll()
      .where('status', '=', 'PENDING')
      .where('available_at', '<=', sql`now()`)
      .orderBy('created_at', 'asc')
      .limit(limit)
      .execute();
    return rows;
  },

  async markEnqueued(id: string): Promise<void> {
    const db = getDb();
    await db.updateTable('outbox_events').set({ status: 'ENQUEUED' } as unknown as Updateable<Database['outbox_events']>).where('id', '=', id).execute();
  },

  async markProcessed(id: string): Promise<void> {
    const db = getDb();
    await db.updateTable('outbox_events').set({ status: 'PROCESSED' } as unknown as Updateable<Database['outbox_events']>).where('id', '=', id).execute();
  },

  async markFailed(id: string): Promise<void> {
    const db = getDb();
    await db.updateTable('outbox_events').set({ status: 'FAILED' } as unknown as Updateable<Database['outbox_events']>).where('id', '=', id).execute();
  }
};
