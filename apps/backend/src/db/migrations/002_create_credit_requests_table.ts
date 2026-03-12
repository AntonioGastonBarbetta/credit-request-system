import { Kysely, sql } from 'kysely';

export const name = '002_create_credit_requests_table';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('credit_requests')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`))
    .addColumn('country_code', 'varchar(4)', (col) => col.notNull())
    .addColumn('applicant_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('document_number', 'varchar(100)', (col) => col.notNull())
    .addColumn('monthly_income', 'numeric', (col) => col.notNull())
    .addColumn('requested_amount', 'numeric', (col) => col.notNull())
    .addColumn('currency', 'varchar(10)', (col) => col.notNull())
    .addColumn('status', 'varchar(32)', (col) => col.notNull())
    .addColumn('decision_reason', 'text', (col) => col)
    .addColumn('created_by_user_id', 'uuid', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('credit_requests_pkey', ['id'])
    .execute();

  await db.schema.createIndex('credit_requests_country_idx').on('credit_requests').column('country_code').execute();
  await db.schema.createIndex('credit_requests_status_idx').on('credit_requests').column('status').execute();
  await db.schema.createIndex('credit_requests_created_at_idx').on('credit_requests').column('created_at').execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('credit_requests').ifExists().execute();
}
