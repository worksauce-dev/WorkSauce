"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  MdPerson,
  MdAdd,
  MdTimer,
  MdCalendarToday,
  MdAccessTime,
} from "react-icons/md";
import { CATEGORY_KR_TRANSLATIONS } from "@/constants/sugartest";

import CustomDropdown from "@/components/common/CustomDropdown";
import { UserTeam, TestInfo } from "@/types/user";
import {
  getTeamTestCardInfos,
  getTeamLatestTestResult,
  getTeamTestHistoryTrend,
} from "@/utils/teamDashboardUtils";

interface TeamCardProps {
  team: UserTeam;
  onAddMember: (team: UserTeam) => void;
  fetchTests: TestInfo[];
}

const TeamCard = ({ team, onAddMember, fetchTests }: TeamCardProps) => {
  const [activeTab, setActiveTab] = useState<"status" | "sugar" | "sauce">(
    "status"
  );

  if (team.members.length === 0) {
    return (
      <>
        <header className="p-3 border-b">
          <h3 className="font-medium text-lg">{team.name}</h3>
          <p className="text-sm text-gray-500">멤버가 없습니다</p>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center max-w-[280px] mx-auto">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <MdPerson className="text-4xl text-orange-500" />
            </div>
            <p className="text-gray-600 text-center mb-6 text-base">
              팀에 멤버를 추가하여 테스트를 진행하세요.
            </p>
            <button
              onClick={e => {
                e.stopPropagation();
                onAddMember(team);
              }}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              <MdAdd className="mr-1.5 text-lg" />
              멤버 추가하기
            </button>
          </div>
        </main>
      </>
    );
  }

  const testTypes = [
    { id: "status", name: "테스트 현황" },
    { id: "sauce", name: "소스 테스트" },
    { id: "sugar", name: "슈가 테스트" },
  ];

  const renderTeamTestChart = (type: "sugar" | "sauce", color: string) => {
    const trendData = getTeamTestHistoryTrend(
      team,
      fetchTests.filter(test => test.status === "completed"),
      type
    );
    const latestResult = getTeamLatestTestResult(team, fetchTests, type);

    const renderScoreGuide = () => (
      <div className="text-xs text-gray-500 mt-1">
        <span className="font-medium">슈가 테스트 점수 체계:</span> 1점(낮음) ~
        5점(높음)
        <br />
        <span className="text-red-500">
          높은 점수는 높은 스트레스 수준을 의미합니다.
        </span>
      </div>
    );

    if (!trendData || trendData.trend.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 w-full bg-gray-50 rounded">
          <span className="text-sm text-gray-400">
            진단 미실시 또는 테스트가 아직 진행중입니다.
          </span>
        </div>
      );
    }

    if (type === "sugar") {
      return (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500 font-medium">
                {team.name} 팀 {type === "sugar" ? "슈가" : "소스"} 테스트
                히스토리
              </h4>
              {type === "sugar" && renderScoreGuide()}
            </div>
            <div className="flex items-center gap-2">
              {latestResult?.status && (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                    latestResult.status === "completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-orange-50 text-orange-700"
                  }`}
                >
                  <MdTimer className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    {latestResult.status === "completed" ? "완료" : "진행 중"}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <span
                  className="text-lg font-semibold"
                  style={{
                    color,
                    ...(type === "sugar" &&
                      trendData.overallAverage >= 4 && {
                        color: "#EF4444",
                      }),
                  }}
                >
                  {trendData.overallAverage}
                </span>
                <span className="text-sm text-gray-500 ml-1">점</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* 카테고리별 평균 점수 레이더 차트 */}
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <h5 className="text-sm font-medium text-gray-700 mb-4">
                카테고리별 평균 점수
              </h5>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart
                  data={trendData.categoryAverages || []}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-100 p-2.5 rounded-lg border border-gray-200">
                            <p className="text-xs font-medium text-gray-900 mb-2.5">
                              {label}
                            </p>
                            <div className="space-y-5">
                              {payload.map((entry, index) => (
                                <div
                                  key={`item-${index}`}
                                  className="flex items-center justify-between py-1"
                                >
                                  <span className="text-xs text-gray-800">
                                    {entry.name}
                                  </span>
                                  <span
                                    className="text-xs font-semibold"
                                    style={{ color }}
                                  >
                                    {entry.value}점
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Radar
                    name="평균 점수"
                    dataKey="score"
                    stroke={color}
                    fill={color}
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 추이 차트 */}
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <h5 className="text-sm font-medium text-gray-700 mb-4">
                점수 추이
              </h5>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={trendData.trend}
                  margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={40}
                    interval={0}
                  />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-100 p-2.5 rounded-lg border border-gray-200">
                            <p className="text-xs font-medium text-gray-900 mb-2.5">
                              {label}
                            </p>
                            <div className="space-y-5">
                              {Object.entries(payload[0].payload).map(
                                ([key, value]) => {
                                  if (key === "date" || key === "score")
                                    return null;
                                  return (
                                    <div
                                      key={key}
                                      className="flex items-center justify-between py-1"
                                    >
                                      <span className="text-xs text-gray-800">
                                        {CATEGORY_KR_TRANSLATIONS[
                                          key as keyof typeof CATEGORY_KR_TRANSLATIONS
                                        ] || key}
                                      </span>
                                      <span
                                        className="text-xs font-semibold"
                                        style={{ color }}
                                      >
                                        {value as number}점
                                      </span>
                                    </div>
                                  );
                                }
                              )}
                              <div className="border-t border-gray-300 pt-2.5 mt-2.5">
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-xs font-medium text-gray-900">
                                    전체 평균
                                  </span>
                                  <span
                                    className="text-xs font-semibold"
                                    style={{ color }}
                                  >
                                    {payload[0].value}점
                                  </span>
                                </div>
                              </div>
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
                    stroke={color}
                    strokeWidth={3}
                    dot={{ fill: color, r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      );
    }

    if (type === "sauce") {
      return <div>sauce</div>;
    }
  };

  const renderTestStatus = () => {
    const data = getTeamTestCardInfos(team, fetchTests);

    if (fetchTests.length === 0) {
      return (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-400">
            진행 중인 테스트가 없습니다
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="px-2 sm:px-4 space-y-3">
          {data.map(test => (
            <div
              key={test.testId}
              className="bg-white rounded-2xl p-5 border border-gray-100"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm md:text-base font-semibold text-gray-900">
                      {test.type === "sugar" ? "슈가 테스트" : "소스 테스트"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                        test.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : test.remainingDays <= 3
                          ? "bg-red-50 text-red-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      <MdTimer className="w-4 h-4" />
                      <span className="font-medium text-sm">
                        {test.status === "completed"
                          ? "완료"
                          : `${test.remainingDays}일 남음`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap mt-4">
                  {/* 전송일 */}
                  <div className="flex flex-col items-center flex-1 min-w-[80px]">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-1">
                      <MdCalendarToday className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-500">전송일</span>
                    <span className="text-base font-medium text-gray-700">
                      {test.startDate}
                    </span>
                  </div>
                  {/* 마감일 */}
                  <div className="flex flex-col items-center flex-1 min-w-[80px]">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-1">
                      <MdAccessTime className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-500">마감일</span>
                    <span className="text-base font-medium text-gray-700">
                      {test.deadline}
                    </span>
                  </div>
                  {/* 참여율 */}
                  <div className="flex flex-col items-center flex-1 min-w-[80px]">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-1">
                      <MdPerson className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-500">참여율</span>
                    <span className="text-base font-medium text-gray-700">
                      {test.participationRate}%{" "}
                      <span className="text-xs text-gray-400">
                        ({test.completedApplicants}/{test.totalApplicants})
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="p-3 border-b flex justify-between items-center shrink-0">
        <div>
          <h3 className="font-medium text-lg">{team.name}</h3>
          <p className="text-sm text-gray-500">
            {team.members.length}명의 팀원
          </p>
        </div>
        <CustomDropdown
          fullWidth={false}
          options={testTypes}
          selectedOption={activeTab}
          onSelect={option =>
            setActiveTab(option as "status" | "sugar" | "sauce")
          }
        />
      </header>
      <main className="p-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {activeTab === "status" && renderTestStatus()}
        {activeTab === "sugar" && renderTeamTestChart("sugar", "#3B82F6")}
        {activeTab === "sauce" && renderTeamTestChart("sauce", "#F97316")}
      </main>
    </>
  );
};

export default TeamCard;
