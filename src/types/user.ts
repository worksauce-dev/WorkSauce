import { SugarTestResult } from "./sugartest/sugarTestResult";
import { SauceResult } from "./test";

export type TestStatus = "pending" | "completed" | "expired";

export interface Applicant {
  name: string;
  email: string;
  id: string;
  testStatus: TestStatus;
  completedAt: string;
  testResult: SugarTestResult | SauceResult | null;
  team: { name: string; id: string };
}

export interface TestInfo {
  testId: string;
  type: "sugar" | "sauce";
  deadline: string;
  status: TestStatus;
  createdBy: { name: string; id: string };
  applicants: Applicant[];
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Members {
  teamInfo: { teamId: string; name: string };
  id: string;
  name: string;
  email: string;
  testIds: string[];
}

export interface UserTeam {
  teamId: string;
  dashboardId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: { name: string; id: string };
  members: Members[];
  testIds: string[];
}

export interface UserBase {
  id: string;
  email: string;
  name: string;
  userType: "individual" | "business";
  status: "active" | "inactive";
  isAdmin: boolean;
  plan: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  agreeTerms: boolean;
  dashboardId: string;
  members: Members[];
}
