"use client";

import { QuestionSection } from "./QuestionSection";
import { useTestLogic } from "@/hooks/useTestLogic";
import { ProgressSection } from "./ProgressSection";
import { VerbTest } from "./VerbTest";
import { useState } from "react";
import { Group } from "@/types/group";
import { ScoreType } from "@/types/test";

const TestContainer = ({
  name,
  email,
  groupId,
  submitTest,
}: {
  name: string;
  email: string;
  groupId: string;
  submitTest: (
    groupId: string,
    email: string,
    name: string,
    testResult: ScoreType[]
  ) => void;
}) => {
  const {
    currentCategory,
    answers,
    isCompleted,
    handleAnswer,
    handleNextCategory,
    handleSkip,
    getCurrentProgress,
    canProceed,
    calculateScores,
    totalQuestionsBefore,
    isFirstHalfCompleted,
    handleNextHalf,
  } = useTestLogic();

  if (isCompleted) {
    return (
      <VerbTest
        prevScores={calculateScores()}
        name={name}
        email={email}
        groupId={groupId}
        submitTest={submitTest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-2 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col lg:flex-row gap-8 justify-center">
      <QuestionSection
        totalQuestionsBefore={totalQuestionsBefore}
        currentCategory={currentCategory}
        answers={answers}
        handleAnswer={handleAnswer}
        isFirstHalfCompleted={isFirstHalfCompleted}
      />
      <ProgressSection
        getCurrentProgress={getCurrentProgress}
        canProceed={canProceed}
        handleNextCategory={handleNextCategory}
        handleSkip={handleSkip}
        currentCategoryIndex={currentCategory.index}
        totalCategories={currentCategory.total}
        isFirstHalfCompleted={isFirstHalfCompleted}
        handleNextHalf={handleNextHalf}
      />
    </div>
  );
};

export function AuthCheck({
  groupData,
  submitTest,
}: {
  groupData: Group;
  submitTest: (
    groupId: string,
    email: string,
    name: string,
    testResult: ScoreType[]
  ) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const applicant = groupData.applicants.find(
      a => a.email === email && a.name === name
    );
    if (applicant) {
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
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4">
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
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
