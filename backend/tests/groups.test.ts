import { assert, describe, it, beforeEach, afterAll } from "vitest";
import { pool, exec } from "../src/db";
import {
  createUser,
  createGroup,
  createInviteLink,
  getUserGroups,
  joinGroup,
  deleteGroup,
  createExpense,
  getGroupOverview,
} from "./utils";
import { Expense } from "./models";

describe("create a group and ...", () => {
  beforeEach(async () => {
    await exec("DELETE FROM expense_debtors");
    await exec("DELETE FROM expenses");
    await exec("DELETE FROM group_members");
    await exec("DELETE FROM invite_tokens");
    await exec("DELETE FROM groups");
    await exec("DELETE FROM users");

    await exec("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE groups_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE group_members_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE expenses_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE expense_debtors_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE invite_tokens_id_seq RESTART WITH 1");
  });

  it("... list it under the user", async () => {
    // WHEN
    const user_1 = await createUser(1);
    const group = await createGroup(user_1);

    // THEN
    const user_groups = await getUserGroups(user_1);

    // ASSERT
    assert.equal(user_groups.length, 1);
    assert.equal(user_groups[0].name, "test_groupname");
    assert.equal(user_groups[0].category, "test_category");
  });

  it("... delete it", async () => {
    // WHEN
    const user_1 = await createUser(1);
    const group = await createGroup(user_1);

    // THEN
    deleteGroup(group);
    const user_groups = await getUserGroups(user_1);

    // ASSERT
    assert.equal(user_groups.length, 0);
  });

  it("... receive an invite link", async () => {
    // WHEN
    const user_1 = await createUser(1);
    const user_2 = await createUser(2);
    const group = await createGroup(user_1);

    // THEN
    const invite_link = await createInviteLink(group);
    const token = new URL(invite_link).searchParams.get("token");
    const group_id = await joinGroup(token!, user_2);
    const user_2_groups = await getUserGroups(user_2);

    // ASSERT
    assert.equal(user_2_groups.length, 1);
    assert.equal(group.id, group_id);
  });

  afterAll(async () => {
    await exec("DELETE FROM expense_debtors");
    await exec("DELETE FROM expenses");
    await exec("DELETE FROM group_members");
    await exec("DELETE FROM invite_tokens");
    await exec("DELETE FROM groups");
    await exec("DELETE FROM users");

    await exec("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE groups_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE group_members_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE expenses_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE expense_debtors_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE invite_tokens_id_seq RESTART WITH 1");
  });
});

describe("add an expense and ...", () => {
  beforeEach(async () => {
    await exec("DELETE FROM expense_debtors");
    await exec("DELETE FROM expenses");
    await exec("DELETE FROM group_members");
    await exec("DELETE FROM invite_tokens");
    await exec("DELETE FROM groups");
    await exec("DELETE FROM users");

    await exec("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE groups_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE group_members_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE expenses_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE expense_debtors_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE invite_tokens_id_seq RESTART WITH 1");
  });

  it("... get an overview of the group", async () => {
    // WHEN
    const user_1 = await createUser(1);
    const user_2 = await createUser(2);
    const group = await createGroup(user_1);
    const invite_link = await createInviteLink(group);
    const token = new URL(invite_link).searchParams.get("token");
    const group_id = await joinGroup(token!, user_2);

    let expense: Expense = {
      id: "1",
      group_id: group.id,
      payer_id: user_1.id,
      amount_cents: "1000",
      currency: "€",
      category: "Food",
      description: "Kebab",
      created_at: "",
      debtors: [user_2.id],
    };

    // THEN
    expense = await createExpense(expense);
    const overview = await getGroupOverview(group);

    // ASSERT
    assert.equal(overview.category, "test_category");
    assert.equal(overview.members.length, 2);
    assert.equal(overview.expenses.length, 1);
    assert.equal(overview.expenses[0].debtors.length, 1);
  });

  afterAll(async () => {
    await exec("DELETE FROM expense_debtors");
    await exec("DELETE FROM expenses");
    await exec("DELETE FROM group_members");
    await exec("DELETE FROM invite_tokens");
    await exec("DELETE FROM groups");
    await exec("DELETE FROM users");

    await exec("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE groups_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE group_members_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE expenses_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE expense_debtors_id_seq RESTART WITH 1");
    await exec("ALTER SEQUENCE invite_tokens_id_seq RESTART WITH 1");
    await pool.end();
  });
});
