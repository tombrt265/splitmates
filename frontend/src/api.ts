export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;
import { ApiErrorResponse, User } from "./models";

interface BalanceResponse {
  member_id: string;
  member_name: string;
  balance: string;
}

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

export const addExpenseAPI = async (
  group_id: string,
  payerId: string,
  amount: number,
  currency: string,
  category: string | null,
  description: string,
  debtors: string[],
): Promise<any> => {
  const res = await fetch(`${API_BASE}/api/groups/${group_id}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      payerId: payerId,
      amount: amount,
      currency: currency,
      category: category,
      description: description,
      debtors: debtors,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Fehler beim Erstellen des Eintrags");
  }
  return await res.json();
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

export const createGroupAPI = async (
  name: string,
  category: string,
  auth0_sub: string,
) => {
  const res = await fetch(`${API_BASE}/api/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      category,
      avatar_url: "https://example.com/avatar.jpg",
      auth0_sub: auth0_sub,
    }),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen der Gruppe");

  return await res.json();
};

export const getGroupsOfUserAPI = async (user_id: string) => {
  const res = await fetch(
    `${API_BASE}/api/groups?user_id=${encodeURIComponent(user_id)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch groups");
  return await res.json();
};

export const getGroupWithIdAPI = async (group_id: string) => {
  const res = await fetch(`${API_BASE}/api/groups/${group_id}/overview`);
  if (!res.ok) throw new Error("Failed to fetch group overview");
  return await res.json();
};

export const deleteGroupWithIdAPI = async (group_id: string) => {
  const res = await fetch(`${API_BASE}/api/groups/${group_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete group");
  return res.json();
};

export const createGroupInviteLinkWithIdAPI = async (group_id: string) => {
  const res = await fetch(`${API_BASE}/api/groups/${group_id}/invite`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to create invite link");
  return await res.json();
};

export const getGroupBalancesWithIdAPI = async (
  group_id: string,
): Promise<BalanceResponse[]> => {
  const res = await fetch(`${API_BASE}/api/groups/${group_id}/balances`);
  if (!res.ok) throw new Error("Failed to load balances");
  return await res.json();
};
