import { User, Group, Expense, GroupOverview } from "./models";
import { app } from "../src/app";
import request from "supertest";
import { exec } from "../src/db";

export async function cleanupDatabase() {
  await exec(`
  TRUNCATE
    expense_debtors,
    expenses,
    group_members,
    invite_tokens,
    groups,
    users
  RESTART IDENTITY
  CASCADE;
`);
}

export async function createUser(id: number): Promise<User> {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      username: `test_username_${id}`,
      email: `test_email_${id}@test.com`,
      auth0_sub: `test_auth0_sub_${id}`,
      picture: "test_picture",
    });
  return res.body as User;
}

export async function createGroup(user: User): Promise<Group> {
  const res = await request(app).post("/api/groups").send({
    name: "test_groupname",
    category: "test_category",
    avatar_url: "test_avatar_url",
    auth0_sub: user.auth0_sub,
  });
  return res.body as Group;
}

export async function deleteGroup(group: Group) {
  const res = await request(app).delete(`/api/groups/${group.id}`);
}

export async function getUserGroups(user: User): Promise<Group[]> {
  const res = await request(app).get(`/api/groups?user_id=${user.auth0_sub}`);
  return res.body as Group[];
}

export async function createInviteLink(group: Group): Promise<string> {
  const res = await request(app).post(`/api/groups/${group.id}/invite`);
  return res.body.invite_link;
}

export async function joinGroup(token: string, user: User): Promise<string> {
  const res = await request(app).post(`/api/groups/join`).send({
    token: token,
    auth0_sub: user.auth0_sub,
  });
  return res.body.group_id;
}

export async function createExpense(expense: Expense): Promise<Expense> {
  const res = await request(app)
    .post(`/api/groups/${expense.group_id}/expenses`)
    .send({
      payerId: expense.payer_id,
      amount: Number(expense.amount_cents) * 100,
      currency: expense.currency,
      category: expense.category,
      description: expense.description,
      debtors: expense.debtors,
    });
  return res.body;
}

export async function getGroupOverview(group: Group): Promise<GroupOverview> {
  const res = await request(app).get(`/api/groups/${group.id}/overview`);
  return res.body;
}
