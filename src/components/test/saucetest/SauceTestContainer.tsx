"use client";

import { QuestionSection } from "./QuestionSection";
import { useTestLogic } from "@/hooks/useTestLogic";
import { ProgressSection } from "./ProgressSection";
import { VerbTest } from "./VerbTest";
import { ScoreType, SauceTest } from "@/types/saucetest/test";

interface SauceTestContainerProps {
  name: string;
  email: string;
  groupId: string;
  testData: SauceTest;
  submitTest: (
    groupId: string,
    email: string,
    name: string,
    testResult: ScoreType[]
  ) => void;
  isAdmin: boolean;
  companyName: string;
  userType: string;
}

export const SauceTestContainer = ({
  name,
  email,
  groupId,
  submitTest,
  testData,
  isAdmin,
  companyName,
  userType,
}: SauceTestContainerProps) => {
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
        companyName={companyName}
        userType={userType}
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
