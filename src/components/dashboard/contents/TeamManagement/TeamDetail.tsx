"use client";

import { MdPeople, MdPerson, MdNote } from "react-icons/md";
import Breadcrumb from "./Breadcrumb";
import { UserTeam, Members, TestInfo } from "@/types/user";
import { useState } from "react";
import { formatDate } from "@/utils/dateUtils";

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
}

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
}: TeamDetailProps) => {
  // 팀원의 테스트 결과 표시 컴포넌트

  const TestResultDisplay = ({ member }: { member: Members | null }) => {
    const [activeTab, setActiveTab] = useState<"sugar" | "sauce">("sugar");

    if (!member) return null;

    const categoryNameMap = {
      strain: "업무강도",
      uncertainty: "불확실성",
      grievance: "대인관계",
      autonomy: "업무 자율성",
      recognition: "보상과 인정",
    };

    const getScoreColor = (score: number) => {
      if (score >= 4) return "bg-red-500";
      if (score >= 3) return "bg-orange-500";
      if (score >= 2) return "bg-yellow-500";
      return "bg-green-500";
    };

    const renderCategoryScore = (category: string, score: number) => (
      <div className="flex items-center justify-between py-2" key={category}>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getScoreColor(score)}`} />
          <span className="text-sm text-gray-700">{category}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${getScoreColor(
                score
              )} transition-all duration-300`}
              style={{ width: `${(score / 5) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-900">{score}</span>
        </div>
      </div>
    );

    const renderTestResult = (type: "sugar" | "sauce") => {
      // 1. type이 일치하는 테스트만 필터
      const testsOfType = fetchTests.filter(test => test.type === type);

      // 2. 해당 멤버의 결과가 있는 가장 최근 테스트 찾기
      let result;
      let completedAt;
      for (const test of testsOfType) {
        const applicant = test.applicants?.find(app => app.id === member.id);
        if (applicant && applicant.testResult) {
          result = applicant.testResult;
          completedAt = applicant.completedAt;
          break; // 가장 최근(최상단) 결과만 사용
        }
      }

      if (!result?.categories) {
        return (
          <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-500">미실시</span>
          </div>
        );
      }

      const categories = Object.entries(result.categories).map(
        ([name, scores]) => {
          const total = scores.reduce((a: number, b: number) => a + b, 0);
          const average = Math.round(total / scores.length);
          return {
            name: categoryNameMap[name as keyof typeof categoryNameMap] || name,
            score: Math.min(5, Math.max(1, average)),
          };
        }
      );

      const averageScore = Math.round(
        categories.reduce((acc, { score }) => acc + score, 0) /
          categories.length
      );

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <span
                className={`text-sm font-semibold ${
                  averageScore >= 4 ? "text-red-600" : "text-gray-900"
                }`}
              >
                {averageScore}점
              </span>
              <span className="text-xs text-gray-500">/ 5점</span>
            </div>
            <div className="text-xs text-gray-500">
              {completedAt ? formatDate(completedAt) : ""}
            </div>
          </div>
          <div className="space-y-1">
            {categories.map(({ name, score }) =>
              renderCategoryScore(name, score)
            )}
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
    };

    return (
      <div className="w-full h-[280px]">
        <div className="flex border-b mb-4">
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
        </div>
        <div className="h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {renderTestResult(activeTab)}
        </div>
      </div>
    );
  };

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
                  <TestResultDisplay member={member} />
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
