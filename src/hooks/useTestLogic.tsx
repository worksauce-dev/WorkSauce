"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useTestLogicReturnInterface,
  SauceTest,
  CategoryType,
  Progress,
} from "@/types/saucetest/test";

export const useTestLogic = (
  testData: SauceTest
): useTestLogicReturnInterface => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [isFirstHalfCompleted, setIsFirstHalfCompleted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);

  // testData 유효성 검사 추가
  useEffect(() => {
    if (!testData) {
      console.error("Test data is not provided");
      return;
    }
  }, [testData]);

  // testData에서 카테고리 배열 생성 (createdAt, updatedAt 제외)
  const categories = useMemo(() => {
    return Object.entries(testData)
      .filter(([key]) => !["createdAt", "updatedAt"].includes(key))
      .map(([key, value]) => {
        // value가 PersonalityType인지 확인
        if (typeof value === "object" && value !== null) {
          const personality = value as CategoryType;

          return {
            sort: personality.sort,
            name: personality.name,
            questions: personality.questions,
            start: personality.start,
            advance: personality.advance,
            expert: personality.expert,
            utility: personality.utility,
            communicate: personality.communicate,
          };
        }
        return null;
      })
      .filter(
        (category): category is NonNullable<typeof category> =>
          category !== null
      );
  }, [testData]);

  const handleAnswer = useCallback(
    (questionIndex: number, selectedScore: number) => {
      if (selectedScore < 1 || selectedScore > 5) {
        console.error("Invalid score selected");
        return;
      }

      const key = `${currentCategoryIndex}-${questionIndex}`;

      setAnswers(prev => {
        if (prev[key] === selectedScore) {
          const { [key]: removed, ...rest } = prev;
          return rest;
        }
        return {
          ...prev,
          [key]: selectedScore,
        };
      });
    },
    [currentCategoryIndex]
  );

  // 현재 섹션의 모든 문제가 답변되었는지 확인
  const checkCanProceed = useCallback(() => {
    const currentCategory = categories[currentCategoryIndex];
    const halfQuestions = Math.ceil(currentCategory.questions.length / 2); // 9
    const startIndex = isFirstHalfCompleted ? halfQuestions : 0;
    const endIndex = isFirstHalfCompleted
      ? currentCategory.questions.length
      : halfQuestions;

    // 현재 섹션의 모든 문제에 대한 답변이 있는지 확인
    for (let i = startIndex; i < endIndex; i++) {
      if (!answers[`${currentCategoryIndex}-${i}`]) {
        return false;
      }
    }
    return true;
  }, [answers, categories, currentCategoryIndex, isFirstHalfCompleted]);

  // 현재 진행 가능 여부를 useMemo로 계산
  const canProceedToNext = useMemo(() => {
    return checkCanProceed();
  }, [checkCanProceed]);

  // 다음 섹션으로 이동
  const handleNextHalf = () => {
    if (!canProceedToNext) {
      alert("모든 문항에 답변해주세요.");
      return;
    }

    if (!isFirstHalfCompleted) {
      setIsFirstHalfCompleted(true);
    } else {
      if (currentCategoryIndex < categories.length - 1) {
        setCurrentCategoryIndex(prev => prev + 1);
        setIsFirstHalfCompleted(false);
      } else {
        // 마지막 카테고리의 마지막 섹션이면 VerbTest로 전환
        setIsTestCompleted(true);
      }
    }
  };

  // 현재 카테고리의 데이터만 추출하고 문제를 9개씩 분할
  const getCurrentCategoryData = () => {
    const currentCategory = categories[currentCategoryIndex];
    const allQuestions = currentCategory.questions;
    const halfQuestions = Math.ceil(allQuestions.length / 2); // 18개를 2로 나눔

    // isFirstHalfCompleted에 따라 앞/뒤 9문제 선택
    const currentQuestions = isFirstHalfCompleted
      ? allQuestions.slice(halfQuestions) // 뒤의 9문제
      : allQuestions.slice(0, halfQuestions); // 앞의 9문제

    return {
      questions: currentQuestions,
      name: currentCategory.name,
      sort: currentCategory.sort,
      start: currentCategory.start,
      advance: currentCategory.advance,
      expert: currentCategory.expert,
      utility: currentCategory.utility,
      communicate: currentCategory.communicate,
      index: currentCategoryIndex,
      total: categories.length,
    };
  };

  // 현재 카테고리 정보 계산
  const getCategoryInfo = useCallback(() => {
    const totalSections = categories.length * 2; // 각 카테고리당 2섹션
    const currentSection =
      currentCategoryIndex * 2 + (isFirstHalfCompleted ? 2 : 1); // 현재 섹션 번호

    return {
      current: currentSection,
      total: totalSections,
      sectionName: categories[currentCategoryIndex].name,
      isFirstHalf: !isFirstHalfCompleted,
    };
  }, [categories, currentCategoryIndex, isFirstHalfCompleted]);

  // 현재 섹션(9문제)의 진행도 계산
  const getCurrentSectionProgress = useCallback(() => {
    const currentCategory = categories[currentCategoryIndex];
    const halfQuestions = Math.ceil(currentCategory.questions.length / 2); // 9
    const startIndex = isFirstHalfCompleted ? halfQuestions : 0;
    const endIndex = isFirstHalfCompleted
      ? currentCategory.questions.length
      : halfQuestions;

    let answeredCount = 0;
    for (let i = startIndex; i < endIndex; i++) {
      if (answers[`${currentCategoryIndex}-${i}`]) {
        answeredCount++;
      }
    }

    return Math.round((answeredCount / 9) * 100); // 현재 섹션의 진행률 (0-100%)
  }, [answers, categories, currentCategoryIndex, isFirstHalfCompleted]);

  // 전체 진행도 계산
  const getTotalProgress = useCallback(() => {
    const totalSections = categories.length * 2; // 전체 섹션 수 (20)
    const completedSections =
      currentCategoryIndex * 2 + (isFirstHalfCompleted ? 1 : 0); // 완료된 섹션 수
    const currentSectionProgress = getCurrentSectionProgress() / 100; // 현재 섹션 진행도 (0-1)

    return Math.round(
      ((completedSections + currentSectionProgress) / totalSections) * 100
    );
  }, [
    categories.length,
    currentCategoryIndex,
    getCurrentSectionProgress,
    isFirstHalfCompleted,
  ]);

  // 스킵 처리 함수
  const handleSkip = () => {
    // 마지막 카테고리인지 체크
    if (currentCategoryIndex >= categories.length - 1) {
      setIsTestCompleted(true);
      return;
    }

    // 현재 카테고리의 모든 문항을 5점(매우 그렇다)으로 처리
    const currentQuestions = categories[currentCategoryIndex].questions;
    const newAnswers = { ...answers };

    // 조건 체크 없이 모든 문항을 5점으로 처리
    currentQuestions.forEach((_, index) => {
      const key = `${currentCategoryIndex}-${index}`;
      newAnswers[key] = 5; // 매우 그렇다 = 5점
    });

    setAnswers(newAnswers);
    setCurrentCategoryIndex(prev => prev + 1);
    setIsFirstHalfCompleted(false); // 새 카테고리의 첫 번째 섹션으로 초기화
  };

  // 최종 점수 계산 및 결과 반환
  const getFinalScores = useCallback(() => {
    const finalScores = categories.map((category, categoryIndex) => ({
      sort: category.sort,
      score: category.questions.reduce((total, _, index) => {
        const key = `${categoryIndex}-${index}`;
        const selectedScore = answers[key];
        if (!selectedScore) return total;

        const question = categories[categoryIndex].questions[index];
        const baseScore = question.score;
        const normalizedScore = (selectedScore - 1) / 4;
        return total + Math.round(baseScore * normalizedScore * 222.25);
      }, 0),
    }));
    return finalScores;
  }, [categories, answers]);

  // 진행도 관련 값들 반환
  const getProgress = useCallback((): Progress => {
    return {
      sectionProgress: getCurrentSectionProgress(),
      totalProgress: getTotalProgress(),
      categoryInfo: getCategoryInfo(),
    };
  }, [getCurrentSectionProgress, getTotalProgress, getCategoryInfo]);
  // verbTest 데이터 정제

  const verbTestData = useMemo(() => {
    return Object.entries(testData)
      .filter(([key]) => !["createdAt", "updatedAt"].includes(key))
      .map(([_, personality]) => {
        if (typeof personality !== "string") {
          // string 타입 체크
          return {
            sort: personality.sort,
            name: personality.name,
            start: personality.start,
            advance: personality.advance,
            expert: personality.expert,
            utility: personality.utility,
            communicate: personality.communicate,
          };
        }
        return null;
      })
      .filter((data): data is NonNullable<typeof data> => data !== null);
  }, [testData]);

  return {
    currentCategoryData: getCurrentCategoryData(),
    handleAnswer,
    selectedAnswers: answers,
    isFirstHalfCompleted,
    handleNextHalf,
    canProceedToNext,
    handleSkip,
    isTestCompleted,
    getFinalScores,
    progress: getProgress(),
    verbTestData,
  };
};
