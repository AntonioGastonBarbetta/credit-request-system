import { getDb } from '../db';
import type { Database } from '../db/types';
import type { Selectable, Insertable, Updateable } from 'kysely';

export const creditRequestsRepository = {
  async findById(id: string): Promise<Selectable<Database['credit_requests']> | undefined> {
    const db = getDb();
    const rec = await db.selectFrom('credit_requests').selectAll().where('id', '=', id).executeTakeFirst();
    return rec ?? undefined;
  },

  async list({ limit = 50, offset = 0, filters }: { limit?: number; offset?: number; filters?: { country_code?: string; status?: Database['credit_requests']['status'] } } = {}): Promise<Selectable<Database['credit_requests']>[]> {
    const db = getDb();
    let qb = db.selectFrom('credit_requests').selectAll();
    if (filters?.country_code) qb = qb.where('country_code', '=', filters.country_code);
    if (filters?.status) qb = qb.where('status', '=', filters.status);
    const rows = await qb.orderBy('created_at', 'desc').limit(limit).offset(offset).execute();
    return rows;
  },

  async create(payload: Insertable<Database['credit_requests']>): Promise<Selectable<Database['credit_requests']>> {
    const db = getDb();
    const created = await db.insertInto('credit_requests').values(payload).returningAll().executeTakeFirst();
    if (!created) throw new Error('Failed to create credit request');
    return created;
  },

  async updateStatus(id: string, status: string, decision_reason?: string | null): Promise<Selectable<Database['credit_requests']> | undefined> {
    const db = getDb();
    const updateData: Updateable<Database['credit_requests']> = {
      status,
      decision_reason: decision_reason ?? null,
      updated_at: new Date().toISOString()
    } as Updateable<Database['credit_requests']>;

    const updated = await db.updateTable('credit_requests').set(updateData).where('id', '=', id).returningAll().executeTakeFirst();
    return updated ?? undefined;
  }
};
