"use client";

import { SugarTest } from "@/types/sugartest/test";

interface DevOnlyButtonProps {
  saveSugartest: (testData: SugarTest) => Promise<{
    success: boolean;
    error?: unknown;
  }>;
}

const DevOnlyButton = ({ saveSugartest }: DevOnlyButtonProps) => {
  return (
    <button
      className="bg-orange-500 text-white px-4 py-2 rounded-md"
      // onClick={() => saveSugartest(testData)}
    >
      개발자 전용 버튼
    </button>
  );
};

export default DevOnlyButton;
