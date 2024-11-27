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
    "매우 그렇지 않다",
    "그렇지 않다",
    "보통이다",
    "그렇다",
    "매우 그렇다",
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        aria-label={answerLabels[score - 1]}
        className={`
          w-full py-3 rounded-lg font-medium transition-all duration-200
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
      <span className="text-xs text-gray-500 text-center">
        {answerLabels[score - 1]}
      </span>
    </div>
  );
};
