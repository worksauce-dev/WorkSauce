"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScoreButton } from "./ScoreButton";
import { CategoryType } from "@/types/saucetest/test";

interface QuestionSectionProps {
  categoryData: CategoryType;
  handleAnswer: (questionIndex: number, score: number) => void;
  selectedAnswers: { [key: string]: number };
  isFirstHalfCompleted: boolean;
}

export const QuestionSection = ({
  categoryData,
  handleAnswer,
  selectedAnswers,
  isFirstHalfCompleted,
}: QuestionSectionProps) => {
  const getActualQuestionIndex = (displayIndex: number) => {
    const baseIndex = isFirstHalfCompleted ? 9 : 0;
    return baseIndex + displayIndex;
  };

  // 실제 문제 번호 계산 (1-180)
  const getGlobalQuestionNumber = (displayIndex: number) => {
    // 각 카테고리는 18문제씩 가지고 있음
    const questionsPerCategory = 18;
    // 현재 카테고리의 시작 번호 계산
    const categoryStartNumber = categoryData.index * questionsPerCategory;
    // 현재 섹션이 두 번째 섹션이면 +9
    const sectionOffset = isFirstHalfCompleted ? 9 : 0;
    // 최종 문제 번호 계산 (1부터 시작하도록 +1)
    return categoryStartNumber + sectionOffset + displayIndex + 1;
  };

  return (
    <div
      className="w-full lg:w-3/4 xl:w-3/5 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      role="region"
      aria-label={`${categoryData.name} 질문 섹션`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-8"
      >
        {categoryData.questions.map((question, displayIndex) => {
          const actualIndex = getActualQuestionIndex(displayIndex);
          const answerKey = `${categoryData.index}-${actualIndex}`;
          const questionNumber = actualIndex + 1;

          return (
            <div
              key={actualIndex}
              className="space-y-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start gap-2">
                <span
                  className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 min-w-[24px]"
                  aria-hidden="true"
                >
                  {getGlobalQuestionNumber(displayIndex)}.
                </span>
                <p
                  className="text-sm sm:text-base md:text-lg text-gray-700 font-medium"
                  id={`question-${answerKey}`}
                >
                  {question.text}
                </p>
              </div>
              <fieldset
                className="grid grid-cols-5 gap-0.5 sm:gap-1 md:gap-2 w-full max-w-4xl mx-auto px-1 sm:px-2 md:px-4"
                aria-labelledby={`question-${answerKey}`}
              >
                <legend className="sr-only">점수 선택: {question.text}</legend>
                {[1, 2, 3, 4, 5].map(score => (
                  <ScoreButton
                    key={score}
                    score={score}
                    isSelected={selectedAnswers[answerKey] === score}
                    onClick={() => handleAnswer(actualIndex, score)}
                    aria-label={`${score}점`}
                  />
                ))}
              </fieldset>
              {displayIndex < categoryData.questions.length - 1 && (
                <div className="h-px bg-gray-100 mt-8" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
