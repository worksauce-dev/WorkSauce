"use client";

import { useState } from "react";
import { Group } from "@/types/group";
import {
  RadarChart,
  ResponsiveContainer,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  STRESS_LEVELS,
  CATEGORY_TRANSLATIONS,
  CategoryKey,
} from "@/constants/sugartest";
import { CustomTooltip } from "./CustomTooltip";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "업무 부담": "업무량, 시간 압박, 책임감 등으로 인한 스트레스 수준",
  불확실성: "업무의 불명확성, 예측 불가능성으로 인한 부담감",
  "대인관계 갈등": "동료, 상사와의 관계에서 발생하는 긴장과 갈등 정도",
  "업무 자율성 부족": "업무 수행 방식과 의사결정에서의 자율성 제한",
  "보상과 인정 부족": "노력과 성과에 대한 적절한 보상이나 인정 부족",
};

interface SugarGroupInsightsProps {
  group: Group;
  categoryAverages: Record<CategoryKey, number>;
  sugarMetaData: {
    averageScore: number;
    categoryScores: Record<string, { total: number; average: number }>;
    lastGroupId: string;
    lastTestAt: string;
    testCount: number;
  };
}
interface CategoryScore {
  name: string;
  score: number;
}

export default function SugarGroupInsights({
  group,
  categoryAverages,
  sugarMetaData,
}: SugarGroupInsightsProps) {
  const [activeTab, setActiveTab] = useState<"insights" | "distribution">(
    "insights"
  );

  const completedApplicants = group.applicants.filter(
    a => a.testStatus === "completed"
  );

  // 스트레스 수준별 분포 계산
  const stressLevelDistribution =
    calculateStressDistribution(completedApplicants);

  function translateCategoryAverages(
    categoryAverages: Record<CategoryKey, number>
  ) {
    return Object.fromEntries(
      Object.entries(categoryAverages).map(([key, value]) => [
        CATEGORY_TRANSLATIONS[key as CategoryKey] || key,
        value,
      ])
    );
  }

  const koreanCategoryAverages = translateCategoryAverages(categoryAverages);

  // 위험군 식별 (상위 25% 이상)
  const riskAnalysis = analyzeRiskFactors(
    completedApplicants,
    koreanCategoryAverages
  );

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 h-full">
      {/* 탭 컨텐츠 */}
      <div className="p-6 space-y-4">
        {/* 주요 현황 섹션 헤더와 탭 */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">주요 현황</h4>
          <div className="flex bg-gray-50/80 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("insights")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTab === "insights"
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              현황 및 제안
            </button>
            <button
              onClick={() => setActiveTab("distribution")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTab === "distribution"
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              카테고리별 분포
            </button>
          </div>
        </div>

        {activeTab === "insights" && (
          <>
            {/* 카드 그리드 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50/60 p-4 rounded-lg ring-1 ring-orange-100/80 hover:bg-orange-50/70 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100/80 p-2 rounded-lg">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    관심 필요 영역
                  </span>
                </div>
                {riskAnalysis.highStressCategories.slice(0, 2).map(category => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-gray-600">
                      {category.name}
                    </span>
                    <span className="text-sm font-medium text-orange-600">
                      {Number.isNaN(category.score)
                        ? "알 수 없음"
                        : category.score.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50/60 p-4 rounded-lg ring-1 ring-blue-100/80 hover:bg-blue-50/70 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100/80 p-2 rounded-lg">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    전반적 현황
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 py-2">
                    관리 대상:{" "}
                    {Number.isNaN(riskAnalysis.riskPercentage)
                      ? "알 수 없음"
                      : `${riskAnalysis.riskPercentage}%`}
                  </p>
                  <p className="text-sm text-gray-600 py-2">
                    평균 대비:{" "}
                    {Number.isNaN(categoryAverages)
                      ? "알 수 없음"
                      : getComparisonText(categoryAverages)}
                  </p>
                </div>
              </div>
            </div>

            {/* 개선 제안 섹션 */}
            <div className="space-y-6">
              <h4 className="text-sm font-medium text-gray-700 mt-6">
                개선 제안
              </h4>
              <div className="space-y-4 bg-gray-50/50 p-4 rounded-lg">
                {generateRecommendations(riskAnalysis).map((rec, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="bg-emerald-100/80 p-1.5 rounded-md mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "distribution" && (
          <div className="p-6">
            <div className="h-[300px] bg-gray-50/30 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={Object.entries(koreanCategoryAverages).map(
                    ([key, value]) => {
                      const description =
                        CATEGORY_DESCRIPTIONS[key] ||
                        CATEGORY_DESCRIPTIONS[
                          Object.entries(CATEGORY_TRANSLATIONS).find(
                            ([_, translated]) => translated === key
                          )?.[0] || key
                        ];

                      // sugarMetaData에서 해당 카테고리의 전체 평균 가져오기
                      const overallAverage =
                        sugarMetaData.categoryScores[
                          Object.entries(CATEGORY_TRANSLATIONS).find(
                            ([_, translated]) => translated === key
                          )?.[0] || key
                        ]?.average || 0;

                      return {
                        category: key,
                        groupValue: value,
                        overallValue: overallAverage,
                        description: description,
                      };
                    }
                  )}
                >
                  <PolarGrid strokeDasharray="3 3" stroke="#9CA3AF" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fontSize: "12px", fill: "#4B5563" }}
                  />
                  <PolarRadiusAxis
                    tick={{ fontSize: "11px", fill: "#6B7280" }}
                    stroke="#9CA3AF"
                    domain={[0, 5]}
                    tickCount={6}
                  />
                  {/* 그룹 평균 */}
                  <Radar
                    name="그룹 평균"
                    dataKey="groupValue"
                    fill="#f97316"
                    fillOpacity={0.6}
                    stroke="#f97316"
                    strokeWidth={2}
                  />
                  {/* 전체 평균 */}
                  <Radar
                    name="전체 평균"
                    dataKey="overallValue"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 헬퍼 함수들
function calculateStressDistribution(applicants: any[]) {
  // 스트레스 수준별 분포 계산 로직
  return STRESS_LEVELS.map(level => ({
    name: level.label,
    count: applicants.filter(
      a =>
        a.testResult?.metadata?.averageScore >= level.min &&
        a.testResult?.metadata?.averageScore <= level.max
    ).length,
  }));
}

function analyzeRiskFactors(applicants: any[], categoryAverages: any) {
  const highStressCategories = Object.entries(categoryAverages)
    .map(([name, score]) => ({ name, score: score as number }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) as CategoryScore[];

  const riskPercentage = Math.round(
    (applicants.filter(a => a.testResult?.metadata?.averageScore > 7).length /
      applicants.length) *
      100
  );

  const insights = generateInsights(highStressCategories, riskPercentage);

  return {
    highStressCategories,
    riskPercentage,
    insights,
  };
}

function generateInsights(
  highStressCategories: CategoryScore[],
  riskPercentage: number
) {
  const insights = [
    `전체 지원자 중 ${riskPercentage}%가 높은 스트레스 수준을 보이고 있습니다.`,
    `${highStressCategories[0].name} 영역에서 가장 높은 스트레스 지수가 관찰됩니다.`,
    "정기적인 스트레스 관리 프로그램 도입을 고려해볼 수 있습니다.",
    "부서 배치 시 개인별 스트레스 대응 방식을 고려하는 것이 좋습니다.",
  ];

  return insights;
}

function getComparisonText(categoryAverages: { [key: string]: number }) {
  const avgScore =
    Object.values(categoryAverages).reduce((a: number, b: number) => a + b, 0) /
    Object.values(categoryAverages).length;
  return avgScore > 7 ? "주의 필요" : avgScore > 5 ? "평균 수준" : "양호";
}

function generateRecommendations(riskAnalysis: any) {
  const recommendations = [
    `${riskAnalysis.highStressCategories[0].name} 영역에 대한 즉각적인 관리 방안 수립`,
    "정기적인 스트레스 체크인 프로그램 운영",
    "부서별 맞춤형 지원 체계 구축",
  ];
  return recommendations;
}
