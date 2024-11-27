export interface User {
  id: string;
  name: string;
  email: string;
  isFirstLogin: boolean;
  createdAt: string;
  status: string;
  isAdmin: boolean;
  provider: string;
  lastLoginAt: string;
  updatedAt: string;
  groups: string[];
  dashboardName: string;
  address?: string;
  plan: string;
  userType: string;
  businessNumber?: string;
  representativeName?: string;
  agreeTerms: boolean;
  phoneNumber: string;
}
