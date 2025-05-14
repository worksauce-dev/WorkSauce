"use client";

import {
  MdAdd,
  MdPerson,
  MdCalendarToday,
  MdAccessTime,
  MdTimer,
} from "react-icons/md";
import Breadcrumb from "./Breadcrumb";
import { UserTeam, Members, TestInfo } from "@/types/user";
import { useState } from "react";
import {
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import NoTeams from "./NoTeams";
import { CATEGORY_KR_TRANSLATIONS } from "@/constants/sugartest";
import CustomDropdown from "@/components/common/CustomDropdown";
import { formatDateToKorean } from "@/utils/dateUtils";

const TeamCard = ({
  team,
  onSelectTeam,
  onAddMember,
  fetchTests,
}: {
  team: UserTeam;
  onSelectTeam: (team: UserTeam) => void;
  onAddMember: (team: UserTeam) => void;
  fetchTests: TestInfo[];
}) => {
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
    { id: "sugar", name: "슈가 테스트" },
    { id: "sauce", name: "소스 테스트" },
  ];

  const getTestResult = (type: "sugar" | "sauce") => {
    const result = fetchTests.find(test => test.testId === "sugar")?.result;

    if (!result?.categories) return null;

    const categories = Object.entries(result.categories).map(
      ([name, scores]) => {
        const total = scores.reduce((a, b) => a + b, 0);
        const average = Math.round(total / scores.length);
        return {
          name:
            CATEGORY_KR_TRANSLATIONS[
              name as keyof typeof CATEGORY_KR_TRANSLATIONS
            ] || name,
          score: Math.min(5, Math.max(1, average)),
        };
      }
    );

    const totalScore = categories.reduce((acc, { score }) => acc + score, 0);
    const averageScore = Math.round(totalScore / categories.length);

    // history 데이터 생성
    const history = [
      {
        averageScore: Math.min(5, Math.max(1, averageScore)),
        categories: result.categories,
      },
    ];

    return {
      categories,
      averageScore: Math.min(5, Math.max(1, averageScore)),
      totalCategories: categories.length,
      history,
    };
  };

  const sugarResult = getTestResult("sugar");
  const sauceResult = getTestResult("sauce");

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

  const getTeamHistoryData = (type: "sugar" | "sauce" | "status") => {
    const allHistory = team.members.flatMap(member => {
      const result =
        type === "sugar"
          ? member.testStatuses.find(test => test.testId === "sugar")?.result
          : member.testStatuses.find(test => test.testId === "sauce")?.result;
      return result?.metadata.history || [];
    });

    if (allHistory.length === 0) return [];

    // 날짜별로 그룹화
    const groupedByDate = allHistory.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          categories: {},
          count: 0,
        };
      }
      acc[date].count++;

      // 각 카테고리별 점수 누적
      Object.entries(item.categories).forEach(([category, scores]) => {
        if (!acc[date].categories[category]) {
          acc[date].categories[category] = [];
        }
        acc[date].categories[category].push(
          scores.reduce((a, b) => a + b, 0) / scores.length
        );
      });

      return acc;
    }, {} as Record<string, any>);

    // 날짜별 평균 계산
    return Object.values(groupedByDate)
      .map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        ...Object.fromEntries(
          Object.entries(item.categories).map(([category, scores]) => [
            CATEGORY_KR_TRANSLATIONS[
              category as keyof typeof CATEGORY_KR_TRANSLATIONS
            ] || category,
            Math.round(
              (scores as number[]).reduce((a, b) => a + b, 0) / item.count
            ),
          ])
        ),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const renderTeamHistoryChart = (
    type: "sugar" | "sauce" | "status",
    color: string
  ) => {
    const data = getTeamHistoryData(type);
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 w-full bg-gray-50 rounded">
          <span className="text-sm text-gray-400">팀 전체 기록 없음</span>
        </div>
      );
    }

    const averagedData = data.map(item => {
      const { date, ...categories } = item;
      const scores = Object.values(categories).filter(
        score => typeof score === "number"
      );
      const averageScore =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;

      return {
        date: new Date(date).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        score: Math.round(averageScore * 10) / 10,
      };
    });

    return (
      <section className="space-y-3">
        <h4 className="text-xs text-gray-500 font-medium">
          {team.name} 팀 {type === "sugar" ? "슈가" : "소스"} 테스트 히스토리
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={averagedData}
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
                  const member = team.members[0];
                  const metadata = member.testStatuses.find(
                    test => test.testId === "sugar"
                  )?.result?.metadata;
                  if (!metadata) return null;

                  return (
                    <div className="bg-gray-100 p-2.5 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-900 mb-2.5">
                        {label}
                      </p>
                      <div className="space-y-5">
                        {Object.entries(metadata.categoryScores).map(
                          ([category, score]) => (
                            <div
                              key={category}
                              className="flex items-center justify-between py-1"
                            >
                              <span className="text-xs text-gray-800">
                                {CATEGORY_KR_TRANSLATIONS[
                                  category as keyof typeof CATEGORY_KR_TRANSLATIONS
                                ] || category}
                              </span>
                              <span
                                className="text-xs font-semibold"
                                style={{ color }}
                              >
                                {score.average}점
                              </span>
                            </div>
                          )
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
      </section>
    );
  };

  const renderTestResult = (
    result: ReturnType<typeof getTestResult>,
    color: string
  ) => {
    if (!result) {
      return (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-400">미실시</div>
        </div>
      );
    }

    return (
      <div className="space-y-4 h-[400px] overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">평균 점수</span>
            {activeTab === "sugar" && renderScoreGuide()}
          </div>
          <div className="flex items-center">
            <span
              className="text-lg font-semibold"
              style={{
                color,
                ...(activeTab === "sugar" &&
                  result.averageScore >= 4 && { color: "#EF4444" }),
              }}
            >
              {result.averageScore}
            </span>
            <span className="text-sm text-gray-500 ml-1">점</span>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={result.categories}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const metadata = null;
                    if (!metadata) return null;

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
                                style={{ color: entry.color }}
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
                name="점수"
                dataKey="score"
                stroke={color}
                fill={color}
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8">{renderTeamHistoryChart(activeTab, color)}</div>
      </div>
    );
  };

  const renderTestStatus = () => {
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
        {/* 테스트 목록 */}
        <div className="px-2 sm:px-4 space-y-3">
          {fetchTests.map(test => {
            return (
              <div
                key={test.testId}
                className="bg-white rounded-2xl p-5 border border-gray-100 "
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm md:text-base  font-semibold text-gray-900">
                        {test.type === "sugar" ? "슈가 테스트" : "소스 테스트"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                          test.status === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : Math.ceil(
                                (new Date(test.deadline).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24)
                              ) <= 3
                            ? "bg-red-50 text-red-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        <MdTimer className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          {test.status === "completed"
                            ? "완료"
                            : `${Math.ceil(
                                (new Date(test.deadline).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}일 남음`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                          <MdCalendarToday className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">전송일</span>
                          <span className="text-sm text-gray-700">
                            {formatDateToKorean(test.createdAt)}
                          </span>
                        </div>
                      </div>
                      {test.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                            <MdAccessTime className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">
                              마감일
                            </span>
                            <span className="text-sm text-gray-700">
                              {formatDateToKorean(test.deadline)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 결과가 없을 때 */}
        {fetchTests.length === 0 && (
          <div className="flex items-center justify-center h-40">
            <div className="text-center text-gray-400">
              해당하는 테스트가 없습니다
            </div>
          </div>
        )}
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
        {activeTab === "sugar"
          ? renderTestResult(sugarResult, "#3B82F6")
          : activeTab === "sauce"
          ? renderTestResult(sauceResult, "#F97316")
          : renderTestStatus()}
      </main>
    </>
  );
};

interface TeamsDetailProps {
  teams: UserTeam[];
  setIsCreateTeamModalOpen: (open: boolean) => void;
  setSelectedTeam: (team: UserTeam | null) => void;
  setSelectedView: (view: "teams" | "team" | "member") => void;
  selectedView: "teams" | "team" | "member";
  selectedTeam: UserTeam | null;
  selectedMember: Members | null;
  setSelectedMember: (member: Members | null) => void;
  fetchTests: TestInfo[];
}

const TeamsDetail = ({
  teams,
  setIsCreateTeamModalOpen,
  setSelectedTeam,
  setSelectedView,
  selectedView,
  selectedTeam,
  selectedMember,
  setSelectedMember,
  fetchTests,
}: TeamsDetailProps) => {
  const handleSelectTeam = (team: UserTeam) => {
    setSelectedTeam(team);
    setSelectedView("team");
  };

  const handleAddMember = (team: UserTeam) => {
    setSelectedTeam(team);
    setSelectedView("team");
  };

  return (
    <div>
      <header className="flex justify-between items-center">
        <Breadcrumb
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
        />
        <button
          onClick={() => setIsCreateTeamModalOpen(true)}
          className="flex items-center px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
        >
          <MdAdd className="mr-1 text-base" />팀 생성
        </button>
      </header>
      {teams.length === 0 ? (
        <NoTeams />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {teams.map(team => (
            <div
              key={team.teamId}
              className="bg-white rounded-lg shadow-sm border hover:border-orange-300 transition-colors h-[600px] flex flex-col"
              onClick={() => handleSelectTeam(team)}
            >
              <TeamCard
                team={team}
                onSelectTeam={handleSelectTeam}
                onAddMember={handleAddMember}
                fetchTests={fetchTests}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default TeamsDetail;
