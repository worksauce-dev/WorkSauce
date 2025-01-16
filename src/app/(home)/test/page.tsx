import { getGroup } from "@/api/firebase/getGroup";
import { submitTest } from "@/api/firebase/submitTest";
import { AuthCheck } from "@/components/test/TestContainer";
import { Group } from "@/types/group";
import { Metadata } from "next";
import { getTestDB } from "@/api/firebase/getTestDB";
import { TestDBType } from "@/types/test";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { getUserData } from "@/api/firebase/getUserData";
import { ERROR_MESSAGES } from "@/types/error";
import { handleAppError } from "@/utils/errorHandler";
import { BusinessUser } from "@/types/user";

export const metadata: Metadata = {
  title: "소스테스트",
};

export default async function TestPage({
  searchParams,
}: {
  searchParams: { groupId: string };
}) {
  if (Object.keys(searchParams).length === 0) {
    return handleAppError(ERROR_MESSAGES.GROUP.NOT_FOUND);
  }

  const groupData = (await getGroup(searchParams.groupId)) as Group;
  if (!groupData) {
    return handleAppError(ERROR_MESSAGES.GROUP.NOT_FOUND);
  }

  const testData = await getTestDB("saucetest");
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
    <>
      <AuthCheck
        groupData={groupData}
        submitTest={submitTest}
        testData={testData as TestDBType}
        isAdmin={isAdmin}
        companyName={companyName}
        userType={userType}
      />
    </>
  );
}
