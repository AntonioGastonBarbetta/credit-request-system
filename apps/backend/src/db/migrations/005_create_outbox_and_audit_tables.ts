import { Kysely, sql } from 'kysely';
import { Pool } from 'pg';

export const name = '005_create_outbox_and_audit_tables';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('outbox_events')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`))
    .addColumn('aggregate_type', 'varchar(100)', (col) => col.notNull())
    .addColumn('aggregate_id', 'uuid', (col) => col.notNull())
    .addColumn('event_type', 'varchar(100)', (col) => col.notNull())
    .addColumn('payload', 'jsonb', (col) => col.notNull())
    .addColumn('status', 'varchar(32)', (col) => col.notNull().defaultTo(sql`'PENDING'`))
    .addColumn('attempts', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('available_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('outbox_events_pkey', ['id'])
    .execute();

  await db.schema
    .createTable('audit_logs')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`))
    .addColumn('credit_request_id', 'uuid', (col) => col)
    .addColumn('event_type', 'varchar(100)', (col) => col.notNull())
    .addColumn('payload', 'jsonb', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('audit_logs_pkey', ['id'])
    .execute();

  // Create trigger function and triggers via pg pool (raw SQL)
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');

  const pool = new Pool({ connectionString: databaseUrl });
  try {
    const fn = `
    CREATE OR REPLACE FUNCTION public.outbox_trigger_function()
    RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF TG_TABLE_NAME = 'credit_requests' THEN
        INSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, status, attempts, available_at, created_at, updated_at)
        VALUES (gen_random_uuid(), 'credit_request', NEW.id, 'AUDIT_LOG_CREATED', to_jsonb(NEW), 'PENDING', 0, now(), now(), now());
        RETURN NEW;
      ELSIF TG_TABLE_NAME = 'status_history' THEN
        INSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, status, attempts, available_at, created_at, updated_at)
        VALUES (gen_random_uuid(), 'credit_request', NEW.credit_request_id, 'CREDIT_REQUEST_STATUS_CHANGED', to_jsonb(NEW), 'PENDING', 0, now(), now(), now());
        RETURN NEW;
      END IF;
      RETURN NEW;
    END;
    $$;
    `;

    await pool.query(fn);
    await pool.query(`DROP TRIGGER IF EXISTS outbox_on_credit_requests ON credit_requests;`);
    await pool.query(`CREATE TRIGGER outbox_on_credit_requests AFTER INSERT ON credit_requests FOR EACH ROW EXECUTE FUNCTION public.outbox_trigger_function();`);
    await pool.query(`DROP TRIGGER IF EXISTS outbox_on_status_history ON status_history;`);
    await pool.query(`CREATE TRIGGER outbox_on_status_history AFTER INSERT ON status_history FOR EACH ROW EXECUTE FUNCTION public.outbox_trigger_function();`);
  } finally {
    await pool.end();
  }
}

export async function down(db: Kysely<any>) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');
  const pool = new Pool({ connectionString: databaseUrl });
  try {
    await pool.query(`DROP TRIGGER IF EXISTS outbox_on_credit_requests ON credit_requests;`);
    await pool.query(`DROP TRIGGER IF EXISTS outbox_on_status_history ON status_history;`);
    await pool.query(`DROP FUNCTION IF EXISTS public.outbox_trigger_function();`);
  } finally {
    await pool.end();
  }

  await db.schema.dropTable('audit_logs').ifExists().execute();
  await db.schema.dropTable('outbox_events').ifExists().execute();
}
