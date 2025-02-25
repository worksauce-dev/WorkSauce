export interface SugarTestResult {
  createdAt: string;
  groupId: string;
  categories: {
    [key: string]: number[]; // 각 카테고리별 점수 배열
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
  };
}
