import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { qOne, qAll, exec } from "./db.js";

dotenv.config();

export const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || "*";
app.use(
  cors({ origin: ["http://localhost:5173", allowedOrigin], credentials: true }),
);
app.use(express.json());

// -------- Helpers ----------
function generateToken(bytes = 16) {
  return crypto.randomBytes(bytes).toString("hex");
}

// -------- Health -----------
app.get("/api/health", async (_req, res) => {
  const row = await qOne("select version() as v");
  res.json({ status: "ok", pg: row?.v, time: new Date().toISOString() });
});

// -------- Routes -----------

app.post("/api/users", async (req, res) => {
  const { username, email, picture } = req.body;
  const auth0_sub = req.headers["x-auth0-sub"];

  /** Authentification */
  if (!auth0_sub) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "user is unauthorized",
      },
    });
  }

  /** Input Validation */
  if (!username || !email) {
    const missingFields = [];
    if (!username) missingFields.push("username");
    if (!email) missingFields.push("email");

    return res.status(400).json({
      error: {
        code: "MISSING_FIELDS",
        message: "username and email are required",
        details: { missing: missingFields },
      },
    });
  }

  try {
    /** Check Duplicates */
    const user = await qOne(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email],
    );

    if (user) {
      return res.status(409).json({
        error: {
          code: "USER_ALREADY_EXISTS",
          message: "Username oder Email bereits vergeben",
          details: {
            usernameTaken: user.username === username,
            emailTaken: user.email === email,
          },
        },
      });
    }

    /** Insert User */
    const newUser = await qOne(
      `INSERT INTO users (username, email, auth0_sub, avatar_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, paypal, avatar_url`,
      [username, email, auth0_sub, picture],
    );

    return res.status(201).json({ data: newUser });
  } catch (err) {
    console.error("Signup error:", err);

    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "error when creating user",
      },
    });
  }
});

app.post("/api/groups/:groupId/invite", async (req, res) => {
  const { groupId } = req.params;

  /** Verification */
  const group = await qOne("SELECT id FROM groups WHERE id = $1", [groupId]);
  if (!group) {
    return res.status(404).json({
      error: {
        code: "GROUP_NOT_FOUND",
        message: "the requested group does not exist",
      },
    });
  }
  try {
    /** Searching for valid token */
    const existingToken = await qOne(
      `SELECT token FROM invite_tokens
     WHERE group_id = $1 AND (expires_at is null or expires_at > now())`,
      [groupId],
    );

    if (existingToken) {
      return res.json({
        data: {
          invite_link: `https://splitmates.vercel.app/join?token=${existingToken.token}`,
        },
      });
    }

    /** Creating new token */
    const token = generateToken(16);
    const expiresAt = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString();

    const _id = await qOne(
      `insert into invite_tokens (token, group_id, max_uses, current_uses, expires_at)
     values ($1, $2, null, 0, $3)
     returning id`,
      [token, groupId, expiresAt],
    );

    res.json({
      data: {
        invite_link: `https://splitmates.vercel.app/join?token=${token}`,
      },
    });
  } catch (err) {
    console.error("Invitation-Link Creation Error:", err);
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "error when creating invite link",
      },
    });
  }
});

