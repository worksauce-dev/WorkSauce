"use client";

import {
  MdPerson,
  MdPeople,
  MdNote,
  MdKeyboardArrowDown,
  MdArrowBack,
  MdEdit,
} from "react-icons/md";
import Breadcrumb from "./Breadcrumb";
import {
  STRESS_LEVELS,
  CATEGORY_KR_TRANSLATIONS,
  ANALYSIS_DATA,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_EN_TRANSLATIONS,
} from "@/constants/sugartest";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { UserTeam, Members, TestInfo, SauceResult } from "@/types/user";
import { useState } from "react";
import CustomDropdown from "@/components/common/CustomDropdown";
import { calculateCategoryScore } from "@/components/test/sugartest/utils/getStressLevel";
import { SugarTestResult } from "@/types/sugartest/sugarTestResult";
interface MemberDetailProps {
  selectedMember: Members;
  selectedTeam: UserTeam | null;
  setIsChangeTeamModalOpen: (open: boolean) => void;
  selectedView: "teams" | "team" | "member";
  setSelectedView: (view: "teams" | "team" | "member") => void;
  setSelectedTeam: (team: UserTeam | null) => void;
  setSelectedMember: (member: Members | null) => void;
  fetchTests: TestInfo[];
}

interface TestType {
  id: "sugar" | "sauce";
  name: string;
  result?: {
    categories: Record<string, number[]>;
    metadata: {
      history: Array<{
        date: string;
        categories: Record<string, number[]>;
      }>;
    };
  };
}

