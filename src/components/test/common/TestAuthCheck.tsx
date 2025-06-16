"use client";

import { useState } from "react";
// import { SauceTestContainer } from "../saucetest/SauceTestContainer";
import { SugarTestContainer } from "../sugartest/SugarTestContainer";
import { SugarTest } from "@/types/sugartest/test";
import { SugarTestResult } from "@/types/sugartest/sugarTestResult";
import SugarTestCompletionResult from "../sugartest/result/SugarTestCompletionResult";
import { TestInfo } from "@/types/user";
import { SauceTestContainer } from "../saucetestV2/SauceTestContainer";
import { SauceTestV2, SauceTestResult } from "@/types/saucetestV2Type";
import { IoCheckmarkCircle } from "react-icons/io5";
import { motion } from "framer-motion";

interface TestAuthCheckProps {
  dashboardId: string;
  targetTest: TestInfo;
  testType: "saucetest" | "sugartest";
  testData: SauceTestV2 | SugarTest;
  isAdmin: boolean;
  submitTest: (
    dashboardId: string,
    testId: string,
    email: string,
    name: string,
    testResult: SugarTestResult | SauceTestResult
  ) => Promise<{ success: boolean }>;
}

export function TestAuthCheck({
  dashboardId,
  targetTest,
  testType,
  testData,
  submitTest,
  isAdmin,
}: TestAuthCheckProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [completedTestResult, setCompletedTestResult] = useState<
    SugarTestResult | SauceTestResult | null
  >(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name === "test" && email === "test") {
      setIsAuthorized(true);
      return;
    }

    const applicant = targetTest.applicants.find(
      a => a.email === email && a.name === name
    );

    if (applicant) {
      if (
        applicant.testStatus === "completed" &&
        ((testType === "sugartest" && applicant.testResult) ||
          (testType === "saucetest" && applicant.testResult))
      ) {
        // 테스트가 이미 완료된 경우 결과 데이터 설정
        setCompletedTestResult(
          applicant.testResult as SugarTestResult | SauceTestResult
        );
      }
      setIsAuthorized(true);
    } else {
      setError("입력하신 정보와 일치하는 지원자를 찾을 수 없습니다.");
    }
  };

  // 이미 완료된 슈가 테스트 결과 표시
  if (isAuthorized && testType === "sugartest" && completedTestResult) {
    return (
      <SugarTestCompletionResult
        name={name}
        testResult={completedTestResult as SugarTestResult}
      />
    );
  }

  if (isAuthorized && testType === "saucetest" && completedTestResult) {
    return (
      <div className="min-h-screen bg-[#F7F7F9] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center space-y-6 shadow-sm border border-gray-100"
        >
          <div className="flex justify-center">
            <IoCheckmarkCircle className="text-green-500" size={64} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">이미 제출 완료</h3>
            <p className="text-gray-600">
              {name}님의 소스테스트가 이미 제출되었습니다.
              <br />
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
          >
            홈으로 이동
          </button>
        </motion.div>
      </div>
    );
  }

  if (isAuthorized) {
    switch (testType) {
      case "saucetest":
        return (
          <SauceTestContainer
            name={name}
            email={email}
            dashboardId={dashboardId}
            testId={targetTest.testId}
            testData={testData as SauceTestV2}
            submitTest={submitTest}
          />
        );

      case "sugartest":
        return (
          <SugarTestContainer
            name={name}
            email={email}
            dashboardId={dashboardId}
            testId={targetTest.testId}
            testData={testData as SugarTest}
            submitTest={submitTest}
            isAdmin={isAdmin}
          />
        );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F7F7F9] border-b-2 border-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          응시자 확인
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-accent text-white py-3 rounded-md font-medium hover:bg-primary-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            확인
          </button>
        </form>
        {error && (
          <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
