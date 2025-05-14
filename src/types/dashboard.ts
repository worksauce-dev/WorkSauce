import { UserTeam } from "./user";

export interface DashboardMember {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}

export interface CollaboratorNotification {
  name: string;
  email: string;
  userId: string;
  type: "invite";
  status: "pending" | "completed";
  createdAt: string;
  completedAt: string;
}

interface TestNotification {
  name: string;
  type: "testCompleted";
  testType: "sugar" | "sauce";
  status: "pending" | "completed";
  createdAt: string;
  completedAt: string;
}

export interface Organization {
  // 기업회원 필수 정보
  companyInfo: {
    businessNumber: string;
    representativeName: string;
    companyName: string;
    businessType: string;
    companyAddress: string;
  };
  // 담당자 정보
  managerInfo: {
    position: string;
    department: string;
    workEmail: string;
    workPhone: string;
  };
  // 선택 정보
  additionalInfo?: {
    companyWebsite?: string;
    companySize?: string;
    establishedYear?: string;
    serviceUsage?: string;
    recruitmentField?: string;
    annualRecruitmentPlan?: string;
    serviceUtilizationPlan?: string;
  };
  files: {
    businessLicenseUrl: string | null;
    employmentCertificateUrl: string | null;
  };
}

export interface DashboardInterface {
  dashboardId: string;
  ownerId: string;
  createdAt: string;
  notifications: (CollaboratorNotification | TestNotification)[];
  members: {
    id: string;
    name: string;
    email: string;
    joinedAt: string;
  }[];
  invitations: {
    senderId: string;
    senderName: string;
    senderEmail: string;
    recipient: {
      id: string;
      name: string;
      email: string;
    };
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    completedAt: string;
  }[];
  isVerified: "verified" | "pending" | "rejected" | "notRequested";
  organization: Organization;
  userTeam: UserTeam[];
}

export interface TestCard {
  id: string;
  title: string;
  description: string;
  category: string;
  isReady: boolean;
}

export type ViewType = "grid" | "list";
