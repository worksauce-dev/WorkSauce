"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScoreButton } from "./ScoreButton";
import { CategoryType } from "@/types/test";

interface QusetionSectionProps {
  currentCategory: CategoryType;
  answers: {
    [key: string]: number;
  };
  handleAnswer: (questionIndex: number, score: number) => void;
}

const answerArr = [
  "매우 그렇지 않다",
  "그렇지 않다",
  "보통이다",
  "그렇다",
  "매우 그렇다",
];

export const QuestionSection = ({
  currentCategory,
  answers,
  handleAnswer,
}: QusetionSectionProps) => {
  return (
    <div className="max-w-5xl lg:w-3/4 bg-white rounded-lg shadow-xl overflow-hidden p-4 sm:p-8">
      <motion.div
        key={currentCategory.sort}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gap-8 flex flex-col"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          test님의 소스테스트
        </h2>
        {currentCategory.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="gap-4 flex flex-col">
            <p className="text-sm sm:text-subheading leading-relaxed mb-4 text-gray-700">
              {question.text}
            </p>
            <div className="flex items-center space-x-8">
              {[1, 2, 3, 4, 5].map(score => (
                <ScoreButton
                  key={score}
                  score={score}
                  isSelected={
                    answers[`${currentCategory.index}-${questionIndex}`] ===
                    score
                  }
                  onClick={() => handleAnswer(questionIndex, score)}
                />
              ))}
            </div>
            {/* <div className="flex">
              {answerArr.map(el => (
                <div key={el}>{el}</div>
              ))}
            </div> */}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
