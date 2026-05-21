import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv(envPath) {
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      if (!line || line.startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    // ignore missing .env
  }
}

loadDotEnv(path.join(process.cwd(), '.env'));

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required (set in .env)');
}

const pool = new pg.Pool({ connectionString });

const tables = [
  { table: 'sources', maxCol: 'created_at' },
  { table: 'monitor_items', maxCol: 'published_at' },
  { table: 'ingest_runs', maxCol: 'ran_at' },
  { table: 'raw_documents', maxCol: 'retrieved_at' },
  { table: 'documents', maxCol: 'created_at' },
  { table: 'events', maxCol: 'created_at' },
  { table: 'snapshot_stats', maxCol: 'built_at' },
  { table: 'snapshot_country_stats', maxCol: 'built_at' },
  { table: 'snapshot_timeline', maxCol: 'built_at' },
  { table: 'flight_positions', maxCol: 'last_updated' },
  { table: 'ship_positions', maxCol: 'last_updated' },
  { table: 'case_timeline', maxCol: 'created_at' },
  { table: 'repatriation_flights', maxCol: 'created_at' },
  { table: 'quarantine_status', maxCol: 'created_at' },
];

async function main() {
  for (const { table, maxCol } of tables) {
    try {
      const res = await pool.query(`select count(*)::int as count, max(${maxCol}) as max_ts from ${table}`);
      const row = res.rows[0];
      process.stdout.write(`${table}\tcount=${row.count}\tmax_${maxCol}=${row.max_ts ?? 'null'}\n`);
    } catch (err) {
      process.stdout.write(`${table}\tERROR\t${String(err?.message ?? err)}\n`);
    }
  }

  process.stdout.write(`now_utc\t${new Date().toISOString()}\n`);
}

try {
  await main();
} finally {
  await pool.end().catch(() => undefined);
}
