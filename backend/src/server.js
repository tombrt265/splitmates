import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";

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

function generateToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

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

// POST /api/groups/:groupId/invite
// Creates an invite token for the group
app.post("/api/groups/:groupId/invite", (req, res) => {
  const db = getDb();
  const { groupId } = req.params;

  // Prüfen ob Gruppe existiert
  const group = db.prepare("select * from groups where id = ?").get(groupId);
  if (!group) return res.status(404).json({ error: "Gruppe nicht gefunden" });

  // Token erzeugen
  const token = generateToken(16);

  // Ablaufdatum = jetzt + 2 Tage
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 2);
  const expiresAtISO = expiresAt.toISOString();

  // In DB speichern, max_uses = null → unlimitiert
  db.prepare(
    `
    insert into invite_tokens (token, group_id, max_uses, current_uses, expires_at)
    values (?, ?, null, 0, ?)
  `
  ).run(token, groupId, expiresAtISO);

  res.json({ invite_link: `https://meinewebseite.de/join?token=${token}` });
});

// POST /api/groups/join
// Joins the user to the group associated with the invite token
app.post("/api/groups/join", (req, res) => {
  const db = getDb();
  const { token, auth0_sub } = req.body;

  if (!token || !auth0_sub)
    return res.status(400).json({ error: "token und auth0_sub erforderlich" });

  const invite = db
    .prepare(`select * from invite_tokens where token = ?`)
    .get(token);
  if (!invite) return res.status(404).json({ error: "Ungültiger Token" });

  // Prüfen Ablaufdatum
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return res.status(400).json({ error: "Token abgelaufen" });
  }

  // Nutzer existiert ggf. erstellen
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

  // Nutzer zur Gruppe hinzufügen
  db.prepare(
    `
    insert or ignore into group_members (group_id, user_id, role, is_active)
    values (?, ?, 'member', 1)
  `
  ).run(invite.group_id, user.id);

  // Token Verwendung hochzählen (optional)
  db.prepare(
    `update invite_tokens set current_uses = current_uses + 1 where token = ?`
  ).run(token);

  res.json({
    message: "Erfolgreich der Gruppe beigetreten",
    group_id: invite.group_id,
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