const MemberDetail = ({
  selectedMember,
  selectedTeam,
  setIsChangeTeamModalOpen,
  selectedView,
  setSelectedView,
  setSelectedTeam,
  setSelectedMember,
  fetchTests,
}: MemberDetailProps) => {
  const [selectedTest, setSelectedTest] = useState<"sugar" | "sauce">("sugar");

  const { testIds } = selectedMember;
  const matchedTests = fetchTests.filter(test => testIds.includes(test.testId));
  const latestTest = matchedTests
    .filter(test => test.type === selectedTest)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  const applicant = latestTest.applicants.find(
    app => app.id === selectedMember.id
  );

  if (!applicant) {
    return null;
  }

  const result = applicant.testResult as SugarTestResult;
  const completedAt = applicant.completedAt;

  function translateCategoryKeyToKR(key: string) {
    return CATEGORY_KR_TRANSLATIONS[
      key as keyof typeof CATEGORY_KR_TRANSLATIONS
    ];
  }

  function translateCategoryKeyToEN(key: string) {
    return CATEGORY_EN_TRANSLATIONS[
      key as keyof typeof CATEGORY_EN_TRANSLATIONS
    ];
  }

  const categoryScore = calculateCategoryScore(result);
  const averageScore =
    Object.values(categoryScore).reduce((acc, curr) => acc + curr, 0) /
    Object.keys(categoryScore).length;

  console.log(averageScore);

  return (
    <div className="">
      <Breadcrumb
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
      />
      <div className="space-y-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <header className="border-b border-gray-100 pb-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <MdPerson className="text-3xl text-orange-500" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {selectedMember?.name}
                    </h1>
                    <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                      <span className="text-orange-900 font-medium">
                        {selectedTeam?.name}
                      </span>
                    </div>
                  </div>
                  <p className="text-base text-gray-500 mt-1">
                    {selectedMember?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <CustomDropdown
                  fullWidth={false}
                  options={[
                    { id: "sugar", name: "슈가 테스트" },
                    { id: "sauce", name: "소스 테스트" },
                  ]}
                  selectedOption={selectedTest}
                  onSelect={option =>
                    setSelectedTest(option as "sugar" | "sauce")
                  }
                />
                <button
                  onClick={() => setIsChangeTeamModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors duration-200"
                >
                  <MdPeople className="text-lg" />
                  <span className="font-medium">팀 변경</span>
                </button>
              </div>
            </div>
          </header>

          <div className="space-y-8">
            {result ? (
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        종합 진단 결과
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {completedAt
                          ? new Date(completedAt).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-3xl font-bold ${
                          averageScore >= 4.1
                            ? "text-red-600"
                            : averageScore >= 3.1
                            ? "text-orange-600"
                            : averageScore >= 2.1
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {averageScore}
                      </span>
                      <span className="text-base text-gray-600">/ 5점</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                        averageScore >= 4.1
                          ? "bg-red-100 text-red-700"
                          : averageScore >= 3.1
                          ? "bg-orange-100 text-orange-700"
                          : averageScore >= 2.1
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {
                        STRESS_LEVELS.find(
                          level =>
                            averageScore >= level.min &&
                            averageScore <= level.max
                        )?.label
                      }
                    </div>
                    <p className="text-gray-600 mt-3">
                      {
                        ANALYSIS_DATA[
                          averageScore >= 4.1
                            ? "CRITICAL"
                            : averageScore >= 3.1
                            ? "HIGH"
                            : averageScore >= 2.1
                            ? "MODERATE"
                            : "LOW"
                        ](selectedMember.name, averageScore.toString())
                          .currentStatus.description
                      }
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    카테고리별 상세 분석
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={Object.entries(result.categories).map(
                            ([name, scores]) => {
                              const total = (scores as number[]).reduce(
                                (a, b) => a + b,
                                0
                              );
                              const average = Math.round(
                                total / (scores as number[]).length
                              );
                              return {
                                name: translateCategoryKeyToKR(name),
                                score: Math.min(5, Math.max(1, average)),
                              };
                            }
                          )}
                          layout="vertical"
                          margin={{
                            top: 10,
                            right: 32,
                            left: 0,
                            bottom: 10,
                          }}
                          barSize={24}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            type="number"
                            domain={[1, 5]}
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: "#e2e8f0" }}
                            tickCount={5}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={props => {
                              const { x, y, payload } = props;
                              return (
                                <g transform={`translate(${x},${y})`}>
                                  <text
                                    x={-8}
                                    y={0}
                                    dy={4}
                                    textAnchor="end"
                                    fill="#4b5563"
                                    fontSize={13}
                                  >
                                    {payload.value}
                                  </text>
                                </g>
                              );
                            }}
                            width={120}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            cursor={{ fill: "#f8fafc" }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                const score = data.score;

                                const categoryKey = translateCategoryKeyToEN(
                                  data.name
                                );

                                // categoryKey가 없거나 빈 문자열인 경우 처리
                                if (!categoryKey) {
                                  return null;
                                }

                                const categoryId =
                                  categoryKey[0].toUpperCase() as keyof typeof CATEGORY_DESCRIPTIONS;
                                const categoryInfo =
                                  CATEGORY_DESCRIPTIONS[categoryId];

                                // categoryInfo가 없는 경우 처리
                                if (!categoryInfo || !categoryInfo.levels) {
                                  return null;
                                }

                                const currentLevel = Object.entries(
                                  categoryInfo.levels
                                ).find(
                                  ([_, range]) =>
                                    score >= range.min && score <= range.max
                                )?.[1];

                                if (!currentLevel) {
                                  return null;
                                }

                                return (
                                  <div className="bg-white px-4 py-3 border border-gray-100 rounded-lg shadow-md space-y-3 max-w-xs">
                                    {/* 카테고리 정보 */}
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium text-gray-900">
                                        {data.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {categoryInfo.name}
                                      </div>
                                      <div className="text-2xl font-semibold text-orange-600">
                                        {score}점
                                      </div>
                                    </div>

                                    {/* 현재 상태 설명 */}
                                    <div
                                      className={`text-sm px-2 py-1.5 rounded ${
                                        score >= 4.1
                                          ? "bg-red-50 text-red-700"
                                          : score >= 3.1
                                          ? "bg-orange-50 text-orange-700"
                                          : score >= 2.1
                                          ? "bg-yellow-50 text-yellow-700"
                                          : "bg-green-50 text-green-700"
                                      }`}
                                    >
                                      {currentLevel.description}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                            {Object.entries(result.categories).map(
                              ([name, scores]) => (
                                <Cell
                                  key={name}
                                  fill={
                                    scores.reduce((a, b) => a + b, 0) /
                                      scores.length >=
                                    4.1
                                      ? "#ef4444"
                                      : scores.reduce((a, b) => a + b, 0) /
                                          scores.length >=
                                        3.1
                                      ? "#f97316"
                                      : scores.reduce((a, b) => a + b, 0) /
                                          scores.length >=
                                        2.1
                                      ? "#facc15"
                                      : "#22c55e"
                                  }
                                />
                              )
                            )}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    현재 상태 분석
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h4 className="text-base font-medium text-gray-900 mb-4">
                        업무 관리
                      </h4>
                      <ul className="space-y-3">
                        {ANALYSIS_DATA[
                          averageScore >= 4.1
                            ? "CRITICAL"
                            : averageScore >= 3.1
                            ? "HIGH"
                            : averageScore >= 2.1
                            ? "MODERATE"
                            : "LOW"
                        ](
                          selectedMember.name,
                          averageScore.toString()
                        ).currentStatus.workManagement.items.map(
                          (item, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-3"
                            >
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                              <span className="text-sm text-gray-600">
                                {item}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h4 className="text-base font-medium text-gray-900 mb-4">
                        조직 생활
                      </h4>
                      <ul className="space-y-3">
                        {ANALYSIS_DATA[
                          averageScore >= 4.1
                            ? "CRITICAL"
                            : averageScore >= 3.1
                            ? "HIGH"
                            : averageScore >= 2.1
                            ? "MODERATE"
                            : "LOW"
                        ](
                          selectedMember.name,
                          averageScore.toString()
                        ).organizationalLife.current.items.map(
                          (item, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-3"
                            >
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                              <span className="text-sm text-gray-600">
                                {item}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* {result.metadata?.history &&
                  result.metadata.history.length > 1 && (
                    <div className="border-t border-gray-100 pt-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          스트레스 변화 추이
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            이전 대비
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              result.score >
                              result.metadata.history[
                                result.metadata.history.length - 2
                              ].score
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {result.score >
                            result.metadata.history[
                              result.metadata.history.length - 2
                            ].score
                              ? "+"
                              : ""}
                            {(
                              result.score -
                              result.metadata.history[
                                result.metadata.history.length - 2
                              ].score
                            ).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <div className="h-[240px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={result.metadata.history.map(item => ({
                                date: new Date(item.date).toLocaleDateString(
                                  "ko-KR",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                ),
                                score: Math.round(item.score * 10) / 10,
                              }))}
                              margin={{
                                top: 10,
                                right: 10,
                                left: 10,
                                bottom: 20,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#f1f5f9"
                              />
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={{
                                  stroke: "#e2e8f0",
                                }}
                              />
                              <YAxis
                                domain={[1, 5]}
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={{
                                  stroke: "#e2e8f0",
                                }}
                                tickCount={5}
                              />
                              <Tooltip
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    const score = payload[0].value as number;
                                    const level = STRESS_LEVELS.find(
                                      level =>
                                        score >= level.min && score <= level.max
                                    );
                                    return (
                                      <div className="bg-white px-4 py-3 border border-gray-100 rounded-lg shadow-md space-y-2">
                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-600">
                                            {label}
                                          </div>
                                          <div className="text-2xl font-semibold text-orange-600">
                                            {score}점
                                          </div>
                                        </div>
                                        <div
                                          className={`text-sm px-2 py-1 rounded ${
                                            score >= 4.1
                                              ? "bg-red-50 text-red-700"
                                              : score >= 3.1
                                              ? "bg-orange-50 text-orange-700"
                                              : score >= 2.1
                                              ? "bg-yellow-50 text-yellow-700"
                                              : "bg-green-50 text-green-700"
                                          }`}
                                        >
                                          {level?.label}
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#f97316"
                                strokeWidth={2.5}
                                dot={{
                                  fill: "#fff",
                                  stroke: "#f97316",
                                  strokeWidth: 2,
                                  r: 4,
                                }}
                                activeDot={{
                                  r: 6,
                                  fill: "#f97316",
                                  stroke: "#fff",
                                  strokeWidth: 2,
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )} */}

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    개선 제안
                  </h3>
                  <div className="bg-orange-50 rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-base font-medium text-orange-900 mb-3">
                          {
                            ANALYSIS_DATA[
                              averageScore >= 4.1
                                ? "CRITICAL"
                                : averageScore >= 3.1
                                ? "HIGH"
                                : averageScore >= 2.1
                                ? "MODERATE"
                                : "LOW"
                            ](selectedMember.name, averageScore.toString())
                              .suggestion.shortTerm.title
                          }{" "}
                          (
                          {
                            ANALYSIS_DATA[
                              averageScore >= 4.1
                                ? "CRITICAL"
                                : averageScore >= 3.1
                                ? "HIGH"
                                : averageScore >= 2.1
                                ? "MODERATE"
                                : "LOW"
                            ](selectedMember.name, averageScore.toString())
                              .suggestion.shortTerm.period
                          }
                          )
                        </h4>
                        <ul className="space-y-3">
                          {ANALYSIS_DATA[
                            averageScore >= 4.1
                              ? "CRITICAL"
                              : averageScore >= 3.1
                              ? "HIGH"
                              : averageScore >= 2.1
                              ? "MODERATE"
                              : "LOW"
                          ](
                            selectedMember.name,
                            averageScore.toString()
                          ).suggestion.shortTerm.items.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-3"
                            >
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                              <span className="text-sm text-orange-800">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-orange-900 mb-3">
                          {
                            ANALYSIS_DATA[
                              averageScore >= 4.1
                                ? "CRITICAL"
                                : averageScore >= 3.1
                                ? "HIGH"
                                : averageScore >= 2.1
                                ? "MODERATE"
                                : "LOW"
                            ](selectedMember.name, averageScore.toString())
                              .suggestion.longTerm.title
                          }{" "}
                          (
                          {
                            ANALYSIS_DATA[
                              averageScore >= 4.1
                                ? "CRITICAL"
                                : averageScore >= 3.1
                                ? "HIGH"
                                : averageScore >= 2.1
                                ? "MODERATE"
                                : "LOW"
                            ](selectedMember.name, averageScore.toString())
                              .suggestion.longTerm.period
                          }
                          )
                        </h4>
                        <ul className="space-y-3">
                          {ANALYSIS_DATA[
                            averageScore >= 4.1
                              ? "CRITICAL"
                              : averageScore >= 3.1
                              ? "HIGH"
                              : averageScore >= 2.1
                              ? "MODERATE"
                              : "LOW"
                          ](
                            selectedMember.name,
                            averageScore.toString()
                          ).suggestion.longTerm.items.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-3"
                            >
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                              <span className="text-sm text-orange-800">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      종합 의견
                    </h3>
                    <p className="text-gray-600">
                      {
                        ANALYSIS_DATA[
                          averageScore >= 4.1
                            ? "CRITICAL"
                            : averageScore >= 3.1
                            ? "HIGH"
                            : averageScore >= 2.1
                            ? "MODERATE"
                            : "LOW"
                        ](selectedMember.name, averageScore.toString())
                          .overallOpinion.summary
                      }
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                테스트 결과가 없습니다
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MemberDetail;
