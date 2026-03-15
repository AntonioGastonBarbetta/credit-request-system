import { getDb } from '../db';
import type { Database } from '../db/types';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const webhookDeliveriesRepository = {
  async create(entry: Insertable<Database['webhook_deliveries']>): Promise<Selectable<Database['webhook_deliveries']>> {
    const db = getDb();
    const created = await db.insertInto('webhook_deliveries').values(entry).returningAll().executeTakeFirst();
    if (!created) throw new Error('Failed to create webhook delivery');
    return created;
  },

  async updateStatus(id: string, status: string, responseStatusCode?: number | null, responseBody?: string | null, errorMessage?: string | null) {
    const db = getDb();
    const update: Updateable<Database['webhook_deliveries']> = {
      delivery_status: status,
      response_status_code: responseStatusCode ?? null,
      response_body: responseBody ?? null,
      error_message: errorMessage ?? null,
      updated_at: new Date().toISOString()
    } as Updateable<Database['webhook_deliveries']>;

    await db.updateTable('webhook_deliveries').set(update).where('id', '=', id).execute();
  }
};
