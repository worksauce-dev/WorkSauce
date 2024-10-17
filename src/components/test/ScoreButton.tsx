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
  const scoreExplanation = () => {
    if (score === 1) {
      return "매우 그렇지않다";
    }
    if (score === 2) {
      return "그렇지않다";
    }
    if (score === 3) {
      return "보통이다";
    }
    if (score === 4) {
      return "그렇다";
    }
    if (score === 5) {
      return "매우 그렇다";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-4 min-w-[64px]"
    >
      <motion.button
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold text-sm sm:text-base transition-colors ${
          isSelected
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
        onClick={onClick}
      >
        {score}
      </motion.button>
      <span className="text-xs sm:text-sm text-primary-gray">
        {scoreExplanation()}
      </span>
    </motion.div>
  );
};
