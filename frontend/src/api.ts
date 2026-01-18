export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;
import {
  ApiErrorResponse,
  User,
  Group,
  GroupExtended,
  Balance,
} from "./models";

export const signUpUserAPI = async (
  username: string,
  email: string,
  auth0_sub: string,
  picture: string,
): Promise<{ data: User }> => {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth0-sub": auth0_sub,
    },
    body: JSON.stringify({
      username: username,
      email: email,
      picture: picture,
    }),
  });

  const data: { data: User } | ApiErrorResponse = await res.json();

  if (!res.ok) throw data as ApiErrorResponse;

  return data as { data: User };
};

export const createInviteLinkAPI = async (group_id: string) => {
  const res = await fetch(`${API_BASE}/api/groups/${group_id}/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data: { data: { invite_link: string } } | ApiErrorResponse =
    await res.json();

  if (!res.ok) throw data as ApiErrorResponse;

  return data as { data: { invite_link: string } };
};

export const joinGroupAPI = async (
  token: string,
  auth0_sub: string,
): Promise<{ data: { group_id: string } }> => {
  const res = await fetch(`${API_BASE}/api/groups/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-auth0-sub": auth0_sub },
    body: JSON.stringify({ token }),
  });

  const data: { data: { group_id: string } } | ApiErrorResponse =
    await res.json();

  if (!res.ok) throw data as ApiErrorResponse;

  return data as { data: { group_id: string } };
};

export const getGroupsOfUserAPI = async (auth0_sub: string) => {
  const res = await fetch(`${API_BASE}/api/groups`, {
    method: "GET",
    headers: { "x-auth0-sub": auth0_sub },
  });

  const data: { data: Group[] } | ApiErrorResponse = await res.json();
  if (!res.ok) throw data as ApiErrorResponse;
  return data as { data: Group[] };
};

export const createGroupAPI = async (
  name: string,
  category: string,
  auth0_sub: string,
) => {
  const res = await fetch(`${API_BASE}/api/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-auth0-sub": auth0_sub },
    body: JSON.stringify({
      name,
      category,
      avatar_url: "https://example.com/avatar.jpg",
    }),
  });

  const data: { data: Group } | ApiErrorResponse = await res.json();
  if (!res.ok) throw data as ApiErrorResponse;
  return data as { data: Group };
};

export const deleteGroupWithIdAPI = async (
  group_id: string,
  auth0_sub: string,
) => {
  const res = await fetch(`${API_BASE}/api/groups/${group_id}`, {
    method: "DELETE",
    headers: { "x-auth0-sub": auth0_sub },
  });
  const data: { data: { id: string } } | ApiErrorResponse = await res.json();
  if (!res.ok) throw data as ApiErrorResponse;
  return data as { data: { id: string } };
};

export const getGroupWithIdAPI = async (
  group_id: string,
  auth0_sub: string,
) => {
  const res = await fetch(`${API_BASE}/api/groups/${group_id}`, {
    method: "GET",
    headers: { "x-auth0-sub": auth0_sub },
  });
  const data: { data: GroupExtended } | ApiErrorResponse = await res.json();
  if (!res.ok) throw data as ApiErrorResponse;
  return data as { data: GroupExtended };
};

export const addExpenseAPI = async (
  auth0_sub: string,
  group_id: string,
  payerId: string,
  amount: number,
  currency: string,
  category: string | null,
  description: string,
  debtors: string[],
) => {
  const res = await fetch(`${API_BASE}/api/groups/${group_id}/balance`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-auth0-sub": auth0_sub },
    body: JSON.stringify({
      payerId: payerId,
      amount: amount,
      currency: currency,
      category: category,
      description: description,
      debtors: debtors,
    }),
  });
  const data: { data: {} } | ApiErrorResponse = await res.json();
  if (!res.ok) throw data as ApiErrorResponse;
  return data as { data: {} };
};

export const getGroupBalancesWithIdAPI = async (
  group_id: string,
  auth0_sub: string,
) => {
  const res = await fetch(`${API_BASE}/api/groups/${group_id}/balance`, {
    method: "GET",
    headers: { "x-auth0-sub": auth0_sub },
  });
  const data: { data: Balance[] } | ApiErrorResponse = await res.json();
  if (!res.ok) throw data as ApiErrorResponse;
  return data as { data: Balance[] };
};

export const getBalanceOfUserInGroup = async (
  user_id: string,
  group_id: string,
) => {
  const res = await fetch(
    `${API_BASE}/api/groups/${group_id}/balances/${user_id}`,
  );
  if (!res.ok) throw new Error("Failed to load balances");
  return await res.json();
};
