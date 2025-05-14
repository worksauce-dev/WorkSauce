"use client";

import { format } from "date-fns";
import Link from "next/link";
import { MdHome, MdRefresh } from "react-icons/md";
import { SugarTestResult } from "@/types/sugartest/sugarTestResult";
import SugarScoreCard from "./SugarScoreCard";
import { SugarAnalysisCard } from "./SugarAnalysisCard";
import {
  stressUtils,
  getStressLevelByTestResult,
  calculateCategoryScore,
} from "../utils/getStressLevel";

interface SugarTestCompletionResultProps {
  name: string;
  testResult: SugarTestResult;
}

const SugarTestCompletionResult = ({
  name,
  testResult,
}: SugarTestCompletionResultProps) => {
  const stressLevel = getStressLevelByTestResult(testResult);
  const categoryScores = calculateCategoryScore(testResult);
  return (
    <div className="bg-[#F7F7F9] border-b-2 border-gray-100 min-h-screen py-12 px-2 sm:px-6 lg:px-16 pt-20 sm:pt-32 mx-auto">
      <div className="flex flex-col h-full min-h-[calc(100vh-theme(spacing.16))]">
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
                  <span className="text-gray-500">완료일</span>
                  <span className="font-medium text-gray-900">
                    {testResult.createdAt
                      ? format(new Date(testResult.createdAt), "yyyy.MM.dd")
                      : "방금 전"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href="/"
                className="text-xs font-medium text-gray-600 flex items-center gap-1 hover:bg-gray-100 rounded-md px-2 py-1.5 transition-colors w-fit"
              >
                <MdHome className="text-sm" />
                홈으로
              </Link>
              {/* <button
              onClick={() => window.location.reload()}
              className="text-xs font-medium text-primary-accent flex items-center gap-1 hover:bg-orange-50 rounded-md px-2 py-1.5 transition-colors w-fit"
            >
              <MdRefresh className="text-sm" />
              다시 테스트하기
            </button> */}
            </div>
          </div>
        </div>

        {/* 테스트 완료 메시지 */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 mt-4 text-sm text-green-800">
          <p className="font-medium">
            슈가 테스트가 성공적으로 완료되었습니다!
          </p>
          <p className="text-xs mt-1">
            아래에서 상세한 분석 결과를 확인하세요.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 mt-4">
          {/* 분석 카드 */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            <SugarAnalysisCard scores={categoryScores} name={name} />
          </div>
          {/* 점수 카드 */}
          <div className="col-span-12 sm:col-span-8 md:col-span-6 lg:col-span-4 xl:col-span-3">
            <SugarScoreCard scores={categoryScores} />
          </div>
        </div>

        {/* 결과 저장 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
          <p>
            이 결과는 자동으로 저장되었습니다. 해당 주소로 언제든지 다시 확인할
            수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SugarTestCompletionResult;
