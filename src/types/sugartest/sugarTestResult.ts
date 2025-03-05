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

export const STRESS_LEVELS = {
  LOW: { min: 0, max: 2.1, color: "emerald" },
  MODERATE: { min: 2.1, max: 3.1, color: "amber" },
  HIGH: { min: 3.1, max: 4.1, color: "orange" },
  CRITICAL: { min: 4.1, max: 5.0, color: "red" },
} as const;

export const getStressLevel = (score: number) => {
  if (score < STRESS_LEVELS.MODERATE.min) return "LOW";
  if (score < STRESS_LEVELS.HIGH.min) return "MODERATE";
  if (score < STRESS_LEVELS.CRITICAL.min) return "HIGH";
  return "CRITICAL";
};

export const getScoreColors = (score: number) => {
  const level = getStressLevel(score);
  const color = STRESS_LEVELS[level].color;

  return {
    light: `bg-${color}-50`,
    medium: `bg-${color}-100`,
    primary: `bg-${color}-500`,
    gradient: `from-${color}-400 to-${color}-500`,
    text: `text-${color}-700`,
  };
};
