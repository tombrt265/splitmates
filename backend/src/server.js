import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { qOne, qAll, exec } from "./db.js";

dotenv.config();

const app = express();

// CORS: für Beta reicht eine Domain oder alles offen
const allowedOrigin = process.env.CORS_ORIGIN || "*";
app.use(
  cors({ origin: ["http://localhost:5173", allowedOrigin], credentials: true })
);
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

// POST /api/users/signup
app.post("/api/users/signup", async (req, res) => {
  const { username, email, auth0_sub, picture } = req.body;

  if (!username || !email) {
    return res
      .status(400)
      .json({ error: "Username und Email sind erforderlich" });
  }

  try {
    let user = await qOne(
      "select * from users where username = $1 or email = $2",
      [username, email]
    );

    if (user) {
      return res
        .status(409)
        .json({ error: "Username oder Email bereits vergeben" });
    }

    const avatarUrl = picture;

    user = await qOne(
      `insert into users (username, email, auth0_sub, avatar_url)
       values ($1, $2, $3, $4)
       returning id, username, email, auth0_sub, avatar_url, created_at`,
      [username, email, auth0_sub || null, avatarUrl]
    );

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Erstellen des Users" });
  }
});

// POST /api/groups/:groupId/invite
app.post("/api/groups/:groupId/invite", async (req, res) => {
  const { groupId } = req.params;

  const group = await qOne("select id from groups where id = $1", [groupId]);
  if (!group) return res.status(404).json({ error: "Gruppe nicht gefunden" });

  const existingToken = await qOne(
    `select token from invite_tokens
     where group_id = $1 and (expires_at is null or expires_at > now())`,
    [groupId]
  );

  if (existingToken) {
    return res.json({
      invite_link: `https://splitmates.vercel.app/join?token=${existingToken.token}`,
    });
  }

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

  const user = await qOne("select id from users where auth0_sub = $1", [
    auth0_sub,
  ]);
  if (!user) {
    return res
      .status(404)
      .json({ error: "User existiert nicht. Bitte vorher anmelden." });
  }

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
    const user = await qOne("select id from users where auth0_sub = $1", [
      auth0_sub,
    ]);
    if (!user) {
      return res
        .status(404)
        .json({ error: "User existiert nicht. Bitte vorher anmelden." });
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

// DELETE /api/groups/:groupId
app.delete("/api/groups/:groupId", async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ error: "groupId ist erforderlich" });
  }

  try {
    const group = await qOne("SELECT id FROM groups WHERE id = $1", [groupId]);
    if (!group) {
      return res.status(404).json({ error: "Gruppe nicht gefunden" });
    }

    await exec("DELETE FROM group_members WHERE group_id = $1", [groupId]);

    await exec(
      "DELETE FROM expense_debtors WHERE expense_id IN (SELECT id FROM expenses WHERE group_id = $1)",
      [groupId]
    );
    await exec("DELETE FROM expenses WHERE group_id = $1", [groupId]);

    await exec("DELETE FROM groups WHERE id = $1", [groupId]);

    res.json({ message: "Gruppe erfolgreich gelöscht" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Löschen der Gruppe" });
  }
});

// GET /api/groups/:groupId/overview
app.get("/api/groups/:groupId/overview", async (req, res) => {
  const { groupId } = req.params;

  const group = await qOne("select * from groups where id = $1", [groupId]);
  if (!group) return res.status(404).json({ error: "Gruppe nicht gefunden" });

  const members = await qAll(
    `select u.id, u.username, u.avatar_url
     from group_members gm
     join users u on u.id = gm.user_id
     where gm.group_id = $1`,
    [groupId]
  );

  const mappedMembers = members.map((m) => ({
    name: m.username || "Unbekannt",
    avatarUrl: m.avatar_url,
    userID: m.id.toString(),
  }));

  const expenses = await qAll(
    `select e.id, e.description, e.amount_cents, e.currency, e.created_at,
            payer.id as payer_id, payer.username as payer_name
     from expenses e
     join users payer on payer.id = e.payer_id
     where e.group_id = $1
     order by e.created_at desc
     limit 10`,
    [groupId]
  );

  const mappedExpenses = await Promise.all(
    expenses.map(async (e) => {
      const debtors = await qAll(
        `select ed.debtor_id, u.username, u.avatar_url
         from expense_debtors ed
         join users u on u.id = ed.debtor_id
         where ed.expense_id = $1`,
        [e.id]
      );

      return {
        id: e.id,
        description: e.description,
        amount_cents: e.amount_cents,
        paidBy: e.payer_name,
        created_at: e.created_at,
        debtors: debtors.map((d) => ({
          name: d.username || "Unbekannt",
          avatarUrl: d.avatar_url,
          userID: d.debtor_id.toString(),
        })),
      };
    })
  );

  res.json({
    id: group.id.toString(),
    name: group.name,
    category: group.category,
    avatarUrl: group.avatar_url,
    created_at: group.created_at,
    members: mappedMembers,
    expenses: mappedExpenses,
  });
});

// POST /api/groups/:groupId/expenses
app.post("/api/groups/:groupId/expenses", async (req, res) => {
  const { groupId } = req.params;
  const { payerId, amount, currency, category, description, debtors } =
    req.body;

  if (
    !payerId ||
    !amount ||
    !currency ||
    !category ||
    !description ||
    !Array.isArray(debtors)
  ) {
    return res.status(400).json({ error: "Fehlende Felder im Request" });
  }

  const group = await qOne("select id from groups where id = $1", [groupId]);
  if (!group) return res.status(404).json({ error: "Gruppe nicht gefunden" });

  try {
    const expense = await qOne(
      `insert into expenses (group_id, payer_id, amount_cents, currency, category, description)
       values ($1, $2, $3, $4, $5, $6)
       returning id, group_id, payer_id, amount_cents, currency, category, description, created_at`,
      [
        groupId,
        payerId,
        Math.round(amount * 100),
        currency,
        category,
        description,
      ]
    );

    // Fair split: include payer in participant count (payer + selected participants)
    // and distribute any remainder cents across debtors first.
    const amountCents = Math.round(amount * 100);
    const participantCount = debtors.length + 1; // including payer
    const baseShare = Math.ceil(amountCents / participantCount);

    for (let i = 0; i < debtors.length; i++) {
      const debtorId = debtors[i];

      await exec(
        `insert into expense_debtors (expense_id, debtor_id, share_cents)
         values ($1, $2, $3)`,
        [expense.id, debtorId, baseShare]
      );
    }

    res.status(201).json({ ...expense, debtors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Erstellen der Ausgabe" });
  }
});

// GET /api/groups/:groupId/balances/:userId
app.get("/api/groups/:groupId/balances/:userId", async (req, res) => {
  const { groupId, userId } = req.params;

  const group = await qOne("select id from groups where id = $1", [groupId]);
  if (!group) return res.status(404).json({ error: "Gruppe nicht gefunden" });

  const members = await qAll(
    `select u.id, u.username as name
     from group_members gm
     join users u on u.id = gm.user_id
    where gm.group_id = $1`,
    [groupId]
  );

  const balances = {};
  members.forEach((m) => (balances[m.id] = 0));

  // Compute how much each payer should receive from others:
  // sum of debtor shares on their expenses (not the full amount paid).
  const credits = await qAll(
    `select e.payer_id, sum(ed.share_cents) as credit
       from expenses e
       join expense_debtors ed on ed.expense_id = e.id
      where e.group_id = $1
      group by e.payer_id`,
    [groupId]
  );
  credits.forEach((p) => (balances[p.payer_id] += Number(p.credit)));

  const owed = await qAll(
    `select debtor_id, sum(share_cents) as owed
       from expense_debtors ed
       join expenses e on e.id = ed.expense_id
      where e.group_id = $1
      group by debtor_id`,
    [groupId]
  );
  owed.forEach((o) => (balances[o.debtor_id] -= Number(o.owed)));

  const creditors = [];
  const debtors = [];

  for (const [id, balance] of Object.entries(balances)) {
    if (balance > 0) creditors.push({ id, balance });
    else if (balance < 0) debtors.push({ id, balance });
  }

  const settlements = [];
  let i = 0,
    j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    const amount = Math.min(creditor.balance, -debtor.balance);

    settlements.push({
      from: debtor.id,
      to: creditor.id,
      amount_cents: amount,
    });

    creditor.balance -= amount;
    debtor.balance += amount;

    if (creditor.balance === 0) i++;
    if (debtor.balance === 0) j++;
  }

  const userSettlements = settlements
    .filter((s) => s.from === userId || s.to === userId)
    .map((s) => ({
      direction: s.from === userId ? "outgoing" : "incoming",
      counterparty:
        members.find((m) => m.id === (s.from === userId ? s.to : s.from))
          ?.name || "Unbekannt",
      amount: (s.amount_cents / 100).toFixed(2),
      currency: "EUR",
    }));

  res.json({
    userId,
    balances: userSettlements,
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
