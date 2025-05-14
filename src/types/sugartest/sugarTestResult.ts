export interface SugarTestResult {
  createdAt: string;
  testId: string;
  categories: {
    strain: number[];
    uncertainty: number[];
    grievance: number[];
    autonomy: number[];
    recognition: number[];
  };
}
