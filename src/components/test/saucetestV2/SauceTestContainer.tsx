"use client";

import { SauceTestResult, SauceTestV2 } from "@/types/saucetestV2Type";
import { verbQuestions } from "@/constants/saucetest";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MdRefresh } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface SauceTestContainerProps {
  name: string;
  email: string;
  dashboardId: string;
  testId: string;
  submitTest: (
    dashboardId: string,
    testId: string,
    email: string,
    name: string,
    testResult: SauceTestResult
  ) => Promise<{ success: boolean }>;
  testData: SauceTestV2;
}

export const SauceTestContainer = ({
  name,
  email,
  dashboardId,
  testId,
  submitTest,
  testData,
}: SauceTestContainerProps) => {
  const router = useRouter();
  const [step, setStep] = useState<
    "start" | "advance" | "utility" | "communicate" | "expert"
  >("start");
  const [selectedVerbs, setSelectedVerbs] = useState<string[]>([]);
  const [selectedSorts, setSelectedSorts] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{
    [key in
      | "start"
      | "advance"
      | "utility"
      | "communicate"
      | "expert"]?: string[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const currentStepQuestion = verbQuestions[step];

  const initialScoreMap = useMemo(
    () =>
      Object.fromEntries(
        Object.values(testData.categories).map(cat => [cat.name, 0])
      ),
    [testData.categories]
  );
  const [scoreMap, setScoreMap] =
    useState<Record<string, number>>(initialScoreMap);
  const [isQuestionTest, setIsQuestionTest] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [currentCategoryIdx, setCurrentCategoryIdx] = useState(0);

  // 임시저장 키에 testId 포함
  const tempKey = `sauceTestTemp_${testId}`;

  const handleVerbSelect = (verb: string, sort: string) => {
    if (step === "start") {
      setSelectedVerbs(prev => {
        if (prev.includes(verb)) {
          setSelectedSorts(prevSorts => prevSorts.filter(s => s !== sort));
          return prev.filter(v => v !== verb);
        }
        if (prev.length < 2) {
          setSelectedSorts(prevSorts => [...prevSorts, sort]);
          return [...prev, verb];
        }
        return prev;
      });
    } else {
      setSelectedVerbs(prev => {
        if (prev.includes(verb)) {
          return prev.filter(v => v !== verb);
        }
        if (prev.length < 2) {
          return [...prev, verb];
        }
        return prev;
      });
    }
  };

  const getCurrentProgress = () => {
    const stepOrder = ["start", "advance", "utility", "communicate", "expert"];
    const currentIndex = stepOrder.indexOf(step);
    return (currentIndex / (stepOrder.length - 1)) * 100;
  };

  const getStepLabel = (step: string): string => {
    const labels = {
      start: "시작 동사",
      advance: "발전 동사",
      utility: "기술 동사",
      communicate: "소통 동사",
      expert: "결과 동사",
    };
    return labels[step as keyof typeof labels] || "";
  };

  const getFilteredVerbs = () => {
    const verbs: { verb: string; category: string; sort: string }[] = [];

    Object.entries(testData.categories).forEach(
      ([categoryName, categoryData]) => {
        if (step === "start") {
          const startVerbs = Array.isArray(categoryData.verbs.start)
            ? categoryData.verbs.start
            : [categoryData.verbs.start];
          startVerbs.forEach(verb => {
            verbs.push({
              verb,
              category: categoryName,
              sort: categoryData.sort,
            });
          });
        } else if (selectedSorts.includes(categoryData.sort)) {
          let stepVerbs: string[] = [];
          switch (step) {
            case "advance":
              stepVerbs = Array.isArray(categoryData.verbs.advance)
                ? categoryData.verbs.advance
                : [categoryData.verbs.advance];
              break;
            case "utility":
              stepVerbs = Array.isArray(categoryData.verbs.utility)
                ? categoryData.verbs.utility
                : [categoryData.verbs.utility];
              break;
            case "communicate":
              stepVerbs = Array.isArray(categoryData.verbs.communicate)
                ? categoryData.verbs.communicate
                : [categoryData.verbs.communicate];
              break;
            case "expert":
              stepVerbs = Array.isArray(categoryData.verbs.expert)
                ? categoryData.verbs.expert
                : [categoryData.verbs.expert];
              break;
          }
          stepVerbs.forEach(verb => {
            verbs.push({
              verb,
              category: categoryName,
              sort: categoryData.sort,
            });
          });
        }
      }
    );

    return verbs;
  };

  const clickReset = () => {
    setStep("start");
    setSelectedVerbs([]);
    setSelectedSorts([]);
    setAnswers({});
    setScoreMap(initialScoreMap);
    setIsQuestionTest(false);
    setQuestionAnswers({});
    setCurrentCategoryIdx(0);
    localStorage.removeItem(tempKey);
  };

  const handleNext = () => {
    setAnswers(prev => ({ ...prev, [step]: selectedVerbs }));
    const stepOrder = ["start", "advance", "utility", "communicate", "expert"];
    const currentIndex = stepOrder.indexOf(step);

    // 선택된 동사들의 category name별로 점수 1점씩 올리기
    const updatedScoreMap = { ...scoreMap };
    selectedVerbs.forEach(verb => {
      Object.values(testData.categories).forEach(categoryData => {
        const allVerbs = [
          ...(Array.isArray(categoryData.verbs.start)
            ? categoryData.verbs.start
            : [categoryData.verbs.start]),
          ...(Array.isArray(categoryData.verbs.advance)
            ? categoryData.verbs.advance
            : [categoryData.verbs.advance]),
          ...(Array.isArray(categoryData.verbs.utility)
            ? categoryData.verbs.utility
            : [categoryData.verbs.utility]),
          ...(Array.isArray(categoryData.verbs.communicate)
            ? categoryData.verbs.communicate
            : [categoryData.verbs.communicate]),
          ...(Array.isArray(categoryData.verbs.expert)
            ? categoryData.verbs.expert
            : [categoryData.verbs.expert]),
        ];
        if (allVerbs.includes(verb)) {
          updatedScoreMap[categoryData.name] =
            (updatedScoreMap[categoryData.name] || 0) + 1;
        }
      });
    });
    setScoreMap(updatedScoreMap);

    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1] as typeof step;
      setStep(nextStep);
      setSelectedVerbs(answers[nextStep] || []);
    } else {
      // 마지막 단계에서 문항테스트로 전환
      setIsQuestionTest(true);
    }
  };

  // 문항테스트 답변 핸들러
  const handleQuestionAnswer = (questionIndex: number, score: number) => {
    setQuestionAnswers(prev => ({ ...prev, [questionIndex]: score }));
  };

  const renderQuestion = () => {
    return (
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <span>{currentStepQuestion}</span>
        <span className="text-orange-200 text-base whitespace-nowrap">
          2개 선택
        </span>
      </h2>
    );
  };

  const renderAnswers = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
        {getFilteredVerbs().map(({ verb, category, sort }) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVerbSelect(verb, sort)}
            key={verb}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200
              ${
                selectedVerbs.includes(verb)
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-orange-50"
              }
            `}
          >
            <div className="flex flex-col items-center gap-1">
              <span>{verb}</span>
            </div>
          </motion.button>
        ))}
      </div>
    );
  };

  // 문항테스트 UI (QuestionSection.tsx 참고)
  const renderQuestionTest = () => {
    // 카테고리별로 10문제씩만 보여줌
    const allCategories = Object.values(testData.categories);
    const currentCategory = allCategories[currentCategoryIdx];
    const questions = currentCategory.questions;
    const globalStartIdx = currentCategoryIdx * questions.length;
    const answerLabels = [
      "매우 아니다",
      "아니다",
      "보통",
      "그렇다",
      "매우 그렇다",
    ];
    return (
      <>
        {questions.map((question: { text: string }, idx: number) => (
          <div
            key={idx}
            className="space-y-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-start gap-2">
              <span
                className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 min-w-[24px]"
                aria-hidden="true"
              >
                {globalStartIdx + idx + 1}.
              </span>
              <p
                className="text-sm sm:text-base md:text-lg text-gray-700 font-medium"
                id={`question-${globalStartIdx + idx}`}
              >
                {question.text}
              </p>
            </div>
            <fieldset
              className="grid grid-cols-5 gap-0.5 sm:gap-1 md:gap-2 w-full max-w-4xl mx-auto px-1 sm:px-2 md:px-4"
              aria-labelledby={`question-${globalStartIdx + idx}`}
            >
              <legend className="sr-only">점수 선택: {question.text}</legend>
              {[1, 2, 3, 4, 5].map((score: number, scoreIdx: number) => (
                <button
                  key={score}
                  type="button"
                  className={`w-full py-2 rounded-lg font-medium border transition-all duration-200 text-sm
                    ${
                      questionAnswers[globalStartIdx + idx] === score
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-md"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-orange-50"
                    }
                  `}
                  onClick={() =>
                    handleQuestionAnswer(globalStartIdx + idx, score)
                  }
                  aria-label={`${score}점`}
                >
                  {answerLabels[scoreIdx]}
                </button>
              ))}
            </fieldset>
            {idx < questions.length - 1 && (
              <div className="h-px bg-gray-100 mt-8" aria-hidden="true" />
            )}
          </div>
        ))}
      </>
    );
  };

  // 문항테스트용 사이드바
  const renderQuestionSidebar = () => {
    const allCategories = Object.values(testData.categories);
    const totalCategories = allCategories.length;
    const questionsPerCategory = allCategories[0]?.questions.length || 10;
    const answeredInCategory = Object.keys(questionAnswers).filter(key => {
      const idx = Number(key);
      return (
        idx >= currentCategoryIdx * questionsPerCategory &&
        idx < (currentCategoryIdx + 1) * questionsPerCategory
      );
    }).length;
    const isNextEnabled = answeredInCategory === questionsPerCategory;

    // 전체 유형 진행률 (0~10)
    const completedCategories = currentCategoryIdx;
    const progressText = `${completedCategories + 1}/${totalCategories}`;
    const progressPercent = ((completedCategories + 1) / totalCategories) * 100;

    const handleNextCategory = () => {
      setCurrentCategoryIdx(idx => Math.min(allCategories.length - 1, idx + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const handlePrevCategory = () => {
      setCurrentCategoryIdx(idx => Math.max(0, idx - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const isLastCategory = currentCategoryIdx === allCategories.length - 1;

    // 문항테스트 제출 핸들러
    const handleSubmitQuestions = async () => {
      if (!isNextEnabled) return;
      setIsSubmitting(true);
      try {
        // 문항테스트 점수 집계
        const allCategories = Object.values(testData.categories);
        const questionsPerCategory = allCategories[0]?.questions.length || 10;
        const questionScoreMap: Record<string, number> = {};
        Object.entries(questionAnswers).forEach(([qIdx, score]) => {
          const idx = Number(qIdx);
          const categoryIdx = Math.floor(idx / questionsPerCategory);
          const categoryName = allCategories[categoryIdx]?.name;
          if (categoryName) {
            questionScoreMap[categoryName] =
              (questionScoreMap[categoryName] || 0) + score;
          }
        });
        // 동사테스트 점수와 합산
        const finalScoreMap: Record<string, number> = {};
        Object.keys(testData.categories).forEach(categoryName => {
          finalScoreMap[categoryName] =
            (scoreMap[categoryName] || 0) +
            (questionScoreMap[categoryName] || 0);
        });
        // 최종 결과 객체 생성
        const result: SauceTestResult = {
          categories: finalScoreMap,
          createdAt: new Date().toISOString(),
          testId,
        };

        await submitTest(dashboardId, testId, email, name, result);
        setShowSuccessModal(true);
      } catch (error) {
        console.error("제출 중 오류 발생:", error);
        alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="h-fit w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:sticky lg:top-32 space-y-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">진행 상황</h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clickReset}
              className="py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 
                border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <MdRefresh size={18} />
              다시하기
            </motion.button>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-center text-sm">
              <span className="text-gray-600 font-medium">{progressText}</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="w-1/2 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all disabled:opacity-50"
              onClick={handlePrevCategory}
              disabled={currentCategoryIdx === 0}
            >
              이전
            </button>
            {isLastCategory ? (
              <button
                type="button"
                className="w-1/2 py-3 rounded-lg font-medium border border-orange-500 text-orange-700 bg-white hover:bg-orange-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={!isNextEnabled || isSubmitting}
                onClick={handleSubmitQuestions}
              >
                {isSubmitting ? (
                  <>
                    <ImSpinner8 className="animate-spin" size={18} />
                    제출 중...
                  </>
                ) : (
                  "제출하기"
                )}
              </button>
            ) : (
              <button
                type="button"
                className="w-1/2 py-3 rounded-lg font-medium border border-orange-500 text-orange-700 bg-white hover:bg-orange-50 transition-all disabled:opacity-50"
                onClick={handleNextCategory}
                disabled={!isNextEnabled}
              >
                다음
              </button>
            )}
          </div>
          <button
            type="button"
            className="w-full py-3 mt-2 rounded-lg font-medium border border-blue-500 text-blue-700 bg-white hover:bg-blue-50 transition-all"
            onClick={handleTempSave}
          >
            임시저장
          </button>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm border border-gray-100 lg:sticky lg:top-0 flex flex-col">
        <div className="p-6 space-y-6 flex-1 flex flex-col">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">진행 상황</h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clickReset}
                className="py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 
                  border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <MdRefresh size={18} />
                다시하기
              </motion.button>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getCurrentProgress()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">
                  {getStepLabel(step)}
                </span>
                <span className="text-gray-600 font-medium">
                  {Math.round(getCurrentProgress())}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {(
              ["start", "advance", "utility", "communicate", "expert"] as const
            ).map(stepType => (
              <div
                key={stepType}
                className="bg-gray-50 p-4 rounded-lg flex items-center justify-between max-h-[52px]"
              >
                <p className="text-sm font-medium text-gray-700">
                  {getStepLabel(stepType)}
                </p>
                <div className="flex gap-2">
                  {(answers[stepType] || []).map(
                    (verb: string, idx: number) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-1 rounded-full ${
                          idx === 0
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {verb}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
              ${
                selectedVerbs.length === 2
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
            onClick={() => {
              if (selectedVerbs.length === 2) {
                handleNext();
              }
            }}
            disabled={selectedVerbs.length !== 2}
          >
            다음
          </motion.button>
          <button
            type="button"
            className="w-full py-3 mt-4 rounded-lg font-medium border border-blue-500 text-blue-700 bg-white hover:bg-blue-50 transition-all"
            onClick={handleTempSave}
          >
            임시저장
          </button>
        </div>
      </div>
    );
  };

  // 임시저장 핸들러
  const handleTempSave = () => {
    const saveData = {
      answers,
      scoreMap,
      step,
      selectedVerbs,
      selectedSorts,
      isQuestionTest,
      questionAnswers,
      currentCategoryIdx,
    };
    localStorage.setItem(tempKey, JSON.stringify(saveData));
    alert("임시저장 완료!");
  };

  useEffect(() => {
    const saved = localStorage.getItem(tempKey);
    if (saved) {
      const data = JSON.parse(saved);
      setAnswers(data.answers || {});
      setScoreMap(data.scoreMap || initialScoreMap);
      setStep(data.step || "start");
      setSelectedVerbs(data.selectedVerbs || []);
      setSelectedSorts(data.selectedSorts || []);
      setIsQuestionTest(data.isQuestionTest || false);
      setQuestionAnswers(data.questionAnswers || {});
      setCurrentCategoryIdx(data.currentCategoryIdx || 0);
    }
  }, [tempKey, initialScoreMap]);

  // 문항테스트에서 카테고리 이동 시 스크롤 최상단 이동
  useEffect(() => {
    if (isQuestionTest) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentCategoryIdx, isQuestionTest]);

  return (
    <div className="bg-[#F7F7F9] py-12 px-4 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col lg:flex-row gap-8 justify-center items-stretch min-h-screen">
      {isQuestionTest ? (
        <>
          <div className="w-full lg:w-3/4 xl:w-3/5 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 space-y-8">
            {renderQuestionTest()}
          </div>
          {renderQuestionSidebar()}
        </>
      ) : (
        <>
          <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              {renderQuestion()}
            </div>
            {renderAnswers()}
          </div>
          {renderSidebar()}
        </>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center space-y-6"
          >
            <div className="flex justify-center">
              <IoCheckmarkCircle className="text-green-500" size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">제출 완료!</h3>
              <p className="text-gray-600">
                소스테스트 결과가 성공적으로 제출되었습니다.
                <br />
              </p>
            </div>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/");
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              확인
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
