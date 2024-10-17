"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScoreButton } from "./ScoreButton";
import { CategoryType } from "@/types/test";

interface QuestionSectionProps {
  currentCategory: CategoryType;
  answers: {
    [key: string]: number;
  };
  handleAnswer: (questionIndex: number, score: number) => void;
  totalQuestionsBefore: number;
  isFirstHalfCompleted: boolean;
}

export const QuestionSection = ({
  currentCategory,
  answers,
  handleAnswer,
  totalQuestionsBefore,
  isFirstHalfCompleted,
}: QuestionSectionProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isFirstHalfCompleted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isMounted, isFirstHalfCompleted]);

  const containerRef = useRef<HTMLDivElement>(null);

  const list = currentCategory.questions;
  const half = Math.floor(list.length / 2);
  const firstHalf = list.slice(0, half);
  const secondHalf = list.slice(half);

  const renderQuestions = (questions: typeof list, startIndex: number) =>
    questions.map((question, questionIndex) => {
      const actualQuestionIndex = startIndex + questionIndex;
      const displayNumber = totalQuestionsBefore + actualQuestionIndex + 1;

      return (
        <div key={actualQuestionIndex} className="gap-4 flex flex-col">
          <p className="text-base sm:text-lg leading-relaxed mb-4 text-gray-700 font-medium">
            {displayNumber}. {question.text}
          </p>
          <div className="flex items-center sm:gap-8 w-full justify-between">
            {[1, 2, 3, 4, 5].map((score: number) => (
              <ScoreButton
                key={score}
                score={score}
                isSelected={
                  answers[`${currentCategory.index}-${actualQuestionIndex}`] ===
                  score
                }
                onClick={() => handleAnswer(actualQuestionIndex, score)}
              />
            ))}
          </div>
        </div>
      );
    });

  return (
    <div
      ref={containerRef}
      className="max-w-5xl lg:w-3/4 bg-white rounded-lg shadow-xl overflow-hidden p-4 sm:p-8"
    >
      <motion.div
        key={`${currentCategory.sort}-${
          isFirstHalfCompleted ? "second" : "first"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gap-16 flex flex-col"
      >
        {isFirstHalfCompleted
          ? renderQuestions(secondHalf, half)
          : renderQuestions(firstHalf, 0)}
      </motion.div>
    </div>
  );
};
