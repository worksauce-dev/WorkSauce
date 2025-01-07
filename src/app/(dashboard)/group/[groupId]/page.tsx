import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import { Metadata } from "next";
import StatisticsSection from "@/components/group/StatisticsSection";
import GroupContent from "@/components/group/GroupContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import GroupHeader from "@/components/group/GroupHeader";
import { deleteGroup } from "@/api/firebase/deleteGroup";
import { getUserData } from "@/api/firebase/getUserData";
import { ERROR_MESSAGES } from "@/types/error";
import { handleAppError } from "@/utils/errorHandler";

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
    return handleAppError(ERROR_MESSAGES.AUTH.LOGIN_REQUIRED);
  }

  const groupId = params.groupId;
  const group = (await getGroup(groupId)) as Group;
  const user = await getUserData(session.user.id);
  const isAdmin = user?.isAdmin || false;

  if (!group) {
    return handleAppError(ERROR_MESSAGES.GROUP.NOT_FOUND);
  }

  if (group.createdBy.id !== session.user.id) {
    return handleAppError(ERROR_MESSAGES.GROUP.ACCESS_DENIED);
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
