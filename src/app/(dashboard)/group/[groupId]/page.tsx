import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { User } from "@/types/user";
import ApplicantScoreCard from "@/components/result/ApplicantScoreCard";
import ApplicantTable from "@/components/group/ApplicantTable";
import GroupHeader from "@/components/group/GroupHeader";
import StatisticsSection from "@/components/group/StatisticsSection";
import KeywordAnalysis from "@/components/group/KeywordAnalysis";

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
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <GroupHeader group={group} />
        <StatisticsSection stats={stats} />
        <KeywordAnalysis group={group} stats={stats} />
        <ApplicantTable group={group} groupId={groupId} />
      </div>
    </div>
  );
}
