import { SugarTestResult, SauceResult, TestResult } from "@/types/test";

/**
 * 주어진 결과가 SugarTestResult 타입인지 확인합니다.
 */
export const isSugarTestResult = (
  result: TestResult | undefined | null
): result is SugarTestResult => {
  return (
    result !== undefined &&
    result !== null &&
    result.type === "sugar" &&
    "categories" in result &&
    "strain" in result.categories &&
    "uncertainty" in result.categories &&
    "grievance" in result.categories &&
    "autonomy" in result.categories &&
    "recognition" in result.categories
  );
};

/**
 * 주어진 결과가 SauceResult 타입인지 확인합니다.
 */
export const isSauceResult = (
  result: TestResult | undefined | null
): result is SauceResult => {
  return (
    result !== undefined &&
    result !== null &&
    result.type === "sauce" &&
    "categories" in result &&
    "metadata" in result
  );
};

/**
 * 주어진 결과가 유효한 테스트 결과인지 확인합니다.
 */
export const isValidTestResult = (result: unknown): result is TestResult => {
  if (!result || typeof result !== "object") return false;

  const testResult = result as TestResult;
  return (
    "type" in testResult &&
    "testId" in testResult &&
    "createdAt" in testResult &&
    (isSugarTestResult(testResult) || isSauceResult(testResult))
  );
};
