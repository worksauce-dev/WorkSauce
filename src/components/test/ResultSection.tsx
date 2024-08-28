"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScoreType } from "@/types/test";

interface ResultSection {
  scores: ScoreType[];
}

export const ResultSection = ({ scores }: ResultSection) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">중간 결과</h1>
      {scores.map((score, index) => (
        <motion.div
          key={score.sort}
          className="mb-6 p-6 rounded-lg shadow-lg bg-blue-100"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <h2 className="text-xl font-bold mb-2">{score.sort}</h2>
          <div className="flex items-center">
            <div className="flex-grow bg-gray-200 h-4 rounded-full mr-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${(score.score / score.maxScore) * 100}%` }}
              ></div>
            </div>
            <span className="font-bold">
              {score.score} / {score.maxScore}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
