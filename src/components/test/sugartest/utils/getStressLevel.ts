// 스트레스 레벨 타입 정의
export type StressLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

// 스트레스 레벨별 색상 및 기타 속성을 포함하는 인터페이스
export interface StressLevelData {
  level: StressLevel;
  colors: {
    from: string;
    to: string;
  };
  label: string;
  description: string;
  tailwindClass: string; // Tailwind 클래스 추가
}

// 스트레스 레벨 임계값 정의 (유지보수 용이성을 위해 상수로 분리)
const STRESS_THRESHOLDS = {
  LOW: 2.0,
  MODERATE: 3.0,
  HIGH: 4.0,
};

// 스트레스 레벨별 데이터 맵핑
const STRESS_LEVEL_DATA: Record<StressLevel, Omit<StressLevelData, "level">> = {
  LOW: {
    colors: {
      from: "#34d399", // green-400
      to: "#10b981", // green-500
    },
    label: "낮음",
    description: "스트레스 수준이 낮습니다. 현재 상태를 유지하세요.",
    tailwindClass: "from-emerald-400 to-emerald-500",
  },
  MODERATE: {
    colors: {
      from: "#fbbf24", // amber-400
      to: "#f59e0b", // amber-500
    },
    label: "보통",
    description: "스트레스가 약간 있습니다. 관리가 필요할 수 있습니다.",
    tailwindClass: "from-amber-400 to-amber-500",
  },
  HIGH: {
    colors: {
      from: "#fb923c", // orange-400
      to: "#f97316", // orange-500
    },
    label: "높음",
    description: "스트레스 수준이 높습니다. 적극적인 관리가 필요합니다.",
    tailwindClass: "from-orange-400 to-orange-500",
  },
  CRITICAL: {
    colors: {
      from: "#f87171", // red-400
      to: "#ef4444", // red-500
    },
    label: "매우 높음",
    description: "스트레스 수준이 매우 높습니다. 즉각적인 조치가 필요합니다.",
    tailwindClass: "from-red-400 to-red-500",
  },
};

// 메모이제이션을 위한 캐시
const levelCache = new Map<number, StressLevel>();
const dataCache = new Map<number, StressLevelData>();
const colorCache = new Map<number, StressLevelData["colors"]>();
const classCache = new Map<number, string>();

/**
 * 점수에 따른 스트레스 레벨 반환 (메모이제이션 적용)
 */
export function getStressLevel(score: number): StressLevel {
  // 소수점 첫째 자리까지만 고려 (캐싱 효율성을 위해)
  const roundedScore = Math.round(score * 10) / 10;

  if (levelCache.has(roundedScore)) {
    return levelCache.get(roundedScore)!;
  }

  let level: StressLevel;
  if (roundedScore <= STRESS_THRESHOLDS.LOW) level = "LOW";
  else if (roundedScore <= STRESS_THRESHOLDS.MODERATE) level = "MODERATE";
  else if (roundedScore <= STRESS_THRESHOLDS.HIGH) level = "HIGH";
  else level = "CRITICAL";

  levelCache.set(roundedScore, level);
  return level;
}

/**
 * 점수에 따른 스트레스 레벨 데이터 반환 (메모이제이션 적용)
 */
export function getStressLevelData(score: number): StressLevelData {
  const roundedScore = Math.round(score * 10) / 10;

  if (dataCache.has(roundedScore)) {
    return dataCache.get(roundedScore)!;
  }

  const level = getStressLevel(score);
  const data = {
    level,
    ...STRESS_LEVEL_DATA[level],
  };

  dataCache.set(roundedScore, data);
  return data;
}

/**
 * 점수에 따른 색상 객체 반환 (메모이제이션 적용)
 */
export function getStressColors(score: number) {
  const roundedScore = Math.round(score * 10) / 10;

  if (colorCache.has(roundedScore)) {
    return colorCache.get(roundedScore)!;
  }

  const colors = getStressLevelData(score).colors;
  colorCache.set(roundedScore, colors);
  return colors;
}

/**
 * 점수에 따른 Tailwind 클래스 반환 (메모이제이션 적용)
 */
