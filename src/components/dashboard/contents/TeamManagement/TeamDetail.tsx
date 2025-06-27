"use client";

import { MdPeople, MdPerson, MdNote, MdDelete } from "react-icons/md";
import Breadcrumb from "./Breadcrumb";
import { UserTeam, Members, TestInfo } from "@/types/user";
import { useState } from "react";
import { getMemberLatestTestResult } from "@/utils/teamDashboardUtils";
import {
  SauceTestResultDescriptionType,
  SauceType,
} from "@/types/saucetest/test";

interface TeamDetailProps {
  selectedTeam: UserTeam | null;
  setIsCreateMemberModalOpen: (open: boolean) => void;
  setIsSendTestModalOpen: (open: boolean) => void;
  setSelectedMember: (member: Members | null) => void;
  setSelectedView: (view: "teams" | "team" | "member") => void;
  selectedView: "teams" | "team" | "member";
  setSelectedTeam: (team: UserTeam | null) => void;
  selectedMember: Members | null;
  fetchTests: TestInfo[];
  SauceTestResultDescriptionType: SauceTestResultDescriptionType;
  setIsDeleteTeamModalOpen: (open: boolean) => void;
}

// 팀원의 테스트 결과 표시 컴포넌트
const NoContent = () => {
  return (
    <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-500">미실시</span>
    </div>
  );
};

const TestResultDisplay = ({
  member,
  fetchTests,
  SauceTestResultDescriptionType,
}: {
  member: Members;
  fetchTests: TestInfo[];
  SauceTestResultDescriptionType: SauceTestResultDescriptionType;
}) => {
  const [activeTab, setActiveTab] = useState<"sugar" | "sauce">("sauce");

  const getScoreColor = (score: number) => {
    if (score >= 4) return "bg-red-500";
    if (score >= 3) return "bg-orange-500";
    if (score >= 2) return "bg-yellow-500";
    return "bg-green-500";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "sugar": {
        const latestSugarResult = getMemberLatestTestResult(
          member,
          fetchTests,
          activeTab
        );
        if (!latestSugarResult) return <NoContent />;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                <span
                  className={`text-sm font-semibold ${
                    latestSugarResult.averageScore >= 4
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {latestSugarResult.averageScore}점
                </span>
                <span className="text-xs text-gray-500">/ 5점</span>
              </div>
              <div className="text-xs text-gray-500">
                {latestSugarResult.completedAt}
              </div>
            </div>
            <div className="space-y-1">
              {latestSugarResult.categories.map(({ name, score }) => (
                <div
                  className="flex items-center justify-between py-2"
                  key={name}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getScoreColor(score)}`}
                    />
                    <span className="text-sm text-gray-700">{name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getScoreColor(
                          score
                        )} transition-all duration-300`}
                        style={{
                          width: `${(score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />{" "}
              양호
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />{" "}
              보통
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />{" "}
              높음
              <span className="inline-block w-2 h-2 rounded-full bg-red-500" />{" "}
              매우 높음
            </div>
          </div>
        );
      }

      case "sauce": {
        const sauceTests = fetchTests.filter(test => test.type === "sauce");

        // 모든 완료된 테스트 결과를 찾아서 날짜순으로 정렬
        const completedResults = sauceTests
          .flatMap(test => test.applicants)
          .filter(
            applicant =>
              applicant.testStatus === "completed" &&
              applicant.testResult &&
              applicant.testResult.categories
          )
          .sort(
            (a, b) =>
              new Date(b.completedAt).getTime() -
              new Date(a.completedAt).getTime()
          );

        // 가장 최근 결과가 없으면 NoContent 표시
        if (completedResults.length === 0) {
          return <NoContent />;
        }

        const latestResult = completedResults[0];

        // testResult가 null이 아닌지 확인
        if (!latestResult.testResult?.categories) {
          return <NoContent />;
        }

        // 점수 순으로 정렬된 카테고리 배열 생성
        const categories = Object.entries(
          latestResult.testResult.categories
        ).sort(([, a], [, b]) => Number(b) - Number(a));

        // 상위 2개 카테고리 가져오기
        const [topCategory, secondCategory] = categories.slice(0, 2);

        function getDescription(topCategory: string, secondCategory: string) {
          const topCategoryKey = topCategory as SauceType;
          const secondCategoryKey = secondCategory as SauceType;

          const description =
            SauceTestResultDescriptionType.categories[topCategoryKey][
              secondCategoryKey
            ];

          return description.typeDescription.finalOpinion.content;
        }

        return (
          <div className="space-y-4">
            {/* Header with completion date */}
            <div className="flex justify-end">
              <span className="text-xs text-gray-500">
                {new Date(latestResult.completedAt).toLocaleDateString()}
              </span>
            </div>

            {/* Combined Category Type */}
            <div className="flex flex-col items-center space-y-4">
              {/* 카테고리 조합 */}
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-md bg-orange-50 text-orange-600 font-semibold text-xl">
                  {topCategory[0]}
                </span>
                <span className="text-xl text-gray-300 font-light">×</span>
                <span className="px-3 py-1 rounded-md bg-gray-50 text-gray-700 font-medium text-sm">
                  {secondCategory[0]}
                </span>
              </div>
              {/* 설명 카드 */}
              <div className="w-full max-w-md bg-gray-50 rounded-xl shadow-sm px-6 py-5">
                <p className="text-sm text-gray-700 text-center leading-relaxed">
                  {getDescription(topCategory[0], secondCategory[0])}
                </p>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-[280px]">
      <div className="flex border-b mb-4">
        <button
          onClick={e => {
            e.stopPropagation();
            setActiveTab("sauce");
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeTab === "sauce"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          소스 테스트
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            setActiveTab("sugar");
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeTab === "sugar"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          슈가 테스트
        </button>
      </div>
      <div className="h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {renderContent()}
      </div>
    </div>
  );
};

const TeamDetail = ({
  selectedTeam,
  setIsCreateMemberModalOpen,
  setIsSendTestModalOpen,
  setSelectedMember,
  setSelectedView,
  selectedView,
  setSelectedTeam,
  selectedMember,
  fetchTests,
  SauceTestResultDescriptionType,
  setIsDeleteTeamModalOpen,
}: TeamDetailProps) => {
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
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <MdPeople className="text-2xl text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedTeam?.name} 팀원
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                총 {selectedTeam?.members.length}명의 팀원이 있습니다
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsCreateMemberModalOpen(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm font-medium shadow-sm"
            >
              <MdPerson className="mr-2 text-lg" />
              팀원 생성
            </button>
            <button
              onClick={() => setIsSendTestModalOpen(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm font-medium shadow-sm"
            >
              <MdNote className="mr-2 text-lg" />
              테스트 전송
            </button>
            <button
              onClick={() => setIsDeleteTeamModalOpen(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm font-medium shadow-sm"
            >
              <MdDelete className="mr-2 text-lg" />팀 삭제
            </button>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {selectedTeam?.members.map(member => (
            <article
              key={member.id}
              className="p-5 border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all duration-200 cursor-pointer bg-white"
              onClick={() => {
                setSelectedMember(member);
                setSelectedView("member");
              }}
            >
              <div className="flex flex-col">
                <div className="space-y-1 mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
                <div>
                  <TestResultDisplay
                    member={member}
                    fetchTests={fetchTests}
                    SauceTestResultDescriptionType={
                      SauceTestResultDescriptionType
                    }
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeamDetail;
