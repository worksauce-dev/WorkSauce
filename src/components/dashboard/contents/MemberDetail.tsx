"use client";

import { UserTeam } from "@/types/user";
import {
  MdEmail,
  MdPerson,
  MdClose,
  MdExpandMore,
  MdExpandLess,
  MdInfo,
} from "react-icons/md";
import { useState } from "react";
import { ANALYSIS_DATA } from "@/constants/sugartest";

interface MemberDetailProps {
  userTeam: UserTeam[];
}

interface TestResult {
  name: string;
  score: number;
  status: string;
  date: string;
  categories: Record<string, number[]>;
  metadata: {
    totalScore: number;
    averageScore: number;
    categoryScores: Record<string, { average: number; total: number }>;
  };
}

interface CategoryDescription {
  name: string;
  subLabel: string;
  color: string;
  descriptions: {
    low: string;
    moderate: string;
    high: string;
    critical: string;
  };
}

interface TestDescription {
  title: string;
  description: string;
  categoryDescriptions: Record<string, CategoryDescription>;
}

const testDescriptions: Record<string, TestDescription> = {
  sugarTest: {
    title: "SUGAR 테스트",
    description: "스트레스 진단 도구",
    categoryDescriptions: {
      strain: {
        name: "Strain",
        subLabel: "업무 부담",
        color: "bg-yellow-400",
        descriptions: {
          low: "업무량이 적절히 관리되고 있으며, 스트레스가 낮은 수준입니다.",
          moderate:
            "업무 부담이 다소 증가하여 주의가 필요하며, 업무 배분 조정이 권장됩니다.",
          high: "업무량과 난이도로 인한 높은 부담감이 발생하여, 업무 조정이 필요합니다.",
          critical:
            "심각한 수준의 업무 과부하 상태로, 즉각적인 업무량 조절과 지원이 필요합니다.",
        },
      },
      uncertainty: {
        name: "Uncertainty",
        subLabel: "불확실성",
        color: "bg-blue-400",
        descriptions: {
          low: "업무 방향과 목표가 명확하며, 안정적인 업무 수행이 이루어지고 있습니다.",
          moderate:
            "보통 수준의 불확실성이 있으며, 정기적 업데이트와 피드백이 필요합니다.",
          high: "업무의 불확실성이 높아 불안감이 증가하고 있어, 명확한 지침 설정이 필요합니다.",
          critical:
            "극심한 불확실성으로 인한 업무 혼란이 발생하여, 즉각적인 방향성 제시가 필요합니다.",
        },
      },
      grievance: {
        name: "Grievance",
        subLabel: "대인관계 갈등",
        color: "bg-orange-400",
        descriptions: {
          low: "원활한 대인관계가 유지되고 있으며, 협업이 잘 이루어지고 있습니다.",
          moderate:
            "일부 대인관계에서 경미한 갈등이 있으나, 일상적인 수준에서 관리되고 있습니다.",
          high: "주의가 필요한 수준의 갈등이 있어, 중재 프로그램 검토가 필요합니다.",
          critical:
            "심각한 대인관계 갈등으로 인한 업무 차질이 발생하여, 전문적 개입이 필요합니다.",
        },
      },
      autonomy: {
        name: "Autonomy",
        subLabel: "업무 자율성",
        color: "bg-green-400",
        descriptions: {
          low: "적절한 수준의 업무 자율성이 보장되어, 창의적인 업무 수행이 가능합니다.",
          moderate:
            "업무 자율성이 다소 제한되어 있으나, 기본적인 의사결정은 가능한 상태입니다.",
          high: "업무 자율성 부족으로 인한 답답함이 크며, 의사결정 구조 개선이 필요합니다.",
          critical:
            "심각한 수준의 자율성 제한으로, 업무 효율성과 만족도가 크게 저하되었습니다.",
        },
      },
      recognition: {
        name: "Recognition",
        subLabel: "보상과 인정",
        color: "bg-purple-400",
        descriptions: {
          low: "노력과 성과에 대한 적절한 인정과 보상이 이루어지고 있습니다.",
          moderate:
            "보상과 인정이 다소 미흡하여, 공정한 평가체계 개선이 필요합니다.",
          high: "성과에 대한 인정이 부족하여 사기가 저하되고 있으며, 보상체계 점검이 시급합니다.",
          critical:
            "심각한 수준의 보상 불균형으로 인해 이직 위험이 높아, 즉각적인 개선이 필요합니다.",
        },
      },
    },
  },
  sauceTest: {
    title: "SAUCE 테스트",
    description: "직무 실행 유형 진단 도구",
    categoryDescriptions: {},
  },
};

const getScoreLevel = (score: number) => {
  if (score >= 4) return "critical";
  if (score >= 3) return "high";
  if (score >= 2) return "moderate";
  return "low";
};