app.post("/api/groups/join", async (req, res) => {
  const { token } = req.body;
  const auth0_sub = req.headers["x-auth0-sub"];

  /** Verification */
  if (!token) {
    return res.status(400).json({
      error: {
        code: "MISSING_TOKEN",
        message: "invite token is missing",
      },
    });
  }

  /** Authentification */
  if (!auth0_sub) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "authentification is missing",
      },
    });
  }

  try {
    const user = await qOne("SELECT id FROM users WHERE auth0_sub = $1", [
      auth0_sub,
    ]);
    if (!user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "user is not authorized to join group",
        },
      });
    }

    const invite_token = await qOne(
      `SELECT * FROM invite_tokens WHERE token = $1`,
      [token],
    );
    if (!invite_token)
      return res.status(404).json({
        error: {
          code: "TOKEN_NOT_FOUND",
          message: "invite token is not valid",
        },
      });

    if (
      invite_token.expires_at &&
      new Date(invite_token.expires_at) < new Date()
    )
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "invite token is expired",
        },
      });

    /** Join Group */
    await qOne(
      `INSERT INTO group_members (group_id, user_id, role, is_active)
     VALUES ($1, $2, 'member', true)
     on conflict (group_id, user_id) do nothing
     returning id`,
      [invite_token.group_id, user.id],
    );

    await exec(
      `update invite_tokens set current_uses = current_uses + 1 where token = $1`,
      [token],
    );

    res.json({
      data: {
        group_id: invite_token.group_id,
      },
    });
  } catch (err) {
    console.error("Joining Group Error:", err);
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "error when joining group",
      },
    });
  }
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
    [user.id],
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
      [name, user.id, avatar_url, category],
    );

    await exec(
      `insert into group_members (group_id, user_id, role, is_active)
       values ($1, $2, 'owner', true)`,
      [group.id, user.id],
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
      [groupId],
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
    [groupId],
  );

  const mappedMembers = members.map((m) => ({
    name: m.username || "Unbekannt",
    avatarUrl: m.avatar_url,
    userID: m.id.toString(),
  }));

  const expenses = await qAll(
    `select e.id,
          e.description,
          e.amount_cents,
          e.currency,
          e.category,
          e.created_at,
          payer.id as payer_id,
          payer.username as payer_name
   from expenses e
   join users payer on payer.id = e.payer_id
   where e.group_id = $1
   order by e.created_at desc
   limit 10`,
    [groupId],
  );

  const mappedExpenses = await Promise.all(
    expenses.map(async (e) => {
      const debtors = await qAll(
        `select ed.debtor_id, u.username, u.avatar_url
         from expense_debtors ed
         join users u on u.id = ed.debtor_id
         where ed.expense_id = $1`,
        [e.id],
      );

      return {
        id: e.id,
        description: e.description,
        category: e.category,
        amount_cents: e.amount_cents,
        paidBy: e.payer_name,
        created_at: e.created_at,
        debtors: debtors.map((d) => ({
          name: d.username || "Unbekannt",
          avatarUrl: d.avatar_url,
          userID: d.debtor_id.toString(),
        })),
      };
    }),
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
      ],
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
        [expense.id, debtorId, baseShare],
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
    [groupId],
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
    [groupId],
  );
  credits.forEach((p) => (balances[p.payer_id] += Number(p.credit)));

  const owed = await qAll(
    `select debtor_id, sum(share_cents) as owed
       from expense_debtors ed
       join expenses e on e.id = ed.expense_id
      where e.group_id = $1
      group by debtor_id`,
    [groupId],
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

// GET /api/groups/:groupId/balances
app.get("/api/groups/:groupId/balances", async (req, res) => {
  const { groupId } = req.params;

  const group = await qOne("select id from groups where id = $1", [groupId]);
  if (!group) {
    return res.status(404).json({ error: "Gruppe nicht gefunden" });
  }

  // Mitglieder laden
  const members = await qAll(
    `select u.id, u.username as name
       from group_members gm
       join users u on u.id = gm.user_id
      where gm.group_id = $1`,
    [groupId],
  );

  // Initiale Balances
  const balances = {};
  members.forEach((m) => {
    balances[m.id] = 0;
  });

  // Gutschriften: was andere dem Zahler schulden
  const credits = await qAll(
    `select e.payer_id, sum(ed.share_cents) as credit
       from expenses e
       join expense_debtors ed on ed.expense_id = e.id
      where e.group_id = $1
      group by e.payer_id`,
    [groupId],
  );

  credits.forEach((c) => {
    balances[c.payer_id] += Number(c.credit);
  });

  // Schulden: eigener Anteil
  const owed = await qAll(
    `select ed.debtor_id, sum(ed.share_cents) as owed
       from expense_debtors ed
       join expenses e on e.id = ed.expense_id
      where e.group_id = $1
      group by ed.debtor_id`,
    [groupId],
  );

  owed.forEach((o) => {
    balances[o.debtor_id] -= Number(o.owed);
  });

  // In gewünschtes Format mappen
  const result = members.map((m) => ({
    member_id: m.id,
    member_name: m.name,
    balance: (balances[m.id] / 100).toFixed(2),
  }));

  res.json(result);
});

// Root
app.get("/", (_req, res) => {
  res.send(
    "Splitmates backend (Supabase Postgres) is running. See /api/health.",
  );
});
