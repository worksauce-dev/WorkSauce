"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { SugarTest } from "@/types/sugartest/test";
import { SugarQuestionSection } from "./SugarQuestionSection";
import { SugarProgressSection } from "./SugarProgressSection";
import { SugarTestResult } from "@/types/sugartest/sugarTestResult";
import { CATEGORIES } from "@/constants/sugartest";
import SugarTestCompletionResult from "./result/SugarTestCompletionResult";
import TestLoadingAnimation from "../common/TestLoadingAnimation";
interface SugarTestContainerProps {
  name: string;
  email: string;
  testData: SugarTest;
  isAdmin: boolean;
  testId: string;
  dashboardId: string;
  submitTest: (
    dashboardId: string,
    testId: string,
    email: string,
    name: string,
    testResult: SugarTestResult
  ) => Promise<{ success: boolean }>;
}

export const SugarTestContainer = ({
  name,
  email,
  testData,
  isAdmin,
  testId,
  dashboardId,
  submitTest,
}: SugarTestContainerProps) => {
  // 현재 카테고리 인덱스 상태
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // 선택된 답변들 상태
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 카테고리
  const currentCategory = CATEGORIES[currentCategoryIndex];

  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<SugarTestResult | null>(null);

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
    // 현재 카테고리의 모든 문항을 1점으로 자동 입력
    const categoryQuestions = testData[currentCategory];
    const newAnswers = { ...selectedAnswers };

    categoryQuestions.forEach((_, index) => {
      newAnswers[`${currentCategory}-${index}`] = 1;
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
    const categories = {
      strain: [] as number[],
      uncertainty: [] as number[],
      grievance: [] as number[],
      autonomy: [] as number[],
      recognition: [] as number[],
    };

    CATEGORIES.forEach(category => {
      testData[category].forEach((_, index) => {
        const score = selectedAnswers[`${category}-${index}`];
        if (score === undefined)
          throw new Error(`Missing answer for ${category} question ${index}`);
        categories[category].push(score);
      });
    });

    return {
      createdAt: new Date().toISOString(),
      testId,
      categories,
      type: "sugar",
    };
  }, [selectedAnswers, testData, testId]);

  // 제출 핸들러 개선
  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);

      // 로딩 시작 시간 기록
      const loadingStartTime = Date.now();

      // 최소 로딩 시간 (밀리초)
      const MIN_LOADING_TIME = 10000; // 10초

      // 데이터 유효성 검사
      if (!validateTestData()) {
        throw new Error("모든 질문에 답변해주세요.");
      }

      const resultData = prepareResultData();

      const { success } = await submitTest(
        dashboardId,
        testId,
        email,
        name,
        resultData
      );

      if (!success) {
        throw new Error("테스트 제출 중 오류가 발생했습니다.");
      }

      // 테스트 결과 저장
      setTestResult(resultData);

      // 경과 시간 계산
      const elapsedTime = Date.now() - loadingStartTime;

      // 최소 로딩 시간보다 적게 걸렸다면 차이만큼 대기
      if (elapsedTime < MIN_LOADING_TIME) {
        await new Promise(resolve =>
          setTimeout(resolve, MIN_LOADING_TIME - elapsedTime)
        );
      }

      // 최소 로딩 시간이 지난 후 완료 상태로 변경
      setIsTestCompleted(true);
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

  // 테스트가 완료되었으면 결과 컴포넌트 렌더링
  if (isTestCompleted && testResult) {
    return <SugarTestCompletionResult name={name} testResult={testResult} />;
  }

  // 제출 중이면 로딩 컴포넌트 렌더링
  if (isSubmitting) {
    return <TestLoadingAnimation name={name} />;
  }

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
