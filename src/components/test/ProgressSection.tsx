"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressSectionProps {
  getCurrentProgress: () => number;
  canProceed: boolean;
  handleNextCategory: () => void;
  handleNextHalf: () => void;
  handleSkip: () => void;
  currentCategoryIndex: number;
  totalCategories: number;
  isFirstHalfCompleted: boolean;
}

export const ProgressSection = ({
  getCurrentProgress,
  canProceed,
  handleNextCategory,
  handleNextHalf,
  handleSkip,
  currentCategoryIndex,
  totalCategories,
  isFirstHalfCompleted,
}: ProgressSectionProps) => {
  const progress = getCurrentProgress();

  return (
    <div className="w-full lg:w-1/4 bg-gray-50 p-4 sm:p-8 mt-8 lg:mt-0 rounded-lg shadow-xl lg:sticky lg:top-32 lg:h-fit">
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">진행 상황</h3>
        <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
          <motion.div
            className="bg-blue-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-right mt-2 text-sm font-medium text-gray-600">
          {Math.round(progress)}% 완료
        </p>
        <p className="text-right text-sm text-gray-500">
          (전체 진행도: {currentCategoryIndex} / {totalCategories})
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 sm:py-4 rounded-lg text-white font-bold mb-4 transition-colors ${
          getCurrentProgress() === 100
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
        onClick={isFirstHalfCompleted ? handleNextCategory : handleNextHalf}
        disabled={getCurrentProgress() !== 100}
      >
        {isFirstHalfCompleted
          ? currentCategoryIndex < totalCategories - 1
            ? "다음 유형으로"
            : "설문 완료"
          : "다음 문항으로"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-3 sm:py-4 rounded-lg text-white font-bold bg-blue-500 hover:bg-blue-600 transition-colors"
        onClick={handleSkip}
      >
        스킵하기
      </motion.button>
    </div>
  );
};
