"use client";

import { format } from "date-fns";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { SugarTestResult as SugarTestResultType } from "@/types/sugartest/sugarTestResult";
import SugarScoreCard from "./SugarScoreCard";
import { SugarAnalysisCard } from "./SugarAnalysisCard";
interface SugarTestResultProps {
  testResult: SugarTestResultType;
  groupName: string;
  name: string;
  completedAt: string;
  groupId: string;
}

export default function SugarTestResult({
  testResult,
  groupName,
  name,
  completedAt,
  groupId,
}: SugarTestResultProps) {
  function getStressLevel(score: number) {
    if (score < 2.1) return "LOW";
    if (score > 2.1 && score < 3.1) return "MODERATE";
    if (score > 3.1 && score < 4.1) return "HIGH";
    return "CRITICAL"; // Default case
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      {/* 상단 정보 카드 */}
      <div className="flex-shrink-0 flex flex-col gap-3 rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900">
              {name}
              <span className="text-gray-400 ml-1">님의 결과</span>
            </h1>
            <div className="hidden sm:block h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">그룹</span>
                <span className="font-medium text-gray-900">{groupName}</span>
              </div>
              <div className="h-3 w-px bg-gray-200" />
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">완료일</span>
                <span className="font-medium text-gray-900">
                  {completedAt
                    ? format(new Date(completedAt), "yyyy.MM.dd")
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/group/sugar/${groupId}`}
            className="text-xs font-medium text-primary-accent flex items-center gap-1 hover:bg-orange-50 rounded-md px-2 py-1.5 transition-colors w-fit"
          >
            <MdArrowBack className="text-sm" />
            그룹으로
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 mt-4">
        {/* 추후 다른 컨텐츠가 들어갈 수 있는 공간 */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <SugarAnalysisCard
            score={testResult.metadata.averageScore}
            name={name}
          />
        </div>
        {/* ScoreCard 컨테이너 - overflow-y-auto 추가 */}
        <div className="col-span-12 sm:col-span-8 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <SugarScoreCard
            score={testResult.metadata.averageScore}
            stressLevel={getStressLevel(testResult.metadata.averageScore)}
            categoryScores={testResult.metadata.categoryScores}
          />
        </div>
      </div>
    </div>
  );
}
