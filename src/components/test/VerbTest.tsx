"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { testArr } from "@/constant/test";

// 색상 매핑을 정의합니다.
const colorMap: { [key: string]: string } = {
  "기준 윤리형": "#FF6B6B",
  "기준 심미형": "#4ECDC4",
  "예술 느낌형": "#45B7D1",
  "예술 융합형": "#FFA07A",
  "이해 관리형": "#97CC04",
  "이해 연구형": "#F18701",
  "소통 도움형": "#c471ed",
  "소통 조화형": "#7F7FD5",
  "도전 확장형": "#86A8E7",
  "도전 목표형": "#91EAE4",
};

interface VerbTestProps {
  prevScores: { sort: string; score: number; maxScore: number; color?: any }[];
}

export const VerbTest = ({ prevScores }: VerbTestProps) => {
  const [step, setStep] = useState(1);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [scores, setScores] = useState(
    prevScores.map(score => ({
      ...score,
      color: colorMap[score.sort] || "#ffffff", // 기본 색상 추가
    }))
  );
  const [result, setResult] = useState("");

  useEffect(() => {
    if (step === 2 && selectedWords.length === 2) {
      const selectedCategories = selectedWords.map(word =>
        testArr.find(item => Object.values(item.words).flat().includes(word))
      );

      const allWords = selectedCategories
        .filter(category => category !== undefined)
        .flatMap(category => Object.values(category!.words).flat());

      const filteredWords = allWords.filter(
        word => !selectedWords.includes(word)
      );

      setWords(filteredWords);
    }
  }, [step, selectedWords]);

  const handleWordSelect = (word: string) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords(prev => [...prev, word]);

      const selectedCategory = testArr.find(item =>
        Object.values(item.words).flat().includes(word)
      );

      if (selectedCategory) {
        const selectedType = selectedCategory.sort;

        setScores(prev =>
          prev.map(score =>
            score.sort === selectedType
              ? { ...score, score: score.score + 5 }
              : score
          )
        );

        if (step === 1 && selectedWords.length + 1 === 2) {
          setStep(2);
        } else if (step === 2 && selectedWords.length + 1 === 6) {
          calculateResult();
        }
      }
    }
  };

  const calculateResult = () => {
    const topScore = Math.max(...scores.map(s => s.score));
    const topScoreEntry = scores.find(s => s.score === topScore);

    if (topScoreEntry) {
      const result = topScoreEntry.sort;

      setResult(result);
    } else {
      // Optional: handle the case where no result is found

      setResult("");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col items-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              당신의 결과
            </h2>
            <div
              className="text-2xl font-semibold mb-8 p-4 rounded-lg"
              style={{
                backgroundColor:
                  scores.find(s => s.sort === result)?.color || "transparent",
              }}
            >
              {result}
            </div>
            <div className="space-y-4">
              {scores.map(score => (
                <div key={score.sort} className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span
                        className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full"
                        style={{ backgroundColor: score.color }}
                      >
                        {score.sort}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block">
                        {score.score}/{score.maxScore}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(score.score / score.maxScore) * 100}%`,
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                      style={{ backgroundColor: score.color }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <h2 className="text-heading2 font-bold mb-6">
              {step === 1
                ? "첫 번째 단계: 두 개의 단어를 선택하세요"
                : "두 번째 단계: 네 개의 단어를 더 선택하세요"}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(step === 1 ? testArr.map(el => el.words.start) : words).map(
                word => (
                  <button
                    key={word}
                    className={`py-3 px-6 rounded-lg shadow-md hover:scale-105 transition duration-300 font-bold ${
                      selectedWords.includes(word)
                        ? "bg-gradient-to-r from-green-500 to-teal-500 text-white"
                        : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                    }`}
                    onClick={() => handleWordSelect(word)}
                    disabled={selectedWords.length >= (step === 1 ? 2 : 6)}
                  >
                    {word}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
