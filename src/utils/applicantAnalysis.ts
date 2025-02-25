import { SauceResultType, SauceType } from "@/types/saucetest/test";
import { TestData } from "@/types/saucetest/sauceTestResult";

interface ApplicantType extends TestData {
  primaryType: SauceType;
  secondaryType: SauceType;
}

type TestResult = {
  sort: string;
  score: number;
  maxScore: number;
  color?: string;
};

export const determineApplicantType = (
  testResults: TestResult[],
  sauceResult: SauceResultType
): ApplicantType => {
  const primaryType = testResults[0].sort as SauceType;
  const secondaryType = testResults[1].sort as SauceType;

  const applicantType = (
    sauceResult[primaryType] as Record<SauceType, TestData>
  )[secondaryType];

  return {
    ...applicantType,
    primaryType,
    secondaryType,
  };
};
