import { getGroup } from "@/api/firebase/getGroup";
import { submitTest } from "@/api/firebase/submitTest";
import { AuthCheck } from "@/components/test/TestContainer";
import { Group } from "@/types/group";
import { Metadata } from "next";
import { ExpiredTest } from "@/components/test/ExpiredTest";
import { getTestDB } from "@/api/firebase/getTestDB";
import { TestDBType } from "@/types/test";
import { ErrorPage } from "@/components/common/ErrorPage";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { getUserData } from "@/api/firebase/getUserData";

export const metadata: Metadata = {
  title: "소스테스트",
};

export default async function TestPage({
  searchParams,
}: {
  searchParams: { groupId: string };
}) {
  if (Object.keys(searchParams).length === 0) {
    return (
      <ErrorPage
        title="그룹을 찾을 수 없습니다"
        message="삭제되거나 존재하지 않는 그룹입니다."
      />
    );
  }

  const groupId = searchParams.groupId;
  const groupData = (await getGroup(groupId)) as Group;

  if (!groupData) {
    return (
      <ErrorPage
        title="존재하지 않는 그룹입니다"
        message="삭제되거나 존재하지 않는 그룹입니다."
      />
    );
  }

  const testData = await getTestDB("saucetest");

  if (!testData) {
    return (
      <ErrorPage
        title="테스트를 찾을 수 없습니다"
        message="요청하신 테스트가 삭제되었거나 존재하지 않습니다. 관리자에게 문의해 주세요."
      />
    );
  }

  if (groupData.deadline && new Date(groupData.deadline) < new Date()) {
    return <ExpiredTest deadline={groupData.deadline} />;
  }

  const session = await getServerSession(authOptions);
  const userData = session ? await getUserData(session.user.id) : null;
  const isAdmin = userData?.isAdmin ?? false;
  const companyName = userData?.companyName ?? userData?.name ?? "";
  const userType = userData?.userType ?? "individual";

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
