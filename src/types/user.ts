export interface User {
  id: string;
  name: string;
  email: string;
  isFirstLogin: boolean;
  image: string;
  createdAt: string;
  status: string;
  isAdmin: boolean;
  provider: string;
  lastLoginAt: string;
  type: string;
  updatedAt: string;
  groups: string[];
  companyName: string;
  address: string;
  plan: string;
}
