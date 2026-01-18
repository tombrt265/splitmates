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
    .post("/api/users")
    .set("x-auth0-sub", `test_auth0_sub_${id}`)
    .send({
      username: `test_username_${id}`,
      email: `test_email_${id}@test.com`,
      picture: "test_picture",
    });
  return res.body.data;
}

export async function createGroup(user: User): Promise<Group> {
  const res = await request(app)
    .post("/api/groups")
    .set("x-auth0-sub", `test_auth0_sub_${user.id}`)
    .send({
      name: "test_groupname",
      category: "test_category",
      avatar_url: "test_avatar_url",
    });
  return res.body.data;
}

export async function deleteGroup(
  user: User,
  group: Group,
): Promise<{ id: string }> {
  const res = await request(app)
    .delete(`/api/groups/${group.id}`)
    .set("x-auth0-sub", `test_auth0_sub_${user.id}`);
  return res.body.data;
}

export async function getUserGroups(user: User): Promise<Group[]> {
  const res = await request(app)
    .get(`/api/groups`)
    .set("x-auth0-sub", `test_auth0_sub_${user.id}`);
  return res.body.data;
}

export async function createInviteLink(
  group: Group,
): Promise<{ invite_link: string }> {
  const res = await request(app).post(`/api/groups/${group.id}/invite`);
  return res.body.data;
}

export async function joinGroup(
  token: string,
  user: User,
): Promise<{ group_id: string }> {
  const res = await request(app)
    .post(`/api/groups/join`)
    .set("x-auth0-sub", `test_auth0_sub_${user.id}`)
    .send({
      token: token,
    });
  return res.body.data;
}

export async function createExpense(
  user: User,
  expense: Expense,
): Promise<Expense> {
  const res = await request(app)
    .post(`/api/groups/${expense.group_id}/balance`)
    .set("x-auth0-sub", `test_auth0_sub_${user.id}`)
    .send({
      payerId: expense.payer_id,
      amount: Number(expense.amount_cents) * 100,
      currency: expense.currency,
      category: expense.category,
      description: expense.description,
      debtors: expense.debtors,
    });
  return res.body.data;
}

export async function getGroupOverview(
  user: User,
  group: Group,
): Promise<GroupOverview> {
  const res = await request(app)
    .get(`/api/groups/${group.id}`)
    .set("x-auth0-sub", `test_auth0_sub_${user.id}`);
  return res.body.data;
}
