export interface User {
  id: string;
  name: string;
  email: string;
  isFirstLogin: boolean;
  createdAt: string;
  status: "active" | "inactive";
  isAdmin: boolean;
  provider: string;
  lastLoginAt: string;
  updatedAt: string;
  groups: string[];
  companyName: string;
  position: string;
  address?: string;
  plan: string;
  userType: "individual" | "business";
  businessNumber?: string;
  representativeName?: string;
  agreeTerms: boolean;
  phoneNumber: string;
}
