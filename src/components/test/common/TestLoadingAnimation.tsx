"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TestLoadingAnimationProps {
  name: string;
}

const loadingMessages = [
  "테스트 결과를 제출하고 있습니다...",
  "테스트 결과를 분석 중입니다...",
  "스트레스 지수를 계산하고 있습니다...",
  "거의 완료되었습니다...",
];

const TestLoadingAnimation = ({ name }: TestLoadingAnimationProps) => {
  const [messageIndex, setMessageIndex] = useState(0);

  // 메시지를 주기적으로 변경
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      {/* 상단 정보 카드 */}
      <div className="w-full max-w-md flex-shrink-0 flex flex-col gap-3 rounded-lg p-4 shadow-sm border border-gray-100 bg-white mb-8">
        <h1 className="text-lg font-semibold text-gray-900 text-center">
          {name}
          <span className="text-gray-400 ml-1">님의 테스트 결과 준비 중</span>
        </h1>
      </div>

      {/* 로딩 애니메이션 */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-8">
          {/* 원형 프로그레스 */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <motion.circle
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              strokeWidth="4"
              stroke="#FF9500"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              strokeLinecap="round"
              className="drop-shadow-md"
            />
          </svg>

          {/* 중앙 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            📊
          </div>
        </div>

        {/* 로딩 메시지 */}
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-lg font-medium text-gray-800 mb-2">
            {loadingMessages[messageIndex]}
          </p>
          <p className="text-sm text-gray-600">
            잠시만 기다려주세요. 결과가 곧 준비됩니다.
          </p>
        </motion.div>

        {/* 로딩 바 */}
        <div className="w-64 h-1.5 bg-gray-100 rounded-full mt-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 10, // 전체 로딩 시간 (초 단위)
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TestLoadingAnimation;
