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
  id: number;
  name: string;
  category: string;
  avatar_url: string;
  owner_id: number;
}
