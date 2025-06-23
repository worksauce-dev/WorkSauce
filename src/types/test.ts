// 공통 테스트 결과 인터페이스
export interface BaseTestResult {
  createdAt: string;
  testId: string;
  type: "sugar" | "sauce";
}

// 슈가 테스트 카테고리 타입
export interface SugarTestCategories {
  strain: number[];
  uncertainty: number[];
  grievance: number[];
  autonomy: number[];
  recognition: number[];
}

// 슈가 테스트 결과
export interface SugarTestResult extends BaseTestResult {
  type: "sugar";
  categories: SugarTestCategories;
}

// 소스 테스트 결과
export interface SauceResult extends BaseTestResult {
  type: "sauce";
  categories: {
    [key: string]: number[];
  };
  metadata: {
    totalScore: number;
    categoryScores: {
      [key: string]: {
        total: number;
        average: number;
      };
    };
    averageScore: number;
    history: Array<{
      date: string;
      categories: { [key: string]: number[] };
      averageScore: number;
    }>;
  };
}

// 통합된 테스트 결과 타입
export type TestResult = SugarTestResult | SauceResult;

// 테스트 상태
export interface TestStatus {
  status: "pending" | "completed" | "expired";
  completedAt?: string;
  result?: TestResult;
}

// 테스트 정보
export interface Test {
  testId: string;
  teamId: string;
  type: "sugar" | "sauce";
  deadline: string;
  status: "pending" | "completed" | "expired";
  createdBy: { name: string; id: string };
  results: Record<string, TestResult>;
}

export interface TestResults {
  applicants: {
    completedAt: string;
    email: string;
    id: string;
    name: string;
    team: {
      id: string;
      name: string;
    };
    testResult: SugarTestResult | SauceResult;
    testStatus: "pending" | "completed" | "expired";
  }[];
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  deadline: string;
  status: "pending" | "completed" | "expired";
  teamId: string;
  testId: string;
  type: "sugar" | "sauce";
  updatedAt: string;
}
