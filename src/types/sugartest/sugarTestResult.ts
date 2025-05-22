import { BaseTestResult } from "@/types/test";

export interface SugarTestResult extends BaseTestResult {
  type: "sugar";
  categories: {
    strain: number[];
    uncertainty: number[];
    grievance: number[];
    autonomy: number[];
    recognition: number[];
  };
}
