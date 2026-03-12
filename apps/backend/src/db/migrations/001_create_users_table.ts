import { Kysely, sql } from 'kysely';

export const name = '001_create_users_table';

export async function up(db: Kysely<any>) {
  await db
    .schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`))
    .addColumn('email', 'varchar(255)', (col) => col.notNull())
    .addColumn('password_hash', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('users_pkey', ['id'])
    .execute();

  await db.schema.createIndex('users_email_unique_idx').on('users').column('email').unique().execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('users').ifExists().execute();
}
