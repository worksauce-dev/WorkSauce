import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import ApplicantScoreCard from "@/components/result/ApplicantScoreCard";
import { User } from "@/types/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getSauceResult } from "@/api/firebase/getSauceResult";
import { SauceResultType } from "@/types/test";
import { Metadata } from "next";
import { ErrorPage } from "@/components/common/ErrorPage";

export const metadata: Metadata = {
  title: "지원자 결과",
};

export default async function ApplicantPage({
  params,
}: {
  params: { groupId: string; name: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <ErrorPage
        title="로그인이 필요합니다"
        message="지원자 결과를 확인하려면 먼저 로그인해 주세요."
      />
    );
  }

  const user = session.user as User;
  const groupId = params.groupId;
  const decodedName = decodeURIComponent(params.name);

  const group = (await getGroup(groupId)) as Group;
  if (!group) {
    return (
      <ErrorPage
        title="그룹을 찾을 수 없습니다"
        message="요청하신 그룹이 존재하지 않거나 삭제되었습니다."
      />
    );
  }

  if (user.id !== group.createdBy.id) {
    return (
      <ErrorPage
        title="접근 권한이 없습니다"
        message="이 지원자의 결과를 볼 수 있는 권한이 없습니다."
      />
    );
  }

  const { keywords, applicants } = group;
  const applicant = applicants.find(a => a.name === decodedName);

  if (!applicant) {
    return (
      <ErrorPage
        title="지원자를 찾을 수 없습니다"
        message="해당 이름의 지원자가 존재하지 않습니다."
      />
    );
  }

  const sauceResult = await getSauceResult();
  return (
    <div className="w-full bg-[#F7F7F9] px-4 sm:px-6 sm:py-6 mx-auto lg:px-8 py-6 flex flex-col h-screen gap-4">
      <ApplicantScoreCard
        applicant={applicant}
        keywords={keywords}
        sauceResult={sauceResult as SauceResultType}
      />
    </div>
  );
}