const getScoreColor = (score: number) => {
  if (score >= 4) return "bg-red-500";
  if (score >= 2) return "bg-yellow-500";
  return "bg-green-500";
};

const getStatusColor = (score: number) => {
  if (score >= 4) return "bg-red-100 text-red-600";
  if (score >= 3) return "bg-yellow-100 text-yellow-600";
  if (score >= 2) return "bg-blue-100 text-blue-600";
  return "bg-green-100 text-green-600";
};

const getStatusText = (score: number) => {
  if (score >= 4) return "심각한 상태";
  if (score >= 3) return "주의가 필요한 상태";
  if (score >= 2) return "관리가 필요한 상태";
  return "양호한 상태";
};

const TestDetail: React.FC<{
  testResult: TestResult | null;
  memberName: string;
}> = ({ testResult, memberName }) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    currentStatus: true,
    workManagement: false,
    organizationalLife: false,
    suggestion: false,
    categories: true,
  });

  if (!testResult) return null;

  const testInfo =
    testDescriptions[testResult.name as keyof typeof testDescriptions];
  const { categories, metadata } = testResult;
  const averageScore = metadata.averageScore.toFixed(1);
  const scoreLevel = getScoreLevel(metadata.averageScore);

  const analysisData = ANALYSIS_DATA[
    scoreLevel.toUpperCase() as keyof typeof ANALYSIS_DATA
  ](memberName, averageScore);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {testInfo.title}
          </h3>
          <p className="text-sm text-gray-500">{testInfo.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full ${getScoreColor(
              metadata.averageScore
            )} flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110`}
          >
            <span className="text-xl font-bold text-white">{averageScore}</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">평균 점수</p>
            <p className="text-sm font-medium text-gray-700">
              {getStatusText(metadata.averageScore)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* 카테고리별 분석 */}
        {testResult.name === "sugarTest" && (
          <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
            <button
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => toggleSection("categories")}
            >
              <h4 className="text-sm font-medium text-gray-900">
                카테고리별 분석
              </h4>
              {expandedSections.categories ? (
                <MdExpandLess className="w-5 h-5 text-gray-500 transition-transform duration-200" />
              ) : (
                <MdExpandMore className="w-5 h-5 text-gray-500 transition-transform duration-200" />
              )}
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                expandedSections.categories ? "max-h-[2000px]" : "max-h-0"
              } overflow-hidden`}
            >
              <div className="p-4 space-y-4">
                {Object.entries(categories).map(([categoryKey, scores]) => {
                  const categoryInfo =
                    testInfo.categoryDescriptions[categoryKey];
                  if (!categoryInfo) return null;

                  const averageScore =
                    scores.reduce((a, b) => a + b, 0) / scores.length;
                  const scoreLevel = getScoreLevel(averageScore);

                  return (
                    <div
                      key={categoryKey}
                      className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">
                            {categoryInfo.name}
                          </h5>
                          <p className="text-xs text-gray-500">
                            {categoryInfo.subLabel}
                          </p>
                        </div>
                        <div
                          className={`w-10 h-10 rounded-full ${getScoreColor(
                            averageScore
                          )} flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110`}
                        >
                          <span className="text-sm font-bold text-white">
                            {averageScore.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {categoryInfo.descriptions[scoreLevel]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 현재 상태 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
          <button
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => toggleSection("currentStatus")}
          >
            <h4 className="text-sm font-medium text-gray-900">현재 상태</h4>
            {expandedSections.currentStatus ? (
              <MdExpandLess className="w-5 h-5 text-gray-500 transition-transform duration-200" />
            ) : (
              <MdExpandMore className="w-5 h-5 text-gray-500 transition-transform duration-200" />
            )}
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.currentStatus ? "max-h-96" : "max-h-0"
            } overflow-hidden`}
          >
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                {analysisData.currentStatus.description}
              </p>
            </div>
          </div>
        </div>

        {/* 업무 관리 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
          <button
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => toggleSection("workManagement")}
          >
            <h4 className="text-sm font-medium text-gray-900">업무 관리</h4>
            {expandedSections.workManagement ? (
              <MdExpandLess className="w-5 h-5 text-gray-500 transition-transform duration-200" />
            ) : (
              <MdExpandMore className="w-5 h-5 text-gray-500 transition-transform duration-200" />
            )}
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.workManagement ? "max-h-96" : "max-h-0"
            } overflow-hidden`}
          >
            <div className="p-4 space-y-4">
              <ul className="list-disc list-inside space-y-2">
                {analysisData.currentStatus.workManagement.items.map(
                  (item, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 조직 생활 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
          <button
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => toggleSection("organizationalLife")}
          >
            <h4 className="text-sm font-medium text-gray-900">조직 생활</h4>
            {expandedSections.organizationalLife ? (
              <MdExpandLess className="w-5 h-5 text-gray-500 transition-transform duration-200" />
            ) : (
              <MdExpandMore className="w-5 h-5 text-gray-500 transition-transform duration-200" />
            )}
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.organizationalLife ? "max-h-96" : "max-h-0"
            } overflow-hidden`}
          >
            <div className="p-4 space-y-4">
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    {analysisData.organizationalLife.current.title}
                  </h5>
                  <ul className="list-disc list-inside space-y-2">
                    {analysisData.organizationalLife.current.items.map(
                      (item, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  {analysisData.organizationalLife.potential.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 제안사항 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
          <button
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => toggleSection("suggestion")}
          >
            <h4 className="text-sm font-medium text-gray-900">제안사항</h4>
            {expandedSections.suggestion ? (
              <MdExpandLess className="w-5 h-5 text-gray-500 transition-transform duration-200" />
            ) : (
              <MdExpandMore className="w-5 h-5 text-gray-500 transition-transform duration-200" />
            )}
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.suggestion ? "max-h-96" : "max-h-0"
            } overflow-hidden`}
          >
            <div className="p-4 space-y-6">
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">
                  {analysisData.suggestion.shortTerm.title} (
                  {analysisData.suggestion.shortTerm.period})
                </h5>
                <ul className="list-disc list-inside space-y-2">
                  {analysisData.suggestion.shortTerm.items.map(
                    (item, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">
                  {analysisData.suggestion.longTerm.title} (
                  {analysisData.suggestion.longTerm.period})
                </h5>
                <ul className="list-disc list-inside space-y-2">
                  {analysisData.suggestion.longTerm.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 종합 의견 */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <MdInfo className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="text-base font-semibold text-blue-900">종합 의견</h4>
          </div>
          <div className="pl-11">
            <p className="text-sm text-blue-800 leading-relaxed">
              {analysisData.overallOpinion.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemberDetail = ({ userTeam }: MemberDetailProps) => {
  const member = userTeam[0]?.members[0];
  const testResults: TestResult[] = [
    {
      name: "sugarTest",
      score:
        member.testStatuses.find(test => test.testId === "sugar")?.result
          ?.metadata?.averageScore || 0,
      status: getStatusText(
        member.testStatuses.find(test => test.testId === "sugar")?.result
          ?.metadata?.averageScore || 0
      ),
      date:
        member.testStatuses.find(test => test.testId === "sugar")?.result
          ?.createdAt || "",
      categories:
        member.testStatuses.find(test => test.testId === "sugar")?.result
          ?.categories || {},
      metadata: member.testStatuses.find(test => test.testId === "sugar")
        ?.result?.metadata || {
        totalScore: 0,
        averageScore: 0,
        categoryScores: {},
      },
    },
    {
      name: "sauceTest",
      score: 3.2,
      status: "주의가 필요한 상태",
      date: "2024-03-20",
      categories: {},
      metadata: {
        totalScore: 0,
        averageScore: 3.2,
        categoryScores: {},
      },
    },
  ];
  const [selectedTest, setSelectedTest] = useState<TestResult>(testResults[0]);

  if (!member) return null;

  const { name, email } = member;

  const handleTestClick = (test: TestResult) => {
    setSelectedTest(test);
  };

  return (
    <div className="space-y-6">
      {/* 상단 섹션 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
        {/* 멤버 기본 정보 */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <MdPerson className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
            <div className="flex items-center gap-2 text-gray-500">
              <MdEmail className="w-5 h-5" />
              <span>{email}</span>
            </div>
          </div>
        </div>

        {/* 테스트 결과 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testResults.map(test => (
            <div
              key={test.name}
              className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedTest?.name === test.name
                  ? "border-blue-500 shadow-md scale-[1.02]"
                  : "border-gray-200 hover:shadow-md hover:scale-[1.01]"
              }`}
              onClick={() => handleTestClick(test)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-800">
                  {
                    testDescriptions[test.name as keyof typeof testDescriptions]
                      .title
                  }
                </h3>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    test.score
                  )}`}
                >
                  {test.status}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${getScoreColor(
                    test.score
                  )} flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110`}
                >
                  <span className="text-lg font-bold text-white">
                    {test.score}
                  </span>
                </div>
                <div className="flex justify-between w-full">
                  <p className="text-sm text-gray-500">평균 점수</p>
                  <p className="text-sm text-gray-500">
                    최근 진단 일자:{" "}
                    {new Date(test.date).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 섹션 */}
      <TestDetail testResult={selectedTest} memberName={name} />
    </div>
  );
};

export default MemberDetail;
