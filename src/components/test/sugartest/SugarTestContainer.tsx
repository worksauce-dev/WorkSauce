"use client";

import { useState, useCallback, useMemo } from "react";
import { SugarTest } from "@/types/sugartest/test";
import { SugarQuestionSection } from "./SugarQuestionSection";
import { SugarProgressSection } from "./SugarProgressSection";
import { SugarTestResult } from "@/types/sugartest/sugarTestResult";
interface SugarTestContainerProps {
  name: string;
  email: string;
  testData: SugarTest;
  isAdmin: boolean;
  groupId: string;
  submitTest: (
    groupId: string,
    email: string,
    name: string,
    testResult: SugarTestResult
  ) => Promise<void>;
}

const CATEGORIES = [
  "strain",
  "uncertainty",
  "grievance",
  "autonomy",
  "recognition",
] as const;

export const SugarTestContainer = ({
  name,
  email,
  testData,
  isAdmin,
  groupId,
  submitTest,
}: SugarTestContainerProps) => {
  // 현재 카테고리 인덱스 상태
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // 선택된 답변들 상태
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number;
  }>({});

  // 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 카테고리
  const currentCategory = CATEGORIES[currentCategoryIndex];

  // 전체 진행률 계산
  const getTotalProgress = useCallback(() => {
    const totalQuestions = CATEGORIES.reduce(
      (total, category) => total + testData[category].length,
      0
    );
    const totalAnswered = Object.keys(selectedAnswers).length;
    return Math.round((totalAnswered / totalQuestions) * 100);
  }, [selectedAnswers, testData]);

  // 현재 카테고리가 완료되었는지 확인
  const isCurrentCategoryComplete = useCallback(() => {
    const categoryQuestions = testData[currentCategory];
    return categoryQuestions.every(
      (_, index) => selectedAnswers[`${currentCategory}-${index}`] !== undefined
    );
  }, [currentCategory, selectedAnswers, testData]);

  // 답변 처리 함수
  const handleAnswer = useCallback(
    (questionIndex: number, score: number) => {
      setSelectedAnswers(prev => ({
        ...prev,
        [`${currentCategory}-${questionIndex}`]: score,
      }));
    },
    [currentCategory]
  );

  // 다음 카테고리로 이동
  const handleNextCategory = useCallback(() => {
    if (currentCategoryIndex < CATEGORIES.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
    }
  }, [currentCategoryIndex]);

  // 스킵 기능 (관리자용)
  const handleSkip = useCallback(() => {
    // 현재 카테고리의 모든 문항을 자동 입력
    const categoryQuestions = testData[currentCategory];
    const newAnswers = { ...selectedAnswers };

    // 마지막 섹션이면 5점, 아니면 3점으로 설정
    const defaultScore = currentCategoryIndex === CATEGORIES.length - 1 ? 5 : 3;

    categoryQuestions.forEach((_, index) => {
      newAnswers[`${currentCategory}-${index}`] = defaultScore;
    });

    setSelectedAnswers(newAnswers);

    // 마지막 섹션이 아닐 경우에만 다음으로 이동
    if (currentCategoryIndex < CATEGORIES.length - 1) {
      handleNextCategory();
    }
  }, [
    currentCategory,
    currentCategoryIndex,
    handleNextCategory,
    selectedAnswers,
    testData,
  ]);

  // 진행 상황 객체
  const progress = useMemo(
    () => ({
      currentCategory: currentCategoryIndex + 1,
      totalCategories: CATEGORIES.length,
      currentProgress: getTotalProgress(),
    }),
    [currentCategoryIndex, getTotalProgress]
  );

  // 데이터 유효성 검사 함수 추가
  const validateTestData = useCallback((): boolean => {
    // 모든 질문에 답변했는지 확인
    const totalQuestions = CATEGORIES.reduce(
      (total, category) => total + testData[category].length,
      0
    );
    const answeredQuestions = Object.keys(selectedAnswers).length;

    return totalQuestions === answeredQuestions;
  }, [selectedAnswers, testData]);

  // 결과 데이터 준비 함수 개선
  const prepareResultData = useCallback((): SugarTestResult => {
    const categories: { [key: string]: number[] } = {};
    const categoryScores: {
      [key: string]: { total: number; average: number };
    } = {};
    let totalScore = 0;
    let totalQuestions = 0;

    // 카테고리별 데이터 구성
    CATEGORIES.forEach(category => {
      const scores: number[] = [];
      let categoryTotal = 0;

      // 해당 카테고리의 모든 답변 수집
      testData[category].forEach((_, index) => {
        const score = selectedAnswers[`${category}-${index}`];
        // 점수가 없는 경우 예외 처리
        if (score === undefined) {
          throw new Error(`Missing answer for ${category} question ${index}`);
        }
        scores.push(score);
        categoryTotal += score;
      });

      categories[category] = scores;
      categoryScores[category] = {
        total: categoryTotal,
        // 소수점 2자리까지만 표시
        average: Number((categoryTotal / scores.length).toFixed(2)),
      };

      totalScore += categoryTotal;
      totalQuestions += scores.length;
    });

    return {
      createdAt: new Date().toISOString(),
      groupId,
      categories,
      metadata: {
        totalScore,
        categoryScores,
        averageScore: Number((totalScore / totalQuestions).toFixed(2)),
      },
    };
  }, [selectedAnswers, testData, groupId]);

  // 제출 핸들러 개선
  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);

      // 데이터 유효성 검사
      if (!validateTestData()) {
        throw new Error("모든 질문에 답변해주세요.");
      }

      const resultData = prepareResultData();
      await submitTest(groupId, email, name, resultData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "테스트 제출 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F7F9] border-b-2 border-gray-100 min-h-screen py-12 px-2 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col lg:flex-row gap-8 justify-center">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <SugarQuestionSection
        testData={testData}
        currentCategory={currentCategory}
        handleAnswer={handleAnswer}
        selectedAnswers={selectedAnswers}
      />
      <SugarProgressSection
        groupId={groupId}
        name={name}
        email={email}
        progress={progress}
        handleNextCategory={handleNextCategory}
        handleSkip={isAdmin ? handleSkip : undefined}
        canProceedToNext={isCurrentCategoryComplete()}
        isAdmin={isAdmin}
        isLastCategory={currentCategoryIndex === CATEGORIES.length - 1}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
