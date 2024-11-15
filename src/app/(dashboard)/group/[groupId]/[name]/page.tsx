import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import ApplicantScoreCard from "@/components/result/ApplicantScoreCard";
import { User } from "@/types/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export default async function ApplicantPage({
  params,
}: {
  params: { groupId: string; name: string };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  const groupId = params.groupId;
  // URL 디코딩 추가
  const decodedName = decodeURIComponent(params.name);

  const group = (await getGroup(groupId)) as Group;

  if (user?.id !== group.createdBy.id) {
    return <div>권한이 없습니다.</div>;
  }

  const { keywords, applicants } = group;

  // 디코딩된 이름으로 검색
  const applicant = applicants.find(a => a.name === decodedName);
  if (applicant) {
    return (
      <div className="w-full bg-[#F7F7F9] px-4 sm:px-6 sm:py-6 mx-auto lg:px-8 py-6 flex flex-col h-screen gap-4">
        <ApplicantScoreCard applicant={applicant} keywords={keywords} />
      </div>
    );
  }
  return <div>해당 이름의 지원자를 찾을 수 없습니다.</div>;
}
