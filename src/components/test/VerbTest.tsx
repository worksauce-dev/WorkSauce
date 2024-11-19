"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { verbQuestions } from "@/constant/test";
import { RefreshCw, Send } from "lucide-react";
import { ScoreType, VerbType } from "@/types/test";

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
}: VerbTestProps) => {
  const [step, setStep] = useState(0);
  const [nameArr, setNameArr] = useState<string[]>([]);
  const [scores, setScores] = useState(prevScores);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const SCORE_WEIGHTS = {
    start: 100, // 시작 동사 (2개 선택)
    advance: 150, // 발전된 동사 (2개 선택)
    utility: 200, // 실용적 동사 (2개 선택)
    communicate: 250, // 소통 동사 (2개 선택)
    expert: 300, // 전문적 동사 (2개 선택)
  };

  // step에 따른 타입 반환 함수
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

  const renderQustion = () => {
    if (step === 0 || step === 0.5) {
      return "Q. " + verbQuestions[0] + " (2개를 선택해주세요.)";
    }

    if (step === 1 || step === 1.5) {
      return "Q. " + verbQuestions[1] + " (2개를 선택해주세요.)";
    }

    if (step === 2 || step === 2.5) {
      return "Q. " + verbQuestions[2] + " (2개를 선택해주세요.)";
    }

    if (step === 3 || step === 3.5) {
      return "Q. " + verbQuestions[3] + " (2개를 선택해주세요.)";
    }
    if (step === 4 || step === 4.5) {
      return "Q. " + verbQuestions[4] + " (2개를 선택해주세요.)";
    }
  };

  const handleSelect = (target: TestItem, word: string) => {
    const isSelected = selectedAnswers.includes(word);
    const stepType = getStepType(step);
    const currentStepAnswers = selectedAnswers.filter(
      (_, index) => Math.floor(index / 2) === Math.floor(step)
    );

    // 이미 2개 선택했고, 새로운 선택을 시도할 경우 중단
    if (!isSelected && currentStepAnswers.length >= 2) {
      return;
    }

    const scoreChange = isSelected
      ? -SCORE_WEIGHTS[stepType]
      : SCORE_WEIGHTS[stepType];

    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      if (isSelected) {
        newAnswers.pop();
      } else {
        newAnswers.push(word);
      }
      return newAnswers;
    });

    setNameArr(prev => {
      const newNames = [...prev];
      if (isSelected) {
        newNames.pop();
      } else {
        newNames.push(target.name);
      }
      return newNames;
    });

    setStep(prev => prev + 0.5);
    setScores(prev =>
      prev.map(score =>
        score.sort === target.sort
          ? { ...score, score: score.score + scoreChange }
          : score
      )
    );
  };

  const renderAnswers = () => {
    if (step === 0 || step === 0.5) {
      return (
        <>
          {verbTestData.map(el => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(el, el.start)}
              key={el.sort}
              className={`py-3 px-6 rounded-lg border border-gray-300 shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(el.start)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
            >
              {el.start}
            </motion.button>
          ))}
        </>
      );
    }
    if (step === 1 || step === 1.5) {
      const arr1 = verbTestData.filter(el => el.name === nameArr[0]);
      const arr2 = verbTestData.filter(el => el.name === nameArr[1]);

      if (nameArr[0] === nameArr[1]) {
        return (
          <>
            {arr1.map(words =>
              words.advance.map(word => (
                <motion.button
                  onClick={() => handleSelect(words, word)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={word}
                  className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
                >
                  {word}
                </motion.button>
              ))
            )}
          </>
        );
      }

      return (
        <>
          {arr1.map(words =>
            words.advance.map(word => (
              <motion.button
                onClick={() => handleSelect(words, word)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={word}
                className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
              >
                {word}
              </motion.button>
            ))
          )}
          {arr2.map(words =>
            words.advance.map(word => (
              <motion.button
                onClick={() => handleSelect(words, word)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={word}
                className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
              >
                {word}
              </motion.button>
            ))
          )}
        </>
      );
    }
    if (step === 2 || step === 2.5) {
      const arr1 = verbTestData.filter(el => el.name === nameArr[0]);
      const arr2 = verbTestData.filter(el => el.name === nameArr[1]);

      if (nameArr[0] === nameArr[1]) {
        return (
          <>
            {arr1.map(words =>
              words.utility.map(word => (
                <motion.button
                  onClick={() => handleSelect(words, word)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={word}
                  className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
                >
                  {word}
                </motion.button>
              ))
            )}
          </>
        );
      }

      return (
        <>
          {arr1.map(words =>
            words.utility.map(word => (
              <motion.button
                onClick={() => handleSelect(words, word)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={word}
                className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
              >
                {word}
              </motion.button>
            ))
          )}
          {arr2.map(words =>
            words.utility.map(word => (
              <motion.button
                onClick={() => handleSelect(words, word)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={word}
                className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
              >
                {word}
              </motion.button>
            ))
          )}
        </>
      );
    }
    if (step === 3 || step === 3.5) {
      const arr1 = verbTestData.filter(el => el.name === nameArr[0]);
      const arr2 = verbTestData.filter(el => el.name === nameArr[1]);

      if (nameArr[0] === nameArr[1]) {
        return (
          <>
            {arr1.map(words =>
              words.communicate.map(word => (
                <motion.button
                  onClick={() => handleSelect(words, word)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={word}
                  className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
                >
                  {word}
                </motion.button>
              ))
            )}
          </>
        );
      }

      return (
        <>
          {arr1.map(words =>
            words.communicate.map(word => (
              <motion.button
                onClick={() => handleSelect(words, word)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={word}
                className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
              >
                {word}
              </motion.button>
            ))
          )}
          {arr2.map(words =>
            words.communicate.map(word => (
              <motion.button
                onClick={() => handleSelect(words, word)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={word}
                className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
              >
                {word}
              </motion.button>
            ))
          )}
        </>
      );
    }
    if (step === 4 || step === 4.5) {
      const arr1 = verbTestData.filter(el => el.name === nameArr[0]);
      const arr2 = verbTestData.filter(el => el.name === nameArr[1]);

      if (nameArr[0] === nameArr[1]) {
        return (
          <>
            {arr1.map(words =>
              words.expert.map(word => (
                <motion.button
                  onClick={() => handleSelect(words, word)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={word}
                  className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
                >
                  {word}
                </motion.button>
              ))
            )}
          </>
        );
      }

      return (
        <>
          {arr1.map(words =>
            words.expert.map(word => (
              <motion.button
                onClick={() => handleSelect(words, word)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={word}
                className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
              >
                {word}
              </motion.button>
            ))
          )}
          {arr2.map(words =>
            words.expert.map(word => (
              <motion.button
                onClick={() => handleSelect(words, word)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={word}
                className={`border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(word)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : ""
                }`}
              >
                {word}
              </motion.button>
            ))
          )}
        </>
      );
    }

    if (step === 5) {
      return (
        <div className="col-span-full text-center flex flex-col gap-4 justify-center items-center">
          <h3 className="text-2xl font-semibold mb-4">테스트 완료!</h3>
          <p className="text-lg mb-2">모든 질문에 답변해 주셔서 감사합니다.</p>
          <p className="text-lg mb-6">
            우측 하단의{" "}
            <span className="font-semibold">&apos;제출하기&apos;</span> 버튼을
            꼭 클릭해주세요.
          </p>
          <div className="text-sm text-gray-600">
            제출 후에는 답변을 수정할 수 없으니 신중히 검토해 주세요.
          </div>
        </div>
      );
    }
  };

  const getCurrentProgress = () => {
    return (step / 5) * 100;
  };

  const renderSidebar = () => {
    return (
      <div className="w-full lg:w-1/3 sm:p-8 bg-white p-6 rounded-xl shadow-lg flex flex-col">
        <div className="flex-grow">
          <h3 className="text-xl font-bold mb-6 text-gray-800">진행 상황</h3>

          <div className="mb-4">
            <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-blue-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getCurrentProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-right mt-2 text-sm font-medium text-gray-600">
              {Math.round(getCurrentProgress())}% 완료
            </p>
          </div>

          <div className="space-y-4 mb-6 ">
            {[
              "Start 동사",
              "Advance 동사",
              "Utility 동사",
              "Communicate 동사",
              "Expert 동사",
            ].map(
              (question, index) =>
                step > index - 0.5 && (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg flex items-center justify-between h-[56px]"
                  >
                    <p className="text-sm font-semibold text-gray-700">
                      {question}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full ">
                        {selectedAnswers[index * 2]}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {selectedAnswers[index * 2 + 1]}
                      </span>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 mt-auto rounded-lg text-white font-bold bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          onClick={clickReset}
        >
          <RefreshCw size={18} />
          소스테스트 다시하기
        </motion.button>

        {
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${
              step !== 5
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } w-full py-3 mt-4 rounded-lg text-white font-bold transition-colors flex items-center justify-center gap-2`}
            onClick={() => step === 5 && handleSubmit()}
            disabled={step !== 5}
          >
            <Send size={18} />
            {isSubmitting ? "제출 중..." : "제출하기"}
          </motion.button>
        }
      </div>
    );
  };

  // const getTopScore = () => {
  //   return scores.reduce((prev, current) =>
  //     prev.score > current.score ? prev : current
  //   );
  // };

  // const getTypeDescription = (sort: string) => {
  //   return (
  //     typeDescriptions[sort.replace(/\s/g, "")] || "설명이 제공되지 않았습니다."
  //   );
  // };

  const clickReset = () => {
    setStep(0);
    setNameArr([]);
    setScores(prevScores);
    setSelectedAnswers([]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus("loading");

    try {
      submitTest(groupId, email, name, scores);
      setSubmitStatus("success");

      // 3초 후 자동으로 창 닫기
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

  const renderSubmitFeedback = () => {
    if (submitStatus === "success") {
      return (
        <div className="col-span-full text-center flex flex-col gap-4 justify-center items-center">
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
          <button
            onClick={() => window.close()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            창 닫기
          </button>
        </div>
      );
    }

    if (submitStatus === "error") {
      return (
        <div className="col-span-full text-center flex flex-col gap-4 justify-center items-center">
          <h3 className="text-2xl font-semibold text-red-600 mb-4">
            제출 실패
          </h3>
          <p className="text-lg mb-2">테스트 제출 중 문제가 발생했습니다.</p>
          <p className="text-gray-600">
            잠시 후 다시 시도해주시거나, 담당자에게 문의해주세요.
          </p>
          <button
            onClick={() => setSubmitStatus("idle")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return renderAnswers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col lg:flex-row gap-8 justify-center">
      <div className="max-w-5xl lg:w-3/4 bg-white rounded-lg shadow-xl flex flex-col">
        <div className="bg-indigo-600 text-white p-6 rounded-t-lg">
          <h2 className="text-base sm:text-lg font-semibold">
            {renderQustion()}
          </h2>
        </div>

        <div className="flex flex-col gap-8 p-8 flex-grow">
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 gap-8 ${
              step >= 1 ? "md:grid-cols-4" : "md:grid-cols-5"
            }`}
          >
            {renderSubmitFeedback()}
          </div>
        </div>

        <div className="flex justify-between items-center w-full p-8">
          <span className="text-sm text-primary-gray">
            &quot;소스테스트&quot;는 (주)워크소스의 자산으로, 캡처, 복사 등 무단
            배포 및 전송을 엄격히 금지합니다. 이를 위반할 경우 법적 책임이 따를
            수 있습니다.
          </span>
        </div>
      </div>

      {renderSidebar()}
    </div>
  );
};
