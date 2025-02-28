"use client";

import { useState } from "react";
import { Group } from "@/types/group";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { formatDateToKorean } from "@/utils/dateUtils";
import { StatusBadge } from "@/components/common/StatusBadge";
interface SugarGroupContentProps {
  group: Group;
  stats: {
    totalApplicants: number;
    completedTests: number;
    pendingTests: number;
    completionRate: number;
  };
  groupId: string;
  categoryAverages: {
    [key: string]: number;
  };
}

export default function SugarGroupContent({
  group,
  stats,
  groupId,
}: SugarGroupContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending"
  >("all");

  // 지원자 필터링
  const filteredApplicants = group.applicants.filter(applicant => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || applicant.testStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 flex flex-col h-full">
      {/* 필터 섹션 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="이름 또는 이메일로 검색"
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-full
                bg-gray-50/50 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300
                transition-all duration-200"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <select
            value={statusFilter}
            onChange={e =>
              setStatusFilter(e.target.value as "all" | "completed" | "pending")
            }
            className="px-4 py-3 border border-gray-200 rounded-lg
              bg-gray-50/50 text-gray-700
              focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300
              transition-all duration-200"
          >
            <option value="all">모든 상태</option>
            <option value="completed">완료</option>
            <option value="pending">진행중</option>
          </select>
        </div>
      </div>

      {/* 테이블 섹션 */}
      <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50/70">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                완료일
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결과
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApplicants.map((applicant, index) => (
              <tr
                key={`${applicant.email}-${index}`}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {applicant.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {applicant.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateToKorean(applicant.completedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={applicant.testStatus} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {applicant.testStatus === "completed" ? (
                    <Link
                      href={`/group/sugar/${groupId}/${applicant.name}`}
                      className="text-orange-600 hover:text-orange-700 transition-colors duration-200 font-medium"
                    >
                      상세보기
                    </Link>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 검색 결과가 없을 때 */}
        {filteredApplicants.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
