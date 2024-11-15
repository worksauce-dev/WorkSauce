import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import { Metadata } from "next";
import StatisticsSection from "@/components/group/StatisticsSection";
import GroupContent from "@/components/group/GroupContent";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

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
    <div className="w-full bg-[#F7F7F9] px-4 sm:px-6 sm:py-6 mx-auto lg:px-8 py-6 flex flex-col h-screen gap-4">
      <DashboardHeader
        name={group.name}
        deadline={group.deadline}
        isDeadline={true}
      />
      <StatisticsSection stats={stats} />
      <GroupContent group={group} stats={stats} groupId={groupId} />
    </div>
  );
}
