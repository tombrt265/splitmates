import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { qOne, qAll, exec } from "./db.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// CORS: für Beta reicht eine Domain oder alles offen
const allowedOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

// -------- Helpers ----------
function generateToken(bytes = 16) {
  return crypto.randomBytes(bytes).toString("hex"); // 32 hex chars
}

// -------- Health -----------
app.get("/api/health", async (_req, res) => {
  const row = await qOne("select version() as v");
  res.json({ status: "ok", pg: row?.v, time: new Date().toISOString() });
});

// -------- Routes -----------

// POST /api/groups/:groupId/invite
app.post("/api/groups/:groupId/invite", async (req, res) => {
  const { groupId } = req.params;

  const group = await qOne("select id from groups where id = $1", [groupId]);
  if (!group) return res.status(404).json({ error: "Gruppe nicht gefunden" });

  const token = generateToken(16);
  const expiresAt = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString();

  await qOne(
    `insert into invite_tokens (token, group_id, max_uses, current_uses, expires_at)
     values ($1, $2, null, 0, $3)
     returning id`,
    [token, groupId, expiresAt]
  );

  res.json({
    invite_link: `https://splitmates.vercel.app/join?token=${token}`,
  });
});

// POST /api/groups/join
app.post("/api/groups/join", async (req, res) => {
  const { token, auth0_sub } = req.body;
  if (!token || !auth0_sub)
    return res.status(400).json({ error: "token und auth0_sub erforderlich" });

  const invite = await qOne(`select * from invite_tokens where token = $1`, [
    token,
  ]);
  if (!invite) return res.status(404).json({ error: "Ungültiger Token" });

  if (invite.expires_at && new Date(invite.expires_at) < new Date())
    return res.status(400).json({ error: "Token abgelaufen" });

  // upsert user by auth0_sub (simplified)
  let user = await qOne("select id from users where auth0_sub = $1", [
    auth0_sub,
  ]);
  if (!user) {
    user = await qOne(
      `insert into users (auth0_sub, name, username, email)
       values ($1, $2, $3, $4)
       returning id`,
      [auth0_sub, "Neuer User", null, null]
    );
  }

  // Mitglied hinzufügen, bei Konflikt ignorieren (unique (group_id, user_id))
  await qOne(
    `insert into group_members (group_id, user_id, role, is_active)
     values ($1, $2, 'member', true)
     on conflict (group_id, user_id) do nothing
     returning id`,
    [invite.group_id, user.id]
  );

  await exec(
    `update invite_tokens set current_uses = current_uses + 1 where token = $1`,
    [token]
  );

  res.json({
    message: "Erfolgreich der Gruppe beigetreten",
    group_id: invite.group_id,
  });
});

// GET /api/groups?user_id=<auth0_sub>
app.get("/api/groups", async (req, res) => {
  const { user_id } = req.query; // = auth0_sub
  if (!user_id)
    return res
      .status(400)
      .json({ error: "user_id query parameter is required" });

  const user = await qOne("select id from users where auth0_sub = $1", [
    user_id,
  ]);
  if (!user) return res.json([]);

  const groups = await qAll(
    `select g.*
     from groups g
     join group_members gm on gm.group_id = g.id
     where gm.user_id = $1
     order by g.created_at desc`,
    [user.id]
  );

  res.json(groups);
});

// POST /api/groups
app.post("/api/groups", async (req, res) => {
  const { name, category, avatar_url, auth0_sub } = req.body;

  if (!name || !auth0_sub || !category || !avatar_url) {
    return res.status(400).json({
      error: "Name, auth0_sub, category und avatar_url sind erforderlich",
    });
  }

  try {
    let user = await qOne("select id from users where auth0_sub = $1", [
      auth0_sub,
    ]);
    if (!user) {
      user = await qOne(
        `insert into users (auth0_sub, name, username, email)
         values ($1, $2, $3, $4)
         returning id`,
        [auth0_sub, "Neuer User", null, null]
      );
    }

    const group = await qOne(
      `insert into groups (name, owner_id, avatar_url, category, is_active)
       values ($1, $2, $3, $4, true)
       returning id, name, category, avatar_url, owner_id`,
      [name, user.id, avatar_url, category]
    );

    await exec(
      `insert into group_members (group_id, user_id, role, is_active)
       values ($1, $2, 'owner', true)`,
      [group.id, user.id]
    );

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Erstellen der Gruppe" });
  }
});

// GET /api/groups/:groupId/overview
app.get("/api/groups/:groupId/overview", async (req, res) => {
  const { groupId } = req.params;

  const group = await qOne("select * from groups where id = $1", [groupId]);
  if (!group) return res.status(404).json({ error: "Gruppe nicht gefunden" });

  const members = await qAll(
    `select u.id, u.name, u.username, u.email
     from group_members gm
     join users u on u.id = gm.user_id
     where gm.group_id = $1`,
    [groupId]
  );

  const expenses = await qAll(
    `select e.id, e.description, e.amount_cents, e.currency, e.created_at, u.name as "paidBy"
     from expenses e
     join users u on u.id = e.payer_id
     where e.group_id = $1
     order by e.created_at desc
     limit 10`,
    [groupId]
  );

  res.json({
    id: group.id,
    name: group.name,
    category: group.category,
    avatar_url: group.avatar_url,
    created_at: group.created_at,
    members,
    expenses,
  });
});

// Root
app.get("/", (_req, res) => {
  res.send(
    "Splitmates backend (Supabase Postgres) is running. See /api/health."
  );
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`Server listening on :${port}`);
});
