export interface EmailOptions {
  to: string;
  userName: string;
  applicantName: string;
  testId: string;
  companyName: string;
  deadline: string;
  isVerified: "approved" | "pending" | "rejected" | "notRequested";
  subject?: string;
  html?: string;
  dashboardId: string;
}
