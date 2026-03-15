import { Kysely, sql } from 'kysely';

export const name = '006_create_webhook_deliveries_table';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('webhook_deliveries')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`))
    .addColumn('credit_request_id', 'uuid', (col) => col)
    .addColumn('event_type', 'varchar(100)', (col) => col.notNull())
    .addColumn('target_url', 'varchar(2048)', (col) => col.notNull())
    .addColumn('request_payload', 'jsonb', (col) => col.notNull())
    .addColumn('response_status_code', 'integer', (col) => col)
    .addColumn('response_body', 'text', (col) => col)
    .addColumn('delivery_status', 'varchar(32)', (col) => col.notNull().defaultTo(sql`'PENDING'`))
    .addColumn('error_message', 'text', (col) => col)
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('webhook_deliveries_pkey', ['id'])
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('webhook_deliveries').ifExists().execute();
}
