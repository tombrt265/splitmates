import request from "supertest";
import { assert, describe, it, beforeEach, afterEach } from "vitest";
import { app } from "../src/app";
import { pool } from "../src/db";

let client: import("pg").PoolClient;

// ---------------- Types ----------------
interface User {
  id: string;
  username: string;
  email: string;
  auth0_sub: string;
  picture?: string;
}

interface Group {
  id: string;
  name: string;
  category: string;
  avatar_url?: string;
  auth0_sub: string;
}

// ---------------- Helpers ----------------
async function createTestUser(id: number): Promise<User> {
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

async function createGroup(user: User): Promise<Group> {
  const res = await request(app).post("/api/groups").send({
    name: "test_groupname",
    category: "test_category",
    avatar_url: "test_avatar_url",
    auth0_sub: user.auth0_sub,
  });
  return res.body as Group;
}

async function getUserGroups(user: User): Promise<Group[]> {
  const res = await request(app).get(`/api/groups?user_id=${user.auth0_sub}`);
  return res.body as Group[];
}

// ---------------- Tests ----------------
describe("Groups are being created", () => {
  beforeEach(async () => {
    client = await pool.connect();
    await client.query("BEGIN");
  });

  afterEach(async () => {
    await client.query("ROLLBACK");
    client.release();
  });

  it("should create a group and list it under the user", async () => {
    // WHEN
    const user_1 = await createTestUser(1);
    const group = await createGroup(user_1);

    // THEN
    const user_groups = await getUserGroups(user_1);

    // ASSERT
    assert.equal(user_groups.length, 1);
    assert.equal(user_groups[0].name, "test_groupname");
    assert.equal(user_groups[0].category, "test_category");
  });
});
