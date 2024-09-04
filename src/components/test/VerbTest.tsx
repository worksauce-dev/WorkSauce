"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testArr, typeDescriptions, verbQuestions } from "@/constant/test";

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
  start?: string;
  advance?: string[];
  utility?: string[];
  communicate?: string[];
  expert?: string[];
  name: string;
}

export const VerbTest = ({ prevScores }: VerbTestProps) => {
  const [step, setStep] = useState(1);
  const [select, setSelect] = useState<string[]>([]);
  const [scores, setScores] = useState(prevScores);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  useEffect(() => {
    if ([2, 4, 6, 8, 10].includes(select.length)) {
      setStep(prevStep => prevStep + 1);
      setSelectedAnswers([]);
    }
  }, [select]);

  const getQuestion = () => verbQuestions[step - 1];

  const getAnswers = (type: keyof TestItem) => {
    const arr1 = testArr.filter(el => el.name === select[0]);
    const arr2 = testArr.filter(el => el.name === select[1]);

    if (select[0] === select[1]) {
      return (
        <>
          {arr1.flatMap(el =>
            el[type]?.map(word => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(el, word)}
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
        {arr1.flatMap(el =>
          el[type]?.map(word => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(el, word)}
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
        {arr2.flatMap(el =>
          el[type]?.map(word => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(el, word)}
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
  };

  const handleSelect = (el: TestItem, word: string) => {
    console.log(el, word);

    if (selectedAnswers.includes(word)) {
      setSelectedAnswers(prev => prev.filter(item => item !== word));
      setSelect(prev => {
        const updatedSelect = [...prev]; // 이전 상태의 복사본 생성
        updatedSelect.pop(); // 마지막 요소 제거
        return updatedSelect; // 새로운 상태로 반환
      });
      setScores(prev =>
        prev.map(score =>
          score.sort === el.sort ? { ...score, score: score.score - 3 } : score
        )
      );
    } else if (selectedAnswers.length < 2) {
      setSelectedAnswers(prev => [...prev, word]);
      setSelect(prev => [...prev, el.name]);
      setScores(prev =>
        prev.map(score =>
          score.sort === el.sort ? { ...score, score: score.score + 3 } : score
        )
      );
    }
  };

  const renderAnswers = () => {
    if (step === 1) {
      return (
        <>
          {testArr.map(el => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(el, el.start || "")}
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

    if (select.length < 2) return null;

    const answerTypes: { [key: number]: keyof TestItem } = {
      2: "advance",
      3: "utility",
      4: "communicate",
      5: "expert",
    };

    return getAnswers(answerTypes[step]);
  };

  const isFinalStep = step === 6;

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

  console.log(step);
  console.log(scores);
  console.log(select);
  console.log(selectedAnswers);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col items-center bg-gradient-to-b from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-indigo-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">{select.length} / 10</h1>
          <div className="w-full bg-indigo-300 h-2 rounded-full">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step - 1) * 20}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`flex flex-col gap-8 ${isFinalStep ? "hidden" : ""}`}
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  {getQuestion()}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {renderAnswers()}
                </div>
              </div>
              {isFinalStep && (
                <div>
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
                            <div className="font-medium text-gray-700">
                              {score.sort}
                            </div>
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
                              <p className="font-semibold mb-1">
                                당신의 주요 유형:
                              </p>
                              <p>{getTypeDescription(score.sort)}</p>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
