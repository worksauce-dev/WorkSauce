import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import { Metadata } from "next";
import GroupHeader from "@/components/group/GroupHeader";
import StatisticsSection from "@/components/group/StatisticsSection";
import GroupContent from "@/components/group/GroupContent";
import { deleteGroup } from "@/api/firebase/deleteGroup";

export const metadata: Metadata = {
  title: "그룹 진행 현황",
};

export default async function GroupPage({
  params,
}: {
  params: { groupId: string };
}) {
  const groupId = params.groupId;
  const group = (await getGroup(groupId)) as Group;

  if (!group) {
    return <div>그룹을 찾을 수 없습니다.</div>;
  }

  // 통계 데이터 계산
  const stats = {
    totalApplicants: group.applicants.length,
    completedTests: group.applicants.filter(a => a.testStatus === "completed")
      .length,
    pendingTests: group.applicants.filter(a => a.testStatus === "pending")
      .length,
    completionRate: Math.round(
      (group.applicants.filter(a => a.testStatus === "completed").length /
        group.applicants.length) *
        100
    ),
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mx-auto px-4 sm:px-6 lg:px-9 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <GroupHeader group={group} deleteGroup={deleteGroup} />
        <StatisticsSection stats={stats} />
        <GroupContent group={group} stats={stats} groupId={groupId} />
      </div>
    </div>
  );
}
