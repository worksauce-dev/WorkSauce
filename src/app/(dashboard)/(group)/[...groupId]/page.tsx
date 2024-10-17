import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { User } from "@/types/user";
import { FaCalendar, FaClock, FaTags, FaUser } from "react-icons/fa";
import ApplicantScoreCard from "@/components/result/ApplicantScoreCard";

export const metadata: Metadata = {
  title: "그룹 진행 현황",
};

export default async function GroupPage({
  searchParams,
}: {
  searchParams: { groupId: string; name: string };
}) {
  const groupId = searchParams.groupId;
  const group = (await getGroup(groupId)) as Group;
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!group) {
    return <div>그룹을 찾을 수 없습니다.</div>;
  }

  if (user?.id !== group.createdBy.id) {
    return <div>권한이 없습니다.</div>;
  }

  if (searchParams.name) {
    const applicant = group.applicants.find(a => a.name === searchParams.name);

    if (applicant) {
      return <ApplicantScoreCard applicant={applicant} />;
    } else {
      return <div>해당 이름의 지원자를 찾을 수 없습니다.</div>;
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "진행중";
      case "completed":
        return "완료";
      case "expired":
        return "만료";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">
          {group.name} 그룹 정보
        </h1>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <InfoItem
            icon={<FaCalendar className="text-indigo-500" />}
            label="생성일"
            value={new Date(group.createdAt).toLocaleString()}
          />
          <InfoItem
            icon={<FaClock className="text-indigo-500" />}
            label="마감일"
            value={new Date(group.deadline).toLocaleString()}
          />
          <InfoItem
            icon={<FaTags className="text-indigo-500" />}
            label="키워드"
            value={group.keywords.join(", ")}
          />
          <InfoItem
            icon={<FaUser className="text-indigo-500" />}
            label="생성자"
            value={group.createdBy.name}
          />
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-indigo-600">
          지원자 목록
        </h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700">
                <th className="px-6 py-3 text-left">이름</th>
                <th className="px-6 py-3 text-left">이메일</th>
                <th className="px-6 py-3 text-left">상태</th>
                <th className="px-6 py-3 text-left">완료일</th>
              </tr>
            </thead>
            <tbody>
              {group.applicants.map((applicant, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-indigo-50"}
                >
                  <td className="border-b border-indigo-200 px-6 py-4">
                    {applicant.name}
                  </td>
                  <td className="border-b border-indigo-200 px-6 py-4">
                    {applicant.email}
                  </td>
                  <td className="border-b border-indigo-200 px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        applicant.testStatus
                      )}`}
                    >
                      {getStatusText(applicant.testStatus)}
                    </span>
                  </td>
                  <td className="border-b border-indigo-200 px-6 py-4">
                    {applicant.completedAt
                      ? new Date(applicant.completedAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-3 bg-indigo-50 p-4 rounded-lg">
      {icon}
      <div>
        <span className="font-semibold text-indig o-700">{label}:</span>
        <span className="ml-2 text-gray-700">{value}</span>
      </div>
    </div>
  );
}
