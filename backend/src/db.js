import pg from "pg";

const { Pool } = pg;

const {
  SUPABASE_DB_URL, // postgres://USER:PASSWORD@HOST:6543/postgres
  PGSSLMODE = "require",
  PG_POOL_MAX,
  PG_CONNECTION_TIMEOUT_MS,
  PG_IDLE_TIMEOUT_MS
} = process.env;

if (!SUPABASE_DB_URL) {
  console.error("Missing SUPABASE_DB_URL");
  process.exit(1);
}

const parsedNumber = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const pool = new Pool({
  connectionString: SUPABASE_DB_URL,
  ssl: PGSSLMODE === "require" ? { rejectUnauthorized: false } : false,
  max: parsedNumber(PG_POOL_MAX, 5),
  connectionTimeoutMillis: parsedNumber(PG_CONNECTION_TIMEOUT_MS, 5000),
  idleTimeoutMillis: parsedNumber(PG_IDLE_TIMEOUT_MS, 10000)
});

export async function qOne(text, params = []) {
  const { rows } = await pool.query(text, params);
  return rows[0] || null;
}
export async function qAll(text, params = []) {
  const { rows } = await pool.query(text, params);
  return rows;
}
export async function exec(text, params = []) {
  const res = await pool.query(text, params);
  return res.rowCount;
}
