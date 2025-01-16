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
  plan: string;
  userType: "individual" | "business";
  agreeTerms: boolean;
}

export interface EmailUser extends User {
  provider: "credentials";
  password: string;
}

export interface BusinessUser extends User {
  companyInfo: {
    businessNumber: string;
    representativeName: string;
    address: string;
    companyName: string;
    businessType: string;
    companyAddress: string;
  };
  managerInfo: {
    position: string;
    department: string;
    workEmail: string;
    workPhone: string;
  };
  additionalInfo?: {
    companyWebsite?: string;
    companySize?: string;
    establishedYear?: string;
    serviceUsage?: string;
    recruitmentField?: string;
    annualRecruitmentPlan?: string;
    serviceUtilizationPlan?: string;
  };
  provider: "email";
}
