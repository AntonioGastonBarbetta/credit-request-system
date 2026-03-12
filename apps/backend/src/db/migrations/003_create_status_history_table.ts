import { Kysely, sql } from 'kysely';

export const name = '003_create_status_history_table';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('status_history')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`))
    .addColumn('credit_request_id', 'uuid', (col) => col.notNull())
    .addColumn('previous_status', 'varchar(32)', (col) => col)
    .addColumn('new_status', 'varchar(32)', (col) => col.notNull())
    .addColumn('changed_by_user_id', 'uuid', (col) => col)
    .addColumn('reason', 'text', (col) => col)
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('status_history_pkey', ['id'])
    .execute();

  await db.schema.createIndex('status_history_credit_request_idx').on('status_history').column('credit_request_id').execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('status_history').ifExists().execute();
}
