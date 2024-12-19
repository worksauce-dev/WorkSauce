"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { verbQuestions } from "@/constant/test";
import { RefreshCw, Send } from "lucide-react";
import { ScoreType, VerbType } from "@/types/test";
import { sendSubmissionCompleteEmail } from "@/utils/sendEmail";

interface VerbTestProps {
  prevScores: {
    sort: string;
    score: number;
    color?: string;
  }[];
  name: string;
  email: string;
  groupId: string;
  submitTest: (
    groupId: string,
    email: string,
    name: string,
    testResult: ScoreType[]
  ) => void;
  verbTestData: VerbType[];
  dashboardName: string;
}

interface TestItem {
  sort: string;
  start: string;
  advance: string[];
  utility: string[];
  communicate: string[];
  expert: string[];
  name: string;
}

export const VerbTest = ({
  prevScores,
  name,
  email,
  groupId,
  submitTest,
  verbTestData,
  dashboardName,
}: VerbTestProps) => {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(prevScores);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const SCORE_WEIGHTS = {
    start: 100,
    advance: 150,
    utility: 200,
    communicate: 250,
    expert: 300,
  };

  // 현재 단계의 타입을 반환하는 함수
  const getStepType = (step: number): keyof typeof SCORE_WEIGHTS => {
    switch (Math.floor(step)) {
      case 0:
        return "start";
      case 1:
        return "advance";
      case 2:
        return "utility";
      case 3:
        return "communicate";
      case 4:
        return "expert";
      default:
        return "start";
    }
  };

  // 현재 단계의 단어를 가져오는 함수
  const getWordForCurrentStep = (item: TestItem): string => {
    const stepType = getStepType(step);
    return stepType === "start" ? item.start : item[stepType][0];
  };

  // 단어가 선택되었는지 확인하는 함수
  const isWordSelected = (item: TestItem): boolean => {
    const word = getWordForCurrentStep(item);
    return selectedAnswers.includes(word);
  };

  // 단계 레이블을 가져오는 함수
  const getStepLabel = (index: number): string => {
    const labels = {
      0: "시작 동사",
      1: "발전 동사",
      2: "기술 동사",
      3: "소통 동사",
      4: "결과 동사",
    };
    return labels[index as keyof typeof labels] || "";
  };

  // 특정 단계의 선택된 단어들을 가져오는 함수
  const getSelectedWordsForStep = (stepIndex: number): string[] => {
    const startIndex = stepIndex * 2;
    return selectedAnswers.slice(startIndex, startIndex + 2);
  };

  // 현재 진행률을 계산하는 함수
  const getCurrentProgress = (): number => {
    return (step / 5) * 100;
  };

  const handleSelect = (target: TestItem, word: string) => {
    const isSelected = selectedAnswers.includes(word);
    const stepType = getStepType(step);
    const currentStepAnswers = selectedAnswers.filter(
      (_, index) => Math.floor(index / 2) === Math.floor(step)
    );

    if (!isSelected && currentStepAnswers.length >= 2) {
      return;
    }

    const scoreChange = isSelected
      ? -SCORE_WEIGHTS[stepType]
      : SCORE_WEIGHTS[stepType];

    setSelectedAnswers(prev => {
      if (isSelected) {
        const newAnswers = prev.filter(w => w !== word);
        // 현재 단계의 선택된 단어 수를 다시 계산
        const updatedStepAnswers = newAnswers.filter(
          (_, index) => Math.floor(index / 2) === Math.floor(step)
        );
        // 선택 취소 시 step 조정
        if (updatedStepAnswers.length === 0) {
          setStep(Math.floor(step));
        } else if (updatedStepAnswers.length === 1) {
          setStep(Math.floor(step) + 0.5);
        }
        return newAnswers;
      }
      return [...prev, word];
    });

    // 선택 시에만 step 증가
    if (!isSelected && currentStepAnswers.length < 2) {
      setStep(prev => prev + 0.5);
    }

    setScores(prev =>
      prev.map(score =>
        score.sort === target.sort
          ? { ...score, score: score.score + scoreChange }
          : score
      )
    );
  };

  const clickReset = () => {
    setStep(0);
    setScores(prevScores);
    setSelectedAnswers([]);
    setSubmitStatus("idle");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus("loading");

    try {
      // 테스트 결과 제출
      await submitTest(groupId, email, name, scores);

      // 제출 완료 이메일 발송
      await sendSubmissionCompleteEmail({
        to: email,
        userName: name,
        dashboardName: dashboardName,
      });

      setSubmitStatus("success");
      setTimeout(() => {
        window.close();
      }, 3000);
    } catch (error) {
      console.error("Failed to save test result:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (step === 5) return null;
    return (
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <span>{verbQuestions[Math.floor(step)]}</span>
        <span className="text-orange-200 text-base whitespace-nowrap">
          2개 선택
        </span>
      </h2>
    );
  };

  const renderSubmitFeedback = () => {
    if (submitStatus === "success") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full text-center flex flex-col gap-4 justify-center items-center p-8"
        >
          <h3 className="text-2xl font-semibold text-green-600 mb-4">
            제출 완료!
          </h3>
          <p className="text-lg mb-2">
            테스트 결과가 성공적으로 제출되었습니다.
          </p>
          <p className="text-gray-600">
            결과는 담당자 검토 후 이메일로 안내드릴 예정입니다.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            3초 후 자동으로 창이 닫힙니다...
          </p>
        </motion.div>
      );
    }

    if (submitStatus === "error") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full text-center flex flex-col gap-4 justify-center items-center p-8"
        >
          <h3 className="text-2xl font-semibold text-red-600 mb-4">
            제출 실패
          </h3>
          <p className="text-lg mb-2">테스트 제출 중 문제가 발생했습니다.</p>
          <p className="text-gray-600">
            잠시 후 다시 시도해주시거나, 담당자에게 문의해주세요.
          </p>
          <button
            onClick={() => setSubmitStatus("idle")}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            다시 시도
          </button>
        </motion.div>
      );
    }

    return renderAnswers();
  };

  const renderAnswers = () => {
    if (step === 5) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full text-center flex flex-col gap-4 justify-center items-center p-8"
        >
          <h3 className="text-2xl font-semibold mb-4">테스트 완료!</h3>
          <p className="text-lg mb-2">모든 질문에 답변해 주셔서 감사합니다.</p>
          <p className="text-lg mb-6">
            우측의{" "}
            <span className="font-semibold text-orange-600">제출하기</span>{" "}
            버튼을 클릭해주세요.
          </p>
          <div className="text-sm text-gray-600">
            제출 후에는 답변을 수정할 수 없으니 신중히 검토해 주세요.
          </div>
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
        {verbTestData.map(el => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(el, getWordForCurrentStep(el))}
            key={el.sort}
            className={`
              py-3 px-6 rounded-lg font-medium transition-all duration-200
              ${
                isWordSelected(el)
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-orange-50"
              }
            `}
          >
            {getWordForCurrentStep(el)}
          </motion.button>
        ))}
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm border border-gray-100 lg:sticky lg:top-32 flex flex-col h-auto">
        <div className="p-6 space-y-6 flex-1">
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
                <RefreshCw size={18} />
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
                  단계 {Math.floor(step)} / 5
                </span>
                <span className="text-gray-600 font-medium">
                  {Math.round(getCurrentProgress())}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {verbQuestions.map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg flex items-center justify-between max-h-[52px]"
              >
                <p className="text-sm font-medium text-gray-700">
                  {getStepLabel(index)}
                </p>
                <div className="flex gap-2">
                  {getSelectedWordsForStep(index).map((word, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded-full ${
                        idx === 0
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {word || "미선택"}
                    </span>
                  ))}
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
                step === 5
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
            onClick={() => step === 5 && handleSubmit()}
            disabled={step !== 5}
          >
            <Send size={18} />
            {isSubmitting ? "제출 중..." : "제출하기"}
          </motion.button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (selectedAnswers.length > 0 && submitStatus !== "success") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [selectedAnswers, submitStatus]);

  return (
    <div className="bg-[#F7F7F9] min-h-screen py-12 px-4 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col lg:flex-row gap-8 justify-center">
      <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
          {renderQuestion()}
        </div>
        {renderSubmitFeedback()}
      </div>
      {renderSidebar()}
    </div>
  );
};
