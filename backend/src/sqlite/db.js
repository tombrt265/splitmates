import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve database file path
const projectRoot = path.resolve(__dirname, "../../..");
const dataDir = process.env.DATABASE_DIR || path.join(projectRoot, "data");
const dbFile = process.env.DATABASE_FILE || path.join(dataDir, "app.db");

// Singleton DB instance
let db;

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function openDb() {
  ensureDataDir();
  const instance = new Database(dbFile);
  instance.pragma("foreign_keys = ON");
  return instance;
}

function initSchema(instance) {
  const ddl = `
    create table if not exists users (
      id integer primary key autoincrement,
      auth0_sub text unique,
      name text,
      username text unique,
      email text unique,
      paypal text,
      is_active integer not null default 1,
      created_at text not null default (datetime('now'))
    );

    create table if not exists groups (
      id integer primary key autoincrement,
      name text not null,
      owner_id integer not null references users(id) on delete restrict,
      is_active integer not null default 1,
      avatar_url text,
      category text,
      created_at text not null default (datetime('now'))
    );

    create table if not exists group_members (
      id integer primary key autoincrement,
      group_id integer not null references groups(id) on delete cascade,
      user_id integer not null references users(id) on delete cascade,
      role text not null default 'member',
      is_active integer not null default 1,
      unique (group_id, user_id)
    );

    create table if not exists expenses (
      id integer primary key autoincrement,
      group_id integer not null references groups(id) on delete cascade,
      payer_id integer not null references users(id) on delete restrict,
      amount_cents integer not null,
      currency text not null default 'EUR',
      description text,
      category text,
      expense_date text not null default (date('now')),
      created_at text not null default (datetime('now'))
    );

    create table if not exists expense_splits (
      id integer primary key autoincrement,
      expense_id integer not null references expenses(id) on delete cascade,
      user_id integer not null references users(id) on delete cascade,
      share_cents integer not null,
      unique (expense_id, user_id)
    );

    create table if not exists invite_tokens (
      id integer primary key autoincrement,
      token text not null unique,
      group_id integer not null references groups(id) on delete cascade,
      max_uses integer,
      current_uses integer not null default 0,
      expires_at text not null,
      created_at text not null default (datetime('now'))
    );

    create index if not exists idx_groups_owner on groups(owner_id);
    create index if not exists idx_members_user on group_members(user_id);
    create index if not exists idx_expenses_group on expenses(group_id);
  `;

  instance.exec(ddl);
}

export function getDb() {
  if (!db) {
    db = openDb();
    initSchema(db);
  }
  return db;
}

export function queryScalar(sql, params = []) {
  const row = getDb().prepare(sql).get(params);
  if (!row) return null;
  const key = Object.keys(row)[0];
  return row[key];
}

// Initialize on import so server startup prepares DB
getDb();

export const paths = { dataDir, dbFile };
