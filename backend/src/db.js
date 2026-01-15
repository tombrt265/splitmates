import pg from "pg";
import dotenv from "dotenv";

const { NODE_ENV } = process.env;
dotenv.config({
  path: NODE_ENV === "test" ? ".env.test" : ".env.development",
});

const { Pool } = pg;

const { SUPABASE_DB_URL, PGSSLMODE = "require" } = process.env;

if (!SUPABASE_DB_URL) {
  console.error("Missing SUPABASE_DB_URL");
  process.exit(1);
}

export const pool = new Pool({
  connectionString: SUPABASE_DB_URL,
  ssl: PGSSLMODE === "require" ? { rejectUnauthorized: false } : false,
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
