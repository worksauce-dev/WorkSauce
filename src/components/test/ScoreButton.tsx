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
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-10 h-10 rounded-full font-semibold text-sm sm:text-base transition-colors ${
        isSelected
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
      onClick={onClick}
    >
      {score}
    </motion.button>
  );
};
