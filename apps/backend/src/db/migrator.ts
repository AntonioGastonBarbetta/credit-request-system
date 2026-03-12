import { createDb, getDb } from './client';
import { Kysely, sql, Insertable } from 'kysely';
import type { Database } from './types';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

type Migration = { name: string; up: (db: Kysely<any>) => Promise<void> };

async function ensureMigrationsTable(db: Kysely<any>) {
  await db.schema
    .createTable('migrations')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('run_on', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('migrations_pkey', ['id'])
    .execute();
}

function loadMigrations(): Migration[] {
  const migrationsDir = path.resolve(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));
  const migrations: Migration[] = files
    .sort()
    .map((file) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require(path.join(migrationsDir, file));
      const migration = { name: mod.name || file, up: mod.up } as Migration;
      return migration;
    });
  return migrations;
}

export async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');

  // Ensure pgcrypto extension exists before running schema migrations
  const pool = new Pool({ connectionString: databaseUrl });
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
  } finally {
    await pool.end();
  }

  createDb();
  const db = getDb();

  await ensureMigrationsTable(db);

  const applied = await db.selectFrom('migrations').select('name').execute();
  const appliedNames = new Set(applied.map((r) => r.name));

  const migrations = loadMigrations();

  for (const m of migrations) {
    if (appliedNames.has(m.name)) continue;
    console.log(`Running migration: ${m.name}`);
    await db.transaction().execute(async (trx) => {
      await m.up(trx as unknown as Kysely<Database>);
      await trx.insertInto('migrations').values({ name: m.name } as Insertable<Database['migrations']>).execute();
    });
    console.log(`Migration applied: ${m.name}`);
  }
  console.log('All migrations applied');
}

if (require.main === module) {
  (async () => {
    try {
      await runMigrations();
      // eslint-disable-next-line no-process-exit
      process.exit(0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Migration failed', err);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
  })();
}
