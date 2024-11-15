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
  const getScoreLabel = (score: number) => {
    switch (score) {
      case 1:
        return "매우 그렇지 않다";
      case 2:
        return "그렇지 않다";
      case 3:
        return "보통이다";
      case 4:
        return "그렇다";
      case 5:
        return "매우 그렇다";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold transition-colors
          ${
            isSelected
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }
        `}
      >
        {score}
      </motion.button>
      <span className="text-xs text-gray-500 text-center whitespace-nowrap">
        {getScoreLabel(score)}
      </span>
    </div>
  );
};
