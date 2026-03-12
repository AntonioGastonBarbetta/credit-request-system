import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './types';

let db: Kysely<Database> | null = null;

export function createDb() {
  if (db) return db;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString: databaseUrl });

  db = new Kysely<Database>({ dialect: new PostgresDialect({ pool }) });
  return db;
}

export function getDb() {
  if (!db) return createDb();
  return db;
}
