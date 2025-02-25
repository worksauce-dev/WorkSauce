"use client";

import React from "react";
import { motion } from "framer-motion";
import { SugarTest } from "@/types/sugartest/test";
import { SugarScoreButton } from "./SugarScoreButton";

interface SugarQuestionSectionProps {
  testData: SugarTest;
  currentCategory: string;
  handleAnswer: (questionIndex: number, score: number) => void;
  selectedAnswers: { [key: string]: number };
}

export const SugarQuestionSection = ({
  testData,
  currentCategory,
  handleAnswer,
  selectedAnswers,
}: SugarQuestionSectionProps) => {
  const questions = testData[currentCategory as keyof SugarTest];
  if (!Array.isArray(questions)) return null;

  return (
    <div className="w-full lg:w-3/4 xl:w-3/5 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-8"
        key={currentCategory}
      >
        {questions.map((question, questionIndex) => {
          const answerKey = `${currentCategory}-${questionIndex}`;

          return (
            <div
              key={answerKey}
              className="space-y-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start gap-2">
                <span
                  className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 min-w-[24px]"
                  aria-hidden="true"
                >
                  {questionIndex + 1}.
                </span>
                <p
                  className="text-sm sm:text-base md:text-lg text-gray-700 font-medium"
                  id={`question-${answerKey}`}
                >
                  {question.question}
                </p>
              </div>

              <fieldset
                className="grid grid-cols-5 gap-0.5 sm:gap-1 md:gap-2 w-full max-w-4xl mx-auto px-1 sm:px-2 md:px-4"
                aria-labelledby={`question-${answerKey}`}
              >
                <legend className="sr-only">
                  점수 선택: {question.question}
                </legend>
                {[1, 2, 3, 4, 5].map(score => (
                  <SugarScoreButton
                    key={score}
                    score={score}
                    isSelected={selectedAnswers[answerKey] === score}
                    onClick={() => handleAnswer(questionIndex, score)}
                    aria-label={`${score}점`}
                  />
                ))}
              </fieldset>

              {questionIndex < questions.length - 1 && (
                <div className="h-px bg-gray-100 mt-8" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
