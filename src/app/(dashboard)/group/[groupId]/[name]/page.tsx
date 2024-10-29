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

  // 디코딩된 이름으로 검색
  const applicant = group.applicants.find(a => a.name === decodedName);
  if (applicant) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mx-auto px-4 sm:px-6 lg:px-9 py-4 sm:py-6">
        <ApplicantScoreCard applicant={applicant} />
      </div>
    );
  }
  return <div>해당 이름의 지원자를 찾을 수 없습니다.</div>;
}
