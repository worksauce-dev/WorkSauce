"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { testArr, typeDescriptions, verbQuestions } from "@/constant/test";
import { RefreshCw } from "lucide-react";

interface VerbTestProps {
  prevScores: {
    sort: string;
    score: number;
    maxScore: number;
    color?: string;
  }[];
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

export const VerbTest = ({ prevScores }: VerbTestProps) => {
  const [step, setStep] = useState(0);
  const [nameArr, setNameArr] = useState<string[]>([]);
  const [scores, setScores] = useState(prevScores);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const renderQustion = () => {
    if (step === 0 || step === 0.5) {
      return "Q. " + verbQuestions[0];
    }

    if (step === 1 || step === 1.5) {
      return "Q. " + verbQuestions[1];
    }

    if (step === 2 || step === 2.5) {
      return "Q. " + verbQuestions[2];
    }

    if (step === 3 || step === 3.5) {
      return "Q. " + verbQuestions[3];
    }
    if (step === 4 || step === 4.5) {
      return "Q. " + verbQuestions[4];
    }
  };

  const handleSelect = (target: TestItem, word: string) => {
    if (step === 0 || step === 0.5) {
      if (selectedAnswers.includes(target.start)) {
        const copyAnswers = [...selectedAnswers];
        copyAnswers.pop();
        setSelectedAnswers(copyAnswers);

        const copyName = [...nameArr];
        copyName.pop();
        setNameArr(copyName);

        setStep(prev => (prev -= 0.5));
        setScores(prev =>
          prev.map(score =>
            score.sort === target.sort
              ? { ...score, score: score.score - 3 }
              : score
          )
        );
      } else {
        setNameArr(prev => [...prev, target.name]);
        setSelectedAnswers(prev => [...prev, target.start]);
        setStep(prev => (prev += 0.5));
        setScores(prev =>
          prev.map(score =>
            score.sort === target.sort
              ? { ...score, score: score.score + 3 }
              : score
          )
        );
      }
    } else {
      if (selectedAnswers.includes(word)) {
        const copyAnswers = [...selectedAnswers];
        copyAnswers.pop();
        setSelectedAnswers(copyAnswers);

        const copyName = [...nameArr];
        copyName.pop();
        setNameArr(copyName);

        setStep(prev => (prev -= 0.5));
        setScores(prev =>
          prev.map(score =>
            score.sort === target.sort
              ? { ...score, score: score.score - 3 }
              : score
          )
        );
      } else {
        setNameArr(prev => [...prev, target.name]);
        setSelectedAnswers(prev => [...prev, word]);
        setStep(prev => (prev += 0.5));
        setScores(prev =>
          prev.map(score =>
            score.sort === target.sort
              ? { ...score, score: score.score + 3 }
              : score
          )
        );
      }
    }
    // if (step === 1 || step === 1.5) {

    // }
    // if (step === 2 || step === 2.5) {
    //   if (selectedAnswers.includes(word)) {
    //     const copyAnswers = [...selectedAnswers];
    //     copyAnswers.pop();
    //     setSelectedAnswers(copyAnswers);

    //     const copyName = [...nameArr];
    //     copyName.pop();
    //     setNameArr(copyName);

    //     setStep(prev => (prev -= 0.5));
    //     setScores(prev =>
    //       prev.map(score =>
    //         score.sort === target.sort
    //           ? { ...score, score: score.score - 3 }
    //           : score
    //       )
    //     );
    //   } else {
    //     setNameArr(prev => [...prev, target.name]);
    //     setSelectedAnswers(prev => [...prev, word]);
    //     setStep(prev => (prev += 0.5));
    //     setScores(prev =>
    //       prev.map(score =>
    //         score.sort === target.sort
    //           ? { ...score, score: score.score + 3 }
    //           : score
    //       )
    //     );
    //   }
    // }
    // if (step === 3 || step === 3.5) {
    //   if (selectedAnswers.includes(word)) {
    //     const copyAnswers = [...selectedAnswers];
    //     copyAnswers.pop();
    //     setSelectedAnswers(copyAnswers);

    //     const copyName = [...nameArr];
    //     copyName.pop();
    //     setNameArr(copyName);

    //     setStep(prev => (prev -= 0.5));
    //     setScores(prev =>
    //       prev.map(score =>
    //         score.sort === target.sort
    //           ? { ...score, score: score.score - 3 }
    //           : score
    //       )
    //     );
    //   } else {
    //     setNameArr(prev => [...prev, target.name]);
    //     setSelectedAnswers(prev => [...prev, word]);
    //     setStep(prev => (prev += 0.5));
    //     setScores(prev =>
    //       prev.map(score =>
    //         score.sort === target.sort
    //           ? { ...score, score: score.score + 3 }
    //           : score
    //       )
    //     );
    //   }
    // }
    // if (step === 4 || step === 4.5) {
    //   if (selectedAnswers.includes(word)) {
    //     const copyAnswers = [...selectedAnswers];
    //     copyAnswers.pop();
    //     setSelectedAnswers(copyAnswers);

    //     const copyName = [...nameArr];
    //     copyName.pop();
    //     setNameArr(copyName);

    //     setStep(prev => (prev -= 0.5));
    //     setScores(prev =>
    //       prev.map(score =>
    //         score.sort === target.sort
    //           ? { ...score, score: score.score - 3 }
    //           : score
    //       )
    //     );
    //   } else {
    //     setNameArr(prev => [...prev, target.name]);
    //     setSelectedAnswers(prev => [...prev, word]);
    //     setStep(prev => (prev += 0.5));
    //     setScores(prev =>
    //       prev.map(score =>
    //         score.sort === target.sort
    //           ? { ...score, score: score.score + 3 }
    //           : score
    //       )
    //     );
    //   }
    // }
  };

  const renderAnswers = () => {
    if (step === 0 || step === 0.5) {
      return (
        <>
          {testArr.map(el => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(el, el.start)}
              key={el.sort}
              className={`py-3 px-6 rounded-lg border border-gray-300 shadow-sm hover:shadow-md bg-white text-gray-800 font-medium transition-colors duration-200
                ${
                  selectedAnswers.includes(el.start || "")
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
      const arr1 = testArr.filter(el => el.name === nameArr[0]);
      const arr2 = testArr.filter(el => el.name === nameArr[1]);

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
      const arr1 = testArr.filter(el => el.name === nameArr[0]);
      const arr2 = testArr.filter(el => el.name === nameArr[1]);

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
      const arr1 = testArr.filter(el => el.name === nameArr[0]);
      const arr2 = testArr.filter(el => el.name === nameArr[1]);

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
      const arr1 = testArr.filter(el => el.name === nameArr[0]);
      const arr2 = testArr.filter(el => el.name === nameArr[1]);

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
  };

  const getCurrentProgress = () => {
    return (step / 5) * 100;
  };

  const renderSidebar = () => {
    return (
      <div className="w-full lg:w-1/4 sm:p-8 bg-white p-6 rounded-xl shadow-lg flex flex-col">
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
      </div>
    );
  };

  const getTopScore = () => {
    return scores.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );
  };

  const getTypeDescription = (sort: string) => {
    return (
      typeDescriptions[sort.replace(/\s/g, "")] || "설명이 제공되지 않았습니다."
    );
  };

  const renderResult = () => {
    return (
      <div className="max-w-7xl">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Your Results
        </h3>
        <div className="space-y-6">
          {scores
            .sort((a, b) => b.score - a.score)
            .map((score, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className={`p-4 rounded-lg ${
                  score.sort === getTopScore().sort
                    ? "bg-indigo-100 border-2 border-indigo-500"
                    : "bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-700">{score.sort}</div>
                  <div className="font-bold text-indigo-600">
                    {score.score} / {score.maxScore}
                  </div>
                </div>
                {score.sort === getTopScore().sort && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 text-sm text-gray-600"
                  >
                    <p className="font-semibold mb-1">당신의 주요 유형:</p>
                    <p>{getTypeDescription(score.sort)}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
        </div>
      </div>
    );
  };

  const clickReset = () => {
    setStep(0);
    setNameArr([]);
    setScores(prevScores);
    setSelectedAnswers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col lg:flex-row gap-8 justify-center mt-16 sm:mt-0">
      {step === 5 ? (
        renderResult()
      ) : (
        <>
          <div className="max-w-5xl lg:w-3/4 bg-white rounded-lg shadow-xl flex flex-col">
            <div className="bg-indigo-600 text-white p-6 rounded-t-lg">
              <h2 className="text-subheading font-semibold">
                {renderQustion()}
              </h2>
            </div>

            <div className="flex flex-col gap-8 p-8 flex-grow">
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 gap-8 ${
                  step >= 1 ? "md:grid-cols-4" : "md:grid-cols-5"
                }`}
              >
                {renderAnswers()}
              </div>
            </div>

            <div className="text-end w-full p-8">
              <span className="text-sm text-primary-gray">
                테스트 무단 배포시 블라블라블라블라
              </span>
            </div>
          </div>

          {renderSidebar()}
        </>
      )}
    </div>
  );
};
