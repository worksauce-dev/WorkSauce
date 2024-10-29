import Link from "next/link";
import { Group } from "@/types/group";
import { formatDate } from "@/utils/formatDate";
import { getStatusColor, getStatusText } from "@/utils/groupUtils";

interface ApplicantTableProps {
  group: Group;
  groupId: string;
}

export default function ApplicantTable({
  group,
  groupId,
}: ApplicantTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col flex-1 min-h-0">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-indigo-600">지원자 현황</h2>
        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>최신순</option>
          <option>상태순</option>
          <option>이름순</option>
        </select>
      </div>

      <div className="overflow-x-auto flex-1">
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
                className={`${index % 2 === 0 ? "bg-white" : "bg-indigo-50"} ${
                  applicant.testStatus === "completed"
                    ? "cursor-pointer hover:bg-indigo-100 transition-colors"
                    : ""
                }`}
              >
                <td className="border-b border-indigo-200 px-6 py-4">
                  <Link
                    href={
                      applicant.testStatus === "completed"
                        ? `/group/${groupId}/${applicant.name}`
                        : "#"
                    }
                    className="block w-full"
                  >
                    {applicant.name}
                  </Link>
                </td>
                <td className="border-b border-indigo-200 px-6 py-4">
                  <Link
                    href={
                      applicant.testStatus === "completed"
                        ? `/group/${groupId}/${applicant.name}`
                        : "#"
                    }
                    className="block w-full"
                  >
                    {applicant.email}
                  </Link>
                </td>
                <td className="border-b border-indigo-200 px-6 py-4">
                  <Link
                    href={
                      applicant.testStatus === "completed"
                        ? `/group/${groupId}/${applicant.name}`
                        : "#"
                    }
                    className="block w-full"
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        applicant.testStatus
                      )}`}
                    >
                      {getStatusText(applicant.testStatus)}
                    </span>
                  </Link>
                </td>
                <td className="border-b border-indigo-200 px-6 py-4">
                  <Link
                    href={
                      applicant.testStatus === "completed"
                        ? `/group/${groupId}/${applicant.name}`
                        : "#"
                    }
                    className="block w-full"
                  >
                    {applicant.completedAt
                      ? formatDate(applicant.completedAt)
                      : "-"}
                    {applicant.testStatus === "completed" && (
                      <span className="ml-2 text-xs text-indigo-600">
                        (결과 보기)
                      </span>
                    )}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
