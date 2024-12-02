"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScoreButtonProps {
  score: number;
  isSelected: boolean;
  onClick: () => void;
}

export const ScoreButton = ({
  score,
  isSelected,
  onClick,
}: ScoreButtonProps) => {
  const answerLabels = [
    "매우 아니다",
    "아니다",
    "보통",
    "그렇다",
    "매우 그렇다",
  ];

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 min-w-[3.2rem] sm:min-w-[4.5rem] md:min-w-[5.5rem]">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        aria-label={answerLabels[score - 1]}
        className={`
          w-full min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem] 
          px-1 sm:px-2 md:px-3 py-1 sm:py-2 md:py-3 rounded-lg 
          font-medium transition-all duration-200
          text-xs sm:text-sm md:text-base
          flex items-center justify-center
          ${
            isSelected
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-orange-50"
          }
        `}
      >
        {score}
      </motion.button>
      <span className="text-[10px] md:text-xs text-gray-500 text-center whitespace-nowrap">
        {answerLabels[score - 1]}
      </span>
    </div>
  );
};
