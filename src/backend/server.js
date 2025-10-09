import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import "./sqlite/db.js";

const app = express();

// Basic CORS allowing Vite dev server by default
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.json());

// ##################
//     API Routes
// ##################

// Health check
import { getDb, queryScalar } from "./sqlite/db.js";
app.get("/api/health", (_req, res) => {
  const db = getDb();
  const sqliteVersion = queryScalar("select sqlite_version() as v");
  res.json({
    status: "ok",
    sqlite: sqliteVersion,
    time: new Date().toISOString(),
  });
});

// GET /api/groups?user_id=<user_id>
// Returns all groups where the user is a member
app.get("/api/groups", (req, res) => {
  const db = getDb();
  const { user_id } = req.query;

  if (!user_id) {
    return res
      .status(400)
      .json({ error: "user_id query parameter is required" });
  }

  const user = db
    .prepare("select id from users where auth0_sub = ?")
    .get(user_id);
  if (!user) return res.json([]);

  const stmt = db.prepare(`
    select g.*
    from groups g
    join group_members gm on gm.group_id = g.id
    where gm.user_id = ?
    order by g.created_at desc
  `);

  const groups = stmt.all(user.id);
  res.json(groups);
});

// POST /api/groups
// Creates a new group
app.post("/api/groups", (req, res) => {
  const db = getDb();
  const { name, category, avatar_url, auth0_sub } = req.body;

  if (!name || !auth0_sub || !category || !avatar_url) {
    return res.status(400).json({
      error: "Name, auth0_sub, category und avatar_url sind erforderlich",
    });
  }

  try {
    let user = db
      .prepare("select id from users where auth0_sub = ?")
      .get(auth0_sub);

    if (!user) {
      const result = db
        .prepare(
          "insert into users (auth0_sub, name, username, email) values (?, ?, ?, ?)"
        )
        .run(auth0_sub, "Neuer User", null, null);
      user = { id: result.lastInsertRowid };
    }

    const stmt = db.prepare(`
      insert into groups (name, owner_id, avatar_url, category, is_active)
      values (?, ?, ?, ?, 1)
    `);

    const info = stmt.run(name, user.id, avatar_url, category);
    const groupId = info.lastInsertRowid;

    db.prepare(
      `
      insert into group_members (group_id, user_id, role, is_active)
      values (?, ?, 'owner', 1)
    `
    ).run(groupId, user.id);

    res.status(201).json({
      id: groupId,
      name,
      category,
      avatar_url,
      owner_id: user.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Erstellen der Gruppe" });
  }
});

// Placeholder root
app.get("/", (_req, res) => {
  res.send("Splitmates backend is running. See /api/health.");
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
