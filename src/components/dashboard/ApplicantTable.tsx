import Link from "next/link";
import { Applicant } from "@/types/group";
import { MdSearch } from "react-icons/md";

interface ApplicantTableProps {
  applicants: Applicant[];
}

export const ApplicantTable: React.FC<ApplicantTableProps> = ({
  applicants,
}) => {
  if (applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <MdSearch className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-sm text-gray-500">
          다른 검색어나 필터를 시도해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
              이름
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[30%]">
              이메일
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[25%]">
              테스트 그룹
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
              상태
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">
              결과
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applicants.map(applicant => (
            <tr
              key={`${applicant.groupId}-${applicant.email}`}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {applicant.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {applicant.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={`/group/${applicant.groupId}`}
                  className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                >
                  {applicant.groupName}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={applicant.testStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {applicant.testStatus === "completed" && (
                  <Link
                    href={`/group/${applicant.groupId}/${applicant.name}`}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-200 font-medium"
                  >
                    상세보기
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    completed: { bg: "bg-green-100", text: "text-green-800", label: "완료" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "진행 중" },
    expired: { bg: "bg-red-100", text: "text-red-800", label: "만료" },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};
