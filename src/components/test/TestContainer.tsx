"use client";

import { QuestionSection } from "./QuestionSection";
import { useTestLogic } from "@/hooks/useTestLogic";
import { ProgressSection } from "./ProgressSection";
import { VerbTest } from "./VerbTest";

export const TestContainer = () => {
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
  } = useTestLogic();

  if (isCompleted) {
    return <VerbTest prevScores={calculateScores()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col lg:flex-row gap-8 justify-center">
      <QuestionSection
        currentCategory={currentCategory}
        answers={answers}
        handleAnswer={handleAnswer}
      />
      <ProgressSection
        getCurrentProgress={getCurrentProgress}
        canProceed={canProceed}
        handleNextCategory={handleNextCategory}
        handleSkip={handleSkip}
        currentCategoryIndex={currentCategory.index}
        totalCategories={currentCategory.total}
      />
    </div>
  );
};
