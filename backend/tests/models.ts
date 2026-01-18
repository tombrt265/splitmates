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
  owner_id: string;
}

export interface Expense {
  id: string;
  group_id: string;
  payer_id: string;
  amount_cents: string;
  currency: string;
  category: string;
  description: string;
  created_at: string;
  debtors: string[];
}

export interface GroupOverview {
  id: string;
  name: string;
  category: string;
  avatarUrl: string;
  created_at: string;
  members: { name: string; avatarUrl: string; userID: string }[];
  expenses: {
    id: string;
    description: string;
    category: string;
    amount_cents: string;
    paidBy: string;
    created_at: string;
    debtors: { name: string; avatarUrl: string; userID: string }[];
  }[];
}
