export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  paypal: string;
  avatar_url: string;
}

export interface Group {
  id: string;
  name: string;
  category: string;
  avatar_url: string;
  owner_id: number;
}

export interface GroupExtended {
  id: string;
  name: string;
  category: string;
  avatarUrl: string;
  created_at: string;
  members: GroupMember[];
  expenses: GroupExpense[];
}

interface GroupMember {
  name: string;
  avatarUrl: string;
  userID: string;
}

interface GroupExpense {
  id: number;
  description: string;
  category: string;
  amount_cents: number;
  paidBy: string;
  created_at: string;
  debtors: GroupMember[];
}

export interface Balance {
  member_id: string;
  member_name: string;
  balance: string;
}

export interface BalanceDetailed {
  direction: "incoming" | "outgoing";
  counterparty: string;
  amount: string;
  currency: string;
}
