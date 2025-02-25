import { getGroup } from "@/api/firebase/getGroup";
import { submitTest } from "@/api/firebase/submitTest";
import { TestAuthCheck } from "@/components/test/common/TestAuthCheck";
import { Group } from "@/types/group";
import { Metadata } from "next";
import { getTestDB } from "@/api/firebase/getTestDB";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { getUserData } from "@/api/firebase/getUserData";
import { ERROR_MESSAGES } from "@/types/error";
import { handleAppError } from "@/utils/errorHandler";
import { BusinessUser } from "@/types/user";
import { SauceTest } from "@/types/saucetest/test";
import { SugarTest } from "@/types/sugartest/test";

const VALID_TEST_TYPES = ["saucetest", "sugartest"] as const;
type TestType = (typeof VALID_TEST_TYPES)[number];

const TEST_METADATA: Record<TestType, { title: string }> = {
  saucetest: { title: "소스테스트" },
  sugartest: { title: "슈가테스트" },
};

export async function generateMetadata({
  params,
}: {
  params: { testType: string };
}): Promise<Metadata> {
  const testType = params.testType as TestType;
  return {
    title: TEST_METADATA[testType]?.title ?? "테스트",
  };
}

export default async function TestPage({
  params,
  searchParams,
}: {
  params: { testType: string };
  searchParams: { groupId: string };
}) {
  if (!VALID_TEST_TYPES.includes(params.testType as TestType)) {
    return handleAppError(ERROR_MESSAGES.TEST.NOT_FOUND);
  }

  const testType = params.testType as TestType;

  if (Object.keys(searchParams).length === 0) {
    return handleAppError(ERROR_MESSAGES.GROUP.NOT_FOUND);
  }

  const groupData = (await getGroup(searchParams.groupId)) as Group;

  if (!groupData) {
    return handleAppError(ERROR_MESSAGES.GROUP.NOT_FOUND);
  }

  const testData = (await getTestDB(testType)) as SauceTest | SugarTest;

  if (!testData) {
    return handleAppError(ERROR_MESSAGES.TEST.NOT_FOUND);
  }

  if (groupData.deadline && new Date(groupData.deadline) < new Date()) {
    return handleAppError(ERROR_MESSAGES.TEST.EXPIRED);
  }

  const session = await getServerSession(authOptions);
  const userData = session ? await getUserData(session.user.id) : null;
  const isAdmin = userData?.isAdmin ?? false;
  const userType = userData?.userType ?? "individual";
  const companyName =
    userType === "business"
      ? (userData as BusinessUser).companyInfo.companyName
      : userData?.name ?? "";

  return (
    <TestAuthCheck
      testType={testType}
      groupData={groupData}
      isAdmin={isAdmin}
      companyName={companyName}
      userType={userType}
      testData={testData}
      submitTest={submitTest}
    />
  );
}
