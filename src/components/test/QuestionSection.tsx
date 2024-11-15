"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScoreButton } from "./ScoreButton";
import { CategoryType } from "@/types/test";

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
    <div className="max-w-5xl lg:w-3/4 bg-white rounded-lg shadow-xl overflow-hidden p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gap-16 flex flex-col"
      >
        {categoryData.questions.map((question, displayIndex) => {
          const actualIndex = getActualQuestionIndex(displayIndex);
          const answerKey = `${categoryData.index}-${actualIndex}`;
          const globalQuestionNumber = getGlobalQuestionNumber(displayIndex);

          return (
            <div key={actualIndex} className="gap-4 flex flex-col">
              <p className="text-base sm:text-lg leading-relaxed mb-4 text-gray-700 font-medium">
                {globalQuestionNumber}. {question.text}
              </p>
              <div className="flex items-center sm:gap-8 w-full justify-between">
                {[1, 2, 3, 4, 5].map(score => (
                  <ScoreButton
                    key={score}
                    score={score}
                    isSelected={selectedAnswers[answerKey] === score}
                    onClick={() => handleAnswer(actualIndex, score)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
