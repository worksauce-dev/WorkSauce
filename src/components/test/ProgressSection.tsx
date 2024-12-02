"use client";

import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/types/test";

interface ProgressSectionProps {
  progress: Progress;
  handleNextHalf: () => void;
  handleSkip: () => void;
  canProceedToNext: boolean;
  isAdmin: boolean;
}

export const ProgressSection = ({
  progress,
  handleNextHalf,
  handleSkip,
  canProceedToNext,
  isAdmin,
}: ProgressSectionProps) => {
  // 다음 문항으로 이동하는 핸들러
  const handleNextWithScroll = () => {
    handleNextHalf();
    // 상태 업데이트 후 스크롤이 실행되도록 setTimeout 사용
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  };

  // 스킵 핸들러
  const handleSkipWithScroll = () => {
    handleSkip();
    // 스킵할 때도 스크롤 최상단으로 이동
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="h-fit w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:sticky lg:top-32 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">진행 상황</h3>
        <div className="space-y-2">
          <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.sectionProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">
              섹션 {progress.categoryInfo.current} /{" "}
              {progress.categoryInfo.total}
            </span>
            <span className="text-gray-600 font-medium">
              {progress.sectionProgress}%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center gap-2
            ${
              canProceedToNext
                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          onClick={handleNextWithScroll}
          disabled={!canProceedToNext}
        >
          {progress.categoryInfo.current < progress.categoryInfo.total
            ? "다음으로"
            : "설문 완료"}
        </motion.button>

        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-all duration-200"
            onClick={handleSkipWithScroll}
          >
            스킵하기
          </motion.button>
        )}
      </div>
    </div>
  );
};
