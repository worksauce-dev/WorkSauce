import { getGroup } from "@/api/firebase/getGroup";
import { submitTest } from "@/api/firebase/submitTest";
import { AuthCheck } from "@/components/test/TestContainer";
import { Group } from "@/types/group";
import { Metadata } from "next";
import { ExpiredTest } from "@/components/test/ExpiredTest";
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
      <div className="text-center text-2xl font-bold mt-40 h-screen">
        그룹을 찾을 수 없습니다.
      </div>
    );
  }

  const groupId = searchParams.groupId;

  const groupData = (await getGroup(groupId)) as Group;

  if (groupData.deadline && new Date(groupData.deadline) < new Date()) {
    return <ExpiredTest deadline={groupData.deadline} />;
  }

  return (
    <>
      <AuthCheck groupData={groupData} submitTest={submitTest} />
    </>
  );
}
