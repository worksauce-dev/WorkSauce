import { SauceResultType } from "@/types/test";

interface ApplicantType {
  title: string;
  keywords: string[];
  description: string;
  weaknesses: string;
  interviewQuestions: string[];
  onboardingSteps: string;
  primaryType?: string;
  secondaryType?: string;
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
  const primaryType = testResults[0].sort;
  const secondaryType = testResults[1].sort;

  const applicantType = (
    sauceResult[primaryType as keyof SauceResultType] as Record<
      string,
      ApplicantType
    >
  )[secondaryType];

  return {
    ...applicantType,
    primaryType,
    secondaryType,
  };
};
