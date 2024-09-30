"use client";

import { useState, useEffect } from "react";
import { testArr } from "@/constant/test";
import { useTestLogicReturnInterface } from "@/types/test";
import { useMemo } from "react";

export const useTestLogic = (): useTestLogicReturnInterface => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFirstHalfCompleted, setIsFirstHalfCompleted] = useState(false);

  const totalQuestionsBefore = useMemo(() => {
    return testArr.slice(0, currentCategoryIndex).reduce((acc, category) => {
      return acc + category.questions.length;
    }, 0);
  }, [currentCategoryIndex]);

  const currentCategoryQuestions = testArr[currentCategoryIndex].questions;
  const halfQuestions = Math.floor(currentCategoryQuestions.length / 2);

  useEffect(() => {
    const answeredQuestions = currentCategoryQuestions.filter(
      (_, index) => answers[`${currentCategoryIndex}-${index}`] !== undefined
    ).length;

    if (answeredQuestions >= halfQuestions && !isFirstHalfCompleted) {
      setIsFirstHalfCompleted(true);
    } else if (answeredQuestions < halfQuestions && isFirstHalfCompleted) {
      setIsFirstHalfCompleted(false);
    }
  }, [
    answers,
    currentCategoryIndex,
    halfQuestions,
    isFirstHalfCompleted,
    currentCategoryQuestions,
  ]);

  const handleAnswer = (questionIndex: number, score: number) => {
    const key = `${currentCategoryIndex}-${questionIndex}`;

    setAnswers(prev => {
      if (prev[key] === score) {
        const { [key]: removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [key]: score,
      };
    });
  };

  const handleNextHalf = () => {
    setIsFirstHalfCompleted(true);
  };

  const getCurrentProgress = () => {
    const currentCategory = testArr[currentCategoryIndex];
    const totalQuestions = currentCategory.questions.length;
    const halfQuestions = Math.ceil(totalQuestions / 2);
    const answeredQuestions = currentCategory.questions.filter(
      (_, index) => answers[`${currentCategoryIndex}-${index}`] !== undefined
    ).length;

    if (!isFirstHalfCompleted) {
      return (answeredQuestions / halfQuestions) * 100;
    } else {
      return (
        ((answeredQuestions - halfQuestions) /
          (totalQuestions - halfQuestions)) *
        100
      );
    }
  };

  const canProceed = isFirstHalfCompleted && getCurrentProgress() === 100;

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
    isFirstHalfCompleted,
    handleAnswer,
    handleNextCategory,
    handleSkip,
    getCurrentProgress,
    canProceed,
    calculateScores,
    totalQuestionsBefore,
    handleNextHalf,
  };
};
