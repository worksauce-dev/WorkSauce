"use client";

import { useState, useEffect } from "react";
import { testArr } from "@/constant/test";
import { useTestLogicReturnInterface } from "@/types/test";

export const useTestLogic = (): useTestLogicReturnInterface => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (questionIndex: number, score: number) => {
    const key = `${currentCategoryIndex}-${questionIndex}`;

    setAnswers(prev => {
      // 이미 선택된 답변이 있을 경우
      if (prev[key] === score) {
        const { [key]: removed, ...rest } = prev;
        return rest;
      }

      // 새로운 답변이 선택된 경우
      return {
        ...prev,
        [key]: score,
      };
    });
  };

  const getCurrentProgress = () => {
    const currentCategory = testArr[currentCategoryIndex];
    const answeredQuestions = currentCategory.questions.filter(
      (_, index) => answers[`${currentCategoryIndex}-${index}`] !== undefined
    ).length;
    return (answeredQuestions / currentCategory.questions.length) * 100;
  };

  const canProceed = getCurrentProgress() === 100;

  const handleNextCategory = () => {
    if (canProceed) {
      if (currentCategoryIndex < testArr.length - 1) {
        setCurrentCategoryIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }
  };

  const handleSkip = () => {
    const newAnswers: { [key: string]: number } = {};
    testArr.forEach((category, categoryIndex) => {
      category.questions.forEach((_, questionIndex) => {
        newAnswers[`${categoryIndex}-${questionIndex}`] = 5;
      });
    });
    setAnswers(newAnswers);
    setIsCompleted(true);
  };

  const calculateScores = () => {
    return testArr.map(category => {
      const totalScore = category.questions.reduce((acc, _, index) => {
        return acc + (answers[`${testArr.indexOf(category)}-${index}`] || 0);
      }, 0);
      return {
        sort: category.sort,
        score: totalScore,
        maxScore: category.questions.length * 5,
      };
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentCategoryIndex, isCompleted]);

  return {
    currentCategory: {
      ...testArr[currentCategoryIndex],
      index: currentCategoryIndex,
      total: testArr.length,
    },
    answers,
    isCompleted,
    handleAnswer,
    handleNextCategory,
    handleSkip,
    getCurrentProgress,
    canProceed,
    calculateScores,
  };
};
