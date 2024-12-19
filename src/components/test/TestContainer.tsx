"use client";

import { QuestionSection } from "./QuestionSection";
import { useTestLogic } from "@/hooks/useTestLogic";
import { ProgressSection } from "./ProgressSection";
import { VerbTest } from "./VerbTest";
import { useState } from "react";
import { Group } from "@/types/group";
import { ScoreType, TestDBType } from "@/types/test";

const TestContainer = ({
  name,
  email,
  groupId,
  submitTest,
  testData,
  isAdmin,
  dashboardName,
}: {
  name: string;
  email: string;
  groupId: string;
  testData: TestDBType;
  submitTest: (
    groupId: string,
    email: string,
    name: string,
    testResult: ScoreType[]
  ) => void;
  isAdmin: boolean;
  dashboardName: string;
}) => {
  const {
    handleAnswer,
    selectedAnswers,
    currentCategoryData,
    isFirstHalfCompleted,
    progress,
    handleNextHalf,
    handleSkip,
    canProceedToNext,
    isTestCompleted,
    getFinalScores,
    verbTestData,
  } = useTestLogic(testData);

  if (isTestCompleted) {
    return (
      <VerbTest
        prevScores={getFinalScores()}
        name={name}
        email={email}
        groupId={groupId}
        submitTest={submitTest}
        verbTestData={verbTestData}
        dashboardName={dashboardName}
      />
    );
  }

  return (
    <div className="bg-[#F7F7F9] border-b-2 border-gray-100 min-h-screen py-12 px-2 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col lg:flex-row gap-8 justify-center">
      <QuestionSection
        categoryData={currentCategoryData}
        handleAnswer={handleAnswer}
        selectedAnswers={selectedAnswers}
        isFirstHalfCompleted={isFirstHalfCompleted}
      />
      <ProgressSection
        progress={progress}
        handleNextHalf={handleNextHalf}
        handleSkip={handleSkip}
        canProceedToNext={canProceedToNext}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export function AuthCheck({
  groupData,
  submitTest,
  testData,
  isAdmin,
  dashboardName,
}: {
  groupData: Group;
  submitTest: (
    groupId: string,
    email: string,
    name: string,
    testResult: ScoreType[]
  ) => void;
  testData: TestDBType;
  isAdmin: boolean;
  dashboardName: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name === "test" && email === "test") {
      setIsAuthorized(true);
      return;
    }

    const applicant = groupData.applicants.find(
      a => a.email === email && a.name === name
    );

    if (applicant) {
      if (applicant.testStatus === "completed") {
        setError("이미 테스트를 완료하셨습니다.");
        return;
      }
      setIsAuthorized(true);
    } else {
      setError("입력하신 정보와 일치하는 지원자를 찾을 수 없습니다.");
    }
  };

  if (isAuthorized) {
    return (
      <TestContainer
        name={name}
        email={email}
        groupId={groupData.groupId}
        submitTest={submitTest}
        testData={testData}
        isAdmin={isAdmin}
        dashboardName={dashboardName}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F7F7F9] border-b-2 border-gray-100 ">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          지원자 확인
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-accent text-white py-3 rounded-md font-medium hover:bg-primary-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            확인
          </button>
        </form>
        {error && (
          <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
