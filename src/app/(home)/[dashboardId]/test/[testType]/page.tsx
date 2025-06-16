import { submitTest } from "@/api/firebase/submitTest";
import { TestAuthCheck } from "@/components/test/common/TestAuthCheck";
import { Metadata } from "next";
import { getTestDB } from "@/api/firebase/getTestDB";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { getUserData } from "@/api/firebase/users/getUserData";
import { ERROR_MESSAGES } from "@/types/error";
import { handleAppError } from "@/utils/errorHandler";
import { getDashboardData } from "@/api/firebase/dashboard/getDashboardData";
import { getTestResults } from "@/api/firebase/dashboard/getTestResults";

const VALID_TEST_TYPES = ["saucetest", "sugartest"] as const;
type TestType = (typeof VALID_TEST_TYPES)[number];

const TEST_METADATA: Record<TestType, { title: string }> = {
  saucetest: { title: "소스테스트" },
  sugartest: { title: "슈가테스트" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dashboardId: string; testType: string }>;
}): Promise<Metadata> {
  const { testType } = await params;
  return {
    title: TEST_METADATA[testType as TestType]?.title ?? "테스트",
  };
}

export default async function TestPage({
  params,
  searchParams,
}: {
  params: Promise<{ dashboardId: string; testType: string }>;
  searchParams: Promise<{ testId: string }>;
}) {
  const testId = (await searchParams).testId;
  const { dashboardId, testType } = await params;

  if (!VALID_TEST_TYPES.includes(testType as TestType)) {
    return handleAppError(ERROR_MESSAGES.TEST.NOT_FOUND);
  }

  if (!dashboardId) {
    return handleAppError(ERROR_MESSAGES.GROUP.NOT_FOUND);
  }

  const dashboardData = await getDashboardData(dashboardId);

  if (!dashboardData) {
    return handleAppError(ERROR_MESSAGES.GROUP.NOT_FOUND);
  }

  const isSauceTestV2 = testType === "saucetest";

  const testData = await getTestDB(isSauceTestV2 ? "saucetestV2" : testType);

  if (!testData) {
    return handleAppError(ERROR_MESSAGES.TEST.NOT_FOUND);
  }

  const testResults = await getTestResults(dashboardId);
  const targetTest = testResults.find(test => test.testId === testId);

  if (!targetTest) {
    return handleAppError(ERROR_MESSAGES.TEST.NOT_FOUND);
  }

  if (targetTest.deadline && new Date(targetTest.deadline) < new Date()) {
    return handleAppError(ERROR_MESSAGES.TEST.EXPIRED);
  }

  const session = await getServerSession(authOptions);
  const userData = await getUserData(session.user.id);
  const isAdmin = userData.isAdmin;

  return (
    <TestAuthCheck
      dashboardId={dashboardId}
      testType={testType as TestType}
      targetTest={targetTest}
      isAdmin={isAdmin}
      testData={testData}
      submitTest={submitTest}
    />
  );
}
