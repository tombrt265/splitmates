import pg from "pg";

const { Pool } = pg;

const {
  SUPABASE_DB_URL, // postgres://USER:PASSWORD@HOST:6543/postgres
  PGSSLMODE = "require"
} = process.env;

if (!SUPABASE_DB_URL) {
  console.error("Missing SUPABASE_DB_URL");
  process.exit(1);
}

export const pool = new Pool({
  connectionString: SUPABASE_DB_URL,
  ssl: PGSSLMODE === "require" ? { rejectUnauthorized: false } : false
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