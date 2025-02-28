import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import GroupHeader from "@/components/group/GroupHeader";
import { deleteGroup } from "@/api/firebase/deleteGroup";
import { getUserData } from "@/api/firebase/getUserData";
import { ERROR_MESSAGES } from "@/types/error";
import { handleAppError } from "@/utils/errorHandler";
import SugarStatisticsSection from "@/components/group/sugar/SugarStatisticsSection";
import SugarGroupContent from "@/components/group/sugar/SugarGroupContent";
import SugarGroupInsights from "@/components/group/sugar/SugarGroupInsights";
import { CategoryKey, CATEGORIES } from "@/constants/sugartest";
import { User } from "@/types/user";
export const metadata: Metadata = {
  title: "슈가테스트 그룹 현황",
};

export default async function SugarGroupPage({
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

  // 기본 통계 계산
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

  // 카테고리별 평균 점수 계산
  const categoryAverages = calculateCategoryAverages(completedApplicants);
  const { sugarMetaData } = user as User;

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

      <SugarStatisticsSection
        stats={stats}
        categoryAverages={categoryAverages}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        <SugarGroupInsights
          group={group}
          categoryAverages={categoryAverages}
          sugarMetaData={sugarMetaData}
        />

        <SugarGroupContent
          group={group}
          stats={stats}
          groupId={groupId}
          categoryAverages={categoryAverages}
        />
      </div>
    </div>
  );
}

function calculateCategoryAverages(
  completedApplicants: any[]
): Record<CategoryKey, number> {
  const categoryAverages = {} as Record<CategoryKey, number>;

  CATEGORIES.forEach(category => {
    categoryAverages[category] = 0;
  });

  completedApplicants.forEach(applicant => {
    if (!applicant.testResult?.metadata?.categoryScores) return;

    Object.entries(applicant.testResult.metadata.categoryScores).forEach(
      entry => {
        const [category, scores] = entry as [CategoryKey, { average: number }];
        categoryAverages[category] += scores.average;
      }
    );
  });

  // 각 카테고리의 평균 계산
  Object.keys(categoryAverages).forEach(category => {
    categoryAverages[category as CategoryKey] = Number(
      (
        categoryAverages[category as CategoryKey] / completedApplicants.length
      ).toFixed(2)
    );
  });

  return categoryAverages;
}
