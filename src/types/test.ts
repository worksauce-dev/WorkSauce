interface SugarTestResult {
  [memberId: string]: {
    status: "pending" | "completed" | "expired";
    completedAt?: string;
    result?: {
      categories: {
        strain: number[];
        uncertainty: number[];
        grievance: number[];
        autonomy: number[];
        recognition: number[];
      };
    };
  };
}

export interface Test {
  testId: string;
  teamId: string;
  type: "sugar" | "sauce";
  deadline: string;
  status: "pending" | "completed" | "expired";
  createdBy: { name: string; id: string };
  results: Record<string, SugarTestResult>;
}
