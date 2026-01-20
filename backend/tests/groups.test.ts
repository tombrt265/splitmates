import { assert, describe, it, beforeEach, afterAll } from "vitest";
import {
  createUser,
  createGroup,
  createInviteLink,
  getUserGroups,
  joinGroup,
  deleteGroup,
  createExpense,
  getGroupOverview,
  cleanupDatabase,
} from "./utils";
import { Expense } from "./models";

describe("create a group and ...", () => {
  beforeEach(async () => {
    await cleanupDatabase();
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
    deleteGroup(user_1, group);
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
    const token = new URL(invite_link.invite_link).searchParams.get("token");
    const group_id = await joinGroup(token!, user_2);
    const user_2_groups = await getUserGroups(user_2);

    // ASSERT
    assert.equal(user_2_groups.length, 1);
    assert.equal(group.id, group_id.group_id);
  });

  afterAll(async () => {
    await cleanupDatabase();
  });
});

describe("add an expense and ...", () => {
  beforeEach(async () => {
    cleanupDatabase();
  });

  it("... get an overview of the group", async () => {
    // WHEN
    const user_1 = await createUser(1);
    const user_2 = await createUser(2);
    const group = await createGroup(user_1);
    const invite_link = await createInviteLink(group);
    const token = new URL(invite_link.invite_link).searchParams.get("token");
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
    expense = await createExpense(user_1, expense);
    const overview = await getGroupOverview(user_1, group);

    // ASSERT
    assert.equal(overview.category, "test_category");
    assert.equal(overview.members.length, 2);
    assert.equal(overview.expenses.length, 1);
    assert.equal(overview.expenses[0].debtors.length, 1);
  });

  afterAll(async () => {
    cleanupDatabase();
  });
});
