import { Kysely } from 'kysely';

export const name = '004_add_bank_fields_to_credit_requests_table';

export async function up(db: Kysely<any>) {
  await db.schema.alterTable('credit_requests').addColumn('bank_account_valid', 'boolean', (col) => col.notNull().defaultTo(false)).execute();
  await db.schema.alterTable('credit_requests').addColumn('total_debt', 'numeric', (col) => col.notNull().defaultTo(0)).execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('credit_requests').dropColumn('bank_account_valid').execute();
  await db.schema.alterTable('credit_requests').dropColumn('total_debt').execute();
}
