import Link from "next/link";
import { Applicant, Group } from "@/types/group";
import { getStatusColor, getStatusText } from "@/utils/groupUtils";
import { getApplicantType } from "@/utils/getApplicantTypeForGroup";
import { memo, useMemo } from "react";

interface ApplicantTableProps {
  group: Group;
  groupId: string;
  selectedKeyword: string | "전체";
  onKeywordSelect: (keyword: string | "전체") => void;
}

// 테이블 행을 별도의 컴포넌트로 분리
const ApplicantRow = memo(
  ({
    applicant,
    index,
    groupId,
  }: {
    applicant: Applicant;
    index: number;
    groupId: string;
  }) => {
    const types = useMemo(
      () => getApplicantType(applicant.testResult),
      [applicant.testResult]
    );
    const isCompleted = applicant.testStatus === "completed";
    const href = isCompleted ? `/group/${groupId}/${applicant.name}` : "#";

    // 모바일 카드 뷰
    return (
      <tr
        className={`
          ${index % 2 === 0 ? "bg-white" : "bg-orange-50"}
          ${
            isCompleted
              ? "cursor-pointer hover:bg-orange-100 transition-colors"
              : ""
          }
          md:table-row flex flex-col border-b border-orange-200
        `}
      >
        <td className="md:border-b md:border-orange-200 px-6 py-4">
          <div className="md:hidden font-semibold text-gray-500 mb-1">이름</div>
          <Link href={href} className="block w-full">
            {applicant.name}
          </Link>
        </td>
        <td className="md:border-b md:border-orange-200 px-6 py-4">
          <div className="md:hidden font-semibold text-gray-500 mb-1">유형</div>
          <Link href={href} className="block w-full">
            {!types.main ? (
              "-"
            ) : (
              <>
                <span className="font-medium">{types.main}</span>
                {types.sub && (
                  <span className="text-gray-500 text-sm ml-2">
                    / {types.sub}
                  </span>
                )}
              </>
            )}
          </Link>
        </td>
        <td className="md:border-b md:border-orange-200 px-6 py-4">
          <div className="md:hidden font-semibold text-gray-500 mb-1">상태</div>
          <Link href={href} className="block w-full">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                applicant.testStatus
              )}`}
            >
              {getStatusText(applicant.testStatus)}
            </span>
          </Link>
        </td>
        <td className="md:border-b md:border-orange-200 px-6 py-4">
          <div className="md:hidden font-semibold text-gray-500 mb-1">
            완료일
          </div>
          <Link href={href} className="block w-full">
            {applicant.completedAt
              ? `${new Date(applicant.completedAt).getMonth() + 1}월 ${new Date(
                  applicant.completedAt
                ).getDate()}일`
              : "-"}
            {applicant.testStatus === "completed" && (
              <span className="ml-2 text-xs text-orange-500">(결과 보기)</span>
            )}
          </Link>
        </td>
      </tr>
    );
  }
);
ApplicantRow.displayName = "ApplicantRow";

export default function ApplicantTable({
  group,
  groupId,
  selectedKeyword,
  onKeywordSelect,
}: ApplicantTableProps) {
  const filteredApplicants = useMemo(
    () =>
      selectedKeyword === "전체"
        ? group.applicants
        : group.applicants
            .filter(applicant => applicant.testStatus === "completed")
            .filter(applicant => {
              const types = getApplicantType(applicant.testResult);
              return (
                types.main === selectedKeyword || types.sub === selectedKeyword
              );
            }),
    [group.applicants, selectedKeyword]
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col flex-1 min-h-0 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900">
          {`${selectedKeyword} 지원자 현황`}
        </h2>
        <button
          className="border rounded-lg px-3 py-2 text-sm mt-2 md:mt-0"
          onClick={() => onKeywordSelect("전체")}
        >
          전체보기
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full table-auto">
          <thead className="hidden md:table-header-group bg-orange-100 text-gray-900">
            <tr>
              <th className="px-6 py-3 text-left">이름</th>
              <th className="px-6 py-3 text-left">유형</th>
              <th className="px-6 py-3 text-left">상태</th>
              <th className="px-6 py-3 text-left">완료일</th>
            </tr>
          </thead>
          <tbody className="md:table-row-group">
            {filteredApplicants.map((applicant, index) => (
              <ApplicantRow
                key={applicant.name}
                applicant={applicant}
                index={index}
                groupId={groupId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