export function getScoreColorClass(score: number | string) {
  const numScore = typeof score === "string" ? parseFloat(score) : score;
  const roundedScore = Math.round(numScore * 10) / 10;

  if (classCache.has(roundedScore)) {
    return classCache.get(roundedScore)!;
  }

  const tailwindClass = getStressLevelData(numScore).tailwindClass;
  classCache.set(roundedScore, tailwindClass);
  return tailwindClass;
}

/**
 * 스트레스 레벨에 따른 데이터 접근 함수들
 */
export const stressLevelInfo = {
  // 레벨에 따른 색상 반환
  getColors: (level: StressLevel) => STRESS_LEVEL_DATA[level].colors,

  // 레벨에 따른 라벨 반환
  getLabel: (level: StressLevel) => STRESS_LEVEL_DATA[level].label,

  // 레벨에 따른 설명 반환
  getDescription: (level: StressLevel) => STRESS_LEVEL_DATA[level].description,

  // 레벨에 따른 Tailwind 클래스 반환
  getTailwindClass: (level: StressLevel) =>
    STRESS_LEVEL_DATA[level].tailwindClass,

  // 모든 레벨 데이터 반환
  getAllLevels: () =>
    Object.entries(STRESS_LEVEL_DATA).map(([level, data]) => ({
      level: level as StressLevel,
      ...data,
    })),
};

/**
 * 스트레스 레벨 관련 모든 유틸리티 함수를 하나의 객체로 내보내기
 */
export const stressUtils = {
  getLevel: getStressLevel,
  getData: getStressLevelData,
  getColors: getStressColors,
  getColorClass: getScoreColorClass,
  levelInfo: stressLevelInfo,
};

export { getScoreColorClass as getScoreColor };

import { SugarTestResult } from "@/types/sugartest/sugarTestResult";
import { TestResult, SauceResult } from "@/types/test";
import { isSugarTestResult, isSauceResult } from "@/utils/typeGuards";

// 기존 함수들은 그대로 두고, testResult 객체를 받아서 카테고리별로 결과를 반환하는 함수 추가

export function getStressLevelByTestResult(testResult: SugarTestResult) {
  const result: Record<string, StressLevel> = {};
  (
    Object.keys(testResult.categories) as Array<
      keyof typeof testResult.categories
    >
  ).forEach(category => {
    const arr = testResult.categories[category];
    const avg = arr.length
      ? arr.reduce((a: number, b: number) => a + b, 0) / arr.length
      : 0;
    result[category] = getStressLevel(avg);
  });
  return result;
}

export function getStressLevelDataByTestResult(testResult: SugarTestResult) {
  const result: Record<string, StressLevelData> = {};
  (
    Object.keys(testResult.categories) as Array<
      keyof typeof testResult.categories
    >
  ).forEach(category => {
    const arr = testResult.categories[category];
    const avg = arr.length
      ? arr.reduce((a: number, b: number) => a + b, 0) / arr.length
      : 0;
    result[category] = getStressLevelData(avg);
  });
  return result;
}

export function getStressColorsByTestResult(testResult: SugarTestResult) {
  const result: Record<string, StressLevelData["colors"]> = {};
  (
    Object.keys(testResult.categories) as Array<
      keyof typeof testResult.categories
    >
  ).forEach(category => {
    const arr = testResult.categories[category];
    const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    result[category] = getStressColors(avg);
  });
  return result;
}

export function getScoreColorClassByTestResult(testResult: SugarTestResult) {
  const result: Record<string, string> = {};
  (
    Object.keys(testResult.categories) as Array<
      keyof typeof testResult.categories
    >
  ).forEach(category => {
    const arr = testResult.categories[category];
    const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    result[category] = getScoreColorClass(avg);
  });
  return result;
}

export function calculateCategoryScore(
  testResult: TestResult
): Record<string, number> {
  if (isSugarTestResult(testResult)) {
    const result: Record<string, number> = {};
    Object.entries(testResult.categories).forEach(([category, scores]) => {
      const avg = scores.length
        ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
        : 0;
      result[category] = avg;
    });
    return result;
  }

  if (isSauceResult(testResult)) {
    return Object.entries(testResult.metadata.categoryScores).reduce(
      (acc, [category, { average }]) => ({
        ...acc,
        [category]: average,
      }),
      {}
    );
  }

  throw new Error("Invalid test result type");
}
