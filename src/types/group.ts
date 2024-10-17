export interface Applicant {
  name: string;
  email: string;
  groupId: string;
  testStatus: "pending" | "completed" | "expired";
  completedAt: string | null;
  testResult: {
    sort: string;
    score: number;
    maxScore: number;
    color?: string;
  }[];
  groupName: string;
}

export interface Group {
  groupId: string;
  name: string;
  deadline: string;
  keywords: string[];
  applicants: Applicant[];
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string };
  updatedBy: { id: string; name: string };
}
