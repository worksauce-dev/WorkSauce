import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import { Metadata } from "next";
import StatisticsSection from "@/components/group/StatisticsSection";
import GroupContent from "@/components/group/GroupContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { ErrorPage } from "@/components/common/ErrorPage";
import GroupHeader from "@/components/group/GroupHeader";
import { deleteGroup } from "@/api/firebase/deleteGroup";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getUserData } from "@/api/firebase/getUserData";
export const metadata: Metadata = {
  title: "그룹 진행 현황",
};

export default async function GroupPage({
  params,
}: {
  params: { groupId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <ErrorPage
        title="로그인이 필요합니다"
        message="이 페이지에 접근하려면 먼저 로그인해 주세요."
        showHomeButton={true}
      />
    );
  }

  const groupId = params.groupId;
  const group = (await getGroup(groupId)) as Group;

  const user = await getUserData(session.user.id);

  const isAdmin = user?.isAdmin || false;

  if (!group) {
    return (
      <ErrorPage
        title="그룹을 찾을 수 없습니다"
        message="요청하신 그룹이 존재하지 않거나 삭제되었습니다."
        showHomeButton={true}
      />
    );
  }

  if (group.createdBy.id !== session.user.id) {
    return (
      <ErrorPage
        title="접근 권한이 없습니다"
        message="이 그룹에 대한 접근 권한이 없습니다."
        showHomeButton={true}
      />
    );
  }

  // 통계 데이터 계산 최적화
  const completedApplicants = group.applicants.filter(
    a => a.testStatus === "completed"
  );
  const stats = {
    totalApplicants: group.applicants.length,
    completedTests: completedApplicants.length,
    pendingTests: group.applicants.filter(a => a.testStatus === "pending")
      .length,
    completionRate:
      group.applicants.length === 0
        ? 0
        : Math.round(
            (completedApplicants.length / group.applicants.length) * 100
          ),
  };

  return (
    <div className="w-full bg-[#F7F7F9] px-4 sm:px-6 sm:py-6 mx-auto lg:px-8 py-6 flex flex-col h-screen gap-4">
      <div className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100">
        <GroupHeader
          name={group.name}
          deleteGroup={deleteGroup}
          isDeadline={true}
          deadline={group.deadline}
          groupId={groupId}
          isAdmin={isAdmin}
        />
      </div>

      <StatisticsSection stats={stats} />
      <GroupContent group={group} stats={stats} groupId={groupId} />
    </div>
  );
}
